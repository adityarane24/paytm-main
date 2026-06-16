const express = require("express");
const cors = require("cors");
const mainRouter = require("./routes/index");

const app = express();

const corsOptions = {
    origin: "https://paytm-main-zvxx-nine.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
    credentials: true,
    optionsSuccessStatus: 200 // Explicitly forces 200 OK status for preflight OPTIONS requests
};

// 1. Apply CORS options
app.use(cors(corsOptions));

// 2. Handle preflight requests explicitly at the application level
app.options("*", cors(corsOptions));

app.use(express.json());

// 3. Attach your main routing endpoints
app.use("/api/v1", mainRouter);

// 4. Global Error Catching Middleware
app.use((err, req, res, next) => {
    console.error("Global Server Error:", err);
    res.status(500).json({
        message: "Internal Server Error Hook triggered",
        error: err.message
    });
});

// For Vercel Serverless compatibility
module.exports = app;

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running safely on port ${PORT}`);
});