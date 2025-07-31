import React, { useState } from "react";

// --- Question Generator Functions ---
// All functions are refactored to return a question object instead of manipulating the DOM.

const questionsGenerator = {
  "🍭 Skip-Counting Adventure": () => {
    const candies = [
      { emoji: "🍭", name: "lollipops" },
      { emoji: "🍬", name: "candies" },
      { emoji: "🍫", name: "chocolates" },
      { emoji: "🧁", name: "cupcakes" },
      { emoji: "🍩", name: "donuts" },
      { emoji: "🦄", name: "unicorns" },
    ];
    const steps = [2, 3, 5, 10];
    const step = steps[Math.floor(Math.random() * steps.length)];
    const numGroups = Math.floor(Math.random() * 5) + 2; // 2 to 6 groups
    const { emoji, name } = candies[Math.floor(Math.random() * candies.length)];
    const total = step * numGroups;

    // Create visual groups for rendering in React
    const visualGroups = Array.from({ length: numGroups }, () =>
      emoji.repeat(step)
    );

    return {
      type: "input",
      question: `Count by ${step}s: How many ${name} are there in total?`,
      answer: total.toString(),
      visuals: visualGroups,
      options: [],
    };
  },

  "🔢 Skip-Counting Sequence": () => {
    const steps = [2, 3, 4, 5, 10, 25];
    const step = steps[Math.floor(Math.random() * steps.length)];
    const start = Math.floor(Math.random() * 10) * step;

    const sequence = Array.from({ length: 5 }, (_, i) => start + i * step);
    const nextNumber = start + 5 * step;

    return {
      type: "input",
      question: `What's the next number in this sequence?\n${sequence.join(
        ", "
      )}, ___`,
      answer: nextNumber.toString(),
      visuals: [],
      options: [],
    };
  },

  "🤔 Even or Odd": () => {
    const emojis = ["🍎", "🍊", "🍇", "🍓", "🐶", "🐱", "⚽", "🏀", "🚗", "🚀"];
    const count = Math.floor(Math.random() * 10) + 3; // 3 to 12 emojis
    const answer = count % 2 === 0 ? "Even" : "Odd";

    const visualEmojis = Array.from(
      { length: count },
      () => emojis[Math.floor(Math.random())]
    );

    return {
      type: "mcq",
      question: "Is the number of items Even or Odd?",
      answer: answer,
      visuals: visualEmojis,
      options: ["Even", "Odd"],
    };
  },
  "🤔 Identify Number Even or Odd": () => {
    const count = Math.floor(Math.random() * 20) + 2; // Generates a number from 2 to 99
    const answer = count % 2 === 0 ? "Even" : "Odd";

    return {
      type: "mcq",
      // The question now directly asks about the generated number.
      question: `Is the number ${count} Even or Odd?`,
      answer: answer,
      visuals: [], // Visuals are not needed for this question type.
      options: ["Even", "Odd"],
    };
  },

  "🔢 Even Number Hunt": () => {
    // Generate 4 numbers (mix of even and odd)
    const numbers = [];
    const evenNumbers = [];

    // Ensure at least 2 even numbers in options
    while (evenNumbers.length < 2) {
      const num = Math.floor(Math.random() * 20); // 0-19
      if (num % 2 === 0 && !evenNumbers.includes(num)) {
        evenNumbers.push(num);
      }
    }

    // Add 2 odd numbers
    const oddNumbers = [];
    while (oddNumbers.length < 2) {
      const num = Math.floor(Math.random() * 19) + 1; // 1-19
      if (num % 2 !== 0 && !oddNumbers.includes(num)) {
        oddNumbers.push(num);
      }
    }

    // Combine and shuffle
    const allNumbers = [...evenNumbers, ...oddNumbers].sort(
      () => Math.random() - 0.5
    );

    return {
      type: "mcq-multiple",
      question: "Which of the following numbers are even?",
      answer: evenNumbers.map((n) => n.toString()),
      visuals: allNumbers.map((num) => ({
        type: "text",
        content: num.toString(),
      })),
      options: allNumbers.map((n) => n.toString()),
    };
  },

  "📊 Counting Patterns": () => {
    const steps = [
      { step: 2, word: "twos" },
      { step: 5, word: "fives" },
      { step: 10, word: "tens" },
    ];
    const { step, word } = steps[Math.floor(Math.random() * steps.length)];
    const isForward = Math.random() > 0.5;
    const start = Math.floor(Math.random() * 10 + 1) * step; // e.g., 2, 4..20 or 5, 10..50

    const sequence = [start];
    for (let i = 0; i < 4; i++) {
      const lastNum = sequence[sequence.length - 1];
      sequence.push(isForward ? lastNum + step : lastNum - step);
    }
    const nextNumber = isForward ? sequence[4] + step : sequence[4] - step;

    return {
      type: "input",
      question: `Count ${
        isForward ? "forward" : "backward"
      } by ${word}. What comes next?\n${sequence.join(", ")}, ___`,
      answer: nextNumber.toString(),
      visuals: [],
      options: [],
    };
  },
};

