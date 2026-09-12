import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { INITIAL_TASKS } from '../services/mockData';

export default function SiteEngineerDashboard() {
  const navigate = useNavigate();
  const routeLocation = useLocation();
  const [activeTab, setActiveTab] = useState('tasks'); // tasks | audit

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('site_engineer_tasks');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
    return INITIAL_TASKS;
  });

  const [historyLogs, setHistoryLogs] = useState(() => {
    const savedLogs = localStorage.getItem('site_engineer_history');
    return savedLogs
      ? JSON.parse(savedLogs)
      : [
          {
            id: 'LOG-1001',
            taskId: 'T103',
            wbsCode: '2.1.0',
            activityName: 'Joint Welding & Non-Destructive Testing (NDT)',
            loggedQty: 10,
            unit: 'joints',
            timestamp: '12 Sep 2026, 11:30 AM',
            photoName: 'welding_ndt_01.jpg',
            notes: '10 joints cleared RT inspection.',
          },
        ];
  });

  const [selectedTaskDetails, setSelectedTaskDetails] = useState(null);
  const [showSuccessMsg, setShowSuccessMsg] = useState(false);

  const userEmail = localStorage.getItem('userEmail') || 'engineer@oilindia.in';

  // If we just came back from a successful log submission, show the banner
  useEffect(() => {
    if (routeLocation.state?.justLogged) {
      setShowSuccessMsg(true);
      setTimeout(() => setShowSuccessMsg(false), 3000);
      // clear the state so refresh doesn't re-trigger it
      window.history.replaceState({}, document.title);
    }
  }, [routeLocation.state]);

  useEffect(() => {
    localStorage.setItem('site_engineer_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('site_engineer_history', JSON.stringify(historyLogs));
  }, [historyLogs]);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    navigate('/');
  };

  const goToDataCapture = (task, e) => {
    if (e) e.stopPropagation();
    navigate('/data-capture', { state: { task } });
  };

  const NAV_ITEMS = [
    { key: 'tasks', n: '01', label: "Today's Tasks" },
    { key: 'audit', n: '02', label: 'Audit Trail' },
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
              {item.key === 'audit' && historyLogs.length > 0 && (
                <span className="text-[10px] bg-white/20 rounded-full px-2 py-0.5">
                  {historyLogs.length}
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
              SIH26122 · Field Execution
            </span>
            <h1 className="text-xl font-medium text-[#14213D]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Site Engineer Dashboard
            </h1>
          </div>
          <div className="text-right hidden sm:block">
            <div className="text-xs font-medium">{userEmail}</div>
            <div className="text-[10px] text-[#4C7A4C] font-mono">● Local Storage Synced</div>
          </div>
        </header>

        <main className="p-5 md:p-8 max-w-5xl mx-auto space-y-8">
          {showSuccessMsg && (
            <div className="px-4 py-3 rounded text-sm bg-[#4C7A4C1A] text-[#4C7A4C] border border-[#4C7A4C]/30 flex justify-between items-center">
              <span>✓ Daily field progress & photo evidence logged successfully!</span>
            </div>
          )}

          {/* ---------- TODAY'S TASKS TAB ---------- */}
          {activeTab === 'tasks' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg border border-[#14213D]/10">
                  <span className="text-[11px] text-[#14213D]/50 uppercase block font-mono">
                    Assigned Daily Tasks
                  </span>
                  <div className="text-2xl font-bold mt-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {tasks.length} Activities
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-[#14213D]/10">
                  <span className="text-[11px] text-[#14213D]/50 uppercase block font-mono">
                    Active / Completed
                  </span>
                  <div className="text-2xl font-bold mt-1 text-[#4C7A4C]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {tasks.filter((t) => t.status !== 'Pending').length} / {tasks.length}
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-[#14213D]/10">
                  <span className="text-[11px] text-[#14213D]/50 uppercase block font-mono">
                    Submitted Log Entries
                  </span>
                  <div className="text-2xl font-bold mt-1 text-[#3D5A80]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {historyLogs.length} Records
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-[#14213D]/10 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-[#14213D]/10 flex justify-between items-center bg-[#14213D]/[0.02]">
                  <div>
                    <h2 className="text-base font-medium" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      Today's Daily Work Schedule ({tasks.length} Activities)
                    </h2>
                    <p className="text-xs text-[#14213D]/50">
                      Click any task card to see detailed specs or click 'Log Progress' to record daily progress.
                    </p>
                  </div>
                </div>

                <div className="divide-y divide-[#14213D]/10">
                  {tasks.map((task) => {
                    const progressPct = Math.min(
                      Math.round((task.completedQty / task.targetQty) * 100),
                      100
                    );

                    return (
                      <div
                        key={task.id}
                        onClick={() => setSelectedTaskDetails(task)}
                        className="p-5 hover:bg-[#14213D]/[0.03] cursor-pointer transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                      >
                        <div className="space-y-1 max-w-lg">
                          <div className="flex items-center gap-2">
                            <span className="text-xs px-2 py-0.5 bg-[#14213D]/10 rounded font-semibold text-[#14213D] font-mono">
                              WBS {task.wbsCode}
                            </span>
                            <span className="text-xs text-[#3D5A80] font-medium font-mono">
                              {task.projectName}
                            </span>
                          </div>
                          <h3 className="text-sm font-medium text-[#14213D] group-hover:text-[#3D5A80] transition-colors">
                            {task.activityName}
                          </h3>
                          <p className="text-xs text-[#14213D]/60 font-mono">📍 {task.location}</p>

                          <div className="pt-2 w-full max-w-xs">
                            <div className="flex justify-between text-[11px] text-[#14213D]/60 mb-1 font-mono">
                              <span>
                                Progress: {task.completedQty} / {task.targetQty} {task.unit}
                              </span>
                              <span>{progressPct}%</span>
                            </div>
                            <div className="w-full bg-[#14213D]/10 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="bg-[#3D5A80] h-full transition-all duration-300"
                                style={{ width: `${progressPct}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 self-end md:self-center">
                          <span
                            className={`text-[11px] px-2.5 py-1 rounded font-medium font-mono ${
                              task.status === 'Completed'
                                ? 'bg-[#4C7A4C1A] text-[#4C7A4C]'
                                : task.status === 'In Progress'
                                ? 'bg-amber-500/10 text-amber-700'
                                : 'bg-[#14213D]/10 text-[#14213D]/60'
                            }`}
                          >
                            {task.status}
                          </span>

                          <button
                            onClick={(e) => goToDataCapture(task, e)}
                            className="px-4 py-2 text-xs font-medium rounded bg-[#14213D] text-white hover:bg-[#1a2847] transition-colors shadow-sm"
                          >
                            {task.completedQty > 0 ? 'Update Log' : 'Log Progress'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* ---------- AUDIT TRAIL TAB ---------- */}
          {activeTab === 'audit' && (
            <div className="bg-white rounded-lg border border-[#14213D]/10 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-[#14213D]/10 bg-[#14213D]/[0.02]">
                <h2 className="text-base font-medium" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Daily Submission Audit Trail
                </h2>
                <p className="text-xs text-[#14213D]/50">Recent daily logs captured by site engineer.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F7F7F7] border-b border-[#14213D]/10 text-[#14213D]/50 font-mono uppercase text-[10px]">
                    <tr>
                      <th className="px-5 py-3">Log ID</th>
                      <th className="px-5 py-3">WBS Code</th>
                      <th className="px-5 py-3">Activity</th>
                      <th className="px-5 py-3">Logged Qty</th>
                      <th className="px-5 py-3">Evidence File</th>
                      <th className="px-5 py-3">Geo-Tag</th>
                      <th className="px-5 py-3">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#14213D]/10">
                    {historyLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3.5 font-mono text-[#14213D]/60 font-semibold">{log.id}</td>
                        <td className="px-5 py-3.5 font-mono text-[#3D5A80]">{log.wbsCode}</td>
                        <td className="px-5 py-3.5 font-medium text-[#14213D] max-w-xs truncate">
                          {log.activityName}
                        </td>
                        <td className="px-5 py-3.5 font-semibold text-[#4C7A4C]">
                          {log.loggedQty} {log.unit}
                        </td>
                        <td className="px-5 py-3.5 font-mono text-xs text-[#14213D]/70">
                          📷 {log.photoName}
                        </td>
                        <td className="px-5 py-3.5 font-mono text-xs text-[#14213D]/50">
                          {log.geoTag ? `📍 ${log.geoTag}` : '—'}
                        </td>
                        <td className="px-5 py-3.5 font-mono text-[#14213D]/50 text-[11px]">
                          {log.timestamp}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Modal: Activity Details (view-only, unchanged) */}
          {selectedTaskDetails && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-40">
              <div className="bg-white rounded-lg max-w-2xl w-full p-6 shadow-2xl border border-[#14213D]/10 space-y-6 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-start border-b border-[#14213D]/10 pb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs bg-[#14213D]/10 px-2 py-0.5 rounded font-semibold font-mono">
                        WBS {selectedTaskDetails.wbsCode}
                      </span>
                      <span className="text-xs text-[#3D5A80] font-mono">
                        {selectedTaskDetails.projectName}
                      </span>
                    </div>
                    <h2 className="text-lg font-medium text-[#14213D]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {selectedTaskDetails.activityName}
                    </h2>
                  </div>
                  <button
                    onClick={() => setSelectedTaskDetails(null)}
                    className="text-gray-400 hover:text-black font-mono text-base p-1"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-[#F7F7F7] p-4 rounded-lg border border-[#14213D]/10 font-mono">
                  <div>
                    <span className="text-[#14213D]/50 uppercase block text-[10px]">Location</span>
                    <span className="text-[#14213D] font-medium">{selectedTaskDetails.location}</span>
                  </div>
                  <div>
                    <span className="text-[#14213D]/50 uppercase block text-[10px]">Contractor</span>
                    <span className="text-[#14213D] font-medium">{selectedTaskDetails.contractor}</span>
                  </div>
                  <div>
                    <span className="text-[#14213D]/50 uppercase block text-[10px]">Schedule</span>
                    <span className="text-[#14213D] font-medium">
                      {selectedTaskDetails.startDate} — {selectedTaskDetails.targetEndDate}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#14213D]/50 uppercase block text-[10px]">Target Quantity</span>
                    <span className="text-[#14213D] font-medium">
                      {selectedTaskDetails.targetQty} {selectedTaskDetails.unit}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs text-[#14213D]/50 uppercase mb-1 font-mono">
                    Engineering Specifications
                  </h4>
                  <div className="p-3 bg-amber-50 rounded border border-amber-200 text-xs text-amber-900 leading-relaxed">
                    {selectedTaskDetails.specifications}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-[#14213D]/10">
                  <button
                    onClick={() => setSelectedTaskDetails(null)}
                    className="px-4 py-2 rounded text-xs border border-[#14213D]/20 text-[#14213D]/70 font-mono"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      const task = selectedTaskDetails;
                      setSelectedTaskDetails(null);
                      goToDataCapture(task);
                    }}
                    className="px-5 py-2 rounded text-xs font-medium bg-[#14213D] text-white hover:bg-[#1a2847]"
                  >
                    Log Daily Progress →
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}