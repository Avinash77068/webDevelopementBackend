
import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config();
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        console.error("Make sure your .env file has MONGO_URI defined and the database is running");
        process.exit(1);
    }
};

export default connectDB;