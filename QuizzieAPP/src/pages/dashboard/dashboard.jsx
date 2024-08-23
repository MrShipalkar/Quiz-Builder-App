import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import Sidebar from '../../components/sidebar/sidebar';
import eye from '../../assets/eye.png';
import axios from 'axios';
import CreateQuiz from '../../components/createQuizModal/createQuiz'// Import the CreateQuiz component

function Dashboard() {
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    totalQuestions: 0,
    totalImpressions: 0,
  });
  const [showCreateQuizModal, setShowCreateQuizModal] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          throw new Error("No token found");
        }

        // Fetch the stats for the user, with token in Authorization header
        const response = await axios.get('http://localhost:3001/api/quiz/getQuizzesByUserId/', {
          headers: {
            Authorization: `Bearer ${token}`  // Ensure this is correctly formatted
          }
        });

        // Update state with the fetched data
        setStats({
          totalQuizzes: response.data.totalQuizzes,
          totalQuestions: response.data.totalQuestions,
          totalImpressions: response.data.totalImpressions,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
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
            <p>Quiz Created</p>
          </div>
          <div className="stat-box">
            <h2>{stats.totalQuestions}</h2>
            <p>Questions Created</p>
          </div>
          <div className="stat-box">
            <h2>{stats.totalImpressions}</h2>
            <p>Total Impressions</p>
          </div>
        </div>

        <div className="trending-quizzes">
          <h3>Trending Quizzes</h3>
          <div className="quiz-grid">
            {/* Assuming you will add dynamic quiz cards here later */}
            <div className="quiz-card">
              <div className="quiz-details">
                <h2>Quiz 1</h2>
                <span className="impressions">667 <img src={eye} alt="impressions" /></span>
              </div>
              <p>Created on: 04 Sep, 2023</p>
            </div>
            {/* Repeat for other quizzes */}
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
