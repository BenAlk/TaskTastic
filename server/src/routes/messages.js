import express from 'express'
import { MessageModel } from '../models/Messages.js'
import { ProjectModel } from '../models/Projects.js'
import  { verifyToken } from '../middleware/auth.js'

const router = express.Router()

    // Create a new message
    router.post("/", verifyToken, async (req, res) => {
        try {
            const { projectId, recipients, type, content } = req.body
            const project = await ProjectModel.findOne({ _id: projectId, team_user: req.userId })
            if (!project) {
                return res.status(404).json({ message: "Project not found or access denied" })
            }
            const newMessage = new MessageModel({
                projectId,
                sender: req.userId,
                recipients: type === 'direct' ? recipients : [],
                type,
                content,
                read: [req.userId]
            })
            await newMessage.save()
            res.status(201).json(newMessage)
        } catch (error) {
            console.error("Message creation error:", error)
            res.status(500).json({ message: "Error creating message", error: error.message })
        }
    })


    // Retrieve all messages for a project (board messages)
    router.get("/:project/:projectId", verifyToken, async (req, res) => {
        try {
            const project = await ProjectModel.findOne({ _id: req.params.projectId, team_user: req.userId })
            if (!project) {
                return res.status(404).json({ message: "Project not found or access denied" })
            }
            const messages = await MessageModel.find({ projectId: req.params.projectId, type: 'board' })
                .sort('-createdAt')
                .populate('sender', 'email')
            res.json(messages)
        } catch (error) {
            res.status(500).json({ message: "Error fetching messages", error: error.message })
        }
    })

    // Retrieve all messages for a user (direct messages)
    router.get("/direct/:projectId", verifyToken, async (req, res) => {
        try {
            const project = await ProjectModel.findOne({ _id: req.params.projectId, 'team.user': req.userId })
            if (!project) {
                return res.status(404).json({ message: "Project not found or access denied" })
            }
            const messages = await MessageModel.find({
                projectId: req.params.projectId,
                type: 'direct',
                $or: [{ sender: req.userId}, { recipients: req.userId}]
            })
                .sort('-createdAt')
                .populate('sender', 'email')
                .populate('recipients', 'email')
            res.json(messages)
        } catch (error) {
            res.status(500).json({ message: "Error fetching messages", error: error.message })
        }
    })

    //Mark a message as read
    router.put("/:messageId/read", verifyToken, async (req, res) => {
        try {
            const message = await MessageModel.findById(req.params.messageId)
            if (!message) {
                return res.status(404).json({ message: "Message not found" })
            }
            const project = await ProjectModel.findOne({ _id: message.projectId, 'team.user': req.userId })
            if (!project) {
                return res.status(404).json({ message: "Access denied" })
            }
            if(!message.read.includes(req.userId)){
                message.read.push(req.userId)
                await message.save()
            }
            res.json(message)
        } catch (error) {
            res.status(500).json({ message: "Error marking message as read", error: error.message })
        }
    })

    //Delete a message (sender only)
    router.delete("/:messageId", verifyToken, async (req, res) => {
        try {
            const message = await MessageModel.findOne({ _id: req.params.messageId, sender: req.userId })
            if (!message) {
                return res.status(404).json({ message: "Message not found or you're not the sender" })
            }
            await MessageModel.findByIdAndDelete(req.params.messageId)
            res.json({ message: "Message deleted successfully" })
        } catch (error) {
            res.status(500).json({ message: "Error deleting message", error: error.message })
        }
})

export { router as messageRouter }
