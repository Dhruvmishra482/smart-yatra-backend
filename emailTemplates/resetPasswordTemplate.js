exports.resetPasswordTemplate = (resetLink) => {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2 style="color: #2e6c80;">🔐 Reset Your Password</h2>
      <p>Hello,</p>
      <p>We received a request to reset your password. Click the button below to create a new password:</p>
      
      <a href="${resetLink}" target="_blank" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
        Reset Password
      </a>

      <p style="margin-top: 20px;">If you did not request a password reset, please ignore this email or contact support.</p>
      
      <p>Thanks,<br><strong>Smart Yatra Team</strong></p>
      
      <hr style="margin-top: 30px;"/>
      <small style="color: gray;">This link will expire in 15 minutes for security reasons.</small>
    </div>
  `;
};
