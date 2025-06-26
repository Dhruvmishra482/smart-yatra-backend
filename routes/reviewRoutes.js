
const express = require("express");
const { createReview, getAllReviewsOfPackage } = require("../controllers/reviews");
const { auth } = require("../middleware/auth");

const router = express.Router();

router.post("/create-review", auth, createReview);
router.get("/reviews/:packageId", getAllReviewsOfPackage);

module.exports = router;