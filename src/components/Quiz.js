import React, { useState, useEffect } from "react";
import DOMPurify from "dompurify";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import UploadingAnimation from "../assets/uploading.gif";
// import { questions } from "./QuestionData";

const Quiz = () => {
  const navigate = useNavigate();
  const { classId, subjectId, lessonId } = useParams();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [feedback, setFeedback] = useState({});
  const [showQuestion, setShowQuestion] = useState(true);
  const [filledSequences, setFilledSequences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loadingImage] = useState(UploadingAnimation);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        // Fetch questions specific to the lessonId
        const questionsRes = await axios.get(
          // `http://localhost:5000/api/questions?lessonId=${lessonId}`
          `https://ilx-backend.onrender.com/api/questions?lessonId=${lessonId}`
        );
        console.log("Response from API:", questionsRes.data);
        const fetchedQuestions = questionsRes.data;

        if (fetchedQuestions.length > 0) {
          setQuestions(fetchedQuestions);
          setError(null);
        } else {
          setQuestions([]);
          setError("No questions available for this lesson.");
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
        setError("Failed to load questions. Please try again later.");
        setQuestions([]);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      }
    };

    fetchQuestions();
  }, [lessonId]); // Depend on lessonId to refetch if it changes

  const question = questions[currentQuestionIndex];

  const initializeUserAnswer = (question) => {
    if (question.type === "fill-in-sequence" || question.type === "sequence") {
      const nullCount =
        question.type === "fill-in-sequence"
          ? question.sequence
            ? question.sequence.filter((item) => item === null).length
            : question.correctAnswers.length
          : question.question.reduce(
              (count, str) => count + (str.match(/null/g) || []).length,
              0
            );
      return Array(nullCount).fill("");
    }
    return "";
  };

  const handleAnswerChange = (e, index) => {
    if (question.type === "fill-in-sequence") {
      const prevSequenceAnswers =
        userAnswers[question._id] || initializeUserAnswer(question);
      const newSequenceAnswers = [...prevSequenceAnswers];
      newSequenceAnswers[index] = e.target.value;
      setUserAnswers({ ...userAnswers, [question._id]: newSequenceAnswers });
    } else {
      setUserAnswers({ ...userAnswers, [question._id]: e.target.value });
    }
    setFeedback({ ...feedback, [question._id]: "" });
  };

  const handleSingleSelect = (value) => {
    setUserAnswers({ ...userAnswers, [question._id]: value });
    setFeedback({ ...feedback, [question._id]: "" });
  };

  const handleMultiSelect = (value) => {
    const prev = userAnswers[question._id] || [];
    const updated = prev.includes(value)
      ? prev.filter((v) => v !== value)
      : [...prev, value];
    setUserAnswers({ ...userAnswers, [question._id]: updated });
    setFeedback({ ...feedback, [question._id]: "" });
  };

  const handleSequenceInputChange = (index, value) => {
    const prevSequenceAnswers =
      userAnswers[question._id] || initializeUserAnswer(question);
    const newSequenceAnswers = [...prevSequenceAnswers];
    newSequenceAnswers[index] = value;
    setUserAnswers({ ...userAnswers, [question._id]: newSequenceAnswers });
    setFeedback({ ...feedback, [question._id]: "" });
    setFilledSequences([]);
  };

  const handleSequenceOptionClick = (option) => {
    const prevSequenceAnswers =
      userAnswers[question._id] || initializeUserAnswer(question);
    const firstEmptyIndex = prevSequenceAnswers.findIndex((val) => !val);
    if (firstEmptyIndex !== -1) {
      const newSequenceAnswers = [...prevSequenceAnswers];
      newSequenceAnswers[firstEmptyIndex] = option;
      setUserAnswers({ ...userAnswers, [question._id]: newSequenceAnswers });
      setFeedback({ ...feedback, [question._id]: "" });
      setFilledSequences([]);
    }
  };

  const checkAnswer = () => {
    let isCorrect = false;
    const userInput = userAnswers[question._id];

    if (question.type === "single-select" || question.type === "reasoning") {
      isCorrect = userInput === question.options[question.correctAnswerIndex];
    } else if (question.type === "multi-select") {
      const selected = (userInput || []).sort().join(",");
      const correct = question.correctAnswerIndices
        .map((i) => question.options[i])
        .sort()
        .join(",");
      isCorrect = selected === correct;
    } else if (question.type === "sequence") {
      const sequenceAnswers = userInput || initializeUserAnswer(question);
      isCorrect =
        sequenceAnswers.length === question.correctAnswers.length &&
        sequenceAnswers.every(
          (value, idx) =>
            value &&
            value.trim().toLowerCase() ===
              String(question.correctAnswers[idx]).trim().toLowerCase()
        );

      if (isCorrect) {
        const nullCount = question.question.reduce(
          (count, str) => count + (str.match(/null/g) || []).length,
          0
        );
        let nullIndex = 0;
        const replaced = question.question.map((str) =>
          str.replace(/null/g, () => sequenceAnswers[nullIndex++] || "")
        );
        setFilledSequences(replaced);
      }
    } else if (question.type === "fill-in-sequence") {
      const sequenceAnswers = userInput || initializeUserAnswer(question);
      const nullCount = question.sequence
        ? question.sequence.filter((item) => item === null).length
        : question.correctAnswers.length;
      isCorrect =
        sequenceAnswers.length === nullCount &&
        sequenceAnswers.every(
          (value, idx) =>
            value &&
            value.trim().toLowerCase() ===
              String(question.correctAnswers[idx]).trim().toLowerCase()
        );
    } else {
      const normalizedUser = String(userInput || "")
        .trim()
        .toLowerCase();
      if (question.correctAnswers) {
        isCorrect = question.correctAnswers.some(
          (correct) => normalizedUser === String(correct).trim().toLowerCase()
        );
      } else {
        const normalizedCorrect = String(question.correctAnswer)
          .trim()
          .toLowerCase();
        isCorrect = normalizedUser === normalizedCorrect;
      }
    }

    const feedbackMessage = isCorrect
      ? "✅ Correct!"
      : question.type === "sequence" || question.type === "fill-in-sequence"
      ? `❌ Incorrect, the correct answers are ${question.correctAnswers.join(
          ", "
        )}. You entered: ${(userInput || []).join(", ")}`
      : question.correctAnswers
      ? `❌ Incorrect, the correct answers are ${question.correctAnswers.join(
          ", "
        )}. You entered: ${userInput || ""}`
      : `❌ Incorrect, the correct answer is ${
          question.correctAnswer
        }. You entered: ${userInput || ""}`;

    setFeedback({
      ...feedback,
      [question._id]: feedbackMessage,
    });

    if (isCorrect) {
      setShowQuestion(false);
      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex((prev) => prev + 1);
          setShowQuestion(true);
          setFeedback({
            ...feedback,
            [questions[currentQuestionIndex + 1].id]: "",
          });
          setFilledSequences([]);
        } else {
          setFeedback({
            ...feedback,
            [question._id]: "✅ Correct! Quiz completed!",
          });
        }
        // navigate(`/subjects/${classId}`);
      }, 1500);
    }
  };

  const renderQuestion = () => {
    switch (question?.type) {
      case "reasoning":
      case "single-select":
        return (
          <>
            <p className="mb-4 text-lg whitespace-pre-line">
              {question.prompt}
            </p>
            {question.imageUrl?.length > 0 && (
              <div className="mb-4">
                {question?.imageUrl.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt={`img-${idx}`}
                    style={
                      question.style || { maxWidth: "100%", height: "auto" }
                    }
                    // className="mx-auto rounded"
                  />
                ))}
              </div>
            )}

            {question.options.map((opt, index) => {
              const isSelected = userAnswers[question._id] === opt;
              const alphabet = String.fromCharCode(65 + index);
              return (
                <div key={opt} className="flex items-center mb-2">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name={question._id}
                      value={opt}
                      checked={isSelected}
                      onChange={() => handleSingleSelect(opt)}
                      className="sr-only"
                      aria-label={`${alphabet}: ${opt}`}
                    />
                    <span
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-base transition-all ${
                        isSelected
                          ? "border-green-500 bg-green-500 text-white"
                          : "border-gray-600 text-gray-600"
                      } mr-2`}
                      aria-hidden="true"
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
            <p className="mb-4 text-lg">{question.prompt}</p>
            {question.options.map((opt, index) => {
              const isSelected = (userAnswers[question._id] || []).includes(
                opt
              );
              const alphabet = String.fromCharCode(65 + index);
              return (
                <div key={opt} className="flex items-center mb-2">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleMultiSelect(opt)}
                      className="sr-only"
                      aria-label={`${alphabet}: ${opt}`}
                    />
                    <span
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-base transition-all ${
                        isSelected
                          ? "border-green-500 bg-green-500 text-white"
                          : "border-gray-600 text-gray-600"
                      } mr-2`}
                      aria-hidden="true"
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
        return (
          <div className="mb-6 flex flex-col items-start">
            {question?.sequenceType === "html" ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(question.prompt),
                }}
                className="mb-4"
              />
            ) : (
              <p className="mb-4 text-lg">{question.prompt}</p>
            )}
            {question.imageUrl?.length > 0 && (
              <div className="flex flex-wrap justify-start gap-4 mb-6">
                {question.imageUrl.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Question ${currentQuestionIndex + 1} image ${
                      index + 1
                    }`}
                    style={
                      question.style || { maxWidth: "100%", height: "auto" }
                    }
                  />
                ))}
              </div>
            )}
            <input
              type="text"
              value={userAnswers[question._id] || ""}
              onChange={(e) => handleAnswerChange(e)}
              placeholder="Your answer"
              className="p-2 border border-gray-300 rounded w-52 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        );

      case "fill-in-sequence":
        return (
          <>
            <p className="mb-4 text-lg">{question.prompt}</p>
            {question?.sequenceType === "html" ? (
              <>
                <div
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(question.sequence[0]),
                  }}
                  className="mb-4"
                />
                <div className="flex gap-2 mb-4">
                  {Array(question.correctAnswers.length)
                    .fill()
                    .map((_, index) => (
                      <input
                        key={index}
                        type="text"
                        value={(userAnswers[question._id] || [])[index] || ""}
                        onChange={(e) => handleAnswerChange(e, index)}
                        className="w-16 mx-1 p-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder=""
                        aria-label={`Answer ${index + 1} for ${
                          question.prompt
                        }`}
                      />
                    ))}
                </div>
              </>
            ) : (
              <div className="flex items-center flex-wrap gap-2">
                {question?.sequence?.map((item, index) => {
                  if (item === null) {
                    const nullIndex = question.sequence
                      .slice(0, index)
                      .filter((i) => i === null).length;
                    return (
                      <input
                        key={index}
                        type="text"
                        value={
                          (userAnswers[question._id] || [])[nullIndex] || ""
                        }
                        onChange={(e) => handleAnswerChange(e, nullIndex)}
                        className="w-16 mx-1 p-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder=""
                        aria-label={`Answer ${nullIndex + 1} for ${
                          question.prompt
                        }`}
                      />
                    );
                  }
                  return (
                    <span key={index} className="mr-1">
                      {item}
                      {index < question.sequence.length - 1 ? "," : ""}
                    </span>
                  );
                })}
              </div>
            )}
            {question?.options?.length > 0 && (
              <div className="flex justify-start gap-2 mt-4">
                {question.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleSequenceOptionClick(option)}
                    className={`bg-blue-100 text-gray-800 px-4 py-2 rounded-lg border-2 border-blue-200 hover:bg-blue-200 transition ${
                      (userAnswers[question._id] || []).includes(option)
                        ? "bg-blue-300"
                        : ""
                    }`}
                    aria-label={`Select option ${option}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </>
        );

      case "sequence":
        const sequenceAnswers =
          userAnswers[question._id] || initializeUserAnswer(question);
        const questionStrings = Array.isArray(question.question)
          ? question.question
          : question.question[0]?.split(",") || [];
        const totalNullCount = questionStrings.reduce(
          (count, str) => count + (str.match(/null/g) || []).length,
          0
        );

        return (
          <>
            <div className="mb-6">
              <p className="text-xl font-semibold">{question.text}</p>
              {question.clue && (
                <p className="text-lg italic text-gray-600">
                  Clue: {question.clue}
                </p>
              )}
            </div>

            {question.imageUrl?.length > 0 && (
              <div className="flex flex-wrap justify-start gap-4 mb-6">
                {question?.imageUrl.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Question ${currentQuestionIndex + 1} image ${
                      index + 1
                    }`}
                    // className="rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                    style={
                      question.style || { maxWidth: "100%", height: "auto" }
                    }
                  />
                ))}
              </div>
            )}

            <div className="text-lg mb-6">
              {questionStrings.map((sequenceStr, qIndex) => {
                if (!sequenceStr || typeof sequenceStr !== "string") {
                  return (
                    <p key={qIndex} className="text-red-600">
                      Invalid question format
                    </p>
                  );
                }
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
                                value={sequenceAnswers[nullIndex] || ""}
                                onChange={(e) =>
                                  handleSequenceInputChange(
                                    nullIndex,
                                    e.target.value
                                  )
                                }
                                className="w-14 h-8 text-center border border-gray-400 rounded px-1 py-1 focus:outline-none focus:ring-2 focus:ring-green-500 mx-1"
                                placeholder=""
                                aria-label={`Answer ${nullIndex + 1} for ${
                                  question.text
                                }`}
                              />
                            );
                          }
                          return <span key={idx}> {word} </span>;
                        })}
                      </p>
                    ) : (
                      <div className="flex justify-center gap-2 flex-wrap items-center text-lg">
                        {sequenceStr.split(",").map((item, index) => {
                          const trimmed = String(item || "").trim();
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
                                  value={sequenceAnswers[nullIndex] || ""}
                                  onChange={(e) =>
                                    handleSequenceInputChange(
                                      nullIndex,
                                      e.target.value
                                    )
                                  }
                                  className="w-16 text-center border border-gray-400 rounded px-1 py-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                                  placeholder={`Answer ${nullIndex + 1}`}
                                  aria-label={`Answer ${nullIndex + 1} for ${
                                    question.text
                                  }`}
                                />
                                {index < sequenceStr.split(",").length - 1 &&
                                  ","}
                              </span>
                            );
                          }
                          return (
                            <span key={index} className="mx-1">
                              {trimmed}
                              {index < sequenceStr.split(",").length - 1 && ","}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
              {question.options.length > 0 && (
                <div className="flex justify-start gap-2 mb-6">
                  {question.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleSequenceOptionClick(option)}
                      className={`bg-blue-100 text-gray-800 px-4 py-2 rounded-lg border-2 border-blue-200 hover:bg-blue-200 transition ${
                        sequenceAnswers.includes(option) ? "bg-blue-300" : ""
                      }`}
                      aria-label={`Select option ${option}`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {filledSequences.length > 0 && (
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
        );

      default:
        return <p className="text-lg">Unsupported question type.</p>;
    }
  };

  const allInputsFilled = () => {
    if (question?.type === "sequence") {
      const sequenceAnswers =
        userAnswers[question._id] || initializeUserAnswer(question);
      return sequenceAnswers.every((val) => val && val.trim() !== "");
    } else if (question?.type === "fill-in-sequence") {
      const sequenceAnswers =
        userAnswers[question._id] || initializeUserAnswer(question);
      const nullCount = question.sequence
        ? question.sequence.filter((item) => item === null).length
        : question.correctAnswers.length;
      return (
        sequenceAnswers.length === nullCount &&
        sequenceAnswers.every((val) => val && val.trim() !== "")
      );
    }
    return (
      userAnswers[question?._id] !== undefined &&
      userAnswers[question?._id] !== ""
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <img
          src={loadingImage}
          alt="Loading"
          className="w-24 h-24 rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="p-6 font-sans max-w-3xl mx-auto">
      <style jsx>{`
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          border: 0;
        }
        .custom-radio:hover,
        .custom-checkbox:hover {
          border-color: #4caf50;
        }
        input:focus {
          outline: 2px solid #4caf50;
          outline-offset: 2px;
        }
      `}</style>
      <div>
        <h2 className="text-2xl font-bold mb-4">Quiz</h2>
        <div>
          <h4 className="text-lg font-semibold mb-4">
            Question {currentQuestionIndex + 1} of {questions.length}
          </h4>

          {showQuestion ? renderQuestion() : null}
          <div>
            {showQuestion && (
              <button
                onClick={checkAnswer}
                disabled={!allInputsFilled()}
                className={`mt-4 px-6 py-2 rounded text-white font-semibold transition ${
                  allInputsFilled()
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
                aria-label="Submit answer"
              >
                Submit
              </button>
            )}
          </div>

          {feedback[question?._id] && (
            <p
              className={`mt-4 text-lg ${
                feedback[question?._id].startsWith("✅")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {feedback[question?._id]}
            </p>
          )}

          {showQuestion && (
            <div className="mt-6 flex gap-4">
              <button
                onClick={() =>
                  setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))
                }
                disabled={currentQuestionIndex === 0}
                className={`px-6 py-2 rounded text-white font-semibold transition ${
                  currentQuestionIndex === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
                aria-label="Previous question"
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
                className={`px-6 py-2 rounded text-white font-semibold transition ${
                  currentQuestionIndex === questions.length - 1
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
                aria-label="Next question"
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
