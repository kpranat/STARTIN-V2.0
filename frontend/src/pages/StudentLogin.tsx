import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { connectToBackend } from '../services/api';
import { setStudentId, setUniversityId, setUniversityName } from '../utils/auth';
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
      // Get the selected university ID from localStorage
      const selectedUniversityId = localStorage.getItem('selected_university_id');
      
      console.log('StudentLogin - University ID from localStorage:', selectedUniversityId);
      
      if (!selectedUniversityId) {
        setError('University not selected. Please go back to landing page.');
        setLoading(false);
        return;
      }
      
      console.log('StudentLogin - Sending login request with:', { email, universityId: selectedUniversityId });
      
      const response = await connectToBackend('student_login', { 
        email, 
        password, 
        universityId: selectedUniversityId 
      });
      
      console.log('StudentLogin - Response:', response);
      
      if (response.success && response.token) {
        // 1. Store the token
        localStorage.setItem('studentToken', response.token);

        // 2. Store student ID from response
        if (response.student_id) {
          setStudentId(response.student_id);
        }

        // 3. Store university ID from response
        if (response.university_id) {
          setUniversityId(response.university_id);
          // Get university name from localStorage (set during university selection)
          const universityName = localStorage.getItem('selected_university_name');
          if (universityName) {
            setUniversityName(universityName);
          }
        }

        // 4. Show local "success" feedback immediately
        setRedirecting(true);

        // 4. Navigate to profile check
        setTimeout(() => {
             navigate('/student/profile-check');
        }, 1000);

      } else {
        setError(response.message || 'Invalid credentials');
        setLoading(false);
      }
    } catch (err: any) {
      console.error("Login error:", err);
      // Show the actual error message from backend
      const errorMessage = err.response?.data?.message || err.message || 'Server error. Please try again later.';
      setError(errorMessage);
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
            <div style={{ textAlign: 'right', marginBottom: '15px' }}>
              <Link to="/student/forgot-password" className="link" style={{ fontSize: '0.9rem' }}>
                Forgot Password?
              </Link>
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