import pool from "../db/connectDB.js";


export const getUserProfil = async (req,res)=>{
    const getUserId= req.user?.user_id;

    try {
        const currentUser = await pool.query('SELECT user_id , full_name , major , email , isaccountverified  FROM users WHERE user_id=$1',[getUserId]);
        if(!currentUser){
            return res.status(404).json({message:'User not found'});
        } 
        res.status(200).json({
            User : {
                userId : currentUser.rows[0].user_id,
                fullname : currentUser.rows[0].full_name,
                major:currentUser.rows[0].major,
                email : currentUser.rows[0].email,
                isaccountverified :currentUser.rows[0].isaccountverified 
            }
        })
    } catch(err){
        console.log("Get user profil error",err.message);
        res.status(500).json({message:"Internal server error"});
    }
}