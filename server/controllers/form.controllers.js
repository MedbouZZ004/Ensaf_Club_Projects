import { USER_MESSAGE_TO_ADMIN } from '../utils/emailTemplates.js';

export const submitForm = async (req, res) => {
    const { subject, text, admin_id } = req.body;
    const { userInfo } = req.user; // Assuming req.user contains authenticated user info

    try {
        // Get admin email
        const [adminInfo] = await pool.query(
            "SELECT email FROM admins WHERE admin_id = ?",
            [admin_id]
        );
        if (adminInfo.length === 0) {
            return res.status(404).json({ message: "Admin not found" });
        }

        const email = adminInfo[0].email;

        // Replace template placeholders dynamically
        const emailContent = USER_MESSAGE_TO_ADMIN
            .replace(/{userName}/g, userInfo.name)         
            .replace(/{userEmail}/g, userInfo.email)             
            .replace(/{userMessage}/g, text);             

        const mailOptions = {
            from: userInfo.email, 
            to: email,            
            subject: subject || "New Contact Form Message",
            html: emailContent    
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({ message: "Form submitted successfully" });

    } catch (err) {
        console.error("Error sending email:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
