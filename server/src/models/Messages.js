import mongoose from 'mongoose'

const MessageSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Projects',
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    recipients: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }],
    type: {
        type: String,
        enum: ['direct', 'board'],
        required: true
    },
    content: {
        text: {
            type: String,
            required: true
        },
        mentions: [{
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'users'
            },
            position: Number
        }]
    },
    parentMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'messages',
        default: null
    },
    status: {
        type: String,
        enum: ['sent', 'delivered', 'edited', 'deleted'],
        default: 'sent'
    },
    editHistory: [{
        content: String,
        editedAt: Date
    }],
    metadata: {
        priority: {
            type: String,
            enum: ['normal', 'high', 'urgent'],
            default: 'normal'
        },
        tags: [String],
        reactions: [{
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'users'
            },
            emoji: String
        }]
    },
    read: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }]
}, { timestamps: true })

export const MessageModel = mongoose.model('messages', MessageSchema)
