import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, Building2, ShieldCheck, ArrowLeft, ChevronRight } from 'lucide-react';
import BlurText from '../components/ui/BlurText';
import ElectricBorder from '../components/ui/ElectricBorder';
import LiquidEther from '../components/ui/LiquidEther';
import '../App.css';

const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-primary)',
      overflow: 'hidden',
    }}>
      {/* Background */}
      <LiquidEther style={{ position: 'absolute', inset: 0, zIndex: 1, width: '100vw', height: '100vh' }} />

      {/* Content */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        textAlign: 'center',
        padding: '2rem',
        width: '100%',
        maxWidth: '1000px',
      }}>
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <button
            onClick={() => navigate('/select-university')}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: 'var(--text-secondary)',
              padding: '0.5rem 1.25rem',
              borderRadius: 'var(--radius-full)',
              cursor: 'pointer',
              fontSize: '0.85rem',
              marginBottom: '2.5rem',
              transition: 'all 0.2s',
              fontFamily: 'inherit',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
            }}
          >
            <ArrowLeft size={14} /> Back to University Selection
          </button>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 800,
            marginBottom: '0.75rem',
            background: 'var(--gradient-primary)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'inline-block'
          }}>
            <BlurText
              text="Welcome to Startin'"
              delay={30}
              animateBy="letters"
              direction="bottom"
            />
          </div>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '1.1rem',
            marginBottom: '3rem',
          }}>
            Select your role to access the portal
          </p>
        </motion.div>

        {/* Role Selection Cards */}
        <div style={{
          display: 'flex',
          gap: '2rem',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}>
          {/* Student Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div style={{ width: '360px', height: '400px' }}>
              <ElectricBorder className="" speed={0.15} chaos={0.015} color="#FF9FFC" borderRadius={24} style={{ height: '100%' }}>
                <div
                  onClick={() => navigate('/student/login')}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    padding: '2.5rem',
                    cursor: 'pointer',
                    textAlign: 'center',
                    background: 'rgba(255, 159, 252, 0.05)',
                    backdropFilter: 'blur(5px)',
                    borderRadius: '24px',
                  }}
                >
                  <div style={{
                    marginBottom: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FF9FFC',
                    filter: 'drop-shadow(0 0 20px rgba(255, 159, 252, 0.5))',
                  }}>
                    <GraduationCap size={64} strokeWidth={1.5} />
                  </div>
                  <h2 style={{
                    fontSize: '1.5rem',
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 700,
                    color: '#FF9FFC',
                    marginBottom: '1rem',
                  }}>
                    Student
                  </h2>
                  <p style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.95rem',
                    lineHeight: 1.6,
                    marginBottom: '2rem',
                    textShadow: '0 2px 4px rgba(0,0,0,0.8)'
                  }}>
                    Find internships, apply to jobs, and build your career.
                  </p>
                  <div style={{
                    padding: '0.75rem 2rem',
                    background: 'linear-gradient(135deg, #FF9FFC, #f472b6)',
                    borderRadius: 'var(--radius-full)',
                    color: 'black',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    boxShadow: '0 4px 15px rgba(255, 159, 252, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    Login as Student <ChevronRight size={18} />
                  </div>
                </div>
              </ElectricBorder>
            </div>
          </motion.div>

          {/* Company Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div style={{ width: '360px', height: '400px' }}>
              <ElectricBorder className="" speed={0.15} chaos={0.015} color="#06b6d4" borderRadius={24} style={{ height: '100%' }}>
                <div
                  onClick={() => navigate('/company/login')}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    padding: '2.5rem',
                    cursor: 'pointer',
                    textAlign: 'center',
                    background: 'rgba(6, 182, 212, 0.05)',
                    backdropFilter: 'blur(5px)',
                    borderRadius: '24px',
                  }}
                >
                  <div style={{
                    marginBottom: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#06b6d4',
                    filter: 'drop-shadow(0 0 20px rgba(6, 182, 212, 0.5))',
                  }}>
                    <Building2 size={64} strokeWidth={1.5} />
                  </div>
                  <h2 style={{
                    fontSize: '1.5rem',
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 700,
                    color: '#06b6d4',
                    marginBottom: '1rem',
                  }}>
                    Company
                  </h2>
                  <p style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.95rem',
                    lineHeight: 1.6,
                    marginBottom: '2rem',
                    textShadow: '0 2px 4px rgba(0,0,0,0.8)'
                  }}>
                    Post jobs, hire talent, and manage applications.
                  </p>
                  <div style={{
                    padding: '0.75rem 2rem',
                    background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
                    borderRadius: 'var(--radius-full)',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    boxShadow: '0 4px 15px rgba(6, 182, 212, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    Login as Company <ChevronRight size={18} />
                  </div>
                </div>
              </ElectricBorder>
            </div>
          </motion.div>
        </div>

        {/* Admin Login */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          style={{ marginTop: '3rem' }}
        >
          <button
            onClick={() => navigate('/admin/login')}
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              color: '#f87171',
              padding: '0.75rem 2rem',
              borderRadius: 'var(--radius-full)',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: 600,
              transition: 'all 0.3s',
              fontFamily: 'inherit',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(239, 68, 68, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <ShieldCheck size={18} /> Admin Login
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Landing;