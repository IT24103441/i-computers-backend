import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    productId: {
        type: String,
        default: null
    },
    productName: {
        type: String,
        default: "General Experience"
    },
    userName: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        required: true
    },
    userImage: {
        type: String,
        default: "/default-profile.png"
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    title: {
        type: String,
        default: ""
    },
    comment: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["approved", "pending", "rejected"],
        default: "approved"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Review = mongoose.model("Reviews", reviewSchema);

export default Review;
