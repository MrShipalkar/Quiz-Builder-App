import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import Sidebar from '../../components/sidebar/sidebar';
import eye from '../../assets/eye.png';
import axios from 'axios';
import CreateQuiz from '../../components/createQuizModal/createQuiz';

const formatImpressions = (impressions) => {
  if (impressions >= 1000) {
    return (impressions / 1000).toFixed(1) + 'k';
  }
  return impressions.toString();
};

function Dashboard() {
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    totalQuestions: 0,
    totalImpressions: 0,
  });
  const [quizzes, setQuizzes] = useState([]); // State to store the user's quizzes
  const [showCreateQuizModal, setShowCreateQuizModal] = useState(false);

  useEffect(() => {
    const fetchStatsAndQuizzes = async () => {
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

        setStats({
          totalQuizzes: response.data.totalQuizzes,
          totalQuestions: response.data.totalQuestions,
          totalImpressions: response.data.totalImpressions,
        });

        // Sort quizzes by impressions in descending order before setting state
        const sortedQuizzes = response.data.quizzes.sort((a, b) => b.impressions - a.impressions);
        setQuizzes(sortedQuizzes); // Store sorted quizzes in the state
      } catch (error) {
        console.error('Error fetching stats and quizzes:', error);
      }
    };

    fetchStatsAndQuizzes();
  }, []);

  const handleCreateQuizClick = () => {
    setShowCreateQuizModal(true);
  };

  return (
    <div className="dashboard-container">
      <Sidebar onCreateQuizClick={handleCreateQuizClick} />
      <main className="main-content">
        <div className="stats-container">
          <div className="stat-box">
            <h2>{stats.totalQuizzes}</h2>
            <p>Quizzes Created</p>
          </div>
          <div className="stat-box">
            <h2>{stats.totalQuestions}</h2>
            <p>Questions Created</p>
          </div>
          <div className="stat-box">
            <h2>{formatImpressions(stats.totalImpressions)}</h2>
            <p>Total Impressions</p>
          </div>
        </div>

        <div className="trending-quizzes">
          <h3>Trending Quizzes</h3>
          <div className="quiz-grid">
            {quizzes && quizzes.length > 0 ? (
              quizzes.map((quiz) => (
                <div className="quiz-card" key={quiz._id}>
                  <div className="quiz-details">
                    <h2>{quiz.quizName}</h2>
                    <span className="impressions">
                      {formatImpressions(quiz.impressions)} <img src={eye} alt="impressions" />
                    </span>
                  </div>
                  <p>Created on: {new Date(quiz.createdOn).toLocaleDateString()}</p>
                </div>
              ))
            ) : (
              <p>No quizzes available.</p>
            )}
          </div>
        </div>

        {showCreateQuizModal && (
          <CreateQuiz
            onClose={() => setShowCreateQuizModal(false)}
          />
        )}
      </main>
    </div>
  );
}

export default Dashboard;
