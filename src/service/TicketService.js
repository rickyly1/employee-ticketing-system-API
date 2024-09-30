const TicketDao = require("../repository/TicketDAO");
const uuid = require("uuid");

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

async function getUserTickets(username) {
    const tickets = await TicketDao.getUserTickets(username);

    if (!tickets || tickets.length === 0) {
        throw new Error(`Employee "${username}" currently has no tickets.`);
    }

    return tickets;
}

async function getFilterTickets(status) {
    if (status !== "pending" || status !== "denied" || status !== "approved") {
        throw new Error(`Invalid status type "${status}" provided`)
    }
    const tickets = await TicketDao.getFilterTickets(status);

    if (!tickets || tickets.length === 0) {
        throw new Error(`There are currently no ${status} tickets.`);
    }

    return tickets;
}

async function submitTicket(ticket, username) {
    if (!ticket.amount || !ticket.description) {
        throw new Error("Amount and description are required fields.");
    }

    let newTicket = {
        ticket_id: uuid.v4(),
        amount: ticket.amount,
        description: ticket.description,
        employee: username,
        status: "pending" // Default status is pending
    };

    let data = await TicketDao.submitTicket(newTicket);
    return data;
}

async function updateTicket(username, ticketId, status) {
    if (status != "approved" && status != "denied") {
        throw new Error("Invalid status change provided");
    }

    const ticket = await TicketDao.getTicketById(ticketId);
    if (!ticket) {
        throw new Error("The ticket you are attemting to update does not exist.");
    } 
    if (ticket.employee == username) {
        throw new Error("Ticket update cancelled. A manager cannot update their own ticket.");
    }

    const data = await TicketDao.updateTicket(ticketId, status);
    return data;
}

module.exports = {
    submitTicket,
    updateTicket,
    getUserTickets,
    getFilterTickets
};