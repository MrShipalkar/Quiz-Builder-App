import React, { useState, useEffect } from 'react';
import './Analytics.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import editIcon from '../../assets/editIcon.png'; // Add the correct path for icons
import deleteOption from '../../assets/deleteOption.png';
import shareIcon from '../../assets/shareIcon.png';

const formatImpressions = (impressions) => {
  if (impressions >= 1000) {
    return (impressions / 1000).toFixed(1) + 'k';
  }
  return impressions.toString();
};

function Analytics() {
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error("No token found");
        }

        const response = await axios.get('http://localhost:3001/api/quiz/getQuizzesByUserId/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setQuizzes(response.data.quizzes);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      }
    };

    fetchQuizzes();
  }, []);

  const handleEditQuiz = (quizId) => {
    navigate(`/editQuiz/${quizId}`);
  };

  const handleDeleteQuiz = async (quizId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("No token found");
      }

      await axios.delete(`http://localhost:3001/api/quiz/deleteQuiz/${quizId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setQuizzes(quizzes.filter((quiz) => quiz._id !== quizId));
    } catch (error) {
      console.error('Error deleting quiz:', error);
    }
  };

  const handleShareQuiz = (quizId) => {
    // Implement the share logic, possibly copying the link to the clipboard
  };

  return (
    <div className="analytics-container">
      <h1>Quiz Analysis</h1>
      <table className="analytics-table">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Quiz Name</th>
            <th>Created on</th>
            <th>Impression</th>
            <th></th> {/* This column is for the icons */}
          </tr>
        </thead>
        <tbody>
          {quizzes.length > 0 ? (
            quizzes.map((quiz, index) => (
              <tr key={quiz._id}>
                <td>{index + 1}</td>
                <td>{quiz.quizName.length > 20 ? `${quiz.quizName.substring(0, 20)}...` : quiz.quizName}</td>
                <td>{new Date(quiz.createdOn).toLocaleDateString()}</td>
                <td>{formatImpressions(quiz.impressions)}</td>
                <td className="action-icons">
                  <button onClick={() => handleEditQuiz(quiz._id)}>
                    <img src={editIcon} alt="Edit" />
                  </button>
                  <button onClick={() => handleDeleteQuiz(quiz._id)}>
                    <img src={deleteOption} alt="Delete" />
                  </button>
                  <button onClick={() => handleShareQuiz(quiz._id)}>
                    <img src={shareIcon} alt="Share" />
                  </button>
                  <a href={`/questionAnalysis/${quiz._id}`} className="analysis-link">
                    Question Wise Analysis
                  </a>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No quizzes available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Analytics;
