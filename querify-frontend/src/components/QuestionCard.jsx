import { ArrowUp, ArrowDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const QuestionCard = ({ question }) => {
  const [votes, setVotes] = useState({
    upvotes: question.upvotes || 0,
    downvotes: question.downvotes || 0,

    
    });

    const formattedDate = new Date(question.created_at).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    })


  


  const token = localStorage.getItem("token");


  const handleVote = async (type) => {
    try {
      const res = await axios.post(
        `http://localhost:8000/questions/${question.id}/${type}`,
        {},
        {
          headers: { Authorization: token },
        }
      );

      const { upvotes, downvotes } = res.data;
    setVotes({ upvotes, downvotes });
   
    } catch (err) {
      console.error(`Failed to ${type}:`, err);
      alert(err.response.data.detail);
    }
  };
  

  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 transition-all hover:shadow-2xl">
      <div className="flex justify-between items-start gap-4 flex-wrap">
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-900">{question.title}</h2>
          <p className="text-gray-600 mt-2">{question.body}</p>

          <div className="flex items-center gap-4 text-sm mt-4 text-gray-600 flex-wrap">
            {/* Voting row */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleVote("upvote")}
                className="flex items-center gap-1 text-green-600 hover:text-green-800 transition"
              >
                <ArrowUp size={18} />
                <span>{votes.upvotes}</span>
              </button>

              <button
                onClick={() => handleVote("downvote")}
                className="flex items-center gap-1 text-red-600 hover:text-red-800 transition"
              >
                <ArrowDown size={18} />
                <span>{votes.downvotes}</span>
              </button>
            </div>

            <span>by {question.owner.username || "Unknown"}</span>
            <span>• {formattedDate}</span>
          </div>
        </div>

        <Link
          to={`/question/${question.id}`}
          className="text-indigo-600 font-semibold hover:underline whitespace-nowrap mt-2"
        >
          View Question →
        </Link>
      </div>
    </div>
  );
};

export default QuestionCard;
