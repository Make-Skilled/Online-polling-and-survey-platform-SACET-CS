const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name is required"],
        minLength: [3, "name cannot be less than 3 characters"],
        maxLength: [40, "name cannot be greater than 40 characters"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: [true, "Email already Exists"],
        validate: [validator.isEmail, "enter a valid email address"],
    },
    password: {
        type: String,
        minLength: [8, "Password should be at least 8 characters"],
        required: [true, "Password is required"]
    },
    avatar: {
        public_id: String,
        url: {
            type: String,
            default: "/uploads/profile_images/default.png"
        }
    },
    myStatus: {
        type: String,
        default: "Love is Life so Let me Love You"
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isVerified: {
        type: Boolean,
        default: true
    }
});

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    return next();
});

userSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateToken = function () {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET_KEY);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
