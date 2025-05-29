import React, { useState } from "react";
import DOMPurify from "dompurify";

const SingleSelect = ({ data, onNext }) => {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const safeData = data || {};
  const options = Array.isArray(safeData.options) ? safeData.options : [];

  const handleSubmit = () => {
    if (selected !== null) {
      setSubmitted(true);
    }
  };

  const handleNext = () => {
    setSelected(null);
    setSubmitted(false);
    onNext(selected?.isCorrect || false);
  };

  return (
    <div className="single-select-quiz">
      {/* Question prompt with HTML sanitization */}
      {safeData.prompt && (
        <div
          className="mb-4 text-lg"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(safeData.prompt),
          }}
        />
      )}

      {/* Options */}
      {options.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {options.map((option, index) => {
            const alphabet = String.fromCharCode(65 + index);
            const isSelected = selected === option;
            const showCorrect = submitted && option.isCorrect;
            const showIncorrect = submitted && isSelected && !option.isCorrect;

            const baseClasses = `
              relative border-2 rounded-lg p-4 transition-all cursor-pointer
              ${
                isSelected
                  ? "border-blue-500 ring-2 ring-blue-300"
                  : "border-gray-200"
              }
              ${showCorrect ? "border-green-500 ring-2 ring-green-300" : ""}
              ${showIncorrect ? "border-red-500 ring-2 ring-red-300" : ""}
              hover:border-blue-300
            `;

            return (
              <div
                key={index}
                onClick={() => !submitted && setSelected(option)}
                className={baseClasses}
              >
                {/* Option letter badge */}
                <div
                  className={`absolute top-2 left-2 z-10 w-8 h-8 rounded-full flex items-center justify-center font-bold
                  ${
                    showCorrect
                      ? "bg-green-500 text-white"
                      : showIncorrect
                      ? "bg-red-500 text-white"
                      : isSelected
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {alphabet}
                </div>

                {/* Option content */}
                {option.image ? (
                  <img
                    src={option.image}
                    alt={`Option ${alphabet}`}
                    className="w-full h-auto object-cover"
                  />
                ) : (
                  <div className="text-lg font-medium text-center mt-4">
                    {option.text}
                  </div>
                )}

                {/* Feedback indicator */}
                {submitted && (
                  <div
                    className={`absolute bottom-0 left-0 right-0 p-2 text-center font-bold text-white
                    ${option.isCorrect ? "bg-green-500" : "bg-red-500"}`}
                  >
                    {option.isCorrect ? "✓ Correct" : "✗ Incorrect"}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-red-500 py-4">No options available</div>
      )}

      {/* Action buttons */}
      <div className="mt-6 flex gap-4">
        {!submitted ? (
          <button
            onClick={handleSubmit}
            className={`px-6 py-2 rounded text-white font-semibold transition
              ${
                selected !== null
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            disabled={selected === null}
          >
            Submit
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-6 py-2 rounded bg-blue-500 text-white font-semibold hover:bg-blue-600 transition"
          >
            Next Question
          </button>
        )}
      </div>

      {/* Text feedback */}
      {submitted && (
        <div
          className={`mt-4 p-3 rounded-lg text-lg
          ${
            selected?.isCorrect
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {selected?.isCorrect
            ? safeData.feedback?.correct || "✅ Correct answer!"
            : safeData.feedback?.incorrect || "❌ Incorrect, please try again."}
        </div>
      )}
    </div>
  );
};

export default SingleSelect;
