import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Loading Transition (Ensure this file exists!)
import LoadingTransition from './pages/LoadingTransition';

// Components
// import ProtectedRoute from './components/ProtectedRoute'; // Uncomment if you have this component
import CompanyProfileCheck from './components/CompanyProfileCheck';
import StudentProfileCheck from './components/StudentProfileCheck';

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
import StudentHome from './pages/student/StudentHome';
import StudentAppliedJobs from './pages/student/StudentAppliedJobs';

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

        {/* Step 2: Choose Role */}
        <Route path="/role-selection" element={<Landing />} />

        {/* Utility: Loading Transition Page */}
        <Route path="/loading" element={<LoadingTransition />} />

        {/* Step 3: Auth Flows */}
        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/student/signup" element={<StudentSignup />} />
        <Route path="/company/login" element={<CompanyLogin />} />
        <Route path="/company/signup" element={<CompanySignup />} />

        {/* Step 4: Student Dashboard */}
        <Route path="/student/profile-check" element={<StudentProfileCheck />} />
        <Route path="/student/profile-setup" element={<StudentProfile />} />
        <Route path="/student/home" element={<StudentHome />} />
        <Route path="/student/applied-jobs" element={<StudentAppliedJobs />} />
        <Route path="/student/profile" element={<StudentProfile />} />

        {/* Step 5: Company Dashboard */}
        <Route path="/company/profile-check" element={<CompanyProfileCheck />} />
        <Route path="/company/profile-setup" element={<CompanyProfile />} />
        <Route path="/company/profile" element={<CompanyProfile />} />
        <Route path="/company/post-job" element={<CompanyPostJob />} />
        <Route path="/company/applicants" element={<CompanyApplicants />} />
        <Route path="/company/home" element={<CompanyProfile />} />
        
      </Routes>
    </Router>
  );
}

export default App;