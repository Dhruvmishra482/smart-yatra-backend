const fs = require("fs").promises;  // promise based fs
const path = require("path");
const SearchQuery = require("../models/SearchQuerySchema")

exports.searchFare = async (req, res) => {
  try {
    const userId = req.user.id;
    const { from, to, travelDate, modeOfTransport } = req.body;
      

    // 1. DB me user search query save karo asynchronously (save hone do)
    const searchRecord = new SearchQuery({
      user: userId,
      searchType: "fare",
      queryDetails: { from, to, travelDate, modeOfTransport },
    });
    await searchRecord.save();

    // 2. Mode ke hisab se mock data file ka path set karo
    let fileName;
    if (modeOfTransport === "bus") fileName = "busData.json";
    else if (modeOfTransport === "train") fileName = "trainData.json";
    else if (modeOfTransport === "flight") fileName = "flightData.json";
    else {
      // Agar mode invalid ya nahi diya, sab data merge karne ke liye ya error
      // yahan simple ek error return kar dete hain for clarity
      return res.status(400).json({ success: false, message: "Invalid transport mode" });
    }

    // 3. File ka absolute path banao (server folder structure ke hisab se)
    const filePath = path.join(__dirname, "..", "data", fileName);

    // 4. Async file read karo (promise based)
    const fileData = await fs.readFile(filePath, "utf-8");

    // 5. Parse karo json me
    const mockData = JSON.parse(fileData);

    // 6. Filter karo user ke input ke hisab se
    const fares = mockData.filter(
      (item) =>
        item.from.toLowerCase() === from.toLowerCase() &&
        item.to.toLowerCase() === to.toLowerCase()
    );

    // 7. Result bhejo
    res.status(200).json({
      success: true,
      message: "Fare search successful",
      data: fares,
    });
  } catch (error) {
   
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
