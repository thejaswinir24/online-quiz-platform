import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Dashboard() {
  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await API.get("/quizzes");
      setQuizzes(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Unable to load quizzes"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div className="dashboard">

      <header className="navbar">

        <div>
          <h2>QuizMaster</h2>
        </div>

        <div className="nav-right">

  <span>
    Welcome, {user?.name}
  </span>

  <button onClick={() => navigate("/results")}>
    My Results
  </button>

  <button onClick={handleLogout}>
    Logout
  </button>

</div>

      </header>

      <main className="dashboard-content">

        <section className="welcome-section">

          <h1>Online Quiz Platform</h1>

          <p>
            Test your knowledge and improve your skills.
          </p>

        </section>

        <section>

          <h2 className="section-title">
            Available Quizzes
          </h2>

          {loading && (
            <p>Loading quizzes...</p>
          )}

          {error && (
            <p className="error">
              {error}
            </p>
          )}

          {!loading && !error && quizzes.length === 0 && (
            <p>
              No quizzes available.
            </p>
          )}

          <div className="quiz-grid">

            {quizzes.map((quiz) => (

              <div
                className="quiz-card"
                key={quiz.id}
              >

                <h3>{quiz.title}</h3>

                <p>
                  {quiz.description}
                </p>

                <p className="question-count">
                  {quiz.question_count} Questions
                </p>

                <button
                  onClick={() =>
                    navigate(`/quiz/${quiz.id}`)
                  }
                >
                  Start Quiz
                </button>

              </div>

            ))}

          </div>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;