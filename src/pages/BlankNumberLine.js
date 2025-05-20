import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function BlankNumberLine() {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isReading, setIsReading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const subjectId = "A.1"; // Default to A.1 if subjectId is not provided

  // Sample questions with number lines
  const sampleQuestions = [
    {
      id: "A.1",
      type: "blank",
      question: "Type the missing number.",
      numberLine: [37, null, 39, 40, 41, 42], // null represents the missing number
      expectedAnswer: 38,
      images: [],
    },
    {
      id: "A.1",
      type: "blank",
      question: "Type the missing number.",
      numberLine: [5, 10, 15, 20, null],
      expectedAnswer: 25,
      images: [],
    },
    {
      id: "A.1",
      type: "blank",
      question: "Type the missing number.",
      numberLine: [2, 4, 6, null],
      expectedAnswer: 8,
      images: [],
    },
    {
      id: "A.1",
      type: "blank",
      question: "Type the missing number.",
      numberLine: [1, 3, 5, null, 9],
      expectedAnswer: 7,
      images: [],
    },
  ];

  // Set a random question on component mount (page refresh)
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * sampleQuestions.length);
    setCurrentQuestionIndex(randomIndex);
    setAnswer(""); // Reset answer on new question
    setFeedback(""); // Reset feedback on new question
  }, []); // Empty dependency array ensures this runs only on mount

  const currentQuestion = sampleQuestions[currentQuestionIndex] || {
    question: "No question available",
    numberLine: [],
    expectedAnswer: null,
    images: [],
  };

  // Read aloud function using Web Speech API
  const readAloud = (text) => {
    if ("speechSynthesis" in window && !isReading) {
      setIsReading(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsReading(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleInputChange = (value) => {
    setAnswer(value);
  };

  const handleSubmit = () => {
    const userAnswer = parseInt(answer, 10);
    if (isNaN(userAnswer)) {
      setFeedback("Please enter a valid number!");
      return;
    }
    console.log("answeredQuestions", answeredQuestions);
    if (userAnswer === currentQuestion.expectedAnswer) {
      setFeedback("Correct! Great job!");
      const newAnsweredQuestions = new Set(answeredQuestions);
      newAnsweredQuestions.add(currentQuestionIndex);
      setAnsweredQuestions(newAnsweredQuestions);

      // Check if all questions are answered
      if (newAnsweredQuestions.size === sampleQuestions.length) {
        setTimeout(() => {
          navigate(`/`); // Navigate back to class page
        }, 1500); // 1.5 second delay before navigating
      } else {
        setTimeout(() => {
          if (currentQuestionIndex < sampleQuestions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
          } else {
            const randomIndex = Math.floor(
              Math.random() * sampleQuestions.length
            );
            setCurrentQuestionIndex(randomIndex); // Loop back with a random question
          }
          setAnswer(""); // Reset answer for new question
          setFeedback(""); // Reset feedback for new question
        }, 1500); // 1.5 second delay before moving to next question
      }
    } else {
      setFeedback(
        `Wrong! The correct answer is ${currentQuestion.expectedAnswer}.`
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

          <div className="flex items-center space-x-4 mb-8 text-lg">
            <div className="flex items-center space-x-2">
              {currentQuestion.numberLine.map((num, index) => (
                <div key={index} className="flex items-center">
                  {num === null ? (
                    <input
                      type="number"
                      value={answer}
                      onChange={(e) => handleInputChange(e.target.value)}
                      className="w-16 p-2 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder=" "
                    />
                  ) : (
                    <span className="w-16 text-center">{num}</span>
                  )}
                  {index < currentQuestion.numberLine.length - 1 && (
                    <div className="w-16 border-t border-gray-400"></div>
                  )}
                </div>
              ))}
            </div>
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

export default BlankNumberLine;
