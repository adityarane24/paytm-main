const express = require("express");
require('dotenv').config();
const cors = require("cors");
const app = express();

// 1. Enable CORS for network requests
app.use(cors());

// 2. THIS LINE IS CRITICAL: It parses incoming JSON request bodies!
app.use(express.json()); 

// 3. PERMANENT FIX: Catch-all header injection & OPTIONS interceptor middleware
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
    res.header("Access-Control-Allow-Headers", "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization");
    
    // Explicitly intercept OPTIONS preflight requests and answer immediately with a clean 200 OK
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    next();
});

const mainRouter = require("./routes/index");

// 4. Make sure your main router is declared AFTER app.use(express.json())
app.use("/api/v1", mainRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});