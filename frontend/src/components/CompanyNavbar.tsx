import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUniversityName } from '../utils/auth';
import '../App.css';

const CompanyNavbar: React.FC = () => {
  const navigate = useNavigate();
  const universityName = getUniversityName();

  const handleLogout = () => {
    localStorage.removeItem('companyToken');
    navigate('/company/login');
  };

  return (
    <nav className="navbar">
      <div className="logo" style={{ color: 'var(--accent-cyan)' }}>
        STARTIN' <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>| Company</span>
        {universityName && (
          <span style={{
            marginLeft: '15px',
            fontSize: '0.75rem',
            background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
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
        <Link to="/company/profile" className="nav-link">Profile</Link>
        <Link to="/company/post-job" className="nav-link">Post Jobs</Link>
        <Link to="/company/jobs" className="nav-link">My Jobs</Link>
        <Link to="/company/applicants" className="nav-link">Applicants</Link>

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

export default CompanyNavbar;