const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    mobileNumber: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    // confirmPassword: {
    //   type: String,
    //   required: true,
    // },
    accountType: {
      type: String,
      enum: ["visitor", "admin"],
      required: true,
      default: "visitor",
    },
    token: {
      type: String,
    },
    // resetPasswordToken: {
    //   type:String,
    // },

    resetPasswordExpires: {
      type: Date,
    },
    image: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
