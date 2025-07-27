const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const mailSender = require("../utils/mailSender");
const OTP = require("../models/Otp");
const User = require("../models/User");
const { otpTemplate } = require("../emailTemplates/otpTemplate");
const {
  resetPasswordTemplate,
} = require("../emailTemplates/resetPasswordTemplate");
const {passwordreset}=require("../emailTemplates/passwordreset")
const Otp = require("../models/Otp");
require("dotenv").config();

//signup controller

// exports.signUp = async (req, res) => {
//   try {
//     //fetch data from request
//     const {
//       firstName,
//       lastName,
//       mobileNumber,
//       email,
//       password,
//       confirmPassword,
//       accountType,
//     } = req.body;
//     //check if data is missing
//     if (
//       !firstName ||
//       !lastName ||
//       !mobileNumber ||
//       !email ||
//       !confirmPassword ||
//       !accountType ||
//       !password
//     ) {
//       return res.status(403).send({
//         success: false,
//         message: "all feilds are required",
//       });
//     }

//     //check if user alreadyb exits

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({
//         success: false,
//         message: "user alreadyt exits",
//       });
//     }

//     //check if password and confirm password match
//     if (password != confirmPassword) {
//       return res.status(400).json({
//         success: false,
//         message: "password and confirm password doesnot match",
//       });
//     }
//     // //send otp
//     // const otp=otpGenerator.generate(6,{
//     //     upperCaseAlphabets:false,
//     //     specialChars:false,
//     // })
//     // //delete any old otp for this email
//     // await OTP.deleteMany({email})
//     // //save otp in db
//     // await OTP.create({
//     //     email,
//     //     otp,
//     // })
//     // // send otp mail
//     // await mailSender(email,"verification otp",otpTemplate(otp))
//     // //verify otp
//     // const recentOtp=await OTP.findOne({email}).sort({createdAt:-1})
//     // if(!recentOtp|| recentOtp!==otp){
//     //      return res.status(400).json({
//     //     success: false,
//     //     message: "Invalid or expired OTP",
//     //   });
//     // }
//     //hashed the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     //create user
//     const user = await User.create({
//       firstName,
//       lastName,
//       password: hashedPassword,
//       mobileNumber,
//       email,
//       accountType,
//     });
//     return res.status(200).json({
//       success: true,
//       user,
//       message: "user created succesfully",
//     });
//   } catch (error) {
//       console.log("Signup Error:", error);
//     return res.status(404).json({
//       success: false,
//       message: "user cannot be registered please try again",
//     });
//   }
// };

exports.signUp = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      mobileNumber,
      email,
      password,
      confirmPassword,
      accountType,
    } = req.body;

    if (
      !firstName || !lastName || !mobileNumber ||
      !email || !password || !confirmPassword || !accountType
    ) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Passwords do not match" });
    }

// const config = {
//   digits: true,
//   alphabets: false,
//   upperCaseAlphabets: false,
//   specialChars: false,
// };


// const otp = otpGenerator.generate(6, config);
const generateNumericOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const otp = generateNumericOTP();


    await OTP.deleteMany({ email });
    await OTP.create({ email, otp });

    await mailSender(email, "Your OTP for Signup", otpTemplate(otp));

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      userData: { firstName, lastName, mobileNumber, email, password, accountType },
    });
  } catch (error) {
  
    return res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
};



// exports.sendOTP = async (req, res) => {
//   try {
//     const { email } = req.body;

//     if (!email) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Email is required" });
//     }

//     const existingOtp = await OTP.findOne({ email });
//     if (existingOtp) await OTP.deleteOne({ email });

//     const otp = otpGenerator.generate(6, {
//       upperCaseAlphabets: false,
//       specialChars: false,
//     });

//     await OTP.create({ email, otp });
//     await mailSender(email, "Verify your OTP", otpTemplate(otp));

//     return res
//       .status(200)
//       .json({ success: true, message: "OTP sent successfully" });
//   } catch (error) {
//     console.error("Error sending OTP:", error);
//     return res
//       .status(500)
//       .json({ success: false, message: "Failed to send OTP" });
//   }
// };
// exports.verifyOTP = async (req, res) => {
//   try {
//     const { email, otp } = req.body;

//     if (!email || !otp) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Email and OTP are required" });
//     }

//     const existingOTP = await OTP.findOne({ email, otp });

//     if (!existingOTP) {
//       return res.status(400).json({ success: false, message: "Invalid OTP" });
//     }

//     await OTP.deleteOne({ email });

//     return res
//       .status(200)
//       .json({ success: true, message: "OTP verified successfully" });
//   } catch (error) {
//     console.error("Error verifying OTP:", error);
//     return res
//       .status(500)
//       .json({ success: false, message: "OTP verification failed" });
//   }
// };

exports.verifyOTP = async (req, res) => {
  try {
    const {
      otp,
      firstName,
      lastName,
      mobileNumber,
      email,
      password,
      accountType,
    } = req.body;

    if (!otp || !email) {
      return res.status(400).json({ success: false, message: "OTP and Email are required" });
    }

    const response = await OTP.findOne({ email, otp });

    if (!response) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

   
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      password: hashedPassword,
      mobileNumber,
      email,
      accountType,
    });

   
    await OTP.deleteMany({ email });

    return res.status(200).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    
    return res.status(500).json({
      success: false,
      message: "Failed to verify OTP and register",
    });
  }
};

exports.login = async (req, res) => {
  try {
    //fetch email and password
    const { email, password } = req.body;
    //check for missing values
    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "please fill all required details",
      });
    }
    //find user exits or not
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: "user does not exits",
      });
    }
    //genrete jwt and compare password
    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        {
          email: user.email,
          role: user.accountType,
          id: user._id,
          firstName: user.firstName,
             lastName: user.lastName,
            mobileNumber: user.mobileNumber,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "24h",
        }
      );
      user.token = token;
      user.password = undefined;
      //set cookie and options
    const options = {
  expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  httpOnly: true,
  secure: true,
  sameSite: "none", // ✅ allow frontend (Vercel) to send cookie to backend (Railway)
};

      res.cookie("token", token, options).status(200).json({
        token,
        user,
        success: true,
        message: "login success",
      });
     

    } else {
      return res.status(401).json({
        success: false,
        message: "password is incorrect",
      });
    }
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "cant able to login,please try again",
    });
  }
};



exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email)
      return res.status(400).json({ success: false, message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ success: false, message: "User does not exist" });

    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

   const resetLink = `${process.env.FRONT_END_URL}/reset-password/${token}`;


    await mailSender(
      user.email,
      "Reset Your Password - Smart Yatra",
      resetPasswordTemplate(resetLink)
    );

    return res.status(200).json({
      success: true,
      message: "Reset link sent to your email",
    });

  } catch (error) {

    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};




exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword, confirmPassword } = req.body;

    if (!token || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    await mailSender(
      user.email,
      "Password Reset Successful - Smart Yatra",
      passwordreset(user.firstName)
    );

    return res.status(200).json({
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (error) {

    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again.",
    });
  }
};