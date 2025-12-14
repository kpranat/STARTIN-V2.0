import React from 'react';
import CompanyNavbar from '../../components/CompanyNavbar';
import '../../App.css'; 

// Mock Data for Applicants
const MOCK_APPLICANTS = [
  { id: 101, name: "Viva Baranwal", jobTitle: "Frontend Intern", appliedDate: "2023-12-01", profileLink: "/student/profile/view/101" },
  { id: 102, name: "Pranat Kheria", jobTitle: "Backend Developer", appliedDate: "2023-12-03", profileLink: "/student/profile/view/102" },
  { id: 103, name: "Lehan Fats", jobTitle: "Frontend Intern", appliedDate: "2023-12-04", profileLink: "/student/profile/view/103" },
];

const CompanyApplicants: React.FC = () => {

  // ---------------------------------------------------------
  // BACKEND INTEGRATION: GET /api/company/applicants
  // ---------------------------------------------------------

  return (
    <>
      <CompanyNavbar />
      <div className="page-container">
        <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>Applicants Dashboard</h1>

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