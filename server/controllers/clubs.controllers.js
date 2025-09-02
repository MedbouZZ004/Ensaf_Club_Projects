import pool from "../db/connectDB.js";
import { USER_MESSAGE_TO_ADMIN } from '../utils/emailTemplates.js';
import transporter from '../config/nodemailer.config.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

// Get all clubs
export const getAllClubsForHomePage = async (req, res) => {
  try {
    const PORT = process.env.PORT || 5000;
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
        logo: club.logo ? `${baseUrl}/${club.logo.replace(/^\/+/, "")}`: null,
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
}