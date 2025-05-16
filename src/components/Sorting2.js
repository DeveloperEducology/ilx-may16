import React, { useState, useRef, useEffect } from "react";

const questions = [
  {
    instruction: "Sort the words by their vowel sounds.",
    words: ["due", "dump", "cute", "clue", "cube"],
    answers: {
      "Short u": ["dump"],
      "Long u": ["due", "cute", "clue", "cube"],
    },
  },
  {
    instruction: "Sort the words by their beginning consonant sounds.",
    words: ["cat", "car", "bat", "bar", "cab"],
    answers: {
      "C sound": ["cat", "car", "cab"],
      "B sound": ["bat", "bar"],
    },
  },
];

const WordBox = ({ word, onDragStart, onTouchStart }) => {
  const touchRef = useRef(null);
  const elementRef = useRef(null);

  const handleTouchStart = (e) => {
    e.preventDefault(); // Prevent default scrolling
    touchRef.current = { word, startX: e.touches[0].clientX, startY: e.touches[0].clientY };
    if (onTouchStart) onTouchStart(word);
    elementRef.current.classList.add("opacity-50"); // Visual feedback
  };

  const handleTouchMove = (e) => {
    e.preventDefault(); // Prevent default scrolling
    if (touchRef.current) {
      const touch = e.touches[0];
      const deltaX = touch.clientX - touchRef.current.startX;
      const deltaY = touch.clientY - touchRef.current.startY;
      elementRef.current.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    }
  };

  const handleTouchEnd = (e) => {
    elementRef.current.style.transform = "translate(0, 0)"; // Reset position
    elementRef.current.classList.remove("opacity-50");
    touchRef.current = null;
  };

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Add touch event listeners with passive: false
    element.addEventListener("touchstart", handleTouchStart, { passive: false });
    element.addEventListener("touchmove", handleTouchMove, { passive: false });
    element.addEventListener("touchend", handleTouchEnd, { passive: false });

    // Cleanup event listeners on unmount
    return () => {
      element.removeEventListener("touchstart", handleTouchStart, { passive: false });
      element.removeEventListener("touchmove", handleTouchMove, { passive: false });
      element.removeEventListener("touchend", handleTouchEnd, { passive: false });
    };
  }, [onTouchStart]); // Re-run if onTouchStart changes

  return (
    <div
      ref={elementRef}
      className="bg-blue-500 text-white rounded inline-block px-3 py-1 m-1 cursor-move touch-none select-none"
      draggable
      onDragStart={(e) => onDragStart(e, word)}
    >
      {word}
    </div>
  );
};

const DropZone = ({ title, words, onDrop, onTouchDrop, onTouchStart, currentWord }) => {
  const dropZoneRef = useRef(null);

  const handleTouchMove = (e) => {
    const touch = e.touches[0];
    const dropZone = dropZoneRef.current;
    const rect = dropZone.getBoundingClientRect();
    const isOver =
      touch.clientX >= rect.left &&
      touch.clientX <= rect.right &&
      touch.clientY >= rect.top &&
      touch.clientY <= rect.bottom;

    if (isOver) {
      dropZone.classList.add("bg-gray-100");
    } else {
      dropZone.classList.remove("bg-gray-100");
    }
  };

  const handleTouchEnd = (e) => {
    const touch = e.changedTouches[0];
    const dropZone = dropZoneRef.current;
    const rect = dropZone.getBoundingClientRect();
    const isOver =
      touch.clientX >= rect.left &&
      touch.clientX <= rect.right &&
      touch.clientY >= rect.top &&
      touch.clientY <= rect.bottom;

    dropZone.classList.remove("bg-gray-100");

    if (isOver && currentWord) {
      onTouchDrop(currentWord, title);
    }
  };

  return (
    <div
      ref={dropZoneRef}
      className="min-h-[100px] border-2 border-dashed border-gray-300 p-4 m-2 w-full md:w-1/2"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const word = e.dataTransfer.getData("text");
        onDrop(word, title);
      }}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <h3 className="text-green-700 text-lg font-semibold mb-2">{title}</h3>
      <div className="flex flex-wrap">
        {words.map((word, index) => (
          <WordBox
            key={index}
            word={word}
            onDragStart={(e) => e.dataTransfer.setData("text", word)}
            onTouchStart={onTouchStart}
          />
        ))}
      </div>
    </div>
  );
};

