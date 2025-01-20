import mongoose from 'mongoose'

const TaskSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Projects',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: String,
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    kanbanColumnId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    eisenhowerStatus: {
        important: { type: Boolean, default: false },
        urgent: { type: Boolean, default: false }
    },
    dueDate: Date,
    completedDate: Date,
    risk: {
        isAtRisk: {
            type: Boolean,
            default: false
        },
        riskType: String,
        riskDescription: String,
        flaggedBy: {
            type: String,
            enum: ['user', 'system'],
        },
        flaggedByUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users'
        },
        flaggedAt: Date
    },
    completed: {
        isCompleted: {
            type: Boolean,
            default: false
        },
        completedOn: Date
    }
},{timestamps: true})

export const TaskModel = mongoose.model('tasks', TaskSchema)
