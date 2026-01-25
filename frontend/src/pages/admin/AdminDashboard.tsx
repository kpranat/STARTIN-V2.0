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

interface Company {
  passkey: string;
  mailId: string;
  name: string;
  registered: boolean;
  profileComplete?: boolean;
}

interface RegisteredCompany {
  id: number;
  email: string;
  universityId: number;
  name: string;
  website: string;
  location: string;
  about: string;
  profileComplete: boolean;
}

interface Student {
  id: number;
  email: string;
  name: string;
  universityName: string;
  universityId: number;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [adminId, setAdminId] = useState<string | null>(null);
  const [showUniversityModal, setShowUniversityModal] = useState(false);
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [universities, setUniversities] = useState<University[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [registeredCompanies, setRegisteredCompanies] = useState<RegisteredCompany[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadMessage, setUploadMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [companyTab, setCompanyTab] = useState<'verification' | 'registered'>('verification');
  const [showAddCompanyForm, setShowAddCompanyForm] = useState(false);
  const [newCompany, setNewCompany] = useState({
    passkey: '',
    mailId: '',
    name: ''
  });

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

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/admin/companies/verification');
      if (response.data.success) {
        setCompanies(response.data.companies);
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
      setUploadMessage({ type: 'error', text: 'Failed to fetch companies' });
    } finally {
      setLoading(false);
    }
  };

  const fetchRegisteredCompanies = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/admin/companies/registered');
      if (response.data.success) {
        setRegisteredCompanies(response.data.companies);
      }
    } catch (error) {
      console.error('Error fetching registered companies:', error);
      setUploadMessage({ type: 'error', text: 'Failed to fetch registered companies' });
    } finally {
      setLoading(false);
    }
  };

  const openCompanyModal = () => {
    setShowCompanyModal(true);
    setUploadMessage(null);
    fetchCompanies();
    fetchRegisteredCompanies();
  };

  const closeCompanyModal = () => {
    setShowCompanyModal(false);
    setUploadFile(null);
    setUploadMessage(null);
    setShowAddCompanyForm(false);
    setNewCompany({ passkey: '', mailId: '', name: '' });
  };

  const handleCompanyFileUpload = async () => {
    if (!uploadFile) {
      setUploadMessage({ type: 'error', text: 'Please select a file' });
      return;
    }

    const formData = new FormData();
    formData.append('file', uploadFile);

    setLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:5000/admin/companies/upload',
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
          text: response.data.message
        });
        setUploadFile(null);
        // Add newly uploaded companies
        if (response.data.addedCompanies && response.data.addedCompanies.length > 0) {
          const newCompanies = response.data.addedCompanies.map((c: any) => ({
            ...c,
            registered: false
          }));
          setCompanies([...newCompanies, ...companies]);
        } else {
          fetchCompanies();
        }
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

  const handleGeneratePasskey = async () => {
    try {
      const response = await axios.get('http://localhost:5000/admin/companies/generate-passkey');
      if (response.data.success) {
        setNewCompany({ ...newCompany, passkey: response.data.passkey });
      }
    } catch (error) {
      setUploadMessage({ type: 'error', text: 'Failed to generate passkey' });
    }
  };

  const handleAddCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/admin/companies/add', newCompany);
      if (response.data.success) {
        setUploadMessage({ type: 'success', text: 'Company added successfully' });
        setShowAddCompanyForm(false);
        // Add the new company to the list
        if (response.data.company) {
          setCompanies([response.data.company, ...companies]);
        }
        setNewCompany({ passkey: '', mailId: '', name: '' });
      }
    } catch (error: any) {
      setUploadMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to add company'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/students');
      if (response.data.success) {
        setStudents(response.data.students);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      setUploadMessage({ type: 'error', text: 'Failed to fetch students' });
    } finally {
      setLoading(false);
    }
  };

  const openStudentModal = () => {
    setShowStudentModal(true);
    setUploadMessage(null);
    fetchStudents();
  };

  const closeStudentModal = () => {
    setShowStudentModal(false);
    setUploadMessage(null);
  };

  const handleDeleteCompany = async (company: Company) => {
    if (!window.confirm('Are you sure you want to delete this company?')) {
      return;
    }

    setLoading(true);
    try {
      // Use plain passkey for deletion
      const response = await axios.delete(`http://localhost:5000/admin/companies/${encodeURIComponent(company.passkey)}`);
      if (response.data.success) {
        setUploadMessage({ type: 'success', text: 'Company deleted successfully' });
        fetchCompanies();
      }
    } catch (error: any) {
      setUploadMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to delete company'
      });
    } finally {
      setLoading(false);
    }
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
          <div 
            className="card" 
            onClick={openStudentModal}
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
            }}>👨‍🎓</div>
            <h3 style={{ color: '#4f46e5', marginBottom: '10px' }}>
              Manage Students
            </h3>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>
              View and manage student accounts
            </p>
          </div>

          {/* Manage Companies */}
          <div 
            className="card" 
            onClick={openCompanyModal}
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

        {/* Company Management Modal */}
        {showCompanyModal && (
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
              maxWidth: '1000px',
              width: '100%',
              maxHeight: '85vh',
              overflow: 'auto'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px'
              }}>
                <h2 style={{ color: '#0f766e', margin: 0 }}>Manage Companies</h2>
                <button
                  onClick={closeCompanyModal}
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

              {/* Tab Navigation */}
              <div style={{
                display: 'flex',
                gap: '10px',
                marginBottom: '20px',
                borderBottom: '2px solid #e5e7eb'
              }}>
                <button
                  onClick={() => {
                    setCompanyTab('verification');
                    fetchCompanies();
                  }}
                  style={{
                    padding: '10px 20px',
                    background: 'none',
                    border: 'none',
                    borderBottom: companyTab === 'verification' ? '3px solid #0f766e' : 'none',
                    color: companyTab === 'verification' ? '#0f766e' : '#666',
                    cursor: 'pointer',
                    fontWeight: companyTab === 'verification' ? 'bold' : 'normal'
                  }}
                >
                  Company Verification ({companies.length})
                </button>
                <button
                  onClick={() => {
                    setCompanyTab('registered');
                    fetchRegisteredCompanies();
                  }}
                  style={{
                    padding: '10px 20px',
                    background: 'none',
                    border: 'none',
                    borderBottom: companyTab === 'registered' ? '3px solid #0f766e' : 'none',
                    color: companyTab === 'registered' ? '#0f766e' : '#666',
                    cursor: 'pointer',
                    fontWeight: companyTab === 'registered' ? 'bold' : 'normal'
                  }}
                >
                  Registered Companies ({registeredCompanies.length})
                </button>
              </div>

              {uploadMessage && (
                <div style={{
                  marginBottom: '15px',
                  padding: '10px',
                  borderRadius: '5px',
                  background: uploadMessage.type === 'success' ? '#d1fae5' : '#fee2e2',
                  color: uploadMessage.type === 'success' ? '#059669' : '#dc2626',
                  fontSize: '0.9rem'
                }}>
                  {uploadMessage.text}
                </div>
              )}

              {/* Company Verification Tab */}
              {companyTab === 'verification' && (
                <>
                  {/* Upload Section */}
                  <div style={{
                    background: '#f0fdf4',
                    padding: '20px',
                    borderRadius: '8px',
                    marginBottom: '20px'
                  }}>
                    <h3 style={{ color: '#0f766e', marginBottom: '15px' }}>Upload Companies</h3>
                    <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '15px' }}>
                      Upload a CSV or Excel file with columns: <code>passkey</code>, <code>mailId</code>, and <code>name</code>
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
                      onClick={handleCompanyFileUpload}
                      disabled={!uploadFile || loading}
                      style={{
                        padding: '10px 20px',
                        background: uploadFile && !loading ? '#0f766e' : '#d1d5db',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: uploadFile && !loading ? 'pointer' : 'not-allowed',
                        fontSize: '0.9rem',
                        marginRight: '10px'
                      }}
                    >
                      {loading ? 'Processing...' : 'Upload File'}
                    </button>

                    <button
                      onClick={() => setShowAddCompanyForm(!showAddCompanyForm)}
                      style={{
                        padding: '10px 20px',
                        background: '#0f766e',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                      }}
                    >
                      {showAddCompanyForm ? 'Cancel' : 'Add Company Manually'}
                    </button>
                  </div>

                  {/* Manual Add Form */}
                  {showAddCompanyForm && (
                    <form onSubmit={handleAddCompany} style={{
                      background: '#fef3c7',
                      padding: '20px',
                      borderRadius: '8px',
                      marginBottom: '20px'
                    }}>
                      <h3 style={{ color: '#92400e', marginBottom: '15px' }}>Add Company</h3>
                      <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', color: '#666' }}>
                          Passkey
                        </label>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <input
                            type="text"
                            value={newCompany.passkey}
                            onChange={(e) => setNewCompany({ ...newCompany, passkey: e.target.value })}
                            required
                            style={{
                              flex: 1,
                              padding: '10px',
                              border: '1px solid #d1d5db',
                              borderRadius: '5px'
                            }}
                          />
                          <button
                            type="button"
                            onClick={handleGeneratePasskey}
                            style={{
                              padding: '10px 15px',
                              background: '#92400e',
                              color: 'white',
                              border: 'none',
                              borderRadius: '5px',
                              cursor: 'pointer',
                              fontSize: '0.9rem'
                            }}
                          >
                            Generate
                          </button>
                        </div>
                      </div>
                      <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', color: '#666' }}>
                          Email
                        </label>
                        <input
                          type="email"
                          value={newCompany.mailId}
                          onChange={(e) => setNewCompany({ ...newCompany, mailId: e.target.value })}
                          required
                          style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid #d1d5db',
                            borderRadius: '5px'
                          }}
                        />
                      </div>
                      <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', color: '#666' }}>
                          Company Name
                        </label>
                        <input
                          type="text"
                          value={newCompany.name}
                          onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                          required
                          style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid #d1d5db',
                            borderRadius: '5px'
                          }}
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        style={{
                          padding: '10px 20px',
                          background: loading ? '#d1d5db' : '#92400e',
                          color: 'white',
                          border: 'none',
                          borderRadius: '5px',
                          cursor: loading ? 'not-allowed' : 'pointer',
                          fontSize: '0.9rem'
                        }}
                      >
                        {loading ? 'Adding...' : 'Add Company'}
                      </button>
                    </form>
                  )}

                  {/* Companies List */}
                  <div>
                    <h3 style={{ color: '#0f766e', marginBottom: '15px' }}>
                      Companies in Verification Table
                    </h3>
                    
                    {loading ? (
                      <p style={{ textAlign: 'center', color: '#666' }}>Loading...</p>
                    ) : companies.length === 0 ? (
                      <p style={{ textAlign: 'center', color: '#666' }}>No companies found</p>
                    ) : (
                      <div style={{ maxHeight: '300px', overflow: 'auto' }}>
                        <table style={{
                          width: '100%',
                          borderCollapse: 'collapse'
                        }}>
                          <thead>
                            <tr style={{ background: '#f3f4f6' }}>
                              <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #d1d5db' }}>Passkey</th>
                              <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #d1d5db' }}>Email</th>
                              <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #d1d5db' }}>Name</th>
                              <th style={{ padding: '10px', textAlign: 'center', borderBottom: '2px solid #d1d5db' }}>Status</th>
                              <th style={{ padding: '10px', textAlign: 'center', borderBottom: '2px solid #d1d5db' }}>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {companies.map((company, index) => (
                              <tr key={`${company.passkey}-${index}`} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                <td style={{ padding: '10px', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                                  {company.passkey}
                                </td>
                                <td style={{ padding: '10px' }}>{company.mailId}</td>
                                <td style={{ padding: '10px' }}>{company.name}</td>
                                <td style={{ padding: '10px', textAlign: 'center' }}>
                                  {company.registered ? (
                                    <span style={{ 
                                      background: '#d1fae5', 
                                      color: '#059669', 
                                      padding: '4px 8px', 
                                      borderRadius: '4px',
                                      fontSize: '0.8rem'
                                    }}>
                                      ✓ Registered
                                    </span>
                                  ) : (
                                    <span style={{ 
                                      background: '#fee2e2', 
                                      color: '#dc2626', 
                                      padding: '4px 8px', 
                                      borderRadius: '4px',
                                      fontSize: '0.8rem'
                                    }}>
                                      Not Registered
                                    </span>
                                  )}
                                </td>
                                <td style={{ padding: '10px', textAlign: 'center' }}>
                                  <button
                                    onClick={() => handleDeleteCompany(company)}
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
                </>
              )}

              {/* Registered Companies Tab */}
              {companyTab === 'registered' && (
                <div>
                  <h3 style={{ color: '#0f766e', marginBottom: '15px' }}>
                    Registered Companies
                  </h3>
                  
                  {loading ? (
                    <p style={{ textAlign: 'center', color: '#666' }}>Loading...</p>
                  ) : registeredCompanies.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#666' }}>No registered companies found</p>
                  ) : (
                    <div style={{ maxHeight: '400px', overflow: 'auto' }}>
                      <table style={{
                        width: '100%',
                        borderCollapse: 'collapse'
                      }}>
                        <thead>
                          <tr style={{ background: '#f3f4f6' }}>
                            <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #d1d5db' }}>ID</th>
                            <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #d1d5db' }}>Email</th>
                            <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #d1d5db' }}>Name</th>
                            <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #d1d5db' }}>Location</th>
                            <th style={{ padding: '10px', textAlign: 'center', borderBottom: '2px solid #d1d5db' }}>Profile Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {registeredCompanies.map((company) => (
                            <tr key={company.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                              <td style={{ padding: '10px' }}>{company.id}</td>
                              <td style={{ padding: '10px' }}>{company.email}</td>
                              <td style={{ padding: '10px' }}>{company.name}</td>
                              <td style={{ padding: '10px' }}>{company.location || 'N/A'}</td>
                              <td style={{ padding: '10px', textAlign: 'center' }}>
                                {company.profileComplete ? (
                                  <span style={{ 
                                    background: '#d1fae5', 
                                    color: '#059669', 
                                    padding: '4px 8px', 
                                    borderRadius: '4px',
                                    fontSize: '0.8rem'
                                  }}>
                                    ✓ Complete
                                  </span>
                                ) : (
                                  <span style={{ 
                                    background: '#fef3c7', 
                                    color: '#92400e', 
                                    padding: '4px 8px', 
                                    borderRadius: '4px',
                                    fontSize: '0.8rem'
                                  }}>
                                    Incomplete
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Student Management Modal */}
        {showStudentModal && (
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
              maxWidth: '1000px',
              width: '100%',
              maxHeight: '85vh',
              overflow: 'auto'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px'
              }}>
                <h2 style={{ color: '#4f46e5', margin: 0 }}>Manage Students</h2>
                <button
                  onClick={closeStudentModal}
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

              {/* Students List */}
              <div>
                <h3 style={{ color: '#4f46e5', marginBottom: '15px' }}>
                  Registered Students ({students.length})
                </h3>
                
                {uploadMessage && (
                  <div style={{
                    marginBottom: '15px',
                    padding: '10px',
                    borderRadius: '5px',
                    background: uploadMessage.type === 'success' ? '#d1fae5' : '#fee2e2',
                    color: uploadMessage.type === 'success' ? '#059669' : '#dc2626',
                    fontSize: '0.9rem'
                  }}>
                    {uploadMessage.text}
                  </div>
                )}
                
                {loading ? (
                  <p style={{ textAlign: 'center', color: '#666' }}>Loading...</p>
                ) : students.length === 0 ? (
                  <p style={{ textAlign: 'center', color: '#666' }}>No students found</p>
                ) : (
                  <div style={{ maxHeight: '500px', overflow: 'auto' }}>
                    <table style={{
                      width: '100%',
                      borderCollapse: 'collapse',
                      tableLayout: 'fixed'
                    }}>
                      <thead>
                        <tr style={{ background: '#f3f4f6', position: 'sticky', top: 0 }}>
                          <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #d1d5db', width: '60px' }}>ID</th>
                          <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #d1d5db', width: '200px' }}>Name</th>
                          <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #d1d5db', width: '250px' }}>Email</th>
                          <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #d1d5db', width: '220px' }}>University</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map((student) => (
                          <tr key={student.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                            <td style={{ padding: '12px', verticalAlign: 'middle' }}>{student.id}</td>
                            <td style={{ 
                              padding: '12px',
                              verticalAlign: 'middle',
                              color: student.name === 'Profile Not Created' ? '#9ca3af' : '#333',
                              fontStyle: student.name === 'Profile Not Created' ? 'italic' : 'normal'
                            }}>
                              {student.name}
                            </td>
                            <td style={{ padding: '12px', verticalAlign: 'middle', wordBreak: 'break-word' }}>{student.email}</td>
                            <td style={{ padding: '12px', verticalAlign: 'middle' }}>
                              <span style={{
                                display: 'inline-block',
                                background: '#dbeafe',
                                color: '#1e40af',
                                padding: '4px 12px',
                                borderRadius: '12px',
                                fontSize: '0.85rem',
                                fontWeight: '500',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                maxWidth: '100%'
                              }}>
                                {student.universityName}
                              </span>
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
