const express = require("express");
const cors = require("cors");
const mainRouter = require("./routes/index");

const app = express();

// Handle CORS cleanly via middleware
app.use(cors({
    origin: "https://paytm-main-zvxx-nine.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]
}));

app.use(express.json());

// Main routing endpoints
app.use("/api/v1", mainRouter);

// Global Error Catching Middleware
app.use((err, req, res, next) => {
    console.error("Global Server Error:", err);
    res.status(500).json({
        message: "Internal Server Error Hook triggered",
        error: err.message
    });
});

module.exports = app;

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running safely on port ${PORT}`);
});