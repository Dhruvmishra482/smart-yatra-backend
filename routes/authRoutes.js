const express = require("express");
const router = express.Router();

const {googleAuthController}=require("../controllers/authController")



router.post("/google", googleAuthController);

module.exports=router