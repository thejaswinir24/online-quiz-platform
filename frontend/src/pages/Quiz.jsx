import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

function Quiz() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchQuiz();
  }, [id]);

  const fetchQuiz = async () => {

    try {

      const response = await API.get(
        `/quizzes/${id}`
      );

      setQuiz(response.data.quiz);
      setQuestions(response.data.questions);

    } catch (error) {

      setError(
        error.response?.data?.message ||
        "Unable to load quiz"
      );

    } finally {

      setLoading(false);

    }
  };

  const handleAnswer = (
    questionId,
    answer
  ) => {

    setAnswers({
      ...answers,
      [questionId]: answer
    });

  };

  const handleSubmit = () => {

    const unanswered = questions.filter(
      (question) =>
        !answers[question.id]
    );

    if (unanswered.length > 0) {

      alert(
        `Please answer all questions. ${unanswered.length} question(s) remaining.`
      );

      return;
    }

    navigate("/result", {
      state: {
        quizId: id,
        quizTitle: quiz.title,
        questions,
        answers
      }
    });

  };

  if (loading) {
    return (
      <div className="quiz-page">
        <p>Loading quiz...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="quiz-page">
        <p className="error">{error}</p>
      </div>
    );
  }

  return (

    <div className="quiz-page">

      <div className="quiz-container">

        <div className="quiz-header">

          <button
            onClick={() =>
              navigate("/dashboard")
            }
            className="back-button"
          >
            ← Back
          </button>

          <h1>{quiz?.title}</h1>

          <p>
            {quiz?.description}
          </p>

        </div>

        <div className="questions-container">

          {questions.map(
            (question, index) => (

              <div
                className="question-card"
                key={question.id}
              >

                <h3>
                  {index + 1}.{" "}
                  {question.question}
                </h3>

                <div className="options">

                  <label>
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value="A"
                      checked={
                        answers[question.id] === "A"
                      }
                      onChange={() =>
                        handleAnswer(
                          question.id,
                          "A"
                        )
                      }
                    />

                    {question.option_a}
                  </label>

                  <label>
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value="B"
                      checked={
                        answers[question.id] === "B"
                      }
                      onChange={() =>
                        handleAnswer(
                          question.id,
                          "B"
                        )
                      }
                    />

                    {question.option_b}
                  </label>

                  <label>
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value="C"
                      checked={
                        answers[question.id] === "C"
                      }
                      onChange={() =>
                        handleAnswer(
                          question.id,
                          "C"
                        )
                      }
                    />

                    {question.option_c}
                  </label>

                  <label>
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value="D"
                      checked={
                        answers[question.id] === "D"
                      }
                      onChange={() =>
                        handleAnswer(
                          question.id,
                          "D"
                        )
                      }
                    />

                    {question.option_d}
                  </label>

                </div>

              </div>

            )
          )}

        </div>

        <button
          className="submit-quiz-button"
          onClick={handleSubmit}
        >
          Submit Quiz
        </button>

      </div>

    </div>

  );
}

export default Quiz;