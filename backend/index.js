const express = require('express');
const cors = require('cors');
const app = express();

// Enable CORS for your specific frontend origin
app.use(cors({
  origin: 'https://paytm-main-zvxx-nine.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Ensure this middleware is placed BEFORE your routes
app.use('/api/v1/user', userRouter);