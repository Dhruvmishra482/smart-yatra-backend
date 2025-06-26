const express = require("express");
const router = express.Router();
const { searchFare ,getAllUsersSearchHistory} = require("../controllers/searchFare");
 // jo controller bana rakha hai

const {auth, isAdmin} = require("../middleware/auth"); 

// Fare search route (logged in user ke liye protected route)
router.post("/search",auth, searchFare);
router.get("/search-history/all", auth, isAdmin, getAllUsersSearchHistory);


module.exports = router;
