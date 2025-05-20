import React, { useState } from "react";

const questions = [
  {
    instruction: "Put these numbers in order from largest to smallest.",
    numbers: [51, 58, 56, 60],
    correctOrder: [60, 58, 56, 51],
  },
  {
    instruction:
      "Arrange these numbers in ascending order (smallest to largest).",
    numbers: [23, 12, 34],
    correctOrder: [12, 23, 34],
  },
  {
    instruction: "Order these numbers from highest to lowest.",
    numbers: [105, 99, 110],
    correctOrder: [110, 105, 99],
  },
  {
    instruction: "Sort these numbers in increasing order.",
    numbers: [7, 3, 10],
    correctOrder: [3, 7, 10],
  },
];

const NumberSorting = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentOrder, setCurrentOrder] = useState(
    questions[currentQuestionIndex].numbers
  );
  const [draggedNumber, setDraggedNumber] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [showFinalScore, setShowFinalScore] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  const handleDragStart = (e, index) => {
    setDraggedNumber(index);
    e.dataTransfer.setData("text/plain", index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedNumber === null) return;

    const newOrder = [...currentOrder];
    const movedNumber = newOrder[draggedNumber];

    // Remove from original position
    newOrder.splice(draggedNumber, 1);
    // Insert at new position
    newOrder.splice(targetIndex, 0, movedNumber);

    setCurrentOrder(newOrder);
    setDraggedNumber(null);
  };

  const handleSubmit = () => {
    const isCorrect =
      JSON.stringify(currentOrder) ===
      JSON.stringify(currentQuestion.correctOrder);
    setFeedback(isCorrect ? "✅ Correct!" : "❌ Try Again");

    if (isCorrect) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCurrentOrder(questions[currentQuestionIndex + 1].numbers);
      setFeedback(null);
    } else {
      setShowFinalScore(true);
    }
  };

  const resetGame = () => {
    setCurrentOrder(currentQuestion.numbers);
    setFeedback(null);
  };

  const restartGame = () => {
    setCurrentQuestionIndex(0);
    setCurrentOrder(questions[0].numbers);
    setFeedback(null);
    setScore(0);
    setShowFinalScore(false);
  };

  if (showFinalScore) {
    return (
      <div className="p-6 max-w-md mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">Game Completed!</h2>
        <p className="text-xl mb-6">
          Your score: {score} out of {questions.length}
        </p>
        <button
          onClick={restartGame}
          className="bg-blue-500 text-white font-bold px-6 py-2 rounded shadow hover:bg-blue-600"
        >
          Play Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-md mx-auto text-center">
      <div className="flex items-center justify-center mb-4 space-x-2">
        <span role="img" aria-label="speaker" className="text-blue-500 text-xl">
          🔊
        </span>
        <h2 className="text-lg font-bold">{currentQuestion.instruction}</h2>
      </div>

      <div className="mb-2 text-sm text-gray-600">
        Question {currentQuestionIndex + 1} of {questions.length}
      </div>

      <div className="flex justify-center mb-6 space-x-4">
        {currentOrder.map((num, index) => (
          <div
            key={index}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            className={`bg-blue-500 text-white text-lg font-semibold px-4 py-2 rounded shadow cursor-move
              ${draggedNumber === index ? "opacity-50" : ""}`}
          >
            {num}
          </div>
        ))}
      </div>

      <div className="flex justify-center space-x-4 mb-4">
        <button
          onClick={handleSubmit}
          className="bg-green-500 text-white font-bold px-6 py-2 rounded shadow hover:bg-green-600"
        >
          Submit
        </button>
        {feedback && feedback.includes("❌") && (
          <button
            onClick={resetGame}
            className="bg-blue-500 text-white font-bold px-6 py-2 rounded shadow hover:bg-blue-600"
          >
            Try Again
          </button>
        )}
      </div>

      {feedback && (
        <div
          className={`mt-4 mb-6 text-xl font-bold ${
            feedback.includes("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {feedback}
          {feedback.includes("✅") ? (
            <button
              onClick={handleNextQuestion}
              className="block mx-auto mt-4 bg-purple-500 text-white font-bold px-6 py-2 rounded shadow hover:bg-purple-600"
            >
              Next Question
            </button>
          ) : (
            <div className="mt-2 text-sm text-gray-700">
              Correct order: {currentQuestion.correctOrder.join(" > ")}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NumberSorting;
