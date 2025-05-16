import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NumberGrid from "./NumberGrid"; // Import the NumberGrid component

function NumberSelectionComponent() {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [isReading, setIsReading] = useState(false);
  const subjectId = "A.1"; // Default to A.1 if subjectId is not provided

  // Sample questions array
  const questions = [
    {
      id: "Q1",
      type: "selection",
      question: "Select the number that is 1 more than 55.",
      correctAnswer: 56,
    },
    {
      id: "Q2",
      type: "selection",
      question: "Select the number that is 1 less than 45.",
      correctAnswer: 44,
    },
    {
      id: "Q3",
      type: "selection",
      question: "Select the number that is 2 more than 78.",
      correctAnswer: 80,
    },
  ];

  // Set a random question on component mount (page refresh)
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * questions.length);
    setCurrentQuestionIndex(randomIndex);
    setSelectedNumber(null); // Reset selected number on new question
    setFeedback(""); // Reset feedback on new question
  }, []); // Empty dependency array ensures this runs only on mount

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(
    Math.floor(Math.random() * questions.length)
  );
  const currentQuestion = questions[currentQuestionIndex];

  // Read aloud function using Web Speech API
  const readAloud = (text) => {
    if ("speechSynthesis" in window && !isReading) {
      setIsReading(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsReading(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleNumberSelect = (number) => {
    setSelectedNumber(number);
    setFeedback(""); // Clear feedback when a new number is selected
  };

  const handleSubmit = () => {
    if (selectedNumber === null) {
      setFeedback("Please select a number!");
      return;
    }

    if (selectedNumber === currentQuestion.correctAnswer) {
      setFeedback("Correct! Great job!");
      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
          const randomIndex = Math.floor(Math.random() * questions.length);
          setCurrentQuestionIndex(randomIndex); // Loop back with a random question
        }
        setSelectedNumber(null); // Reset selected number for new question
        setFeedback(""); // Reset feedback for new question
      }, 1500); // 1.5 second delay before moving to next question
    } else {
      setFeedback(
        `Wrong! The correct answer is ${currentQuestion.correctAnswer}.`
      );
    }
  };

  return (
    <div className="bg-gradient-to-b from-teal-100 to-yellow-50 min-h-screen p-6">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b-2 border-gray-300 pb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {classId === "UKG" ? "Upper Kindergarten" : `Class ${classId}`} >{" "}
            {subjectId} Practice
          </h2>
          <button className="text-blue-600 hover:text-blue-800 font-semibold text-lg underline decoration-dashed hover:decoration-solid transition duration-200">
            Share skill
          </button>
        </div>

        <div className="flex flex-col items-center animate-fadeIn">
          <div className="text-blue-600 text-xl mb-6 flex items-center">
            <button
              onClick={() => readAloud(currentQuestion.question)}
              className="mr-3 text-2xl text-yellow-500 hover:text-yellow-700 transition duration-200"
            >
              🔊
            </button>
            {currentQuestion.question}
          </div>

          <NumberGrid
            onSelect={handleNumberSelect}
            selectedNumber={selectedNumber}
          />

          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white px-8 py-3 rounded-lg hover:bg-green-600 transition duration-200 text-lg font-medium shadow-md hover:shadow-lg mt-4"
          >
            Submit
          </button>

          {feedback && (
            <div className="mt-6 text-center text-xl font-semibold text-green-600 animate-bounce">
              {feedback}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NumberSelectionComponent;
