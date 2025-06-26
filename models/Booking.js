const mongoose = require("mongoose");

const BookingSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  tripPackages: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TripPackages",
    required: true,
  },
  noOfPerson: {
    type: Number,
    required: true,
  },
  totalAmount: {
    type: Number,
  },
  status: {
    type: String,
    enum: ["pending", "success", "failed", "cancelled"],
    default: "pending",
  },
  orderId: {
    type: String,
  },
  contactDetails: {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Bookings", BookingSchema);
