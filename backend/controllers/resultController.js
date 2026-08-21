const db = require("../config/db");

exports.submitQuiz = async (req, res) => {
    try {

        const userId = req.user.id;

        const { quizId, answers } = req.body;

        if (!quizId || !answers) {
            return res.status(400).json({
                message: "Quiz ID and answers are required"
            });
        }

        // Get questions and correct answers
        const [questions] = await db.promise().query(
            `SELECT
                id,
                correct_answer
             FROM questions
             WHERE quiz_id = ?`,
            [quizId]
        );

        if (questions.length === 0) {
            return res.status(404).json({
                message: "No questions found"
            });
        }

        let score = 0;

        questions.forEach((question) => {

            const userAnswer = answers[question.id];

            if (
                userAnswer &&
                userAnswer.toUpperCase() ===
                question.correct_answer.toUpperCase()
            ) {
                score++;
            }

        });

        const totalQuestions = questions.length;

        const percentage =
            (score / totalQuestions) * 100;

        const correctAnswers = score;

        const wrongAnswers =
            totalQuestions - score;

        // Get quiz title
        const [quiz] = await db.promise().query(
            "SELECT title FROM quizzes WHERE id = ?",
            [quizId]
        );

        const quizTitle =
            quiz.length > 0
                ? quiz[0].title
                : "Quiz";

        // Save result
        await db.promise().query(
            `INSERT INTO results
            (user_id, quiz_id, score, total_questions, percentage)
            VALUES (?, ?, ?, ?, ?)`,
            [
                userId,
                quizId,
                score,
                totalQuestions,
                percentage
            ]
        );

        res.json({
            message: "Quiz submitted successfully",
            quizTitle,
            score,
            totalQuestions,
            percentage: percentage.toFixed(2),
            correctAnswers,
            wrongAnswers
        });

    } catch (error) {

        console.error(
            "Submit quiz error:",
            error
        );

        res.status(500).json({
            message: "Failed to submit quiz"
        });
    }
};
// GET RESULT HISTORY
exports.getMyResults = async (req, res) => {
    try {
        const userId = req.user.id;

        const [results] = await db.promise().query(
            `SELECT
                r.id,
                q.title AS quiz_title,
                r.score,
                r.total_questions,
                r.percentage,
                r.created_at
             FROM results r
             JOIN quizzes q
             ON r.quiz_id = q.id
             WHERE r.user_id = ?
             ORDER BY r.created_at DESC`,
            [userId]
        );

        res.json(results);

    } catch (error) {
        console.error("Get results error:", error);

        res.status(500).json({
            message: "Failed to fetch results"
        });
    }
};