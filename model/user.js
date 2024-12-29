import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
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
    mobile: {
        type: String,
        required: true,
        unique: true
    },
    gender: {
        type: String,
        required: true
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    whishlist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    role: {
        type: String,
        required: true,
        enum: ["buyer", "seller", "admin"],
        default: "buyer"
    }
});

const User = mongoose.model("User", userSchema);

export default User;