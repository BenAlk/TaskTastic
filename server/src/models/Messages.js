import mongoose from 'mongoose'

const MessageSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Projects',
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    recipient: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    }],
    type: {
        type: String,
        enum: ['direct', 'board'],
        required: true
    },
    content: {
        type: String,
        required: true
    },
    timestamp: Date,
    read: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
    }]
},{timestamps: true})

export const MessageModel = mongoose.model('messages', MessageSchema)
