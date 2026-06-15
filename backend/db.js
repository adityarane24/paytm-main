const mongoose = require('mongoose');

// Fallback to your connection string if the cloud environment variable isn't active
const dbURI = process.env.MONGO_URI || "mongodb+srv://paytm:aditya123@cluster0.ce8eang.mongodb.net/paytm";

mongoose.connect(dbURI)
  .then(() => console.log("Successfully connected to MongoDB Atlas!"))
  .catch((err) => console.error("Database connection error:", err));

// Inside backend/db.js
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 50
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    firstName: { // 🧠 Make sure this is camelCase, NOT lowercase 'firstname'
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    lastName: {  // 🧠 Make sure this is camelCase, NOT lowercase 'lastname'
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    }
});

const accountSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    balance : {
        type: Number, // Strict data validation constraint
        required: true
    }
});

const Account = mongoose.model("Account",accountSchema);

const user = await User.create({ username, password, firstName, lastName });

module.exports= {
    User,
    Account
}