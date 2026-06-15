    const express = require('express');
    const { authMiddleware } = require('../middleware');
    const { Account } = require('../db');
    const mongoose = require('mongoose');

    const router = express.Router();

    // Get account balance
    router.get("/balance", authMiddleware, async (req, res) => {
        const account = await Account.findOne({ userId: req.userId });
        res.json({ balance: account.balance });
    });

    // Transfer money securely
    router.post("/transfer", authMiddleware, async (req, res) => {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // PERMANENT FIX: Converts any incoming payload value to a true mathematical Number
            const amount = Number(req.body.amount); 
            const { to } = req.body;

            // Ensure the input is a valid number and greater than zero
            if (isNaN(amount) || amount <= 0) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({ message: "Invalid transaction amount" });
            }

            const account = await Account.findOne({ userId: req.userId }).session(session);

            // This mathematical comparison will now execute accurately for every value
            if (!account || account.balance < amount) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({ message: "Insufficient balance" });
            }

            const toAccount = await Account.findOne({ userId: to }).session(session);
            if (!toAccount) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({ message: "Invalid account" });
            }

            // Perform the transaction increments
            await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
            await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

            await session.commitTransaction();
            session.endSession();
            
            res.json({ message: "Transfer successful" });

        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            res.status(500).json({ message: "Transaction failed", error: error.message });
        }
    });

    module.exports = router;