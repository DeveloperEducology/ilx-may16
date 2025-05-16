import React, { useState, useEffect } from "react";

const FillInTheBlank = ({ classId, subjectId, question, onSubmit }) => {
  const [userAnswers, setUserAnswers] = useState([]);
  const [results, setResults] = useState(null);

  // Initialize userAnswers when question changes
  useEffect(() => {
    setUserAnswers(Array(question.correctAnswer.length).fill(""));
    setResults(null); // Reset results for new question
  }, [question]);

  const handleInputChange = (value, index) => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[index] = value;
    setUserAnswers(updatedAnswers);
  };

  const handleSubmit = () => {
    // Validate answers
    const result = userAnswers.map(
      (answer, idx) => answer.trim() === question.correctAnswer[idx]
    );
    setResults(result);

    // Determine if all answers are correct
    const isCorrect = result.every((r) => r);

    // Call onSubmit with isCorrect to update SmartScore and navigate
    onSubmit(isCorrect);

    // Clear results after a delay to show feedback
    setTimeout(() => {
      setResults(null);
    }, 1500); // Match PracticeQuestionPage's delay
  };

  // Find indices of null parts (blanks) in the question
  const nullIndices = question.question
    .map((part, idx) => (part === null ? idx : -1))
    .filter((idx) => idx !== -1);

  return (
    <div className="p-8 max-w-2xl justify-left mx-auto bg-white rounded-lg">
      <p className="text-lg mb-4 font-semibold">{question.text}</p>

      {/* Images */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        {question?.imageUrl?.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Image ${index + 1}`}
            className={`rounded ${
              question.imageUrl.length === 1
                ? "w-full h-auto max-w-md" // Single image: large, full-width, capped at max-width
                : "w-24 h-24 sm:w-32 sm:h-32 object-contain" // Multiple images: smaller, in a row
            }`}
          />
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {question.question.map((part, index) =>
          part === null ? (
            <input
              key={index}
              type="text"
              className={`border p-1 rounded w-15 text-center ${
                results &&
                (results[nullIndices.indexOf(index)]
                  ? "border-green-500"
                  : "border-red-500")
              }`}
              placeholder="___"
              value={userAnswers[nullIndices.indexOf(index)] || ""}
              onChange={(e) =>
                handleInputChange(e.target.value, nullIndices.indexOf(index))
              }
            />
          ) : question.t ? (
            <span key={index}>{part},</span>
          ) : (
            <span key={index}>{part}</span>
          )
        )}
      </div>
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
      >
        Submit
      </button>

      {results && (
        <div className="mt-4">
          {results.every((r) => r) ? (
            <p className="text-green-600 font-semibold">
              All answers are correct! 🎉
            </p>
          ) : (
            <div className="text-red-600 font-semibold">
              <p>Some answers are incorrect. Try again!</p>
              <ul className="list-disc list-inside mt-2">
                {results.map(
                  (isCorrect, idx) =>
                    !isCorrect && (
                      <li key={idx}>
                        Blank {idx + 1}: Your answer "{userAnswers[idx]}" is
                        wrong. Correct answer is "{question.correctAnswer[idx]}
                        ".
                      </li>
                    )
                )}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FillInTheBlank;
