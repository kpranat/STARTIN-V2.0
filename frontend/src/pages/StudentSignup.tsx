import { useState, useEffect } from 'react';
import { connectToBackend } from '../services/api';
import { Link, useNavigate } from 'react-router-dom'; 
import { useAuth } from '../context/AuthContext'; 
import { setStudentId, setUniversityId, setUniversityName } from '../utils/auth';
import { sendStudentOTPEmail } from '../services/emailService'; 

const StudentSignup = () => {
  const navigate = useNavigate(); 
  const { login } = useAuth();
  const [step, setStep] = useState(1); // 1: signup form, 2: OTP verification
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [remainingTime, setRemainingTime] = useState(600); // 10 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  // Timer effect for countdown
  useEffect(() => {
    if (step === 2) {
      const timer = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [step]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Get university ID from localStorage
    const universityId = localStorage.getItem('selected_university_id');
    if (!universityId) {
      setError('Please select a university first');
      setIsLoading(false);
      navigate('/');
      return;
    }

    try {
      // Send data to backend to generate OTP
      const response = await connectToBackend('student_signup', {
        ...formData,
        universityId: parseInt(universityId)
      });

      // Backend returns OTP to frontend
      if (response.success && response.otp) {
        // Send OTP email from frontend using EmailJS
        try {
          await sendStudentOTPEmail(response.email, response.otp, formData.name);
          setSuccessMessage('Verification email sent! Please check your inbox.');
          
          // Show success message for 2 seconds before moving to OTP step
          setTimeout(() => {
            setSuccessMessage('');
            setStep(2); // Move to OTP verification
          }, 2000);
        } catch (emailError) {
          setError('Failed to send verification email. Please try again.');
          console.error('Email sending error:', emailError);
        }
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

    // Get university ID from localStorage
    const universityId = localStorage.getItem('selected_university_id');

    try {
      const response = await connectToBackend('verify_otp', { 
        email: formData.email, 
        otp,
        password: formData.password,  // Send password for account creation
        universityId: universityId ? parseInt(universityId) : undefined
      });

      if (response.token) {
        // Store the JWT token using AuthContext
        login(response.token, { email: formData.email });
        
        // Store student ID and university ID from response
        if (response.student_id) {
          setStudentId(response.student_id);
        }
        if (response.university_id) {
          setUniversityId(response.university_id);
        }
        
        // Also store university name from localStorage if available
        const universityName = localStorage.getItem('selected_university_name');
        if (universityName) {
          setUniversityName(universityName);
        }
        
        setSuccessMessage('Signup successful! Redirecting...');
        
        // Navigate to profile check
        setTimeout(() => {
          navigate('/student/profile-check');
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

  const handleResendOTP = async () => {
    setError('');
    setIsResending(true);

    const universityId = localStorage.getItem('selected_university_id');
    if (!universityId) {
      setError('University ID not found');
      setIsResending(false);
      return;
    }
// Backend returns new OTP to frontend
      if (response.success && response.otp) {
        // Send OTP email from frontend using EmailJS
        try {
          await sendStudentOTPEmail(response.email, response.otp, formData.name);
          setSuccessMessage('New OTP sent successfully! Please check your email.');
          setRemainingTime(600); // Reset to 10 minutes
          setCanResend(false);
          setTimeout(() => setSuccessMessage(''), 3000);
        } catch (emailError) {
          setError('Failed to send verification email. Please try again.');
          console.error('Email sending error:', emailError);
        }
      });

      if (response.message) {
        setSuccessMessage('New OTP sent successfully! Please check your email.');
        setRemainingTime(600); // Reset to 10 minutes
        setCanResend(false);
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (err: any) {
      if (err.response?.status === 429 && err.response?.data?.remainingSeconds) {
        setRemainingTime(err.response.data.remainingSeconds);
        setCanResend(false);
        setError(`Please wait ${formatTime(err.response.data.remainingSeconds)} before requesting a new OTP`);
      } else {
        setError(err.response?.data?.error || 'Failed to resend OTP');
      }
      console.error('Resend OTP error:', err);
    } finally {
      setIsResending(false);
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
        <div style={{ marginTop: '15px' }}>
          {!canResend ? (
            <p style={{ fontSize: '0.9rem', color: '#666' }}>
              Resend OTP available in: <strong>{formatTime(remainingTime)}</strong>
            </p>
          ) : (
            <button 
              onClick={handleResendOTP} 
              disabled={isResending}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: '#007bff', 
                cursor: isResending ? 'not-allowed' : 'pointer', 
                textDecoration: 'underline',
                fontSize: '0.9rem'
              }}
            >
              {isResending ? 'Sending...' : 'Resend OTP'}
            </button>
          )}
        </div>
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
      <form onSubmit={handleSignup}>
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