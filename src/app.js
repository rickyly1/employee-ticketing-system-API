const express = require('express');
const app = express();
const logger = require("./util/logger");
const EmployeeRouter = require("./controller/EmployeeRouter");

const PORT = 3000;

app.use(express.json());

app.use((req, res, next) => {
    logger.info(`Incoming ${req.method} : ${req.url}`);
    next();
});

app.use("/employees", EmployeeRouter);

app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
});