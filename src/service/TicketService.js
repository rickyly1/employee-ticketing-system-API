const TicketDao = require("../repository/TicketDAO");
const uuid = require("uuid");

/*
    Ticket Object Model
        {
            ticket_id: number (unique, required)
            amount: number (required)
            description: string (required)
            employee: string (employee's username, required)
            status: number ((default) 0 = pending, 1 = approved, 2 = denied)
        }
*/

async function getUserTickets(username) {
    const tickets = await TicketDao.getUserTickets(username);

    return tickets;
}

async function getPendingTickets() {
    const tickets = await TicketDao.getPendingTickets();

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
        status: 0 // Default status is pending
    };

    let data = await TicketDao.submitTicket(newTicket);
    return data;
}

async function updateTicket(ticketId, status) {
    if (status != 1 && status != 2) {
        return null;
    }

    const data = await TicketDao.updateTicket(ticketId, status);
    return data;
}

module.exports = {
    submitTicket,
    updateTicket,
    getUserTickets,
    getPendingTickets
};