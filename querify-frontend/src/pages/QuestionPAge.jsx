// src/pages/QuestionPage.jsx

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import { ArrowUp, ArrowDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

const QuestionPage = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [votes, setVotes] = useState({ upvotes: 0, downvotes: 0 });

  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState("");

  const handlePostAnswer = async () => {
    if (!newAnswer.trim()) return;
    try {
      await axios.post(
        `http://localhost:8000/questions/${id}/answers`,
        {
          body: newAnswer,
          question_id: question.id,
        },
        {
          headers: { Authorization: token },
        }
      );

      setNewAnswer("");
      setAnswers([
        ...answers,
        { body: newAnswer, username: "You", createdAt: new Date() },
      ]);
    } catch (err) {
      console.error("Answer post error:", err);
      alert("Failed to post answer.");
    }
  };

  const handleNewQuestionClick = () => {
    if (token) {
      handlePostAnswer();
    } else {
      navigate("/login");
    }
  };
  const formattedDate = question?.created_at
    ? new Date(question.created_at).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const qRes = await axios.get(`http://localhost:8000/questions/${id}`, {
          headers: { Authorization: token },
        });
        setQuestion(qRes.data);
        setVotes({
          upvotes: qRes.data.upvotes || 0,
          downvotes: qRes.data.downvotes || 0,
        });

        const aRes = await axios.get(
          `http://localhost:8000/questions/${id}/answers`,
          {
            headers: { Authorization: token },
          }
        );
        setAnswers(aRes.data);
      } catch (err) {
        console.error("Error fetching question or answers:", err);
      }
    };

    fetchData();
  }, [id, token]);

  const handleVote = async (type) => {
    try {
      await axios.post(
        `http://localhost:8000/questions/${id}/${type}`,
        {},
        {
          headers: { Authorization: token },
        }
      );
      if (type === "upvote") {
        setVotes((prev) => ({ ...prev, upvotes: prev.upvotes + 1 }));
      } else {
        setVotes((prev) => ({ ...prev, downvotes: prev.downvotes + 1 }));
      }
    } catch (err) {
      console.error(`Failed to ${type}:`, err);
      alert(`Failed to ${type}`);
    }
  };

  if (!question)
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-bold text-gray-900">{question.title}</h1>
          <div className="flex items-center gap-4 mt-1">
            <button
              onClick={() => handleVote("upvote")}
              className="flex items-center gap-1 text-green-600 hover:text-green-800 transition"
              title="Upvote"
            >
              <ArrowUp size={18} />
              <span className="font-medium">{votes.upvotes}</span>
            </button>
            <button
              onClick={() => handleVote("downvote")}
              className="flex items-center gap-1 text-red-600 hover:text-red-800 transition"
              title="Downvote"
            >
              <ArrowDown size={18} />
              <span className="font-medium">{votes.downvotes}</span>
            </button>
          </div>
        </div>

        <p className="text-gray-700 mb-2 text-lg leading-relaxed">
          {question.body}
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Posted by{" "}
          <span className="font-medium">
            {question.owner.username || "Anonymous"}
          </span>{" "}
          • {formattedDate}
        </p>

        <hr className="my-6" />

        <h2 className="text-xl font-semibold text-gray-800 mb-4">Answers</h2>
        <div className="flex flex-col gap-4">
          {answers.length === 0 ? (
            <p className="text-gray-500">
              No answers yet. Be the first to answer!
            </p>
          ) : (
            answers.map((ans, index) => (
              <div
                key={index}
                className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 shadow-sm"
              >
                <p className="text-gray-800 text-md">{ans.body}</p>
                <div className="text-sm text-gray-500 mt-2">
                  — {ans.owner?.username || "Anonymous"} on{" "}
                  {ans.created_at
                    ? new Date(ans.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "Unknown date"}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-10 bg-white p-6 rounded-xl shadow-md max-w-3xl mx-auto">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">
          Post Your Answer
        </h3>
        <textarea
          rows="4"
          placeholder="Write your answer..."
          className="w-full border rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={newAnswer}
          onChange={(e) => setNewAnswer(e.target.value)}
        />
        <button
          onClick={handleNewQuestionClick}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition duration-200"
        >
          Submit Answer
        </button>
      </div>
    </div>
  );
};

export default QuestionPage;
