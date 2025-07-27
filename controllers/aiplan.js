const AiTripPlan = require("../models/AiTripPlan");
// const openai = require("../config/openai"); // Uncomment if using OpenAI

exports.createTripAi = async (req, res) => {
  try {
    const input = req.body;
    const { days, budget, interests, location } = input;

    const userId = req.user?.id || "guest"; // fallback in case of no auth

    // Future use: Generate plan from OpenAI
    /*
    const prompt = `Plan a ${days}-day trip to ${location} with a budget of ₹${budget}. Interests: ${interests}`;
    const aiResponse = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });
    const generatedItinerary = JSON.parse(aiResponse.data.choices[0].message.content);
    */

    // Simple placeholder plan
    const generatedItinerary = {
      day1: `Explore top places in ${location}`,
      day2: `Enjoy local food and budget-friendly activities`,
      day3: `Visit heritage places related to ${interests}`,
      tips: ["Book in advance", "Stay hydrated", "Use local transport"]
    };

    const savedTrip = await AiTripPlan.create({
      user: userId,
      inputPreference: input,
      generatedItinerary,
    });

    return res.status(200).json({
      success: true,
      message: "AI Trip Itinerary generated successfully",
      data: savedTrip,
    });
  } catch (error) {
    console.error("Trip AI Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate trip itinerary",
    });
  }
};
