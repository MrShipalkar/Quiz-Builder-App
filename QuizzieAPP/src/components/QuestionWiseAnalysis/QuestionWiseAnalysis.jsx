import React from 'react';
import './QuestionWiseAnalysis.css';
import line from '../../assets/line.png'

function QuestionWiseAnalysis({ quiz }) {
  return (
    <div className="questionwise-container">
      <main className="questionwise-main-content">
        <div className='questionwise-header'>
          <h2>{quiz.quizName} Question Analysis</h2>
          <div>
          <p>
  Created on:{" "}
  {new Date(quiz.createdOn).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })}
</p>
            <p>Impressions: {quiz.impressions}</p>
          </div>
        </div>

<div  className="questionwise-question">

{quiz.questions.map((question, index) => (
          <div key={index} className="questionwise-question-block">
            <h3>{`Q${index + 1}. ${question.question}`}</h3>
            {quiz.quizType === 'Q & A' ? (
              <div className="questionwise-stats">
                <div className="questionwise-stat-box"><p>{question.impressions}</p> people Attempted the question</div>
                <div className="questionwise-stat-box"><p>{question.correctAnswers}</p> people Answered Correctly</div>
                <div className="questionwise-stat-box"><p>{question.impressions - question.correctAnswers}</p> people Answered Incorrectly</div>
              </div>

            ) : (
              <div className="questionwise-stats">
                {question.options.map((option, oIndex) => (
                  <div key={oIndex} className="questionwise-stat-box-poll">
                    <p>{option.choosen}</p> {option.text || option.url}
                  </div>
                ))}
              </div>
            )}
            <img src={line} alt="" />
          </div>
        ))}
</div>
        
      </main>
    </div>
  );
}

export default QuestionWiseAnalysis;
