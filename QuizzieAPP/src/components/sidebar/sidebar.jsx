import React, { useState } from 'react';
import './Sidebar.css';
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Sidebar({ onCreateQuizClick }) {  // Accept a prop for handling the Create Quiz click
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState('Dashboard');

  const handleLinkClick = (link) => {
    setActiveLink(link);
    if (link === 'Create Quiz') {
      onCreateQuizClick();  // Call the function passed as prop to open the modal
    } else if (link === 'Dashboard') {
      navigate('/dashboard');
    } else if (link === 'Analytics') {
      navigate('/analytics');
    }
  };

  const logoutHandler = () => {
    localStorage.clear('authToken');
    toast.success('Logged out successfully');
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  return (
    <aside className="sidebar">
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="logo">QUIZZIE</div>
      <nav className="sidebar-nav">
        <ul>
          <li
            className={activeLink === 'Dashboard' ? 'active' : ''}
            onClick={() => handleLinkClick('Dashboard')}
          >
            Dashboard
          </li>
          <li
            className={activeLink === 'Analytics' ? 'active' : ''}
            onClick={() => handleLinkClick('Analytics')}
          >
            Analytics
          </li>
          <li
            className={activeLink === 'Create Quiz' ? 'active' : ''}
            onClick={() => handleLinkClick('Create Quiz')}
          >
            Create Quiz
          </li>
        </ul>
      </nav>
      <ul>
        <li onClick={logoutHandler} className='logout'>LOG OUT</li>
      </ul>
    </aside>
  );
}

export default Sidebar;
