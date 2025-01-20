import express from 'express'
import { MessageModel } from '../models/Messages.js'
import { ProjectModel } from '../models/Projects.js'
import { verifyToken, preventDemoModification } from '../middleware/auth.js'

const router = express.Router()

router.post("/", verifyToken, preventDemoModification, async (req, res) => {
    try {
        const {
            projectId,
            recipients,
            type,
            content,
            parentMessage,
            metadata
        } = req.body

        const project = await ProjectModel.findOne({
            _id: projectId,
            'team.user': req.userId
        })

        if (!project) {
            return res.status(404).json({
                message: "Project not found or access denied"
            })
        }

        const newMessage = new MessageModel({
            projectId,
            sender: req.userId,
            recipients: type === 'direct' ? recipients : [],
            type,
            content: {
                text: content.text,
                mentions: content.mentions || []
            },
            parentMessage: parentMessage || null,
            metadata: {
                priority: metadata?.priority || 'normal',
                tags: metadata?.tags || [],
                reactions: []
            },
            read: [req.userId]
        })

        await newMessage.save()
        res.status(201).json(newMessage)
    } catch (error) {
        console.error("Message creation error:", error)
        res.status(500).json({
            message: "Error creating message",
            error: error.message
        })
    }
})

router.get("/thread/:messageId", verifyToken, async (req, res) => {
    try {
        const rootMessage = await MessageModel.findById(req.params.messageId)
        if (!rootMessage) {
            return res.status(404).json({ message: "Message not found" })
        }

        const project = await ProjectModel.findOne({
            _id: rootMessage.projectId,
            'team.user': req.userId
        })

        if (!project) {
            return res.status(403).json({ message: "Access denied" })
        }

        const threadMessages = await MessageModel.find({
            parentMessage: req.params.messageId
        })
        .sort('createdAt')
        .populate('sender', 'email firstName lastName')
        .populate('content.mentions.user', 'email firstName lastName')

        res.json({
            rootMessage,
            threadMessages
        })
    } catch (error) {
        res.status(500).json({
            message: "Error fetching thread",
            error: error.message
        })
    }
})

router.get("/board/:projectId", verifyToken, async (req, res) => {
    try {
        const project = await ProjectModel.findOne({
            _id: req.params.projectId,
            'team.user': req.userId
        })

        if (!project) {
            return res.status(403).json({ message: "Access denied" })
        }

        const messages = await MessageModel.find({
            projectId: req.params.projectId,
            type: 'board'
        })
        .sort('-createdAt')
        .populate('sender', 'email firstName lastName')
        .populate('content.mentions.user', 'email firstName lastName')
        .populate('metadata.reactions.user', 'email firstName lastName')

        res.json(messages)
    } catch (error) {
        console.error("Error fetching board messages:", error)
        res.status(500).json({ message: "Error fetching messages", error: error.message })
    }
})

router.get("/dashboard/:projectId", verifyToken, async (req, res) => {
    try {
        const project = await ProjectModel.findOne({
            _id: req.params.projectId,
            'team.user': req.userId
        })

        if (!project) {
            return res.status(404).json({ message: "Project not found or access denied" })
        }

        const directMessages = await MessageModel.find({
            projectId: req.params.projectId,
            type: 'direct',
            $or: [{ sender: req.userId }, { recipients: req.userId }]
        })
        .sort('-createdAt')
        .limit(3)
        .populate('sender', 'email firstName lastName')
        .populate('recipients', 'email firstName lastName')
        .populate('content.mentions.user', 'email firstName lastName')

        const boardMessages = await MessageModel.find({
            projectId: req.params.projectId,
            type: 'board',
            parentMessage: null
        })
        .sort('-createdAt')
        .limit(4)
        .populate('sender', 'email firstName lastName')
        .populate('content.mentions.user', 'email firstName lastName')

        res.json({
            directMessages,
            boardMessages
        })
    } catch (error) {
        res.status(500).json({
            message: "Error fetching dashboard messages",
            error: error.message
        })
    }
})

