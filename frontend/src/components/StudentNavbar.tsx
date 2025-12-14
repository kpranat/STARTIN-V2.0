import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';

const StudentNavbar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userToken'); 
    navigate('/student/login');
  };

  return (
    <nav className="navbar">
      <div className="logo">
        InternHub <span style={{ fontSize: '0.8rem', color: '#777' }}>| Student</span>
      </div>

      <div className="nav-links">
        {/* Home is where students discover/search for NEW jobs */}
        <Link to="/student/home" className="nav-link">Home</Link>
        
        {/*  Points to the new Applied Jobs page */}
        <Link to="/student/applied-jobs" className="nav-link">Applied Jobs</Link>
        
        <Link to="/student/profile" className="nav-link">Profile</Link>
      </div>

      <button onClick={handleLogout} className="btn-logout">
        Logout
      </button>
    </nav>
  );
};

export default StudentNavbar;