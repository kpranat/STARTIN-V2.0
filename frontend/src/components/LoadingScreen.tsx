import React from 'react';
import '../App.css';

interface LoadingScreenProps {
  text?: string;
  theme?: 'student' | 'company'; // Allows styling based on user role
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ text = "Please wait...", theme = 'student' }) => {
  return (
    <div className={`loading-screen ${theme}-theme`}>
      <div className="loader-spinner"></div>
      <h2 className="loading-text">{text}</h2>
    </div>
  );
};

export default LoadingScreen;