import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Mock list of universities (You can fetch this from backend later)
const UNIVERSITIES = [
  { id: 'srm-k', name: 'SRM Institute of Science and Technology (KTR)' },
  { id: 'srm-r', name: 'SRM Ramapuram' },
  { id: 'vit', name: 'Vellore Institute of Technology' },
  { id: 'iitm', name: 'IIT Madras' },
  { id: 'mit', name: 'Manipal Institute of Technology' },
];

const UniversitySelect = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Filter list based on what user types
  const filteredUnis = UNIVERSITIES.filter((uni) =>
    uni.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (uniId: string, uniName: string) => {
    // 1. Save selection to Local Storage (so we know their college later)
    localStorage.setItem('selected_university', uniId);
    console.log(`User selected: ${uniName}`);

    // 2. Move to the next page (Role Selection)
    navigate('/role-selection');
  };

  return (
    <div className="container landing-container" style={{ textAlign: 'center' }}>
      <h1>Select Your Campus</h1>
      <p>Join your university's exclusive startup ecosystem.</p>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search for your university..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          padding: '15px',
          width: '80%',
          maxWidth: '500px',
          fontSize: '1.1rem',
          borderRadius: '30px',
          marginBottom: '2rem',
          border: '2px solid #ddd',
          textAlign: 'center'
        }}
      />

      {/* Results List */}
      <div className="uni-list">
        {filteredUnis.length > 0 ? (
          filteredUnis.map((uni) => (
            <div 
              key={uni.id} 
              className="uni-card" 
              onClick={() => handleSelect(uni.id, uni.name)}
            >
              <h3>{uni.name}</h3>
              <span className="arrow">→</span>
            </div>
          ))
        ) : (
          <p>No university found. <a href="#" className="link">Request to add yours?</a></p>
        )}
      </div>
    </div>
  );
};

export default UniversitySelect;