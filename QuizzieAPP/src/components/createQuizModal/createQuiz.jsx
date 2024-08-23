import React, { useState } from 'react';
import './CreateQuiz.css';
import AddQuestion from '../addQuestionModal/addQuestion.jsx'


function CreateQuiz({ onClose, onQuizCreated }) {
    const [quizName, setQuizName] = useState('');
    const [quizType, setQuizType] = useState('');
    const [showQuestionModal, setShowQuestionModal] = useState(false);

    const handleContinue = () => {
        if (quizName.trim() === '' || quizType === '') {
            alert('Please fill out both quiz name and type.');
            return;
        }
        // Open the question modal instead of submitting the quiz immediately
        setShowQuestionModal(true);
    };

    return (
        <div>
            {showQuestionModal && (
                <AddQuestion 
                    quizName={quizName}
                    quizType={quizType}
                    onClose={onClose}
                    onQuizCreated={onQuizCreated}
                />
            )}
            {!showQuestionModal && (
                <div>
                    <div className="overlay"></div>
                    <div className="modal open">
                        <div className="modal-content">
                            <input
                                type="text"
                                placeholder="Quiz name"
                                value={quizName}
                                onChange={(e) => setQuizName(e.target.value)}
                            />
                            <div className="quiz-type-selection">
                                <p>Quiz Type</p>
                                <button
                                    className={quizType === 'Q & A' ? 'active' : ''}
                                    onClick={() => setQuizType('Q & A')}
                                >
                                    Q & A
                                </button>
                                <button
                                    className={quizType === 'Poll' ? 'active' : ''}
                                    onClick={() => setQuizType('Poll')}
                                >
                                    Poll Type
                                </button>
                            </div>
                            <div className="modal-actions">
                                <button className="cancel-btn" onClick={onClose}>
                                    Cancel
                                </button>
                                <button className="continue-btn" onClick={handleContinue}>
                                    Continue
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CreateQuiz;
