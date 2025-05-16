import React, { useState, useEffect } from "react";

const SequenceInput = () => {
  const [inputValues, setInputValues] = useState([]);
  const [filledSequences, setFilledSequences] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isReading, setIsReading] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null); // null, "correct", "incorrect"

  const data2 = [
    {
      type: "sequence",
      text: "Fill the blank.",
      clue: "",
      question: ["How many apples are there in the basket?"],
      correctAnswer: ["10"], // Corrected
      options: ["10", "5", "15"],
      imageUrl: [
        "https://m.media-amazon.com/images/I/81MbS41+wFL._AC_UF894,1000_QL80_.jpg",
      ],
      style: { height: "300px", width: "300px" },
    },
    {
      type: "sequence",
      text: "Fill the blank.",
      clue: "",
      question: [
        "There are null apples in atray, null are red, null are green",
      ],
      correctAnswer: ["10", "5", "5"], // Corrected
      options: [],
      imageUrl: [
        "https://m.media-amazon.com/images/I/81MbS41+wFL._AC_UF894,1000_QL80_.jpg",
      ],
      style: { height: "300px", width: "300px" },
    },
    {
      type: "sequence",
      text: "Fill the blank.",
      clue: "",
      question: ["10, 20, null , 40, 50", "there null"],
      correctAnswer: ["30", "are"], // Corrected
      options: [],
      imageUrl: [],
      style: { height: "300px", width: "300px" },
    },
    {
      type: "sequence",
      text: "Fill the blank.",
      clue: "",
      question: [
        "There are null days in a week",
        "There are null months in a year",
      ],
      correctAnswer: ["7", "12"],
      options: [],
      imageUrl: [],
      style: { height: "300px", width: "300px" },
    },
    {
      type: "sequence",
      text: "Fill the blank.",
      clue: "chocolate",
      question: ["ch null c null l null t null"],
      correctAnswer: ["o", "o", "a", "e"],
      options: [],
      imageUrl: [
        "https://upload.wikimedia.org/wikipedia/commons/1/11/Three_Bars_%281%29.jpg",
      ],
      style: { height: "300px", width: "300px" },
    },
    {
      type: "sequence",
      text: "Fill the blank.",
      clue: "leopard",
      question: ["l null null p null rd"],
      correctAnswer: ["e", "o", "a"],
      options: [],
      imageUrl: [
        "https://www.krugerpark.co.za/images/leopard-kruger-rh-786x500.jpg",
      ],
      style: { height: "200px", width: "200px" },
    },
    {
      type: "sequence",
      text: "Fill the blank with the correct letter.",
      clue: "airplane",
      question: ["a null rpl null n null"],
      correctAnswer: ["i", "a", "e"],
      options: ["i", "a", "e"],
      imageUrl: ["https://i.ytimg.com/vi/5gHYQto803E/maxresdefault.jpg"],
      style: { height: "200px", width: "200px" },
    },
    {
      type: "sequence",
      text: "Fill the blank with the correct letter.",
      question: ["a big p null g"],
      correctAnswer: ["i"],
      options: ["a", "e", "o", "i"],
      imageUrl: [],
      style: { height: "200px", width: "200px" },
    },
    {
      type: "sequence",
      text: "Fill the blank with the correct letter.",
      question: ["null null ui null null"],
      correctAnswer: ["f", "r", "t", "s"],
      options: [],
      imageUrl: [
        "https://www.fastandup.in/nutrition-world/wp-content/uploads/2023/06/fruit-min.png",
      ],
      style: { height: "200px", width: "200px" },
    },
    {
      type: "sequence",
      text: "Fill the blank with the correct number.",
      question: ["1, 3, 5, null , 9"],
      correctAnswer: ["7"],
      options: [],
      imageUrl: [],
      style: { height: "200px", width: "200px" },
    },
    {
      type: "sequence",
      text: "Fill the blank with the correct number.",
      question: ["2, 4, null , 8, 10"],
      correctAnswer: ["6"],
      options: [],
      imageUrl: [],
      style: { height: "200px", width: "200px" },
    },
    {
      type: "sequence",
      text: "Fill the blank with the correct number.",
      question: ["20, 40, null , 80, 100"],
      correctAnswer: ["60"],
      options: [],
      imageUrl: [],
      style: { height: "200px", width: "200px" },
    },
  ];

  const currentData = data2[currentQuestion] || null;
  const questionStrings = currentData?.question || [];
  const correctAnswers = currentData?.correctAnswer || [];

  // Count total nulls across all question strings
  const totalNullCount = questionStrings.reduce(
    (count, str) => count + (str.match(/null/g) || []).length,
    0
  );

  // Initialize inputValues based on total nulls
  if (inputValues.length !== totalNullCount) {
    setInputValues(Array(totalNullCount).fill(""));
    setSubmissionStatus(null); // Reset submission status on question change
  }

  // Handle input change for a specific null index
  const handleInputChange = (index, value) => {
    const newInputValues = [...inputValues];
    newInputValues[index] = value;
    setInputValues(newInputValues);
    setFeedback("");
    setSubmissionStatus(null); // Reset submission status on input change
  };

  // Handle submit
  const handleSubmit = () => {
    let nullIndex = 0;
    const replaced = questionStrings.map((str) => {
      return str.replace(/null/g, () => inputValues[nullIndex++]);
    });
    setFilledSequences(replaced);

    // Validate inputs
    const isCorrect = inputValues.every(
      (value, idx) => value.trim() === correctAnswers[idx]
    );

    if (totalNullCount !== correctAnswers.length) {
      console.warn(
        `Mismatch: ${totalNullCount} nulls but ${correctAnswers.length} correct answers for question ${currentQuestion}`
      );
    }

    if (isCorrect && totalNullCount === correctAnswers.length) {
      setFeedback("✅ Correct!");
      setSubmissionStatus("correct");
      // Auto-advance to next question after 1 second
      setTimeout(() => {
        handleNextQuestion();
      }, 1000);
    } else {
      setFeedback(
        `❌ Incorrect, the correct answers are ${correctAnswers.join(", ")}.`
      );
      setSubmissionStatus("incorrect");
    }
  };

  // Text-to-speech
  const readAloud = () => {
    if ("speechSynthesis" in window && !isReading) {
      setIsReading(true);
      const textToRead = [
        currentData.text,
        currentData.clue,
        ...questionStrings,
      ]
        .filter((t) => t)
        .join(". ");
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.onend = () => setIsReading(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < data2.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setInputValues([]);
      setFilledSequences([]);
      setFeedback("");
      setSubmissionStatus(null);
    } else {
      setCurrentQuestion(data2.length);
      setFilledSequences([]);
      setFeedback("🎉 All questions completed!");
      setSubmissionStatus(null);
    }
  };

  // Check if all inputs are filled
  const allInputsFilled = inputValues.every((val) => val.trim() !== "");

  return (
    <div className="p-6 max-w-xl mx-auto text-left">
      (Question {currentQuestion + 1}/{data2.length})
      {/* Inline styles for hover effect */}
      <style>
        {`
          .sequence-image:hover {
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          }
        `}
      </style>
      {currentQuestion < data2.length && currentData ? (
        <>
          {submissionStatus === "correct" ? (
            <div className="mt-4 text-lg text-green-600">
              <p>{feedback}</p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-xl font-semibold">{currentData.text}</p>
                {currentData.clue && (
                  <p className="text-lg italic text-gray-600">
                    {/* Clue: {currentData.clue} */}
                  </p>
                )}
                {/* <button
                  // onClick={readAloud}
                  disabled={isReading}
                  className="mt-2 bg-blue-500 text-white font-semibold px-4 py-2 rounded hover:bg-blue-600 transition disabled:bg-gray-400"
                >
                  {isReading ? "Reading..." : "Read Aloud"}
                </button> */}
              </div>

              {/* Image Rendering */}
              {currentData?.imageUrl?.length > 0 && (
                <div className="flex flex-wrap justify-left gap-4 mb-6">
                  {currentData.imageUrl.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`Question ${currentQuestion + 1} image ${index + 1}`}
                      className="sequence-image"
                      style={{
                        width: currentData.style?.width || "150px",
                        height: currentData.style?.height || "150px",
                        maxWidth: "100%",
                        objectFit: "contain",
                        borderRadius: "0.75rem",
                        boxShadow:
                          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                        // transition: "box-shadow 0.3s ease-in-out",
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Question Rendering */}
              <div className="text-lg mb-6">
                {questionStrings.map((sequenceStr, qIndex) => {
                  const isSentence = /[a-zA-Z]/.test(sequenceStr);
                  const nullOffset = questionStrings
                    .slice(0, qIndex)
                    .reduce(
                      (count, str) => count + (str.match(/null/g) || []).length,
                      0
                    );

                  return (
                    <div key={qIndex} className="mb-4">
                      {isSentence ? (
                        <p className="text-lg">
                          {sequenceStr.split(" ").map((word, idx) => {
                            if (word === "null") {
                              const nullIndex =
                                nullOffset +
                                sequenceStr
                                  .split(" ")
                                  .slice(0, idx)
                                  .filter((w) => w === "null").length;
                              return (
                                <input
                                  key={idx}
                                  type="text"
                                  value={inputValues[nullIndex] || ""}
                                  onChange={(e) =>
                                    handleInputChange(nullIndex, e.target.value)
                                  }
                                  className="w-8 h-5 text-center border border-gray-400 rounded px-1 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              );
                            }
                            return <span key={idx}> {word} </span>;
                          })}
                        </p>
                      ) : (
                        <div className="flex justify-center gap-2 flex-wrap items-center text-lg">
                          {sequenceStr.split(",").map((item, index) => {
                            const trimmed = (item || "").trim();
                            if (trimmed === "null") {
                              const nullIndex =
                                nullOffset +
                                sequenceStr
                                  .split(",")
                                  .slice(0, index)
                                  .filter((i) => i.trim() === "null").length;
                              return (
                                <span key={index} className="mx-1">
                                  <input
                                    type="text"
                                    value={inputValues[nullIndex] || ""}
                                    onChange={(e) =>
                                      handleInputChange(
                                        nullIndex,
                                        e.target.value
                                      )
                                    }
                                    className="w-10 text-center border border-gray-400 rounded px-1 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  />
                                  {index < sequenceStr.split(",").length - 1 &&
                                    ","}
                                </span>
                              );
                            }
                            return (
                              <span key={index} className="mx-1">
                                {trimmed}
                                {index < sequenceStr.split(",").length - 1 &&
                                  ","}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}

                {currentData.options.length > 0 && (
                  <div className="flex justify-left gap-2 mb-6">
                    <div className="flex gap-2 mt-2">
                      {currentData.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            const firstEmptyIndex = inputValues.findIndex(
                              (val) => !val
                            );
                            if (firstEmptyIndex !== -1) {
                              handleInputChange(firstEmptyIndex, option);
                            }
                          }}
                          className={`bg-blue-100 text-gray-800 px-4 sm:px-6 py-2 sm:py-3 rounded-lg border-2 border-blue-200 hover:bg-blue-200 flex items-center justify-center text-xs sm:text-sm font-medium shadow-sm hover:shadow-md transition duration-300 ${
                            inputValues.includes(option) ? "bg-blue-300" : ""
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-left gap-4 mb-6">
                <button
                  onClick={handleSubmit}
                  className="bg-green-500 text-white font-semibold px-6 py-2 rounded hover:bg-green-600 transition disabled:bg-gray-400"
                  disabled={!allInputsFilled}
                >
                  Submit
                </button>
                <button
                  onClick={handleNextQuestion}
                  className="bg-blue-500 text-white font-semibold px-6 py-2 rounded hover:bg-blue-600 transition"
                >
                  Next
                </button>
              </div>

              {submissionStatus === "incorrect" && (
                <div className="mt-4 text-lg text-red-600">
                  <p className="xl">{feedback}</p>
                </div>
              )}
            </>
          )}

          {submissionStatus !== "correct" && filledSequences.length > 0 && (
            <div className="mt-4 text-lg">
              {filledSequences.map((seq, idx) => (
                <p key={idx}>
                  Output {idx + 1}:{" "}
                  <span className="font-mono text-blue-700">{seq}</span>
                </p>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="text-xl text-green-600 font-semibold">
          🎉 All questions completed!
        </div>
      )}
    </div>
  );
};

export default SequenceInput;
