import mongoose from 'mongoose'

const ProjectSchema = new mongoose.Schema({
    projectName: {
        type: String,
        required: true
    },
    projectOwner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    setupDate: {
        type: Date,
        default: Date.now
    },
    startDate: {
        type: Date,
        required: true
    },
    targetDate: {
        type: Date,
        required: true
    },
    secondaryAdminsAllowed: {
        type: Boolean,
        default: false
    },
    eisenhowerEnabled: {
        type: Boolean,
        default: false
    },
    team: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users'
        },
        role: {
            type: String,
            enum:['admin', 'member'],
            default: 'member'
        }
    }],
    kanbanColumns: [{
        name:String,
        color: String,
        maxDays: Number,
        maxTasks: Number,
        order: Number,
    }]
}, {timestamps: true})


export const ProjectModel = mongoose.model('projects', ProjectSchema)
