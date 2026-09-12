import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PROJECT_LIST = [
  'Assam Pipeline Expansion Project',
  'Guwahati Pumping Station',
  'Duliajan Storage Terminal',
  'Numaligarh Feeder Line',
  'Silchar Dispatch Terminal',
];

export default function PlannerDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('submit'); // 'submit' | 'history'
  const [selectedProject, setSelectedProject] = useState(PROJECT_LIST[0]);
  const [description, setDescription] = useState('');
  const [submissions, setSubmissions] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const userEmail = localStorage.getItem('userEmail') || 'planner@oilindia.in';

  const loadSubmissions = () => {
    const saved = localStorage.getItem('planner_submissions');
    setSubmissions(saved ? JSON.parse(saved) : []);
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description.trim()) return;

    const newSubmission = {
      id: `SUB-${Date.now().toString().slice(-5)}`,
      project: selectedProject,
      submittedBy: userEmail,
      description: description.trim(),
      date: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      aiConfidence: Math.floor(Math.random() * (98 - 65 + 1)) + 65,
      status: 'Pending',
    };

    const updated = [newSubmission, ...submissions];
    setSubmissions(updated);
    localStorage.setItem('planner_submissions', JSON.stringify(updated));

    setDescription('');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    setActiveTab('history'); // jump to history so they can see it landed
  };

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    navigate('/');
  };

  const statusStyle = {
    Pending: { color: '#14213D', bg: '#14213D0D' },
    Approved: { color: '#4C7A4C', bg: '#4C7A4C1A' },
  };

  const pendingCount = submissions.filter((s) => s.status === 'Pending').length;

  const NAV_ITEMS = [
    { key: 'submit', n: '01', label: 'Submit Update' },
    { key: 'history', n: '02', label: 'My Submissions' },
  ];

  return (
    <div
      className="min-h-screen bg-[#F7F7F7] text-[#14213D] flex"
      style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
    >
      {/* Sidebar */}
      <aside className="w-64 bg-[#14213D] text-white flex flex-col shrink-0 min-h-screen">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-xl font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Intelli-Progress
          </h1>
          <p className="text-xs text-white/40 mt-1 font-mono">SIH26122 · v0.1</p>
        </div>
        <nav className="flex-1 py-4">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`w-full flex items-center justify-between gap-3 px-6 py-3 text-sm font-mono transition-colors ${
                activeTab === item.key
                  ? 'bg-white/10 text-white font-semibold border-l-2 border-white'
                  : 'text-white/50 hover:text-white/80 hover:bg-white/5'
              }`}
            >
              <span className="flex items-center gap-3">
                <span className="text-xs">{item.n}</span>
                {item.label}
              </span>
              {item.key === 'history' && pendingCount > 0 && (
                <span className="text-[10px] bg-white/20 rounded-full px-2 py-0.5">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="p-6 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="text-xs text-red-300 hover:text-red-200 font-mono"
          >
            00 &nbsp; Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-h-screen">
        <header className="border-b border-[#14213D]/10 bg-white px-6 py-4 flex justify-between items-center shadow-sm">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-[#14213D]/50 block font-mono">
              SIH26122 · Project Planning
            </span>
            <h1 className="text-xl font-medium" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Planner Dashboard
            </h1>
          </div>
          <div className="text-right hidden sm:block">
            <div className="text-xs font-medium">{userEmail}</div>
          </div>
        </header>

        <main className="p-5 md:p-8 max-w-4xl mx-auto space-y-8">
          {showSuccess && (
            <div className="px-4 py-3 rounded text-sm bg-[#4C7A4C1A] text-[#4C7A4C] border border-[#4C7A4C]/30">
              ✓ Schedule update submitted to Project Manager for approval.
            </div>
          )}

          {/* Submit new schedule update */}
          {activeTab === 'submit' && (
            <div className="bg-white rounded-lg border border-[#14213D]/10 shadow-sm p-6">
              <h2 className="text-base font-medium mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Submit Schedule Update
              </h2>
              <p className="text-xs text-[#14213D]/50 mb-4">
                Select the project you manage and describe the schedule change for PM review.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] uppercase text-[#14213D]/50 mb-1 font-mono">
                    Project
                  </label>
                  <select
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    className="w-full px-4 py-2.5 rounded border border-[#14213D]/15 text-sm focus:outline-none focus:border-[#3D5A80]"
                  >
                    {PROJECT_LIST.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] uppercase text-[#14213D]/50 mb-1 font-mono">
                    Change Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    placeholder="e.g. Updated schedule for Sector A trenching due to material delay"
                    className="w-full px-4 py-2.5 rounded border border-[#14213D]/15 text-sm resize-none focus:outline-none focus:border-[#3D5A80]"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded text-xs font-medium bg-[#14213D] text-white hover:bg-[#1a2847]"
                >
                  Submit for PM Approval
                </button>
              </form>
            </div>
          )}

          {/* My submissions history */}
          {activeTab === 'history' && (
            <div className="bg-white rounded-lg border border-[#14213D]/10 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-[#14213D]/10 bg-[#14213D]/[0.02]">
                <h2 className="text-base font-medium" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  My Submissions
                </h2>
                <p className="text-xs text-[#14213D]/50">Track the status of your submitted schedule updates.</p>
              </div>

              {submissions.length === 0 ? (
                <div className="p-6 text-sm text-[#14213D]/50 text-center">
                  No submissions yet.
                </div>
              ) : (
                <div className="divide-y divide-[#14213D]/10">
                  {submissions.map((s) => (
                    <div key={s.id} className="p-5 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs text-[#14213D]/50 font-mono">{s.date}</p>
                        <p className="text-sm font-medium">{s.project}</p>
                        <p className="text-sm text-[#14213D]/70">{s.description}</p>
                      </div>
                      <span
                        className="text-xs font-medium px-2.5 py-1 rounded shrink-0 font-mono"
                        style={{
                          color: statusStyle[s.status]?.color,
                          backgroundColor: statusStyle[s.status]?.bg,
                        }}
                      >
                        {s.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}