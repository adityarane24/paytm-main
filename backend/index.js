const express = require("express");
const cors = require("cors");
const mainRouter = require("./routes/index");

const app = express();

// 1. Enable clean, wide-open CORS policy for incoming requests
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// 2. Clear out preflight OPTIONS checks instantly before routing can crash
app.options("*", cors());

// 3. Attach your main routing endpoints
app.use("/api/v1", mainRouter);

// 4. Global Error Catching Middleware (Stops Vercel from dropping the connection on code crashes)
app.use((err, req, res, next) => {
    console.error("Global Server Error:", err);
    res.status(500).json({
        message: "Internal Server Error Hook triggered",
        error: err.message
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running safely on port ${PORT}`);
});