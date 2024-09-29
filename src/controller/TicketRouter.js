const express = require("express");
const router = express.Router();
const TicketService = require("../service/TicketService");
const { authenticateToken, authenticateManagerToken } = require("./Middleware");

/*
    Ticket Object Model
        {
            ticket_id: number (unique, required)
            amount: number (required)
            description: string (required)
            employee: string (employee's username, required)
            status: string (must be "pending", "approved", or "denied")
        }
*/

router.post("/submit", authenticateToken, async (req, res) => {
    try {
        const ticketData = req.body;
        const username = req.user.username;
        const result = await TicketService.submitTicket(ticketData, username);
        return res.status(201).json({ message: "Ticket submitted successfully", ticket: result });

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
})

router.put("/update", authenticateManagerToken, async (req, res) => {
    try {
        const { ticket_id, status } = req.body;
        const managerUsername = req.user.username;
        const result = await TicketService.updateTicket(managerUsername, ticket_id, status);
        return res.status(200).json({ message: "Ticket udpated successfully", ticket: result });

    } catch (error) {
        return res.status(400).json({ message: error.message});
    }
})

router.get("/usertickets", authenticateToken, async (req, res) => {
    try {
        const username = req.user.username;
        const result = await TicketService.getUserTickets(username);

        return res.status(200).json(result);

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
})

router.get("/filteredtickets", authenticateManagerToken, async (req, res) => {
    try {
        const status = req.query.status;
        const result = await TicketService.getFilterTickets(status);
        return res.status(200).json(result);

    } catch (error) {
        return res.status(400).json({ message: error.message});
    }
})

module.exports = router;