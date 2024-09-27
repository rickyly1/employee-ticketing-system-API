const express = require("express");
const router = express.Router();
const EmployeeService = require("../service/EmployeeService");
const { authenticateToken, authenticateManagerToken } = require("./Middleware");
const jwt = require("jsonwebtoken");
const fs = require('fs');
const path = require('path');
const secretKey = fs.readFileSync(path.join(__dirname, '../../secretkey.txt'), 'utf8').trim();

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
            return res.status(201).json({ message: "New employee added", newEmployee: employee });
        } else {
            return res.status(400).json({ message: "Employee was not added", attemptedEmployee: req.body });
        }
    } catch (error) {
        console.error("Error registering employee:", error); // Log the error for debugging
        return res.status(500).json({ message: "Internal server error" });
    }
})

router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        const employee = await EmployeeService.getEmployeeByUsername(username);

        if (employee && password === employee.password) {
            const token = jwt.sign(
                        { username: employee.username, manager: employee.manager },
                        secretKey, // Use an environment variable for better security
                        { expiresIn: "1d" }
                    );

            return res.status(200).json({ message: "Login successful", token });
        } else {
            res.status(401).json({message: "Invalid Credentials"});
        }

    } catch (error) {
        console.error("Error during login:", error); // Log the error
        return res.status(500).json({ message: "Internal server error" });
    }
})

// test employee authent
router.get("/some-protected-route", authenticateToken, (req, res) => {
    res.json({ message: "This is a protected route", user: req.user });
});

router.get("/manager-protected", authenticateManagerToken, (req, res) => {
    // Only managers can process tickets
    res.json({ message: "This is a protected route for managers", user: req.user });
});

module.exports = router;