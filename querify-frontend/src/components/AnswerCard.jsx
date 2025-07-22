import { Link } from "react-router-dom";

const AnswerCard = ({ answer }) => {
  const formattedDate = new Date(answer.answer.created_at).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="bg-white shadow-md rounded-xl p-4 transition hover:shadow-lg">
      <div className="mb-2">
        <h3 className="text-lg font-semibold text-indigo-700">
          
          <Link to={`/question/${answer.question.id}`} >
            Question : {answer.question.title}
          </Link>
        </h3>
        <p className="text-sm text-gray-500">Answered on {formattedDate}</p>
      </div>

      <p className="text-gray-700">{answer.answer.body}</p>
    </div>
  );
};

export default AnswerCard;
