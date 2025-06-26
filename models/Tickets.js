const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  subject: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ["open", "inprogress", "closed"],
    default: "open",
  },
  resolution: {
    type: String,
    trim: true,
  },
//   assignedTo: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User", // ya "Admin" agar separate role schema hai
//   },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Ticket", ticketSchema);
