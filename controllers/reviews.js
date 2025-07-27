// controllers/reviewController.js

const Reviews = require("../models/Reviews");
const Booking = require("../models/Booking");

exports.createReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { tripPackageId, rating, comment } = req.body;

    // check booking
    const booking = await Booking.findOne({
      user: userId,
      tripPackage: tripPackageId,
      status: "success",
    });

    if (!booking) {
      return res.status(400).json({
        success: false,
        message: "You can only review a package after booking.",
      });
    }

    // check existing review
    const existingReview = await Reviews.findOne({
      user: userId,
      tripPackage: tripPackageId,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this package.",
      });
    }

    const review = await Reviews.create({
      user: userId,
      tripPackage: tripPackageId,
      rating,
      comment,
    });

    return res.status(201).json({
      success: true,
      message: "Review added successfully.",
      review,
    });
  } catch (error) {
    
    return res.status(500).json({
      success: false,
      message: "Internal Server Error while creating review.",
    });
  }
};

exports.getAllReviewsOfPackage = async (req, res) => {
  try {
    const { packageId } = req.params;

    const reviews = await Reviews.find({ tripPackage: packageId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      reviews,
    });
  } catch (error) {
   
    return res.status(500).json({
      success: false,
      message: "Internal Server Error while fetching reviews.",
    });
  }
};

