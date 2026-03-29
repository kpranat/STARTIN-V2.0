import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ShieldCheck, Key, Lock, ArrowLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { connectToBackend } from '../services/api';
import { sendPasswordResetEmail } from '../services/emailService';
import ColorBends from '../components/ui/ColorBends';
import '../App.css';

const CompanyForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState<'email' | 'token' | 'password' | 'verifying' | 'linkSent'>('email');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const urlToken = searchParams.get('token');
    if (urlToken) {
      setToken(urlToken);
      setStep('verifying');
      verifyTokenFromUrl(urlToken);
    }
  }, [searchParams]);

  const verifyTokenFromUrl = async (urlToken: string) => {
    setLoading(true);
    setError('');
    try {
      const response = await connectToBackend('company_verify_reset_token', { token: urlToken });
      if (response.success) {
        setEmail(response.email);
        setSuccess('Token verified! Choose your new password.');
        setStep('password');
      } else {
        setError(response.message || 'Invalid or expired token');
        setStep('email');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid token');
      setStep('email');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const selectedUniversityId = localStorage.getItem('selected_university_id');
      if (!selectedUniversityId) {
        setError('University missing. Please return home.');
        setLoading(false);
        return;
      }
      const response = await connectToBackend('company_request_reset', { email, universityId: selectedUniversityId });
      if (response.success) {
        try {
          await sendPasswordResetEmail(email, response.token, 'company');
          setSuccess('Reset link dispatched to your inbox.');
          setStep('linkSent');
        } catch (emailError) {
          setSuccess('Token generated. Please check your email.');
          setStep('token');
        }
      } else {
        setError(response.message || 'Reset request failed');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Request failed');
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
      const response = await connectToBackend('company_verify_reset_token', { token });
      if (response.success) {
        setSuccess('Token verified!');
        setStep('password');
      } else {
        setError(response.message || 'Invalid token');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid token');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const response = await connectToBackend('company_reset_password', { token, newPassword });
      if (response.success) {
        setSuccess('Password updated successfully!');
        setTimeout(() => navigate('/company/login'), 2000);
      } else {
        setError(response.message || 'Reset failed');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      <ColorBends speed={0.1} colors={['#0891b2', '#06b6d4', '#0d9488', '#22d3ee']} />
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(5, 5, 8, 0.75)', backdropFilter: 'blur(10px)' }} />

      <div className="landing-container" style={{ position: 'relative', zIndex: 10, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ textAlign: 'left', marginBottom: '20px', width: '100%', maxWidth: '440px' }}
        >
          <button
            onClick={() => navigate('/company/login')}
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
            <ArrowLeft size={16} /> Back to Login
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
            background: 'rgba(15, 20, 20, 0.4)',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(30px)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              width: '64px',
              height: '64px',
              background: 'var(--gradient-company)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              boxShadow: '0 8px 16px rgba(8, 145, 178, 0.3)',
            }}>
              {step === 'email' ? <Mail size={32} color="white" /> :
                step === 'password' ? <Lock size={32} color="white" /> :
                  <Key size={32} color="white" />}
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'white', marginBottom: '0.5rem' }}>
              {step === 'email' && 'Forgot Password'}
              {step === 'token' && 'Identity Verified'}
              {step === 'verifying' && 'Verifying...'}
              {step === 'linkSent' && 'Instructions Sent'}
              {step === 'password' && 'Secure Password'}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              {step === 'email' && 'Recover access to your partner portal'}
              {step === 'token' && 'Enter the secure token from your email'}
              {step === 'linkSent' && 'We have dispatched instructions to your email'}
              {step === 'password' && 'Choose a new complex password'}
            </p>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', padding: '0.8rem', borderRadius: '10px', marginBottom: '1.5rem', fontSize: '0.9rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#4ade80', padding: '0.8rem', borderRadius: '10px', marginBottom: '1.5rem', fontSize: '0.9rem', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
              {success}
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {step === 'email' && (
              <motion.form key="email-step" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} onSubmit={handleRequestReset} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="input-wrapper">
                  <i className="input-icon"><Mail size={18} /></i>
                  <input type="email" placeholder="Corporate Email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} style={{ paddingRight: '1rem' }} />
                </div>
                <button type="submit" className="btn btn-company" disabled={loading} style={{ height: '3.2rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                  {loading ? 'Processing...' : <>Send Instructions <ChevronRight size={18} /></>}
                </button>
              </motion.form>
            )}

            {step === 'linkSent' && (
              <motion.div key="sent-step" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '1rem 0' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                  <CheckCircle2 size={48} color="#22d3ee" />
                </div>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                  A reset link is on its way to <strong>{email}</strong>.
                </p>
                <button onClick={() => navigate('/company/login')} className="btn btn-company" style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  Dismiss
                </button>
              </motion.div>
            )}

            {step === 'token' && (
              <motion.form key="token-step" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} onSubmit={handleVerifyToken} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="input-wrapper">
                  <i className="input-icon"><ShieldCheck size={18} /></i>
                  <input type="text" placeholder="Security Token" value={token} onChange={(e) => setToken(e.target.value)} required disabled={loading} style={{ paddingRight: '1rem' }} />
                </div>
                <button type="submit" className="btn btn-company" disabled={loading} style={{ height: '3.2rem', marginTop: '0.5rem' }}>
                  {loading ? 'Verifying...' : 'Validate Token'}
                </button>
                <button type="button" onClick={() => setStep('email')} className="btn" style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Resend token
                </button>
              </motion.form>
            )}

            {step === 'password' && (
              <motion.form key="pass-step" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="input-wrapper">
                  <i className="input-icon"><Lock size={18} /></i>
                  <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required disabled={loading} minLength={6} style={{ paddingRight: '1rem' }} />
                </div>
                <div className="input-wrapper">
                  <i className="input-icon"><Lock size={18} /></i>
                  <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required disabled={loading} minLength={6} style={{ paddingRight: '1rem' }} />
                </div>
                <button type="submit" className="btn btn-company" disabled={loading} style={{ height: '3.2rem', marginTop: '0.5rem' }}>
                  {loading ? 'Updating...' : 'Set Password'}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          <p style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Direct access? <Link to="/company/login" style={{ color: 'var(--accent-cyan)', fontWeight: 600, textDecoration: 'none' }}>Login</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default CompanyForgotPassword;
