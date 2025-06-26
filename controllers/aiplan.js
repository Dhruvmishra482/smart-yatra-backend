const OpenAI = require("openai");
const AiTripPlan = require("../models/AiTripPlan");

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY, // .env me API key 
// });


exports.createTripAi = async (req, res) => {
  try {
    // 
    const { inputPreference } = req.body;
    const { noOfDays, budget, interests, location } = inputPreference || {};
    const userId = req.user.id;

    //code in case of api calling
    // const prompt = `Plan a detailed ${noOfDays}-day trip to ${location} in India for a person with a budget of ₹${budget}, who is interested in ${interests}. Include daily itinerary, activities, and travel tips.`;

   
    // const response = await openai.chat.completions.create({
    //   model: "gpt-4o",
    //   messages: [{ role: "user", content: prompt }],
    // });

    // const generatedPlan = response.choices[0].message.content;

     const generatedItinerary = {
      day1: `Explore top places in ${inputPreference.location}`,
      day2: `Enjoy local food and budget-friendly activities`,
      day3: `Visit heritage places related to ${inputPreference.interests}`,
      tips: ["Book in advance", "Stay hydrated", "Use local transport"]
    };


    const savedTrip = await AiTripPlan.create({
      user: userId,
      inputPreference,
      generatedItinerary,
    });

   
    return res.status(200).json({
      success: true,
      message: "AI Trip Itinerary generated successfully",
      data: savedTrip,
    });
  } catch (error) {
  
    return res.status(500).json({
      success: false,
      message: "Failed to generate trip itinerary",
    });
  }
};


