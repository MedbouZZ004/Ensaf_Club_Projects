import pool from "../db/connectDB.js";

// Get all clubs
export const getAllClubsForHomePage = async (req, res) => {
  try {
    // Get the base URL dynamically
    const PORT = process.env.PORT || 5000;
    //Automatically gets http://localhost:PORT or production host.
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    // This  Fetch all clubs, include per-user liked flag when available
    const [clubs] = await pool.query(
      `SELECT 
         c.club_id, c.name, c.description, c.logo, c.views, c.likes,
         EXISTS(SELECT 1 FROM club_likes cl WHERE cl.club_id = c.club_id AND cl.user_id = ?) AS likedByMe
       FROM clubs c`,
      [req.user?.user_id ?? null]
    );

    if (clubs.length === 0) {
      return res.status(404).json({ message: "No clubs found." });
    }

    // This  Fetch categories for all clubs at once
    const [categories] = await pool.query(`
      SELECT cc.club_id, ca.name AS category_name
      FROM club_categories AS cc
      JOIN categories AS ca ON cc.category_id = ca.category_id
    `);

    // This  Attach categories to their clubs
    const clubsWithCategories = clubs.map(club => {
      const clubCats = categories
        .filter(cat => cat.club_id === club.club_id)
        .map(cat => cat.category_name);

      return {
        ...club,
        // ensure boolean for likedByMe
        likedByMe: Boolean(club.likedByMe),
        logo: club.logo ? `${baseUrl}/${club.logo.replace(/^\/+/, "")}` : null,
        categories: clubCats
      };
    });
    return res.status(200).json(clubsWithCategories);
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
    return res.status(201).json({message:"Review added successfully!"});


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
