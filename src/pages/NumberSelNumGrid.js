import React from "react";

function NumberGrid({ onSelect, selectedNumber, maxNumber }) {
  const numbers = Array.from({ length: maxNumber }, (_, i) => i + 1);

  return (
    <div className="grid grid-cols-5 sm:grid-cols-10 gap-1 sm:gap-2 mb-4 sm:mb-6 overflow-x-auto">
      {numbers.map((number) => (
        <button
          key={number}
          onClick={() => onSelect(number)}
          className={`w-10 h-10 sm:w-12 sm:h-12 p-2 sm:p-3 rounded-lg text-center text-sm sm:text-lg font-medium transition duration-200 ${
            selectedNumber === number
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-900 hover:bg-gray-200"
          }`}
        >
          {number}
        </button>
      ))}
    </div>
  );
}

export default NumberGrid;