import React, { useState, useEffect } from "react";
import "./QuizApp.css";

const sampleData = {
  quant: [
    {
      id: 1,
      question:
        "The arithmetic mean of the 3 consecutive integers starting with 's' is 'a'. What is the arithmetic mean of 9 consecutive integers starting with 's'?",
      options: ["5 + 10", "5 + 15", "5 + 20", "5 + 25"],
      correctAnswer: "5 + 15",
    },
    {
      id: 2,
      question: "If x + y = 10 and x - y = 4, what is the value of x?",
      options: ["7", "6", "5", "4"],
      correctAnswer: "7",
    },
    ...Array.from({ length: 18 }, (_, i) => ({
      id: i + 3,
      question: `Sample Quant Question ${i + 3}`,
      options: ["A", "B", "C", "D"],
      correctAnswer: "A",
    })),
  ],
  verbal: [
    {
      id: 1,
      question:
        "Choose the word that best completes the sentence: The speaker's tone was very ____.",
      options: ["Eloquent", "Dramatic", "Verbose", "Subtle"],
      correctAnswer: "Eloquent",
    },
    {
      id: 2,
      question: "What is the synonym of 'Big'?",
      options: ["Small", "Large", "Tiny", "Short"],
      correctAnswer: "Large",
    },
    ...Array.from({ length: 18 }, (_, i) => ({
      id: i + 3,
      question: `Sample Verbal Question ${i + 3}`,
      options: ["A", "B", "C", "D"],
      correctAnswer: "B",
    })),
  ],
};

const QuizAppModal = () => {
  const [currentSection, setCurrentSection] = useState("quant");
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState({ quant: {}, verbal: {} });
  const [markedForReview, setMarkedForReview] = useState({
    quant: [],
    verbal: [],
  });
  const [timeLeft, setTimeLeft] = useState(42 * 60 + 50);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // For mobile sidebar toggle

  const totalQuestions = 20;
  const questions = sampleData[currentSection];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return {
      hours: String(hours).padStart(2, "0"),
      minutes: String(minutes).padStart(2, "0"),
      seconds: String(secs).padStart(2, "0"),
    };
  };

  const handleOptionSelect = (option) => {
    setAnswers({
      ...answers,
      [currentSection]: {
        ...answers[currentSection],
        [currentQuestion]: option,
      },
    });
  };

  const handleMarkForReview = () => {
    setMarkedForReview({
      ...markedForReview,
      [currentSection]: [...markedForReview[currentSection], currentQuestion],
    });
  };

  const handlePrevious = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(currentQuestion - 1);
    } else if (currentSection === "verbal" && currentQuestion === 1) {
      setCurrentSection("quant");
      setCurrentQuestion(totalQuestions);
    }
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (
      currentSection === "quant" &&
      currentQuestion === totalQuestions
    ) {
      setCurrentSection("verbal");
      setCurrentQuestion(1);
    }
  };

  const handleSubmit = () => {
    alert("Test Submitted! Check console for results.");
    console.log("Answers:", answers);
    console.log("Marked for Review:", markedForReview);
  };

  const getQuestionStatus = (qid, section) => {
    if (qid === currentQuestion && section === currentSection) return "current";
    if (markedForReview[section].includes(qid)) return "review";
    if (answers[section][qid]) return "answered";
    if (qid < currentQuestion && !answers[section][qid]) return "not-answered";
    return "";
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const currentQ = questions.find((q) => q.id === currentQuestion);

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h1>Online Test - GMAT Preparation</h1>
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          {isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
        </button>
      </div>
      <div className="quiz-body">
        <div className="quiz-main">
          <div className="question-section">
            <h2>
              {currentSection.charAt(0).toUpperCase() + currentSection.slice(1)}{" "}
              - Question {currentQuestion}
            </h2>
            <p>{currentQ.question}</p>
            <div className="options">
              {currentQ.options.map((option, idx) => (
                <label key={idx}>
                  <input
                    type="radio"
                    name="option"
                    checked={
                      answers[currentSection][currentQuestion] === option
                    }
                    onChange={() => handleOptionSelect(option)}
                  />
                  {String.fromCharCode(65 + idx)}. {option}
                </label>
              ))}
            </div>
          </div>
          <div className="navigation">
            <button className="mark-btn" onClick={handleMarkForReview}>
              Mark for review
            </button>
            <button className="prev-btn" onClick={handlePrevious}>
              Previous
            </button>
            <button className="next-btn" onClick={handleNext}>
              Next
            </button>
            <button className="submit-btn" onClick={handleSubmit}>
              Submit Test
            </button>
          </div>
          <div className="legend">
            <span className="legend-item current">Current</span>
            <span className="legend-item not-attempted">Not Attempted</span>
            <span className="legend-item answered">Answered</span>
            <span className="legend-item not-answered">Not Answered</span>
            <span className="legend-item review">Review</span>
          </div>
        </div>
        <div className={`quiz-sidebar ${isSidebarOpen ? "open" : ""}`}>
          <div className="timer">
            <h3>Time Left</h3>
            <div className="time">
              <span>{formatTime(timeLeft).hours}</span> hours{" "}
              <span>{formatTime(timeLeft).minutes}</span> minutes{" "}
              <span>{formatTime(timeLeft).seconds}</span> seconds
            </div>
          </div>
          <div className="section mobile-section">
            <select
              value={currentSection}
              onChange={(e) => setCurrentSection(e.target.value)}
            >
              <option value="quant">Quant</option>
              <option value="verbal">Verbal</option>
            </select>
            <div className="question-grid">
              {Array.from({ length: totalQuestions }, (_, i) => (
                <button
                  key={i + 1}
                  className={`question-btn ${getQuestionStatus(
                    i + 1,
                    currentSection
                  )}`}
                  onClick={() => {
                    setCurrentQuestion(i + 1);
                    setIsSidebarOpen(false);
                  }}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
          <div className="section desktop-section">
            {["quant", "verbal"].map((section, idx) => (
              <div key={section}>
                <h3>
                  {idx + 1}.{" "}
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </h3>
                <div className="question-grid">
                  {Array.from({ length: totalQuestions }, (_, i) => (
                    <button
                      key={i + 1}
                      className={`question-btn ${getQuestionStatus(
                        i + 1,
                        section
                      )}`}
                      onClick={() => {
                        setCurrentSection(section);
                        setCurrentQuestion(i + 1);
                        setIsSidebarOpen(false);
                      }}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizAppModal;
