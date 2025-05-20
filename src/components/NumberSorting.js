import React, { useState, useRef } from "react";

const questions = [
  {
    instruction: "Put these numbers in order from largest to smallest.",
    numbers: [51, 58, 56, 60],
    correctOrder: [60, 58, 56, 51],
  },
  {
    instruction: "Arrange these numbers in ascending order (smallest to largest).",
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
  const [touchPosition, setTouchPosition] = useState({ x: 0, y: 0 });
  const dropTargetRef = useRef(null);
  const dragPreviewRef = useRef(null);

  const currentQuestion = questions[currentQuestionIndex];

  // Handle touch events for mobile
  const handleTouchStart = (e, index) => {
    e.preventDefault();
    setDraggedNumber(index);
    const touch = e.touches[0];
    setTouchPosition({ x: touch.clientX, y: touch.clientY });
    
    // Create a drag preview
    if (!dragPreviewRef.current) {
      const preview = document.createElement('div');
      preview.className = 'fixed z-50 bg-blue-500 text-white text-lg font-semibold px-4 py-2 rounded shadow-lg pointer-events-none';
      preview.textContent = currentOrder[index];
      preview.style.left = `${touch.clientX - 30}px`;
      preview.style.top = `${touch.clientY - 30}px`;
      document.body.appendChild(preview);
      dragPreviewRef.current = preview;
    }
  };

  const handleTouchMove = (e) => {
    if (draggedNumber === null) return;
    const touch = e.touches[0];
    setTouchPosition({ x: touch.clientX, y: touch.clientY });
    
    // Update drag preview position
    if (dragPreviewRef.current) {
      dragPreviewRef.current.style.left = `${touch.clientX - 30}px`;
      dragPreviewRef.current.style.top = `${touch.clientY - 30}px`;
    }

    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    dropTargetRef.current = element?.closest(".draggable-item");
  };

  const handleTouchEnd = () => {
    if (draggedNumber !== null && dropTargetRef.current) {
      const targetIndex = parseInt(dropTargetRef.current.dataset.index);
      handleDropLogic(draggedNumber, targetIndex);
    }
    
    // Remove drag preview
    if (dragPreviewRef.current) {
      document.body.removeChild(dragPreviewRef.current);
      dragPreviewRef.current = null;
    }
    
    setDraggedNumber(null);
    dropTargetRef.current = null;
  };

  // Common drop logic for both mouse and touch
  const handleDropLogic = (draggedIndex, targetIndex) => {
    if (draggedIndex === targetIndex) return;

    const newOrder = [...currentOrder];
    const movedNumber = newOrder[draggedIndex];
    
    newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, movedNumber);

    setCurrentOrder(newOrder);
  };

  // Mouse drag events
  const handleDragStart = (e, index) => {
    setDraggedNumber(index);
    e.dataTransfer.setData("text/plain", index);
    e.dataTransfer.effectAllowed = "move";
    
    // Create a drag image for desktop
    const dragImage = e.target.cloneNode(true);
    dragImage.style.position = 'fixed';
    dragImage.style.opacity = '0.8';
    dragImage.style.zIndex = '1000';
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 0, 0);
    setTimeout(() => document.body.removeChild(dragImage), 0);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedNumber === null) return;
    handleDropLogic(draggedNumber, targetIndex);
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
    <div 
      className="p-6 max-w-md mx-auto text-center"
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="flex items-center justify-center mb-4 space-x-2">
        <span role="img" aria-label="speaker" className="text-blue-500 text-xl">
          🔊
        </span>
        <h2 className="text-lg font-bold">{currentQuestion.instruction}</h2>
      </div>

      <div className="mb-2 text-sm text-gray-600">
        Question {currentQuestionIndex + 1} of {questions.length}
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {currentOrder.map((num, index) => (
          <div
            key={index}
            data-index={index}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            onTouchStart={(e) => handleTouchStart(e, index)}
            className={`draggable-item bg-blue-500 text-white text-lg font-semibold px-4 py-2 rounded shadow cursor-move touch-none
              ${draggedNumber === index ? "invisible" : ""}`}
          >
            {num}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-4">
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
