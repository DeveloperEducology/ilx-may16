import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MathInputComponent from "../pages/MathInputComponent";

function BlankQuestionComponent() {
  const { classId } = useParams();

  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState(["", "", ""]);
  const [feedback, setFeedback] = useState("");
  const [isReading, setIsReading] = useState(false);
  const subjectId = "A.1"; // Default to A.1 if subjectId is not provided

  // Expanded sample questions for different skills
  const sampleQuestions = [
    {
      id: "A.1", // Class VI - Whole numbers
      question: "Count forward by twos from 36.",
      expectedAnswers: [38, 40, 42],
      images: [],
    },
    {
      id: "A.1", // Class VI - Multiplication
      question:
        "Fill in the missing numbers in the sequence: 5, 10, __, 20, __.",
      expectedAnswers: [15, 25],
      images: [],
    },
    {
      id: "A.1", // Class VI - Division
      question: "Divide 20 by 5 to get the next three numbers: 4, __, __, __.",
      expectedAnswers: [8, 12, 16],
      images: [],
    },
    {
      id: "A.1", // Class V - Fractions
      question: "Add 1/4 and 1/2 to get the next two steps: 3/4, __, __.",
      expectedAnswers: [1, 1.25], // Using decimal form for simplicity
      images: [],
    },
    {
      id: "A.1", // Class VII - Proportions
      question:
        "Solve the proportion 2/3 = x/9 for the next values: 6, __, __.",
      expectedAnswers: [12, 18],
      images: [],
    },
  ];

  // Set a random question on component mount (page refresh)
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * sampleQuestions.length);
    setCurrentQuestionIndex(randomIndex);
  }, []); // Empty dependency array ensures this runs only on mount

  const currentQuestion = sampleQuestions[currentQuestionIndex] || {
    question: "No question available",
    expectedAnswers: [],
    images: [],
  };

  // Reset answers when question changes
  useEffect(() => {
    setAnswers(Array(currentQuestion.expectedAnswers.length).fill(""));
    setFeedback("");
  }, [currentQuestionIndex]);

  // Read aloud function using Web Speech API
  const readAloud = (text) => {
    if ("speechSynthesis" in window && !isReading) {
      setIsReading(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsReading(false);
      window.speechSynthesis.speak(utterance);
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
      const num = parseFloat(ans); // Using parseFloat to handle decimals
      return isNaN(num) ? null : num; // Handle invalid inputs
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
      // Move to next question after a short delay
      setTimeout(() => {
        if (currentQuestionIndex < sampleQuestions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
          setFeedback("Congratulations! You've completed all questions!");
        }
      }, 1500); // 1.5 second delay before moving to next question
    } else {
      setFeedback(
        `Wrong! The correct sequence is ${currentQuestion.expectedAnswers.join(
          ", "
        )}. Your answers were ${userAnswers.join(", ")}.`
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

          <div className="flex items-center space-x-2 mb-8 text-lg">
            <span>
              {currentQuestion.question.startsWith("Count") ? "36," : ""}
            </span>
            {answers.map((answer, index) => (
              <input
                key={index}
                type="number"
                value={answer}
                onChange={(e) => handleInputChange(index, e.target.value)}
                className="w-16 p-2 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={index === 0 ? " " : ""}
              />
            ))}
          </div>
          <div className="flex items-center space-x-2 mb-8 text-lg">
            {/* <span>{question?.question.includes("−√") ? "−√60" : ""}</span> */}
            {/* <MathInputComponent
              onChange={(value) => handleInputChange(0, value)}
            /> */}
          </div>
          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white px-8 py-3 rounded-lg hover:bg-green-600 transition duration-200 text-lg font-medium shadow-md hover:shadow-lg"
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

export default BlankQuestionComponent;
