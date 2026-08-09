import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        default: "General Inquiry"
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "replied"],
        default: "pending"
    },
    replyMessage: {
        type: String,
        default: ""
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    repliedAt: {
        type: Date,
        default: null
    }
});

const Contact = mongoose.model("Contacts", contactSchema);

export default Contact;
