const express = require("express");
const router = express.Router();

const {
  login,
  signUp,
  forgotPassword,
  resetPassword,
  verifyOTP
} = require("../controllers/auth");

router.post("/login", login);
router.post("/signup", signUp);
router.post("/forgotpassword", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/verify-otp", verifyOTP);



module.exports = router;
