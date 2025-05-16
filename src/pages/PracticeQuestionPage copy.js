import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import BlankNumberLineComponent from "./BlankNumberLineComponent";
import NumberSelectionComponent from "./NumberSelectionComponent";
import McqComponent from "./McqComponent";
import { sampleQuestions } from "../data/sample";
import IBlank from "./IBlank";

function PracticeQuestionPage() {
  const { classId, subjectId } = useParams();
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [smartScore, setSmartScore] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [skillName, setSkillName] = useState("Loading...");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const fetchQuestions = async () => {
  //     setLoading(true); // start loading
  //     try {
  //       const questionsRes = await axios.get(
  //         `http://localhost:5000/api/questions`
  //       );
  //       if (questionsRes.data.length > 0) {
  //         setQuestions(questionsRes.data);
  //         setError(null);
  //       } else {
  //         setQuestions([]);
  //         setError("No questions available for this lesson.");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //       setError("Failed to load questions. Please try again later.");
  //       setQuestions([]);
  //     } finally {
  //       setLoading(false); // stop loading
  //     }
  //   };

  //   fetchQuestions();
  // }, [subjectId]);

  console.log("questions from api", questions);

  useEffect(() => {
    setQuestions(sampleQuestions.filter((q) => q.id === subjectId));
    const fetchData = async () => {
      try {
        const classRes = await axios.get("http://localhost:5000/api/classes");
        const classDoc = classRes.data.find((c) => c.id === classId);
        const subjectsRes = await axios.get(
          `http://localhost:5000/api/subjects/${classId}`
        );
        const subject = subjectsRes.data.find((s) => s.id === subjectId);
        setSkillName(subject ? subject.name : "Loading...");

        const lessonsRes = await axios.get(
          `http://localhost:5000/api/lessons/${subject._id}`
        );
        const lesson = lessonsRes.data[0];
        const questionsRes = await axios.get(
          `http://localhost:5000/api/questions/${lesson._id}`
        );
        if (questionsRes.data.length > 0) {
          setQuestions(questionsRes.data);
        } else {
          setQuestions(sampleQuestions.filter((q) => q.id === subjectId));
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setQuestions(sampleQuestions.filter((q) => q.id === subjectId));
      }
    };
    fetchData();
  }, [classId, subjectId]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const currentQuestion = questions[currentQuestionIndex] || {
    question: "No question available",
    type: "mcq",
    images: [],
    options: [],
    correctAnswer: "",
  };

  const handleAnswerSubmit = (isCorrect) => {
    setQuestionsAnswered((prev) => prev + 1);
    setSmartScore((prev) =>
      isCorrect ? Math.min(prev + 10, 100) : prev > 0 ? prev - 10 : 0
    );
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        navigate(`/subjects/${classId}`);
      }
    }, 1500);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const renderQuestionComponent = () => {
    switch (currentQuestion.type) {
      case "blank":
        return (
          <BlankNumberLineComponent
            classId={classId}
            subjectId={subjectId}
            question={currentQuestion}
            onSubmit={handleAnswerSubmit}
          />
        );
      case "selection":
        return (
          <NumberSelectionComponent
            classId={classId}
            subjectId={subjectId}
            question={currentQuestion}
            onSubmit={handleAnswerSubmit}
          />
        );
      case "iblank":
        return (
          <IBlank
            classId={classId}
            subjectId={subjectId}
            question={currentQuestion}
            onSubmit={handleAnswerSubmit}
          />
        );
      case "mcq":
      default:
        return (
          <McqComponent
            classId={classId}
            subjectId={subjectId}
            question={currentQuestion}
            onSubmit={handleAnswerSubmit}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-yellow-50 p-4 sm:p-6">
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 max-w-4xl mx-auto transition-transform duration-300 hover:shadow-xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 border-b border-gray-200 pb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 text-center sm:text-left">
            {classId === "UKG" ? "Upper Kindergarten" : `Class ${classId}`} &gt;{" "}
            <span className="text-teal-600">
              {subjectId} {skillName}
            </span>
          </h2>
          <button className="mt-2 sm:mt-0 text-blue-500 hover:text-blue-700 text-sm font-medium underline hover:no-underline transition duration-200">
            Share Skill
          </button>
        </div>

        {/* Main Content */}
        <div className="flex flex-col-reverse sm:flex-row items-start justify-between gap-4 sm:gap-6 sm:items-start">
          {/* Question Area */}
          <div className="w-full sm:w-3/4 flex flex-col items-center animate-fade-in">
            {renderQuestionComponent()}
          </div>

          {/* Sidebar */}
          <div className="w-full sm:w-1/4 bg-gray-50 rounded-lg p-3 flex flex-row sm:flex-col justify-between sm:justify-start items-center sm:items-end gap-3 sm:gap-6 text-gray-700">
            {/* Questions Answered */}
            <div className="text-center sm:text-right">
              <span className="bg-green-100 text-green-600 text-xs font-medium px-2 py-1 rounded-full">
                Questions
              </span>
              <div className="text-lg font-bold mt-1">{questionsAnswered}</div>
            </div>

            {/* Time Elapsed */}
            <div className="text-center sm:text-right">
              <span className="bg-blue-100 text-blue-600 text-xs font-medium px-2 py-1 rounded-full">
                Time
              </span>
              <div className="text-sm font-mono mt-1">
                {formatTime(timeElapsed)}
              </div>
            </div>

            {/* SmartScore */}
            <div className="text-center sm:text-right">
              <span className="bg-orange-100 text-orange-600 text-xs font-medium px-2 py-1 rounded-full">
                SmartScore
              </span>
              <div className="text-lg font-bold mt-1">{smartScore}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PracticeQuestionPage;
