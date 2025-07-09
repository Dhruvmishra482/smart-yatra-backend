const mongoose = require("mongoose");

const tripPackageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },

  description: {
    type: String,
    required: true,
  },

  location: {
    type: String,
    trim: true,
    required:true,
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  rating: {
    type: Number,
    default: 0,
  },

  reviews: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      comment: {
        type: String,
      },
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],

  price: {
    type: Number,
    required: true,
  },

  images: [
    {
      url: {
        type: String,
      },
      description: {
        type:String
      },
    },
  ],

  days: {
    type: Number,
    required: true,
  },

  category: {
    type: String,
    required: true,
    trim: true,
    enum: ["Adventure", "Leisure", "Spiritual", "Wildlife", "Family", "Solo", "Other"],
    default: "Other",
  },

  highlights: [
    {
      type: String,
      trim: true,
    },
  ],

  totalBookings: {
    type: Number,
    default: 0, // Automatically increase when someone buys
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update `updatedAt` before each save
tripPackageSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});
module.exports = mongoose.model("TripPackages", tripPackageSchema);

