import { useState, useEffect } from "react";
import "./QuizComponent.css";
import MathQuiz from "../editor/MathQuiz";

const data = [
  // Single-Select (Vowel Example)

  {
    id: "q0",
    type: "SINGLE_SELECT",
    lessonId: "68111474a6aafb33e7aed3b8",
    prompt: `<p>
    <span style="color:#009688;">Which word rhymes <strong>float</strong></span>
</p>`,
    options: [
      {
        image:
          "https://ckbox.cloud/e9cea31874fc2c2903da/assets/18jtlj51N1cP/images/284.webp",
        test: "Boat float",
        isCorrect: true,
      },
      {
        image:
          "https://ckbox.cloud/e9cea31874fc2c2903da/assets/0u6EjKkG1bYf/images/276.webp",
        test: "boy jump",
        isCorrect: false,
      },
    ],
    feedback: {
      correct: "Correct!",
      incorrect: "Look for A, E, I, O, U.",
    },
  },
  {
    id: "q0",
    type: "SINGLE_SELECT",
    prompt:
      "Find the <strong>correct</strong> image.. Identify Telaganan cheif minister?",
    options: [
      {
        image:
          "https://hyderabadmail.com/wp-content/uploads/2024/05/Revanth-Reddy-1.jpg",
        isCorrect: true,
      },
      {
        image:
          "https://cdn.siasat.com/wp-content/uploads/2021/10/KCR-1200x-900.jpg",
        isCorrect: false,
      },
    ],
    feedback: {
      correct: "Correct!",
      incorrect: "Look for A, E, I, O, U.",
    },
  },
  {
    id: "q0",
    type: "SINGLE_SELECT",
    prompt: "<p>Find the <strong>correct</strong> senctence.</p>",
    options: [
      { text: "The boy has hair", isCorrect: true },
      { text: "The boy have hair", isCorrect: false },
    ],
    feedback: {
      correct: "Correct!",
      incorrect: "Look for A, E, I, O, U.",
    },
  },
  {
    id: "q0",
    type: "SINGLE_SELECT",
    prompt: `<p>
    Find <strong>one</strong> vowel
</p>
<p>
    <span style="font-size:22px;"><strong>Egg</strong></span>
</p>
<p>
    <picture><source srcset="https://ckbox.cloud/9c998fdc1848efb995bc/assets/Skp9yidc8rV6/images/80.webp 80w,https://ckbox.cloud/9c998fdc1848efb995bc/assets/Skp9yidc8rV6/images/160.webp 160w,https://ckbox.cloud/9c998fdc1848efb995bc/assets/Skp9yidc8rV6/images/240.webp 240w,https://ckbox.cloud/9c998fdc1848efb995bc/assets/Skp9yidc8rV6/images/320.webp 320w,https://ckbox.cloud/9c998fdc1848efb995bc/assets/Skp9yidc8rV6/images/400.webp 400w,https://ckbox.cloud/9c998fdc1848efb995bc/assets/Skp9yidc8rV6/images/480.webp 480w,https://ckbox.cloud/9c998fdc1848efb995bc/assets/Skp9yidc8rV6/images/560.webp 560w,https://ckbox.cloud/9c998fdc1848efb995bc/assets/Skp9yidc8rV6/images/612.webp 612w" sizes="(max-width: 612px) 100vw, 612px" type="image/webp"><img class="image_resized" style="width:49.8%;" src="https://ckbox.cloud/9c998fdc1848efb995bc/assets/Skp9yidc8rV6/images/612.jpeg" alt="" width="612" height="459" data-ckbox-resource-id="Skp9yidc8rV6"></picture>
</p>
<p>
    &nbsp;
</p>`,
    options: [
      { text: "c", isCorrect: false },
      { text: "u", isCorrect: true },
      { text: "p", isCorrect: false },
    ],
    feedback: {
      correct: "Correct! 'U' is a vowel.",
      incorrect: "Look for A, E, I, O, U.",
    },
  },
  {
    id: "q1",
    type: "SINGLE_SELECT",
    prompt: `<p>
    Find <strong>one</strong> vowel
</p>
<p>
    <span style="font-size:22px;"><strong>Egg</strong></span>
</p>
<p>
    &nbsp;
</p>`,
    options: [
      { text: "c", isCorrect: false },
      { text: "u", isCorrect: true },
      { text: "p", isCorrect: false },
    ],
    feedback: {
      correct: "Correct! 'U' is a vowel.",
      incorrect: "Look for A, E, I, O, U.",
    },
  },
  // Multi-Select (Math Example)
  {
    id: "q2",
    type: "MULTI_SELECT",
    prompt: "Select <b>all</b> prime numbers:",
    options: [
      { text: "2", isCorrect: true },
      { text: "4", isCorrect: false },
      { text: "7", isCorrect: true },
    ],
    feedback: {
      correct: "Nice! 2 and 7 are primes.",
      partial: "Almost! Check again.",
      incorrect: "Primes have no divisors except 1 and themselves.",
    },
  },
  // Fill-in-the-Blank (Science Example)
  {
    id: "q3",
    type: "FILL_BLANK",
    prompt: "The chemical symbol for gold is ____.",
    correctAnswer: "Au",
    feedback: {
      correct: "Yes! Au comes from 'Aurum'.",
      incorrect: "Hint: It's 'Au'.",
    },
  },
];

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

  return (
    <div className="quiz-component single-select">
      <div
        className="prompt"
        dangerouslySetInnerHTML={{ __html: data.prompt }}
      />
      <div
        className={`options-container ${
          data?.options[0].image ? "image-options" : "text-options"
        }`}
      >
        {data.options.map((option, i) => (
          <div
            key={i}
            onClick={() => !submitted && setSelected(option)}
            className={`option ${
              data.options[0].image ? "image-option" : "text-option"
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
          {selected.isCorrect ? data.feedback.correct : data.feedback.incorrect}
        </div>
      )}
    </div>
  );
};

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
              <div className="image-container">
                <img src={option.image} alt="Option" className="option-image" />
                <p className="image-label">flower pot</p>
              </div>
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

const FillBlank = ({ data, onNext }) => {
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (answer.trim()) {
      setSubmitted(true);
    }
  };

  const handleNext = (isCorrect) => {
    setAnswer("");
    setSubmitted(false);
    onNext(isCorrect);
  };

  const isCorrect = answer.trim() === data.correctAnswer;

  return (
    <div className="quiz-component fill-blank">
      <div
        className="prompt"
        dangerouslySetInnerHTML={{ __html: data.prompt }}
      />
      <div className="input-container">
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          disabled={submitted}
          className="answer-input"
          placeholder="Enter your answer"
        />
      </div>
      {!submitted ? (
        <button
          onClick={handleSubmit}
          className="action-button submit"
          disabled={!answer.trim()}
        >
          Submit
        </button>
      ) : (
        <button
          onClick={() => handleNext(isCorrect)}
          className="action-button next"
        >
          Next Question
        </button>
      )}
      {submitted && (
        <div className="feedback">
          {isCorrect ? data.feedback.correct : data.feedback.incorrect}
        </div>
      )}
    </div>
  );
};
const QuizManager = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    setQuestions(data);
  }, []);

  const handleNext = (isCorrect) => {
    if (isCorrect) setScore(score + 1);
    setCurrentIndex(currentIndex + 1);
  };

  const renderQuestion = () => {
    const question = questions[currentIndex];
    if (!question) return null;
    switch (question.type) {
      case "SINGLE_SELECT":
        return <SingleSelect data={question} onNext={handleNext} />;
      case "MULTI_SELECT":
        return <MultiSelect data={question} onNext={handleNext} />;
      case "FILL_BLANK":
        return <FillBlank data={question} onNext={handleNext} />;
      default:
        return null;
    }
  };

  return (
    <div className="quiz-container">
      {currentIndex < questions.length ? (
        renderQuestion()
      ) : (
        <div className="quiz-complete">
          Quiz Complete! Score: {score}/{questions.length}
        </div>
      )}
    </div>
  );
};

export default QuizManager;
