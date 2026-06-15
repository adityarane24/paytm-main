const mongoose = require('mongoose');

// Fallback to your connection string if the cloud environment variable isn't active
const dbURI = process.env.MONGO_URI || "mongodb+srv://paytm:aditya123@cluster0.ce8eang.mongodb.net/paytm";

mongoose.connect(dbURI)
  .then(() => console.log("Successfully connected to MongoDB Atlas!"))
  .catch((err) => console.error("Database connection error:", err));

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 30
    },
    password:{
        type : String,
        required : true,
        minlength: 8,
        maxlength: 100
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    lastName: {
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

const User = mongoose.model("User", userSchema);

module.exports= {
    User,
    Account
}