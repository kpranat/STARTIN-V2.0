import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css'; 

const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <h1>Welcome to Startin'</h1>
      <p style={{ color: '#666', marginBottom: '40px' }}>
        Please select your role to continue
      </p>

      {/*  Back Button to University Selection */}
      <button 
        onClick={() => navigate('/')} 
        style={{ 
          background: 'none', 
          border: 'none', 
          color: '#666', 
          cursor: 'pointer', 
          textDecoration: 'underline',
          marginBottom: '20px'
        }}
      >
        ← Back to University Selection
      </button>

      <div className="selection-box">
        {/* Student Card */}
        <div className="card">
          <h2>Student</h2>
          <p>Find internships, apply to jobs, and build your career.</p>
          <button className="btn" onClick={() => navigate('/student/login')}>
            I am a Student
          </button>
        </div>

        {/* Company Card */}
        <div className="card">
          <h2>Company</h2>
          <p>Post jobs, hire talent, and manage applications.</p>
          <button className="btn" style={{ backgroundColor: '#0f766e' }} onClick={() => navigate('/company/login')}>
            I am a Company
          </button>
        </div>
      </div>
    </div>
  );
};

export default Landing;