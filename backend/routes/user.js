const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const { User, Account } = require("../db");

// Safe environment secret key initialization
const JWT_SECRET = process.env.JWT_SECRET || "adityaSecret"; 

// Absolute path safe import of your renamed middleware file
const { authMiddleware } = require("../authMiddleware");

// 1. SIGNUP ROUTER ENDPOINT
router.post("/signup", async (req, res) => {
    try {
        const username = req.body.username || req.body.email;
        const password = req.body.password;
        const firstName = req.body.firstName || req.body.firstname;
        const lastName = req.body.lastName || req.body.lastname;

        if (!username || !password || !firstName || !lastName) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(411).json({ message: "Email already taken" });
        }

        const user = await User.create({
            username,
            password,
            firstName,
            lastName
        });

        const userId = user._id;
        await Account.create({
            userId,
            balance: 1 + Math.random() * 10000
        });

        const token = jwt.sign({ userId }, JWT_SECRET);

        return res.json({
            message: "User created successfully",
            token: token
        });

    } catch (error) {
        console.error("Signup Error:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
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