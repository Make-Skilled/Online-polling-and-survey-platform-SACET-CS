const express = require("express");
const { createVote, deleteVote, checkVote, myVotes, getVoters } = require("../Controller/voteController");
const { isAuthenticatedUser } = require("../middlewares/auth");
const demoRestrictionMiddleware = require("../middlewares/demoRestrictionMiddleware");

const router = express.Router();

router.route("/checkVote/:pollId").get(isAuthenticatedUser, checkVote)
router.route("/voters").get(isAuthenticatedUser, getVoters)
router.route("/myVotes").get(isAuthenticatedUser, myVotes)
router.route("/:pollId").post(isAuthenticatedUser, demoRestrictionMiddleware, createVote);
router.route("/:pollId").delete(isAuthenticatedUser, demoRestrictionMiddleware, deleteVote)

module.exports = router;
