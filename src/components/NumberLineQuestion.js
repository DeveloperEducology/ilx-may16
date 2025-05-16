import React, { useEffect, useRef, useState } from "react";

const NumberLineQuestion = ({ questions, onFinish }) => {
  const canvasRef = useRef(null);
  const [inputValues, setInputValues] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  const drawNumberLine = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    ctx.strokeStyle = "#888";
    ctx.lineWidth = 2;

    // Left arrow
    ctx.beginPath();
    ctx.moveTo(14, height / 2 - 6);
    ctx.lineTo(2, height / 2);
    ctx.lineTo(14, height / 2 + 6);
    ctx.stroke();

    // Middle line
    ctx.beginPath();
    ctx.moveTo(2, height / 2);
    ctx.lineTo(width - 2, height / 2);
    ctx.stroke();

    // Right arrow
    ctx.beginPath();
    ctx.moveTo(width - 14, height / 2 - 6);
    ctx.lineTo(width - 2, height / 2);
    ctx.lineTo(width - 14, height / 2 + 6);
    ctx.stroke();

    // Ticks
    for (let i = 0; i < currentQuestion.numbers.length; i++) {
      const x =
        (width / currentQuestion.numbers.length) * i +
        width / (2 * currentQuestion.numbers.length);
      ctx.beginPath();
      ctx.moveTo(x, height / 2 - 8);
      ctx.lineTo(x, height / 2 + 8);
      ctx.stroke();
    }
  };

  useEffect(() => {
    drawNumberLine();

    const newInputValues = currentQuestion.numbers
      .filter((n) => n === null)
      .map(() => "");

    setInputValues(newInputValues);
    setFeedback("");
    setIsSubmitted(false);
    setIsAnswerCorrect(false);
  }, [currentQuestionIndex]);

  const handleInputChange = (index, value) => {
    const newValues = [...inputValues];
    newValues[index] = value;
    setInputValues(newValues);
    setFeedback("");
    setIsSubmitted(false);
    setIsAnswerCorrect(false);
  };

  const handleSubmit = () => {
    if (inputValues.some((v) => v === "")) {
      setFeedback("Please fill in all missing numbers.");
      return;
    }

    const userAnswers = inputValues.map((v) => parseInt(v, 10));
    const correctAnswers = currentQuestion.correctAnswer;

    const allCorrect =
      userAnswers.length === correctAnswers.length &&
      userAnswers.every((val, index) => val === correctAnswers[index]);

    if (allCorrect) {
      setFeedback("Correct!");
      setIsAnswerCorrect(true);
    } else {
      setFeedback(
        `Incorrect. The correct answers are ${correctAnswers.join(" and ")}.`
      );
      setIsAnswerCorrect(false);
    }

    setIsSubmitted(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      if (onFinish) onFinish();
    }
  };

  let nullInputCounter = 0;

  return (
    <div className="bg-white p-4 md:p-8 rounded-lg shadow-lg w-full max-w-lg mx-auto">
      <h2 className="text-lg font-semibold mb-4 text-left">
        {currentQuestion.text}
      </h2>
      <div className="relative w-full">
        <canvas
          ref={canvasRef}
          width={500}
          height={40}
          className="w-full h-auto"
        />
        <div className="absolute top-[22px] left-0 w-full flex justify-between px-[1%]">
          {currentQuestion.numbers.map((number, index) => {
            if (number === null) {
              const inputIndex = nullInputCounter++;
              return (
                <div key={index} className="text-center w-[12.5%]">
                  <input
                    type="number"
                    value={inputValues[inputIndex] || ""}
                    onChange={(e) =>
                      handleInputChange(inputIndex, e.target.value)
                    }
                    className="w-full max-w-[50px] h-6 text-sm text-center border border-gray-400 rounded"
                    placeholder="?"
                    disabled={isSubmitted}
                  />
                </div>
              );
            } else {
              return (
                <div key={index} className="text-center w-[12.5%]">
                  <span className="text-sm">{number}</span>
                </div>
              );
            }
          })}
        </div>
      </div>

      {feedback && (
        <p
          className={`text-sm mt-4 ${
            isAnswerCorrect ? "text-green-600" : "text-red-600"
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
          disabled={!isSubmitted || !isAnswerCorrect}
        >
          {currentQuestionIndex < questions.length - 1 ? "Next" : "Finish"}
        </button>
      </div>
    </div>
  );
};

export default NumberLineQuestion;
