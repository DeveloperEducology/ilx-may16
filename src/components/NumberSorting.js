import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Added for animations
import { useSound } from "use-sound"; // Added for sound effects
import correct from "../assets/sounds/correct.mp3"; // Add sound assets
import incorrect from "../assets/sounds/incorrect.mp3";

const questions = [
  {
    id: 1,
    type: "words",
    instruction: "Arrange these words to form a correct sentence.",
    items: ["there", "three", "are", "cats"],
    correctOrder: ["there", "are", "three", "cats"],
    hint: "The sentence should describe a quantity of cats.",
  },
  {
    id: 2,
    type: "numbers",
    instruction: "Sort these numbers from largest to smallest.",
    items: [51, 58, 56, 60],
    correctOrder: [60, 58, 56, 51],
    hint: "Compare the numerical values carefully.",
  },
  {
    id: 3,
    type: "numbers",
    instruction: "Arrange these numbers in ascending order.",
    items: [23, 12, 34],
    correctOrder: [12, 23, 34],
    hint: "Start with the smallest number.",
  },
  {
    id: 4,
    type: "numbers",
    instruction: "Order these numbers from highest to lowest.",
    items: [105, 99, 110],
    correctOrder: [110, 105, 99],
    hint: "Start with the largest number.",
  },
  {
    id: 5,
    type: "numbers",
    instruction: "Sort these numbers in increasing order.",
    items: [7, 3, 10],
    correctOrder: [3, 7, 10],
    hint: "Arrange from smallest to largest.",
  },
  {
    id: 6,
    type: "words",
    instruction: "Arrange these words to form a correct sentence.",
    items: ["dog", "the", "runs", "fast"],
    correctOrder: ["the", "dog", "runs", "fast"],
    hint: "The sentence describes an action of a dog."
  },
  {
    id: 7,
    type: "numbers",
    instruction: "Sort these numbers from smallest to largest.",
    items: [42, 19, 67, 33],
    correctOrder: [19, 33, 42, 67],
    hint: "Begin with the smallest number and proceed to the largest."
  },
  {
    id: 8,
    type: "words",
    instruction: "Form a correct sentence by arranging these words.",
    items: ["birds", "sing", "the", "morning", "in"],
    correctOrder: ["the", "birds", "sing", "in", "the", "morning"],
    hint: "The sentence describes when birds perform an action."
  },
  {
    id: 9,
    type: "numbers",
    instruction: "Order these numbers from highest to lowest.",
    items: [88, 76, 95, 82],
    correctOrder: [95, 88, 82, 76],
    hint: "Start with the highest number."
  },
  {
    id: 10,
    type: "words",
    instruction: "Arrange these words to make a correct sentence.",
    items: ["we", "park", "to", "go", "the"],
    correctOrder: ["we", "go", "to", "the", "park"],
    hint: "The sentence describes an action involving a destination."
  }
];

