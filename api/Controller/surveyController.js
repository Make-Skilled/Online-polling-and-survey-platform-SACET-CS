const { sendErrorResponse } = require("../middlewares/erroHandle");
const Survey = require("../Models/SurveySchema");

exports.createSurvey = async (req, res) => {
    try {
        const { title, description, endDate } = req.body;
        const userId = req.user._id;
        
        if (!title) return sendErrorResponse(res, 401, "Title is required");
        if (!description) return sendErrorResponse(res, 401, "Description is required");
        
        let survey;
        if (!endDate) {
            survey = await Survey.create({ title, description, author: userId });
        } else {
            survey = await Survey.create({ title, description, author: userId, endDate });
        }
        
        res.status(200).json({
            success: true,
            message: "Survey created Successfully",
            survey
        });
    } catch (error) {
        return sendErrorResponse(res, 500, error.message);
    }
};

exports.submitResponse = async (req, res) => {
    try {
        const { response } = req.body;
        const surveyId = req.params.id;
        const userId = req.user._id;

        if (!response) return sendErrorResponse(res, 401, "Response is required");

        const survey = await Survey.findById(surveyId);
        if (!survey) return sendErrorResponse(res, 404, "Survey not found");

        if (survey.endDate < new Date()) {
            return sendErrorResponse(res, 400, "Survey has ended");
        }

        // Check if user has already responded
        const existingResponse = survey.responses.find(r => r.user.toString() === userId.toString());
        if (existingResponse) {
            return sendErrorResponse(res, 400, "You have already submitted a response");
        }

        survey.responses.push({ user: userId, response });
        await survey.save();

        res.status(200).json({
            success: true,
            message: "Response submitted successfully"
        });
    } catch (error) {
        return sendErrorResponse(res, 500, error.message);
    }
};

exports.getSurvey = async (req, res) => {
    try {
        const survey = await Survey.findById(req.params.id)
            .populate('author', 'name avatar')
            .populate('responses.user', 'name avatar');
            
        if (!survey) return sendErrorResponse(res, 404, "Survey not found");
        
        res.status(200).json({
            success: true,
            survey
        });
    } catch (error) {
        return sendErrorResponse(res, 500, error.message);
    }
};

exports.getAllSurveys = async (req, res) => {
    try {
        const surveys = await Survey.find()
            .populate('author', 'name avatar')
            .sort('-createdAt');
            
        res.status(200).json({
            success: true,
            surveys
        });
    } catch (error) {
        return sendErrorResponse(res, 500, error.message);
    }
};

exports.deleteSurvey = async (req, res) => {
    try {
        const survey = await Survey.findByIdAndDelete(req.params.id);
        if (!survey) return sendErrorResponse(res, 404, "Survey not found");
        
        res.status(200).json({
            success: true,
            message: "Survey deleted successfully"
        });
    } catch (error) {
        return sendErrorResponse(res, 500, error.message);
    }
};