const express = require("express");
require('dotenv').config();
const app = express();

// 1. MANUAL CORS HEADERS INTERCEPTOR (MUST RUN FIRST)
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,PATCH,DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization");
    
    // If the browser is just checking connection permissions via OPTIONS, reply 200 OK instantly
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }
    next();
});

// 2. Parse incoming JSON payloads
app.use(express.json());

// 3. Mount your application routers
const mainRouter = require("./routes/index");
app.use("/api/v1", mainRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});