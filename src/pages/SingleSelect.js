import React, { useState } from "react";
import "./QuizComponent.css"; // Assuming you have a CSS file for styling

const SingleSelect = ({ data, onNext }) => {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (selected) {
      setSubmitted(true);
    }
  };

  const handleNext = (isCorrect) => {
    setSelected(null);
    setSubmitted(false);
    onNext(isCorrect);
  };

  // Ensure data and options exist, and check if any option has an image
  const hasImageOptions = data?.options?.some((option) => option.image);
  console.log("Data:", data);

  return (
    <div className="quiz-component single-select">
      <div
        className="prompt"
        dangerouslySetInnerHTML={{ __html: data?.prompt || "" }}
      />
      <div
        className={`options-container ${
          hasImageOptions ? "image-options" : "text-options"
        }`}
      >
        {data?.options?.length > 0 ? (
          data.options.map((option, i) => (
            <div
              key={i}
              onClick={() => !submitted && setSelected(option)}
              className={`option ${
                hasImageOptions ? "image-option" : "text-option"
              } ${
                submitted && option.isCorrect
                  ? "correct"
                  : submitted && selected === option && !option.isCorrect
                  ? "incorrect"
                  : selected === option
                  ? "selected"
                  : ""
              }`}
            >
              {option?.image ? (
                <img src={option.image} alt="Option" className="option-image" />
              ) : (
                <span className="option-text">{option.text}</span>
              )}
            </div>
          ))
        ) : (
          <div>No options available</div> // Fallback UI
        )}
      </div>
      {!submitted ? (
        <button
          onClick={handleSubmit}
          className="action-button submit"
          disabled={!selected}
        >
          Submit
        </button>
      ) : (
        <button
          onClick={() => handleNext(selected.isCorrect)}
          className="action-button next"
        >
          Next Question
        </button>
      )}
      {submitted && (
        <div className="feedback">
          {selected.isCorrect
            ? data?.feedback?.correct
            : data?.feedback?.incorrect}
        </div>
      )}
    </div>
  );
};

export default SingleSelect;