// --- Main React Component ---

export default function KidFriendlyPage() {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [selectedAnswers, setSelectedAnswers] = useState([]); // Added for multiple selection

  const topicKeys = Object.keys(questionsGenerator);

  const handleTopicClick = (topic) => {
    setSelectedTopic(topic);
    const question = questionsGenerator[topic]();
    setCurrentQuestion(question);
    setUserAnswer("");
    setSelectedAnswers([]);

    setShowResult(false);
    setFeedback("");
  };

  const generateNewQuestion = () => {
    const question = questionsGenerator[selectedTopic]();
    setCurrentQuestion(question);
    setUserAnswer("");
    setShowResult(false);
    setSelectedAnswers([]);

    setFeedback("");
  };

  const handleSubmit = () => {
    // Don't allow empty submissions
    if (
      (currentQuestion.type === "input" && !userAnswer) ||
      (currentQuestion.type === "mcq" && !userAnswer) ||
      (currentQuestion.type === "mcq-multiple" && selectedAnswers.length === 0)
    ) {
      return;
    }

    let isCorrect = false;

    if (currentQuestion.type === "mcq-multiple") {
      // Handle multiple correct answers
      const correctAnswers = Array.isArray(currentQuestion.answer)
        ? currentQuestion.answer
        : [currentQuestion.answer];

      isCorrect =
        correctAnswers.length === selectedAnswers.length &&
        correctAnswers.every((ans) => selectedAnswers.includes(ans));
    } else {
      // Handle single answer questions (input or mcq)
      isCorrect =
        userAnswer.toString().toLowerCase() ===
        currentQuestion.answer.toString().toLowerCase();
    }

    setFeedback(
      isCorrect
        ? "🎉 Yay! You got it right!"
        : `❌ Not quite! The correct answer was: ${
            Array.isArray(currentQuestion.answer)
              ? currentQuestion.answer.join(", ")
              : currentQuestion.answer
          }`
    );

    if (isCorrect) {
      setScore((prev) => prev + 1);
      
    }
    setTotalQuestions((prev) => prev + 1);
    setShowResult(true);
  };

  const handleMultipleSelect = (option) => {
    setSelectedAnswers((prev) =>
      prev.includes(option)
        ? prev.filter((a) => a !== option)
        : [...prev, option]
    );
  };

  const resetQuiz = () => {
    setSelectedTopic(null);
    setCurrentQuestion(null);
    setScore(0);
    setTotalQuestions(0);
    setShowResult(false);
    setFeedback("");
  };

  const renderQuestionInput = () => {
    if (!currentQuestion) return null;

    switch (currentQuestion.type) {
      case "input":
        return (
          <input
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Type your answer"
            disabled={showResult}
            className="w-full max-w-xs text-center text-xl border-2 border-purple-300 p-3 rounded-xl focus:ring-2 focus:ring-purple-500 transition-all"
            autoComplete="off"
          />
        );
      case "mcq":
        return (
          <div className="grid grid-cols-2 gap-4">
            {currentQuestion.options.map((option) => (
              <button
                key={option}
                onClick={() => setUserAnswer(option)}
                disabled={showResult}
                className={`text-center p-3 rounded-xl cursor-pointer text-lg font-medium border-4 transition-all ${
                  userAnswer === option
                    ? "bg-purple-200 border-purple-400 scale-105"
                    : "bg-white border-gray-300 hover:border-purple-300"
                } ${showResult ? "opacity-60 cursor-not-allowed" : ""}`}
              >
                {option}
              </button>
            ))}
          </div>
        );
      case "mcq-multiple":
        return (
          <div className="grid grid-cols-2 gap-4">
            {currentQuestion.options.map((option) => (
              <button
                key={option}
                onClick={() => handleMultipleSelect(option)}
                disabled={showResult}
                className={`text-center p-3 rounded-xl cursor-pointer text-lg font-medium border-4 transition-all ${
                  selectedAnswers.includes(option)
                    ? "bg-purple-200 border-purple-400 scale-105"
                    : "bg-white border-gray-300 hover:border-purple-300"
                } ${showResult ? "opacity-60 cursor-not-allowed" : ""}`}
              >
                {option}
              </button>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  const renderVisuals = () => {
    if (!currentQuestion?.visuals || currentQuestion.visuals.length === 0) {
      return null;
    }
    if (selectedTopic === "🔢 Even Number Hunt") {
      return (
        <div className="flex flex-wrap justify-center gap-4 p-4 bg-blue-50 rounded-lg">
          {currentQuestion.visuals.map((visual, i) => (
            <div
              key={i}
              className={`text-4xl p-3 rounded-lg ${
                currentQuestion.answer.includes(visual.content) && showResult
                  ? "bg-green-100 border-2 border-green-400"
                  : "bg-white border-2 border-gray-200"
              }`}
            >
              {visual.content}
            </div>
          ))}
        </div>
      );
    }
    // Special styling for Skip-Counting Adventure
    if (selectedTopic === "🍭 Skip-Counting Adventure") {
      return (
        <div className="flex flex-wrap justify-center gap-4 text-3xl p-4 bg-purple-50 rounded-lg">
          {currentQuestion.visuals.map((group, i) => (
            <div
              key={i}
              className="p-2 border-2 border-dashed border-purple-200 rounded-md"
            >
              {group}
            </div>
          ))}
        </div>
      );
    }

    // Default visual styling for others like "Even or Odd"
    return (
      <div className="flex flex-wrap justify-center gap-3 text-4xl p-4 bg-yellow-50 rounded-lg">
        {currentQuestion.visuals.map((emoji, i) => (
          <span key={i}>{emoji}</span>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100 font-sans p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {!selectedTopic ? (
          <>
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 text-purple-700 drop-shadow-md">
              🎓 Math Playground
            </h1>
            <p className="text-center text-lg text-gray-600 mb-8">
              Tap a topic and let’s learn!
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {topicKeys.map((topic) => (
                <button
                  key={topic}
                  onClick={() => handleTopicClick(topic)}
                  className="bg-white/70 backdrop-blur-sm border-4 border-purple-200 rounded-3xl p-6 text-xl text-purple-800 font-semibold shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ease-in-out"
                >
                  {topic}
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={resetQuiz}
                className="text-sm text-purple-600 hover:underline font-semibold"
              >
                ← Back to Topics
              </button>
              <div className="text-base text-gray-700 bg-white/50 px-3 py-1 rounded-full">
                Score:{" "}
                <span className="font-bold text-purple-700">{score}</span> /{" "}
                {totalQuestions}
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-xl space-y-6">
              <h2 className="text-2xl font-bold text-center text-purple-700">
                {selectedTopic}
              </h2>

              <p className="text-xl text-center whitespace-pre-wrap text-gray-800 min-h-[6rem] flex items-center justify-center">
                {currentQuestion?.question}
              </p>

              {renderVisuals()}

              <div className="flex justify-center">{renderQuestionInput()}</div>

              {!showResult ? (
                <div className="text-center pt-4">
                  <button
                    onClick={handleSubmit}
                    disabled={
                      (currentQuestion.type === "input" && !userAnswer) ||
                      (currentQuestion.type === "mcq" && !userAnswer) ||
                      (currentQuestion.type === "mcq-multiple" &&
                        selectedAnswers.length === 0)
                    }
                    className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ✅ Submit Answer
                  </button>
                </div>
              ) : (
                <div className="text-center space-y-4 pt-4">
                  <div
                    className={`p-4 rounded-xl text-xl font-bold ${
                      feedback.includes("Yay")
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {feedback}
                  </div>
                  <button
                    onClick={generateNewQuestion}
                    className="bg-blue-500 text-white px-8 py-3 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                  >
                    👉 Next Question
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
