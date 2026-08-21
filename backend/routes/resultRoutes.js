const express = require("express");

const {
    submitQuiz,
    getMyResults
} = require("../controllers/resultController");

const {
    authenticate
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
    "/submit",
    authenticate,
    submitQuiz
);

router.get(
    "/my-results",
    authenticate,
    getMyResults
);

module.exports = router;