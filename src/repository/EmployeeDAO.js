const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
    DynamoDBDocumentClient,
    PutCommand,
    QueryCommand
} = require("@aws-sdk/lib-dynamodb");
const client = new DynamoDBClient({region: "us-west-1"});
const documentClient = DynamoDBDocumentClient.from(client);
const TableName = "employees";

/*
    Employee Object Model
        {
            username: string (unique, required)
            password: string (required)
            manager: boolean (true = manager, (default) false = reg employee)
        }
*/

// GET employee by username
async function getEmployeeByUsername(username) {
    const command = new QueryCommand({
        TableName,
        KeyConditionExpression: "#id = :id",
        ExpressionAttributeNames: {"#id": "username"},
        ExpressionAttributeValues: {":id": username}
    });

    try {
        const data = await documentClient.send(command);

        if (data.Items.length === 0) {
            return null;  // Explicitly return null if no employee is found
        }
        return data.Items[0];

    } catch (err) {
        console.error(`Error fetching employee by username: ${username}`, err);
        return null;
    }
}

// POST employee
async function registerEmployee(Item) {
    const command = new PutCommand({
        TableName,
        Item
    });

    try {
        const data = await documentClient.send(command);
        return data;

    } catch (err) {
        //logger.error(`Error registering employee: ${employee}`, err);
        return null;
    }
}

// Check database for a matching login set
async function loginEmployee(username, password) {
    const employee = await getEmployeeByUsername(username);
    if (employee.username === username && employee.password === password) {
        return employee;
    }
    return null;
}

// Check if username is taken
async function isUsernameTaken(username) {
    const employee = await getEmployeeByUsername(username);
    // console.log("isUsernameTaken result:", employee);
    return employee !== null;
}

module.exports = {
    getEmployeeByUsername,
    registerEmployee,
    loginEmployee,
    isUsernameTaken
}