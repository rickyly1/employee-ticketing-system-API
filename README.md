# Employee Ticketing System API
An API built using JavaScript, NodeJS, AWS DynamoDB, ExpressJS, Jest, and Postman; capable of receiving and managing workplace reimbursement request tickets.

## Installation
1. Clone this repository
2. Install dependencies with NodeJS, this project was created using v18.17.0
   ```shell
   npm install
3. Create a file in the root folder titled "secretkey.txt" and write a secure sequence within that file
4. Setup AWS environment by defining required environment variables
   ```shell
   # can be done by running this line in the terminal if the AWS SDK is installed
   aws configure
5. Run the program, by default with operate on http://localhost:3000
   ```shell
   node your-local-path/app.js

## Main Features
  ### User Login and Registration
- Users are able to register as either an Employee or Manager
- Managers have increased permissions, allowing them to manage the status of Employee tickets
- If position title is not provided, seniority level is defaulted to Employee
  ### Ticket Submission
- Both Managers and Employees are able to submit tickets
- An amount and description are required fields for valid ticket submission
- All tickets have their initial status set to "pending"
  ### Ticket Management
- Only Managers are able to approve or deny ticket requests
- Managers cannot approve/deny their own tickets
- Ticket status cannot be changed after having their status changed from pending
  ### Ticket Querying
- Managers can filter for tickets based on status; this will show all tickets of status X from all users
- Employees can view all of their previous ticket submissions, regardless of status

## Improvements Made After 9/27 Presentation
Following my presentation of this project, there were some notable flaws I noticed that I felt the need to correct, which can be seen in the **postpresentation-improvements** branch. Below is a general list of changes.
- Improved input validation for user registration
- Improved input validation for ticket status updating
- Improved clarity on error messages for ticket status updating
- Separated input validation logic from some commands in the ticketing router to further isolate business logic in the service layer
- Updated GET command to receive input parameters from the URL instead of the request body
