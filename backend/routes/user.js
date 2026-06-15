const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const { User, Account } = require("../db");
const JWT_SECRET = process.env.JWT_SECRET || "adityaSecret"; 
const { authMiddleware } = require("../authMiddleware");

// 1. Signup Route with Complete Operational Logic
router.post("/signup", async (req, res) => {
    try {
        // Safe destructuring with structural fallbacks for lowercase or camelCase
        const username = req.body.username;
        const password = req.body.password;
        const firstName = req.body.firstName || req.body.firstname;
        const lastName = req.body.lastName || req.body.lastname;

        // Basic input validation block
        if (!username || !password || !firstName || !lastName) {
            return res.status(400).json({
                message: "Missing required profile fields"
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(411).json({
                message: "Email already taken"
            });
        }

        // Create the user document safely
        const user = await User.create({
            username,
            password,
            firstName,
            lastName
        });

        // FIX 1: Generate a real bank wallet record for the new user profile
        const userId = user._id;
        await Account.create({
            userId,
            balance: 1 + Math.random() * 10000 // Assigns a random opening balance
        });

        // FIX 2: Sign a genuine JWT Session token containing their new user ID
        const token = jwt.sign({
            userId
        }, JWT_SECRET);

        // Return operational data payloads back to the client-side app
        return res.json({
            message: "User created successfully",
            token: token
        });

    } catch (error) {
        console.error("Critical Signup Error:", error);
        return res.status(500).json({ 
            message: "Internal server validation error", 
            error: error.message 
        });
    }
});

module.exports = router; // Make sure the router instance is exported!