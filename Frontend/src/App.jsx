import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import Login from './Pages/Login';
import Dashboard from './Pages/Dashboard';
import Schedule from './Pages/Schedule';
import Reports from './Pages/Reports';
import DataCapture from './Pages/DataCapture';
import EvidenceTimeline from './Pages/EvidenceTimeline';
import SiteEngineerDashboard from './Pages/SiteEngineerDashboard';
import ProjectManagerDashboard from './Pages/ProjectManagerDashboard';
import PlannerDashboard from './Pages/PlannerDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Site Engineer - standalone page with own sidebar/header */}
        <Route path="/engineer-dashboard" element={<SiteEngineerDashboard />} />

        {/* Project Manager - standalone page with own sidebar/header */}
        <Route path="/pm-dashboard" element={<ProjectManagerDashboard />} />

        {/* Planner - standalone page with own sidebar/header */}
        <Route path="/planner-dashboard" element={<PlannerDashboard />} />

        {/* Existing generic routes (still using shared MainLayout) */}
        <Route
          path="/dashboard"
          element={<MainLayout><Dashboard /></MainLayout>}
        />
        <Route
          path="/schedule"
          element={<MainLayout><Schedule /></MainLayout>}
        />
        <Route
          path="/reports"
          element={<MainLayout><Reports /></MainLayout>}
        />

        {/* Data Capture - standalone page with own header (used by Site Engineer's Log Progress button) */}
        <Route path="/data-capture" element={<DataCapture />} />

        <Route
          path="/evidence-timeline"
          element={<MainLayout><EvidenceTimeline /></MainLayout>}
        />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;