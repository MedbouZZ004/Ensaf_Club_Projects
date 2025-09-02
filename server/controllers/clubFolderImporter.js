import pool from '../db/connectDB.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Helper: allowed extensions
const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.heic']);
const VIDEO_EXT = new Set(['.mp4', '.mov', '.webm', '.mkv']);

const serverDir = path.dirname(fileURLToPath(import.meta.url));
const uploadsRoot = path.join(serverDir, '..', 'uploads');

const isImage = (filename) => IMAGE_EXT.has(path.extname(filename).toLowerCase());
const isVideo = (filename) => VIDEO_EXT.has(path.extname(filename).toLowerCase());

const sanitizeFolder = (name) => {
  if (!name) return '';
  return name.replace(/[^a-zA-Z0-9-_]/g, '_').replace(/_+/g, '_').trim();
};

// Recursively collect files under a directory, returning relative paths (from uploads root)
async function collectFilesRecursively(dir, baseDir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const results = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      const nested = await collectFilesRecursively(full, baseDir);
      results.push(...nested);
    } else if (e.isFile()) {
      // build path relative to uploads root
      const rel = path.relative(baseDir, full).split(path.sep).join('/');
      results.push(rel);
    }
  }
  return results;
}

// Check table existence in current DB
async function tableExists(conn, tableName) {
  const [rows] = await conn.query(
    `SELECT COUNT(*) AS cnt FROM information_schema.tables WHERE table_schema = ? AND table_name = ?`,
    [process.env.MYSQL_DB, tableName]
  );
  return rows[0].cnt > 0;
}

// Main controller: import a club from an existing uploads folder
export async function importClubFromFolder(req, res) {
  // Expect body to include: name, description, instagram_link, linkedin_link, folderName (optional), admin_id (optional)
  const { name, description, instagram_link, linkedin_link, folderName, admin_id } = req.body;

  if (!name && !folderName) {
    return res.status(400).json({ success: false, message: 'Provide club name or folderName' });
  }

  // decide folder
  const folder = folderName ? sanitizeFolder(folderName) : sanitizeFolder(name);
  if (!folder) return res.status(400).json({ success: false, message: 'Invalid folder name' });

  const clubFolder = path.join(uploadsRoot, folder);
  try {
    const stat = await fs.stat(clubFolder).catch(() => null);
    if (!stat || !stat.isDirectory()) {
      return res.status(404).json({ success: false, message: `Folder not found: ${folder}` });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error accessing uploads folder', error: err.message });
  }

  const connection = await pool.getConnection();
  try {
    await connection.query('START TRANSACTION');

    // Insert club (minimal fields). We'll update logo later if found.
    const insertClubSql = `INSERT INTO clubs (name, description, instagram_link, linkedin_link, creation_date) VALUES (?, ?, ?, ?, NOW())`;
    const [clubResult] = await connection.query(insertClubSql, [name || folder, description || '', instagram_link || '', linkedin_link || '']);
    const clubId = clubResult.insertId;

    // Collect all files under the club folder relative to uploads root
    const files = await collectFilesRecursively(clubFolder, uploadsRoot);

    // Candidate logo: look for a file with 'logo' in its name at top level
    let logoPath = null;
    for (const f of files) {
      const parts = f.split('/');
      if (parts.length === 1 && /logo/i.test(path.basename(f))) {
        logoPath = `uploads/${f}`;
        break;
      }
    }

    // If not found, try any file in root of club folder that is image
    if (!logoPath) {
      for (const f of files) {
        const parts = f.split('/');
        if (parts.length === 1 && isImage(f)) {
          logoPath = `uploads/${f}`;
          break;
        }
      }
    }

    const createdMedia = [];
    // Insert club_media if table exists
    if (await tableExists(connection, 'club_media')) {
      for (const f of files) {
        const ext = path.extname(f).toLowerCase();
        const relUrl = `uploads/${f}`; // consistent URL stored in DB
        if (isImage(f)) {
          await connection.query('INSERT INTO club_media (club_id, media_url, media_type) VALUES (?, ?, ?)', [clubId, relUrl, 'image']);
          createdMedia.push({ url: relUrl, type: 'image' });
        } else if (isVideo(f)) {
          await connection.query('INSERT INTO club_media (club_id, media_url, media_type) VALUES (?, ?, ?)', [clubId, relUrl, 'video']);
          createdMedia.push({ url: relUrl, type: 'video' });
        }
      }
    }

    // Handle activities: check activities folder inside club folder
    const activitiesRoot = path.join(clubFolder, 'activities');
    const createdActivities = [];
    const activitiesExist = await fs.stat(activitiesRoot).then(s => s.isDirectory()).catch(() => false);
    if (activitiesExist && await tableExists(connection, 'activities')) {
      const activityDirs = await fs.readdir(activitiesRoot, { withFileTypes: true });
      for (const ad of activityDirs) {
        if (!ad.isDirectory()) continue;
        const activityName = ad.name;
        const activityFull = path.join(activitiesRoot, ad.name);
        const actFiles = await collectFilesRecursively(activityFull, uploadsRoot);
        // pick main image as first image found
        const mainImg = actFiles.find(f => isImage(f));
        const mainImgUrl = mainImg ? `uploads/${mainImg}` : null;
        const [actResult] = await connection.query(
          'INSERT INTO activities (club_id, name, pitch, main_image, activity_date) VALUES (?, ?, ?, ?, NOW())',
          [clubId, activityName, '', mainImgUrl]
        );
        const activityId = actResult.insertId;
        // insert activity images if table exists
        if (await tableExists(connection, 'activities_images')) {
          for (const f of actFiles) {
            if (isImage(f)) {
              await connection.query('INSERT INTO activities_images (activity_id, images) VALUES (?, ?)', [activityId, `uploads/${f}`]);
            }
          }
        }
        createdActivities.push({ activityId, name: activityName, main_image: mainImgUrl, files: actFiles.map(f => `uploads/${f}`) });
      }
    }

    // Update club logo if found and if column exists
    if (logoPath) {
      await connection.query('UPDATE clubs SET logo = ? WHERE club_id = ?', [logoPath, clubId]);
    }

    await connection.query('COMMIT');
    connection.release();

    return res.status(201).json({
      success: true,
      message: 'Club imported from folder',
      clubId,
      createdMediaCount: createdMedia.length,
      createdMedia,
      createdActivities,
      logo: logoPath || null
    });
  } catch (err) {
    console.error('Import error:', err);
    await connection.query('ROLLBACK').catch(() => {});
    connection.release();
    return res.status(500).json({ success: false, message: 'Import failed', error: err.message });
  }
}

export default { importClubFromFolder };
