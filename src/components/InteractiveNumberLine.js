import { useState, useRef, useCallback } from "react";

const questions = [
  {
    question: "Solve the inequality and graph the solution.",
    inequality: "2x + 3 > 5",
    instructions:
      "Select points to create endpoints, then connect them to draw a line. Click endpoints to toggle open/closed.",
    graph: {
      type: "number_line",
      solution: { interval: [1, "∞"], closed: false },
    },
    correctAnswers: [2, 4, 6, 8],
    answer: { type: "interval", value: "x > 1" },
  },
  {
    question: "Solve the inequality and graph the solution.",
    inequality: "(f - 3)/-2 > 1",
    instructions:
      "Select points to create endpoints, then connect them to draw a line. Click endpoints to toggle open/closed.",
    graph: {
      type: "number_line",
      solution: { interval: ["-∞", 1], closed: false },
    },
    correctAnswers: [2, 4, 6, 8],
    answer: { type: "interval", value: "f < 1" },
  },
  {
    question: "Select odd number after 3.",
    inequality: "",
    instructions:
      "Select points to create endpoints, then connect them to draw a line. Click endpoints to toggle open/closed.",
    graph: {
      type: "number_line",

      solution: { interval: ["-∞", -2], closed: true },
    },
    correctAnswers: [2, 4, 6, 8],
    answer: { type: "interval", value: "a ≤ -2" },
  },
  {
    question: "Solve the inequality and graph the solution.",
    inequality: "5(a + 4) - 8 ≤ 2",
    instructions:
      "Select points to create endpoints, then connect them to draw a line. Click endpoints to toggle open/closed.",
    graph: {
      type: "number_line",

      solution: { interval: ["-∞", -2], closed: true },
    },
    correctAnswers: [2, 4, 6, 8],
    answer: { type: "interval", value: "a ≤ -2" },
  },
  {
    question: "Solve the inequality and graph the solution.",
    inequality: "(s - 1)/7 ≤ 1",
    instructions:
      "Select points to create endpoints, then connect them to draw a line. Click endpoints to toggle open/closed.",
    graph: {
      type: "number_line",

      solution: { interval: ["-∞", 8], closed: true },
    },
    correctAnswers: [2, 4, 6, 8],
    answer: { type: "interval", value: "s ≤ 8" },
  },

  {
    question: "Solve the inequality and graph the solution.",
    inequality: "(f - 3)/-2 > 1",
    instructions:
      "Select points to create endpoints, then connect them to draw a line. Click endpoints to toggle open/closed.",
    graph: {
      type: "number_line",
      solution: { interval: ["-∞", 1], closed: false },
    },
    correctAnswers: [2, 4, 6, 8],
    answer: { type: "interval", value: "f < 1" },
  },
  {
    question: "Solve the inequality and graph the solution.",
    inequality: "3 - x < 6",
    instructions:
      "Select points to create endpoints, then connect them to draw a line. Click endpoints to toggle open/closed.",
    graph: {
      type: "number_line",
      solution: { interval: ["-∞", -3], closed: false },
    },
    correctAnswers: [2, 4, 6, 8],
    answer: { type: "interval", value: "x > -3" },
  },
  {
    question: "Solve the inequality and graph the solution.",
    inequality: "4x - 5 ≥ -9",
    instructions:
      "Select points to create endpoints, then connect them to draw a line. Click endpoints to toggle open/closed.",
    graph: {
      type: "number_line",
      solution: { interval: [-1, "∞"], closed: true },
    },
    correctAnswers: [2, 4, 6, 8],
    answer: { type: "interval", value: "x ≥ -1" },
  },
];

