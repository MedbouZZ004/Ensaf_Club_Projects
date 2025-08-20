import pool from "../db/connectDB.js";

// Get all clubs
export const getAllClubsForHomePage = async (req, res) => {
  try {
    // Get the base URL dynamically
    const PORT = process.env.PORT || 5000;
    //Automatically gets http://localhost:PORT or production host.
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    // This  Fetch all clubs
    const [clubs] = await pool.query(
      "SELECT club_id, name, description, logo, views, likes FROM clubs"
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
  const { club_id } = req.params; 

  try {
    const [club] = await pool.query(
      "SELECT club_id, name, description, image, logo, category, views, likes, creation_date FROM clubs WHERE club_id = ?",
      [club_id]
    );

    if (club.length === 0) {
      return res.status(404).json({ message: "Club not found." });
    }

    return res.status(200).json(club[0]); 
  } catch (err) {
    console.error("Error fetching club by ID:", err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const likeClub = async (req, res) => {
  const { id } = req.params;  
  const club_id = id;          

  try {
    const [rows] = await pool.query(
      "SELECT club_id, likes FROM clubs WHERE club_id = ?",
      [club_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Club not found." });
    }

    await pool.query(
      "UPDATE clubs SET likes = likes + 1 WHERE club_id = ?",
      [club_id]
    );

    return res.status(200).json({ message: "Club liked successfully!" });
  } catch (err) {
    console.error("Error liking club:", err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//think about adding a like_tables to enable like and unlike 

export const addViews = async (req,res)=>{
  const { id } = req.params;
  const club_id = id;

  try {
    const [club] = await pool.query(
      "SELECT club_id, likes FROM clubs WHERE club_id = ?",
      [club_id]
    );

    if (club.length === 0) {
      return res.status(404).json({ message: "Club not found." });
    }

    await pool.query("UPDATE clubs SET views = views + 1 WHERE club_id = ?", [
      club_id,
    ]);

    return res.status(200).json({ message: "Club viewed successfully!" });
  } catch (err) {
    console.error("Error addd views to  club:", err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
