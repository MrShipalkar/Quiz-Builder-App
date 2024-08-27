import React, { useState, useEffect } from 'react';
import './dashboard.css';
import Sidebar from '../../components/sidebar/sidebar';
import eye from '../../assets/eye.png';
import axios from 'axios';
import CreateQuiz from '../../components/createQuizModal/createQuiz';
import ConfirmDeleteModal from '../../components/deleteModal/ConfirmDeleteModal';
import EditQuestionsModal from '../../components/editQuestionModal/EditQuestionsModal';
import QuestionWiseAnalysis from '../../components/questionWiseAnalysis/QuestionWiseAnalysis';
import editIcon from '../../assets/editIcon.png';
import deleteicon from '../../assets/deleteicon.png';
import shareIcon from '../../assets/shareIcon.png';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API_URL from '../../services/config'

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

        const response = await axios.get(`${API_URL}/api/quiz/getQuizzesByUserId/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const totalImpressions = response.data.quizzes.reduce((acc, quiz) => acc + quiz.impressions, 0);

        setStats({
          totalQuizzes: response.data.totalQuizzes,
          totalQuestions: response.data.totalQuestions,
          totalImpressions: totalImpressions,
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
    setQuizForAnalysis(null);
  };

  const handleDashboardClick = () => {
    setShowAnalytics(false);
    setQuizForAnalysis(null);
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

      await axios.delete(`${API_URL}/api/quiz/deleteQuiz/${quizToDelete}`, {
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
                <h2>{stats.totalQuizzes}  <span>Quizzes</span></h2>
                <p> Created</p>
              </div>
              <div className="stat-box">
                <h2>{stats.totalQuestions}  <span>Questions</span></h2>
                <p> Created</p>
              </div>
              <div className="stat-box">
                <h2>{formatImpressions(stats.totalImpressions)}  <span>Total</span></h2>
                <p> Impressions</p>
              </div>
            </div>
            <div className="trending-quizzes">
              <h3>Trending Quizs</h3>
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
                  <p className='no-Quiz-msg'>No Quizs Available</p>
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
        <th></th>
        <th></th>
        <th></th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {quizzes.length > 0 ? (
        quizzes.map((quiz, index) => (
          <tr key={quiz._id}>
            <td>{index + 1}</td>
            <td>{quiz.quizName.length > 20 ? `${quiz.quizName.slice(0, 20)}...` : quiz.quizName}</td>
            <td>
              <p>{new Date(quiz.createdOn).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}</p>
            </td>
            <td>{formatImpressions(quiz.impressions)}</td>
            <td><button onClick={() => handleEditQuiz(quiz)} className="edit-button"><img src={editIcon} alt="editIcon" /></button></td>
            <td><button onClick={() => handleDeleteQuiz(quiz._id)} className="delete-button"><img src={deleteicon} alt="deleteicon" /></button></td>
            <td><button onClick={() => handleShareQuiz(quiz._id)} className="share-button"><img src={shareIcon} alt="shareIcon" /></button></td>
            <td><button onClick={() => handleQuestionWiseAnalysis(quiz)} className="analysis-button">Question Wise Analysis</button></td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="8" className="no-data"><p>No Quizs available</p></td>
        </tr>
      )}
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
