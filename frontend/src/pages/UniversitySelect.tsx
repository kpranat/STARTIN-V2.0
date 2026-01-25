import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
      const response = await axios.get('http://localhost:5000/api/admin/universities');
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

  // Filter list based on what user types
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
      const response = await axios.post('http://localhost:5000/api/universities/verify-passkey', {
        passkey: passkey
      });

      if (response.data.success) {
        // Store university details in localStorage
        localStorage.setItem('selected_university_id', response.data.university.id.toString());
        localStorage.setItem('selected_university_name', response.data.university.universityName);
        
        // Navigate to role selection
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
      <div className="container landing-container" style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Loading universities...</h2>
      </div>
    );
  }

  if (selectedUniversity) {
    return (
      <div className="container landing-container" style={{ textAlign: 'center', maxWidth: '500px', margin: '50px auto' }}>
        <button
          onClick={handleBack}
          style={{
            marginBottom: '20px',
            padding: '10px 20px',
            background: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          ← Back
        </button>
        
        <h1>Verify University Access</h1>
        <h2 style={{ color: '#dc2626', marginBottom: '30px' }}>{selectedUniversity.universityName}</h2>
        
        <form onSubmit={handleVerifyPasskey} style={{ marginTop: '30px' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
              Enter University Passkey
            </label>
            <input
              type="password"
              value={passkey}
              onChange={(e) => setPasskey(e.target.value)}
              placeholder="Enter passkey"
              style={{
                padding: '15px',
                width: '100%',
                fontSize: '1rem',
                borderRadius: '8px',
                border: '2px solid #ddd'
              }}
            />
          </div>

          {error && (
            <div style={{
              padding: '10px',
              background: '#fee2e2',
              color: '#dc2626',
              borderRadius: '5px',
              marginBottom: '15px'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={verifying}
            style={{
              padding: '15px 40px',
              background: verifying ? '#d1d5db' : '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: verifying ? 'not-allowed' : 'pointer',
              fontSize: '1.1rem',
              width: '100%'
            }}
          >
            {verifying ? 'Verifying...' : 'Verify & Continue'}
          </button>
        </form>
      </div>
    );
  }

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

      {error && (
        <div style={{
          padding: '10px',
          background: '#fee2e2',
          color: '#dc2626',
          borderRadius: '5px',
          marginBottom: '15px',
          maxWidth: '500px',
          margin: '0 auto 15px'
        }}>
          {error}
        </div>
      )}

      {/* Results List */}
      <div className="uni-list">
        {filteredUnis.length > 0 ? (
          filteredUnis.map((uni) => (
            <div 
              key={uni.id} 
              className="uni-card" 
              onClick={() => handleSelectUniversity(uni)}
            >
              <h3>{uni.universityName}</h3>
              <span className="arrow">→</span>
            </div>
          ))
        ) : (
          <p>No university found. Contact admin to add your university.</p>
        )}
      </div>
    </div>
  );
};

export default UniversitySelect;