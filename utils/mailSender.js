const nodemailer = require("nodemailer");
require("dotenv").config();

const mailSender = async (email, title, body) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: 587, //  Added default SMTP port
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    let info = await transporter.sendMail({
      from: `"SMARTYATRA | Tour Planner" <${process.env.MAIL_USER}>`,
      to: email,
      subject: title,
      html: body,
    });

    console.log(" Mail sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error(" Mail sending failed:", error);
    throw error;
  }
};

module.exports = mailSender;
