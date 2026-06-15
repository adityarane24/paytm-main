// Ensure JWT_SECRET is declared at the top of this user.js file
const JWT_SECRET = process.env.JWT_SECRET || "adityaSecret";

router.post("/signin", async (req, res) => {
    try {
        // Safe check: accept either username OR email from the frontend body payload
        const username = req.body.username || req.body.email;
        const password = req.body.password;

        if (!username || !password) {
            return res.status(400).json({
                message: "Missing email/username or password"
            });
        }

        // Find the user in your database collection
        const user = await User.findOne({
            username: username,
            password: password
        });

        if (!user) {
            return res.status(411).json({
                message: "Invalid credentials"
            });
        }

        // Generate the authentic JWT Token session
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET);

        return res.json({
            token: token
        });

    } catch (error) {
        console.error("Critical Signin Route Error:", error);
        return res.status(500).json({ 
            message: "Internal server error during login",
            error: error.message 
        });
    }
});