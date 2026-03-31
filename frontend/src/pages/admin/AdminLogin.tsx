import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Mail, Lock, ArrowLeft, ChevronRight, Loader2 } from 'lucide-react';
import { connectToBackend } from '../../services/api';
import { setAdminId } from '../../utils/auth';
import ColorBends from '../../components/ui/ColorBends';
import '../../App.css';

const AdminLogin: React.FC = () => {
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
      const response = await connectToBackend('admin_login', { email, password });
      if (response.success && response.token) {
        localStorage.setItem('adminToken', response.token);
        if (response.admin_id) setAdminId(response.admin_id);
        setRedirecting(true);
        setTimeout(() => navigate('/admin/dashboard'), 1500);
      } else {
        setError(response.message || 'Verification failed. Access denied.');
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Security server error.');
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      <ColorBends speed={0.05} colors={['#b91c1c', '#7f1d1d', '#450a0a', '#dc2626']} />
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(5, 5, 8, 0.85)', backdropFilter: 'blur(12px)' }} />

      <div className="landing-container" style={{ position: 'relative', zIndex: 10, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ textAlign: 'left', marginBottom: '20px', width: '100%', maxWidth: '420px' }}
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
            <ArrowLeft size={16} /> Exit to Selection
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="form-container card"
          style={{
            padding: '3.5rem',
            maxWidth: '420px',
            width: '100%',
            background: 'rgba(20, 10, 10, 0.4)',
            border: '1px solid rgba(220, 38, 38, 0.2)',
            backdropFilter: 'blur(30px)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{
              width: '72px',
              height: '72px',
              background: 'rgba(220, 38, 38, 0.1)',
              borderRadius: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              border: '1px solid rgba(220, 38, 38, 0.3)',
            }}>
              <ShieldAlert size={36} color="#ef4444" />
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'white', marginBottom: '0.5rem' }}>
              Admin Access
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Authorized Personnel Only
            </p>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'rgba(220, 38, 38, 0.1)', color: '#ef4444', padding: '0.8rem', borderRadius: '10px', marginBottom: '1.5rem', fontSize: '0.9rem', border: '1px solid rgba(220, 38, 38, 0.2)', textAlign: 'center' }}>
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="input-wrapper">
              <i className="input-icon"><Mail size={18} /></i>
              <input type="email" placeholder="Access Email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} style={{ paddingRight: '1rem', borderColor: 'rgba(220, 38, 38, 0.1)' }} />
            </div>
            <div className="input-wrapper">
              <i className="input-icon"><Lock size={18} /></i>
              <input type="password" placeholder="Access Password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading} style={{ paddingRight: '1rem', borderColor: 'rgba(220, 38, 38, 0.1)' }} />
            </div>
            <button type="submit" className="btn" disabled={loading} style={{ height: '3.3rem', marginTop: '0.5rem', background: '#dc2626', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              {loading ? <Loader2 className="animate-spin" size={20} /> : <>Verify Credentials <ChevronRight size={18} /></>}
            </button>
          </form>

          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
              System security protocols active
            </p>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {redirecting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.9)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              backdropFilter: 'blur(5px)'
            }}
          >
            <Loader2 className="animate-spin" size={48} color="#ef4444" />
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ color: 'white', marginTop: '24px', fontSize: '1.1rem', fontWeight: 500 }}>
              Identity Verified. Loading Secure Hub...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminLogin;
