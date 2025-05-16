import React from "react";

const BlankForm = ({ numberLine = [], expectedAnswer, images, onChange }) => {
  // Ensure we always work with an array of strings for inputs
  const safeNumberLine =
    Array.isArray(numberLine) && numberLine.length > 0
      ? numberLine.map((v) => (v == null ? "" : v.toString()))
      : [""];

  // Helper function to process numberLine: replace empty strings with null
  const processNumberLine = (arr) => arr.map((v) => (v === "" ? null : v));

  const addNumberPoint = () => {
    const updated = [...safeNumberLine, ""];
    onChange({ numberLine: processNumberLine(updated) });
  };

  const removeNumberPoint = (index) => {
    const updated = safeNumberLine.filter((_, i) => i !== index);
    const final = updated.length > 0 ? updated : [""];
    onChange({ numberLine: processNumberLine(final) });
  };

  const updateNumberPoint = (index, value) => {
    const updated = [...safeNumberLine];
    updated[index] = value;
    onChange({ numberLine: processNumberLine(updated) });
  };

  const handleExpectedAnswerChange = (e) => {
    onChange({ expectedAnswer: e.target.value });
  };

  return (
    <div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Number Line
        </label>
        {safeNumberLine.map((point, idx) => (
          <div key={idx} className="flex items-center mb-2">
            <input
              type="text"
              value={point}
              onChange={(e) => updateNumberPoint(idx, e.target.value)}
              className="flex-grow px-3 py-2 border border-gray-300 rounded-md"
              placeholder={`Point ${idx + 1}`}
              //   required
            />
            {safeNumberLine.length > 1 && (
              <button
                type="button"
                onClick={() => removeNumberPoint(idx)}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addNumberPoint}
          className="text-blue-500 hover:text-blue-700"
        >
          + Add Point
        </button>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Expected Answer
        </label>
        <input
          type="text"
          value={expectedAnswer}
          onChange={handleExpectedAnswerChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Enter expected answer"
          required
        />
      </div>
    </div>
  );
};

export default BlankForm;
