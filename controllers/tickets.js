const Tickets = require("../models/Tickets");

const User = require("../models/User");

exports.createTicket = async (req, res) => {
  try {
    //get user details and input
    const userId = req.user.id
    const { subject, description } = req.body;

    if (!userId) {
     
      
      return res.status(401).json({
        success: false,
        message: "user not found",
      });
    }

    if (!subject || !description) {
      return res.status(403).json({
        success: false,
        message: "fill all required details",
      });
    }
    const createdTicket= await Tickets.create({
      user: userId,
      subject,
      description,
    });

    return res.status(200).json({
      success: true,
      message: "tickets created succesfully",
       ticket: createdTicket,
    });
  } catch (error) {
  
    
    return res.status(500).json({
      success: false,
      message: "error while creating ticket",
    });
  }
};

//getUserTicekts

exports.getUserTickets = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(403).json({
        success: false,
        message: "user not found",
      });
    }

    const ticketResult = await Tickets.find({ user: userId }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      message: "ticekts finded succesfully",
      data: ticketResult,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "unable to find tickets",
    });
  }
};

//getAllTicekts for admin view

exports.getAllTickets = async (req, res) => {
  try {
    //  Extract status from query params (e.g., ?status=open)
    const { status } = req.query;

    //  Create dynamic filter object
    const filter = {};
    if (status) {
      filter.status = status;
    }

    // 📦 Fetch tickets from DB based on filter
    const allTickets = await Tickets.find(filter).populate(
      "user",
      "name email"
    ); // populate if needed

    return res.status(200).json({
      success: true,
      message: "All tickets fetched successfully",
      data: allTickets,
    });
  } catch (error) {
   
    return res.status(500).json({
      success: false,
      message: "Unable to fetch tickets",
    });
  }
};

//updateTicketStatus

exports.updateTicketStatus = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { status, resolution } = req.body;

    const allowedStatuses = ["open", "inprogress", "closed"];

    //  Invalid status check
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be one of: open, inprogress, closed.",
      });
    }

    //  Closed status must include resolution
    if (status === "closed" && (!resolution || resolution.trim() === "")) {
      return res.status(400).json({
        success: false,
        message: "Resolution is required when closing a ticket.",
      });
    }

    //  Prepare update object
    const updateObj = {
      status,
      updatedAt: Date.now(),
    };

    if (resolution) {
      updateObj.resolution = resolution;
    }

    //  Update ticket
    const updatedTicket = await Tickets.findByIdAndUpdate(ticketId, updateObj, {
      new: true,
    }).populate("user", "name email"); // Optional

    if (!updatedTicket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Ticket status and resolution updated successfully",
      updatedTicket,
    });
  } catch (error) {
   
    return res.status(500).json({
      success: false,
      message: "Server error while updating ticket",
    });
  }
};


//delete ticket for user
exports.deleteTicket = async (req, res) => {
  try {
    const userId = req.user.id
    const ticketId = req.params.ticketId

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const ticket = await Tickets.findOne({ _id: ticketId, user: userId });
    if (!ticket) {
      
      
      return res.status(404).json({
        success: false,
        message: "Ticket not found or unauthorized access",
      });
    }

    await Tickets.findByIdAndDelete(ticketId);

    return res.status(200).json({
      success: true,
      message: "Ticket deleted successfully",
    });
  } catch (error) {
   
    
    return res.status(400).json({
      success: false,
      message: "Unable to delete ticket",
    });
  }
};
