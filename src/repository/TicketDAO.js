const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
    DynamoDBDocumentClient,
    PutCommand,
    UpdateCommand,
    ScanCommand,
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
            status: number ((default) 0 = pending, 1 = approved, 2 = denied)
        }
*/

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

        if (data.Items.length === 0) {
            return null;  // Explicitly return null if no employee is found
        }
        return data.Items;

    } catch (err) {
        console.error(`Error fetching tickets by username: ${username}`, err);
        return null;
    }
}

// GET all pending tickets
async function getPendingTickets() {
    let status = 0;
    const command = new ScanCommand({
        TableName,
        FilterExpression:"#id = :id",
        ExpressionAttributeNames: {"#id": "status"},
        ExpressionAttributeValues: {":id": status}
    });

    try {
        const data = await documentClient.send(command);

        if (data.Items.length === 0) {
            return null;  // Explicitly return null if no employee is found
        }
        return data.Items;

    } catch (err) {
        console.error(`Error fetching pending tickets: `, err);
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
        const data = await documentClient.send(command);
        return data;

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
            ":pending": 0 
        }
    })

    try {
        const data = await documentClient.send(command);
        return data;

    } catch (err) {
        return null;
    }
}

module.exports = {
    submitTicket,
    updateTicket,
    getUserTickets,
    getPendingTickets
}