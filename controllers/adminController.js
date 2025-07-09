const User = require("../models/User");
const TripPackage=require("../models/TripPakages")
const Booking = require("../models/Booking");



exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ role: "admin" });
    const totalPackages = await TripPackage.countDocuments();
    const totalBookings = await Booking.countDocuments();
  const totalRevenueData = await Booking.aggregate([
  { $group: { _id: null, total: { $sum: "$totalAmount" } } }, 
]);
const totalRevenue = totalRevenueData[0]?.total || 0;
    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name email") // ✅ populate user
      .populate("tripPackage", "title"); // ✅ populate package

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalAdmins,
        totalPackages,
        totalBookings,
        totalRevenue,
        recentBookings,
      },
    });
  } catch (err) {
    console.error("Error in dashboard stats:", err);
    res.status(500).json({ success: false, message: "Failed to fetch dashboard stats" });
  }
};