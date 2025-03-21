const mongoose = require("mongoose");

const responseSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    response: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const surveySchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "title is required"],
    },
    description: {
        type: String,
        required: true,
    },
    responses: [responseSchema],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date,
        default: () => Date.now() + 24*60*60*1000  // 1 day
    },
    tags: [String],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Survey = mongoose.model("Survey", surveySchema);
module.exports = Survey;