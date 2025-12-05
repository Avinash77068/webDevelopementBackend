import mongoose from "mongoose";

const visitorSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },   
    attemptCount: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

const Visitor = mongoose.model("Visitor", visitorSchema);

export default Visitor;