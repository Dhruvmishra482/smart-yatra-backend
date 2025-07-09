const express = require("express");
const { getDashboardStats } = require("../controllers/adminController");
const { auth, isAdmin } = require("../middleware/auth")

const router = express.Router();

router.get("/dashboard-stats", auth, isAdmin, getDashboardStats);

module.exports = router;
