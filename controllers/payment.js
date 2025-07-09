require("dotenv").config();
const crypto = require("crypto");
const TripPackages = require("../models/TripPakages");
const Booking = require("../models/Booking");
const mailSender = require("../utils/mailSender");
const bookingSuccessTemplate = require("../emailTemplates/bookingSuccessTemplate");
const bookingFailedTemplate = require("../emailTemplates/bookingFailedTemplate");

console.log("RAZORPAY_KEY_ID (Backend):", process.env.RAZORPAY_KEY_ID);
console.log("RAZORPAY_KEY_SECRET (Backend):", process.env.RAZORPAY_KEY_SECRET);

Razorpay = require("razorpay");
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const packageId = req.params.id;
    const { noOfPersons } = req.body;

    if (!packageId || !noOfPersons) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: noOfPersons or packageId",
      });
    }
    const tripPackage = await TripPackages.findById(packageId);
    if (!tripPackage) {
      return res.status(404).json({
        success: false,
        message: "Trip Package not found",
      });
    }

    const pricePerPerson = tripPackage.price;
    const totalAmount = noOfPersons * pricePerPerson * 100;

    


 const receiptId = `order_receipt_${Date.now()}`;

 
   
const order = await razorpayInstance.orders.create({
  amount: totalAmount,
  currency: "INR",
  receipt: receiptId, 
  notes: {
    userId: userId.toString(),
    packageId: packageId.toString(),
    noOfPersons: noOfPersons.toString(),
  },
});
    return res.status(200).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {

    return res.status(500).json({
      success: false,
      message: "Failed to create order",
       error: error.message,
    });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      noOfPersons,
      contactDetails,
      tripPackageId,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isValid = expectedSignature === razorpay_signature;
    const status = isValid ? "success" : "failed";

    const selectedPackage = await TripPackages.findById(tripPackageId);
    if (!selectedPackage) {
      return res.status(404).json({
        success: false,
        message: "Trip package not found",
      });
    }

    const booking = await Booking.create({
      user: req.user.id,
      tripPackages: tripPackageId,
      noOfPerson: noOfPersons,
      totalAmount: selectedPackage.price * noOfPersons,
      orderId: razorpay_order_id,
      status,
      contactDetails,
    });

    const subject = isValid
      ? "Booking Confirmed - Smart Yatra"
      : "Booking Failed - Smart Yatra";

    const template = isValid ? bookingSuccessTemplate : bookingFailedTemplate;

    await mailSender(contactDetails.email, subject, template, {
      userName: contactDetails.name,
      packageName: selectedPackage.title,
      amountPaid: booking.totalAmount,
      noOfPersons,
    });

    return res.status(200).json({
      success: true,
      message: `Payment ${status} and Booking ${isValid ? "confirmed" : "logged"}`,
    });
  } catch (error) {
    console.error("Payment Verify Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong during payment verification",
    });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate("tripPackages")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {

    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

exports.getPackageBuyers = async (req, res) => {
  try {
    const packageId = req.params.packageId;

    const buyers = await Booking.find({
      tripPakages: packageId,
      status: "success",
    })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: buyers,
    });
  } catch (error) {
  
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

exports.getAdminAllBookings = async (req, res) => {
  try {
    //  Find all bookings sorted by recent first
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("tripPackage", "title price location")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "All bookings fetched successfully",
      data: bookings,
    });
  } catch (error) {
  
    return res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
    });
  }
};
