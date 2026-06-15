// Ensure JWT_SECRET is declared at the top of this user.js file
const JWT_SECRET = process.env.JWT_SECRET || "adityaSecret";

router.post("/signin", async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;

        // Find the user in the database
        const user = await User.findOne({
            username: username,
            password: password
        });

        if (!user) {
            return res.status(411).json({
                message: "Error while logging in"
            });
        }

        // Generate a real token using the secret key fallback
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET);

        return res.json({
            token: token
        });

    } catch (error) {
        console.error("Signin Route Error:", error);
        return res.status(500).json({ 
            message: "Internal server error during login",
            error: error.message 
        });
    }
});