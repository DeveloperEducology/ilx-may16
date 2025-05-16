import React from "react";

const MCQForm = ({
  options,
  correctOption,
  images = [], // Default to empty array
  onOptionsChange,
  onCorrectChange,
  onImagesChange = () => {}, // Default to no-op function to prevent errors
}) => {
  // Handle option updates
  const updateOption = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    onOptionsChange(newOptions);
  };

  // Add a new option
  const addOption = () => {
    onOptionsChange([...options, ""]);
  };

  // Remove an option
  const removeOption = (index) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      onOptionsChange(newOptions);
      if (correctOption >= newOptions.length) {
        onCorrectChange(0);
      }
    }
  };

  // Handle image URL updates
  const updateImage = (index, value) => {
    const newImages = [...images];
    newImages[index] = value;
    onImagesChange(newImages);
  };

  // Add a new image URL
  const addImage = () => {
    onImagesChange([...images, ""]);
  };

  // Remove an image URL
  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-6">
      {/* Options Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Options
        </label>
        {options.map((opt, idx) => (
          <div key={idx} className="flex items-center mb-2">
            <input
              type="text"
              value={opt}
              onChange={(e) => updateOption(idx, e.target.value)}
              className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={`Option ${idx + 1}`}
              required
            />
            <input
              type="radio"
              name="correctOption"
              checked={correctOption === idx}
              onChange={() => onCorrectChange(idx)}
              className="ml-2"
            />
            {options.length > 2 && (
              <button
                type="button"
                onClick={() => removeOption(idx)}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addOption}
          className="mt-2 text-blue-500 hover:text-blue-700"
        >
          + Add Option
        </button>
      </div>

      {/* Images Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Image URLs
        </label>
        {images.map((img, idx) => (
          <div key={idx} className="flex items-center mb-2">
            <input
              type="url"
              value={img}
              onChange={(e) => updateImage(idx, e.target.value)}
              className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={`Image URL ${idx + 1}`}
            />
            <button
              type="button"
              onClick={() => removeImage(idx)}
              className="ml-2 text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addImage}
          className="mt-2 text-blue-500 hover:text-blue-700"
        >
          + Add Image URL
        </button>
      </div>
    </div>
  );
};

export default MCQForm;