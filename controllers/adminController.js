const User = require("../models/User");
const TripPackage = require("../models/TripPakages");
const Booking = require("../models/Booking");
const Reviews = require("../models/Reviews");
const SearchQuery = require("../models/SearchQuery");

exports.getDashboardStats = async (req, res) => {
  try {
    // ✅ Parallel counts for performance
    const [
      totalUsers,
      totalAdmins,
      totalPackages,
      totalBookings,
      totalReviews,
      totalSearches,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "admin" }),
      TripPackage.countDocuments(),
      Booking.countDocuments(),
      Reviews.countDocuments(),
      SearchQuery.countDocuments(),
    ]);

    // 💰 Total Revenue
    const revenueResult = await Booking.aggregate([
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);
    const totalRevenue = revenueResult?.[0]?.total || 0;

    // 🆕 Latest 5 bookings
    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name email")
      .populate("tripPackage", "title");

    // 🔍 Top 5 most searched routes
    const topRoutes = await SearchQuery.aggregate([
      {
        $group: {
          _id: { from: "$queryDetails.from", to: "$queryDetails.to" },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    // 🌟 Top 5 rated packages
    const topRatedPackages = await Reviews.aggregate([
      {
        $group: {
          _id: "$tripPackage",
          avgRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
      { $sort: { avgRating: -1 } },
      { $limit: 5 },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalAdmins,
        totalPackages,
        totalBookings,
        totalRevenue,
        totalReviews,
        totalSearches,
        recentBookings,
        topRoutes,
        topRatedPackages,
      },
    });
  } catch (err) {
    console.error("❌ Dashboard error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard stats",
    });
  }
};
