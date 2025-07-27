exports.createTripAi = async (req, res) => {
  try {
    const input = req.body; // FIXED ✅
    const { days, budget, interests, location } = input;
    const userId = req.user.id;

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
    return res.status(500).json({
      success: false,
      message: "Failed to generate trip itinerary",
    });
  }
};

