import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { connectToBackend } from '../services/api';
import { sendPasswordResetEmail } from '../services/emailService';
import '../App.css';

const StudentForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'email' | 'token' | 'password'>('email');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const selectedUniversityId = localStorage.getItem('selected_university_id');
      
      if (!selectedUniversityId) {
        setError('University not selected. Please go back to landing page.');
        setLoading(false);
        return;
      }

      const response = await connectToBackend('student_request_reset', {
        email,
        universityId: selectedUniversityId
      });

      if (response.success) {
        // Send email with token
        try {
          await sendPasswordResetEmail(email, response.token, 'student');
          setSuccess('Password reset instructions have been sent to your email. Please check your inbox.');
          setStep('token');
        } catch (emailError) {
          // If email fails, still allow manual token entry
          setSuccess('Reset token generated. Please enter the token sent to your email.');
          setStep('token');
        }
      } else {
        setError(response.message || 'Failed to request password reset');
      }
    } catch (err: any) {
      console.error('Password reset request error:', err);
      setError(err.response?.data?.message || 'Failed to request password reset');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyToken = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await connectToBackend('student_verify_reset_token', {
        token
      });

      if (response.success) {
        setSuccess('Token verified! Please enter your new password.');
        setStep('password');
      } else {
        setError(response.message || 'Invalid or expired token');
      }
    } catch (err: any) {
      console.error('Token verification error:', err);
      setError(err.response?.data?.message || 'Invalid or expired token');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const response = await connectToBackend('student_reset_password', {
        token,
        newPassword
      });

      if (response.success) {
        setSuccess('Password reset successful! Redirecting to login...');
        setTimeout(() => {
          navigate('/student/login');
        }, 2000);
      } else {
        setError(response.message || 'Failed to reset password');
        setLoading(false);
      }
    } catch (err: any) {
      console.error('Password reset error:', err);
      setError(err.response?.data?.message || 'Failed to reset password');
      setLoading(false);
    }
  };

  return (
    <div className="landing-container">
      <div style={{ textAlign: 'left', marginBottom: '20px' }}>
        <button 
          onClick={() => navigate('/student/login')}
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
          ← Back to Login
        </button>
      </div>

      <div className="form-container card">
        <h2 style={{ marginBottom: '10px', color: '#4f46e5' }}>
          {step === 'email' && 'Forgot Password'}
          {step === 'token' && 'Verify Reset Token'}
          {step === 'password' && 'Set New Password'}
        </h2>
        
        {step === 'email' && (
          <p style={{ marginBottom: '20px', fontSize: '0.9rem', color: '#666' }}>
            Enter your email address and we'll send you a password reset token.
          </p>
        )}

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

        {success && (
          <div style={{ 
            background: '#efe', 
            color: '#2a7', 
            padding: '10px', 
            borderRadius: '5px', 
            marginBottom: '15px',
            fontSize: '0.9rem'
          }}>
            {success}
          </div>
        )}

        {/* Step 1: Enter Email */}
        {step === 'email' && (
          <form onSubmit={handleRequestReset}>
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
            <button 
              type="submit" 
              className="btn" 
              style={{ width: '100%', backgroundColor: '#4f46e5' }}
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Token'}
            </button>
          </form>
        )}

        {/* Step 2: Enter Token */}
        {step === 'token' && (
          <form onSubmit={handleVerifyToken}>
            <div style={{ textAlign: 'left', marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>
                Reset Token
              </label>
              <input 
                type="text" 
                placeholder="Enter the token from your email" 
                value={token}
                onChange={(e) => setToken(e.target.value)}
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
              {loading ? 'Verifying...' : 'Verify Token'}
            </button>
            <button 
              type="button"
              onClick={() => setStep('email')}
              style={{ 
                width: '100%', 
                marginTop: '10px',
                background: 'none',
                border: '1px solid #4f46e5',
                color: '#4f46e5',
                padding: '10px',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Request New Token
            </button>
          </form>
        )}

        {/* Step 3: Enter New Password */}
        {step === 'password' && (
          <form onSubmit={handleResetPassword}>
            <div style={{ textAlign: 'left', marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>
                New Password
              </label>
              <input 
                type="password" 
                placeholder="Enter new password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={loading}
                required 
                minLength={6}
              />
            </div>
            <div style={{ textAlign: 'left', marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>
                Confirm Password
              </label>
              <input 
                type="password" 
                placeholder="Confirm new password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                required 
                minLength={6}
              />
            </div>
            <button 
              type="submit" 
              className="btn" 
              style={{ width: '100%', backgroundColor: '#4f46e5' }}
              disabled={loading}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}

        <p style={{ marginTop: '15px', fontSize: '0.9rem' }}>
          Remember your password? <Link to="/student/login" className="link">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default StudentForgotPassword;
