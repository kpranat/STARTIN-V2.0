import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUniversityName } from '../utils/auth';
import '../App.css';

const StudentNavbar: React.FC = () => {
  const navigate = useNavigate();
  const universityName = getUniversityName();

  const handleLogout = () => {
    localStorage.removeItem('userToken'); 
    navigate('/student/login');
  };

  return (
    <nav className="navbar">
      <div className="logo">
        InternHub <span style={{ fontSize: '0.8rem', color: '#777' }}>| Student</span>
        {universityName && (
          <span style={{ 
            marginLeft: '15px', 
            fontSize: '0.75rem', 
            background: '#dc2626', 
            color: 'white', 
            padding: '4px 10px', 
            borderRadius: '12px',
            fontWeight: 'bold'
          }}>
            🎓 {universityName}
          </span>
        )}
      </div>

      <div className="nav-links">
        {/* Main Features */}
        <Link to="/student/home" className="nav-link">Home</Link>
        <Link to="/student/applied-jobs" className="nav-link">Applied Jobs</Link>
        <Link to="/student/profile" className="nav-link">Profile</Link>

        {/* Navigation Shortcuts */}
        <span style={{ color: '#ccc', margin: '0 5px' }}>|</span>
        
        <Link to="/role-selection" className="nav-link" style={{ fontSize: '0.9rem', color: '#666' }}>
          Change Role
        </Link>
        
        <Link to="/" className="nav-link" style={{ fontSize: '0.9rem', color: '#666' }}>
          Change Univ
        </Link>
      </div>

      <button onClick={handleLogout} className="btn-logout">
        Logout
      </button>
    </nav>
  );
};

export default StudentNavbar;