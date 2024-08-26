import React, { useState } from 'react';
import './Sidebar.css';
import { toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import sidebarLine from '../../assets/sidebarLine.png';

function Sidebar({ onCreateQuizClick, onAnalyticsClick, onDashboardClick }) {
  const [activeLink, setActiveLink] = useState('Dashboard');

  const handleLinkClick = (link) => {
    setActiveLink(link);
    if (link === 'Create Quiz') {
      onCreateQuizClick();
    } else if (link === 'Dashboard') {
      onDashboardClick(); 
    } else if (link === 'Analytics') {
      onAnalyticsClick();  
    }
  };

  const logoutHandler = () => {
    localStorage.clear('authToken');
    toast.success('Logged out successfully');
    setTimeout(() => {
      window.location.href = '/';
    }, 2000);
  };

  return (
    <aside className="sidebar">
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
      <ul className='logout-wrapper'>
        <img src={sidebarLine} alt="" />
        <li onClick={logoutHandler} className='logout'>LOG OUT</li>
      </ul>
    </aside>
  );
}

export default Sidebar;
