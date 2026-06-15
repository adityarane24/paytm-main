const express = require("express");
require('dotenv').config();
const cors = require("cors");
const app = express();

// 1. Enable CORS for network requests
app.use(cors());

// 2. THIS LINE IS CRITICAL: It parses incoming JSON request bodies!
app.use(express.json()); 

const mainRouter = require("./routes/index");

// 3. Make sure your main router is declared AFTER app.use(express.json())
app.use("/api/v1", mainRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});