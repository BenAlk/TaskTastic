import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true 
    },
    firstName: {
        type: String,
        default: ''
    },
    lastName: {
        type: String,
        default: ''
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: '',
        validate: {
            validator: function(v) {
                if(!v) return true;
                return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(v)
            },
            message: props => `${props.value} is not a valid URL`
        }
    }
}, {timestamps: true})

export const UserModel = mongoose.model('users', UserSchema)
