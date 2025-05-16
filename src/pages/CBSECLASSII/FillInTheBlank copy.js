import React, { useState } from "react";

const FillInTheBlank = () => {
  const Data = [
    {
      type: "blank",
      text: "Add",
      question: ["2 +", null, " = 4"],
      expectedAnswers: ["2"],
    },
    {
      type: "blank",
      text: "Add",
      question: ["2 + 2 = ", null],
      expectedAnswers: ["4"],
    },

    {
      type: "blank",
      text: "Look at the picture and fill in the blanks.",
      question: [
        null,
        "block sticks and",
        null,
        "blocks",
        null,
        "total blocks.",
      ],
      imageUrl:
        "https://cakeimages.s3.ap-northeast-2.amazonaws.com/1745124130807",
      expectedAnswers: ["3", "4", "34"],
    },
    {
      type: "blank",
      text: "Look at the picture and fill in the blanks.",
      question: [
        null,
        "block sticks and",
        null,
        "blocks",
        null,
        "total blocks.",
      ],
      imageUrl:
        "https://cakeimages.s3.ap-northeast-2.amazonaws.com/1745124423358",
      expectedAnswers: ["5", "3", "53"],
    },
    {
      type: "blank",
      text: "Look at the shops shown in the picture and fill in the blanks.",
      question: [
        "There are ",
        null,
        " necklaces of shells with 10 shells in each necklace.",
      ],
      imageUrl:
        "https://cakeimages.s3.ap-northeast-2.amazonaws.com/1744950831009",
      expectedAnswers: ["10"],
    },
    {
      type: "blank",
      text: "Look at the shops shown in the picture and fill in the blanks.",
      question: [
        "There are ",
        null,
        " groups of balloons with ",
        null,
        " balloons in each group and ",
        null,
        " loose balloons.",
      ],
      imageUrl:
        "https://cakeimages.s3.ap-northeast-2.amazonaws.com/1744950831009",
      expectedAnswers: ["6", "4", "2"],
    },
    {
      type: "blank",
      text: "Look at the shops shown in the picture and fill in the blanks.",
      question: [
        "There are ",
        null,
        " bunches of bananas with ",
        null,
        " bananas in each bunch and ",
        null,
        " loose bananas.",
      ],
      imageUrl:
        "https://cakeimages.s3.ap-northeast-2.amazonaws.com/1744950831009",
      expectedAnswers: ["6", "12", "0"],
    },
    {
      type: "blank",
      text: "Manoj is helping his father in selling chikoos that he has arranged in the trays. ",
      question: ["There are", null, "chikoos in one tray."],
      imageUrl:
        "https://cakeimages.s3.ap-northeast-2.amazonaws.com/1745121590566",
      expectedAnswers: ["10"],
    },
    {
      type: "blank",
      text: "Manoj is helping his father in selling chikoos that he has arranged in the trays. ",
      question: ["How many chikoos are there in total?", null],
      imageUrl:
        "https://cakeimages.s3.ap-northeast-2.amazonaws.com/1745121590566",
      expectedAnswers: ["80"],
    },
    {
      type: "blank",
      text: "Fill the blanks with the correct numbers.",
      question: [2, null, 6, 8, null, 12],
      expectedAnswers: ["4", "10"],
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState(
    Array(Data[currentIndex].expectedAnswers.length).fill("")
  );
  const [results, setResults] = useState(null);

  const handleInputChange = (value, index) => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[index] = value;
    setUserAnswers(updatedAnswers);
  };

  const handleSubmit = () => {
    const result = userAnswers.map(
      (answer, idx) => answer.trim() === Data[currentIndex].expectedAnswers[idx]
    );
    setResults(result);

    if (result.every((r) => r) && currentIndex < Data.length - 1) {
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        setUserAnswers(
          Array(Data[currentIndex + 1].expectedAnswers.length).fill("")
        );
        setResults(null);
      }, 2000); // Delay to show correct feedback before moving
    }
  };

  const currentQuestion = Data[currentIndex];
  const nullIndices = currentQuestion.question
    .map((part, idx) => (part === null ? idx : -1))
    .filter((idx) => idx !== -1);

  return (
    <div className="p-8 max-w-2xl mx-auto bg-white shadow-md rounded-lg">
      <p className="text-lg mb-4 font-semibold">{currentQuestion.text}</p>
      {currentQuestion.imageUrl && (
        <img
          src={currentQuestion.imageUrl}
          alt="Question context"
          className="w-full h-auto mb-4 rounded"
        />
      )}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {currentQuestion.question.map((part, index) =>
          part === null ? (
            <input
              key={index}
              type="text"
              className={`border p-1 rounded w-16 text-center ${
                results &&
                (results[nullIndices.indexOf(index)]
                  ? "border-green-500"
                  : "border-red-500")
              }`}
              placeholder="___"
              value={userAnswers[nullIndices.indexOf(index)]}
              onChange={(e) =>
                handleInputChange(e.target.value, nullIndices.indexOf(index))
              }
            />
          ) : (
            <span key={index}>{part}</span>
          )
        )}
      </div>
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
      >
        Submit
      </button>

      {results && (
        <div className="mt-4">
          {results.every((r) => r) ? (
            <p className="text-green-600 font-semibold">
              All answers are correct! 🎉 Moving to next question...
            </p>
          ) : (
            <div className="text-red-600 font-semibold">
              <p>Some answers are incorrect. Try again!</p>
              <ul className="list-disc list-inside mt-2">
                {results.map(
                  (isCorrect, idx) =>
                    !isCorrect && (
                      <li key={idx}>
                        Question {idx + 1}: Your answer "{userAnswers[idx]}" is
                        wrong. Correct answer is "
                        {currentQuestion.expectedAnswers[idx]}".
                      </li>
                    )
                )}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FillInTheBlank;
