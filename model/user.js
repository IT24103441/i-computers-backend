import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    firstName: { 
        type: String, 
        required: true 
    },
    lastName: { 
        type: String, 
        required: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    isAdmin: {
        type: Boolean, 
        default: false,
        required: true
    },
    isBlocked: { 
        type: Boolean, 
        default: false,
        required: true 
    },
    isEmailVerified: { 
        type: Boolean, 
        default: false,
        required: true 
    },
    image: { 
        type: String,
        required: true,
        default: "/default-profile.png" 
    }
});

const User = mongoose.model("Users", userSchema);

export default User;