const express = require("express");
const cors = require("cors");
const app = express();

// 1. Enable standard CORS middleware configuration
app.use(cors());
app.use(express.json());

// 2. PERMANENT FIX: Catch-all header injection middleware
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
    res.header("Access-Control-Allow-Headers", "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization");
    
    // Explicitly intercept OPTIONS preflight requests and answer with a clean 200 OK
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    next();
});

// Your existing routing declarations below
const mainRouter = require("./routes/index");
app.use("/api/v1", mainRouter);

// Export/Listen logic
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});