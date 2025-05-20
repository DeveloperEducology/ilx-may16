import React, { useState, useRef, useEffect } from "react";








  const questions = [
      {
    instruction: "Sort the words by their vowel sounds.",
    words: ["due", "dump", "cute", "clue", "cube"],
    answers: {
      "Short u": ["dump"],
      "Long u": ["due", "cute", "clue", "cube"],
    },
    feedback: {
      correct:
        "Great job! You correctly sorted the words by their vowel sounds.",
      incorrect:
        "Almost! Remember: 'dump' has a short u sound, while the others have a long u sound.",
    },
  },
  {
    instruction: "Sort these animals by habitat.",
    words: ["dolphin", "bear", "shark", "fox", "whale"],
    answers: {
      Ocean: ["dolphin", "shark", "whale"],
      Land: ["bear", "fox"],
    },
    feedback: {
      correct: "Excellent! You know your animal habitats well!",
      incorrect:
        "Not quite. Dolphins, sharks and whales live in the ocean, while bears and foxes live on land.",
    },
  },
    {
      "instruction": "Sort these words by parts of speech.",
      "words": ["run", "happy", "quickly", "jump", "beautiful"],
      "answers": {
        "Verbs": ["run", "jump"],
        "Adjectives": ["happy", "beautiful"],
        "Adverbs": ["quickly"]
      },
      "feedback": {
        "correct": "Perfect! You've mastered parts of speech!",
        "incorrect": "Review needed: 'run' and 'jump' are verbs, 'happy' and 'beautiful' are adjectives, and 'quickly' is an adverb."
      }
    },
    {
      "instruction": "Sort these animals by habitat.",
      "words": ["dolphin", "bear", "shark", "fox", "whale"],
      "answers": {
        "Ocean": ["dolphin", "shark", "whale"],
        "Land": ["bear", "fox"]
      },
      "feedback": {
        "correct": "Excellent! You know your animal habitats well!",
        "incorrect": "Not quite. Dolphins, sharks and whales live in the ocean, while bears and foxes live on land."
      }
    },
    {
      "instruction": "Sort these words by vowel sounds.",
      "words": ["cat", "cake", "cut", "cot", "cute"],
      "answers": {
        "Short a": ["cat"],
        "Long a": ["cake"],
        "Short u": ["cut"],
        "Short o": ["cot"],
        "Long u": ["cute"]
      },
      "feedback": {
        "correct": "Great job! You've nailed the vowel sounds!",
        "incorrect": "Remember: 'cat' (short a), 'cake' (long a), 'cut' (short u), 'cot' (short o), 'cute' (long u)."
      }
    },
    {
      "instruction": "Sort these words by their endings.",
      "words": ["running", "happiness", "quickly", "jumper", "beautiful"],
      "answers": {
        "-ing": ["running"],
        "-ness": ["happiness"],
        "-ly": ["quickly"],
        "-er": ["jumper"],
        "-ful": ["beautiful"]
      },
      "feedback": {
        "correct": "Awesome! You recognized all the word endings!",
        "incorrect": "Check the endings: 'running' (-ing), 'happiness' (-ness), 'quickly' (-ly), 'jumper' (-er), 'beautiful' (-ful)."
      }
    },
    {
      "instruction": "Sort these words by syllable count.",
      "words": ["cat", "apple", "elephant", "dog", "butterfly"],
      "answers": {
        "1 syllable": ["cat", "dog"],
        "2 syllables": ["apple"],
        "3 syllables": ["elephant"],
        "4 syllables": ["butterfly"]
      },
      "feedback": {
        "correct": "Perfect! You counted the syllables correctly!",
        "incorrect": "Count again: 'cat' (1), 'dog' (1), 'apple' (2), 'elephant' (3), 'butterfly' (4)."
      }
    },
    {
      "instruction": "Sort these words by their prefixes.",
      "words": ["unhappy", "redo", "misunderstand", "preheat", "dislike"],
      "answers": {
        "un-": ["unhappy"],
        "re-": ["redo"],
        "mis-": ["misunderstand"],
        "pre-": ["preheat"],
        "dis-": ["dislike"]
      },
      "feedback": {
        "correct": "Excellent prefix knowledge!",
        "incorrect": "The prefixes are: 'unhappy' (un-), 'redo' (re-), 'misunderstand' (mis-), 'preheat' (pre-), 'dislike' (dis-)."
      }
    },
    {
      "instruction": "Sort these words by their plural forms.",
      "words": ["child", "mouse", "tooth", "goose", "foot"],
      "answers": {
        "-ren": ["child"],
        "-ice": ["mouse"],
        "-eeth": ["tooth"],
        "-eese": ["goose"],
        "-eet": ["foot"]
      },
      "feedback": {
        "correct": "Great job with these irregular plurals!",
        "incorrect": "Irregular plurals: 'child' → 'children', 'mouse' → 'mice', 'tooth' → 'teeth', 'goose' → 'geese', 'foot' → 'feet'."
      }
    },
    {
      "instruction": "Sort these words by their opposites.",
      "words": ["happy", "hot", "light", "young", "fast"],
      "answers": {
        "sad": ["happy"],
        "cold": ["hot"],
        "heavy": ["light"],
        "old": ["young"],
        "slow": ["fast"]
      },
      "feedback": {
        "correct": "Perfect! You know your opposites well!",
        "incorrect": "The opposites are: happy/sad, hot/cold, light/heavy, young/old, fast/slow."
      }
    },
    {
      "instruction": "Sort these words by their compound parts.",
      "words": ["notebook", "sunflower", "toothbrush", "rainbow", "football"],
      "answers": {
        "note + book": ["notebook"],
        "sun + flower": ["sunflower"],
        "tooth + brush": ["toothbrush"],
        "rain + bow": ["rainbow"],
        "foot + ball": ["football"]
      },
      "feedback": {
        "correct": "Excellent compound word analysis!",
        "incorrect": "Compound words break down as: note+book, sun+flower, tooth+brush, rain+bow, foot+ball."
      }
    },
    {
      "instruction": "Sort these words by their stress patterns.",
      "words": ["photograph", "photography", "democrat", "democracy", "record"],
      "answers": {
        "First syllable": ["photograph", "democrat", "record"],
        "Second syllable": ["photography", "democracy"]
      },
      "feedback": {
        "correct": "Perfect! You've got an ear for syllable stress!",
        "incorrect": "Stress patterns: PHOtograph (1st), phoTOGraphy (2nd), DEMocrat (1st), deMOCracy (2nd), REcord (1st)."
      }
    }
  ]


