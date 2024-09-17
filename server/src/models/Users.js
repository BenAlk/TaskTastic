import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    // firstName: {
    //     type: String,
    //     required: true
    // },
    // lastName: {
    //     type: String,
    //     required: true
    // },
    // email: {
    //     type: String,
    //     required: true,
    //     unique: true
    // },
    password: {
        type: String,
        required: true
    }
    // teams: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Team'
    // }]
})

export const UserModel = mongoose.model('users', UserSchema)