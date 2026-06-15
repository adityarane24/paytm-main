const express = require('express');
const router = express.Router();
const { Account } = require("../db");
const { authMiddleware } = require("../authMiddleware");
const mongoose = require("mongoose");

// Transfer Endpoint with multi-parameter safety fallbacks
router.post("/transfer", authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const amount = req.body.amount;
        // Accept either 'to' or 'id' parameters depending on frontend build naming structures
        const to = req.body.to || req.body.id; 

        if (!to || !amount || amount <= 0) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Invalid recipient field parameters or amount" });
        }

        // Fetch sender account balance details
        const account = await Account.findOne({ userId: req.userId }).session(session);

        if (!account || account.balance < amount) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Insufficient wallet balance account funds" });
        }

        // Fetch recipient account parameters
        const toAccount = await Account.findOne({ userId: to }).session(session);

        if (!toAccount) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Target receiver profile account not found" });
        }

        // Execute atomic ACID ledger adjustments
        await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
        await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

        await session.commitTransaction();
        session.endSession();

        return res.json({ message: "Transfer successful" });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Ledger Transaction Exception:", error);
        return res.status(500).json({ message: "Internal server processing error", error: error.message });
    }
});

module.exports = router;