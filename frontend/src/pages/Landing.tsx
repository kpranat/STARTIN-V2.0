import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css'; 

const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div className="landing-container">
        <h1 style={{ fontSize: '2.5rem', marginBottom: '10px', color: '#111' }}>Welcome to Startin'</h1>
        <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: '40px' }}>
          Select your role to access the portal
        </p>

        <button 
          onClick={() => navigate('/')} 
          style={{ 
            background: 'none', border: 'none', color: '#6b7280', 
            cursor: 'pointer', marginBottom: '30px', fontSize: '0.9rem' 
          }}
        >
          ← Back to University Selection
        </button>

        <div className="selection-box">
          {/* Student Card */}
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🎓</div>
            <h2 style={{ color: '#4f46e5' }}>Student</h2>
            <p style={{ color: '#666', marginBottom: '20px' }}>Find internships, apply to jobs, and build your career.</p>
            <button className="btn" style={{ width: '100%' }} onClick={() => navigate('/student/login')}>
              Login as Student
            </button>
          </div>

          {/* Company Card */}
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>💼</div>
            <h2 style={{ color: '#0f766e' }}>Company</h2>
            <p style={{ color: '#666', marginBottom: '20px' }}>Post jobs, hire talent, and manage applications.</p>
            <button className="btn" style={{ backgroundColor: '#0f766e', width: '100%' }} onClick={() => navigate('/company/login')}>
              Login as Company
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;