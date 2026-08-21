const db = require("../config/db");

// GET ALL QUIZZES
exports.getQuizzes = async (req, res) => {
    try {
        const [quizzes] = await db.promise().query(
            `SELECT 
                q.id,
                q.title,
                q.description,
                q.created_at,
                COUNT(questions.id) AS question_count
             FROM quizzes q
             LEFT JOIN questions
             ON q.id = questions.quiz_id
             GROUP BY q.id
             ORDER BY q.id DESC`
        );

        res.json(quizzes);

    } catch (error) {
        console.error("Get quizzes error:", error);

        res.status(500).json({
            message: "Failed to fetch quizzes"
        });
    }
};


// GET ONE QUIZ WITH QUESTIONS
exports.getQuizById = async (req, res) => {
    try {
        const { id } = req.params;

        const [quiz] = await db.promise().query(
            `SELECT 
                id,
                title,
                description
             FROM quizzes
             WHERE id = ?`,
            [id]
        );

        if (quiz.length === 0) {
            return res.status(404).json({
                message: "Quiz not found"
            });
        }

        const [questions] = await db.promise().query(
            `SELECT
                id,
                question,
                option_a,
                option_b,
                option_c,
                option_d
             FROM questions
             WHERE quiz_id = ?
             ORDER BY id`,
            [id]
        );

        res.json({
            quiz: quiz[0],
            questions: questions
        });

    } catch (error) {
        console.error("Get quiz error:", error);

        res.status(500).json({
            message: "Failed to fetch quiz"
        });
    }
};


// CREATE QUIZ
exports.createQuiz = async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title) {
            return res.status(400).json({
                message: "Quiz title is required"
            });
        }

        const [result] = await db.promise().query(
            `INSERT INTO quizzes
             (title, description)
             VALUES (?, ?)`,
            [title, description || ""]
        );

        res.status(201).json({
            message: "Quiz created successfully",
            quizId: result.insertId
        });

    } catch (error) {
        console.error("Create quiz error:", error);

        res.status(500).json({
            message: "Failed to create quiz"
        });
    }
};


// DELETE QUIZ
exports.deleteQuiz = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.promise().query(
            "DELETE FROM quizzes WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Quiz not found"
            });
        }

        res.json({
            message: "Quiz deleted successfully"
        });

    } catch (error) {
        console.error("Delete quiz error:", error);

        res.status(500).json({
            message: "Failed to delete quiz"
        });
    }
};