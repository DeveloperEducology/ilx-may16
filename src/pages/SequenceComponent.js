import React, { useState, useEffect } from "react";

const SequenceComponent = ({ question, onSubmit }) => {
  const [inputValues, setInputValues] = useState([]);
  const [filledSequences, setFilledSequences] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [submissionStatus, setSubmissionStatus] = useState(null); // null, "correct", "incorrect"

  const sequenceStrs = question?.question || [];
  const correctAnswers = question?.correctAnswer || [];
  const isSentence = sequenceStrs.some((q) => /[a-zA-Z]/.test(q));

  useEffect(() => {
    // Initialize input values based on nulls
    const nullCount = sequenceStrs.reduce(
      (acc, str) => acc + (str.match(/null/g) || []).length,
      0
    );
    setInputValues(Array(nullCount).fill(""));
    setFilledSequences([]);
    setFeedback("");
  }, [question]);


  // Count total nulls across all question strings
  const totalNullCount = sequenceStrs.reduce(
    (count, str) => count + (str.match(/null/g) || []).length,
    0
  );


    // Initialize inputValues based on total nulls
    if (inputValues.length !== totalNullCount) {
      setInputValues(Array(totalNullCount).fill(""));
      setSubmissionStatus(null); // Reset submission status on question change
    }
  

  // Handle input change for a specific null index
  const handleInputChange = (index, value) => {
    const newInputValues = [...inputValues];
    newInputValues[index] = value;
    setInputValues(newInputValues);
    setFeedback("");
    setSubmissionStatus(null); // Reset submission status on input change
  };

  const handleSubmit = () => {
    let nullIndex = 0;
    const filled = sequenceStrs.map((str) =>
      str.replace(/null/g, () => inputValues[nullIndex++] || "")
    );
    setFilledSequences(filled);

    const isCorrect = inputValues.every(
      (val, idx) => val.trim() === correctAnswers[idx]
    );

    setFeedback(
      isCorrect
        ? "✅ Correct!"
        : `❌ Incorrect. Correct answer(s): ${correctAnswers.join(", ")}`
    );
    onSubmit?.(isCorrect);
  };

  const renderInput = (nullIdx) => (
    <input
      key={`input-${nullIdx}`}
      type="text"
      value={inputValues[nullIdx] || ""}
      onChange={(e) => handleInputChange(nullIdx, e.target.value)}
      className="w-8 h-5 text-center border border-gray-400 rounded px-1 py-1 mx-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );

  return (
    <div className="p-6 max-w-xl mx-auto text-center">
      <p className="text-xl font-semibold mb-4">{question.text}</p>

      {question.imageUrl?.length > 0 && (
        <div className="mb-4">
          {question.imageUrl.map((url, idx) => (
            <img
              key={idx}
              src={url}
              alt={`img-${idx}`}
              style={question.style || { maxWidth: "100%", height: "auto" }}
              className="mx-auto rounded"
            />
          ))}
        </div>
      )}

      <div className="space-y-4 mb-6 text-left">
        {sequenceStrs.map((str, qIdx) => {
          const parts = str.split(/(null)/);
          let nullCounter = inputValues.slice(0, 100).length > 0 ? 0 : -1;
          return (
            <p key={qIdx} className="text-lg leading-loose">
              {parts.map((part, idx) => {
                if (part === "null") {
                  return renderInput(nullCounter++);
                }
                return <span key={idx}>{part}</span>;
              })}
            </p>
          );
        })}
      </div>

      <button
        onClick={handleSubmit}
        disabled={inputValues.some((v) => v.trim() === "")}
        className="bg-green-500 text-white font-semibold px-6 py-2 rounded hover:bg-green-600 transition disabled:bg-gray-400"
      >
        Submit
      </button>

      {filledSequences.length > 0 && (
        <div className="mt-4 text-left">
          <p className="text-lg font-medium">Output:</p>
          {filledSequences.map((seq, idx) => (
            <p key={idx} className="font-mono text-blue-700">
              {seq}
            </p>
          ))}
        </div>
      )}

      {feedback && (
        <div
          className={`mt-4 text-lg ${
            feedback.includes("Correct") ? "text-green-600" : "text-red-600"
          }`}
        >
          <p>{feedback}</p>
        </div>
      )}
    </div>
  );
};

export default SequenceComponent;
