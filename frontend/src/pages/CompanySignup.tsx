import { useState } from 'react';
import { connectToBackend } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../App.css';

const CompanySignup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // State to manage signup flow steps
  const [step, setStep] = useState<'signup' | 'otp'>('signup');
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // State to hold form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  // State to hold OTP
  const [otp, setOtp] = useState('');

  // Updates state whenever a user types in any box
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
    setError(''); // Clear error on input change
  };

  // Handle signup form submission
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await connectToBackend('company_signup', formData);
      
      if (response.message) {
        setSuccessMessage(`${response.message}. OTP: ${response.otp}`);
        setStep('otp'); // Move to OTP verification step
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Signup failed. Please try again.';
      setError(errorMessage);
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP verification
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await connectToBackend('company_verify_otp', {
        email: formData.email,
        otp: otp,
        password: formData.password
      });

      if (response.token) {
        // Store token and login
        login(response.token);
        setRedirecting(true);
        // Small delay for smooth transition
        setTimeout(() => {
          navigate('/company/profile');
        }, 800);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'OTP verification failed. Please try again.';
      setError(errorMessage);
      console.error('OTP verification error:', err);
    } finally {
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
            Registration Successful! Redirecting...
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
        <h2 style={{ marginBottom: '20px', color: '#0f766e' }}>
          {step === 'signup' ? 'Company Registration' : 'Verify OTP'}
        </h2>

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

        {/* Display success messages */}
        {successMessage && (
          <div style={{ 
            background: '#efe', 
            color: '#3a3', 
            padding: '10px', 
            borderRadius: '5px', 
            marginBottom: '15px',
            fontSize: '0.9rem'
          }}>
            {successMessage}
          </div>
        )}

        {/* Step 1: Signup Form */}
        {step === 'signup' && (
          <form onSubmit={handleSignupSubmit}>
            <div style={{ textAlign: 'left', marginBottom: '15px' }}>
              <input 
                type="text" 
                name="name" 
                placeholder="Company Name" 
                value={formData.name}
                onChange={handleChange} 
                required 
                disabled={loading}
              />
            </div>
            <div style={{ textAlign: 'left', marginBottom: '15px' }}>
              <input 
                type="email" 
                name="email" 
                placeholder="Official Email" 
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
                placeholder="Create Password" 
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
              {loading ? 'Sending OTP...' : 'Register Company'}
            </button>
          </form>
        )}

        {/* Step 2: OTP Verification Form */}
        {step === 'otp' && (
          <form onSubmit={handleOtpSubmit}>
            <p style={{ fontSize: '0.9rem', marginBottom: '15px', color: '#555' }}>
              An OTP has been sent to <strong>{formData.email}</strong>
            </p>
            <div style={{ textAlign: 'left', marginBottom: '20px' }}>
              <input 
                type="text" 
                placeholder="Enter 6-digit OTP" 
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value);
                  setError('');
                }}
                maxLength={6}
                required 
                disabled={loading}
              />
            </div>
            
            <button 
              type="submit" 
              className="btn" 
              style={{ backgroundColor: '#0f766e', width: '100%', marginBottom: '10px' }}
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>

            <button 
              type="button"
              onClick={() => {
                setStep('signup');
                setOtp('');
                setError('');
                setSuccessMessage('');
              }}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: '#0f766e', 
                cursor: 'pointer',
                textDecoration: 'underline',
                fontSize: '0.9rem'
              }}
              disabled={loading}
            >
              ← Back to Signup
            </button>
          </form>
        )}
        
        <p style={{ marginTop: '15px', fontSize: '0.9rem' }}>
          Already have an account? <Link to="/company/login" className="link">Login</Link>
        </p>
      </div>
    </div>
    </>
  );
};

export default CompanySignup;