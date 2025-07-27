
const fs = require("fs").promises;
const path = require("path");
const SearchQuery = require("../models/SearchQuerySchema");

exports.searchFare = async (req, res) => {
  try {
    const userId = req.user.id;
    const { from, to, travelDate, modeOfTransport } = req.body;

    // Step 1: Save Search Record
    const searchRecord = new SearchQuery({
      user: userId,
      searchType: "fare",
      queryDetails: { from, to, travelDate, modeOfTransport },
    });
    await searchRecord.save();

    // Step 2: Select files based on transport mode
    let filesToRead = [];

    if (!modeOfTransport || modeOfTransport === "") {
      filesToRead = ["busData.json", "trainData.json", "flightData.json"];
    } else {
      const validModes = ["bus", "train", "flight"];
      if (!validModes.includes(modeOfTransport)) {
        return res.status(400).json({
          success: false,
          message: "Invalid mode of transport",
        });
      }
      filesToRead = [`${modeOfTransport}.json`];
    }

    // Step 3: Read and merge fare data
    let allFares = [];

    for (const file of filesToRead) {
      const filePath = path.join(__dirname, "..", "data", file);
      const fileContent = await fs.readFile(filePath, "utf-8");
      const parsedData = JSON.parse(fileContent);

      const matchedFares = parsedData.filter(
        (item) =>
          item.from.toLowerCase() === from.toLowerCase() &&
          item.to.toLowerCase() === to.toLowerCase()
      );

      allFares.push(...matchedFares);
    }

    // Step 4: Return response
    return res.status(200).json({
      success: true,
      message: "Fare search successful",
      data: allFares,
    });
  } catch (error) {
    console.error("Fare Search Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during fare search",
    });
  }
};



exports.getUserSearchHistory = async (req, res) => {
  try {
    const userId = req.params.userId; // user ID URL se milega

    // DB se us user ki search history le lo, recent pehle
    const searchHistory = await SearchQuery.find({ user: userId }).sort({ createdAt: -1 });

    if (!searchHistory || searchHistory.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No search history found for this user.",
      });
    }

    res.status(200).json({
      success: true,
      data: searchHistory,
    });
  } catch (error) {
    
    res.status(500).json({
      success: false,
      message: "Server error while fetching search history.",
    });
  }
};


// Admin ke liye: Sabhi users ki search history laao
exports.getAllUsersSearchHistory = async (req, res) => {
  try {
    const allSearchHistory = await SearchQuery.find()
      .populate("user", "name email accountType") // user ke basic details bhi laoge
      .sort({ createdAt: -1 }); // naya wala sabse upar

    if (!allSearchHistory || allSearchHistory.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No search history found for any user.",
      });
    }

    res.status(200).json({
      success: true,
      message: "All users' search history fetched successfully",
      data: allSearchHistory,
    });
  } catch (error) {
    
    res.status(500).json({
      success: false,
      message: "Server error while fetching all users' search history",
    });
  }
};
