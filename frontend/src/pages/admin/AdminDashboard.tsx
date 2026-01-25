import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminId } from '../../utils/auth';
import axios from 'axios';
import '../../App.css';

interface University {
  id: number;
  universityName: string;
  passkey: string;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [adminId, setAdminId] = useState<string | null>(null);
  const [showUniversityModal, setShowUniversityModal] = useState(false);
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadMessage, setUploadMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

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

  const fetchUniversities = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/admin/universities');
      if (response.data.success) {
        setUniversities(response.data.universities);
      }
    } catch (error) {
      console.error('Error fetching universities:', error);
      setUploadMessage({ type: 'error', text: 'Failed to fetch universities' });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadFile(e.target.files[0]);
      setUploadMessage(null);
    }
  };

  const handleFileUpload = async () => {
    if (!uploadFile) {
      setUploadMessage({ type: 'error', text: 'Please select a file' });
      return;
    }

    const formData = new FormData();
    formData.append('file', uploadFile);

    setLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:5000/api/admin/universities/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        setUploadMessage({
          type: 'success',
          text: `Successfully added ${response.data.added} and updated ${response.data.updated} universities`
        });
        setUploadFile(null);
        fetchUniversities();
      }
    } catch (error: any) {
      setUploadMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to upload file'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUniversity = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this university?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await axios.delete(`http://localhost:5000/api/admin/universities/${id}`);
      if (response.data.success) {
        setUploadMessage({ type: 'success', text: 'University deleted successfully' });
        fetchUniversities();
      }
    } catch (error: any) {
      setUploadMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to delete university'
      });
    } finally {
      setLoading(false);
    }
  };

  const openUniversityModal = () => {
    setShowUniversityModal(true);
    setUploadMessage(null);
    fetchUniversities();
  };

  const closeUniversityModal = () => {
    setShowUniversityModal(false);
    setUploadFile(null);
    setUploadMessage(null);
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

          {/* Manage Universities */}
          <div 
            className="card" 
            onClick={openUniversityModal}
            style={{
              padding: '30px',
              cursor: 'pointer',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div style={{
              fontSize: '3rem',
              marginBottom: '15px'
            }}>🎓</div>
            <h3 style={{ color: '#059669', marginBottom: '10px' }}>
              Manage Universities
            </h3>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>
              View and update university database
            </p>
          </div>
        </div>

        {/* University Management Modal */}
        {showUniversityModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            padding: '20px'
          }}>
            <div style={{
              background: 'white',
              borderRadius: '10px',
              padding: '30px',
              maxWidth: '800px',
              width: '100%',
              maxHeight: '80vh',
              overflow: 'auto'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px'
              }}>
                <h2 style={{ color: '#059669', margin: 0 }}>Manage Universities</h2>
                <button
                  onClick={closeUniversityModal}
                  style={{
                    background: '#dc2626',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    padding: '8px 16px',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  Close
                </button>
              </div>

              {/* Upload Section */}
              <div style={{
                background: '#f0fdf4',
                padding: '20px',
                borderRadius: '8px',
                marginBottom: '20px'
              }}>
                <h3 style={{ color: '#059669', marginBottom: '15px' }}>Upload Universities</h3>
                <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '15px' }}>
                  Upload a CSV or Excel file with columns: <code>universityName</code> and <code>passkey</code>
                </p>
                
                <div style={{ marginBottom: '15px' }}>
                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileChange}
                    style={{
                      padding: '10px',
                      border: '1px solid #d1d5db',
                      borderRadius: '5px',
                      width: '100%'
                    }}
                  />
                </div>

                <button
                  onClick={handleFileUpload}
                  disabled={!uploadFile || loading}
                  style={{
                    padding: '10px 20px',
                    background: uploadFile && !loading ? '#059669' : '#d1d5db',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: uploadFile && !loading ? 'pointer' : 'not-allowed',
                    fontSize: '0.9rem'
                  }}
                >
                  {loading ? 'Processing...' : 'Upload File'}
                </button>

                {uploadMessage && (
                  <div style={{
                    marginTop: '15px',
                    padding: '10px',
                    borderRadius: '5px',
                    background: uploadMessage.type === 'success' ? '#d1fae5' : '#fee2e2',
                    color: uploadMessage.type === 'success' ? '#059669' : '#dc2626',
                    fontSize: '0.9rem'
                  }}>
                    {uploadMessage.text}
                  </div>
                )}
              </div>

              {/* Universities List */}
              <div>
                <h3 style={{ color: '#059669', marginBottom: '15px' }}>
                  Existing Universities ({universities.length})
                </h3>
                
                {loading ? (
                  <p style={{ textAlign: 'center', color: '#666' }}>Loading...</p>
                ) : universities.length === 0 ? (
                  <p style={{ textAlign: 'center', color: '#666' }}>No universities found</p>
                ) : (
                  <div style={{ maxHeight: '300px', overflow: 'auto' }}>
                    <table style={{
                      width: '100%',
                      borderCollapse: 'collapse'
                    }}>
                      <thead>
                        <tr style={{ background: '#f3f4f6' }}>
                          <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #d1d5db' }}>ID</th>
                          <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #d1d5db' }}>University Name</th>
                          <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #d1d5db' }}>Passkey</th>
                          <th style={{ padding: '10px', textAlign: 'center', borderBottom: '2px solid #d1d5db' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {universities.map((uni) => (
                          <tr key={uni.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                            <td style={{ padding: '10px' }}>{uni.id}</td>
                            <td style={{ padding: '10px' }}>{uni.universityName}</td>
                            <td style={{ padding: '10px' }}>{uni.passkey}</td>
                            <td style={{ padding: '10px', textAlign: 'center' }}>
                              <button
                                onClick={() => handleDeleteUniversity(uni.id)}
                                disabled={loading}
                                style={{
                                  padding: '5px 10px',
                                  background: '#dc2626',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '4px',
                                  cursor: loading ? 'not-allowed' : 'pointer',
                                  fontSize: '0.8rem'
                                }}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

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
