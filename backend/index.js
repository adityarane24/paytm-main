const express = require("express");
require('dotenv').config();
const cors = require("cors");
const app = express();

// Standard wide-open CORS for internal application handling
app.use(cors({
  origin: "https://paytm-main-zvxx-nine.vercel.app",
  credentials: true
}));

app.use(express.json()); 

const mainRouter = require("./routes/index");
app.use("/api/v1", mainRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});