const NumberSorting = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentOrder, setCurrentOrder] = useState(questions[0].items);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [showFinalScore, setShowFinalScore] = useState(false);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [playCorrect] = useSound(correct, { volume: 0.5 });
  const [playIncorrect] = useSound(incorrect, { volume: 0.5 });
  const containerRef = useRef(null);
  const dragPreviewRef = useRef(null);

  const currentQuestion = questions[currentQuestionIndex];

  // Initialize current order when question changes
  useEffect(() => {
    setCurrentOrder(questions[currentQuestionIndex].items);
    setFeedback(null);
    setShowHint(false);
  }, [currentQuestionIndex]);

  // Desktop drag handlers
  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("text/plain", index);
    setDraggedIndex(index);
    e.target.style.opacity = "0.3";
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = "1";
    setDraggedIndex(null);
    setHoverIndex(null);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    setHoverIndex(index);
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    const sourceIndex = parseInt(e.dataTransfer.getData("text/plain"));
    if (sourceIndex === targetIndex) return;

    const newOrder = [...currentOrder];
    const [movedItem] = newOrder.splice(sourceIndex, 1);
    newOrder.splice(targetIndex, 0, movedItem);
    setCurrentOrder(newOrder);
    setHoverIndex(null);
  };

  // Mobile touch handlers
  const handleTouchStart = (e, index) => {
    const touch = e.touches[0];
    setDraggedIndex(index);

    const preview = document.createElement("div");
    preview.className =
      "fixed z-50 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg pointer-events-none";
    preview.textContent = currentOrder[index];
    preview.style.left = `${touch.clientX - 40}px`;
    preview.style.top = `${touch.clientY - 30}px`;
    document.body.appendChild(preview);
    dragPreviewRef.current = preview;
  };

  const handleTouchMove = (e) => {
    if (draggedIndex === null) return;
    const touch = e.touches[0];

    if (dragPreviewRef.current) {
      dragPreviewRef.current.style.left = `${touch.clientX - 40}px`;
      dragPreviewRef.current.style.top = `${touch.clientY - 30}px`;
    }

    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    const target = element?.closest(".draggable-item");
    const targetIndex = target ? parseInt(target.dataset.index) : null;
    if (targetIndex !== null && targetIndex !== hoverIndex) {
      setHoverIndex(targetIndex);
    }
  };

  const handleTouchEnd = () => {
    if (
      draggedIndex !== null &&
      hoverIndex !== null &&
      draggedIndex !== hoverIndex
    ) {
      const newOrder = [...currentOrder];
      const [movedItem] = newOrder.splice(draggedIndex, 1);
      newOrder.splice(hoverIndex, 0, movedItem);
      setCurrentOrder(newOrder);
    }

    if (dragPreviewRef.current) {
      document.body.removeChild(dragPreviewRef.current);
      dragPreviewRef.current = null;
    }

    setDraggedIndex(null);
    setHoverIndex(null);
  };

  const handleSubmit = () => {
    const isCorrect =
      JSON.stringify(currentOrder) ===
      JSON.stringify(currentQuestion.correctOrder);
    setFeedback({
      isCorrect,
      message: isCorrect
        ? "✅ Correct! Well done!"
        : "❌ Incorrect. Try again!",
    });

    if (isCorrect) {
      setScore(score + 1);
      playCorrect();
    } else {
      playIncorrect();
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowFinalScore(true);
    }
  };

  const resetGame = () => {
    setCurrentOrder(currentQuestion.items);
    setFeedback(null);
    setShowHint(false);
  };

  const restartGame = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowFinalScore(false);
  };

  const renderItem = (item, index) => {
    const isWord = currentQuestion.type === "words";
    const baseStyles = `draggable-item px-4 py-2 rounded-lg shadow cursor-move select-none
      ${draggedIndex === index ? "opacity-30" : ""}
      ${hoverIndex === index ? "ring-2 ring-yellow-400" : ""}`;

    return (
      <motion.div
        key={index}
        data-index={index}
        draggable
        onDragStart={(e) => handleDragStart(e, index)}
        onDragEnd={handleDragEnd}
        onDragOver={(e) => handleDragOver(e, index)}
        onDragLeave={() => setHoverIndex(null)}
        onDrop={(e) => handleDrop(e, index)}
        onTouchStart={(e) => handleTouchStart(e, index)}
        className={baseStyles}
        style={{
          backgroundColor: isWord ? "#4B5EAA" : "#2D6A4F",
          color: "white",
          minWidth: isWord ? "80px" : "60px",
          textAlign: "center",
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        role="button"
        aria-label={`${isWord ? "Word" : "Number"}: ${item}`}
      >
        {item}
      </motion.div>
    );
  };

  if (showFinalScore) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 max-w-md mx-auto text-center bg-gray-50 rounded-lg"
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Game Completed!
        </h2>
        <p className="text-xl mb-6 text-gray-700">
          Your score: {score} out of {questions.length}
        </p>
        <button
          onClick={restartGame}
          className="bg-blue-600 text-white font-bold px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition-colors"
          aria-label="Restart game"
        >
          Play Again
        </button>
      </motion.div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="p-6 max-w-md mx-auto bg-gray-50 rounded-lg"
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span role="img" aria-label="speaker" className="text-2xl">
            🔊
          </span>
          <h2 className="text-lg font-semibold text-gray-800">
            {currentQuestion.instruction}
          </h2>
        </div>
        <button
          onClick={() => setShowHint(!showHint)}
          className="text-blue-600 hover:text-blue-800 text-sm"
          aria-label={showHint ? "Hide hint" : "Show hint"}
        >
          {showHint ? "Hide Hint" : "Show Hint"}
        </button>
      </div>

      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 text-sm text-gray-600 italic"
          >
            Hint: {currentQuestion.hint}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-2 text-sm text-gray-600">
        Question {currentQuestionIndex + 1} of {questions.length} | Score:{" "}
        {score}
      </div>

      <motion.div layout className="flex flex-wrap justify-center gap-3 mb-6">
        {currentOrder.map(renderItem)}
      </motion.div>

      <div className="flex flex-wrap justify-center gap-3 mb-4">
        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white font-bold px-6 py-2 rounded-lg shadow hover:bg-green-700 transition-colors"
          aria-label="Submit answer"
        >
          Check Answer
        </button>
        {feedback && !feedback.isCorrect && (
          <button
            onClick={resetGame}
            className="bg-blue-600 text-white font-bold px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition-colors"
            aria-label="Try again"
          >
            Try Again
          </button>
        )}
      </div>

      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`mt-4 text-lg font-semibold ${
              feedback.isCorrect ? "text-green-600" : "text-red-600"
            }`}
            role="alert"
          >
            {feedback.message}
            {!feedback.isCorrect && (
              <div className="mt-2 text-sm text-gray-700">
                Correct order: {currentQuestion.correctOrder.join(" → ")}
              </div>
            )}
            {feedback.isCorrect && (
              <button
                onClick={handleNextQuestion}
                className="block mx-auto mt-4 bg-purple-600 text-white font-bold px-6 py-2 rounded-lg shadow hover:bg-purple-700 transition-colors"
                aria-label="Next question"
              >
                {currentQuestionIndex < questions.length - 1
                  ? "Next Question"
                  : "See Results"}
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NumberSorting;
