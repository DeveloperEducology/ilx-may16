import React, { useState } from "react";

const TableQn = () => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const correctAnswer = 40;

  const questionData = {
    bagsToSweatshirts: [
      { bags: 1, sweatshirts: 10 },
      { bags: 2, sweatshirts: 20 },
      { bags: 3, sweatshirts: 30 },
      { bags: 4, sweatshirts: "?" },
    ],
    options: [10, 31, 40, 20],
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  return (
    <div style={{ fontFamily: "Arial", padding: 20, maxWidth: 500 }}>
      <p>🗣️ Each shopping bag has 10 sweatshirts.</p>
      <p>🗣️ How many sweatshirts are in 4 shopping bags?</p>

      <table
        border="1"
        cellPadding="10"
        style={{ width: "100%", marginBottom: 20 }}
      >
        <thead>
          <tr>
            <th>🛍️ Number of shopping bags</th>
            <th>🧥 Number of sweatshirts</th>
          </tr>
        </thead>
        <tbody>
          {questionData.bagsToSweatshirts.map((row, index) => (
            <tr key={index}>
              <td>{row.bags}</td>
              <td>{row.sweatshirts}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        {questionData.options.map((option, index) => (
          <button
            key={index}
            onClick={() => setSelectedAnswer(option)}
            style={{
              padding: 10,
              border: "2px solid lightblue",
              backgroundColor: selectedAnswer === option ? "#d0f0fd" : "white",
              cursor: "pointer",
            }}
          >
            {option}
          </button>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        style={{
          padding: "10px 20px",
          backgroundColor: "#6cbd47",
          color: "white",
          border: "none",
          borderRadius: 5,
          cursor: "pointer",
        }}
      >
        Submit
      </button>

      {isSubmitted && (
        <div style={{ marginTop: 20 }}>
          {selectedAnswer === correctAnswer ? (
            <p style={{ color: "green" }}>✅ Correct!</p>
          ) : (
            <p style={{ color: "red" }}>
              ❌ Incorrect. The correct answer is {correctAnswer}.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default TableQn;
