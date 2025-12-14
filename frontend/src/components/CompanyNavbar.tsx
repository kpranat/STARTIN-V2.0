import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';

const CompanyNavbar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any company session data
    localStorage.removeItem('companyToken'); 
    navigate('/company/login');
  };

  return (
    <nav className="navbar">
      <div className="logo" style={{ color: '#0f766e' }}> {/* Teal color for Company side */}
        InternHub <span style={{ fontSize: '0.8rem', color: '#777' }}>| Company</span>
      </div>

      <div className="nav-links">
        {/* Main Features */}
        <Link to="/company/profile" className="nav-link">Profile</Link>
        <Link to="/company/post-job" className="nav-link">Post Jobs</Link>
        <Link to="/company/applicants" className="nav-link">Applicants</Link>

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

export default CompanyNavbar;