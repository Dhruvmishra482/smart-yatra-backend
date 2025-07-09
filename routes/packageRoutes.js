const express = require("express");
const router = express.Router();

const {
  createPackage,
  getSinglePackage,
  getAllPackage,
  updatePackage,
  deletePackage,
} = require("../controllers/package");



const { auth, isVisitor, isAdmin } = require("../middleware/auth");

//  Create Trip Package (Admin Only)
router.post("/create", auth, isAdmin, createPackage);

// Get Single Trip Package
router.get("/getpackage/:id", getSinglePackage);

// Get All Trip Packages
router.get("/getallpackage", getAllPackage);

//  Update Package (Admin Only)
router.put("/updatepackage/:id", auth, isAdmin, updatePackage);

// Delete Package (Admin Only)
router.delete("/deletepackage/:id", auth, isAdmin, deletePackage);




module.exports = router;