const InteractiveNumberLine = () => {
  const [points, setPoints] = useState([]);
  const [lines, setLines] = useState([]);
  const [selectedPoints, setSelectedPoints] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);
  const [endpointTypes, setEndpointTypes] = useState({});
  const [showResetModal, setShowResetModal] = useState(false);
  const [attempts, setAttempts] = useState(Array(questions.length).fill(0));
  const [correctAnswers, setCorrectAnswers] = useState(
    Array(questions.length).fill(0)
  );
  const svgRef = useRef(null);
  const chartRef = useRef(null);

  console.log(points, lines);

  const width = 600;
  const height = 120;
  const scale = width / 20;
  const centerY = height / 2;

  const toSvgX = useCallback((value) => (value + 10) * scale, [scale]);
  const toValue = useCallback(
    (svgX) => {
      const value = svgX / scale - 10;
      return Math.round(value * 4) / 4; // Precision to 0.25
    },
    [scale]
  );

  const handleMouseDown = useCallback(
    (e) => {
      const rect = svgRef.current.getBoundingClientRect();
      const svgX = e.clientX - rect.left;
      const svgY = e.clientY - rect.top;
      let value = toValue(svgX);

      if (value < -10 || value > 10) return;

      const clickedEndpoint = lines
        .flatMap((line, index) => [
          { value: line[0], index, side: "start" },
          { value: line[1], index, side: "end" },
        ])
        .find((p) => Math.abs(toSvgX(p.value) - svgX) < 10);

      if (clickedEndpoint) {
        const { index, side } = clickedEndpoint;
        setEndpointTypes((prev) => ({
          ...prev,
          [`${index}-${side}`]: !prev[`${index}-${side}`],
        }));
        return;
      }

      const clickedLine = lines.findIndex(([start, end]) => {
        const x1 = toSvgX(start);
        const x2 = toSvgX(end);
        return (
          svgX >= Math.min(x1, x2) - 5 &&
          svgX <= Math.max(x1, x2) + 5 &&
          Math.abs(svgY - centerY) < 10
        );
      });

      if (clickedLine >= 0) {
        setLines(lines.filter((_, i) => i !== clickedLine));
        setFeedback("");
        setIsCorrect(false);
        return;
      }

      const clickedPointIndex = points.findIndex(
        (p) => Math.abs(toSvgX(p) - svgX) < 10
      );

      if (clickedPointIndex >= 0) {
        const point = points[clickedPointIndex];
        if (selectedPoints.includes(point)) {
          setSelectedPoints(selectedPoints.filter((p) => p !== point));
        } else {
          const newSelected = [...selectedPoints, point];
          setSelectedPoints(newSelected);
          if (newSelected.length === 2) {
            setLines([...lines, [newSelected[0], newSelected[1]]]);
            setSelectedPoints([]);
          }
        }
        return;
      }

      setPoints((prev) => [...prev, value]);
      setSelectedPoints((prev) => [...prev, value]);
    },
    [points, lines, selectedPoints, toSvgX, toValue, centerY]
  );

  const handleCheck = useCallback(() => {
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion || !currentQuestion.correctAnswers) {
      setFeedback("No correct answers specified for this question.");
      setIsCorrect(false);
      return;
    }
    const correct = currentQuestion.correctAnswers;
    const selected = selectedPoints.slice().sort((a, b) => a - b);
    const correctSorted = correct.slice().sort((a, b) => a - b);

    if (
      selected.length === correctSorted.length &&
      selected.every((val, idx) => Math.abs(val - correctSorted[idx]) < 0.01)
    ) {
      setFeedback("Correct points selected!");
      setIsCorrect(true);
    } else {
      setFeedback("Incorrect points. Try again.");
      setIsCorrect(false);
    }
  }, [currentQuestionIndex, selectedPoints]);

  const checkAnswer = useCallback(() => {
    const currentQuestion = questions[currentQuestionIndex];
    const correctAnswers = currentQuestion.correctAnswers || [];
    if (!currentQuestion) {
      setFeedback("No question available.");
      setIsCorrect(false);
      return;
    }

    setAttempts((prev) => {
      const newAttempts = [...prev];
      newAttempts[currentQuestionIndex]++;
      return newAttempts;
    });

    const {
      graph: {
        solution: { interval, closed },
      },
    } = currentQuestion;
    const [start, end] = interval;

    if (lines.length !== 1) {
      setFeedback(
        `Please draw exactly one line segment. You have drawn ${lines.length} line(s).`
      );
      setIsCorrect(false);
      return;
    }

    const [lineStart, lineEnd] = lines[0];
    const min = Math.min(lineStart, lineEnd);
    const max = Math.max(lineStart, lineEnd);
    const lineDirection = lineStart < lineEnd ? "right" : "left";

    const lineIndex = lines.findIndex(
      (l) => l[0] === lineStart && l[1] === lineEnd
    );
    const startKey = `${lineIndex}-start`;
    const endKey = `${lineIndex}-end`;

    let drawnClosed;
    let isAnswerCorrect = false;
    let feedbackMessage = [];

    if (start === "-∞" && end !== "∞") {
      drawnClosed = !endpointTypes[endKey];
      const endpointDiff = Math.abs(max - end);
      if (endpointDiff >= 0.25) {
        feedbackMessage.push(
          `Endpoint value incorrect. Expected ${end}, got ${max}.`
        );
      }
      if (lineDirection !== "left") {
        feedbackMessage.push(
          "Direction incorrect. Line should extend left to -∞."
        );
      }
      if (drawnClosed !== closed) {
        feedbackMessage.push(
          `Endpoint type incorrect. Should be ${closed ? "closed" : "open"}.`
        );
      }
      isAnswerCorrect =
        endpointDiff < 0.25 &&
        lineDirection === "left" &&
        drawnClosed === closed;
    } else if (end === "∞" && start !== "-∞") {
      drawnClosed = !endpointTypes[startKey];
      const endpointDiff = Math.abs(min - start);
      if (endpointDiff >= 0.25) {
        feedbackMessage.push(
          `Endpoint value incorrect. Expected ${start}, got ${min}.`
        );
      }
      if (lineDirection !== "right") {
        feedbackMessage.push(
          "Direction incorrect. Line should extend right to ∞."
        );
      }
      if (drawnClosed !== closed) {
        feedbackMessage.push(
          `Endpoint type incorrect. Should be ${closed ? "closed" : "open"}.`
        );
      }
      isAnswerCorrect =
        endpointDiff < 0.25 &&
        lineDirection === "right" &&
        drawnClosed === closed;
    } else {
      setFeedback("Invalid interval format.");
      setIsCorrect(false);
      return;
    }

    if (isAnswerCorrect) {
      setCorrectAnswers((prev) => {
        const newCorrect = [...prev];
        newCorrect[currentQuestionIndex]++;
        return newCorrect;
      });
      setFeedback("Correct! Your graph matches the solution.");
    } else {
      setFeedback(feedbackMessage.join(" "));
    }
    setIsCorrect(isAnswerCorrect);
  }, [currentQuestionIndex, lines, endpointTypes]);

  const nextQuestion = useCallback(() => {
    setCurrentQuestionIndex((prev) => (prev + 1) % questions.length);
    resetState();
  }, []);

  const resetState = useCallback(() => {
    setPoints([]);
    setLines([]);
    setSelectedPoints([]);
    setEndpointTypes({});
    setFeedback("");
    setIsCorrect(false);
  }, []);

  const handleReset = useCallback(() => {
    setShowResetModal(true);
  }, []);

  const confirmReset = useCallback(() => {
    resetState();
    setShowResetModal(false);
  }, [resetState]);

  const resetProgress = useCallback(() => {
    setAttempts(Array(questions.length).fill(0));
    setCorrectAnswers(Array(questions.length).fill(0));
    setCurrentQuestionIndex(0);
    resetState();
  }, [resetState]);

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Inequality Quiz Number Line
      </h2>

      {/* Question and instructions section */}
      <div className="mb-6 bg-gray-50 p-4 rounded-lg">
        <p className="text-lg text-gray-700 mb-2">
          {currentQuestion.instructions}
        </p>
        <div className="text-lg text-gray-800 mb-2">
          <strong>
            Question {currentQuestionIndex + 1} of {questions.length}:
          </strong>{" "}
          {currentQuestion.question}
        </div>
        <div className="text-lg text-gray-800 mb-2">
          Inequality:{" "}
          <span className="font-mono">{currentQuestion.inequality}</span>
        </div>
        <div className="text-lg text-gray-800">
          Answer:{" "}
          <span className="font-mono">{currentQuestion.answer.value}</span>
        </div>
      </div>

      {/* Buttons section */}
      <div className="flex justify-between mb-6">
        <div className="flex space-x-3">
          <button
            onClick={checkAnswer}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
          >
            Submit
          </button>
          {isCorrect && (
            <button
              onClick={nextQuestion}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Next Question
            </button>
          )}
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
          >
            Clear
          </button>
          <button
            onClick={resetProgress}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition duration-200"
          >
            Reset Progress
          </button>
        </div>
        <div className="text-gray-600">
          Progress: {currentQuestionIndex + 1}/{questions.length}
        </div>
      </div>

      {/* Feedback section */}
      {feedback && (
        <div
          className={`mb-6 p-4 rounded-lg text-center ${
            isCorrect
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {feedback}
        </div>
      )}

      {/* Number line SVG */}
      <div className="mb-6 relative">
        <svg
          ref={svgRef}
          width={width}
          height={height}
          onMouseDown={handleMouseDown}
          className="bg-gray-50 rounded-lg border border-gray-300 cursor-crosshair"
        >
          {/* Number line base */}
          <line
            x1={0}
            y1={centerY}
            x2={width}
            y2={centerY}
            stroke="black"
            strokeWidth="2"
          />

          {/* Tick marks and labels */}
          {Array.from({ length: 21 }, (_, i) => {
            const value = -10 + i;
            const x = toSvgX(value);
            return (
              <g key={`tick-${value}`}>
                <line
                  x1={x}
                  y1={centerY - (value % 2 === 0 ? 10 : 5)}
                  x2={x}
                  y2={centerY + (value % 2 === 0 ? 10 : 5)}
                  stroke="black"
                  strokeWidth="1"
                />
                {/* {[1, 2, 3, 4, 5, 6, 7].fill(value) && (
                  <circle
                    cx={x}
                    cy={centerY - 18}
                    r={6}
                    fill="#fbbf24"
                    stroke="#b45309"
                    strokeWidth={2}
                  />
                )} */}
                {value % 1 === 0 && (
                  <text
                    x={x}
                    y={centerY + 25}
                    textAnchor="middle"
                    fontSize="12"
                  >
                    {value}
                  </text>
                )}
              </g>
            );
          })}

          {/* Lines */}
          {lines.map(([start, end], i) => (
            <line
              key={`line-${i}`}
              x1={toSvgX(start)}
              y1={centerY}
              x2={toSvgX(end)}
              y2={centerY}
              stroke="#2563eb"
              strokeWidth="4"
            />
          ))}

          {/* Points */}
          {points.map((point, i) => (
            <circle
              key={`point-${i}`}
              cx={toSvgX(point)}
              cy={centerY}
              r="6"
              fill={selectedPoints.includes(point) ? "#f97316" : "#2563eb"}
              stroke="white"
              strokeWidth="2"
              className="cursor-pointer"
            />
          ))}

          {/* Endpoints */}
          {lines.map(([start, end], index) => {
            const startKey = `${index}-start`;
            const endKey = `${index}-end`;
            const isStartOpen = endpointTypes[startKey] || false;
            const isEndOpen = endpointTypes[endKey] || false;

            return [
              <circle
                key={`line-start-${index}`}
                cx={toSvgX(start)}
                cy={centerY}
                r={isStartOpen ? 6 : 8}
                fill={isStartOpen ? "white" : "#2563eb"}
                stroke={isStartOpen ? "#f97316" : "#2563eb"}
                strokeWidth={isStartOpen ? 2 : 3}
                className="cursor-pointer"
              />,
              <circle
                key={`line-end-${index}`}
                cx={toSvgX(end)}
                cy={centerY}
                r={isEndOpen ? 6 : 8}
                fill={isEndOpen ? "white" : "#2563eb"}
                stroke={isEndOpen ? "#f97316" : "#2563eb"}
                strokeWidth={isEndOpen ? 2 : 3}
                className="cursor-pointer"
              />,
            ];
          })}
        </svg>
        <div className="absolute top-0 right-0 p-2 text-sm text-gray-500">
          Click to place points, click points to connect, click endpoints to
          toggle open/closed
        </div>
      </div>

      {/* Current elements section */}
      <div className="mb-6 bg-gray-50 p-4 rounded-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Current Elements:
        </h3>
        {points.length === 0 && lines.length === 0 ? (
          <p className="text-gray-600">No elements drawn yet.</p>
        ) : (
          <ul className="list-disc pl-5 text-gray-700">
            {points.map((point, i) => (
              <li
                key={i}
                className={
                  selectedPoints.includes(point)
                    ? "font-bold text-orange-500"
                    : ""
                }
              >
                Point at {point}{" "}
                {selectedPoints.includes(point) ? "(selected)" : ""}
              </li>
            ))}
            {lines.map((line, i) => (
              <li key={`line-${i}`}>
                Line from {line[0]} to {line[1]}
                {endpointTypes[`${i}-start`]
                  ? " (open start)"
                  : " (closed start)"}
                {endpointTypes[`${i}-end`] ? " (open end)" : " (closed end)"}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Progress stats section */}
      <div className="mb-6 bg-gray-50 p-4 rounded-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Progress Stats
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-gray-700">Attempts:</h4>
            <ul className="list-disc pl-5">
              {attempts.map((attempt, i) => (
                <li
                  key={i}
                  className={i === currentQuestionIndex ? "font-bold" : ""}
                >
                  Q{i + 1}: {attempt} attempt(s)
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-700">Correct Answers:</h4>
            <ul className="list-disc pl-5">
              {correctAnswers.map((correct, i) => (
                <li
                  key={i}
                  className={i === currentQuestionIndex ? "font-bold" : ""}
                >
                  Q{i + 1}: {correct} correct
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Reset modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Confirm Reset</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to clear the number line?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmReset}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveNumberLine;
