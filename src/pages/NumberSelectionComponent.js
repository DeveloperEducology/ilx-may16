import React, { useState } from "react";
import NumberGrid from "./NumberSelNumGrid";

function NumberSelectionComponent({ classId, subjectId, question, onSubmit }) {
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [isReading, setIsReading] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  // Text-to-speech functionality
  const readAloud = (text) => {
    if ("speechSynthesis" in window && !isReading) {
      setIsReading(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsReading(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Handle number selection from NumberGrid
  const handleNumberSelect = (number) => {
    setSelectedNumber(number);
    setFeedback("");
  };

  // Handle submission
  const handleSubmit = () => {
    if (selectedNumber === null) {
      setFeedback("Please select a number!");
      setShowFeedback(false); // Ensure question remains visible for validation errors
      return;
    }

    const isCorrect = selectedNumber === question.correctAnswer;
    if (isCorrect) {
      setFeedback("Correct! Great job!");
      setShowFeedback(true); // Hide question and show feedback
    } else {
      setFeedback(`Wrong! The correct answer is ${question.correctAnswer}.`);
      setShowFeedback(false); // Keep question visible for incorrect answers
    }

    setTimeout(() => {
      onSubmit(isCorrect);
      setSelectedNumber(null);
      setFeedback("");
      setShowFeedback(false); // Reset to show next question
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center animate-fadeIn">
      {showFeedback ? (
        // Show only feedback when answer is correct
        <div className="mt-6 text-center text-xl font-semibold text-green-600 animate-bounce">
          {feedback}
        </div>
      ) : (
        // Show question, number grid, and submit button when not showing feedback
        <>
          <div className="text-blue-600 text-xl mb-6 flex items-center">
            <button
              onClick={() => readAloud(question?.question)}
              className="mr-3 text-2xl text-yellow-500 hover:text-yellow-700 transition duration-200"
            >
              🔊
            </button>
            {question?.question}
          </div>

          <NumberGrid
            onSelect={handleNumberSelect}
            selectedNumber={selectedNumber}
            maxNumber={question?.number || 10} // Fallback to 10 if number is undefined
          />

          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white px-8 py-3 rounded-lg hover:bg-green-600 transition duration-200 text-lg font-medium shadow-md hover:shadow-lg mt-4"
          >
            Submit
          </button>

          {feedback && (
            <div className="mt-6 text-center text-xl font-semibold text-green-600 animate-bounce">
              {feedback}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default NumberSelectionComponent;
