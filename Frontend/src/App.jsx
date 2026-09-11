import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import Login from './Pages/Login';
import Dashboard from './Pages/Dashboard';
import Schedule from './Pages/Schedule';
import Reports from './Pages/Reports';
import DataCapture from './Pages/DataCapture';
import EvidenceTimeline from './Pages/EvidenceTimeline';
import SiteEngineerDashboard from './Pages/SiteEngineerDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Site Engineer Direct Integrated Flow */}
        <Route
          path="/engineer-dashboard"
          element={
            <MainLayout>
              <SiteEngineerDashboard />
            </MainLayout>
          }
        />

        {/* Existing Routes */}
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
        <Route
          path="/data-capture"
          element={<MainLayout><DataCapture /></MainLayout>}
        />
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