const express = require("express");
const router = express.Router();

const { auth,isVisitor, isAdmin } = require("../middleware/auth");
const {
  createOrder,
  verifyPayment,
  getUserBookings,
  getAdminAllBookings,
  getPackageBuyers
} = require("../controllers/payment");

//  Order Create (on Buy button click)
router.post("/create-order/:id", auth, createOrder);

//  Payment Verification (after payment)
router.post("/verify", auth, verifyPayment);

//  User bookings (My bookings page)
router.get("/user", auth,isVisitor, getUserBookings);

router.get("/buyers/:packageId", auth, isAdmin, getPackageBuyers);

//  Admin – All bookings
router.get("/admin", auth, isAdmin, getAdminAllBookings);

module.exports = router;