const Sorting2 = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const currentQuestion = questions[currentQuestionIndex];
  const [availableWords, setAvailableWords] = useState([
    ...currentQuestion.words,
  ]);
  const [answers, setAnswers] = useState(() => {
    return Object.fromEntries(
      Object.keys(currentQuestion.answers).map((key) => [key, []])
    );
  });
  const [draggingWord, setDraggingWord] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const dropTargetRef = useRef(null);

  // Reset all states when question changes
  useEffect(() => {
    setAvailableWords([...currentQuestion.words]);
    setAnswers(
      Object.fromEntries(
        Object.keys(currentQuestion.answers).map((key) => [key, []])
      )
    );
    setIsSubmitted(false);
    setIsCorrect(false);
    setShowFeedback(false);
    setDraggingWord(null);
  }, [currentQuestionIndex, currentQuestion]);

  const handleDragStart = (word) => {
    setDraggingWord(word);
  };

  const handleDrop = (target) => {
    if (!draggingWord) return;

    // Remove from previous
    setAvailableWords((prev) => prev.filter((w) => w !== draggingWord));
    setAnswers((prev) => {
      const updated = { ...prev };
      for (let key in updated) {
        updated[key] = updated[key].filter((w) => w !== draggingWord);
      }
      return updated;
    });

    if (target === "available") {
      setAvailableWords((prev) => [...prev, draggingWord]);
    } else {
      setAnswers((prev) => ({
        ...prev,
        [target]: prev[target].includes(draggingWord)
          ? prev[target]
          : [...prev[target], draggingWord],
      }));
    }

    setDraggingWord(null);
  };

  // Touch event handlers
  const handleTouchStart = (word, e) => {
    e.preventDefault();
    setDraggingWord(word);
  };

  const handleTouchMove = (e) => {
    if (!draggingWord) return;

    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    const dropTarget = element?.closest("[data-drop-target]");
    if (dropTarget) {
      dropTargetRef.current = dropTarget.dataset.dropTarget;
    } else {
      dropTargetRef.current = null;
    }
  };

  const handleTouchEnd = () => {
    if (draggingWord && dropTargetRef.current) {
      handleDrop(dropTargetRef.current);
    }
    setDraggingWord(null);
    dropTargetRef.current = null;
  };

  const checkAnswers = () => {
    if (availableWords.length > 0) return; // Prevent submission if not all words are sorted

    setIsSubmitted(true);

    // Check if all answers match
    let correct = true;
    for (const [category, correctWords] of Object.entries(
      currentQuestion.answers
    )) {
      const userWords = answers[category] || [];
      if (
        userWords.length !== correctWords.length ||
        !correctWords.every((word) => userWords.includes(word))
      ) {
        correct = false;
        break;
      }
    }

    setIsCorrect(correct);
    setShowFeedback(true);
  };

  const resetQuestion = () => {
    setAvailableWords([...currentQuestion.words]);
    setAnswers(
      Object.fromEntries(
        Object.keys(currentQuestion.answers).map((key) => [key, []])
      )
    );
    setIsSubmitted(false);
    setShowFeedback(false);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const renderWord = (word) => (
    <div
      key={word}
      draggable
      onDragStart={() => handleDragStart(word)}
      onDragEnd={() => setDraggingWord(null)}
      onTouchStart={(e) => handleTouchStart(word, e)}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`p-2 m-1 rounded shadow cursor-move touch-none ${
        isSubmitted && !currentQuestion.words.includes(word)
          ? isCorrect
            ? "bg-green-200"
            : "bg-red-200"
          : "bg-blue-200"
      }`}
    >
      {word}
    </div>
  );

  return (
    <div
      className="p-4 max-w-3xl mx-auto"
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {showFeedback ? (
        <div className="text-center">
          <h2
            className={`text-xl font-bold mb-4 ${
              isCorrect ? "text-green-600" : "text-red-600"
            }`}
          >
            {isCorrect ? "Correct!" : "Incorrect"}
          </h2>
          <p className="mb-6">
            {currentQuestion.feedback[isCorrect ? "correct" : "incorrect"]}
          </p>

          <div className="flex justify-center gap-4">
            <button
              onClick={resetQuestion}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Try Again
            </button>
            {currentQuestionIndex < questions.length - 1 && (
              <button
                onClick={nextQuestion}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Next Question
              </button>
            )}
          </div>

          {currentQuestionIndex === questions.length - 1 && isCorrect && (
            <div className="mt-6 p-4 bg-yellow-100 rounded">
              <h3 className="font-bold text-lg">Congratulations!</h3>
              <p>You've completed all questions!</p>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-lg font-bold">{currentQuestion.instruction}</h2>
            <div className="text-sm text-gray-600">
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
          </div>

          {/* Available Words (as Drop Zone) */}
          <div
            data-drop-target="available"
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop("available")}
            className="p-4 mb-4 border border-dashed border-gray-400 rounded bg-gray-100 min-h-[60px]"
          >
            <h3 className="font-semibold mb-2">Available Words</h3>
            <div className="flex flex-wrap">
              {availableWords.map(renderWord)}
            </div>
          </div>

          {/* Answer Boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {Object.keys(answers).map((key) => (
              <div
                key={key}
                data-drop-target={key}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(key)}
                className="p-4 border border-dashed border-gray-400 rounded bg-green-50 min-h-[60px]"
              >
                <h3 className="font-semibold">{key}</h3>
                <div className="flex flex-wrap mt-2">
                  {answers[key].map(renderWord)}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={checkAnswers}
            disabled={availableWords.length > 0}
            className={`px-4 py-2 rounded text-white ${
              availableWords.length > 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            Check Answers
          </button>

          {availableWords.length > 0 && (
            <p className="mt-2 text-sm text-red-500">
              Please sort all words before submitting.
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default Sorting2;
