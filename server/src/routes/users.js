import express from 'express'
import bcrypt from 'bcrypt'
import { UserModel } from '../models/Users.js'
import { verifyToken } from '../middleware/auth.js'

const router = express.Router()

router.get("/", verifyToken, async (req, res) => {
    try {
        const { email, ids } = req.query

        if (ids) {
            const userIds = ids.split(',')
            const users = await UserModel.find({
                _id: { $in: userIds }
            }).select('-password')
            return res.json(users)
        }

        if (email) {
            const users = await UserModel.find({
                email: { $regex: email, $options: 'i' }
            }).select('-password').limit(10)
            return res.json(users)
        }

        return res.status(400).json({ message: "Search parameters required" })
    } catch (error) {
        console.error("Error with user operation:", error)
        return res.status(500).json({ message: "Error processing request", error: error.message })
    }
})

router.get("/:userId", verifyToken, async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.userId).select('-password')
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        return res.json(user)
    } catch (error) {
        console.error("Error fetching user:", error)
        return res.status(500).json({ message: "Error fetching user data", error: error.message })
    }
})

router.post("/batch", verifyToken, async (req, res) => {
    try {
        const { userIds } = req.body

        if (!Array.isArray(userIds)) {
            return res.status(400).json({ message: "userIds must be an array" })
        }

        const uniqueIds = [...new Set(userIds)].filter(id => id && typeof id === 'string')

        const users = await UserModel.find({
            _id: { $in: uniqueIds }
        }).select('-password')

        return res.json(users)
    } catch (error) {
        console.error("Error fetching users batch:", error)
        return res.status(500).json({ message: "Error fetching users data", error: error.message })
    }
})

router.patch("/:userId", verifyToken, async (req, res) => {
    try {
        const { password, ...updateFields } = req.body

        const updatedUser = await UserModel.findByIdAndUpdate(
            req.params.userId,
            { $set: updateFields },
            { new: true, runValidators: true }
        ).select('-password')

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" })
        }

        return res.json(updatedUser)
    } catch (error) {
        console.error("Error updating user:", error)
        return res.status(500).json({
            message: "Error updating user data",
            error: error.message
        })
    }
})

router.patch("/:userId/password", verifyToken, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body
        const user = await UserModel.findById(req.params.userId)

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, user.password)

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Current password is incorrect" })
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10)
        user.password = hashedNewPassword
        await user.save()

        return res.json({ message: "Password updated successfully" })
    } catch (error) {
        console.error("Error updating password:", error)
        return res.status(500).json({
            message: "Error updating password",
            error: error.message
        })
    }
})

export { router as userRouter }
