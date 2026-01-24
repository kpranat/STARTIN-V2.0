import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminId } from '../../utils/auth';
import '../../App.css';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [adminId, setAdminId] = useState<string | null>(null);

  useEffect(() => {
    // Check if admin is authenticated
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    // Get admin ID
    const id = getAdminId();
    setAdminId(id);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    sessionStorage.clear();
    navigate('/admin/login');
  };

  return (
    <div className="landing-container">
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '20px',
        textAlign: 'center' 
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '40px',
          padding: '20px',
          background: 'white',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{ color: '#dc2626', margin: 0 }}>Admin Dashboard</h1>
          <button 
            onClick={handleLogout}
            style={{
              padding: '10px 20px',
              background: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            Logout
          </button>
        </div>

        {/* Welcome Message */}
        <div className="card" style={{ marginBottom: '30px', padding: '30px' }}>
          <h2 style={{ color: '#333', marginBottom: '10px' }}>
            Welcome, Admin!
          </h2>
          {adminId && (
            <p style={{ color: '#666', fontSize: '0.9rem' }}>
              Admin ID: {adminId}
            </p>
          )}
        </div>

        {/* Dashboard Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginTop: '30px'
        }}>
          {/* Manage Students */}
          <div className="card" style={{
            padding: '30px',
            cursor: 'pointer',
            transition: 'transform 0.2s',
            ':hover': { transform: 'scale(1.05)' }
          }}>
            <div style={{
              fontSize: '3rem',
              marginBottom: '15px'
            }}>👨‍🎓</div>
            <h3 style={{ color: '#4f46e5', marginBottom: '10px' }}>
              Manage Students
            </h3>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>
              View and manage student accounts
            </p>
          </div>

          {/* Manage Companies */}
          <div className="card" style={{
            padding: '30px',
            cursor: 'pointer',
            transition: 'transform 0.2s'
          }}>
            <div style={{
              fontSize: '3rem',
              marginBottom: '15px'
            }}>🏢</div>
            <h3 style={{ color: '#0f766e', marginBottom: '10px' }}>
              Manage Companies
            </h3>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>
              View and manage company accounts
            </p>
          </div>

          {/* Job Postings */}
          <div className="card" style={{
            padding: '30px',
            cursor: 'pointer',
            transition: 'transform 0.2s'
          }}>
            <div style={{
              fontSize: '3rem',
              marginBottom: '15px'
            }}>💼</div>
            <h3 style={{ color: '#7c3aed', marginBottom: '10px' }}>
              Job Postings
            </h3>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>
              Monitor and manage job listings
            </p>
          </div>

          {/* Analytics */}
          <div className="card" style={{
            padding: '30px',
            cursor: 'pointer',
            transition: 'transform 0.2s'
          }}>
            <div style={{
              fontSize: '3rem',
              marginBottom: '15px'
            }}>📊</div>
            <h3 style={{ color: '#ea580c', marginBottom: '10px' }}>
              Analytics
            </h3>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>
              View platform statistics
            </p>
          </div>
        </div>

        {/* Status Message */}
        <div style={{
          marginTop: '40px',
          padding: '20px',
          background: '#f0f9ff',
          borderRadius: '10px',
          border: '1px solid #bae6fd'
        }}>
          <p style={{ color: '#0369a1', margin: 0 }}>
            ℹ️ Admin dashboard features are under development
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
