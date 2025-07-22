import React, { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import QuestionCard from "../components/QuestionCard";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const { token } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate(); // Add this line

  useEffect(() => {
    axios
      .get("http://localhost:8000/questions", {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => setQuestions(res.data))
      .catch((err) => console.error(err));
  }, [token]);

  const handleNewQuestionClick = () => {
    if (token) {
      navigate("/ask");
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    const endpoint = searchQuery.trim()
      ? `http://localhost:8000/questions/search?q=${encodeURIComponent(
          searchQuery
        )}`
      : "http://localhost:8000/questions";

    axios
      .get(endpoint, {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => setQuestions(res.data))
      .catch((err) => console.error(err));
  }, [searchQuery, token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-indigo-700 mb-10">
          🔥 Explore Questions
        </h1>

        <div className="max-w-3xl mx-auto">
          <input
            type="text"
            placeholder="Search questions..."
            className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className="flex justify-end mt-4">
            <button
              onClick={handleNewQuestionClick} // or use useNavigate from react-router-dom
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-xl shadow-md transition duration-200"
            >
              + New Question
            </button>
          </div>

          <div className="flex flex-col gap-6 mt-8">
            {questions.length > 0 ? (
              questions.map((q) => <QuestionCard key={q.id} question={q} />)
            ) : (
              <p className="text-center text-gray-600 mt-6">
                No matching questions found.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
