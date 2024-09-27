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

        if (result) {
            return res.status(201).json({ message: "Ticket submitted successfully", ticket: result });
        } else {
            return res.status(400).json({ message: "Ticket submission failed. Amount and description are required." });
        }
    } catch (error) {
        console.error("Error submitting ticket:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
})

router.put("/update", authenticateManagerToken, async (req, res) => {
    try {
        const { ticket_id, status } = req.body;
        const result = await TicketService.updateTicket(ticket_id, status);

        if (result) {
            return res.status(201).json({ message: "Ticket udpated successfully", ticket: result });
        } else {
            return res.status(400).json({ message: "Ticket update failed." });
        }

    } catch (error) {
        console.error("Error updating ticket status:", error);
        return res.status(500).json({ message: "Internal server error"});
    }
})

router.get("/usertickets", authenticateToken, async (req, res) => {
    try {
        const username = req.user.username;

        const result = await TicketService.getUserTickets(username);

        if (result) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json({ message: "This user has no prior tickets." });
        }
    } catch (error) {
        console.error("Error fetching tickets:", error);
        return res.status(500).json({ message: "Internal server error"});
    }
})

router.get("/filteredtickets", authenticateManagerToken, async (req, res) => {
    try {
        const { status } = req.body;
        const result = await TicketService.getFilterTickets(status);

        if (result) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json({ message: `There are currently no ${status} tickets.` });
        }
    } catch (error) {
        console.error("Error fetching tickets:", error);
        return res.status(500).json({ message: "Internal server error"});
    }
})

module.exports = router;