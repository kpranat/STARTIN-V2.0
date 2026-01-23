import React from 'react';
import CompanyNavbar from '../../components/CompanyNavbar';
import '../../App.css'; 

// Note: Backend endpoint to fetch applicants list is not yet implemented
// Current backend only has the endpoint to submit applications (/get/applicants POST)
// Need backend endpoints like: GET /company/applicants?jobId=123 or GET /company/applicants

// Mock Data for Applicants (for demonstration)
const MOCK_APPLICANTS = [
  { id: 101, name: "Viva Baranwal", jobTitle: "Frontend Intern", appliedDate: "2023-12-01", profileLink: "/student/profile/view/101" },
  { id: 102, name: "Pranat Kheria", jobTitle: "Backend Developer", appliedDate: "2023-12-03", profileLink: "/student/profile/view/102" },
  { id: 103, name: "Lehan Fats", jobTitle: "Frontend Intern", appliedDate: "2023-12-04", profileLink: "/student/profile/view/103" },
];

const CompanyApplicants: React.FC = () => {

  // ---------------------------------------------------------
  // TODO: BACKEND INTEGRATION
  // Need to create backend endpoints to:
  // 1. GET /company/applicants - Fetch all applicants for this company
  // 2. GET /company/jobs/:jobId/applicants - Fetch applicants for specific job
  // 3. Should join JobApplication, StudentProfile, and JobDetails tables
  // ---------------------------------------------------------

  return (
    <>
      <CompanyNavbar />
      <div className="page-container">
        <h1 style={{ textAlign: 'center', marginBottom: '15px', color: '#333' }}>Applicants Dashboard</h1>
        
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '25px', 
          padding: '15px', 
          backgroundColor: '#fff3cd', 
          borderRadius: '8px',
          maxWidth: '900px',
          margin: '0 auto 25px'
        }}>
          <p style={{ color: '#856404', fontSize: '0.95rem', margin: 0 }}>
            ⚠️ <strong>Note:</strong> Backend endpoints to fetch applicants are not yet implemented. 
            This page shows mock data. Backend needs to create endpoints to retrieve applicant information.
          </p>
        </div>

        <div className="profile-container" style={{ maxWidth: '900px', padding: '0' }}>
          {/* Simple Table Layout */}
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#f0fdfa', color: '#0f766e' }}>
              <tr>
                <th style={{ padding: '15px', textAlign: 'left' }}>Applicant Name</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Role Applied For</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Date</th>
                <th style={{ padding: '15px', textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_APPLICANTS.map((app) => (
                <tr key={app.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '15px', fontWeight: 'bold' }}>{app.name}</td>
                  <td style={{ padding: '15px' }}>{app.jobTitle}</td>
                  <td style={{ padding: '15px', color: '#666' }}>{app.appliedDate}</td>
                  <td style={{ padding: '15px', textAlign: 'center' }}>
                    <button 
                      className="btn" 
                      style={{ padding: '6px 12px', fontSize: '0.85rem', backgroundColor: '#0f766e' }}
                      onClick={() => alert(`Redirect to profile of ${app.name}`)}
                    >
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {MOCK_APPLICANTS.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
              No applicants found yet.
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CompanyApplicants;