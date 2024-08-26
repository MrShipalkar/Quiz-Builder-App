import React, { useState, useEffect } from 'react';
import './addQuestion.css';
import deleteOption from '../../assets/deleteOption.png';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import QuizSuccess from '../QuizSucess/QuizSucess';

function AddQuestionsModal({ quizName, quizType, onClose, questionsToEdit }) {
    const [questions, setQuestions] = useState(
        questionsToEdit || [{ text: '', options: [{ text: '', url: '' }, { text: '', url: '' }], correctOption: null, timer: 0, optionType: 'Text' }]
    );
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [questionPlaceholder, setQuestionPlaceholder] = useState('');
    const [quizLink, setQuizLink] = useState(null);

    useEffect(() => {
        if (quizType === 'Q & A') {
            setQuestionPlaceholder('Q&A Question');
        } else if (quizType === 'Poll') {
            setQuestionPlaceholder('Poll Question');
        }
    }, [quizType]);

    const handleAddQuestion = () => {
        const currentQuestion = questions[currentQuestionIndex];
        if (currentQuestion.text.trim() === '' || currentQuestion.options.some(option => option.text.trim() === '' && option.url.trim() === '')) {
            toast.error('Please fill out the current question before adding a new one.');
            return;
        }

        if (questions.length < 5) {
            setQuestions([...questions, { text: '', options: [{ text: '', url: '' }, { text: '', url: '' }], correctOption: null, timer: 0, optionType: 'Text' }]);
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handleQuestionChange = (value) => {
        const newQuestions = [...questions];
        newQuestions[currentQuestionIndex].text = value;
        setQuestions(newQuestions);
    };

    const handleOptionChange = (oIndex, field, value) => {
        const newQuestions = [...questions];
        newQuestions[currentQuestionIndex].options[oIndex] = {
            ...newQuestions[currentQuestionIndex].options[oIndex],
            [field]: value,
        };
        setQuestions(newQuestions);
    };

    const handleOptionTypeChange = (value) => {
        const newQuestions = [...questions];
        newQuestions[currentQuestionIndex].optionType = value;
        setQuestions(newQuestions);
    };

    const handleTimerChange = (value) => {
        const newQuestions = [...questions];
        newQuestions[currentQuestionIndex].timer = value;
        setQuestions(newQuestions);
    };

    const handleRemoveOption = (oIndex) => {
        const newQuestions = [...questions];
        newQuestions[currentQuestionIndex].options.splice(oIndex, 1);
        if (newQuestions[currentQuestionIndex].correctOption === oIndex) {
            newQuestions[currentQuestionIndex].correctOption = null;
        }
        setQuestions(newQuestions);
    };

    const handleCorrectOptionChange = (oIndex) => {
        const newQuestions = [...questions];
        newQuestions[currentQuestionIndex].correctOption = oIndex;
        setQuestions(newQuestions);
    };

    const handleRemoveQuestion = (qIndex) => {
        if (questions.length > 1) {
            const newQuestions = questions.filter((_, index) => index !== qIndex);
            setQuestions(newQuestions);
            setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1));
        }
    };

    const handleSubmitQuiz = async () => {
        for (const question of questions) {
            if (question.text.trim() === "") {
                toast.error("Please enter a valid question");
                return;
            }
            for (const option of question.options) {
                if (question.optionType === "Text" && option.text.trim() === "") {
                    toast.error("Please enter a valid text option");
                    return;
                }
                if (question.optionType === "Image URL" && option.url.trim() === "") {
                    toast.error("Please enter a valid image URL");
                    return;
                }
                if (question.optionType === "Text & Image URL" && (option.text.trim() === "" || option.url.trim() === "")) {
                    toast.error("Please enter both text and image URL");
                    return;
                }
            }
            if (question.correctOption === null && quizType === "Q & A") {
                toast.error("Please select a correct option");
                return;
            }
        }

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("No token found");
                return;
            }

            const quizData = {
                quizName,
                quizType,
                questions: questions.map((question) => ({
                    question: question.text,
                    optionType: question.optionType,
                    timer: question.timer,
                    options: question.options.map((option) => {
                        return {
                            text: question.optionType === "Image URL" ? "" : option.text,
                            url: question.optionType === "Text" ? "" : option.url,
                            choosen: 0,
                        };
                    }),
                    correctOption: question.correctOption,
                })),
            };

            const response = await axios.post(
                "http://localhost:3001/api/quiz/createQuiz",
                quizData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                const baseUrl = window.location.origin;
                const quizLink = `${baseUrl}/quiz/${response.data.data._id}`;
                toast.success("Quiz created successfully!");
                setQuizLink(quizLink);
            } else {
                toast.error(`Unexpected status code: ${response.status}`);
            }
        } catch (err) {
            console.error("Error creating quiz:", err);
            if (err.response && err.response.status === 400) {
                console.error('Backend error response:', err.response.data);
            }
            if (err.response && err.response.status !== 200) {
                toast.error("Failed to create quiz. Please try again.");
            }
        }
    };

    const handleQuizSuccessClose = () => {
        onClose();
        window.location.reload();
    };

    return (
        <div className="addque-modal-open">
            {quizLink ? (
                <QuizSuccess quizLink={quizLink} onClose={handleQuizSuccessClose} />
            ) : (
                <>
                    <div className="addque-overlay" />
                    <div className="addque-modal-content">
                        <div className="addque-modal-header">
                            <div className="addque-question-nav">
                                {questions.map((_, index) => (
                                    <div key={index} className="addque-question-nav-item">
                                        <button
                                            className={`addque-question-nav-btn ${index === currentQuestionIndex ? 'active' : ''}`}
                                            onClick={() => setCurrentQuestionIndex(index)}
                                        >
                                            {index + 1}
                                        </button>
                                        {questions.length > 1 && (
                                            <button
                                                className="addque-remove-question-btn"
                                                onClick={() => handleRemoveQuestion(index)}
                                            >
                                                ✖
                                            </button>
                                        )}
                                    </div>
                                ))}
                                {questions.length < 5 && (
                                    <button className="addque-add-question-btn" onClick={handleAddQuestion}>+</button>
                                )}
                            </div>
                            <p>Max 5 questions</p>
                        </div>
                        <div className="addque-question-block">
                            <input
                                type="text"
                                placeholder={questionPlaceholder}
                                value={questions[currentQuestionIndex].text}
                                onChange={(e) => handleQuestionChange(e.target.value)}
                            />
                            <div className="addque-option-type-selection">
                                <p>Option Type</p>
                                <label>
                                    <input
                                        type="radio"
                                        value="Text"
                                        checked={questions[currentQuestionIndex].optionType === 'Text'}
                                        onChange={(e) => handleOptionTypeChange(e.target.value)}
                                    />
                                    Text
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        value="Image URL"
                                        checked={questions[currentQuestionIndex].optionType === 'Image URL'}
                                        onChange={(e) => handleOptionTypeChange(e.target.value)}
                                    />
                                    Image URL
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        value="Text & Image URL"
                                        checked={questions[currentQuestionIndex].optionType === 'Text & Image URL'}
                                        onChange={(e) => handleOptionTypeChange(e.target.value)}
                                    />
                                    Text & Image URL
                                </label>
                            </div>

                            <div className="addque-option-timer-wrapper">
                                <div className="addque-options-wrapper">
                                    {questions[currentQuestionIndex].optionType === 'Text & Image URL' && (
                                        questions[currentQuestionIndex].options.map((option, oIndex) => (
                                            <div
                                                key={oIndex}
                                                className={`addque-option-block ${questions[currentQuestionIndex].correctOption === oIndex ? 'addque-correct-option' : ''}`}
                                            >
                                                <input
                                                    type="radio"
                                                    name={`correctOption-${currentQuestionIndex}`}
                                                    checked={questions[currentQuestionIndex].correctOption === oIndex}
                                                    onChange={() => handleCorrectOptionChange(oIndex)}
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Text"
                                                    value={option.text}
                                                    onChange={(e) => handleOptionChange(oIndex, 'text', e.target.value)}
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Image URL"
                                                    value={option.url}
                                                    onChange={(e) => handleOptionChange(oIndex, 'url', e.target.value)}
                                                />
                                                {questions[currentQuestionIndex].options.length > 2 && (
                                                    <button className="addque-remove-option-btn" onClick={() => handleRemoveOption(oIndex)}><img src={deleteOption} alt="delete" /></button>
                                                )}
                                            </div>
                                        ))
                                    )}

                                    {questions[currentQuestionIndex].optionType !== 'Text & Image URL' && (
                                        questions[currentQuestionIndex].options.map((option, oIndex) => (
                                            <div
                                                key={oIndex}
                                                className={`addque-option-block ${questions[currentQuestionIndex].correctOption === oIndex ? 'addque-correct-option' : ''}`}
                                            >
                                                <input
                                                    type="radio"
                                                    name={`correctOption-${currentQuestionIndex}`}
                                                    checked={questions[currentQuestionIndex].correctOption === oIndex}
                                                    onChange={() => handleCorrectOptionChange(oIndex)}
                                                />
                                                <input
                                                    type="text"
                                                    placeholder={questions[currentQuestionIndex].optionType === "Text" ? "Text" : "Image URL"}
                                                    value={questions[currentQuestionIndex].optionType === "Text" ? option.text : option.url}
                                                    onChange={(e) => handleOptionChange(oIndex, questions[currentQuestionIndex].optionType === "Text" ? "text" : "url", e.target.value)}
                                                />
                                                {questions[currentQuestionIndex].options.length > 2 && (
                                                    <button className="addque-remove-option-btn" onClick={() => handleRemoveOption(oIndex)}><img src={deleteOption} alt="delete" /></button>
                                                )}
                                            </div>
                                        ))
                                    )}

                                    {questions[currentQuestionIndex].options.length < 4 && (
                                        <button className="addque-add-option-btn" onClick={() => handleOptionChange(questions[currentQuestionIndex].options.length, questions[currentQuestionIndex].optionType === "Text" ? "text" : "url", '')}>
                                            Add Option
                                        </button>
                                    )}
                                </div>

                                {quizType !== 'Poll' && (
                                    <div className="addque-timer-block">
                                        <p>Timer</p>
                                        <button className={questions[currentQuestionIndex].timer === 0 ? 'active' : ''} onClick={() => handleTimerChange(0)}>OFF</button>
                                        <button className={questions[currentQuestionIndex].timer === 5 ? 'active' : ''} onClick={() => handleTimerChange(5)}>5 sec</button>
                                        <button className={questions[currentQuestionIndex].timer === 10 ? 'active' : ''} onClick={() => handleTimerChange(10)}>10 sec</button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="addque-modal-actions">
                            <button className="addque-cancel-btn" onClick={onClose}>
                                Cancel
                            </button>
                            <button className="addque-continue-btn" onClick={handleSubmitQuiz} disabled={isSubmitting}>
                                {isSubmitting ? 'Submitting...' : 'Create Quiz'}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default AddQuestionsModal;
