import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: /[a-zA-Z0-9_]{3,}@[a-z]{3,10}\.[a-z]{2,5}/
    },
    username: {
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
        enum: ['ADMIN', 'USER'],
        default: 'USER'
    },
    token: String,
    refreshToken: String
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

export default User;