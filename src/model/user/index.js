import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    phoneNumber: {
        type: String,
        required: false,
        default: Math.random().toString(36).substring(2, 10)
    },
    token: {
        type: String
    }
});

const User = mongoose.model('User', userSchema);
export default User;