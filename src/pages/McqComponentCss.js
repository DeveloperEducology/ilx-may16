import React, { useState, useEffect } from "react";
import "./mca.css";

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
    <div className="container">
      {showFeedback ? (
        <div className="feedback-correct">{feedback}</div>
      ) : (
        <>
          {/* Text */}
          {question?.text && (
            <div className="text-green">{question.text}</div>
          )}

          {/* Clue */}
          {question.clue && (
            <div className="clue">
              <button
                onClick={() => readAloud(question.clue)}
                className="speaker-button"
              >
                🔊
              </button>
              Clue:
            </div>
          )}

          {/* Question Text */}
          <div className="question-text">
            <button
              onClick={() =>
                readAloud(
                  Array.isArray(question.question)
                    ? question.question.join(", ")
                    : question.question
                )
              }
              className="speaker-button"
            >
              🔊
            </button>
            {question.question.map((part, index) =>
              part === null ? (
                <input
                  key={index}
                  type="text"
                  className="blank-input"
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
          <div className="images-container">
            {question?.images?.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Image ${index + 1}`}
                className="image"
              />
            ))}
          </div>

          {/* Options */}
          <div className="options-grid">
            {question.options?.map((option, index) => (
              <button
                key={index}
                onClick={() => {
                  handleOptionSelect(option);
                }}
                className={`option-button ${
                  selectedOptions.includes(option) ? "selected" : ""
                }`}
              >
                <span className="speaker-button"></span>
                {option}
              </button>
            ))}
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="submit-button"
            disabled={selectedOptions.length === 0}
          >
            Submit
          </button>

          {/* Feedback for incorrect answers or validation errors */}
          {feedback && <div className="feedback-error">{feedback}</div>}
        </>
      )}
    </div>
  );
}

export default McqComponent;