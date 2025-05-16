import React, { useState, useEffect } from "react";
import DOMPurify from "dompurify";

const questions = [
  {
    id: "Q0",
    type: "reasoning",
    prompt:
      "Assertion (A): Water boils at 100°C at sea level.\nReason (R): Atmospheric pressure affects the boiling point of liquids.",
    options: [
      "Both A and R are true and R is the correct explanation of A.",
      "Both A and R are true but R is not the correct explanation of A.",
      "A is true but R is false.",
      "A is false but R is true.",
      "Both A and R are false.",
    ],
    correctAnswer:
      "Both A and R are true and R is the correct explanation of A.",
  },
  {
    id: "Q1",
    type: "single-select",
    prompt: "What is the capital of France?",
    options: ["Berlin", "Madrid", "Paris", "London"],
    correctAnswer: "Paris",
  },
  {
    id: "Q2",
    type: "multi-select",
    prompt: "Select all prime numbers:",
    options: ["2", "3", "4", "5"],
    correctAnswers: ["2", "3", "5"],
  },
  {
    id: "Q3",
    type: "fill-in",
    prompt: "The chemical symbol for water is ___",
    correctAnswer: "H2O",
  },
  {
    id: "A.4",
    type: "fill-in-sequence",
    prompt: "Guess the missing number",
    sequence: [1, 4, null, 16],
    sequenceType: "plainText",
    correctAnswer: "9",
  },
  {
    id: "A.5",
    type: "simple",
    prompt: "1, 3, 5, x — x = ?",
    correctAnswer: "7",
  },
  {
    id: "A.6",
    type: "fill-in-sequence",
    prompt: "Guess the missing number",
    sequence: [1, 3, null],
    sequenceType: "plainText",
    correctAnswer: "7",
  },
  {
    id: "A.7",
    type: "fill-in-sequence",
    prompt: "Guess the missing number",
    sequence: ["There are", null],
    sequenceType: "plainText",
    correctAnswer: "seven",
  },
  {
    id: "A.8",
    type: "fill-in-sequence",
    prompt: "Guess the missing number",
    sequence: [
      `<p><strong>Guess the sequence</strong></p>
        <table border="1">
          <tr><td>1</td><td>2</td><td>3</td><td>4</td></tr>
          <tr><td>1</td><td>4</td><td style="color:red;">?</td><td>25</td></tr>
        </table>`,
    ],
    sequenceType: "html",
    correctAnswer: "9",
  },
  {
    id: "A.10",
    type: "fill-in-sequence",
    prompt: "Assertion and reasoning",
    sequence: [
      `<div style="-webkit-text-stroke-width:0px;background-color:rgb(248, 248, 248);box-sizing:border-box;color:rgb(102, 102, 102);font-family:roboto-regular;font-size:16px;font-style:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-weight:300;letter-spacing:normal;line-height:27px;margin-bottom:10px;orphans:2;outline:none;text-align:start;text-decoration-color:initial;text-decoration-style:initial;text-decoration-thickness:initial;text-indent:0px;text-transform:none;white-space:normal;widows:2;word-spacing:0px;">
      <span style="font-family:Tahoma, Geneva, sans-serif;"><strong><sup>In each of the questions given below, there are two statements marked as Assertion (A) and Reason (R). Mark your answer as per the codes provided below:</sup></strong></span>
  </div>
  <p>
      Assertion (A): When lightning strikes, the sound is heard a little after the flash is seen.<br>
      Reason (R): The velocity of light is greater than that of the sound.
  </p>
  <ol style="-webkit-text-stroke-width:0px;background-color:rgb(248, 248, 248);box-sizing:border-box;color:rgb(102, 102, 102);font-family:roboto-regular;font-size:16px;font-style:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-weight:300;letter-spacing:normal;list-style-type:decimal;margin-bottom:10px;margin-top:0px;orphans:2;outline:none;padding:0px 0px 20px 30px;text-align:start;text-decoration-color:initial;text-decoration-style:initial;text-decoration-thickness:initial;text-indent:0px;text-transform:none;white-space:normal;widows:2;word-spacing:0px;">
      <li style="box-sizing:border-box;font-family:roboto-regular !important;outline:none;padding:0px 0px 10px;">
          Both A and R are true and R is the correct explanation of A.
      </li>
      <li style="box-sizing:border-box;font-family:roboto-regular !important;outline:none;padding:0px 0px 10px;">
          Both A and R are true but R is not the correct explanation of A.
      </li>
      <li style="box-sizing:border-box;font-family:roboto-regular !important;outline:none;padding:0px 0px 10px;">
          A is true but R is false.
      </li>
      <li style="box-sizing:border-box;font-family:roboto-regular !important;outline:none;padding:0px 0px 10px;">
          A is false but R is true.
      </li>
      <li style="box-sizing:border-box;font-family:roboto-regular !important;outline:none;padding:0px;">
          Both A and R are false
      </li>
  </ol>`,
    ],
    options: ["1", "2", "3", "4", "5"],
    sequenceType: "html",
    correctAnswer: "1", // Corrected to match the correct option
  },
];

