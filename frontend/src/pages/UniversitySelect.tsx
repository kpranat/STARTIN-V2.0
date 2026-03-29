import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, School, ShieldCheck, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import axios from 'axios';
import DotGrid from '../components/ui/DotGrid';
import '../App.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface University {
  id: number;
  universityName: string;
}

const UniversitySelect = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [passkey, setPasskey] = useState('');
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUniversities();
  }, []);

  const fetchUniversities = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/admin/universities`);
      if (response.data.success) {
        setUniversities(response.data.universities);
      }
    } catch (error) {
      console.error('Error fetching universities:', error);
      setError('Failed to load universities');
    } finally {
      setLoading(false);
    }
  };

  const filteredUnis = universities.filter((uni) =>
    uni.universityName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectUniversity = (uni: University) => {
    setSelectedUniversity(uni);
    setError('');
    setPasskey('');
  };

  const handleVerifyPasskey = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!passkey.trim()) {
      setError('Please enter the university passkey');
      return;
    }

    setVerifying(true);
    setError('');

    try {
      const response = await axios.post(`${API_BASE_URL}/api/universities/verify-passkey`, {
        passkey: passkey
      });

      if (response.data.success) {
        localStorage.setItem('selected_university_id', response.data.university.id.toString());
        localStorage.setItem('selected_university_name', response.data.university.universityName);
        navigate('/role-selection');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Invalid passkey. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  const handleBack = () => {
    setSelectedUniversity(null);
    setPasskey('');
    setError('');
  };

  if (loading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-primary)',
      }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="loading-container"
          style={{ background: 'transparent', textAlign: 'center' }}
        >
          <Loader2 className="animate-spin" size={48} color="var(--accent-purple)" style={{ marginBottom: '1rem' }} />
          <h2 className="loading-text" style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>Fetching Campus Directory...</h2>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      background: 'var(--bg-primary)',
    }}>
      {/* Fixed DotGrid Background */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        width: '100vw',
        height: '100vh',
        background: 'var(--bg-primary)'
      }}>
        <DotGrid
          dotSize={4}
          gap={20}
          baseColor="#271E37"
          activeColor="#5227FF"
          proximity={120}
          shockRadius={250}
          shockStrength={5}
          resistance={750}
          returnDuration={1.5}
        />
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {selectedUniversity ? (
          <motion.div
            key="verify"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            style={{
              position: 'relative',
              zIndex: 2,
              width: '100%',
              maxWidth: '480px',
              padding: '0 1.5rem',
            }}
          >
            <div style={{
              background: 'rgba(255, 255, 255, 0.04)',
              backdropFilter: 'blur(30px)',
              WebkitBackdropFilter: 'blur(30px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 'var(--radius-xl)',
              padding: '3rem',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
            }}>
              <button
                onClick={handleBack}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'var(--text-secondary)',
                  padding: '0.5rem 1.2rem',
                  borderRadius: 'var(--radius-full)',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  marginBottom: '2rem',
                  transition: 'all 0.2s',
                  fontFamily: 'inherit',
                }}
              >
                <ArrowLeft size={16} /> Back
              </button>

              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  background: 'rgba(82, 39, 255, 0.1)',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem',
                  border: '1px solid rgba(82, 39, 255, 0.2)',
                }}>
                  <ShieldCheck size={32} color="#5227FF" />
                </div>
                <h1 style={{
                  fontSize: '1.6rem',
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  marginBottom: '0.5rem',
                }}>
                  Verify Access
                </h1>
                <p style={{
                  color: '#5227FF',
                  fontSize: '1.05rem',
                  fontWeight: 600,
                  marginBottom: '2rem',
                }}>
                  {selectedUniversity.universityName}
                </p>
              </div>

              <form onSubmit={handleVerifyPasskey}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: 500,
                    color: 'var(--text-secondary)',
                    fontSize: '0.9rem',
                  }}>
                    University Passkey
                  </label>
                  <input
                    type="password"
                    value={passkey}
                    onChange={(e) => setPasskey(e.target.value)}
                    placeholder="Enter your passkey"
                    style={{
                      width: '100%',
                      padding: '1rem',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--text-primary)',
                      fontSize: '1rem',
                      fontFamily: 'inherit',
                      transition: 'all 0.2s',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      style={{
                        padding: '0.75rem 1rem',
                        background: 'rgba(239, 68, 68, 0.1)',
                        color: '#f87171',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        borderRadius: 'var(--radius-sm)',
                        marginBottom: '1rem',
                        fontSize: '0.9rem',
                      }}
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={verifying}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    background: verifying ? 'rgba(255, 255, 255, 0.1)' : 'var(--gradient-primary)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    cursor: verifying ? 'not-allowed' : 'pointer',
                    fontSize: '1rem',
                    fontWeight: 600,
                    transition: 'all 0.3s',
                    boxShadow: verifying ? 'none' : '0 4px 20px rgba(139, 92, 246, 0.3)',
                    fontFamily: 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px'
                  }}
                >
                  {verifying ? 'Verifying...' : <>Confirm & Continue <ArrowRight size={18} /></>}
                </button>
              </form>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="select"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            style={{
              position: 'relative',
              zIndex: 2,
              width: '100%',
              maxWidth: '600px',
              padding: '0 1.5rem',
            }}
          >
            <div style={{
              background: 'rgba(255, 255, 255, 0.04)',
              backdropFilter: 'blur(30px)',
              WebkitBackdropFilter: 'blur(30px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 'var(--radius-xl)',
              padding: '3rem',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
            }}>
              <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                  style={{
                    width: '80px',
                    height: '80px',
                    background: '#5227FF',
                    borderRadius: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                    boxShadow: '0 12px 24px rgba(82, 39, 255, 0.4)',
                  }}
                >
                  <School size={40} color="white" />
                </motion.div>
                <h1 style={{
                  fontSize: '2rem',
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 800,
                  color: 'white',
                  marginBottom: '0.5rem',
                }}>
                  Select Your Campus
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
                  Join your university's exclusive startup ecosystem.
                </p>
              </div>

              {/* Search Input */}
              <div style={{ position: 'relative', marginBottom: '2rem' }}>
                <div style={{
                  position: 'absolute',
                  left: '1.25rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                  pointerEvents: 'none',
                }}>
                  <Search size={20} />
                </div>
                <input
                  type="text"
                  placeholder="Search for your university..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '1.1rem 1.1rem 1.1rem 3.5rem',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 'var(--radius-full)',
                    color: 'var(--text-primary)',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    transition: 'all 0.3s',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    style={{
                      padding: '0.75rem 1rem',
                      background: 'rgba(239, 68, 68, 0.1)',
                      color: '#f87171',
                      border: '1px solid rgba(239, 68, 68, 0.2)',
                      borderRadius: 'var(--radius-sm)',
                      marginBottom: '1rem',
                      fontSize: '0.9rem',
                    }}
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* University List */}
              <div style={{
                maxHeight: '320px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                paddingRight: '6px',
              }}>
                {filteredUnis.length > 0 ? (
                  filteredUnis.map((uni, index) => (
                    <motion.div
                      key={uni.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleSelectUniversity(uni)}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '16px 24px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        borderRadius: 'var(--radius-lg)',
                        cursor: 'pointer',
                        transition: 'all 0.25s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(139, 92, 246, 0.08)';
                        e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.2)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <span style={{
                        color: 'var(--text-primary)',
                        fontWeight: 500,
                        fontSize: '1rem',
                      }}>
                        {uni.universityName}
                      </span>
                      <ArrowRight size={18} color="var(--accent-purple)" />
                    </motion.div>
                  ))
                ) : (
                  <p style={{
                    textAlign: 'center',
                    color: 'var(--text-muted)',
                    padding: '2rem',
                    fontSize: '0.9rem',
                  }}>
                    No university found. Contact admin to add your university.
                  </p>
                )}
              </div>

              {/* Admin Login */}
              <div style={{
                marginTop: '2.5rem',
                paddingTop: '1.5rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                textAlign: 'center',
              }}>
                <button
                  onClick={() => navigate('/admin/login')}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'var(--text-secondary)',
                    padding: '0.75rem 2rem',
                    borderRadius: 'var(--radius-full)',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    transition: 'all 0.2s',
                    fontFamily: 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    margin: '0 auto'
                  }}
                >
                  <ShieldCheck size={16} /> Admin Portal
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UniversitySelect;