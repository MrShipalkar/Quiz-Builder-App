import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import Sidebar from '../../components/sidebar/sidebar';
import eye from '../../assets/eye.png';
import axios from 'axios';
import CreateQuiz from '../../components/createQuizModal/createQuiz';
import ConfirmDeleteModal from '../../components/deleteModal/ConfirmDeleteModal';
import EditQuestionsModal from '../../components/editQuestionModal/EditQuestionsModal';
import QuestionWiseAnalysis from '../../components/questionWiseAnalysis/QuestionWiseAnalysis'; // Import the QuestionWiseAnalysis component
import editIcon from '../../assets/editIcon.png';
import deleteOption from '../../assets/deleteOption.png';
import shareIcon from '../../assets/shareIcon.png';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  const [quizzes, setQuizzes] = useState([]);
  const [trendingQuizzes, setTrendingQuizzes] = useState([]);
  const [showCreateQuizModal, setShowCreateQuizModal] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState(null);
  const [quizToEdit, setQuizToEdit] = useState(null);
  const [quizForAnalysis, setQuizForAnalysis] = useState(null);

  useEffect(() => {
    const fetchStatsAndQuizzes = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await axios.get('http://localhost:3001/api/quiz/getQuizzesByUserId/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setStats({
          totalQuizzes: response.data.totalQuizzes,
          totalQuestions: response.data.totalQuestions,
          totalImpressions: response.data.totalImpressions,
        });

        setQuizzes(response.data.quizzes);
        const sortedQuizzes = [...response.data.quizzes].sort((a, b) => b.impressions - a.impressions);
        setTrendingQuizzes(sortedQuizzes);
      } catch (error) {
        console.error('Error fetching stats and quizzes:', error);
      }
    };

    fetchStatsAndQuizzes();
  }, []);

  const handleCreateQuizClick = () => {
    setShowCreateQuizModal(true);
  };

  const handleAnalyticsClick = () => {
    setShowAnalytics(true);
    setQuizForAnalysis(null); // Reset analysis view when clicking on analytics
  };

  const handleDashboardClick = () => {
    setShowAnalytics(false);
    setQuizForAnalysis(null); // Reset analysis view when returning to the dashboard
  };

  const handleDeleteQuiz = (quizId) => {
    setQuizToDelete(quizId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      await axios.delete(`http://localhost:3001/api/quiz/deleteQuiz/${quizToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setQuizzes(quizzes.filter((quiz) => quiz._id !== quizToDelete));
      setTrendingQuizzes(trendingQuizzes.filter((quiz) => quiz._id !== quizToDelete));
      setShowDeleteModal(false);
      toast.success('Quiz deleted successfully');
    } catch (error) {
      console.error('Error deleting quiz:', error);
      toast.error('Failed to delete quiz');
    }
  };

  const handleEditQuiz = (quiz) => {
    setQuizToEdit(quiz);
  };

  const handleShareQuiz = (quizId) => {
    const quizLink = `${window.location.origin}/quiz/${quizId}`;
    navigator.clipboard.writeText(quizLink)
      .then(() => {
        toast.success('Quiz link copied to clipboard!');
      })
      .catch((err) => {
        toast.error('Failed to copy the link.');
      });
  };

  const handleQuestionWiseAnalysis = (quiz) => {
    setQuizForAnalysis(quiz);
  };

  return (
    <div className="dashboard-container">
      <Sidebar
        onCreateQuizClick={handleCreateQuizClick}
        onAnalyticsClick={handleAnalyticsClick}
        onDashboardClick={handleDashboardClick}
      />
      <main className="main-content">
        {!showAnalytics && !quizForAnalysis ? (
          <>
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
                {trendingQuizzes && trendingQuizzes.length > 0 ? (
                  trendingQuizzes.map((quiz) => (
                    <div className="quiz-card" key={quiz._id}>
                      <div className="quiz-details">
                        <h2>{quiz.quizName.length > 20 ? `${quiz.quizName.slice(0, 20)}...` : quiz.quizName}</h2>
                        <span className="impressions">
                          {formatImpressions(quiz.impressions)} <img src={eye} alt="impressions" />
                        </span>
                      </div>
                      <p>
                        Created on:{" "}
                        {new Date(quiz.createdOn).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  ))
                ) : (
                  <p>No quizzes available.</p>
                )}
              </div>
            </div>
          </>
        ) : quizForAnalysis ? (
          <QuestionWiseAnalysis quiz={quizForAnalysis} />
        ) : (
          <div className="analytics-view">
            <h3>Quiz Analysis</h3>
            <table className="analytics-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Quiz Name</th>
                  <th>Created on</th>
                  <th>Impression</th>
                  <th className='logo-column'></th>
                  <th className='logo-column'></th>
                  <th className='logo-column'></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {quizzes.map((quiz, index) => (
                  <tr key={quiz._id}>
                    <td>{index + 1}</td>
                    <td>{quiz.quizName.length > 20 ? `${quiz.quizName.slice(0, 20)}...` : quiz.quizName}</td>
                    <td>{<p>{new Date(quiz.createdOn).toLocaleDateString("en-GB", {day: "2-digit",month: "short",year: "numeric",})}
                    </p>
                    }</td>
                    <td>{formatImpressions(quiz.impressions)}</td>
                    <td><button onClick={() => handleEditQuiz(quiz)} className="edit-button"><img src={editIcon} alt="editIcon" /></button></td>
                    <td><button onClick={() => handleDeleteQuiz(quiz._id)} className="delete-button"><img src={deleteOption} alt="deleteOption" /></button></td>
                    <td><button onClick={() => handleShareQuiz(quiz._id)} className="share-button"><img src={shareIcon} alt="shareIcon" /></button></td>
                    <td><button onClick={() => handleQuestionWiseAnalysis(quiz)} className="analysis-button">Question Wise Analysis</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {showCreateQuizModal && (
          <CreateQuiz onClose={() => setShowCreateQuizModal(false)} />
        )}
        {quizToEdit && (
          <EditQuestionsModal quiz={quizToEdit} onClose={() => setQuizToEdit(null)} />
        )}
        <ConfirmDeleteModal
          show={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete}
        />
      </main>
    </div>
  );
}

export default Dashboard;
