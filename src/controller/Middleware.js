const jwt = require("jsonwebtoken");
const fs = require('fs');
const secretKey = fs.readFileSync('./../secretkey.txt', 'utf8').trim();

async function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Unauthorized Access" });
    } 
    
    try {
        const user = await jwt.verify(token, secretKey);
        req.user = user;
        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid token" });
    }
}

async function authenticateManagerToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Unauthorized Access" });
    }

    try {
        const user = await jwt.verify(token, secretKey);
        if (user.manager == false) {
            return res.status(403).json({ message: "Forbidden Access: Not a Manager" });
        } 
        
        req.user = user;
        next();
        
    } catch (error) {
        return res.status(403).json({ message: "Invalid token" });
    }
}

module.exports = {
    authenticateToken,
    authenticateManagerToken
}