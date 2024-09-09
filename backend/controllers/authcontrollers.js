import jwt from "jsonwebtoken";
import User from '../models/userModel.js'; // Import the User model

// User login
const userLogin = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find the user by username using Sequelize
        const user = await User.findOne({ where: { username } });

        if (!user) {
            return res.status(403).json({ error: "Username does not exist!" });
        }

        // Check if the password matches
        if (user.password !== password) {
            return res.status(403).json({ error: "Password does not match!" });
        }

        // Generate JWT token
        const jwtToken = jwt.sign(
            { username, password }, 
            process.env.JWT_SECRET
        );

        res.status(201).json({ message: "Welcome back", token: jwtToken });
    } catch (e) {
        console.error(e);
        return res.status(400).json({ error: "Could not login, please try again later." });
    }
};

// User registration
const userRegister = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if the username already exists
        const existingUser = await User.findOne({ where: { username } });

        if (existingUser) {
            return res.status(400).json({ error: "Username already taken!" });
        }

        // Create a new user using Sequelize
        await User.create({ username, password });

        res.status(201).json({ message: "User registered successfully!" });
    } catch (e) {
        console.error(e);
        return res.status(400).json({ error: "Could not register, please try again later." });
    }
};

export { userLogin, userRegister };
