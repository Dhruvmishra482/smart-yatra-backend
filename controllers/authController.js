const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { v4: uuidv4 } = require("uuid");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleAuthController = async (req, res) => {
  try {
    const { idToken } = req.body;
    console.log("ID TOKEN RECEIVED:", idToken);

    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

const { name, email, picture, sub } = ticket.getPayload();
const [firstName, ...rest] = name?.trim().split(" ") || [];
const lastName = rest?.join(" ") || "User";

let user = await User.findOne({ email });

if (!user) {
  user = await User.create({
    firstName: firstName || "Google",
    lastName: lastName,
    email,
    mobileNumber: "0000000000",
    image: picture,
    password: sub || uuidv4(),
    accountType: "visitor",
  });
}

const token = jwt.sign(
  {
    id: user._id,
    email: user.email,
    role: user.accountType,
    firstName: user.firstName,
  },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);

    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: true,
      sameSite: "none",
    };

    res.cookie("token", token, options).status(200).json({
      success: true,
      message: "Google Login Success",
      token,
    });
  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(500).json({
      success: false,
      message: "Google authentication failed",
    });
  }
};
