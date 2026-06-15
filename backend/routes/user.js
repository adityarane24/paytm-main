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
        const { username, firstName, lastName, password } = req.body;

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(411).json({ message: "Email already taken" });
        }

        const user = await User.create({
            username,
            password,
            firstName,
            lastName,
        });

        const userId = user._id;

        // Create a bank account with a random starting balance between 1 and 10000
        await Account.create({
            userId,
            balance: 999999
        });

        const token = jwt.sign({ userId }, JWT_SECRET);

        res.json({
            message: "User created successfully",
            token: token
        });
    } catch (error) {
        console.error("Signup Backend Error:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});
// 2. Signin Route
router.post("/signin", async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username, password });

    if (user) {
        const token = jwt.sign({ userId: user._id }, JWT_SECRET);
        return res.json({ token });
    }

    res.status(411).json({ message: "Error while logging in" });
});

// 3. Search Users Route (For Dashboard)
router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstName: { "$regex": filter, "$options": "i" }
        }, {
            lastName: { "$regex": filter, "$options": "i" }
        }]
    });

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    });
});

module.exports = router;