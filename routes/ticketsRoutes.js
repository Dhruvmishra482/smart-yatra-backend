const express=require("express")
const router=express.Router()

const {createTicket,getUserTickets,getAllTickets,updateTicketStatus,deleteTicket}=require("../controllers/tickets")

const {auth,isAdmin,isVisitor}=require("../middleware/auth")

// router.post("/create-ticket",auth,isVisitor,createTicket)
// router.get("/getusertickets",auth,isVisitor,getUserTickets)
// router.get("/getallticekts",auth,isAdmin,getAllTickets)
// router.put("/ticket/:ticketId/status", auth, isAdmin, updateTicketStatus);
// router.delete("/deleteticket",auth,isVisitor,deleteTicket)

router.post("/createticket", auth, isVisitor, createTicket);

//  Get all tickets for a user (visitor)
router.get("/tickets/user", auth, isVisitor, getUserTickets);

//  Get all tickets (admin only) - with optional filters
router.get("/tickets", auth, isAdmin, getAllTickets);

//  Update status/resolution of a ticket (admin only)
router.put("/ticket/:ticketId/status", auth, isAdmin, updateTicketStatus);

//  Delete a ticket by ticket ID (user only)
router.delete("/ticket/:ticketId", auth, isVisitor, deleteTicket);

module.exports=router