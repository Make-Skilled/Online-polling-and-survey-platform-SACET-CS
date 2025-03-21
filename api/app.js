const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const ErrorHandling = require("./middlewares/error");
const path = require('path');

// Load env vars
dotenv.config();  // Changed this line

// Middlewares
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Routes
const user = require("./Router/userRoutes");
const poll = require("./Router/pollRoutes");
const vote = require("./Router/voteRoutes");
const comment = require("./Router/commentRoutes");
const followerFollowing = require("./Router/followerFollowingRoutes");
const savePoll = require("./Router/savePollRoutes");
const survey = require("./Router/surveyRoutes");

app.use("/api/v1/user", user);
app.use("/api/v1/poll", poll);
app.use("/api/v1/vote", vote);
app.use("/api/v1/comment", comment);
app.use("/api/v1/followers_followings", followerFollowing);
app.use("/api/v1/save-poll", savePoll);
app.use("/api/v1/survey", survey);

// Base route
app.get('/', (req, res) => {
    res.send('Welcome to the Echoes-Insights API!');
});

// Error handling
app.use((req, res, next) => {
    const error = new Error(`Cannot find Resource on this server!`);
    error.statusCode = 404;
    next(error);
});

app.use(ErrorHandling);

module.exports = app;
