const express = require("express");
const router = express.Router();
const { createTripAi } = require("../controllers/aiplan")
const {auth}=require("../middleware/auth")


router.post("/generate-trip", auth, createTripAi);

module.exports=router