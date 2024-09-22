const express = require("express");
const router = express.Router();
const EmployeeService = require("../service/EmployeeService");

/*
    Employee Object Model
        {
            username: string (unique)
            password: string
            manager: boolean (true = manager, false = reg employee)
        }
*/

// REQUEST: GET, username (string) input
// RESPONSE: Employee object
router.get("/username", async (req, res) => {
    const usernameQuery = req.query.username;

    try {
        if(usernameQuery) {
            const employee = await EmployeeService.getEmployeeByUsername(usernameQuery);

            if (employee) {
                return res.status(200).json({message: "Employee found", employee});
            } else {
                return res.status(404).json({message: "Employee not found"});
            }
        } else {
            return res.status(400).json({message: "Username not provided"});
        }

    } catch (error) {
        console.error("Error fetching employee:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
})

router.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        const employee = await EmployeeService.registerEmployee(req.body);

        if (employee) {
            return res.status(201).json({ message: "New employee added", employee });
        } else {
            return res.status(400).json({ message: "Employee was not added", receivedData: req.body });
        }
    } catch (error) {
        console.error("Error registering employee:", error); // Log the error for debugging
        return res.status(500).json({ message: "Internal server error" });
    }
})

module.exports = router;