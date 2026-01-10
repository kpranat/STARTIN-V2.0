import { useState } from 'react';
import { connectToBackend } from '../services/api';
import { Link, useNavigate } from 'react-router-dom'; 
import { useAuth } from '../context/AuthContext'; 
import LoadingScreen from '../components/LoadingScreen'; // ✅ Loader

const StudentSignup = () => {
  const navigate = useNavigate(); 
  const { login } = useAuth();

  const [step, setStep] = useState(1); // 1 = signup, 2 = OTP
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

  // ✅ STEP 1 — Send signup + trigger OTP
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await connectToBackend('student_signup', formData);

      if (response.message) {
        setSuccessMessage('Verification email sent! Check your inbox 👀');

        // Small delay for UX polish
        setTimeout(() => {
          setSuccessMessage('');
          setStep(2);
        }, 1200);
      } else {
        setError(response.message || 'Signup failed');
        setIsLoading(false);
      }
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
      setIsLoading(false);
    }
  };

  // ✅ STEP 2 — Verify OTP and create account
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await connectToBackend('verify_otp', { 
        email: formData.email, 
        otp,
        password: formData.password
      });

      if (response.token) {
        login(response.token, { email: formData.email, role: 'student' });
        setSuccessMessage('Signup successful! Redirecting 🚀');

        setTimeout(() => {
          navigate('/student/home');
        }, 1200);
      } else {
        setError(response.error || 'Invalid OTP');
        setIsLoading(false);
      }
    } catch (err: any) {
      console.error('OTP verification error:', err);
      setError(err.response?.data?.error || 'OTP verification failed');
      setIsLoading(false);
    }
  };

  // ✅ Global Loader Screen
  if (isLoading) {
    return (
      <LoadingScreen 
        text={step === 1 ? "Creating your account..." : "Verifying OTP..."} 
        theme="student" 
      />
    );
  }

  // ✅ OTP Screen
  if (step === 2) {
    return (
      <div className="container form-container">
        <h2>Verify Your Email</h2>
        <p>We've sent a verification code to {formData.email}</p>

        {error && (
          <div style={{ background: '#fee', color: '#c33', padding: '10px', borderRadius: '5px', marginBottom: '15px' }}>
            {error}
          </div>
        )}

        {successMessage && (
          <div style={{ background: '#e7f7e7', color: '#2d662d', padding: '10px', borderRadius: '5px', marginBottom: '15px', textAlign: 'center' }}>
            {successMessage}
          </div>
        )}

        <form onSubmit={handleVerifyOTP}>
          <input 
            type="text" 
            placeholder="Enter 6-digit OTP" 
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            required
          />
          <button type="submit" className="btn" disabled={otp.length !== 6}>
            Verify OTP
          </button>
        </form>

        <p>
          <button 
            onClick={() => setStep(1)} 
            style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Go back
          </button>
        </p>
      </div>
    );
  }

  // ✅ Signup Screen
  return (
    <div className="container form-container">
      <h2>Student Registration</h2>

      {error && (
        <div style={{ background: '#fee', color: '#c33', padding: '10px', borderRadius: '5px', marginBottom: '15px' }}>
          {error}
        </div>
      )}

      {successMessage && (
        <div style={{ background: '#e7f7e7', color: '#2d662d', padding: '10px', borderRadius: '5px', marginBottom: '15px', textAlign: 'center' }}>
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Full Name" onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
        
        <button type="submit" className="btn">
          Sign Up
        </button>
      </form>

      <p>Already registered? <Link to="/student/login">Login</Link></p>
    </div>
  );
};

export default StudentSignup;
