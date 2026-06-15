const express = require("express");
require('dotenv').config();
const cors = require("cors");
const app = express();

// 1. Fixed Dynamic CORS configuration
const clientUrl = process.env.CLIENT_URL || "https://paytm-main-zvxx-nine.vercel.app";

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    // Allow matching production URL or localhost during testing
    if (origin === clientUrl || origin.startsWith("http://localhost:")) {
      return callback(null, true);
    }
    
    return callback(new Error('CORS policy: origin not allowed'));
  },
  credentials: true,
}));

// Parse JSON bodies
app.use(express.json());

// 2. Direct Header Injection Interceptor
app.use((req, res, next) => {
  const originHeader = req.headers.origin || clientUrl;
  
  res.header("Access-Control-Allow-Origin", originHeader);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.header("Access-Control-Allow-Headers", "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization");

  // Handle preflight instantly before routers execute
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

const mainRouter = require("./routes/index");

// Mount API routes
app.use("/api/v1", mainRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});