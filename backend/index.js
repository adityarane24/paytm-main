const express = require("express");
require('dotenv').config();
const cors = require("cors");
const app = express();

// 1. Wide-open configuration for native application parsing
app.use(cors());
app.use(express.json()); 

// 2. Fallback manual header interceptor
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
    res.header("Access-Control-Allow-Headers", "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization");
    
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    next();
});

const mainRouter = require("./routes/index");
app.use("/api/v1", mainRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});