const Quiz = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [feedback, setFeedback] = useState({});
  const [showQuestion, setShowQuestion] = useState(true);

  const question = questions[currentQuestionIndex];

  const handleAnswerChange = (e) => {
    setUserAnswers({ ...userAnswers, [question.id]: e.target.value });
  };

  const handleSingleSelect = (value) => {
    setUserAnswers({ ...userAnswers, [question.id]: value });
  };

  const handleMultiSelect = (value) => {
    const prev = userAnswers[question.id] || [];
    const updated = prev.includes(value)
      ? prev.filter((v) => v !== value)
      : [...prev, value];
    setUserAnswers({ ...userAnswers, [question.id]: updated });
  };

  const checkAnswer = () => {
    let isCorrect = false;
    const userInput = userAnswers[question.id];

    if (question.type === "single-select" || question.type === "reasoning") {
      isCorrect = userInput === question.correctAnswer;
    } else if (question.type === "multi-select") {
      const selected = (userInput || []).sort().join(",");
      const correct = question.correctAnswers.sort().join(",");
      isCorrect = selected === correct;
    } else {
      const normalizedUser = String(userInput || "")
        .trim()
        .toLowerCase();
      const normalizedCorrect = String(question.correctAnswer)
        .trim()
        .toLowerCase();
      isCorrect = normalizedUser === normalizedCorrect;
    }

    setFeedback({
      ...feedback,
      [question.id]: isCorrect ? "✅ Correct!" : "❌ Incorrect. Try again!",
    });

    if (isCorrect) {
      setShowQuestion(false);
      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex((prev) => prev + 1);
          setShowQuestion(true);
          setFeedback({ ...feedback, [question.id]: "" }); // Clear feedback for next question
        } else {
          setFeedback({
            ...feedback,
            [question.id]: "✅ Correct! Quiz completed!",
          });
        }
      }, 1500); // Delay to show feedback before moving to next question
    }
  };

  const renderQuestion = () => {
    switch (question.type) {
      case "reasoning":
      case "single-select":
        return (
          <>
            <p style={{ marginBottom: "10px" }}>{question.prompt}</p>
            {question.options.map((opt, index) => {
              const isSelected = userAnswers[question.id] === opt;
              const alphabet = String.fromCharCode(65 + index); // A, B, C, ...
              return (
                <div
                  key={opt}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="radio"
                      name={question.id}
                      value={opt}
                      checked={isSelected}
                      onChange={() => handleSingleSelect(opt)}
                      style={{ display: "none" }}
                      aria-label={`${alphabet}: ${opt}`}
                    />
                    <span
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        border: isSelected
                          ? "2px solid #4CAF50"
                          : "2px solid #666",
                        backgroundColor: isSelected ? "#4CAF50" : "transparent",
                        color: isSelected ? "#fff" : "#666",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold",
                        fontSize: "16px",
                        marginRight: "10px",
                        transition: "all 0.2s",
                      }}
                      className="custom-radio"
                    >
                      {alphabet}
                    </span>
                    <span>{opt}</span>
                  </label>
                </div>
              );
            })}
          </>
        );

      case "multi-select":
        return (
          <>
            <p style={{ marginBottom: "10px" }}>{question.prompt}</p>
            {question.options.map((opt, index) => {
              const isSelected = (userAnswers[question.id] || []).includes(opt);
              const alphabet = String.fromCharCode(65 + index);
              return (
                <div
                  key={opt}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleMultiSelect(opt)}
                      style={{ display: "none" }}
                      aria-label={`${alphabet}: ${opt}`}
                    />
                    <span
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        border: isSelected
                          ? "2px solid #4CAF50"
                          : "2px solid #666",
                        backgroundColor: isSelected ? "#4CAF50" : "transparent",
                        color: isSelected ? "#fff" : "#666",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold",
                        fontSize: "16px",
                        marginRight: "10px",
                        transition: "all 0.2s",
                      }}
                      className="custom-checkbox"
                    >
                      {isSelected ? "✔" : alphabet}
                    </span>
                    <span>{opt}</span>
                  </label>
                </div>
              );
            })}
          </>
        );

      case "fill-in":
      case "simple":
        return (
          <>
            <p style={{ marginBottom: "10px" }}>{question.prompt}</p>
            <input
              type="text"
              value={userAnswers[question.id] || ""}
              onChange={handleAnswerChange}
              placeholder="Your answer"
              style={{
                padding: "5px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                width: "200px",
              }}
            />
          </>
        );

      case "fill-in-sequence":
        return (
          <>
            <p style={{ marginBottom: "10px" }}>{question.prompt}</p>
            {question.sequenceType === "html" ? (
              <>
                <div
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(question.sequence[0]),
                  }}
                />
                {question.options?.map((opt, index) => {
                  const isSelected = userAnswers[question.id] === opt;
                  const alphabet = String.fromCharCode(65 + index); // A, B, C, ...
                  return (
                    <div
                      key={opt}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "8px",
                      }}
                    >
                      <label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          cursor: "pointer",
                        }}
                      >
                        <input
                          type="radio"
                          name={question.id}
                          value={opt}
                          checked={isSelected}
                          onChange={() => handleSingleSelect(opt)}
                          style={{ display: "none" }}
                          aria-label={`${alphabet}: ${opt}`}
                        />
                        <span
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            border: isSelected
                              ? "2px solid #4CAF50"
                              : "2px solid #666",
                            backgroundColor: isSelected
                              ? "#4CAF50"
                              : "transparent",
                            color: isSelected ? "#fff" : "#666",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: "bold",
                            fontSize: "16px",
                            marginRight: "10px",
                            transition: "all 0.2s",
                          }}
                          className="custom-radio"
                        >
                          {alphabet}
                        </span>
                        <span>{opt}</span>
                      </label>
                    </div>
                  );
                })}
              </>
            ) : (
              <p>
                {question.sequence.map((item, index) =>
                  item === null ? (
                    <input
                      key={index}
                      type="text"
                      value={userAnswers[question.id] || ""}
                      onChange={handleAnswerChange}
                      style={{
                        width: "40px",
                        margin: "0 5px",
                        padding: "5px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                      }}
                    />
                  ) : (
                    <span key={index} style={{ marginRight: "5px" }}>
                      {item}
                      {index < question.sequence.length - 1 ? "," : ""}
                    </span>
                  )
                )}
              </p>
            )}
          </>
        );

      default:
        return <p>Unsupported question type.</p>;
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial",
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      <style>
        {`
          .custom-radio:hover, .custom-checkbox:hover {
            border-color: #4CAF50;
          }
          .custom-radio:focus-within, .custom-checkbox:focus-within {
            outline: 2px solid #4CAF50;
            outline-offset: 2px;
          }
        `}
      </style>
      <div>
        <h2>Quiz</h2>
        <div>
          <h4>
            Question {currentQuestionIndex + 1} of {questions.length}
          </h4>

          {showQuestion ? renderQuestion() : null}

          {showQuestion && (
            <button
              onClick={checkAnswer}
              style={{
                marginTop: "10px",
                padding: "8px 16px",
                backgroundColor: "#4CAF50",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Submit
            </button>
          )}

          {feedback[question.id] && (
            <p
              style={{
                color: feedback[question.id].startsWith("✅") ? "green" : "red",
                marginTop: "10px",
              }}
            >
              {feedback[question.id]}
            </p>
          )}

          {showQuestion && (
            <div style={{ marginTop: "20px" }}>
              <button
                onClick={() =>
                  setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))
                }
                disabled={currentQuestionIndex === 0}
                style={{
                  padding: "8px 16px",
                  backgroundColor:
                    currentQuestionIndex === 0 ? "#ccc" : "#2196F3",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: currentQuestionIndex === 0 ? "not-allowed" : "pointer",
                  marginRight: "10px",
                }}
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setCurrentQuestionIndex((prev) =>
                    Math.min(prev + 1, questions.length - 1)
                  )
                }
                disabled={currentQuestionIndex === questions.length - 1}
                style={{
                  padding: "8px 16px",
                  backgroundColor:
                    currentQuestionIndex === questions.length - 1
                      ? "#ccc"
                      : "#2196F3",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor:
                    currentQuestionIndex === questions.length - 1
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;