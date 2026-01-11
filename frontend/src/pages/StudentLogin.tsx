import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { connectToBackend } from '../services/api';
import { setStudentId } from '../utils/auth';
import '../App.css';

const StudentLogin: React.FC = () => {
  const navigate = useNavigate();
  
  // State for form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // State for UI feedback
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await connectToBackend('student_login', { email, password });
      
      if (response.success && response.token) {
        // 1. Store the token
        localStorage.setItem('studentToken', response.token);

        // 2. Store student ID from response
        if (response.student_id) {
          setStudentId(response.student_id);
        }

        // 3. Show local "success" feedback immediately
        setRedirecting(true);

        // 4. Navigate to profile check
        setTimeout(() => {
             navigate('/student/profile-check');
        }, 1000);

      } else {
        setError(response.message || 'Invalid credentials');
        setLoading(false);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError('Server error. Please try again later.');
      setLoading(false);
    }
  };

  return (
    <>
      {/* Loading Overlay (Optional: shows immediately on success) */}
      {redirecting && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
           <div className="loader-ring">
              <div></div><div></div><div></div><div></div>
           </div>
          <p style={{ color: 'white', marginTop: '20px', fontSize: '1.1rem' }}>
            Login Verified! Redirecting...
          </p>
        </div>
      )}

      <div className="landing-container">
        {/* Back Button */}
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
          <h2 style={{ marginBottom: '20px', color: '#4f46e5' }}>Student Login</h2>
          
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
              style={{ width: '100%', backgroundColor: '#4f46e5' }}
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
    </>
  );
};

export default StudentLogin;