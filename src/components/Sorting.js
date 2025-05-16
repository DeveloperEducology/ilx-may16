import React, { useState, useRef } from "react";

const Sorting = () => {
  const initialWords = ["quick", "brown", "fox", "jumps", "over", "lazy", "dog", "the", "the"];
  const correctOrder = ["the", "quick", "brown", "fox", "jumps", "over", "the", "lazy", "dog"];
  
  const [words, setWords] = useState(initialWords);
  const [droppedWords, setDroppedWords] = useState(Array(correctOrder.length).fill(null));
  const [draggingWord, setDraggingWord] = useState(null);

  const dropZonesRef = useRef([]);

  const handleDragStart = (e, word) => {
    e.dataTransfer.setData("text/plain", word);
    setDraggingWord(word);
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    const word = draggingWord || e.dataTransfer.getData("text/plain");
    const newDroppedWords = [...droppedWords];
    newDroppedWords[index] = word;
    setDroppedWords(newDroppedWords);
    setWords(words.filter((w) => w !== word));
    setDraggingWord(null);
  };

  const handleTouchStart = (word) => {
    setDraggingWord(word);
  };

  const handleTouchEnd = (e) => {
    if (!draggingWord) return;
    const touch = e.changedTouches[0];

    dropZonesRef.current.forEach((dropZone, index) => {
      if (!dropZone) return;
      const rect = dropZone.getBoundingClientRect();
      const overDropZone =
        touch.clientX >= rect.left &&
        touch.clientX <= rect.right &&
        touch.clientY >= rect.top &&
        touch.clientY <= rect.bottom;

      if (overDropZone) {
        handleDrop({ preventDefault: () => {}, dataTransfer: { getData: () => draggingWord } }, index);
      }
    });
  };

  const checkAnswer = () => {
    if (JSON.stringify(droppedWords) === JSON.stringify(correctOrder)) {
      alert("Correct!");
    } else {
      alert("Try again!");
    }
  };

  const resetQuiz = () => {
    setWords(initialWords);
    setDroppedWords(Array(correctOrder.length).fill(null));
    setDraggingWord(null);
  };

  return (
    <div className="p-6 space-y-6" onTouchEnd={handleTouchEnd}>
      <h1 className="text-2xl font-bold mb-4">Arrange the words correctly:</h1>

      <div className="flex flex-wrap gap-4">
        {words.map((word, index) => (
          <div
            key={index}
            draggable
            onDragStart={(e) => handleDragStart(e, word)}
            onTouchStart={() => handleTouchStart(word)}
            className="bg-blue-500 text-white px-4 py-2 rounded touch-none"
          >
            {word}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6">
        {droppedWords.map((word, index) => (
          <div
            key={index}
            ref={(el) => (dropZonesRef.current[index] = el)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, index)}
            className="h-16 flex items-center justify-center border-2 border-dashed border-gray-400 rounded"
          >
            {word || "Drop here"}
          </div>
        ))}
      </div>

      <div className="flex space-x-4 mt-6">
        <button
          onClick={checkAnswer}
          className="bg-green-500 text-white px-6 py-2 rounded"
        >
          Check Answer
        </button>
        <button
          onClick={resetQuiz}
          className="bg-red-500 text-white px-6 py-2 rounded"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default Sorting;
