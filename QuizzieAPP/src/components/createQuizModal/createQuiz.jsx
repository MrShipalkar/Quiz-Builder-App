import React, { useState } from 'react';
import './CreateQuiz.css';
import AddQuestion from '../addQuestionModal/addQuestion.jsx';
import { toast,ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CreateQuiz({ onClose, onQuizCreated }) {
    const [quizName, setQuizName] = useState('');
    const [quizType, setQuizType] = useState('');
    const [showQuestionModal, setShowQuestionModal] = useState(false);

    const handleContinue = () => {
        if (quizName.trim() === '' || quizType === '') {
            toast.error('Please fill out both quiz name and type.');
            return;
        }
        setShowQuestionModal(true);
    };

    return (
        <div>
            <ToastContainer/>
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
                    <div className="create-quiz-overlay"></div>
                    <div className="create-quiz-modal create-quiz-open">
                        <div className="create-quiz-modal-content1">
                            <input
                                type="text"
                                placeholder="Quiz name"
                                value={quizName}
                                onChange={(e) => setQuizName(e.target.value)}
                            />
                            <div className="create-quiz-quiz-type-selection">
                                <p>Quiz Type</p>
                                <button
                                    className={quizType === 'Q & A' ? 'create-quiz-active' : ''}
                                    onClick={() => setQuizType('Q & A')}
                                >
                                    Q & A
                                </button>
                                <button
                                    className={quizType === 'Poll' ? 'create-quiz-active' : ''}
                                    onClick={() => setQuizType('Poll')}
                                >
                                    Poll Type
                                </button>
                            </div>
                            <div className="create-quiz-modal-actions">
                                <button className="create-quiz-cancel-btn" onClick={onClose}>
                                    Cancel
                                </button>
                                <button className="create-quiz-continue-btn" onClick={handleContinue}>
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
