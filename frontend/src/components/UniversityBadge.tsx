import React from 'react';
import { getUniversityName } from '../utils/auth';

interface UniversityBadgeProps {
  style?: React.CSSProperties;
}

const UniversityBadge: React.FC<UniversityBadgeProps> = ({ style }) => {
  const universityName = getUniversityName();

  if (!universityName) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        background: '#dc2626',
        color: 'white',
        padding: '10px 15px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        zIndex: 1000,
        fontSize: '0.85rem',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        ...style
      }}
    >
      <span style={{ fontSize: '1.2rem' }}>🎓</span>
      <span>{universityName}</span>
    </div>
  );
};

export default UniversityBadge;
