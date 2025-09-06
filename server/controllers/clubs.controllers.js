import pool from "../db/connectDB.js";
import { USER_MESSAGE_TO_ADMIN } from '../utils/emailTemplates.js';
import transporter from '../config/nodemailer.config.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
// fileURLToPath already imported above

// Update club (partial update with optional media replacement and folder rename on name change)
export const updateClub = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const clubId = parseInt(req.params.id, 10);
    if (!clubId) {
      connection.release();
      return res.status(400).json({ success: false, message: 'Invalid club id' });
    }

    await connection.query('START TRANSACTION');
    const [rows] = await connection.query('SELECT * FROM clubs WHERE club_id = ?', [clubId]);
    if (!rows.length) {
      await connection.query('ROLLBACK');
      connection.release();
      return res.status(404).json({ success: false, message: 'Club not found' });
    }
    const club = rows[0];

    // Paths setup
    const serverDir = path.dirname(fileURLToPath(import.meta.url));
    const baseRoot = path.join(serverDir, '..');
    const uploadsRoot = path.join(baseRoot, 'uploads');
    const sanitize = (str) => String(str || '').normalize('NFKD').replace(/[^a-zA-Z0-9\s-]/g, '').trim().replace(/\s+/g, '-').slice(0, 60);

  // Prepare new field values
  const { name, description, instagram_link, linkedin_link } = req.body;
    const newName = typeof name === 'string' ? name.trim() : undefined;
    const newDesc = typeof description === 'string' ? description.trim() : undefined;
    const newInsta = typeof instagram_link === 'string' ? instagram_link.trim() : undefined;
    const newLinked = typeof linkedin_link === 'string' ? linkedin_link.trim() : undefined;

  // Optional admin update fields
  const adminName = typeof req.body?.adminName === 'string' ? req.body.adminName.trim() : undefined;
  const adminEmail = typeof req.body?.adminEmail === 'string' ? req.body.adminEmail.trim() : undefined;
  const adminPassword = typeof req.body?.adminPassword === 'string' ? req.body.adminPassword : undefined; // allow empty string -> treated as no change

    // Try to derive real existing slug from stored paths to avoid mismatch with sanitizer
    const extractSlug = (p) => {
      if (!p) return null;
      const str = String(p);
      const idx = str.indexOf('/uploads/');
      if (idx === -1) return null;
      const start = idx + '/uploads/'.length;
      const rest = str.slice(start);
      const seg = rest.split(/[\\/]/)[0];
      return seg || null;
    };
    let derivedSlug = extractSlug(club.logo);
    if (!derivedSlug) {
      try {
        const [anyMedia] = await connection.query('SELECT media_url FROM club_media WHERE club_id = ? LIMIT 1', [clubId]);
        if (anyMedia && anyMedia[0]) derivedSlug = extractSlug(anyMedia[0].media_url);
      } catch {}
    }
    const oldSlug = derivedSlug || (sanitize(club.name) || `club-${clubId}`);
    const newSlug = sanitize(newName ?? club.name) || `club-${clubId}`;
    const oldDir = path.join(uploadsRoot, oldSlug);
    const newDir = path.join(uploadsRoot, newSlug);

    // If name changed, always move/merge contents from oldDir -> newDir and delete oldDir
    if (newName && newName !== club.name && oldDir !== newDir) {
      await fs.mkdir(newDir, { recursive: true }).catch(() => {});
      const sourceExists = await fs.stat(oldDir).then(() => true).catch(() => false);
      if (sourceExists) {
        const entries = await fs.readdir(oldDir).catch(() => []);
        for (const name of entries) {
          const s = path.join(oldDir, name);
          const d = path.join(newDir, name);
          const isDir = await fs.stat(s).then(st => st.isDirectory()).catch(() => false);
          if (isDir) {
            await fs.mkdir(d, { recursive: true }).catch(() => {});
            const subEntries = await fs.readdir(s).catch(() => []);
            for (const sub of subEntries) {
              await fs.rename(path.join(s, sub), path.join(d, sub)).catch(async () => {
                await fs.copyFile(path.join(s, sub), path.join(d, sub)).catch(() => {});
                await fs.unlink(path.join(s, sub)).catch(() => {});
              });
            }
          } else {
            await fs.rename(s, d).catch(async () => {
              await fs.copyFile(s, d).catch(() => {});
              await fs.unlink(s).catch(() => {});
            });
          }
        }
        // Remove oldDir after moving everything
        await fs.rm(oldDir, { recursive: true, force: true }).catch(() => {});
      }
      const oldPrefix = `/uploads/${oldSlug}/`;
      const newPrefix = `/uploads/${newSlug}/`;
      // Update paths in related tables within the same transaction
      await connection.query('UPDATE clubs SET logo = REPLACE(logo, ?, ?) WHERE club_id = ?', [oldPrefix, newPrefix, clubId]);
      await connection.query('UPDATE club_media SET media_url = REPLACE(media_url, ?, ?) WHERE club_id = ?', [oldPrefix, newPrefix, clubId]);
      await connection.query('UPDATE activities SET main_image = REPLACE(main_image, ?, ?) WHERE club_id = ?', [oldPrefix, newPrefix, clubId]);
      await connection.query(
        'UPDATE activities_images ai JOIN activities a ON ai.activity_id = a.activity_id SET ai.images = REPLACE(ai.images, ?, ?) WHERE a.club_id = ?',
        [oldPrefix, newPrefix, clubId]
      );
      await connection.query('UPDATE board_membre SET image = REPLACE(image, ?, ?) WHERE club_id = ?', [oldPrefix, newPrefix, clubId]);
    }

    const sets = [];
    const vals = [];
    if (newName !== undefined) { sets.push('name = ?'); vals.push(newName); }
    if (newDesc !== undefined) { sets.push('description = ?'); vals.push(newDesc); }
    if (newInsta !== undefined) { sets.push('instagram_link = ?'); vals.push(newInsta); }
    if (newLinked !== undefined) { sets.push('linkedin_link = ?'); vals.push(newLinked); }

    // Files handling
    const files = req.files || {};

    // Ensure destination dirs exist (under the existing/renamed folder)
    const logoDir = path.join(newDir, 'logo');
    const videoDir = path.join(newDir, 'video');
    const imagesDir = path.join(newDir, 'images');
    await fs.mkdir(logoDir, { recursive: true }).catch(() => {});
    await fs.mkdir(videoDir, { recursive: true }).catch(() => {});
    await fs.mkdir(imagesDir, { recursive: true }).catch(() => {});

    // Helper to clear a directory contents
    const clearDir = async (dir) => {
      try {
        const entries = await fs.readdir(dir).catch(() => []);
        await Promise.all(entries.map(async (entry) => {
          const p = path.join(dir, entry);
          await fs.unlink(p).catch(() => {});
        }));
      } catch {}
    };

    // Helper to resolve path from DB path or absolute URL
    const toAbs = (p) => {
      if (!p) return null;
      let str = String(p);
      // If full URL, extract '/uploads/...'
      const idx = str.indexOf('/uploads/');
      if (idx !== -1) {
        str = str.slice(idx + 1); // remove leading slash to get 'uploads/...'
      }
      const clean = str.replace(/^\/+/, '');
      const full = (clean.startsWith('uploads/') || clean.startsWith('uploads\\'))
        ? path.join(baseRoot, clean)
        : path.join(baseRoot, 'uploads', clean);
      const normalized = path.normalize(full);
      if (!normalized.startsWith(path.normalize(uploadsRoot))) return null;
      return normalized;
    };
    // Helper to normalize to DB path starting with '/uploads/...'
    const toDbRel = (p) => {
      if (!p) return null;
      let str = String(p);
      const idx = str.indexOf('/uploads/');
      if (idx !== -1) return str.slice(idx);
      // Assume already relative
      if (str.startsWith('uploads/')) return `/${str}`;
      if (str.startsWith('/uploads/')) return str;
      return `/uploads/${str.replace(/^\/+/, '')}`;
    };

    // Replace logo if provided (use unique filename to bust cache)
    if (files.clubLogo && files.clubLogo[0]) {
      const logoFile = files.clubLogo[0];
      await clearDir(logoDir);
      const ext = path.extname(logoFile.originalname || logoFile.filename || '');
      const src = path.join(baseRoot, logoFile.destination, logoFile.filename);
      const dest = path.join(logoDir, `logo-${Date.now()}${ext || path.extname(src)}`);
      await fs.rename(src, dest).catch(async () => { await fs.copyFile(src, dest).catch(() => {}); await fs.unlink(src).catch(() => {}); });
      const dbp = '/' + path.relative(baseRoot, dest).replace(/\\/g, '/');
      sets.push('logo = ?');
      vals.push(dbp);
    }

    // Replace video if provided (in club_media as media_type='video')
    if (files.clubVideo && files.clubVideo[0]) {
      // Clear old video folder and DB rows
      await clearDir(videoDir);
      const [oldVideos] = await connection.query('SELECT media_url FROM club_media WHERE club_id = ? AND media_type = "video"', [clubId]);
      for (const v of oldVideos) {
        const abs = toAbs(v.media_url);
        if (abs) await fs.unlink(abs).catch(() => {});
      }
      await connection.query('DELETE FROM club_media WHERE club_id = ? AND media_type = "video"', [clubId]);
      const videoFile = files.clubVideo[0];
      const ext = path.extname(videoFile.originalname || videoFile.filename || '');
      const src = path.join(baseRoot, videoFile.destination, videoFile.filename);
      const dest = path.join(videoDir, `video-${Date.now()}${ext || path.extname(src)}`);
      await fs.rename(src, dest).catch(async () => { await fs.copyFile(src, dest).catch(() => {}); await fs.unlink(src).catch(() => {}); });
      const dbp = '/' + path.relative(baseRoot, dest).replace(/\\/g, '/');
      await connection.query('INSERT INTO club_media (club_id, media_url, media_type) VALUES (?, ?, "video")', [clubId, dbp]);
    }

    // Replace specific images if mapping provided; otherwise append
    if (files.clubMainImages && files.clubMainImages.length) {
      // Normalize replace targets from body: can be JSON, string, or array of strings
      let replaceTargets = [];
      const rawRT = req.body?.replaceTargets;
      if (Array.isArray(rawRT)) {
        replaceTargets = rawRT.filter(Boolean);
      } else if (typeof rawRT === 'string' && rawRT.trim()) {
        try {
          const parsed = JSON.parse(rawRT);
          if (Array.isArray(parsed)) replaceTargets = parsed.filter(Boolean);
          else replaceTargets = [rawRT];
        } catch {
          // Not JSON, treat as single target
          replaceTargets = [rawRT];
        }
      }

      let fileIndex = 0;
      // Handle replacements for as many pairs as provided
      for (; fileIndex < Math.min(replaceTargets.length, files.clubMainImages.length); fileIndex++) {
        const imgFile = files.clubMainImages[fileIndex];
        const targetUrl = String(replaceTargets[fileIndex] || '');
        if (!imgFile || !targetUrl) continue;
        const src = path.join(baseRoot, imgFile.destination, imgFile.filename);
        const targetAbs = toAbs(targetUrl);
        const targetDb = toDbRel(targetUrl);
        if (!targetAbs || !targetDb) {
          // Fallback: append if target invalid
          const ext = path.extname(imgFile.originalname || imgFile.filename || '');
          const unique = `${Date.now()}-${fileIndex + 1}-${Math.random().toString(36).slice(2, 8)}`;
          const dest = path.join(imagesDir, `image-${unique}${ext || path.extname(src)}`);
          await fs.rename(src, dest).catch(async () => { await fs.copyFile(src, dest).catch(() => {}); await fs.unlink(src).catch(() => {}); });
          const dbp = '/' + path.relative(baseRoot, dest).replace(/\\/g, '/');
          await connection.query('INSERT INTO club_media (club_id, media_url, media_type) VALUES (?, ?, "image")', [clubId, dbp]);
          continue;
        }
        // Write new file with unique name, update DB path, then remove old file
        const ext = path.extname(imgFile.originalname || imgFile.filename || '') || path.extname(src);
        const unique = `${Date.now()}-${fileIndex + 1}-${Math.random().toString(36).slice(2, 8)}`;
        const dest = path.join(imagesDir, `image-${unique}${ext}`);
        await fs.rename(src, dest).catch(async () => { await fs.copyFile(src, dest).catch(() => {}); await fs.unlink(src).catch(() => {}); });
        const dbp = '/' + path.relative(baseRoot, dest).replace(/\\/g, '/');
        await connection.query('UPDATE club_media SET media_url = ? WHERE club_id = ? AND media_type = "image" AND media_url = ? LIMIT 1', [dbp, clubId, targetDb]);
        await fs.unlink(targetAbs).catch(() => {});
      }

      // Append any remaining files after replacements
      for (; fileIndex < files.clubMainImages.length; fileIndex++) {
        const imgFile = files.clubMainImages[fileIndex];
        const ext = path.extname(imgFile.originalname || imgFile.filename || '');
        const src = path.join(baseRoot, imgFile.destination, imgFile.filename);
        const unique = `${Date.now()}-${fileIndex + 1}-${Math.random().toString(36).slice(2, 8)}`;
        const dest = path.join(imagesDir, `image-${unique}${ext || path.extname(src)}`);
        await fs.rename(src, dest).catch(async () => { await fs.copyFile(src, dest).catch(() => {}); await fs.unlink(src).catch(() => {}); });
        const dbp = '/' + path.relative(baseRoot, dest).replace(/\\/g, '/');
        await connection.query('INSERT INTO club_media (club_id, media_url, media_type) VALUES (?, ?, "image")', [clubId, dbp]);
      }
    }

    if (sets.length) {
      vals.push(clubId);
      await connection.query(`UPDATE clubs SET ${sets.join(', ')} WHERE club_id = ?`, vals);
    }

    // Update related admin if any admin fields provided
    if (adminName !== undefined || adminEmail !== undefined || (adminPassword && adminPassword.trim().length > 0)) {
      const adminSets = [];
      const adminVals = [];
      if (adminName !== undefined) { adminSets.push('full_name = ?'); adminVals.push(adminName); }
      if (adminEmail !== undefined) { adminSets.push('email = ?'); adminVals.push(adminEmail); }
      if (adminPassword && adminPassword.trim().length > 0) {
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(adminPassword, salt);
        adminSets.push('password = ?'); adminVals.push(hashed);
      }
      if (adminSets.length) {
        adminVals.push(club.admin_id);
        await connection.query(`UPDATE admins SET ${adminSets.join(', ')} WHERE admin_id = ?`, adminVals);
      }
    }

    await connection.query('COMMIT');
    connection.release();

    // Return updated details using existing getClubById query format
    req.params.id = String(clubId);
    return await getClubById(req, res);
  } catch (err) {
    console.error('Error updating club:', err);
    try { await connection.query('ROLLBACK'); } catch {}
    try { connection.release(); } catch {}
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
// Get all clubs
export const getAllClubsForHomePage = async (req, res) => {
  try {
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    // Fetch all clubs + admin info + per-user like status
    const [clubs] = await pool.query(
      `SELECT 
         c.club_id,
         c.name,
         c.description,
         c.logo,
         c.views,
         c.likes,
         a.admin_id,
         a.email AS admin_email,
         a.role AS admin_role,
         a.full_name,
         EXISTS(
           SELECT 1 
           FROM club_likes cl 
           WHERE cl.club_id = c.club_id AND cl.user_id = ?
         ) AS likedByMe
       FROM clubs c
       LEFT JOIN admins a ON c.admin_id = a.admin_id`,
      [req.user?.user_id ?? null]
    );

    if (clubs.length === 0) {
      return res.status(404).json({ message: "No clubs found." });
    }

    // Fetch categories for all clubs
    const [categories] = await pool.query(`
      SELECT cc.club_id, ca.name AS category_name
      FROM club_categories AS cc
      JOIN categories AS ca ON cc.category_id = ca.category_id
    `);

    // Attach categories + format data + add admin info properly
    const clubsWithDetails = clubs.map(club => {
      const clubCats = categories
        .filter(cat => cat.club_id === club.club_id)
        .map(cat => cat.category_name);
      const admin = {
        admin_id: club.admin_id,
        email: club.admin_email,
        role: club.admin_role,
        full_name: club.full_name
      };
      return {
        club_id: club.club_id,
        name: club.name,
        description: club.description,
        logo: club.logo ? `${baseUrl}/${club.logo.replace(/^\/+/, "")}`: null,
        views: club.views,
        likes: club.likes,
        likedByMe: Boolean(club.likedByMe),
        categories: clubCats,
        admin
      };
    });

    return res.status(200).json(clubsWithDetails);
  } catch (err) {
    console.error("Error fetching clubs:", err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get club by ID
export const getClubById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get the base URL dynamically
    const PORT = process.env.PORT || 5000;
    // Automatically gets http://localhost:PORT or production host
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    
    // Validate the ID parameter
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ message: "Invalid club ID" });
    }
    
  const query = `
      SELECT 
        c.club_id as id, c.name, c.admin_id as admin, c.description,
        c.instagram_link, c.linkedin_link, c.logo, 
        c.creation_date as created_date, c.views, c.likes,
    EXISTS(SELECT 1 FROM club_likes cl WHERE cl.club_id = c.club_id AND cl.user_id = ?) AS likedByMe,
        
        -- Get first video as short_video
        (SELECT cm.media_url FROM club_media cm 
         WHERE cm.club_id = c.club_id AND cm.media_type = 'video' LIMIT 1) as short_video,
        
        -- Get all images as JSON array with proper null handling
        COALESCE((
          SELECT JSON_ARRAYAGG(cm.media_url) FROM club_media cm 
          WHERE cm.club_id = c.club_id AND cm.media_type = 'image'
        ), JSON_ARRAY()) as club_images,
        
        -- Get activities with images as JSON with proper null handling
        COALESCE((
          SELECT JSON_ARRAYAGG(JSON_OBJECT(
            'id', a.activity_id, 
            'name', a.name, 
            'pitch', a.pitch,  
            'main_image', a.main_image,
            'activity_date', a.activity_date,
            'activity_images', COALESCE((
              SELECT JSON_ARRAYAGG(ai.images) FROM activities_images ai 
              WHERE ai.activity_id = a.activity_id
            ), JSON_ARRAY())
          )) FROM activities a WHERE a.club_id = c.club_id
        ), JSON_ARRAY()) as activities,
        
        -- Get board members as JSON with proper null handling
        COALESCE((
          SELECT JSON_ARRAYAGG(JSON_OBJECT(
            'board_member_id', bm.board_membre_id, 
            'fullname', bm.fullname,
            'email', bm.email, 
            'image', COALESCE(bm.image, ''), 
            'role', bm.role
          )) FROM board_membre bm WHERE bm.club_id = c.club_id
        ), JSON_ARRAY()) as board_members,
        
        -- Get reviews with user details as JSON with proper null handling
        COALESCE((
          SELECT JSON_ARRAYAGG(JSON_OBJECT(
            'review', r.user_id, 
            'full_name', u.full_name,
            'email', u.email, 
            'text', r.text, 
            'date', r.date
          )) FROM reviews r JOIN users u ON r.user_id = u.user_id 
          WHERE r.club_id = c.club_id
        ), JSON_ARRAY()) as reviews
        
      FROM clubs c WHERE c.club_id = ?
    `;
    
    const [rows] = await pool.execute(query, [req.user?.user_id ?? null, id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: "Club not found" });
    }
    
    const club = rows[0];
    
    // Helper function to add base URL to image/video paths
    const addBaseUrl = (path) => {
      if (!path || path === '') return '';
      // Check if it's already a full URL
      if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
      }
      // Remove leading slash if present to avoid double slashes
      const cleanPath = path.startsWith('/') ? path.slice(1) : path;
      return `${baseUrl}/${cleanPath}`;
    };
    
    // Helper function to safely parse JSON or return the value if already parsed
    const safeJsonParse = (value) => {
      if (value === null || value === undefined) {
        return [];
      }
      if (Array.isArray(value)) {
        return value; // Already parsed by MySQL
      }
      if (typeof value === 'string') {
        try {
          return JSON.parse(value);
        } catch (error) {
          console.log("JSON parse error for value:", value);
          return [];
        }
      }
      return value;
    };
    
    // Parse the data
    const parsedActivities = safeJsonParse(club.activities);
    const parsedBoardMembers = safeJsonParse(club.board_members);
    const parsedClubImages = safeJsonParse(club.club_images);
    
    // Add base URL to all image and video paths
    const processedActivities = parsedActivities.map(activity => ({
      ...activity,
      main_image: addBaseUrl(activity.main_image),
      activity_images: activity.activity_images.map(img => addBaseUrl(img))
    }));
    
    const processedBoardMembers = parsedBoardMembers.map(member => ({
      ...member,
      image: addBaseUrl(member.image)
    }));
    
    const processedClubImages = parsedClubImages.map(img => addBaseUrl(img));
    
    const clubData = {
      id: club.id,
      name: club.name,
      admin: club.admin,
      description: club.description,
      instagram_link: club.instagram_link,
      linkedin_link: club.linkedin_link,
      logo: addBaseUrl(club.logo),
      created_date: club.created_date,
      views: club.views,
      likes: club.likes,
      likedByMe: Boolean(club.likedByMe),
      short_video: addBaseUrl(club.short_video),
      club_images: processedClubImages,
      activities: processedActivities,
      board_members: processedBoardMembers,
      reviews: safeJsonParse(club.reviews) // reviews don't need image processing
    };
    
    return res.status(200).json(clubData);
    
  } catch(err) {
    console.log("Error fetching club by ID:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Alternative version with dynamic base URL ( hadi khliwha hna )
/*
export const getClubByIdDynamic = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get the base URL dynamically
    const PORT = process.env.PORT || 5000;
    // Automatically gets http://localhost:PORT or production host
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    
    // Validate the ID parameter
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ message: "Invalid club ID" });
    }
    
    const query = `
      SELECT 
        c.club_id as id, c.name, c.admin_id as admin, c.description,
        c.instagram_link, c.linkedin_link, c.logo, 
        c.creation_date as created_date, c.views, c.likes,
        
        (SELECT cm.media_url FROM club_media cm 
         WHERE cm.club_id = c.club_id AND cm.media_type = 'video' LIMIT 1) as short_video,
        
        COALESCE((
          SELECT JSON_ARRAYAGG(cm.media_url) FROM club_media cm 
          WHERE cm.club_id = c.club_id AND cm.media_type = 'image'
        ), JSON_ARRAY()) as club_images,
        
        COALESCE((
          SELECT JSON_ARRAYAGG(JSON_OBJECT(
            'id', a.activity_id, 
            'name', a.name, 
            'pitch', a.pitch,  
            'main_image', a.main_image,
            'activity_date', a.activity_date,
            'activity_images', COALESCE((
              SELECT JSON_ARRAYAGG(ai.images) FROM activities_images ai 
              WHERE ai.activity_id = a.activity_id
            ), JSON_ARRAY())
          )) FROM activities a WHERE a.club_id = c.club_id
        ), JSON_ARRAY()) as activities,
        
        COALESCE((
          SELECT JSON_ARRAYAGG(JSON_OBJECT(
            'board_member_id', bm.board_membre_id, 
            'fullname', bm.fullname,
            'email', bm.email, 
            'image', COALESCE(bm.image, ''), 
            'role', bm.role
          )) FROM board_membre bm WHERE bm.club_id = c.club_id
        ), JSON_ARRAY()) as board_members,
        
        COALESCE((
          SELECT JSON_ARRAYAGG(JSON_OBJECT(
            'review', r.user_id, 
            'full_name', u.full_name,
            'email', u.email, 
            'text', r.text, 
            'date', r.date
          )) FROM reviews r JOIN users u ON r.user_id = u.user_id 
          WHERE r.club_id = c.club_id
        ), JSON_ARRAY()) as reviews
        
      FROM clubs c WHERE c.club_id = ?
    `;
    
    const [rows] = await pool.execute(query, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: "Club not found" });
    }
    
    const club = rows[0];
    
    // Helper function to add base URL to image/video paths
    const addBaseUrl = (path) => {
      if (!path || path === '') return '';
      if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
      }
      const cleanPath = path.startsWith('/') ? path.slice(1) : path;
      return `${baseUrl}/${cleanPath}`;
    };
    
    // Helper function to safely parse JSON
    const safeJsonParse = (value) => {
      if (value === null || value === undefined) return [];
      if (Array.isArray(value)) return value;
      if (typeof value === 'string') {
        try {
          return JSON.parse(value);
        } catch (error) {
          console.log("JSON parse error for value:", value);
          return [];
        }
      }
      return value;
    };
    
    // Process the data with base URLs
    const parsedActivities = safeJsonParse(club.activities);
    const parsedBoardMembers = safeJsonParse(club.board_members);
    const parsedClubImages = safeJsonParse(club.club_images);
    
    const clubData = {
      id: club.id,
      name: club.name,
      admin: club.admin,
      description: club.description,
      instagram_link: club.instagram_link,
      linkedin_link: club.linkedin_link,
      logo: addBaseUrl(club.logo),
      created_date: club.created_date,
      views: club.views,
      likes: club.likes,
      short_video: addBaseUrl(club.short_video),
      club_images: parsedClubImages.map(img => addBaseUrl(img)),
      activities: parsedActivities.map(activity => ({
        ...activity,
        main_image: addBaseUrl(activity.main_image),
        activity_images: activity.activity_images.map(img => addBaseUrl(img))
      })),
      board_members: parsedBoardMembers.map(member => ({
        ...member,
        image: addBaseUrl(member.image)
      })),
      reviews: safeJsonParse(club.reviews)
    };
    
    return res.status(200).json(clubData);
    
  } catch(err) {
    console.log("Error fetching club by ID:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
*/

export const likeClub = async (req, res) => {
  const club_id = req.params.id;       
  const user_id=req.user?.user_id; // Authenticated user ID 

  try {
   //check if user has already liked the club
   const [existingLike] = await pool.query(
      "SELECT * FROM club_likes WHERE club_id = ? AND user_id = ?",
      [club_id, user_id]
    );

    if (existingLike.length > 0) {
      // if already liked then unlike it
      await pool.query("DELETE FROM club_likes WHERE club_id = ? AND user_id = ?", [club_id, user_id]);
    } else {
      await pool.query("INSERT INTO club_likes (club_id, user_id) VALUES (?, ?)", [club_id, user_id]);
    }
    // Get the updated likes count
    const [likesCount] = await pool.query(
      "SELECT COUNT(*) AS totalLikes FROM club_likes WHERE club_id = ?",
      [club_id]
    );

    // Reset the likes count in clubs table
    await pool.query("UPDATE clubs SET likes = ? WHERE club_id = ?", [likesCount[0].totalLikes, club_id]);

    res.json({ success: true, message:"Liked successfully" });
  } catch (err) {
    console.error("Error liking club:", err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//think about adding a like_tables to enable like and unlike 

export const addViews = async (req,res)=>{
  const club_id = req.params.id;
  const user_id=req.user?.user_id; // Authenticated user ID
  try {
   const [existingView] = await pool.query(
            "SELECT * FROM club_views WHERE club_id = ? AND user_id = ?",
            [club_id, user_id]
        );
    if (existingView.length === 0) {
            await pool.query("INSERT INTO club_views (club_id, user_id) VALUES (?, ?)", [club_id, user_id]);
        }
      const [viewsCount] = await pool.query(
            "SELECT COUNT(*) AS totalViews FROM club_views WHERE club_id = ?",
            [club_id]
        );
       await pool.query("UPDATE clubs SET views = ? WHERE club_id = ?", [viewsCount[0].totalViews, club_id]);
       res.json({ success: true, message:"View added succesfulyy" });
    
  } catch (err) {
    console.error("Error addd views to  club:", err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
} 

export const addReview = async(req,res)=>{ 
  // route uses /reviews/:id so read `id` from params
  const clubID = req.params.id;
  const userId = req.user?.user_id;
  const {text}=req.body;
  try { 

    const [club]=await pool.query("SELECT * FROM clubs WHERE club_id = ?",[clubID]);
    if(club.length===0){
      return res.status(404).json({message:"Club not found."});
    } 
    if(!text || text.trim() ===""){
      return res.status(400).json({message:"Review text cannot be empty."});
    } 
  // Format date as YYYY-MM-DD (MySQL TIMESTAMP/DATETIME will store as YYYY-MM-DD 00:00:00)
  const formattedDate = new Date().toISOString().slice(0, 10);
  await pool.query("INSERT INTO reviews (user_id, club_id, text, date) VALUES (?, ?, ?, ?)",[userId,clubID,text,formattedDate]);
    // Send back the newly created review with user info to update UI immediately
    return res.status(201).json({
      message:"Review added successfully!",
      review: {
        full_name: req.user?.full_name,
        email: req.user?.email,
        text,
        date: formattedDate
      }
    });


  }catch(err){
    console.error("Error adding review:", err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
export const deleteReview = async (req,res)=>{
  // route uses /reviews/:id so read `id` from params
  const clubID = req.params.id;
  const userId = req.user?.user_id;
  try { 
    
    const [club]=await pool.query("SELECT * FROM clubs WHERE club_id = ?",[clubID]);
    if(club.length===0){
      return res.status(404).json({message:"Club not found."});
    } 

    await pool.query("DELETE FROM reviews WHERE user_id = ? AND club_id = ?",[userId,clubID]);
    return res.status(200).json({message:"Review deleted successfully!"});

  } catch(err){
    console.error("Error deleting review:", err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// send a message to clubs admin: 
export const submitForm = async (req, res) => {
  const { subject, text, admin_id } = req.body;

  // Check authentication
  const user = req.user;
  if (!user) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }

  const { full_name, email } = user || {};
  const userInfo = { full_name, email };

  try {
    // Validate required fields
    if (!admin_id || !text || !subject) {
      return res.status(400).json({ success: false, message: 'admin_id, subject and text are required' });
    }

    // Get admin email from DB
    const [adminInfo] = await pool.query(
      "SELECT email FROM admins WHERE admin_id = ?",
      [admin_id]
    );

    if (adminInfo.length === 0) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    const adminEmail = adminInfo[0].email;
    const emailContent = USER_MESSAGE_TO_ADMIN
      .replace(/{userName}/g, userInfo.full_name)
      .replace(/{userEmail}/g, userInfo.email)
      .replace(/{userMessage}/g, text);

    const smtpFrom = process.env.SENDER_EMAIL;
    if (!smtpFrom) {
      return res.status(500).json({
        success: false,
        message: 'Missing SENDER_EMAIL in environment variables'
      });
    }

    const mailOptions = {
  
      from: `"${userInfo.full_name} <${userInfo.email}> via ENSaf Club" <${smtpFrom}>`,
      replyTo: `${userInfo.full_name} <${userInfo.email}>`,

      // Destination → Admin
      to: adminEmail,

      // Subject
      subject: subject || `📩 New Message From ${userInfo.full_name}`,

      // HTML email template
      html: emailContent,

      // Optional headers → improves inbox display
      headers: {
        'X-Sender': userInfo.email,
        'X-Reply-To': userInfo.email,
        'X-Mailer': 'ensaf-club-app'
      }
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);



    // If Brevo rejected the email
    if (info.rejected.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Brevo rejected the email",
        rejected: info.rejected
      });
    }

    return res.status(200).json({
      success: true,
      message: "Form submitted successfully",
      info
    });

  } catch (err) {
    console.error("Error sending email:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// delete club:

export const deleteClub = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const club_id = req.params.id;

    await connection.query("START TRANSACTION");
    const [clubRows] = await connection.query("SELECT * FROM clubs WHERE club_id = ?", [club_id]);
    if (clubRows.length === 0) {
      await connection.query("ROLLBACK");
      connection.release();
      return res.status(404).json({ success: false, message: "Club not found" });
    }

    const club = clubRows[0];
    const adminId = club.admin_id;
    const tableExists = async (conn, tableName) => {
      const [rows] = await conn.query(`
        SELECT COUNT(*) AS cnt FROM information_schema.tables WHERE table_schema = ? AND table_name = ?`,
        [process.env.MYSQL_DB, tableName]
      );
      return rows[0].cnt > 0;
    };
    const serverDir = path.dirname(fileURLToPath(import.meta.url));
    const uploadsRoot = path.join(serverDir, '..', 'uploads');
    const sanitizedFolderName = club.name.replace(/[^a-zA-Z0-9-]/g, '').replace(/\+/g, '').trim();
    const clubFolderPath = path.join(uploadsRoot, sanitizedFolderName);
    let folderDeleted = false;
    try {
      await fs.rm(clubFolderPath, { recursive: true, force: true });
      folderDeleted = true;
    } catch (err) {
      console.error("Error deleting club folder:", err);
    }
    if (await tableExists(connection, 'activities_images')) {
      await connection.query(`
        DELETE ai FROM activities_images ai INNER JOIN activities a ON ai.activity_id = a.activity_id WHERE a.club_id = ?`,
        [club_id]
      );
    }

    if (await tableExists(connection, 'activities')) {
      await connection.query("DELETE FROM activities WHERE club_id = ?", [club_id]);
    }

    if (await tableExists(connection, 'reviews')) {
      await connection.query("DELETE FROM reviews WHERE club_id = ?", [club_id]);
    }
    if (await tableExists(connection, 'likes')) {
      await connection.query("DELETE FROM likes WHERE club_id = ?", [club_id]);
    } else if (await tableExists(connection, 'club_likes')) {
      await connection.query("DELETE FROM club_likes WHERE club_id = ?", [club_id]);
    }
    if (await tableExists(connection, 'views')) {
      await connection.query("DELETE FROM views WHERE club_id = ?", [club_id]);
    } else if (await tableExists(connection, 'club_views')) {
      await connection.query("DELETE FROM club_views WHERE club_id = ?", [club_id]);
    }

    if (await tableExists(connection, 'club_media')) {
      await connection.query("DELETE FROM club_media WHERE club_id = ?", [club_id]);
    }

    if (await tableExists(connection, 'board_membre')) {
      await connection.query("DELETE FROM board_membre WHERE club_id = ?", [club_id]);
    }
    await connection.query("DELETE FROM clubs WHERE club_id = ?", [club_id]);
    if (adminId && await tableExists(connection, 'admins')) await connection.query("DELETE FROM admins WHERE admin_id = ?", [adminId]);

    await connection.query("COMMIT");
    connection.release();

    return res.status(200).json({
      success: true,
      message: "Club and all related data deleted successfully",
      folderDeleted,
      deletedFolderPath: clubFolderPath
    });

  } catch (error) {
    console.error("Error deleting club:", error);
    await connection.query("ROLLBACK");
    connection.release();
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const addClub = async (req,res)=>{
  try{ 
    const {
      clubName,
      clubDescription,
      linkedIn = '',
      instagram = '',
      adminName,
      adminEmail,
      adminPassword,
      confirmPassword,
    } = req.body;
    // categories can be a string or an array in multipart forms
    let categories = req.body.categories ?? [];
    if (!Array.isArray(categories)) {
      categories = categories ? [categories] : [];
    }
    

    // Basic validation
    if (!clubName || !clubDescription) {
      return res.status(400).json({ success: false, message: 'clubName and clubDescription are required' });
    }
    if (!adminName || !adminEmail || !adminPassword || !confirmPassword) {
      return res.status(400).json({ success: false, message: 'adminName, adminEmail and adminPassword are required' });
    }

    if (adminPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'adminPassword and confirmPassword must match' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; 

    if (!emailRegex.test(adminEmail)) {
      return res.status(400).json({ success: false, message: 'Invalid adminEmail format' });
    }

    if (!passwordRegex.test(adminPassword)) {
      return res.status(400).json({ success: false, message: 'Invalid adminPassword format' });
    }

    const connection = await pool.getConnection();
    try {
      await connection.query('START TRANSACTION');

      // Create or reuse admin
      let adminId;
      const [existingAdmins] = await connection.query('SELECT admin_id FROM admins WHERE email = ?', [adminEmail]);
      if (existingAdmins.length > 0) {
        adminId = existingAdmins[0].admin_id;
      } else {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminPassword, salt);
        const [adminInsert] = await connection.query(
          'INSERT INTO admins (full_name, email, password, role) VALUES (?, ?, ?, ?)',
          [adminName, adminEmail, hashedPassword, 'admin']
        );
        adminId = adminInsert.insertId;
      }

      // Prepare uploads folder structure
      const serverDir = path.dirname(fileURLToPath(import.meta.url));
      const uploadsRoot = path.join(serverDir, '..', 'uploads');
      // Sanitize folder name (keep letters, numbers, hyphen)
      const sanitizedFolderName = String(clubName).replace(/[^a-zA-Z0-9-]/g, '').replace(/\+/g, '').trim() || 'club';
      const clubBaseDir = path.join(uploadsRoot, sanitizedFolderName);
      const logoDir = path.join(clubBaseDir, 'logo');
      const imagesDir = path.join(clubBaseDir, 'images');
      const videoDir = path.join(clubBaseDir, 'video');
      await fs.mkdir(logoDir, { recursive: true });
      await fs.mkdir(imagesDir, { recursive: true });
      await fs.mkdir(videoDir, { recursive: true });
      // Move uploaded files from tmp to the club-specific folders
      const files = req.files || {};
      const baseRoot = path.join(serverDir, '..');
      // Logo
      let logoDbPath = '';
      if (files.clubLogo && files.clubLogo[0]) {
        const f = files.clubLogo[0];
        const src = path.join(baseRoot, f.destination, f.filename);
        const dest = path.join(logoDir, f.filename);
        try { await fs.rename(src, dest); } catch {}
        logoDbPath = `/uploads/${sanitizedFolderName}/logo/${f.filename}`;
      }
      // Images
      const imageDbPaths = [];
      if (Array.isArray(files.clubMainImages)) {
        for (const f of files.clubMainImages) {
          const src = path.join(baseRoot, f.destination, f.filename);
          const dest = path.join(imagesDir, f.filename);
          try { await fs.rename(src, dest); } catch {}
          imageDbPaths.push(`/uploads/${sanitizedFolderName}/images/${f.filename}`);
        }
      }
      // Video
      let videoDbPath = '';
      if (files.clubVideo && files.clubVideo[0]) {
        const f = files.clubVideo[0];
        const src = path.join(baseRoot, f.destination, f.filename);
        const dest = path.join(videoDir, f.filename);
        try { await fs.rename(src, dest); } catch {}
        videoDbPath = `/uploads/${sanitizedFolderName}/video/${f.filename}`;
      }

      // Insert club
      const [clubInsert] = await connection.query(
        'INSERT INTO clubs (instagram_link, linkedin_link, name, description, admin_id, logo) VALUES (?, ?, ?, ?, ?, ?)',
        [instagram, linkedIn, clubName, clubDescription, adminId, logoDbPath]
      );
      const clubId = clubInsert.insertId;

      // Categories: ensure existence and link
      if (Array.isArray(categories)) {
        for (const rawName of categories) {
          const catName = String(rawName || '').trim();
          if (!catName) continue;
          let categoryId;
          const [existingCat] = await connection.query('SELECT category_id FROM categories WHERE name = ?', [catName]);
          if (existingCat.length > 0) {
            categoryId = existingCat[0].category_id;
          } else {
            const [catInsert] = await connection.query('INSERT INTO categories (name) VALUES (?)', [catName]);
            categoryId = catInsert.insertId;
          }
          // Link
          await connection.query('INSERT IGNORE INTO club_categories (club_id, category_id) VALUES (?, ?)', [clubId, categoryId]);
        }
      }

      // Media table inserts
      if (logoDbPath) {
        // logo stored directly in clubs.logo; nothing to add to club_media for logo
      }
      for (const imgPath of imageDbPaths) {
        await connection.query(
          'INSERT INTO club_media (club_id, media_url, media_type) VALUES (?, ?, ?)',
          [clubId, imgPath, 'image']
        );
      }
      if (videoDbPath) {
        await connection.query(
          'INSERT INTO club_media (club_id, media_url, media_type) VALUES (?, ?, ?)',
          [clubId, videoDbPath, 'video']
        );
      }

      await connection.query('COMMIT');
      connection.release();

      return res.status(201).json({ success: true, message: 'Club created successfully', clubId, adminId });
    } catch (errTx) {
      try { await pool.query('ROLLBACK'); } catch {}
      try { connection.release(); } catch {}
      console.error('Error creating club:', errTx);
      return res.status(500).json({ success: false, message: 'Server error creating club' });
    }

  } catch(err){
    console.error(err);
    return res.status(500).json({
      success:false,
      message:'internal server error'
    })
  }
};
export const getClubActivities = async (req, res) => {
  // Ensure admin is authenticated
  if (!req.admin) {
    return res.status(401).json({ success: false, message: 'Admin authentication required' });
  }

  const admin_id = req.admin.admin_id;
  try {
    // Get all clubs for this admin
    const [clubs] = await pool.query('SELECT club_id FROM clubs WHERE admin_id = ?', [admin_id]);
    if (!clubs || clubs.length === 0) {
      return res.status(200).json({ success: true, activities: [] });
    }

    const clubIds = clubs.map(c => c.club_id);
    // Fetch activities for all club IDs with aggregated images
    const placeholders = clubIds.map(() => '?').join(',');
    const [activities] = await pool.query(
      `SELECT 
         a.activity_id, a.name, a.pitch, a.activity_date, a.main_image, a.club_id,
         COALESCE(JSON_ARRAYAGG(ai.images), JSON_ARRAY()) AS activity_images
       FROM activities a
       LEFT JOIN activities_images ai ON ai.activity_id = a.activity_id
       WHERE a.club_id IN (${placeholders})
       GROUP BY a.activity_id, a.name, a.pitch, a.activity_date, a.main_image, a.club_id`,
      clubIds
    );

    // Build absolute URLs for main and gallery images
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const toAbs = (p) => {
      if (!p) return null;
      if (p.startsWith('http://') || p.startsWith('https://')) return p;
      return `${baseUrl}/${p.replace(/^\/+/, '')}`;
    };
    const processed = activities.map(a => {
      // activity_images may arrive as JSON string or array depending on driver
      let imgs = [];
      if (Array.isArray(a.activity_images)) {
        imgs = a.activity_images;
      } else if (typeof a.activity_images === 'string') {
        try { imgs = JSON.parse(a.activity_images) || []; } catch { imgs = []; }
      }
      // Filter out null entries that can appear from LEFT JOIN aggregation
      const cleanImgs = imgs.filter(Boolean).map((img) => toAbs(String(img)));
      return {
        activity_id: a.activity_id,
        club_id: a.club_id,
        name: a.name,
        pitch: a.pitch,
        activity_date: a.activity_date,
        main_image: a.main_image ? toAbs(a.main_image) : null,
        activity_images: cleanImgs
      };
    });

    return res.status(200).json({ success: true, activities: processed });
  } catch (err) {
    console.log(`Error in GetClubActivities: ${err.message}`);
    return res.status(500).json({ 
      success:false,
      message: 'Internal Server Error' });
  }
}
export const getClubBoardMembers = async (req, res) => {
  // Ensure admin is authenticated
  if (!req.admin) {
    return res.status(401).json({ success: false, message: 'Admin authentication required' });
  }

  const admin_id = req.admin.admin_id;
  try {
    // Get club ids for this admin
    const [clubs] = await pool.query('SELECT club_id FROM clubs WHERE admin_id = ?', [admin_id]);
    if (!clubs || clubs.length === 0) {
      return res.status(200).json({ success: true, board_members: [] });
    }

    const clubIds = clubs.map(c => c.club_id);
    const placeholders = clubIds.map(() => '?').join(',');

    // Select board members
    const [members] = await pool.query(
      `SELECT board_membre_id AS id, fullname, email, image, role, club_id FROM board_membre WHERE club_id IN (${placeholders})`,
      clubIds
    );

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const processed = members.map(m => ({
      id: m.id,
      fullname: m.fullname,
      email: m.email,
      role: m.role,
      club_id: m.club_id,
      image: m.image
        ? (m.image.startsWith('http://') || m.image.startsWith('https://')
            ? m.image
            : `${baseUrl}/${m.image.replace(/^\/+/, '')}`)
        : null
    }));

    return res.status(200).json({ success: true, board_members: processed });
  } catch (err) {
    console.error('Error in getClubBoardMembers:', err.message);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}; 

// Delete activity && board membre controllers 
export const deleteAnActivity = async (req,res)=>{ 
  const connection = await pool.getConnection();
  try {
    const activity_id = req.params.id;

    // Start transaction
    await connection.query('START TRANSACTION');

    const [activityRows] = await connection.query('SELECT * FROM activities WHERE activity_id = ?', [activity_id]);
    if (activityRows.length === 0) {
      await connection.query('ROLLBACK');
      connection.release();
      return res.status(404).json({ 
        success: false,
        message: 'Activity not found.' });
    }

    const activity = activityRows[0];

    const filesToDelete = [];
    if (activity.main_image) filesToDelete.push(activity.main_image);

    // activities_images may or may not exist
    const [activityImageRows] = await connection.query("SELECT images FROM activities_images WHERE activity_id = ?", [activity_id]).catch(() => [ [] ]);
    if (Array.isArray(activityImageRows)) {
      for (const r of activityImageRows) {
        if (r && r.images) filesToDelete.push(r.images);
      }
    }

    // Prepare uploads root
    const serverDir = path.dirname(fileURLToPath(import.meta.url));
    const uploadsRoot = path.join(serverDir, '..', 'uploads');
  const unlinkErrors = [];
  let activityDirDeleted = false;
  let activityDirPath = null;

    for (const mediaPath of filesToDelete) {
      try {
        if (!mediaPath) continue;
        // skip external urls
        if (mediaPath.startsWith('http://') || mediaPath.startsWith('https://')) continue;
        const clean = mediaPath.replace(/^\/+/, '');
        let fullPath;
        if (clean.startsWith('uploads' + path.sep) || clean.startsWith('uploads/')) {
          fullPath = path.join(serverDir, '..', clean);
        } else {
          fullPath = path.join(uploadsRoot, clean);
        }
        const normalized = path.normalize(fullPath);
        if (!normalized.startsWith(path.normalize(uploadsRoot))) {
          // suspicious path, skip
          continue;
        }
        await fs.unlink(normalized).catch(err => {
          if (err.code !== 'ENOENT') unlinkErrors.push({ path: normalized, error: err.message });
        });
        // capture candidate folder from first valid media path
        if (!activityDirPath) {
          const candidate = path.dirname(normalized);
          try {
            const parent = path.basename(path.dirname(candidate));
            // ensure we only delete a folder directly under 'activities'
            if (parent === 'activities') activityDirPath = candidate;
          } catch {}
        }
      } catch (err) {
        unlinkErrors.push({ path: mediaPath, error: err.message });
      }
    }

    // Attempt to delete the entire activity folder (safe-guarded)
    try {
      if (!activityDirPath && filesToDelete.length > 0) {
        // Fallback compute from the first media path if any
        const mediaPath = filesToDelete[0];
        if (mediaPath && !(mediaPath.startsWith('http://') || mediaPath.startsWith('https://'))) {
          const clean = mediaPath.replace(/^\/+/, '');
          const full = clean.startsWith('uploads' + path.sep) || clean.startsWith('uploads/')
            ? path.join(serverDir, '..', clean)
            : path.join(uploadsRoot, clean);
          const normalized = path.normalize(full);
          if (normalized.startsWith(path.normalize(uploadsRoot))) {
            const candidate = path.dirname(normalized);
            const parent = path.basename(path.dirname(candidate));
            if (parent === 'activities') activityDirPath = candidate;
          }
        }
      }
      if (activityDirPath) {
        await fs.rm(activityDirPath, { recursive: true, force: true });
        activityDirDeleted = true;
      }
    } catch (err) {
      unlinkErrors.push({ path: activityDirPath || 'unknown_activity_dir', error: err.message });
    }

    // Delete activity images rows if table exists
    await connection.query("DELETE FROM activities_images WHERE activity_id = ?", [activity_id]).catch(() => {});

    // Delete activity
    await connection.query("DELETE FROM activities WHERE activity_id = ?", [activity_id]);

    await connection.query('COMMIT');
    connection.release();

  return res.status(200).json({ success: true, message: 'Activity deleted', deletedFilesCount: filesToDelete.length, activityDirDeleted, activityDirPath, unlinkErrors });
  } catch (err) {
    console.error('Error deleting activity:', err.message);
    await connection.query('ROLLBACK').catch(() => {});
    try { connection.release(); } catch {}
    return res.status(500).json({
      sccess:false, 
      message: 'Internal Server Error' });
  }
};

export const deleteAnBoardMember = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const boardMemberId = req.params.id;

    await connection.query('START TRANSACTION');

    const [rows] = await connection.query('SELECT * FROM board_membre WHERE board_membre_id = ?', [boardMemberId]);
    if (!rows || rows.length === 0) {
      await connection.query('ROLLBACK');
      connection.release();
      return res.status(404).json({ 
        success:false,
        message: 'Board member not found.' });
    }

    const member = rows[0];
    const filesToDelete = [];
    if (member.image) filesToDelete.push(member.image);

    const serverDir = path.dirname(fileURLToPath(import.meta.url));
    const uploadsRoot = path.join(serverDir, '..', 'uploads');
    const unlinkErrors = [];
    let deletedFilesCount = 0;

    for (const mediaPath of filesToDelete) {
      try {
        if (!mediaPath) continue;
        if (mediaPath.startsWith('http://') || mediaPath.startsWith('https://')) continue;
        const clean = mediaPath.replace(/^\/+/, '');
        let fullPath;
        if (clean.startsWith('uploads' + path.sep) || clean.startsWith('uploads/')) {
          fullPath = path.join(serverDir, '..', clean);
        } else {
          fullPath = path.join(uploadsRoot, clean);
        }
        const normalized = path.normalize(fullPath);
        if (!normalized.startsWith(path.normalize(uploadsRoot))) continue;
        await fs.unlink(normalized).then(() => { deletedFilesCount += 1; }).catch(err => {
          if (err.code !== 'ENOENT') unlinkErrors.push({ path: normalized, error: err.message });
        });
      } catch (err) {
        unlinkErrors.push({ path: mediaPath, error: err.message });
      }
    }

    await connection.query('DELETE FROM board_membre WHERE board_membre_id = ?', [boardMemberId]);

    await connection.query('COMMIT');
    connection.release();

    return res.status(200).json({ success: true, message: 'Board member deleted', deletedFilesCount, unlinkErrors });
  } catch (err) {
    console.error('Error deleting board member:', err.message);
    await connection.query('ROLLBACK').catch(() => {});
    try { connection.release(); } catch {}
    return res.status(500).json({ 
      success:false,
      message: 'Internal Server Error' });
  }
};

export const addActivity = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    // Validate auth
    const admin = req.admin;
    if (!admin) {
      connection.release();
      return res.status(401).json({ success: false, message: 'Admin authentication required' });
    }

    let { activityName, activityPitch, activityDate, clubId } = req.body;
    activityName = String(activityName || '').trim();
    activityPitch = String(activityPitch || '').trim();
    activityDate = String(activityDate || '').trim();

    // If clubId not provided, try infer from admin (must be exactly one club)
    if (!clubId) {
      const [adminClubs] = await connection.query('SELECT club_id FROM clubs WHERE admin_id = ?', [admin.admin_id]);
      if (!adminClubs || adminClubs.length !== 1) {
        connection.release();
        return res.status(400).json({ success: false, message: 'clubId is required' });
      }
      clubId = adminClubs[0].club_id;
    }

    if (!activityName || !activityPitch || !activityDate || !clubId) {
      connection.release();
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    await connection.query('START TRANSACTION');

    // Ensure club exists and get its name
    const [clubs] = await connection.query('SELECT name FROM clubs WHERE club_id = ?', [clubId]);
    if (clubs.length === 0) {
      await connection.query('ROLLBACK');
      connection.release();
      return res.status(404).json({ success: false, message: 'Club not found' });
    }
    const clubName = clubs[0].name || `club_${clubId}`;

    // Sanitize folder names
    const sanitize = (str) => String(str || '')
      .normalize('NFKD')
      .replace(/[^a-zA-Z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .slice(0, 60);

    const sanitizedClubName = sanitize(clubName) || `club-${clubId}`;
    const activitySlug = sanitize(activityName) || `activity-${Date.now()}`;

    // Prepare folders
    const serverDir = path.dirname(fileURLToPath(import.meta.url));
    const baseRoot = path.join(serverDir, '..');
    const uploadsRoot = path.join(baseRoot, 'uploads');
    const activityDir = path.join(uploadsRoot, sanitizedClubName, 'activities', activitySlug);
    await fs.mkdir(activityDir, { recursive: true });

    // Collect files from multer
    const filesArr = Array.isArray(req.files) ? req.files : [];
    const mainFile = filesArr.find(f => f.fieldname === 'mainImage');
    const galleryFiles = filesArr
      .filter(f => /^activityImage\d+$/.test(String(f.fieldname || '')))
      .sort((a, b) => {
        const ai = parseInt(String(a.fieldname).replace('activityImage', ''), 10) || 0;
        const bi = parseInt(String(b.fieldname).replace('activityImage', ''), 10) || 0;
        return ai - bi;
      });

    // Move files into activity folder and build DB paths
    const toDbPath = (absPath) => '/' + path.relative(baseRoot, absPath).replace(/\\/g, '/');
    let mainImageDbPath = '';
    if (mainFile) {
      const mainExt = path.extname(mainFile.originalname || mainFile.filename || '') || path.extname(mainFile.filename);
      const src = path.join(baseRoot, mainFile.destination, mainFile.filename);
      const dest = path.join(activityDir, `main${mainExt}`);
      await fs.rename(src, dest).catch(async () => { await fs.copyFile(src, dest).then(() => fs.unlink(src).catch(() => {})); });
      mainImageDbPath = toDbPath(dest);
    }

    const imageDbPaths = [];
    for (let i = 0; i < galleryFiles.length; i++) {
      const f = galleryFiles[i];
      const ext = path.extname(f.originalname || f.filename || '') || path.extname(f.filename);
      const src = path.join(baseRoot, f.destination, f.filename);
      const dest = path.join(activityDir, `image${i + 1}${ext}`);
      await fs.rename(src, dest).catch(async () => { await fs.copyFile(src, dest).then(() => fs.unlink(src).catch(() => {})); });
      imageDbPaths.push(toDbPath(dest));
    }

    // Insert activity
    const [actInsert] = await connection.query(
      'INSERT INTO activities (name, pitch, activity_date, club_id, main_image) VALUES (?, ?, ?, ?, ?)',
      [activityName, activityPitch, activityDate, clubId, mainImageDbPath]
    );
    const activityId = actInsert.insertId;

    for (const imgPath of imageDbPaths) {
      await connection.query('INSERT INTO activities_images (images, activity_id) VALUES (?, ?)', [imgPath, activityId]);
    }

    await connection.query('COMMIT');
    connection.release();

    // Build absolute URLs for response
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const toAbs = (p) => (!p ? null : (p.startsWith('http') ? p : `${baseUrl}/${p.replace(/^\/+/, '')}`));

    return res.status(201).json({
      success: true,
      message: 'Activity added successfully',
      activity: {
        activity_id: activityId,
        club_id: Number(clubId),
        name: activityName,
        pitch: activityPitch,
        activity_date: activityDate,
        main_image: toAbs(mainImageDbPath),
        activity_images: imageDbPaths.map(toAbs)
      }
    });
  } catch (err) {
    console.error('Error adding activity:', err);
    try { await connection.query('ROLLBACK'); } catch {}
    try { connection.release(); } catch {}
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const addBoardMember = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const admin = req.admin;
    if (!admin) {
      connection.release();
      return res.status(401).json({ success: false, message: 'Admin authentication required' });
    }

    let { fullName, email = null, role, clubId } = req.body;
    fullName = String(fullName || '').trim();
    role = String(role || req.body.position || '').trim();

    if (!clubId) {
      const [adminClubs] = await connection.query('SELECT club_id FROM clubs WHERE admin_id = ?', [admin.admin_id]);
      if (!adminClubs || adminClubs.length !== 1) {
        connection.release();
        return res.status(400).json({ success: false, message: 'clubId is required' });
      }
      clubId = adminClubs[0].club_id;
    }

    if (!fullName || !role || !clubId) {
      connection.release();
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    await connection.query('START TRANSACTION');

    const [clubs] = await connection.query('SELECT name FROM clubs WHERE club_id = ?', [clubId]);
    if (clubs.length === 0) {
      await connection.query('ROLLBACK');
      connection.release();
      return res.status(404).json({ success: false, message: 'Club not found' });
    }
    const clubName = clubs[0].name;

    const sanitize = (str) => String(str || '')
      .normalize('NFKD')
      .replace(/[^a-zA-Z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .slice(0, 60);

    const sanitizedClubName = sanitize(clubName) || `club-${clubId}`;
    const serverDir = path.dirname(fileURLToPath(import.meta.url));
    const baseRoot = path.join(serverDir, '..');
    const uploadsRoot = path.join(baseRoot, 'uploads');
    const boardDir = path.join(uploadsRoot, sanitizedClubName, 'board');
    await fs.mkdir(boardDir, { recursive: true });

    const filesArr = Array.isArray(req.files) ? req.files : [];
    const imageFile = filesArr.find(f => (f.fieldname === 'image' || f.fieldname === 'boardImage' || f.fieldname === 'boardMemberImage'));

    let imageDbPath = null;
    if (imageFile) {
      const ext = path.extname(imageFile.originalname || imageFile.filename || '') || path.extname(imageFile.filename);
      const safeName = sanitize(fullName) || 'member';
      const src = path.join(baseRoot, imageFile.destination, imageFile.filename);
      const dest = path.join(boardDir, `${safeName}${ext}`);
      await fs.rename(src, dest).catch(async () => { await fs.copyFile(src, dest).then(() => fs.unlink(src).catch(() => {})); });
      imageDbPath = '/' + path.relative(baseRoot, dest).replace(/\\/g, '/');
    }

    const [insert] = await connection.query(
      'INSERT INTO board_membre (fullname, email, image, role, club_id) VALUES (?, ?, ?, ?, ?)',
      [fullName, email || null, imageDbPath, role, clubId]
    );

    await connection.query('COMMIT');
    connection.release();

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const toAbs = (p) => (!p ? null : (p.startsWith('http') ? p : `${baseUrl}/${p.replace(/^\/+/, '')}`));

    return res.status(201).json({
      success: true,
      message: 'Board member added successfully',
      member: {
        id: insert.insertId,
        fullname: fullName,
        email: email || null,
        role,
        club_id: Number(clubId),
        image: toAbs(imageDbPath)
      }
    });
  } catch (err) {
    console.error('Error adding board member:', err);
    try { await connection.query('ROLLBACK'); } catch {}
    try { connection.release(); } catch {}
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}

// Update an activity (text fields, optional main image & gallery replacement)
export const updateActivity = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const admin = req.admin;
    if (!admin) {
      connection.release();
      return res.status(401).json({ success: false, message: 'Admin authentication required' });
    }
    const activityId = parseInt(req.params.id, 10);
    if (!activityId) {
      connection.release();
      return res.status(400).json({ success: false, message: 'Invalid activity id' });
    }

    let { activityName, activityPitch, activityDate } = req.body;
    activityName = typeof activityName === 'string' ? activityName.trim() : undefined;
    activityPitch = typeof activityPitch === 'string' ? activityPitch.trim() : undefined;
    activityDate = typeof activityDate === 'string' ? activityDate.trim() : undefined;

    await connection.query('START TRANSACTION');
    const [rows] = await connection.query(
      'SELECT a.activity_id, a.club_id, a.name, a.main_image, c.name AS club_name FROM activities a JOIN clubs c ON a.club_id = c.club_id WHERE a.activity_id = ?',
      [activityId]
    );
    if (!rows.length){
      await connection.query('ROLLBACK');
      connection.release();
      return res.status(404).json({ success:false, message:'Activity not found' });
    }
    const activity = rows[0];

    // Update scalar fields if provided
    if (activityName || activityPitch || activityDate){
      const sets = [];
      const vals = [];
      if (activityName !== undefined){ sets.push('name = ?'); vals.push(activityName); }
      if (activityPitch !== undefined){ sets.push('pitch = ?'); vals.push(activityPitch); }
      if (activityDate !== undefined){ sets.push('activity_date = ?'); vals.push(activityDate); }
      if (sets.length){
        vals.push(activityId);
        await connection.query(`UPDATE activities SET ${sets.join(', ')} WHERE activity_id = ?`, vals);
      }
    }

    // Handle optional image replacements
    const filesArr = Array.isArray(req.files) ? req.files : [];
    const mainFile = filesArr.find(f => f.fieldname === 'mainImage');
    const galleryFiles = filesArr.filter(f => /^activityImage\d+$/.test(String(f.fieldname || '')));

  if (mainFile || galleryFiles.length){
      const sanitize = (str) => String(str || '')
        .normalize('NFKD')
        .replace(/[^a-zA-Z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .slice(0, 60);
      const serverDir = path.dirname(fileURLToPath(import.meta.url));
      const baseRoot = path.join(serverDir, '..');
      const uploadsRoot = path.join(baseRoot, 'uploads');
  const clubSlug = sanitize(activity.club_name) || `club-${activity.club_id}`;
  const oldSlug = sanitize(activity.name) || `activity-${activity.activity_id}`;
  const newSlug = sanitize(activityName || activity.name) || `activity-${activity.activity_id}`;
  const oldDir = path.join(uploadsRoot, clubSlug, 'activities', oldSlug);
  const activityDir = path.join(uploadsRoot, clubSlug, 'activities', newSlug);
      await fs.mkdir(activityDir, { recursive: true });
      const toDbPath = (absPath) => '/' + path.relative(baseRoot, absPath).replace(/\\/g, '/');

      if (mainFile){
        // Remove existing main.* file in target folder before writing new
        try {
          const entries = await fs.readdir(activityDir);
          await Promise.all(entries.filter(n => /^main\.[a-z0-9]+$/i.test(n)).map(n => fs.unlink(path.join(activityDir, n)).catch(() => {})));
        } catch {}
        const src = path.join(baseRoot, mainFile.destination, mainFile.filename);
        const ext = path.extname(mainFile.originalname || mainFile.filename || '') || path.extname(mainFile.filename);
        const dest = path.join(activityDir, `main${ext}`);
        await fs.rename(src, dest).catch(async () => { await fs.copyFile(src, dest).then(() => fs.unlink(src).catch(() => {})); });
        const dbp = toDbPath(dest);
        await connection.query('UPDATE activities SET main_image = ? WHERE activity_id = ?', [dbp, activityId]);
      }

      if (galleryFiles.length){
        await connection.query('DELETE FROM activities_images WHERE activity_id = ?', [activityId]);
        try {
          const entries = await fs.readdir(activityDir);
          await Promise.all(entries.filter(n => /image\d+\./i.test(n)).map(n => fs.unlink(path.join(activityDir, n)).catch(() => {})));
        } catch {}
        const sorted = galleryFiles.sort((a,b)=>{
          const ai = parseInt(String(a.fieldname).replace('activityImage',''),10)||0;
          const bi = parseInt(String(b.fieldname).replace('activityImage',''),10)||0;
          return ai-bi;
        });
        let i=0;
        for (const f of sorted){
          const src = path.join(baseRoot, f.destination, f.filename);
          const ext = path.extname(f.originalname || f.filename || '') || path.extname(f.filename);
          const dest = path.join(activityDir, `image${++i}${ext}`);
          await fs.rename(src, dest).catch(async () => { await fs.copyFile(src, dest).then(() => fs.unlink(src).catch(() => {})); });
          await connection.query('INSERT INTO activities_images (images, activity_id) VALUES (?, ?)', [toDbPath(dest), activityId]);
        }
      }

      // If the slug changed and we uploaded new files, remove the old directory to avoid leftovers
      if (oldDir !== activityDir) {
        try { await fs.rm(oldDir, { recursive: true, force: true }); } catch {}
      }
    }

    await connection.query('COMMIT');
    connection.release();

    // Return updated activity
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const toAbs = (p) => (!p ? null : (p.startsWith('http') ? p : `${baseUrl}/${p.replace(/^\/+/,'')}`));
    const [[updated]] = await pool.query(
      `SELECT a.activity_id, a.club_id, a.name, a.pitch, a.activity_date, a.main_image,
              COALESCE(JSON_ARRAYAGG(ai.images), JSON_ARRAY()) AS activity_images
       FROM activities a
       LEFT JOIN activities_images ai ON a.activity_id = ai.activity_id
       WHERE a.activity_id = ?`, [activityId]
    );
    let imgs=[]; try{ imgs = JSON.parse(updated.activity_images)||[] }catch{ imgs=[] }
    return res.json({ success:true, message:'Activity updated successfully', activity:{
      activity_id: updated.activity_id,
      club_id: updated.club_id,
      name: updated.name,
      pitch: updated.pitch,
      activity_date: updated.activity_date,
      main_image: toAbs(updated.main_image),
      activity_images: imgs.map(toAbs)
    }});
  } catch (err) {
    console.error('Error updating activity:', err);
    try { await connection.query('ROLLBACK'); } catch {}
    try { connection.release(); } catch {}
    return res.status(500).json({ success:false, message:'Internal Server Error' });
  }
}

// Update board member (text fields and optional image)
export const updateBoardMember = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const admin = req.admin;
    if (!admin) {
      connection.release();
      return res.status(401).json({ success: false, message: 'Admin authentication required' });
    }
    const memberId = parseInt(req.params.id, 10);
    if (!memberId){
      connection.release();
      return res.status(400).json({ success:false, message:'Invalid member id' });
    }

    let { fullName, email = null, role } = req.body;
    fullName = typeof fullName === 'string' ? fullName.trim() : undefined;
    role = typeof role === 'string' ? role.trim() : (typeof req.body.position === 'string' ? req.body.position.trim() : undefined);

    await connection.query('START TRANSACTION');
    const [rows] = await connection.query(
      'SELECT bm.board_membre_id as id, bm.fullname, bm.email, bm.image, bm.role, bm.club_id, c.name as club_name FROM board_membre bm JOIN clubs c ON bm.club_id = c.club_id WHERE bm.board_membre_id = ?',
      [memberId]
    );
    if (!rows.length){
      await connection.query('ROLLBACK');
      connection.release();
      return res.status(404).json({ success:false, message:'Board member not found' });
    }
    const current = rows[0];

    if (fullName !== undefined || email !== undefined || role !== undefined){
      const sets=[]; const vals=[];
      if (fullName !== undefined){ sets.push('fullname = ?'); vals.push(fullName); }
      if (email !== undefined){ sets.push('email = ?'); vals.push(email || null); }
      if (role !== undefined){ sets.push('role = ?'); vals.push(role); }
      if (sets.length){ vals.push(memberId); await connection.query(`UPDATE board_membre SET ${sets.join(', ')} WHERE board_membre_id = ?`, vals); }
    }

    const filesArr = Array.isArray(req.files) ? req.files : [];
    const imageFile = filesArr.find(f => (f.fieldname === 'image' || f.fieldname === 'boardImage' || f.fieldname === 'boardMemberImage'));
    if (imageFile){
      // Remove previous image file when replacing (only for local uploads)
      try {
        const prev = current.image;
        if (prev && !(prev.startsWith('http://') || prev.startsWith('https://'))){
          const serverDir = path.dirname(fileURLToPath(import.meta.url));
          const baseRoot = path.join(serverDir, '..');
          const clean = prev.replace(/^\/+/,'');
          const full = clean.startsWith('uploads/') || clean.startsWith('uploads\\') ? path.join(baseRoot, clean) : path.join(baseRoot, 'uploads', clean);
          const normalized = path.normalize(full);
          const uploadsRoot = path.join(baseRoot, 'uploads');
          if (normalized.startsWith(path.normalize(uploadsRoot))) {
            await fs.unlink(normalized).catch(() => {});
          }
        }
      } catch {}
      const sanitize = (str) => String(str || '')
        .normalize('NFKD')
        .replace(/[^a-zA-Z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .slice(0, 60);
      const serverDir = path.dirname(fileURLToPath(import.meta.url));
      const baseRoot = path.join(serverDir, '..');
      const uploadsRoot = path.join(baseRoot, 'uploads');
      const clubSlug = sanitize(current.club_name) || `club-${current.club_id}`;
      const memberSlug = sanitize(fullName || current.fullname) || `member-${memberId}`;
      const boardDir = path.join(uploadsRoot, clubSlug, 'board');
      await fs.mkdir(boardDir, { recursive: true });
      const src = path.join(baseRoot, imageFile.destination, imageFile.filename);
      const ext = path.extname(imageFile.originalname || imageFile.filename || '') || path.extname(imageFile.filename);
      const dest = path.join(boardDir, `${memberSlug}${ext}`);
      await fs.rename(src, dest).catch(async () => { await fs.copyFile(src, dest).then(() => fs.unlink(src).catch(() => {})); });
      const dbp = '/' + path.relative(baseRoot, dest).replace(/\\/g, '/');
      await connection.query('UPDATE board_membre SET image = ? WHERE board_membre_id = ?', [dbp, memberId]);
    }

    await connection.query('COMMIT');
    connection.release();

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const toAbs = (p) => (!p ? null : (p.startsWith('http') ? p : `${baseUrl}/${p.replace(/^\/+/,'')}`));
    const [[updated]] = await pool.query('SELECT board_membre_id as id, fullname, email, image, role, club_id FROM board_membre WHERE board_membre_id = ?', [memberId]);
    return res.json({ success:true, message:'Board member updated successfully', member: {
      id: updated.id,
      fullname: updated.fullname,
      email: updated.email,
      role: updated.role,
      club_id: updated.club_id,
      image: toAbs(updated.image)
    }});
  } catch (err){
    console.error('Error updating board member:', err);
    try { await connection.query('ROLLBACK'); } catch {}
    try { connection.release(); } catch {}
    return res.status(500).json({ success:false, message:'Internal Server Error' });
  }
}

export const getClubStatistics = async (req, res)=>{

  try {
    const admin = req.admin;
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Admin authentication required' });
    }
    const adminId = admin.admin_id;

    // Get all clubs for this admin
    const [clubRows] = await pool.query(
      'SELECT club_id AS id, name, creation_date AS created_date, views, likes FROM clubs WHERE admin_id = ?',
      [adminId]
    );
    if (!clubRows || clubRows.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          admin_id: adminId,
          clubs_count: 0,
          counters: {
            likes: 0,
            views: 0,
            reviews: 0,
            activities: 0,
            board_members: 0,
            media: { images: 0, videos: 0 },
            categories_count: 0,
          },
          categories: [],
          last_activity_date: null,
          clubs: []
        }
      });
    }

    const clubIds = clubRows.map(r => r.id);
    const placeholders = clubIds.map(() => '?').join(',');

    // Parallel aggregate queries across all clubs for this admin
    const [
      [reviewsCntRows],
      [activitiesCntRows],
      [boardCntRows],
      [imagesCntRows],
      [videosCntRows],
      [categoriesRows],
      [likesCntRows],
      [viewsCntRows],
      [lastActRows],
    ] = await Promise.all([
      pool.query(`SELECT COUNT(*) AS cnt FROM reviews WHERE club_id IN (${placeholders})`, clubIds),
      pool.query(`SELECT COUNT(*) AS cnt FROM activities WHERE club_id IN (${placeholders})`, clubIds),
      pool.query(`SELECT COUNT(*) AS cnt FROM board_membre WHERE club_id IN (${placeholders})`, clubIds),
      pool.query(`SELECT COUNT(*) AS cnt FROM club_media WHERE media_type = 'image' AND club_id IN (${placeholders})`, clubIds),
      pool.query(`SELECT COUNT(*) AS cnt FROM club_media WHERE media_type = 'video' AND club_id IN (${placeholders})`, clubIds),
      pool.query(`SELECT DISTINCT ca.name FROM club_categories cc JOIN categories ca ON cc.category_id = ca.category_id WHERE cc.club_id IN (${placeholders})`, clubIds),
      pool.query(`SELECT COUNT(*) AS cnt FROM club_likes WHERE club_id IN (${placeholders})`, clubIds).catch(() => [ [ { cnt: null } ] ]),
      pool.query(`SELECT COUNT(*) AS cnt FROM club_views WHERE club_id IN (${placeholders})`, clubIds).catch(() => [ [ { cnt: null } ] ]),
      pool.query(`SELECT MAX(activity_date) AS last_activity_date FROM activities WHERE club_id IN (${placeholders})`, clubIds),
    ]);

    const safeCnt = (rows) => (rows && rows[0] && typeof rows[0].cnt === 'number') ? rows[0].cnt : 0;
    const reviews = safeCnt(reviewsCntRows);
    const activities = safeCnt(activitiesCntRows);
    const board_members = safeCnt(boardCntRows);
    const images = safeCnt(imagesCntRows);
    const videos = safeCnt(videosCntRows);
    const likesLive = (likesCntRows && likesCntRows[0] && likesCntRows[0].cnt != null) ? likesCntRows[0].cnt : null;
    const viewsLive = (viewsCntRows && viewsCntRows[0] && viewsCntRows[0].cnt != null) ? viewsCntRows[0].cnt : null;
    const likesSnapshot = clubRows.reduce((sum, r) => sum + (typeof r.likes === 'number' ? r.likes : 0), 0);
    const viewsSnapshot = clubRows.reduce((sum, r) => sum + (typeof r.views === 'number' ? r.views : 0), 0);
    const likes = likesLive ?? likesSnapshot;
    const views = viewsLive ?? viewsSnapshot;
    const categories = Array.isArray(categoriesRows) ? categoriesRows.map(r => r.name) : [];
    const last_activity_date = (lastActRows && lastActRows[0]) ? lastActRows[0].last_activity_date : null;

    return res.status(200).json({
      success: true,
      data: {
        admin_id: adminId,
        clubs_count: clubRows.length,
        counters: {
          likes,
          views,
          reviews,
          activities,
          board_members,
          media: { images, videos },
          categories_count: categories.length,
        },
        categories,
        last_activity_date,
        clubs: clubRows.map(c => ({ id: c.id, name: c.name, created_date: c.created_date }))
      }
    });
  } catch (err) {
    console.error('Error fetching club statistics:', err);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }

}