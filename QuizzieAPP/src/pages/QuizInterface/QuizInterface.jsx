import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './QuizInterface.css';
import Result from '../../assets/Result.png';

function QuizInterface() {
    const { quizId } = useParams();
    const [quizData, setQuizData] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [timer, setTimer] = useState(null);
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        const fetchQuizData = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/quiz/getQuiz/${quizId}`);
                setQuizData(response.data.data);
            } catch (error) {
                console.error('Error fetching quiz data:', error);
            }
        };
        fetchQuizData();
    }, [quizId]);

    useEffect(() => {
        if (quizData && quizData.questions[currentQuestionIndex]?.timer > 0) {
            setTimer(quizData.questions[currentQuestionIndex].timer);
        } else {
            setTimer(null);
        }
    }, [quizData, currentQuestionIndex]);

    useEffect(() => {
        if (timer > 0) {
            const timerInterval = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
            return () => clearInterval(timerInterval);
        } else if (timer === 0) {
            handleNextQuestion();
        }
    }, [timer]);

    const handleOptionSelect = async (optionIndex) => {
        setSelectedOption(optionIndex);
        // await updateChosenOption(currentQuestionIndex, optionIndex);
    };

    const handleNextQuestion = async () => {
        const currentQuestion = quizData.questions[currentQuestionIndex];
    
        console.log('Sending request to update chosen option:', { quizId, questionIndex: currentQuestionIndex, optionIndex: selectedOption });
        
        axios.post(
            'http://localhost:3001/api/quiz/updateChosenOption',
            { quizId, questionIndex: currentQuestionIndex, optionIndex: selectedOption },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            }
        ).catch(error => {
            console.error('Error updating chosen option:', error);
        });
    
        // If the correct option was selected, update the correct answers count
        if (currentQuestion.correctOption === selectedOption) {
            await updateCorrectAnswers(currentQuestionIndex);
        }
    
        // Move to the next question or show results
        if (currentQuestionIndex < quizData.questions.length - 1) {
            setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
            setSelectedOption(null);
    
            // Reset timer if applicable
            if (quizData.questions[currentQuestionIndex + 1]?.timer > 0) {
                setTimer(quizData.questions[currentQuestionIndex + 1].timer);
            } else {
                setTimer(null);
            }
        } else {
            setShowResults(true);
        }
    };
    

    const updateCorrectAnswers = async (questionIndex) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                'http://localhost:3001/api/quiz/updateCorrectAnswers',
                { quizId, questionIndex },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
        } catch (error) {
            console.error('Error updating correct answers:', error);
        }
    };

    const updateChosenOption = async (questionIndex, optionIndex) => {
        try {
            await axios.post(
                'http://localhost:3001/api/quiz/updateChosenOption',
                { quizId, questionIndex, optionIndex }
            );
        } catch (error) {
            console.error('Error updating chosen option:', error);
        }
    };

    const handleImageError = (event) => {
        console.error("Error loading image:", event.target.src);
        event.target.src = "https://via.placeholder.com/320x112";
    };

    if (!quizData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="quiz-interface">
            <div className='quiz-box'>
                {!showResults ? (
                    <>
                        <div className="quiz-header">
                            <div>{`${currentQuestionIndex + 1}/${quizData.questions.length}`}</div>
                            {timer !== null && (
                                <div className="timer">{`00:${timer < 10 ? `0${timer}` : timer}s`}</div>
                            )}
                        </div>
                        <div className="question-text">
                            {quizData.questions[currentQuestionIndex].question}
                        </div>
                        <div className="options-container">
                            {quizData.questions[currentQuestionIndex].options.map((option, index) => (
                                <div
                                    key={index}
                                    className={`option ${selectedOption === index ? 'selected' : ''}`}
                                    onClick={() => handleOptionSelect(index)}
                                >
                                    {option.text && <p>{option.text}</p>}  
                                    {option.url && (
                                        <img 
                                            src={option.url} 
                                            alt="option"
                                            className="option-image"
                                            onError={handleImageError}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                        <button onClick={handleNextQuestion}>
                            {currentQuestionIndex === quizData.questions.length - 1 ? 'Submit' : 'Next'}
                        </button>
                    </>
                ) : (
                    <div className="results-container">
                        {quizData.quizType === "Q & A" ? (
                            <>
                                <h2 className='QA-msg'>Congrats Quiz is completed</h2>
                                <img src={Result} alt="Result" />
                                <span>Your Score is &nbsp;
                                    <p className='score'>
                                        {quizData.questions.reduce((acc, q) => (
                                            acc + (q.correctOption === selectedOption ? 1 : 0)
                                        ), 0)}/{quizData.questions.length}
                                    </p>
                                </span>
                            </>
                        ) : (
                            <h2 className='poll-msg'>Thank you for participating in the Poll</h2>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default QuizInterface;
