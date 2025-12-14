import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { connectToBackend } from '../services/api'; // Keeping your API import
import '../App.css';

const StudentLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // YOUR BACKEND CALL
    connectToBackend('student_login', { email, password });

    // Optional: Navigate after login (Uncomment when backend is ready)
    // navigate('/student/home'); 
  };

  return (
    <div className="landing-container">
      {/* NEW: Back Button */}
      <div style={{ textAlign: 'left', marginBottom: '20px' }}>
        <button 
          onClick={() => navigate('/role-selection')}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: '#555', 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center',
            gap: '5px',
            fontSize: '0.9rem' 
          }}
        >
          ← Back to Role Selection
        </button>
      </div>

      <div className="form-container card">
        <h2>Student Login</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ textAlign: 'left', marginBottom: '15px' }}>
            <input 
              type="email" 
              placeholder="Student Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div style={{ textAlign: 'left', marginBottom: '20px' }}>
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <button type="submit" className="btn" style={{ width: '100%' }}>Login</button>
        </form>
        <p style={{ marginTop: '15px', fontSize: '0.9rem' }}>
          Don't have an account? <Link to="/student/signup" className="link">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default StudentLogin;