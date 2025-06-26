// utils/emailTemplates/otpTemplate.js

exports.otpTemplate = (otp) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
      <h2 style="color: #4CAF50;">Smart Yatra - Email Verification</h2>
      <p>Dear Traveler,</p>
      <p>Thank you for registering with <strong>Smart Yatra</strong>! To complete your verification, please use the OTP below:</p>

      <div style="text-align: center; margin: 30px 0;">
        <h1 style="background-color: #f0f0f0; display: inline-block; padding: 15px 30px; border-radius: 8px; color: #333;">${otp}</h1>
      </div>

      <p>This OTP is valid for <strong>5 minutes</strong>. Do not share it with anyone.</p>
      <br/>

      <p>If you did not request this OTP, you can safely ignore this email.</p>

      <hr style="margin-top: 30px;"/>
      <p style="font-size: 12px; color: #999;">&copy; 2025 Smart Yatra | Travel made smarter with AI</p>
    </div>
  `;
};