const Sorting2 = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [availableWords, setAvailableWords] = useState(questions[0].words);
  const [zones, setZones] = useState(
    Object.keys(questions[0].answers).reduce((acc, key) => {
      acc[key] = [];
      return acc;
    }, {})
  );
  const [result, setResult] = useState(null);
  const [currentWord, setCurrentWord] = useState(null); // State to track the currently touched word

  const currentQuestion = questions[currentQuestionIndex];

  const handleDragStart = (e, word) => {
    e.dataTransfer.setData("text", word);
  };

  const handleTouchStart = (word) => {
    setCurrentWord(word); // Update the currentWord state when a touch starts
  };

  const handleDrop = (word, zoneTitle) => {
    if (zones[zoneTitle].includes(word)) return;

    if (availableWords.includes(word)) {
      setAvailableWords((prev) => prev.filter((w) => w !== word));
    } else {
      const sourceZone = Object.keys(zones).find((z) => zones[z].includes(word));
      if (sourceZone) {
        setZones((prev) => ({
          ...prev,
          [sourceZone]: prev[sourceZone].filter((w) => w !== word),
        }));
      }
    }

    setZones((prev) => ({
      ...prev,
      [zoneTitle]: [...prev[zoneTitle], word],
    }));

    setResult(null);
    setCurrentWord(null); // Reset currentWord after drop
  };

  const checkAnswers = () => {
    const correct = Object.keys(currentQuestion.answers).every((zone) => {
      const expected = [...currentQuestion.answers[zone]].sort();
      const actual = [...zones[zone]].sort();
      return JSON.stringify(expected) === JSON.stringify(actual);
    });

    setResult(correct ? "✅ Correct!" : "❌ Try again.");
  };

  const goToNextQuestion = () => {
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < questions.length) {
      setCurrentQuestionIndex(nextIndex);
      resetQuestion(nextIndex);
    }
  };

  const goToPreviousQuestion = () => {
    const prevIndex = currentQuestionIndex - 1;
    if (prevIndex >= 0) {
      setCurrentQuestionIndex(prevIndex);
      resetQuestion(prevIndex);
    }
  };

  const resetQuestion = (index) => {
    const question = questions[index];
    setAvailableWords(question.words);
    setZones(
      Object.keys(question.answers).reduce((acc, key) => {
        acc[key] = [];
        return acc;
      }, {})
    );
    setResult(null);
    setCurrentWord(null);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-green-700 text-2xl font-bold mb-4">
        Question {currentQuestionIndex + 1}: {currentQuestion.instruction}
      </h2>

      <div className="flex flex-col md:flex-row">
        {Object.keys(currentQuestion.answers).map((zoneTitle) => (
          <DropZone
            key={zoneTitle}
            title={zoneTitle}
            words={zones[zoneTitle]}
            onDrop={handleDrop}
            onTouchDrop={handleDrop}
            onTouchStart={handleTouchStart}
            currentWord={currentWord}
          />
        ))}
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-medium mb-2">Available Words:</h3>
        <div className="flex flex-wrap">
          {availableWords.map((word, index) => (
            <WordBox
              key={index}
              word={word}
              onDragStart={handleDragStart}
              onTouchStart={handleTouchStart}
            />
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center space-x-4">
        <button
          onClick={goToPreviousQuestion}
          disabled={currentQuestionIndex === 0}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 disabled:opacity-50"
        >
          Previous
        </button>

        <button
          onClick={checkAnswers}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Check Answers
        </button>

        <button
          onClick={goToNextQuestion}
          disabled={currentQuestionIndex === questions.length - 1}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {result && (
        <p className="mt-4 text-xl font-semibold">
          {result}
        </p>
      )}
    </div>
  );
};

export default Sorting2;