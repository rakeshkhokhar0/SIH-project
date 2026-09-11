import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";

function DashboardPlaceholder() {
  return <h1 className="text-center mt-10 text-xl">Dashboard coming soon (Aditi's page)</h1>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<DashboardPlaceholder />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;