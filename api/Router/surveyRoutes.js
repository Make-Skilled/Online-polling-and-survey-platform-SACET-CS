const express = require("express");
const { createSurvey, submitResponse, getSurvey, getAllSurveys, deleteSurvey } = require("../Controller/surveyController");
const { isAuthenticatedUser } = require("../middlewares/auth");
const demoRestrictionMiddleware = require("../middlewares/demoRestrictionMiddleware");

const router = express.Router();

router.route("/create").post(isAuthenticatedUser, demoRestrictionMiddleware, createSurvey);
router.route("/submit/:id").post(isAuthenticatedUser, demoRestrictionMiddleware, submitResponse);
router.route("/get/:id").get(isAuthenticatedUser, getSurvey);
router.route("/all").get(isAuthenticatedUser, getAllSurveys);
router.route("/delete/:id").delete(isAuthenticatedUser, demoRestrictionMiddleware, deleteSurvey);

module.exports = router;