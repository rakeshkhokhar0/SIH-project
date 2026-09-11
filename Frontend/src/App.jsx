import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import Login from './Pages/Login';
import Dashboard from './Pages/Dashboard';
import Schedule from './Pages/Schedule';
import Reports from './Pages/Reports';
import DataCapture from './Pages/DataCapture';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;