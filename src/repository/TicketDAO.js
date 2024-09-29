const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
    DynamoDBDocumentClient,
    PutCommand,
    UpdateCommand,
    ScanCommand,
    GetCommand
} = require("@aws-sdk/lib-dynamodb");
const client = new DynamoDBClient({region: "us-west-1"});
const documentClient = DynamoDBDocumentClient.from(client);
const TableName = "tickets";

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

// GET ticket by ticket_id
async function getTicketById(ticket_id) {
    const command = new GetCommand({
        TableName,
        Key: { "ticket_id": ticket_id}
    });

    try {
        const data = await documentClient.send(command);

        if (!data.Item || data.Item.length === 0) {
            return null;  // Explicitly return null if no employee is found
        }
        return data.Item;

    } catch (err) {
        console.error(`Error fetching ticket by id: ${ticket_id}`, err);
        return null;
    }
}

// GET all of a user's tickets
async function getUserTickets(username) {
    const command = new ScanCommand({
        TableName,
        FilterExpression: "#id = :id",
        ExpressionAttributeNames: {"#id": "employee"},
        ExpressionAttributeValues: {":id": username}
    });

    try {
        const data = await documentClient.send(command);

        return data.Items;

    } catch (err) {
        console.error(`Error fetching tickets by username: ${username}`, err);
        return null;
    }
}

// GET filtered tickets
async function getFilterTickets(status) {
    const command = new ScanCommand({
        TableName,
        FilterExpression:"#id = :id",
        ExpressionAttributeNames: {"#id": "status"},
        ExpressionAttributeValues: {":id": status}
    });

    try {
        const data = await documentClient.send(command);
        return data.Items;

    } catch (err) {
        return null;
    }
}

// POST new ticket
async function submitTicket(Item) {
    const command = new PutCommand({
        TableName,
        Item
    });

    try {
        await documentClient.send(command);
        return Item;

    } catch (err) {
        return null;
    }
}

// PATCH ticket status, only executable on pending
async function updateTicket(ticketId, status) {
    const command = new UpdateCommand({
        TableName,
        Key: { ticket_id: ticketId },
        UpdateExpression: "set #status = :status",
        ConditionExpression: "#status = :pending",
        ExpressionAttributeNames: { "#status": "status"},
        ExpressionAttributeValues: { 
            ":status": status,
            ":pending": "pending" 
        },
        ReturnValues: "ALL_NEW"
    })

    try {
        const data = await documentClient.send(command);
        return data.Attributes;

    } catch (err) {
        return null;
    }
}

module.exports = {
    getTicketById,
    submitTicket,
    updateTicket,
    getUserTickets,
    getFilterTickets
}