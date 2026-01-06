import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { connectToBackend } from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../App.css';

const StudentLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await connectToBackend('student_login', { email, password });
      
      if (response.success && response.token) {
        // Store token and update auth context
        login(response.token, { email, role: 'student' });
        
        // Navigate to student home
        navigate('/student/home');
      } else {
        setError(response.message || 'Login failed. Please try again.');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      
      // Handle specific error responses
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.status === 400) {
        setError('Email not registered');
      } else if (err.response?.status === 401) {
        setError('Incorrect password');
      } else {
        setError('Unable to connect to server. Please try again.');
      }
    } finally {
      setLoading(false);
    }
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
        
        {error && (
          <div style={{ 
            background: '#fee', 
            color: '#c33', 
            padding: '10px', 
            borderRadius: '5px', 
            marginBottom: '15px',
            fontSize: '0.9rem'
          }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div style={{ textAlign: 'left', marginBottom: '15px' }}>
            <input 
              type="email" 
              placeholder="Student Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required 
            />
          </div>
          <div style={{ textAlign: 'left', marginBottom: '20px' }}>
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required 
            />
          </div>
          <button 
            type="submit" 
            className="btn" 
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p style={{ marginTop: '15px', fontSize: '0.9rem' }}>
          Don't have an account? <Link to="/student/signup" className="link">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default StudentLogin;