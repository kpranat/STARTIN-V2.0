import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStudentId } from '../utils/auth';
import { api } from '../services/api';

const StudentProfileCheck: React.FC = () => {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkProfile = async () => {
      try {
        const studentId = getStudentId();
        
        if (!studentId) {
          // No student ID found, redirect to login
          navigate('/student/login');
          return;
        }

        // Check if profile exists
        const response = await api.student.checkProfile(studentId);
        
        if (response.data.success && response.data.hasProfile) {
          // Profile exists, go to dashboard/home
          navigate('/student/home');
        } else {
          // No profile, go to setup
          navigate('/student/profile-setup');
        }
      } catch (error) {
        console.error('Error checking profile:', error);
        // On error, redirect to profile setup to be safe
        navigate('/student/profile-setup');
      } finally {
        setChecking(false);
      }
    };

    checkProfile();
  }, [navigate]);

  if (checking) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: '#f9fafb',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '5px solid #f3f3f3',
          borderTop: '5px solid #4f46e5',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <p style={{ color: '#4f46e5', marginTop: '20px', fontSize: '1.1rem' }}>
          Checking your profile...
        </p>
        <style>{
          `@keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }`
        }</style>
      </div>
    );
  }

  return null;
};

export default StudentProfileCheck;
