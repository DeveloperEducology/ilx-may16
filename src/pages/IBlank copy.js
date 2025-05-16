import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NumberGrid from "./NumberGrid";

function IBlank({ question, onSubmit }) {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState(["", "", ""]);
  const [feedback, setFeedback] = useState("");
  const [isReading, setIsReading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const subjectId = "A.1";

  // Sample questions
  const sampleQuestions = [
    {
      id: "A.1",
      question: "Count forward by twos from 20.",
      range: 30,
      expectedAnswers: [22, 24, 26],
      images: [],
    },
    {
      id: "A.1",
      question: "Count forward by twos from 36.",
      range: 50,
      expectedAnswers: [38, 40, 42],
      images: [],
    },
    // ... other questions
  ];

  const questionsForSubject = sampleQuestions.filter((q) => q.id === subjectId);
  const currentQuestion = questionsForSubject[currentQuestionIndex] || {
    question: "No question available",
    expectedAnswers: [],
    images: [],
  };

  const readAloud = (text) => {
    if ("speechSynthesis" in window && !isReading) {
      setIsReading(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsReading(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleNumberSelect = (number) => {
    const numberStr = number.toString();
    const index = answers.indexOf(numberStr);

    if (index !== -1) {
      const newAnswers = [...answers];
      newAnswers[index] = "";
      setAnswers(newAnswers);
    } else {
      const emptyIndex = answers.findIndex((ans) => ans === "");
      if (emptyIndex !== -1) {
        const newAnswers = [...answers];
        newAnswers[emptyIndex] = numberStr;
        setAnswers(newAnswers);
      }
    }
  };

  const handleInputChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    const allFilled = answers.every((answer) => answer.trim() !== "");
    if (!allFilled) {
      setFeedback("Please fill in all blanks!");
      return;
    }

    const userAnswers = answers.map((ans) => {
      const num = parseInt(ans, 10);
      return isNaN(num) ? null : num;
    });

    if (userAnswers.includes(null)) {
      setFeedback("Please enter valid numbers in all blanks!");
      return;
    }

    const isCorrect = userAnswers.every(
      (answer, index) => answer === currentQuestion.expectedAnswers[index]
    );

    if (isCorrect) {
      setFeedback("Correct! Great job!");
    } else {
      setFeedback(
        `Wrong! The correct sequence is ${currentQuestion.expectedAnswers.join(
          ", "
        )}. Your answers were ${userAnswers.join(", ")}.`
      );
    }

    setTimeout(() => {
      setFeedback("");
      setAnswers(["", "", ""]);
      if (currentQuestionIndex < questionsForSubject.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        navigate(`/subjects/${classId || "default"}`);
      }
    }, 2000);
  };

  return (
    <div className="bg-gradient-to-b from-teal-100 to-yellow-50 min-h-screen p-4 sm:p-6">
      <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 max-w-[90%] mx-auto">
        <div className="flex justify-between items-center mb-4 sm:mb-6 border-b-2 border-gray-300 pb-2 sm:pb-4">
          <h2 className="text-lg sm:text-2xl font-bold text-gray-900">
            {classId === "UKG"
              ? "Upper Kindergarten"
              : `Class ${classId || "N/A"}`}{" "}
            > {subjectId} Practice
          </h2>
          <button className="text-blue-600 hover:text-blue-800 font-semibold text-sm sm:text-lg underline decoration-dashed hover:decoration-solid transition duration-200">
            Share skill
          </button>
        </div>

        <div className="flex flex-col items-center animate-fadeIn">
          <div className="text-blue-600 text-base sm:text-xl mb-4 sm:mb-6 flex items-center">
            <button
              onClick={() => readAloud(currentQuestion.question)}
              className="mr-2 sm:mr-3 text-xl sm:text-2xl text-yellow-500 hover:text-yellow-700 transition duration-200"
            >
              🔊
            </button>
            {currentQuestion.question}
          </div>

          <div className="flex items-center space-x-2 mb-4 sm:mb-6 text-base sm:text-lg">
            {answers.map((answer, index) => (
              <input
                key={index}
                type="number"
                value={answer}
                onChange={(e) => handleInputChange(index, e.target.value)}
                className="w-14 sm:w-16 p-2 sm:p-3 border border-gray-300 rounded-md text-center text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={index === 0 ? " " : ""}
                disabled
              />
            ))}
          </div>

          <NumberGrid
            onSelect={handleNumberSelect}
            selectedNumbers={answers.filter((ans) => ans !== "").map(Number)}
            maxNumber={currentQuestion.range} // Reduced to 50 for mobile screen
          />

          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg hover:bg-green-600 transition duration-200 text-base sm:text-lg font-medium shadow-md hover:shadow-lg mt-4 sm:mt-6 w-full sm:w-auto"
          >
            Submit
          </button>

          {feedback && (
            <div className="mt-4 sm:mt-6 text-center text-base sm:text-xl font-semibold text-green-600 animate-bounce">
              {feedback}
            </div>
          )}
        </div>
      </div>
      {/* <div className="w-full h-16 sm:h-20">Score</div> */}
    </div>
  );
}

export default IBlank;
