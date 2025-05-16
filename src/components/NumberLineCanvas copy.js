import React, { useEffect, useRef, useState } from "react";

const NumberLineQuestion = () => {
  const canvasRef = useRef(null);
  const [inputValue, setInputValue] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const questions = [
    {
      numbers: [92, 93, null, 95, 96],
      correctAnswer: 94,
    },
    {
      numbers: [10, 11, null, 13, 14],
      correctAnswer: 12,
    },
    {
      numbers: [5, null, 7, 8, 9],
      correctAnswer: 6,
    },
  ];

  const currentQuestion = questions[currentQuestionIndex];

  const drawNumberLine = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    ctx.strokeStyle = "#888";
    ctx.lineWidth = 2;

    // Draw left arrow
    ctx.beginPath();
    ctx.moveTo(14, height / 2 - 6);
    ctx.lineTo(2, height / 2);
    ctx.lineTo(14, height / 2 + 6);
    ctx.stroke();

    // Draw line
    ctx.beginPath();
    ctx.moveTo(2, height / 2);
    ctx.lineTo(width - 2, height / 2);
    ctx.stroke();

    // Draw right arrow
    ctx.beginPath();
    ctx.moveTo(width - 14, height / 2 - 6);
    ctx.lineTo(width - 2, height / 2);
    ctx.lineTo(width - 14, height / 2 + 6);
    ctx.stroke();

    // Draw ticks
    for (let i = 0; i < 5; i++) {
      const x = (width / 5) * i + width / 10;
      ctx.beginPath();
      ctx.moveTo(x, height / 2 - 8);
      ctx.lineTo(x, height / 2 + 8);
      ctx.stroke();
    }
  };

  useEffect(() => {
    drawNumberLine();
  }, [currentQuestionIndex]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setFeedback("");
    setIsSubmitted(false);
  };

  const handleSubmit = () => {
    if (!inputValue) {
      setFeedback("Please enter a number.");
      return;
    }
    const userAnswer = parseInt(inputValue, 10);
    if (userAnswer === currentQuestion.correctAnswer) {
      setFeedback("Correct!");
    } else {
      setFeedback(
        `Incorrect. The correct answer is ${currentQuestion.correctAnswer}.`
      );
    }
    setIsSubmitted(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setInputValue("");
      setFeedback("");
      setIsSubmitted(false);
    }
  };

  return (
    <div className="bg-white p-4 md:p-8 rounded-lg shadow-lg w-full max-w-lg mx-auto">
      <h2 className="text-lg font-semibold mb-4 text-center">
        Type the missing number
      </h2>
      <div className="relative w-full">
        <canvas
          ref={canvasRef}
          width={500}
          height={40}
          className="w-full h-auto"
        />
        <div className="absolute top-[22px] left-0 w-full flex justify-between px-[5%]">
          {currentQuestion.numbers.map((number, index) => (
            <div key={index} className="text-center w-[20%]">
              {number === null ? (
                <input
                  type="number"
                  value={inputValue}
                  onChange={handleInputChange}
                  className="w-full max-w-[50px] h-6 text-sm text-center border border-gray-400 rounded"
                  placeholder="?"
                  disabled={isSubmitted}
                />
              ) : (
                <span className="text-sm">{number}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {feedback && (
        <p
          className={`text-sm mt-4 ${
            feedback.includes("Correct") ? "text-green-600" : "text-red-600"
          }`}
        >
          {feedback}
        </p>
      )}

      <div className="flex justify-between mt-6">
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          disabled={isSubmitted}
        >
          Submit
        </button>
        <button
          onClick={handleNext}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
          disabled={
            currentQuestionIndex >= questions.length - 1 || !isSubmitted
          }
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default NumberLineQuestion;
