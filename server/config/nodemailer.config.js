 import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  host:'smtp-relay.brevo.com',
  port:587,
  secure: false,
  auth:{
    user:process.env.SMTP_USER,
    pass:process.env.SMTP_PASSWORD
  }
});
// Verify connection configuration when the module is loaded
transporter.verify()
  .then(() => console.log('SMTP transporter ready'))
  .catch(err => console.error('SMTP transporter verification failed:', err));

export default transporter;
