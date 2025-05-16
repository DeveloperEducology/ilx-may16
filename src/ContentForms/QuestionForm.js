import React, { useState } from "react";
import MCQForm from "./MCQForm";
import BlankForm from "./BlankForm";

const QuestionForm = () => {
  const [formData, setFormData] = useState({
    questionType: "mcq",
    question: "",
    category: "",
    difficulty: "easy",
    options: ["", "", "", ""],
    correctOption: 0,
    numberLine: [""],
    expectedAnswer: "",
    images: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOptionChange = (options) => {
    setFormData((prev) => ({
      ...prev,
      options,
    }));
  };

  const handleCorrectOptionChange = (index) => {
    setFormData((prev) => ({
      ...prev,
      correctOption: index,
    }));
  };

  const handleImagesChange = (images) => {
    setFormData((prev) => ({
      ...prev,
      images,
    }));
  };

  const handleBlankFormChange = (updates) => {
    setFormData((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Process numberLine for blank questions to include null for empty strings
    const processedData = {
      ...formData,
      ...(formData.questionType === "blank" && {
        numberLine: formData.numberLine.map((v) => (v === "" ? null : v)),
      }),
    };
    console.log("Submitted:", processedData);
    // Reset
    setFormData({
      questionType: "mcq",
      question: "",
      category: "",
      difficulty: "easy",
      options: ["", "", "", ""],
      correctOption: 0,
      numberLine: [""],
      expectedAnswer: "",
      images: [],
    });
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Add New Question
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Question Type
          </label>
          <select
            name="questionType"
            value={formData.questionType}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="mcq">Multiple Choice</option>
            <option value="blank">Fill in the Blank</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Question
          </label>
          <textarea
            name="question"
            value={formData.question}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            placeholder="Enter question"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter category"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Difficulty
          </label>
          <select
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {/* Conditional Rendering of Sub-Forms */}
        {formData.questionType === "mcq" ? (
          <MCQForm
            options={formData.options}
            correctOption={formData.correctOption}
            images={formData.images}
            onOptionsChange={handleOptionChange}
            onCorrectChange={handleCorrectOptionChange}
            onImagesChange={handleImagesChange}
          />
        ) : (
          <BlankForm
            numberLine={formData.numberLine}
            expectedAnswer={formData.expectedAnswer}
            images={formData.images}
            onChange={handleBlankFormChange}
          />
        )}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Submit Question
        </button>
      </form>
    </div>
  );
};

export default QuestionForm;
