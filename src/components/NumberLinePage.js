import React from "react";
import NumberLineQuestion from "./NumberLineQuestion";
import { useNavigate } from "react-router-dom";

const questions = [
  {
    text: "Type the missing number.",
    numbers: [92, 93, null, 95, 96, 97, null, 99],
    correctAnswer: [94, 98],
  },
  {
    text: "Type the missing number.",
    numbers: [10, 11, null, 13, 14],
    correctAnswer: [12],
  },
  {
    text: "Type the missing number.",
    numbers: [5, null, 7, 8, 9, null],
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
