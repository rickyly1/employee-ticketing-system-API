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

    return tickets;
}

async function getFilterTickets(status) {
    const tickets = await TicketDao.getFilterTickets(status);

    return tickets;
}

async function submitTicket(ticket, username) {
    if (!ticket.amount || !ticket.description) {
        return null;
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

async function updateTicket(ticketId, status) {
    if (status != "approved" && status != "denied") {
        return null;
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