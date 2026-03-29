import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowLeft, ChevronRight, Building2, Key, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { connectToBackend } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { setCompanyId, setUniversityId, setUniversityName } from '../utils/auth';
import { sendCompanyOTPEmail } from '../services/emailService';
import ColorBends from '../components/ui/ColorBends';
import '../App.css';

const CompanySignup: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [step, setStep] = useState<'signup' | 'otp'>('signup');
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [remainingTime, setRemainingTime] = useState(600);
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const [formData, setFormData] = useState({
    passkey: '',
    email: '',
    password: ''
  });

  const [otp, setOtp] = useState('');

  useEffect(() => {
    if (step === 'otp') {
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
    setError('');
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    const universityId = localStorage.getItem('selected_university_id');
    if (!universityId) {
      setError('Please select a university first');
      setLoading(false);
      navigate('/select-university');
      return;
    }

    try {
      const response = await connectToBackend('company_signup', {
        ...formData,
        universityId: parseInt(universityId)
      });

      if (response.success && response.otp) {
        try {
          await sendCompanyOTPEmail(response.email, response.otp);
          setSuccessMessage('Verification email sent! Please check your inbox.');
          setTimeout(() => {
            setStep('otp');
            setSuccessMessage('');
          }, 1500);
        } catch (emailError) {
          setError('Failed to send verification email. Please try again.');
        }
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Signup failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const universityId = localStorage.getItem('selected_university_id');

    try {
      const response = await connectToBackend('company_verify_otp', {
        email: formData.email,
        otp: otp,
        password: formData.password,
        universityId: universityId ? parseInt(universityId) : undefined
      });

      if (response.token) {
        login(response.token);
        if (response.company_id) setCompanyId(response.company_id);
        if (response.university_id) setUniversityId(response.university_id);

        const universityName = localStorage.getItem('selected_university_name');
        if (universityName) setUniversityName(universityName);

        setRedirecting(true);
        setTimeout(() => navigate('/company/profile-check'), 1500);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'OTP verification failed');
    } finally {
      setLoading(false);
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

    try {
      const response = await connectToBackend('company_resend_otp', {
        email: formData.email,
        universityId: parseInt(universityId)
      });

      if (response.success && response.otp) {
        try {
          await sendCompanyOTPEmail(response.email, response.otp);
          setSuccessMessage('New OTP sent successfully!');
          setRemainingTime(600);
          setCanResend(false);
          setTimeout(() => setSuccessMessage(''), 3000);
        } catch (emailError) {
          setError('Failed to send email.');
        }
      }
    } catch (err: any) {
      setError('Failed to resend OTP.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      <ColorBends speed={0.12} colors={['#06b6d4', '#3b82f6', '#0891b2', '#0ea5e9']} />
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(5, 5, 8, 0.7)', backdropFilter: 'blur(8px)' }} />

      <AnimatePresence>
        {redirecting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.85)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              backdropFilter: 'blur(20px)'
            }}
          >
            <CheckCircle2 size={64} color="#06b6d4" />
            <p style={{ color: 'white', marginTop: '20px', fontSize: '1.2rem', fontWeight: 600 }}>
              Registration Successful!
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="landing-container" style={{ position: 'relative', zIndex: 10, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ textAlign: 'left', marginBottom: '20px', width: '100%', maxWidth: '440px' }}
        >
          <button
            onClick={() => navigate('/role-selection')}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.9rem',
              padding: '0.6rem 1.2rem',
              borderRadius: 'var(--radius-full)',
            }}
          >
            <ArrowLeft size={16} /> Back to Role Selection
          </button>
        </motion.div>

        <motion.div
          layout
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="form-container card"
          style={{
            padding: '3rem',
            maxWidth: '440px',
            width: '100%',
            background: 'rgba(15, 15, 20, 0.4)',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(30px)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              width: '56px',
              height: '56px',
              background: 'linear-gradient(135deg, #06b6d4, #0ea5e9)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              boxShadow: '0 8px 16px rgba(6, 182, 212, 0.3)',
            }}>
              {step === 'signup' ? <Building2 size={28} color="white" /> : <ShieldCheck size={28} color="white" />}
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'white', marginBottom: '0.5rem' }}>
              {step === 'signup' ? 'Company Signup' : 'Verification'}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              {step === 'signup' ? 'Create your recruitment account' : 'Confirm your official email'}
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', padding: '0.8rem', borderRadius: '10px', marginBottom: '1.5rem', fontSize: '0.9rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}
            >
              {error}
            </motion.div>
          )}

          {successMessage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#4ade80', padding: '0.8rem', borderRadius: '10px', marginBottom: '1.5rem', fontSize: '0.9rem', border: '1px solid rgba(34, 197, 94, 0.2)' }}
            >
              {successMessage}
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {step === 'signup' ? (
              <motion.form
                key="signup-form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleSignupSubmit}
                style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
              >
                <div className="input-wrapper">
                  <i className="input-icon" style={{ color: 'var(--accent-cyan)' }}><Key size={18} /></i>
                  <input type="text" name="passkey" placeholder="Company Passkey" value={formData.passkey} onChange={handleChange} required disabled={loading} style={{ paddingRight: '1rem' }} />
                </div>
                <div className="input-wrapper">
                  <i className="input-icon" style={{ color: 'var(--accent-cyan)' }}><Mail size={18} /></i>
                  <input type="email" name="email" placeholder="Official Email" value={formData.email} onChange={handleChange} required disabled={loading} style={{ paddingRight: '1rem' }} />
                </div>
                <div className="input-wrapper">
                  <i className="input-icon" style={{ color: 'var(--accent-cyan)' }}><Lock size={18} /></i>
                  <input type="password" name="password" placeholder="Create Password" value={formData.password} onChange={handleChange} required disabled={loading} style={{ paddingRight: '1rem' }} />
                </div>

                <button type="submit" className="btn" disabled={loading} style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)', height: '3.2rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                  {loading ? 'Sending OTP...' : <>Get Started <ChevronRight size={18} /></>}
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="otp-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleOtpSubmit}
                style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
              >
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                  Code sent to <strong>{formData.email}</strong>
                </p>
                <div className="input-wrapper">
                  <i className="input-icon" style={{ color: 'var(--accent-cyan)' }}><ShieldCheck size={18} /></i>
                  <input type="text" placeholder="6-digit OTP" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} required disabled={loading} style={{ textAlign: 'center', letterSpacing: '8px', fontSize: '1.2rem', paddingLeft: '1rem' }} />
                </div>

                <button type="submit" className="btn" disabled={loading} style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)', height: '3.2rem', marginTop: '0.5rem' }}>
                  {loading ? 'Verifying...' : 'Verify & Continue'}
                </button>

                <div style={{ textAlign: 'center' }}>
                  {!canResend ? (
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Resend in {formatTime(remainingTime)}
                    </p>
                  ) : (
                    <button type="button" onClick={handleResendOTP} disabled={isResending} style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', cursor: 'pointer', fontSize: '0.85rem', textDecoration: 'underline' }}>
                      {isResending ? 'Resending...' : 'Resend Code'}
                    </button>
                  )}
                </div>

                <button type="button" onClick={() => setStep('signup')} disabled={loading} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.85rem', textDecoration: 'none' }}>
                  Edit details
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          <p style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Already have an account? <Link to="/company/login" style={{ color: 'var(--accent-cyan)', fontWeight: 600, textDecoration: 'none' }}>Login</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default CompanySignup;