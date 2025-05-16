import React, { useState, useEffect } from "react";

function McqComponent({ classId, subjectId, question, onSubmit }) {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [isReading, setIsReading] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  console.log(selectedOptions);

  // Text-to-speech functionality
  const readAloud = (text) => {
    if ("speechSynthesis" in window && !isReading) {
      setIsReading(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsReading(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Handle option selection/deselection based on question type
  const handleOptionSelect = (option) => {
    if (question.questionType === "single") {
      // For single-select, replace the current selection
      setSelectedOptions([option]);
    } else {
      // For multiple-select, toggle the option
      setSelectedOptions((prev) =>
        prev.includes(option)
          ? prev.filter((o) => o !== option)
          : [...prev, option]
      );
    }
  };

  // Handle submission
  const handleSubmit = () => {
    if (selectedOptions.length === 0) {
      setFeedback("Please select at least one option!");
      setShowFeedback(false);
      return;
    }

    const isCorrect = Array.isArray(question.correctAnswer)
      ? // Multiple-select: Check if all correct answers are selected and no extras
        selectedOptions.sort().join() === question.correctAnswer.sort().join()
      : // Single-select: Check if the selected option matches the correct answer
        selectedOptions[0] === question.correctAnswer[0];

    if (isCorrect) {
      setFeedback("Correct! Great job!");
      setShowFeedback(true);
    } else {
      setFeedback(
        `Wrong! The correct answer${
          Array.isArray(question.correctAnswer) ? "s are" : " is"
        } ${
          Array.isArray(question.correctAnswer)
            ? question.correctAnswer.join(", ")
            : question.correctAnswer
        }.`
      );
      setShowFeedback(false);
    }

    setTimeout(() => {
      onSubmit(isCorrect);
      setSelectedOptions([]);
      setFeedback("");
      setShowFeedback(false);
    }, 1500);
  };

  // Reset states when new question comes
  useEffect(() => {
    setSelectedOptions([]);
    setFeedback("");
    setShowFeedback(false);
  }, [question]);

  // Find indices of null parts (blanks) in the question
  const nullIndices = question.question
    .map((part, idx) => (part === null ? idx : -1))
    .filter((idx) => idx !== -1);

  return (
    <div className="flex flex-col animate-fadeIn">
      {showFeedback ? (
        <div className="mt-8 text-center text-xl font-semibold text-green-600 animate-bounce">
          {feedback}
        </div>
      ) : (
        <>
          {/* Text */}
          {question?.text && (
            <div className="text-green-600 text-center text-lg sm:text-xl mb-4 flex justify-center items-center cursor-pointer">
              {question.text}
            </div>
          )}

          {/* Clue */}
          {question.clue && (
            <div className="text-blue-400 text-center text-lg sm:text-xl mb-4 flex justify-center items-center cursor-pointer">
              <button
                onClick={() => readAloud(question.clue)}
                className="mr-3 text-xl sm:text-2xl text-yellow-500 hover:text-yellow-700 transition duration-200"
              >
                🔊
              </button>
              Clue:
            </div>
          )}

          {/* Question Text */}
          <div className="text-blue-600 text-lg sm:text-xl mb-6 flex items-center">
            <button
              onClick={() =>
                readAloud(
                  Array.isArray(question.question)
                    ? question.question.join(", ")
                    : question.question
                )
              }
              className="mr-3 text-xl sm:text-2xl text-yellow-500 hover:text-yellow-700 transition duration-200"
            >
              🔊
            </button>
            {question.question.map((part, index) =>
              part === null ? (
                <input
                  key={index}
                  type="text"
                  className="border rounded w-7 text-center"
                  // placeholder="___"
                  value={selectedOptions[0] || ""}
                />
              ) : question.t ? (
                <span key={index}>{part},</span>
              ) : (
                <span key={index}>{part}</span>
              )
            )}
          </div>

          {/* Images */}
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {question?.images?.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Image ${index + 1}`}
                className="w-24 h-24 sm:w-32 sm:h-32 object-contain rounded-xl shadow-lg hover:shadow-xl transition duration-300"
              />
            ))}
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8 w-full max-w-lg">
            {question.options?.map((option, index) => (
              <button
                key={index}
                onClick={() => {
                  handleOptionSelect(option);
                  // readAloud(option);
                }}
                className={`bg-blue-100 text-gray-800 px-4 sm:px-6 py-2 sm:py-3 rounded-lg border-2 border-blue-200 hover:bg-blue-200 flex items-center justify-center text-xs sm:text-sm font-medium shadow-sm hover:shadow-md transition duration-300 ${
                  selectedOptions.includes(option) ? "bg-blue-300" : ""
                }`}
              >
                <span className="mr-1 sm:mr-2 text-base sm:text-lg text-yellow-500 hover:text-yellow-700">
                  {/* 🔊 */}
                </span>
                {option}
              </button>
            ))}
          </div>
          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white px-8 sm:px-10 py-3 sm:py-4 rounded-xl hover:bg-green-600 transition duration-300 text-base sm:text-xl font-bold shadow-md hover:shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
            disabled={selectedOptions.length === 0}
          >
            Submit
          </button>

          {/* Feedback for incorrect answers or validation errors */}
          {feedback && (
            <div className="mt-6 text-center text-lg sm:text-xl font-semibold text-red-600 animate-bounce">
              {feedback}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default McqComponent;
