import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { connectToBackend } from '../services/api';
import { setCompanyId, setUniversityId, setUniversityName } from '../utils/auth';
import '../App.css';

const CompanyLogin: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // FIX 1: Added 'async' keyword here
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Get the selected university ID from localStorage
    const selectedUniversityId = localStorage.getItem('selected_university_id');
    
    console.log('CompanyLogin - University ID from localStorage:', selectedUniversityId);
    
    if (!selectedUniversityId) {
      setError('University not selected. Please go back to landing page.');
      setLoading(false);
      return;
    }
    
    console.log('CompanyLogin - Sending login request with:', { ...formData, universityId: selectedUniversityId });
    
    // FIX 2: The 'try' block is now correctly inside the function
    try {
      const response = await connectToBackend('company_login', {
        ...formData,
        universityId: selectedUniversityId
      });
      
      console.log('CompanyLogin - Response:', response);
      
      if (response.success && response.token) {
        // Store token
        localStorage.setItem('companyToken', response.token);
        
        // Store company ID from response
        if (response.company_id) {
          setCompanyId(response.company_id);
        }
        
        // Store university ID from response
        if (response.university_id) {
          setUniversityId(response.university_id);
          // Get university name from localStorage (set during university selection)
          const universityName = localStorage.getItem('selected_university_name');
          if (universityName) {
            setUniversityName(universityName);
          }
        }
        
        // Show local redirecting state (optional overlay)
        setRedirecting(true);

        // Navigate to profile setup checker
        setTimeout(() => {
            navigate('/company/profile-check');
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
      {/* Loading Overlay */}
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
          <div style={{
            width: '50px',
            height: '50px',
            border: '5px solid #f3f3f3',
            borderTop: '5px solid #0f766e',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <p style={{ color: 'white', marginTop: '20px', fontSize: '1.1rem' }}>
            Login Successful! Redirecting...
          </p>
        </div>
      )}

      <style>{
        `@keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }`
      }</style>

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
          <h2 style={{ marginBottom: '20px', color: '#0f766e' }}>Company Login</h2>

          {/* Display error messages */}
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
                name="email" 
                placeholder="company@example.com" 
                value={formData.email} 
                onChange={handleChange} 
                required 
                disabled={loading}
              />
            </div>
            <div style={{ textAlign: 'left', marginBottom: '20px' }}>
              <input 
                type="password" 
                name="password" 
                placeholder="Password" 
                value={formData.password} 
                onChange={handleChange} 
                required 
                disabled={loading}
              />
            </div>
            <button 
              type="submit" 
              className="btn" 
              style={{ backgroundColor: '#0f766e', width: '100%' }}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <p style={{ marginTop: '15px', fontSize: '0.9rem' }}>
            New Company? <Link to="/company/signup" className="link">Register Here</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default CompanyLogin;