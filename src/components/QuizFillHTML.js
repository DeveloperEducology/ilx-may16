import React, { useState } from 'react';

const QuizFillHTML = ({ questionData }) => {
  const [answer, setAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);

  const handleSubmit = () => {
    const correct = questionData.correctAnswer.includes(Number(answer));
    setIsCorrect(correct);
  };

  return (
    <div>
      {/* Render the question based on its type */}
      {questionData.question.map((q, index) => (
        <div key={index}>
          {q.type === 'html' ? (
            <div
              dangerouslySetInnerHTML={{ __html: q.content }}
              style={{ marginBottom: 10 }}
            />
          ) : (
            <p>{q.content}</p>
          )}
        </div>
      ))}

      <input
        type="number"
        placeholder="Your answer"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        style={{ marginRight: 10 }}
      />

      <button onClick={handleSubmit}>Submit</button>

      {isCorrect !== null && (
        <div style={{ marginTop: 10 }}>
          {isCorrect ? (
            <span style={{ color: 'green' }}>Correct!</span>
          ) : (
            <span style={{ color: 'red' }}>Incorrect. Try again.</span>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizFillHTML;
