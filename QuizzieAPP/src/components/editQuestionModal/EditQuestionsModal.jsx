import React, { useState, useEffect } from 'react';
import './editQuestionsModal.css';
import deleteOption from '../../assets/deleteOption.png';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function EditQuestionsModal({ quiz, onClose }) {
    const [questions, setQuestions] = useState(quiz.questions);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (quiz.questions && quiz.questions.length > 0) {
            setQuestions(quiz.questions);
        }
    }, [quiz.questions]);

    const handleQuestionChange = (value) => {
        setQuestions((prevQuestions) => {
            const updatedQuestions = [...prevQuestions];
            updatedQuestions[currentQuestionIndex] = {
                ...updatedQuestions[currentQuestionIndex],
                question: value,
            };
            return updatedQuestions;
        });
    };

    const handleOptionChange = (oIndex, field, value) => {
        const newQuestions = [...questions];
        newQuestions[currentQuestionIndex].options[oIndex] = {
            ...newQuestions[currentQuestionIndex].options[oIndex],
            [field]: value,
        };
        setQuestions(newQuestions);
    };

    const handleTimerChange = (value) => {
        const newQuestions = [...questions];
        newQuestions[currentQuestionIndex].timer = value;
        setQuestions(newQuestions);
    };

    const handleSubmitQuiz = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("No token found");
                return;
            }
    
            const quizData = {
                quizName: quiz.quizName,
                quizType: quiz.quizType,
                questions: questions.map((question) => ({
                    question: question.question,
                    optionType: question.optionType,
                    timer: question.timer,
                    options: question.options.map((option) => ({
                        text: option.text,
                        url: option.url,
                        choosen: option.choosen,
                    })),
                    correctOption: question.correctOption,
                })),
            };
    
            const response = await axios.put(
                `http://localhost:3001/api/quiz/updateQuiz/${quiz._id}`,
                quizData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
    
            if (response.status === 200) {
                toast.success("Quiz updated successfully!");
                onClose();  // Close the modal
            } else {
                toast.error(`Unexpected status code: ${response.status}`);
            }
        } catch (err) {
            console.error("Error updating quiz:", err);
            if (err.response && err.response.status !== 200) {
                toast.error("Failed to update quiz. Please try again.");
            }
        }
    };
    

    return (
        <div className="editque-modal-open">
            <div className="editque-overlay" />
            <div className="editque-modal-content">
                <div className="editque-modal-header">
                    <div className="editque-question-nav">
                        {questions.map((_, index) => (
                            <div key={index} className="editque-question-nav-item">
                                <button
                                    className={`editque-question-nav-btn ${index === currentQuestionIndex ? 'active' : ''}`}
                                    onClick={() => setCurrentQuestionIndex(index)}
                                >
                                    {index + 1}
                                </button>
                            </div>
                        ))}
                    </div>
                    <p className='editque-quizName'>Editing Quiz: {quiz.quizName}</p>
                </div>
                <div className="editque-question-block">
                    <input
                        type="text"
                        placeholder="Edit your question here"
                        value={questions[currentQuestionIndex] ? questions[currentQuestionIndex].question : ''}
                        onChange={(e) => handleQuestionChange(e.target.value)}
                    />

                    <div className="editque-option-type-selection">
                        <p>Option Type: {questions[currentQuestionIndex].optionType}</p>
                    </div>
                    <div className="editque-option-timer-wrapper">
                        <div className="editque-options-wrapper">
                            {questions[currentQuestionIndex].options.map((option, oIndex) => (
                                <div
                                    key={oIndex}
                                    className={`editque-option-block ${questions[currentQuestionIndex].correctOption === oIndex ? 'editque-correct-option' : ''}`}
                                >
                                    <input
                                        type="radio"
                                        checked={questions[currentQuestionIndex].correctOption === oIndex}
                                        readOnly
                                        disabled
                                    />
                                    {questions[currentQuestionIndex].optionType === "Text & Image URL" ? (
                                        <>
                                            <input
                                                type="text"
                                                placeholder="Text"
                                                value={option.text}
                                                onChange={(e) => handleOptionChange(oIndex, "text", e.target.value)}
                                            />
                                            <input
                                                type="text"
                                                placeholder="Image URL"
                                                value={option.url}
                                                onChange={(e) => handleOptionChange(oIndex, "url", e.target.value)}
                                            />
                                        </>
                                    ) : (
                                        <input
                                            type="text"
                                            placeholder={questions[currentQuestionIndex].optionType === "Text" ? "Text" : "Image URL"}
                                            value={questions[currentQuestionIndex].optionType === "Text" ? option.text : option.url}
                                            onChange={(e) => handleOptionChange(oIndex, questions[currentQuestionIndex].optionType === "Text" ? "text" : "url", e.target.value)}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>

                        {quiz.quizType !== 'Poll' && (
                            <div className="editque-timer-block">
                                <p>Timer</p>
                                <button className={questions[currentQuestionIndex].timer === 0 ? 'active' : ''} onClick={() => handleTimerChange(0)}>OFF</button>
                                <button className={questions[currentQuestionIndex].timer === 5 ? 'active' : ''} onClick={() => handleTimerChange(5)}>5 sec</button>
                                <button className={questions[currentQuestionIndex].timer === 10 ? 'active' : ''} onClick={() => handleTimerChange(10)}>10 sec</button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="editque-modal-actions">
                    <button className="editque-cancel-btn" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="editque-continue-btn" onClick={handleSubmitQuiz} disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Update Quiz'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EditQuestionsModal;
