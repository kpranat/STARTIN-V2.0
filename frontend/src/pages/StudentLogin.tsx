import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowLeft, ChevronRight, LogIn } from 'lucide-react';
import { connectToBackend } from '../services/api';
import { setStudentId, setUniversityId, setUniversityName } from '../utils/auth';
import ColorBends from '../components/ui/ColorBends';
import '../App.css';

const StudentLogin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const selectedUniversityId = localStorage.getItem('selected_university_id');
      if (!selectedUniversityId) {
        setError('University not selected. Please go back to university selection.');
        setLoading(false);
        navigate('/select-university');
        return;
      }

      const response = await connectToBackend('student_login', {
        email,
        password,
        universityId: selectedUniversityId
      });

      if (response.success && response.token) {
        localStorage.setItem('studentToken', response.token);
        if (response.student_id) setStudentId(response.student_id);
        if (response.university_id) {
          setUniversityId(response.university_id);
          const universityName = localStorage.getItem('selected_university_name');
          if (universityName) setUniversityName(universityName);
        }
        setRedirecting(true);
        setTimeout(() => navigate('/student/profile-check'), 1000);
      } else {
        setError(response.message || 'Invalid credentials');
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Server error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      <ColorBends speed={0.1} colors={['#6b21a8', '#db2777', '#3b82f6', '#7c3aed']} />
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(5, 5, 8, 0.65)', backdropFilter: 'blur(5px)' }} />

      <AnimatePresence>
        {redirecting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.8)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              backdropFilter: 'blur(20px)'
            }}
          >
            <div className="loader-ring">
              <div></div><div></div><div></div><div></div>
            </div>
            <p style={{ color: 'white', marginTop: '20px', fontSize: '1.2rem', fontWeight: 500, letterSpacing: '0.5px' }}>
              Login Verified! Redirecting...
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="landing-container" style={{ position: 'relative', zIndex: 10, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
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
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
            }}
          >
            <ArrowLeft size={16} /> Back to Role Selection
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: 'spring', damping: 20 }}
          className="form-container card"
          style={{
            padding: '3rem',
            maxWidth: '440px',
            width: '100%',
            background: 'rgba(15, 15, 20, 0.4)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(30px)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              width: '56px',
              height: '56px',
              background: 'var(--gradient-primary)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              boxShadow: '0 8px 16px rgba(139, 92, 246, 0.3)',
            }}>
              <LogIn size={28} color="white" />
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'white', marginBottom: '0.5rem' }}>Student Login</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Sign in to your university portal</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                color: '#f87171',
                padding: '0.8rem 1rem',
                borderRadius: '10px',
                marginBottom: '1.5rem',
                fontSize: '0.9rem',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="input-wrapper">
              <i className="input-icon"><Mail size={18} /></i>
              <input
                type="email"
                placeholder="Student Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
                style={{ paddingRight: '1rem' }}
              />
            </div>
            <div className="input-wrapper">
              <i className="input-icon"><Lock size={18} /></i>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
                style={{ paddingRight: '1rem' }}
              />
            </div>

            <div style={{ textAlign: 'right', marginTop: '-0.5rem' }}>
              <Link to="/student/forgot-password" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-purple)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="btn"
              disabled={loading}
              style={{
                width: '100%',
                marginTop: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                background: 'var(--gradient-primary)',
                height: '3.2rem'
              }}
            >
              {loading ? 'Authenticating...' : (
                <>
                  Login <ChevronRight size={18} />
                </>
              )}
            </button>
          </form>

          <p style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Don't have an account? <Link to="/student/signup" style={{ color: 'var(--accent-purple)', fontWeight: 600, textDecoration: 'none' }}>Sign Up</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentLogin;