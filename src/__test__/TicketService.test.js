const TicketService = require("../service/TicketService");
const TicketDao = require("../repository/TicketDAO");

const uuid = require("uuid");
jest.mock("uuid");
jest.mock("../repository/TicketDAO");

describe("TicketService Tests", () => {

    test("Should return ticket for successful ticket submission", async () => {
        const mockTicket = {
            amount: 100,
            description: "travel"
        }

        const mockTicketReturn = {
            ticket_id: "12345",
            amount: 100,
            description: "travel",
            employee: "mockemployee",
            status: "pending"
        }

        uuid.v4.mockReturnValue("12345");
        TicketDao.submitTicket.mockReturnValue(mockTicketReturn);

        const result = await TicketService.submitTicket(mockTicket, "mockemployee");
        expect(result).toEqual(mockTicketReturn);
    });

    test("Should return null if ticket submission is missing amount/description", async () => {
        const result = await TicketService.submitTicket({ description: "travel" }, "mockemployee");
        expect(result).toBeNull();

        const result2 = await TicketService.submitTicket({ amount: 100 }, "mockemployee");
        expect(result2).toBeNull();
    });

    test("Should return updated ticket when successful", async () => {
        const ticketId = "12345";
        const status = "approved";

        const mockUpdatedTicket = {
            ticket_id: "12345",
            amount: 100,
            description: "Travel expenses",
            employee: "mockemployee",
            status: "approved"
        }

        TicketDao.updateTicket.mockReturnValue(mockUpdatedTicket);

        const result = await TicketService.updateTicket(ticketId, status);
        expect(TicketDao.updateTicket).toHaveBeenCalledWith(ticketId, status);
        expect(result).toEqual(mockUpdatedTicket);
    });

    test("Should return null when status update is invalid", async () => {
        const result = await TicketService.updateTicket("12345", "invalidStatus");
        expect(result).toBeNull();
    });

    test("Should return a list of all of an employee's tickets", async () => {
        const mockUsername = "mockemployee";
        const mockTickets = [
            { ticket_id: "12345", amount: 100, description: "Travel", status: "pending", employee: "mockemployee" },
            { ticket_id: "67890", amount: 50, description: "Supplies", status: "approved", employee: "mockemployee" }
        ];

        TicketDao.getUserTickets.mockResolvedValue(mockTickets);

        const result = await TicketService.getUserTickets(mockUsername);

        expect(TicketDao.getUserTickets).toHaveBeenCalledWith(mockUsername);
        expect(result).toEqual(mockTickets);
    });
})