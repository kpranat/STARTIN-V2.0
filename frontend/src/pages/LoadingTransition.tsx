import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../App.css';

const LoadingTransition: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const targetPath = location.state?.target || '/';

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(targetPath, { replace: true });
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigate, targetPath]);

  return (
    <div className="loading-container">
      <div className="loader-ring">
        <div></div><div></div><div></div><div></div>
      </div>
      <h2 className="loading-text">Preparing your dashboard...</h2>
    </div>
  );
};

export default LoadingTransition;