import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { UserModel } from '../models/Users.js'
import { verifyToken } from '../middleware/auth.js'

const router = express.Router()

router.post("/register", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });

        if (user) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({
            email,
            password: hashedPassword
        });

        await newUser.save();

        return res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.error("Registration error:", error);
        return res.status(500).json({ message: "Error creating user", error: error.message });
    }
});


router.post("/login", async (req, res) => {
    const {email, password} = req.body

    const user = await UserModel.findOne({email})

    if (!user) {
        return res.status(400).json({message: "E-mail not found"})
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password)

    if (!isPasswordCorrect) {
        return res.status(400).json({message: "Incorrect password"})
    }

    const token = jwt.sign({id: user._id}, "secret")
    return res.json({token, userID: user._id})
})

router.get("/me", verifyToken, async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId).select('-password');
        if (!user) {
            console.log(`User not found for ID: ${req.userId}`);
            return res.status(404).json({ message: "User not found" });
        }
        console.log(`User data fetched successfully for ID: ${req.userId}`);
        return res.json(user);
    } catch (error) {
        console.error("Error in /auth/me endpoint:", error);
        return res.status(500).json({ message: "Error fetching user data", error: error.message });
    }
});

export { router as userRouter }
