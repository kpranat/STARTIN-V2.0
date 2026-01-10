import React, { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { connectToBackend } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from '../components/LoadingScreen'; 
import '../App.css';

const CompanyLogin: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await connectToBackend('company_login', formData);

      if (response.success && response.token) {
        // Save auth token
        login(response.token);

        // Smooth loader transition
        setTimeout(() => {
          navigate('/company/profile');
        }, 1200);
      } else {
        setError(response.message || 'Login failed');
        setIsLoading(false);
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
      setIsLoading(false);
    }
  };

  // ✅ Fullscreen Loader
  if (isLoading) {
    return (
      <LoadingScreen 
        text="Accessing Company Portal..." 
        theme="company" 
      />
    );
  }

  return (
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
        <h2 style={{ marginBottom: '20px', color: '#0f766e' }}>
          Company Login
        </h2>

        {/* Error Message */}
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
              disabled={isLoading}
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
              disabled={isLoading}
            />
          </div>

          <button 
            type="submit" 
            className="btn" 
            style={{ backgroundColor: '#0f766e', width: '100%' }}
            disabled={isLoading}
          >
            Login
          </button>
        </form>

        <p style={{ marginTop: '15px', fontSize: '0.9rem' }}>
          New Company? <Link to="/company/signup" className="link">Register Here</Link>
        </p>
      </div>
    </div>
  );
};

export default CompanyLogin;
