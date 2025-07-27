const AiTripPlan = require("../models/AiTripPlan");
// const openai = require("../config/openai"); // Uncomment this if OpenAI is configured

exports.createTripAi = async (req, res) => {
  try {
    // Rename `days` → `noOfDays` to match Mongoose schema
    const input = {
      ...req.body,
      noOfDays: req.body.days,
    };

    const { noOfDays, budget, interests, location } = input;
    const userId = req.user?.id || "guest";

    // ====== OPENAI Logic (Optional - Uncomment below to activate) ======
    /*
    const prompt = `
      You are a travel AI. Generate a detailed ${noOfDays}-day trip itinerary to ${location} for a person
      interested in ${interests} with a budget of ₹${budget}.
      Give each day's activities in bullets and a tips section.
      Format response as JSON like:
      {
        "day1": "...",
        "day2": "...",
        ...
        "tips": [ "tip1", "tip2" ]
      }
    `;

    const aiResponse = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const generatedItinerary = JSON.parse(aiResponse.data.choices[0].message.content);
    */

    // ====== Static Itinerary (Fallback when OpenAI disabled) ======
    const generatedItinerary = {
      day1: `Explore top places in ${location}`,
      day2: `Enjoy local food and budget-friendly activities`,
      day3: `Visit heritage places related to ${interests}`,
      tips: ["Book in advance", "Stay hydrated", "Use local transport"],
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
