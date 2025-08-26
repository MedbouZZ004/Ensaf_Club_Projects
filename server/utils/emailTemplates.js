 
 export const VERIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Verify Your Email</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>Thank you for signing up! Your verification code is:</p>
    <div style="text-align: center; margin: 30px 0;">
      <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #4CAF50;">{verificationCode}</span>
    </div>
    <p>Enter this code on the verification page to complete your registration.</p>
    <p>If you didn't create an account with us, please ignore this email.</p>
    <p>Best regards,<br>Your App Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`; 

 export const RESETING_PASSWORD_OTP = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #c01515ff, #c71d1dff); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">RESET YOUR PASSWORD </h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>Here ! Your Reseting  code :</p>
    <div style="text-align: center; margin: 30px 0;">
      <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #4CAF50;">{verificationCode}</span>
    </div>
    <p>Enter this code on the reseting page  to complete your password reseting.</p>
    <p>If you didn't ask for reseting ,  please ignore this email.</p>
    <p>Best regards,<br>Your App Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;
export const USER_MESSAGE_TO_ADMIN = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Message From User</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 650px; margin: 0 auto; padding: 20px; background-color: #f5f6fa;">
  <!-- Header -->
  <div style="background: linear-gradient(to right, #0078d7, #005bb5); padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 24px;">📩 New Message Received</h1>
    <p style="color: #e4e4e4; margin: 5px 0; font-size: 14px;">A user has just sent you a message through the contact form.</p>
  </div>

  <!-- Body -->
  <div style="background-color: #ffffff; padding: 25px; border-radius: 0 0 8px 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
    <p style="font-size: 16px; color: #555;">Hello Admin,</p>
    <p style="font-size: 15px; color: #444;">You have received a new message from <strong>{userName}</strong> via the contact form.</p>

    <!-- User Details -->
    <div style="background-color: #f1faff; padding: 15px; border-left: 4px solid #0078d7; border-radius: 5px; margin: 20px 0;">
      <p style="margin: 5px 0;"><strong>👤 Name:</strong> {userName}</p>
      <p style="margin: 5px 0;"><strong>📧 Email:</strong> {userEmail}</p>
    </div>

    <!-- Message Content -->
    <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; border: 1px solid #eee;">
      <p style="margin: 0; font-size: 14px; line-height: 1.7; color: #333;"><strong>📝 Message:</strong></p>
      <p style="white-space: pre-line; margin: 8px 0 0; color: #555; font-size: 15px;">{userMessage}</p>
    </div>

    <p style="margin-top: 25px; color: #555; font-size: 14px;">Please respond to this user as soon as possible.</p>
    <p style="margin: 10px 0 0; color: #333; font-weight: bold;">Your App Team</p>
  </div>

  <!-- Footer -->
  <div style="text-align: center; margin-top: 15px; color: #888; font-size: 12px;">
    <p>This is an automated notification. Please do not reply directly to this email.</p>
  </div>
</body>
</html>
`;
