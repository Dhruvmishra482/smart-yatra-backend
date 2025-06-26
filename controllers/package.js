const TripPackages = require("../models/TripPakages");
const { uploadImageToCloudinary } = require("../utils/imageUploader");




exports.createPackage = async (req, res) => {
  try {
    const userId = req.user.id;

    const { title, description, location, price, days, category, highlights } =
      req.body;

    // Validate required fields
    if (!title || !description || !location || !price || !days || !category) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields to create a package.",
      });
    }

    // Validate images
    if (!req.files || !req.files.images) {
      return res.status(400).json({
        success: false,
        message: "At least one image is required.",
      });
    }

    // Normalize image input (single or multiple)
    const imagesArray = Array.isArray(req.files.images)
      ? req.files.images
      : [req.files.images];

    // Upload all images to Cloudinary
    const uploadedImages = [];

    for (let image of imagesArray) {
      const result = await uploadImageToCloudinary(
        image,
        "SmartYatra/Packages"
      );
      uploadedImages.push({ url: result.secure_url });
    }

    // Create new package
    const newPackage = new TripPackages({
      title,
      description,
      location,
      price,
      days,
      category,
      highlights,
      images: uploadedImages,
      createdBy: userId,
    });

    const savedPackage = await newPackage.save();

    return res.status(201).json({
      success: true,
      message: "Trip Package created successfully.",
      data: savedPackage,
    });
  } catch (error) {

    return res.status(500).json({
      success: false,
      message: "Unable to create trip package. Please try again later.",
    });
  }
};

//getsinglePackage

exports.getSinglePackage = async (req, res) => {
  try {
    const packageId = req.params.id;

    if (!packageId) {
      return res.status(400).json({
        success: false,
        message: "Package ID is required",
      });
    }

    // Find the package and populate createdBy and reviews.user
    const fetchedPackage = await TripPackages.findById(packageId)
      .populate("createdBy", "name email") // creator info
      .populate("reviews.user", "name email"); // review user info

    if (!fetchedPackage) {
      return res.status(404).json({
        success: false,
        message: "Trip Package not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Trip Package fetched successfully",
      data: fetchedPackage,
    });
  } catch (error) {
  
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

//getAllPackage

exports.getAllPackage = async (req, res) => {
  try {
    const allPackages = await TripPackages.find()
      .populate("createdBy", "name email") // Creator info
      .populate("reviews.user", "name email"); // Reviewers info

    return res.status(200).json({
      success: true,
      message: "All Trip Packages fetched successfully",
      data: allPackages,
    });
  } catch (error) {

    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching trip packages",
    });
  }
};

//update package


exports.updatePackage = async (req, res) => {
  try {
    const packageId = req.params.id;

    if (!packageId) {
      return res.status(400).json({
        success: false,
        message: "Package ID is required",
      });
    }

    const fetchedPackage = await TripPackages.findById(packageId);
    if (!fetchedPackage) {
      return res.status(404).json({
        success: false,
        message: "Package not found",
      });
    }

    //  Optimized partial field update
    const allowedFields = [
      "title",
      "description",
      "price",
      "days",
      "location",
      "highlights",
      "category",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field]) {
        fetchedPackage[field] = req.body[field];
      }
    });

    //  IMAGE UPDATE LOGIC
    // images can be passed in req.files.images (multiple files)
    const replaceImages = req.body.replaceImages === "true";
     // default false

     








    if (req.files && req.files.images) {
      const imageFiles = Array.isArray(req.files.images)
        ? req.files.images
        : [req.files.images];

      const uploadedImages = [];

      for (let file of imageFiles) {
        const result = await uploadImageToCloudinary(
          file,
          "SmartYatra/Packages"
        );
        uploadedImages.push({
          url: result.secure_url,
          description: "", // optional, can add logic later
        });
      }

      if (replaceImages) {
        // replace old images
        fetchedPackage.images = uploadedImages;
      } else {
        // append new images
        fetchedPackage.images.push(...uploadedImages);
      }
    }

    fetchedPackage.updatedAt = Date.now();
    const updatedPackage = await fetchedPackage.save();

    return res.status(200).json({
      success: true,
      message: "Trip package updated successfully",
      data: updatedPackage,
    });
  } catch (error) {
  
    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating trip package",
    });
  }
};

//deletePackage

exports.deletePackage = async (req, res) => {
  try {
    const  packageId  = req.params.id;

    if (!packageId) {
   
      
      return res.status(400).json({
     
        
        success: false,
        message: "Package ID is required",
      });
    }

    await TripPackages.findByIdAndDelete(packageId, { new: true });
    return res.status(200).json({
      success: true,
      message: "package deleted successfully",
    });
  } catch (error) {

    return res.status(500).json({
      success: false,
      message: "Something went wrong while deleting trip package",
    });
  }
};


