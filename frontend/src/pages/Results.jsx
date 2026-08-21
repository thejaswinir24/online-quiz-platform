import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Results() {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        fetchResults();
    }, []);

    const fetchResults = async () => {
        try {
            const response = await API.get("/results/my-results");
            setResults(response.data);
        } catch (error) {
            console.error("Failed to load results:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="results-page">

            <div className="results-container">

                <button
                    className="back-button"
                    onClick={() => navigate("/dashboard")}
                >
                    ← Dashboard
                </button>

                <h1>My Results</h1>

                {loading ? (
                    <p>Loading results...</p>
                ) : results.length === 0 ? (
                    <div className="no-results">
                        <h3>No quiz attempts yet</h3>
                        <p>Complete a quiz to see your results here.</p>
                    </div>
                ) : (

                    <div className="results-list">

                        {results.map((result) => (

                            <div
                                className="result-item"
                                key={result.id}
                            >

                                <div>
                                    <h3>{result.quiz_title}</h3>

                                    <p>
                                        Score: {result.score}/
                                        {result.total_questions}
                                    </p>

                                    <small>
                                        {new Date(
                                            result.created_at
                                        ).toLocaleString()}
                                    </small>
                                </div>

                                <div className="result-percentage">
                                    {Number(result.percentage).toFixed(2)}%
                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>
    );
}

export default Results;