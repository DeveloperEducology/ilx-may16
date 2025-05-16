import React, { useState } from "react";

function PracticeQuestion({ subject, onBack }) {
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");

  const sampleQuestion = {
    question: `What is 2 + 3? (Subject: ${subject.name})`,
    correctAnswer: "5",
  };

  const handleSubmit = () => {
    if (answer === sampleQuestion.correctAnswer) {
      setFeedback("Correct! Great job!");
    } else {
      setFeedback("Try again!");
    }
  };

  return (
    <div className="space-y-4">
      <button onClick={onBack} className="text-blue-500 hover:underline mb-2">
        Back to Subjects
      </button>
      <h2 className="text-xl font-semibold text-gray-800">
        {subject.name} Practice
      </h2>
      <p className="text-gray-700">{sampleQuestion.question}</p>
      <input
        type="text"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Enter your answer"
        className="border border-gray-300 rounded p-2 w-64 focus:outline-none focus:ring-2 focus:ring-green-500"
      />
      <button
        onClick={handleSubmit}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
      >
        Submit
      </button>
      {feedback && (
        <p
          className={`text-sm ${
            feedback.includes("Correct") ? "text-green-600" : "text-red-600"
          }`}
        >
          {feedback}
        </p>
      )}
    </div>
  );
}

export default PracticeQuestion;
