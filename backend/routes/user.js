const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const { User, Account } = require("../db");
const JWT_SECRET = process.env.JWT_SECRET || "adityaSecret"; 
const { authMiddleware } = require("../middleware");

// 1. Signup Route
// 1. Signup Route with Error Handling
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

        // --- Your Account Balance Initialization Logic Below ---
        // (Ensure you create an Account record for the new userId here)

        return res.json({
            message: "User created successfully",
            token: "your_jwt_token_generation_here"
        });

    } catch (error) {
        console.error("Critical Signup Error:", error);
        return res.status(500).json({ 
            message: "Internal server validation error", 
            error: error.message 
        });
    }
});