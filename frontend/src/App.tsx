import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// General Pages
import UniversitySelect from './pages/UniversitySelect';
import Landing from './pages/Landing';

// Auth Pages
import StudentLogin from './pages/StudentLogin';
import StudentSignup from './pages/StudentSignup';
import CompanyLogin from './pages/CompanyLogin';
import CompanySignup from './pages/CompanySignup';

// Student Dashboard Pages
import StudentProfile from './pages/student/StudentProfile';
import StudentHome from './pages/student/StudentHome';         // The Job Discovery Page
import StudentAppliedJobs from './pages/student/StudentAppliedJobs'; // The "Applied Jobs" Page

// COMPANY PAGES
import CompanyProfile from './pages/company/CompanyProfile';
import CompanyPostJob from './pages/company/CompanyPostJob';
import CompanyApplicants from './pages/company/CompanyApplicant';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Step 1: Select University */}
        <Route path="/" element={<UniversitySelect />} />

        {/* Step 2: Choose Role (Student vs Company) */}
        <Route path="/role-selection" element={<Landing />} />

        {/* Step 3: Auth Flows */}
        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/student/signup" element={<StudentSignup />} />
        <Route path="/company/login" element={<CompanyLogin />} />
        <Route path="/company/signup" element={<CompanySignup />} />

        {/* Step 4: Student Dashboard (Post-Login) */}
        
        {/* HOME -> Shows Job Discovery Board */}
        <Route path="/student/home" element={<StudentHome />} />

        {/* APPLIED JOBS -> Shows list of applied jobs */}
        <Route path="/student/applied-jobs" element={<StudentAppliedJobs />} />

        {/* PROFILE -> Edit/View Profile */}
        <Route path="/student/profile" element={<StudentProfile />} />

        {/* COMPANY DASHBOARD ROUTES */}
        <Route path="/company/profile" element={<CompanyProfile />} />
        <Route path="/company/post-job" element={<CompanyPostJob />} />
        <Route path="/company/applicants" element={<CompanyApplicants />} />
        
        {/* Redirect /company/home to profile for now */}
        <Route path="/company/home" element={<CompanyProfile />} />
        
      </Routes>
    </Router>
  );
}

export default App;