const { default: mongoose } = require("mongoose");

const SearchQuerySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  searchType: { type: String, enum: ["fare", "aiTrip"], required: true },
  queryDetails: { type: mongoose.Schema.Types.Mixed }, // jo bhi user ne search me dala
  createdAt: { type: Date, default: Date.now },
});

module.exports=mongoose.model("SaerchQuery",SearchQuerySchema)