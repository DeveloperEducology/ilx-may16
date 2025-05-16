import React, { useState, useEffect } from "react";

function MathInputComponent({ onChange }) {
  const [inputValue, setInputValue] = useState("");

  const handleInsertSymbol = (symbol) => {
    setInputValue((prev) => prev + symbol);
    onChange(inputValue + symbol); // Notify parent of change
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    onChange(e.target.value); // Notify parent of change
  };

  return (
    <div className="flex items-center space-x-2">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        className="w-64 p-2 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Enter your answer"
      />
      <div className="flex space-x-2">
        <button
          onClick={() => handleInsertSymbol("i")}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          i
        </button>
        <button
          onClick={() => handleInsertSymbol("√")}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          √
        </button>
      </div>
    </div>
  );
}

export default MathInputComponent;
