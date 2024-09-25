const express = require('express');
const app = express();
const logger = require("./util/logger");
const EmployeeRouter = require("./controller/EmployeeRouter");
const TicketRouter = require('./controller/TicketRouter');

const PORT = 3000;

app.use(express.json());

app.use((req, res, next) => {
    logger.info(`Incoming ${req.method} : ${req.url}`);
    next();
});

app.use("/employees", EmployeeRouter);
app.use("/tickets", TicketRouter);

app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
});

/*
    FEATURE CHECKLIST ✔

    ✔  Employee registration (post)
    ✔  Employee get by username
    ✔  Employee authorization
    ✔  Manager authorization
    ✔  Ticket submission
        Get all pending tickets (query by status)
    ✔  Change ticket status (only once)
        View previous tickets (query tickets by username)
*/