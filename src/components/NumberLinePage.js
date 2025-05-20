import React from "react";
import NumberLineQuestion from "./NumberLineQuestion";
import { useNavigate } from "react-router-dom";

const questions = [
  {
    type: "number-line",
    lessonId: "6811143da6aafb33e7aed3a0",
    prompt: "Type the missing number.",
    sequence: [92, 93, null, 95, 96, 97, null, 99],
    correctAnswer: [94, 98],
  },
  {
    lessonId: "6811143da6aafb33e7aed3a0",
    type: "number-line",
    prompt: "Type the missing number.",
    sequence: [10, 11, null, 13, 14],
    correctAnswer: [12],
  },
  {
    type: "number-line",
    lessonId: "6811143da6aafb33e7aed3a0",
    prompt: "Type the missing number.",
    sequence: [5, null, 7, 8, 9, null],
    correctAnswer: [6, 10],
  },
];

const NumberLinePage = () => {
  const navigate = useNavigate();

  const handleFinish = () => {
    // navigate("/quiz-complete"); // or set a `quizCompleted` flag
  };

  return <NumberLineQuestion questions={questions} onFinish={handleFinish} />;
};

export default NumberLinePage;
