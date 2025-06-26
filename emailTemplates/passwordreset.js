// emailTemplates.js
exports.passwordreset = (firstName) => {
  return `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2 style="color: #4CAF50;">Password Reset Successful</h2>
    <p>Hi ${firstName},</p>
    <p>Your password has been reset successfully. You can now log in with your new password.</p>
    <p>If you did not request this change, please contact our support immediately.</p>
    <br/>
    <p>Thanks,<br/>Smart Yatra Team</p>
  </div>
  `;
};
