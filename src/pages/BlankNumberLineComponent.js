import React, { useState } from "react";

function BlankNumberLineComponent({ classId, subjectId, question, onSubmit }) {
  const [answers, setAnswers] = useState(
    Array(question.numberLine.filter((num) => num === null).length).fill("")
  );
  const [feedback, setFeedback] = useState("");
  const [isReading, setIsReading] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  // Text-to-speech functionality
  const readAloud = (text) => {
    if ("speechSynthesis" in window && !isReading) {
      setIsReading(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsReading(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Handle input change for number line
  const handleInputChange = (value, index) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  // Handle submission
  const handleSubmit = () => {
    const userAnswers = answers.map((ans) => parseInt(ans, 10));
    if (userAnswers.some(isNaN)) {
      setFeedback("Please enter valid numbers in all fields!");
      setShowFeedback(false); // Keep question visible for validation errors
      return;
    }

    const isCorrect = userAnswers.every(
      (ans, i) => ans === question.expectedAnswer[i]
    );

    if (isCorrect) {
      setFeedback("Correct! Great job!");
      setShowFeedback(true); // Hide question and show feedback
    } else {
      setFeedback(
        `Wrong! The correct answers are ${question.expectedAnswer.join(", ")}.`
      );
      setShowFeedback(false); // Keep question visible for incorrect answers
    }

    setTimeout(() => {
      onSubmit(isCorrect);
      setAnswers(
        Array(question.numberLine.filter((num) => num === null).length).fill("")
      );
      setFeedback("");
      setShowFeedback(false); // Reset to show next question
    }, 1500);
  };

  return (
    <div className="flex flex-col w-full animate-fade-in">
      {showFeedback ? (
        // Show only feedback when answer is correct
        <div className="mt-4 sm:mt-6 text-center text-sm sm:text-lg font-semibold text-green-600 animate-bounce">
          {feedback}
        </div>
      ) : (
        // Show question, number line, images, and submit button when not showing feedback
        <>
          {/* Question Text */}
          <div className="text-blue-600 text-base sm:text-lg mb-4 sm:mb-6 flex">
            <button
              onClick={() => readAloud(question.question)}
              className="mr-2 text-lg sm:text-xl text-yellow-500 hover:text-yellow-700 transition duration-200"
            >
              🔊
            </button>
            <span>{question.question}</span>
          </div>

          {/* Number Line */}
          <div className="flex flex-wrap gap-2 sm:gap-4 mb-6 sm:mb-6 text-sm sm:text-base">
            {question.numberLine.map((num, index) => (
              <div key={index} className="flex items-center">
                {num === null ? (
                  <input
                    type="number"
                    value={
                      answers[
                        question.numberLine
                          .slice(0, index)
                          .filter((n) => n === null).length
                      ]
                    }
                    onChange={(e) =>
                      handleInputChange(
                        e.target.value,
                        question.numberLine
                          .slice(0, index)
                          .filter((n) => n === null).length
                      )
                    }
                    className="w-10 sm:w-14 p-1 sm:p-2 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                    placeholder=" "
                  />
                ) : (
                  <span className="w-10 sm:w-2x">{num}</span>
                )}
                {index < question.numberLine.length - 1 && (
                  <div className="w-8 sm:w-12 border-t border-gray-400"></div>
                )}
              </div>
            ))}
          </div>

          {/* Images */}
          <div className="flex flex-wrap justify-center gap-8 mb-10">
            {question?.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Image ${index + 1}`}
                className="w-40 h-40 object-contain rounded-xl shadow-lg hover:shadow-xl transition duration-300"
              />
            ))}
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white w-25 item-center px-6 sm:px-8 py-2 sm:py-3 rounded-lg hover:bg-green-600 transition duration-200 text-sm sm:text-base font-medium shadow-md hover:shadow-lg"
          >
            Submit
          </button>

          {/* Feedback for incorrect answers or validation errors */}
          {feedback && (
            <div className="mt-4 sm:mt-6 text-center text-sm sm:text-lg font-semibold text-green-600 animate-bounce">
              {feedback}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default BlankNumberLineComponent;
