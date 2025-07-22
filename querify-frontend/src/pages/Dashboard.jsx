import { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import QuestionCard from "../components/QuestionCard";
import AnswerCard from "../components/AnswerCard"; // make sure it's imported
import { Loader2 } from "lucide-react";

const DashboardPage = () => {
  const { token, user } = useAuth();
  const [myQuestions, setMyQuestions] = useState([]);
  const [myAnswers, setMyAnswers] = useState([]);
  
  useEffect(() => {
    axios
      .get("http://localhost:8000/questions/mine", {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => setMyQuestions(res.data))
      .catch((err) => console.error(err));
  }, [token]);

  useEffect(() => {
    axios.get("http://localhost:8000/answers/mine", {
      headers: {
        Authorization: token,
      },

    })
    .then((res) => setMyAnswers(res.data))
    .catch((err) => console.error(err))
  })

  return (
    <div className="min-h-screen bg-indigo-50 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome,{" "}
            <span className="text-indigo-600">{user?.username || "User"}</span>{" "}
            👋
          </h1>
          <p className="text-gray-500 mt-2">
            Here’s a summary of your activity.
          </p>
        </div>

        {/* Your Questions */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-indigo-700">
            Your Questions
          </h2>
          {myQuestions.length === 0 ? (
            <p className="text-gray-500 italic bg-white p-4 rounded-xl shadow">
              You haven’t asked any questions yet.
            </p>
          ) : (
            myQuestions.map((q) => <QuestionCard key={q.id} question={q} />)
          )}
        </section>
        {/* Your Answers */}
        <section className="space-y-4">
  <h2 className="text-2xl font-semibold text-indigo-700">Your Answers</h2>
  {myAnswers.length === 0 ? (
    <p className="text-gray-500 italic bg-white p-4 rounded-xl shadow">
      You haven’t answered any questions yet.
    </p>
  ) : (
    myAnswers.map((ans) => (
      <AnswerCard key={ans.id} answer={ans} />
    ))
  )}
</section>

        
        
      </div>
    </div>
  );
};

export default DashboardPage;