router.get("/direct/:projectId", verifyToken, async (req, res) => {
    try {
        const project = await ProjectModel.findOne({
            _id: req.params.projectId,
            'team.user': req.userId
        })

        if (!project) {
            return res.status(404).json({ message: "Project not found or access denied" })
        }

        const limit = parseInt(req.query.limit) || 50
        const before = req.query.before ? new Date(req.query.before) : new Date()

        const messages = await MessageModel.find({
            projectId: req.params.projectId,
            type: 'direct',
            $or: [{ sender: req.userId }, { recipients: req.userId }],
            createdAt: { $lt: before }
        })
        .sort('-createdAt')
        .limit(limit)
        .populate('sender', 'email firstName lastName')
        .populate('recipients', 'email firstName lastName')
        .populate('content.mentions.user', 'email firstName lastName')

        res.json(messages)
    } catch (error) {
        res.status(500).json({
            message: "Error fetching messages",
            error: error.message
        })
    }
})

router.post("/:messageId/reaction", verifyToken, preventDemoModification, async (req, res) => {
    try {
        const { emoji } = req.body
        const message = await MessageModel.findById(req.params.messageId)

        if (!message) {
            return res.status(404).json({ message: "Message not found" })
        }

        const project = await ProjectModel.findOne({
            _id: message.projectId,
            'team.user': req.userId
        })

        if (!project) {
            return res.status(403).json({ message: "Access denied" })
        }

        message.metadata.reactions = message.metadata.reactions.filter(
            reaction => reaction.user.toString() !== req.userId
        )

        message.metadata.reactions.push({
            user: req.userId,
            emoji
        })

        await message.save()
        res.json(message)
    } catch (error) {
        res.status(500).json({
            message: "Error adding reaction",
            error: error.message
        })
    }
})

router.put("/:messageId", verifyToken, preventDemoModification, async (req, res) => {
    try {
        const message = await MessageModel.findOne({
            _id: req.params.messageId,
            sender: req.userId
        })

        if (!message) {
            return res.status(404).json({
                message: "Message not found or you're not the sender"
            })
        }

        message.editHistory.push({
            content: message.content.text,
            editedAt: new Date()
        })

        message.content.text = req.body.content.text
        message.content.mentions = req.body.content.mentions || []
        message.status = 'edited'

        await message.save()
        res.json(message)
    } catch (error) {
        res.status(500).json({
            message: "Error editing message",
            error: error.message
        })
    }
})

router.put("/:messageId/read", verifyToken, async (req, res) => {
    try {
        const message = await MessageModel.findById(req.params.messageId)
        if (!message) {
            return res.status(404).json({ message: "Message not found" })
        }

        const project = await ProjectModel.findOne({
            _id: message.projectId,
            'team.user': req.userId
        })

        if (!project) {
            return res.status(403).json({ message: "Access denied" })
        }

        if (!message.read.includes(req.userId)) {
            message.read.push(req.userId)
            await message.save()
        }

        res.json(message)
    } catch (error) {
        res.status(500).json({
            message: "Error marking message as read",
            error: error.message
        })
    }
})

router.delete("/:messageId", verifyToken, preventDemoModification, async (req, res) => {
    try {
        const hasReplies = await MessageModel.exists({
            parentMessage: req.params.messageId
        })

        if (hasReplies) {
            return res.status(400).json({
                message: "Cannot delete a message that has replies"
            })
        }

        const message = await MessageModel.findOneAndDelete({
            _id: req.params.messageId,
            sender: req.userId
        })

        if (!message) {
            return res.status(404).json({
                message: "Message not found or you're not the sender"
            })
        }

        res.json({ message: "Message permanently deleted" })
    } catch (error) {
        res.status(500).json({
            message: "Error deleting message",
            error: error.message
        })
    }
})

export { router as messageRouter }
