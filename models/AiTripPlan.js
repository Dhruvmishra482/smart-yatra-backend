const mongoose = require("mongoose");

const AiTripPlanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  inputPreference: {
    noOfDays: {
      type: String,
      required: true,
    },
    budget: {
      type: Number,
      required: true,
    },
    interests: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
  },
  generatedItinerary: {
    type: mongoose.Schema.Types.Mixed, 
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("AiTripPlan", AiTripPlanSchema);

