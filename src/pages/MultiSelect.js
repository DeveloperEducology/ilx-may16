import { useState } from "react";

const MultiSelect = ({ data, onNext }) => {
  const [selected, setSelected] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const toggleOption = (option) => {
    if (selected.includes(option)) {
      setSelected(selected.filter((item) => item !== option));
    } else {
      setSelected([...selected, option]);
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const handleNext = (isCorrect) => {
    setSelected([]);
    setSubmitted(false);
    onNext(isCorrect);
  };

  const correctOptions = data.options.filter((opt) => opt.isCorrect);
  const isFullyCorrect =
    selected.length === correctOptions.length &&
    selected.every((opt) => opt.isCorrect);

  return (
    <div className="quiz-component multi-select">
      <div
        className="prompt"
        dangerouslySetInnerHTML={{ __html: data.prompt }}
      />
      <div
        className={`options-container ${
          data.options[0].image ? "image-options" : "text-options"
        }`}
      >
        {data.options.map((option, i) => (
          <div
            key={i}
            onClick={() => !submitted && toggleOption(option)}
            className={`option ${
              data.options[0].image ? "image-option" : "text-option"
            } ${
              submitted && option.isCorrect
                ? "correct"
                : submitted && selected.includes(option) && !option.isCorrect
                ? "incorrect"
                : selected.includes(option)
                ? "selected"
                : ""
            }`}
          >
            {option.image ? (
              <img src={option.image} alt="Option" className="option-image" />
            ) : (
              <span className="option-text">{option.text}</span>
            )}
          </div>
        ))}
      </div>
      {!submitted ? (
        <button
          onClick={handleSubmit}
          className="action-button submit"
          disabled={selected.length === 0}
        >
          Submit
        </button>
      ) : (
        <button
          onClick={() => handleNext(isFullyCorrect)}
          className="action-button next"
        >
          Next Question
        </button>
      )}
      {submitted && (
        <div className="feedback">
          {isFullyCorrect
            ? data.feedback.correct
            : selected.some((opt) => opt.isCorrect)
            ? data.feedback.partial
            : data.feedback.incorrect}
        </div>
      )}
    </div>
  );
};

export default MultiSelect;