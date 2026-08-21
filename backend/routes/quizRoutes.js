const express = require("express");

const {
    getQuizzes,
    getQuizById,
    createQuiz,
    deleteQuiz
} = require("../controllers/quizController");

const {
    authenticate,
    adminOnly
} = require("../middleware/authMiddleware");

const router = express.Router();

// Get all quizzes
router.get("/", authenticate, getQuizzes);

// Get one quiz with questions
router.get("/:id", authenticate, getQuizById);

// Create quiz - Admin only
router.post("/", authenticate, adminOnly, createQuiz);

// Delete quiz - Admin only
router.delete("/:id", authenticate, adminOnly, deleteQuiz);

module.exports = router;