import express from 'express'
import { UserModel } from '../models/Users.js'
import { verifyToken } from '../middleware/auth.js'

const router = express.Router()

router.get("/", verifyToken, async (req, res) => {
    try {
        const { email, ids } = req.query;

        // Handle batch fetch if ids are provided
        if (ids) {
            const userIds = ids.split(',');
            const users = await UserModel.find({
                _id: { $in: userIds }
            }).select('-password');
            return res.json(users);
        }

        // Handle search if email is provided
        if (email) {
            const users = await UserModel.find({
                email: { $regex: email, $options: 'i' }
            }).select('-password').limit(10);
            return res.json(users);
        }

        // If no query parameters, return error
        return res.status(400).json({ message: "Search parameters required" });
    } catch (error) {
        console.error("Error with user operation:", error);
        return res.status(500).json({ message: "Error processing request", error: error.message });
    }
})

router.get("/:userId", verifyToken, async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        return res.status(500).json({ message: "Error fetching user data", error: error.message });
    }
});

// New route to get multiple users' details
router.post("/batch", verifyToken, async (req, res) => {
    try {
        const { userIds } = req.body;

        // Validate input
        if (!Array.isArray(userIds)) {
            return res.status(400).json({ message: "userIds must be an array" });
        }

        // Remove duplicates and invalid IDs
        const uniqueIds = [...new Set(userIds)].filter(id => id && typeof id === 'string');

        // Fetch users
        const users = await UserModel.find({
            _id: { $in: uniqueIds }
        }).select('-password');

        return res.json(users);
    } catch (error) {
        console.error("Error fetching users batch:", error);
        return res.status(500).json({ message: "Error fetching users data", error: error.message });
    }
});

export { router as userRouter }
