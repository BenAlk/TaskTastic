import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import { UserModel } from '../models/Users.js'
import { verifyToken, preventDemoModification } from '../middleware/auth.js'
import { createDemoData } from '../utils/demoData.js'

dotenv.config({ path: '.env.local' })

const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) {
    console.error('FATAL ERROR: JWT_SECRET is not defined in environment variables')
    process.exit(1)
}

const router = express.Router()

router.post("/register", async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" })
        }

        const normalizedEmail = email.toLowerCase().trim()

        const user = await UserModel.findOne({ email: normalizedEmail })

        if (user) {
            return res.status(400).json({ message: "Email already exists" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new UserModel({
            email: normalizedEmail,
            password: hashedPassword
        })

        await newUser.save()

        return res.status(201).json({ message: "User created successfully" })
    } catch (error) {
        console.error("Registration error:", error)
        return res.status(500).json({ message: "Error creating user" })
    }
})

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" })
        }

        const normalizedEmail = email.toLowerCase().trim()

        const user = await UserModel.findOne({ email: normalizedEmail })

        if (!user) {
            return res.status(400).json({ message: "E-mail not found" })
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)

        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Incorrect password" })
        }

        const token = jwt.sign(
            { id: user._id },
            JWT_SECRET,
            { expiresIn: '1h' }
        )
        return res.json({ token, userID: user._id })
    } catch (error) {
        console.error("Login error:", error)
        return res.status(500).json({ message: "Error logging in" })
    }
})

router.get("/me", verifyToken, async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId).select('-password')
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        return res.json(user)
    } catch (error) {
        console.error("Error in /auth/me endpoint:", error)
        return res.status(500).json({ message: "Error fetching user data" })
    }
})

router.post("/demo-login", async (req, res) => {
    try {
        const demoEmail = "demo@example.com"

        let demoUser = await UserModel.findOne({ email: demoEmail })
        let isNewDemoUser = false

        if (!demoUser) {
            const hashedPassword = await bcrypt.hash("demo-password", 12)
            demoUser = new UserModel({
                email: demoEmail,
                password: hashedPassword,
                firstName: "Demo",
                lastName: "User"
            })
            await demoUser.save()
            isNewDemoUser = true
        }

        if (isNewDemoUser) {
            await createDemoData(demoUser._id)
        }

        const token = jwt.sign(
            {
                id: demoUser._id,
                isDemo: true
            },
            JWT_SECRET,
            { expiresIn: '1h' }
        )
        return res.json({ token, userID: demoUser._id })
    } catch (error) {
        console.error("Demo login error:", error)
        return res.status(500).json({ message: "Error accessing demo account" })
    }
})

export { router as authRouter }
