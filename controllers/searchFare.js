const fs = require("fs").promises;
const path = require("path");
const SearchQuery = require("../models/SearchQuerySchema");

const fs = require("fs/promises");
const path = require("path");
const SearchQuery = require("../models/SearchQuery");

exports.searchFare = async (req, res) => {
  try {
    const userId = req.user.id;
    const { from, to, travelDate, modeOfTransport } = req.body;

    // Save query to DB
    await SearchQuery.create({
      user: userId,
      searchType: "fare",
      queryDetails: { from, to, travelDate, modeOfTransport },
    });

    const allModes = ["bus", "train", "flight"];
    const selectedModes = modeOfTransport
      ? [modeOfTransport.toLowerCase()]
      : allModes;

    let allResults = [];

    for (const mode of selectedModes) {
      const fileName = `${mode}Data.json`;
      const filePath = path.join(__dirname, "..", "data", fileName);

      try {
        const fileData = await fs.readFile(filePath, "utf-8");
        const parsedData = JSON.parse(fileData);

        const filtered = parsedData.filter(
          (item) =>
            item.from.toLowerCase() === from.toLowerCase() &&
            item.to.toLowerCase() === to.toLowerCase()
        );

        console.log(`${mode.toUpperCase()} results: ${filtered.length}`);
        console.log(
          filtered.map((x) => ({
            operator: x.operator,
            fare: x.fare,
            from: x.from,
            to: x.to,
          }))
        );

        allResults = [...allResults, ...filtered];
      } catch (err) {
        console.warn(`Error reading data for mode: ${mode} -> ${err.message}`);
      }
    }

    res.status(200).json({
      success: true,
      message: "Fare search successful",
      data: allResults,
    });
  } catch (error) {
    console.log("Server Error:", error.message);
    res.status(500).json({
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
