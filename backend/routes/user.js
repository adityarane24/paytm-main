const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const { User, Account } = require("../db");

// Safe environment secret key initialization
const JWT_SECRET = process.env.JWT_SECRET || "adityaSecret"; 

// Absolute path safe import of your renamed middleware file
const { authMiddleware } = require("../authMiddleware");

// 1. SIGNUP ROUTER ENDPOINT
router.post("/signin", async (req, res) => {
    try {
        // Fallback structural safety map: check all common variations
        const username = req.body.username || req.body.email || req.body.usernameField;
        const password = req.body.password;

        if (!username || !password) {
            return res.status(400).json({ 
                message: "Username/Email and password are required fields" 
            });
        }

        // Find the user entry in MongoDB
        const user = await User.findOne({ username, password });
        
        if (!user) {
            return res.status(411).json({ 
                message: "Invalid login credentials match" 
            });
        }

        // Generate the authentic JWT Session token string safely
        const token = jwt.sign({ userId: user._id }, JWT_SECRET);

        return res.json({ token });

    } catch (error) {
        console.error("Internal Signin Error Hook Triggered:", error);
        return res.status(500).json({ 
            message: "Internal server error processing login sequence", 
            error: error.message 
        });
    }
});

// 2. SIGNIN ROUTER ENDPOINT
router.post("/signin", async (req, res) => {
    try {
        const username = req.body.username || req.body.email;
        const password = req.body.password;

        if (!username || !password) {
            return res.status(400).json({ message: "Missing username or password" });
        }

        const user = await User.findOne({ username, password });
        if (!user) {
            return res.status(411).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET);

        return res.json({ token });

    } catch (error) {
        console.error("Signin Error:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
});
// 3. BULK SEARCH ENDPOINT (Loads users onto your dashboard screen)
router.get("/bulk", async (req, res) => {
    try {
        // Read the filter parameter (e.g., ?filter=Rahul) or fallback to an empty string to return everyone
        const filter = req.query.filter || "";

        // Query MongoDB with a case-insensitive regex pattern matching first or last name
        const users = await User.find({
            $or: [{
                firstName: {
                    "$regex": filter,
                    "$options": "i"
                }
            }, {
                lastName: {
                    "$regex": filter,
                    "$options": "i"
                }
            }]
        });

        // Map and return data fields safely (Never expose the plain text passwords!)
        return res.json({
            user: users.map(user => ({
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                _id: user._id
            }))
        });

    } catch (error) {
        console.error("Bulk Search Error:", error);
        return res.status(500).json({ 
            message: "Internal server error fetching user database listings",
            error: error.message 
        });
    }
});

module.exports = router;