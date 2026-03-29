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
        STARTIN' <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>| Student</span>
        {universityName && (
          <span style={{
            marginLeft: '15px',
            fontSize: '0.75rem',
            background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
            color: 'white',
            padding: '4px 12px',
            borderRadius: '12px',
            fontWeight: 'bold'
          }}>
            🎓 {universityName}
          </span>
        )}
      </div>

      <div className="nav-links">
        <Link to="/student/home" className="nav-link">Home</Link>
        <Link to="/student/applied-jobs" className="nav-link">Applied Jobs</Link>
        <Link to="/student/profile" className="nav-link">Profile</Link>

        <span style={{ color: 'var(--border-subtle)', margin: '0 5px' }}>|</span>

        <Link to="/role-selection" className="nav-link" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Change Role
        </Link>

        <Link to="/select-university" className="nav-link" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
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