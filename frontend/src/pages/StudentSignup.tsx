import { useState } from 'react';
import { connectToBackend } from '../services/api';
import { Link, useNavigate } from 'react-router-dom'; 
import { useAuth } from '../context/AuthContext'; 

const StudentSignup = () => {
  const navigate = useNavigate(); 
  const { login } = useAuth();
  const [step, setStep] = useState(1); // 1: signup form, 2: OTP verification
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      // Send data to backend
      const response = await connectToBackend('student_signup', formData);

      // Backend returns { message: "OTP sent successfully" } on success
      if (response.message) {
        setEmail(formData.email);
        setSuccessMessage('Verification email sent! Please check your inbox.');
        
        // Show success message for 2 seconds before moving to OTP step
        setTimeout(() => {
          setSuccessMessage('');
          setStep(2); // Move to OTP verification
        }, 2000);
      } else {
        setError(response.message || 'Signup failed');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
      console.error('Signup error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await connectToBackend('verify_otp', { 
        email: formData.email, 
        otp,
        password: formData.password  // Send password for account creation
      });

      if (response.token) {
        // Store the JWT token using AuthContext
        login(response.token, { email: formData.email });
        setSuccessMessage('Signup successful! Redirecting to home...');
        
        // Show success message for 1.5 seconds before navigating
        setTimeout(() => {
          navigate('/student/home');
        }, 1500);
      } else {
        setError(response.error || 'Invalid OTP');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'OTP verification failed');
      console.error('OTP verification error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // OTP Verification Screen
  if (step === 2) {
    return (
      <div className="container form-container">
        <h2>Verify Your Email</h2>
        <p>We've sent a verification code to {formData.email}</p>
        {error && (
          <div style={{ 
            background: '#fee', 
            color: '#c33', 
            padding: '10px', 
            borderRadius: '5px', 
            marginBottom: '15px' 
          }}>{error}</div>
        )}
        {successMessage && (
          <div style={{ 
            background: '#e7f7e7', 
            color: '#2d662d', 
            padding: '10px', 
            borderRadius: '5px', 
            marginBottom: '15px',
            textAlign: 'center'
          }}>{successMessage}</div>
        )}
        <form onSubmit={handleVerifyOTP}>
          <input 
            type="text" 
            placeholder="Enter 6-digit OTP" 
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            required 
            disabled={isLoading}
          />
          <button type="submit" className="btn" disabled={isLoading || otp.length !== 6}>
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>
        <p>
          <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}>
            Go back
          </button>
        </p>
      </div>
    );
  }

  // Original Signup Form
  return (
    <div className="container form-container">
      <h2>Student Registration</h2>
      {error && (
        <div style={{ 
          background: '#fee', 
          color: '#c33', 
          padding: '10px', 
          borderRadius: '5px', 
          marginBottom: '15px' 
        }}>{error}</div>
      )}
      {successMessage && (
        <div style={{ 
          background: '#e7f7e7', 
          color: '#2d662d', 
          padding: '10px', 
          borderRadius: '5px', 
          marginBottom: '15px',
          textAlign: 'center'
        }}>{successMessage}</div>
      )}
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Full Name" onChange={handleChange} required disabled={isLoading} />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required disabled={isLoading} />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required disabled={isLoading} />
        
        <button type="submit" className="btn" disabled={isLoading}>
          {isLoading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
      <p>Already registered? <Link to="/student/login">Login</Link></p>
    </div>
  );
};

export default StudentSignup;