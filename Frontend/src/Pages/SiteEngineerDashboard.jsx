import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { INITIAL_TASKS } from '../services/mockData';

export default function SiteEngineerDashboard() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Load state from local storage or fallback to 10 activities
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('site_engineer_tasks');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Agar LocalStorage me data array hai AUR 0 se zyaada items hain tabhi load hoga
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
  const [activeTaskForLog, setActiveTaskForLog] = useState(null);
  const [completedInput, setCompletedInput] = useState('');
  const [notesInput, setNotesInput] = useState('');
  const [photo, setPhoto] = useState(null);
  const [showSuccessMsg, setShowSuccessMsg] = useState(false);

  const userEmail = localStorage.getItem('userEmail') || 'engineer@oilindia.in';

  // Persist state changes locally
  useEffect(() => {
    localStorage.setItem('site_engineer_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('site_engineer_history', JSON.stringify(historyLogs));
  }, [historyLogs]);

  const handleOpenLogModal = (task, e) => {
    if (e) e.stopPropagation();
    setActiveTaskForLog(task);
    setCompletedInput(task.completedQty > 0 ? task.completedQty : '');
    setNotesInput(task.notes || '');
    setPhoto(null);
  };

  const handleDataSubmit = (e) => {
    e.preventDefault();
    if (!activeTaskForLog) return;

    const loggedQty = Number(completedInput);
    const updatedStatus = loggedQty >= activeTaskForLog.targetQty ? 'Completed' : 'In Progress';
    const currentTimestamp = new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    const photoFileName = photo ? photo.name : activeTaskForLog.photoName || 'site_evidence.jpg';

    // Update main schedule state
    setTasks((prevTasks) =>
      prevTasks.map((t) =>
        t.id === activeTaskForLog.id
          ? {
              ...t,
              completedQty: loggedQty,
              status: updatedStatus,
              notes: notesInput,
              photoName: photoFileName,
            }
          : t
      )
    );

    // Add entry to audit trail
    const newLogEntry = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      taskId: activeTaskForLog.id,
      wbsCode: activeTaskForLog.wbsCode,
      activityName: activeTaskForLog.activityName,
      loggedQty: loggedQty,
      unit: activeTaskForLog.unit,
      timestamp: currentTimestamp,
      photoName: photoFileName,
      notes: notesInput || 'No extra notes provided.',
    };

    setHistoryLogs((prev) => [newLogEntry, ...prev]);

    if (selectedTaskDetails && selectedTaskDetails.id === activeTaskForLog.id) {
      setSelectedTaskDetails((prev) => ({
        ...prev,
        completedQty: loggedQty,
        status: updatedStatus,
        notes: notesInput,
        photoName: photoFileName,
      }));
    }

    setActiveTaskForLog(null);
    setShowSuccessMsg(true);
    setTimeout(() => setShowSuccessMsg(false), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    navigate('/');
  };

  return (
    <div
      className="min-h-screen bg-[#F7F7F7] text-[#14213D]"
      style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
    >
      {/* Header */}
      <header className="border-b border-[#14213D]/10 bg-white px-6 py-4 flex justify-between items-center shadow-sm">
        <div>
          <span
            className="text-[11px] uppercase tracking-widest text-[#14213D]/50 block font-mono"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            SIH26122 · Field Execution
          </span>
          <h1
            className="text-xl font-medium text-[#14213D]"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Site Engineer Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-medium">{userEmail}</div>
            <div
              className="text-[10px] text-[#4C7A4C] font-mono"
              style={{ fontFamily: "'IBM Plex Mono', monospace" }}
            >
              ● Local Storage Synced
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs px-3 py-1.5 rounded border border-[#14213D]/20 hover:bg-[#14213D]/5 transition-colors font-mono"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="p-5 md:p-8 max-w-5xl mx-auto space-y-8">
        {showSuccessMsg && (
          <div className="px-4 py-3 rounded text-sm bg-[#4C7A4C1A] text-[#4C7A4C] border border-[#4C7A4C]/30 flex justify-between items-center">
            <span>✓ Daily field progress & photo evidence logged successfully!</span>
          </div>
        )}

        {/* Top Summary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border border-[#14213D]/10">
            <span
              className="text-[11px] text-[#14213D]/50 uppercase block font-mono"
              style={{ fontFamily: "'IBM Plex Mono', monospace" }}
            >
              Assigned Daily Tasks
            </span>
            <div
              className="text-2xl font-bold mt-1"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {tasks.length} Activities
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-[#14213D]/10">
            <span
              className="text-[11px] text-[#14213D]/50 uppercase block font-mono"
              style={{ fontFamily: "'IBM Plex Mono', monospace" }}
            >
              Active / Completed
            </span>
            <div
              className="text-2xl font-bold mt-1 text-[#4C7A4C]"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {tasks.filter((t) => t.status !== 'Pending').length} / {tasks.length}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-[#14213D]/10">
            <span
              className="text-[11px] text-[#14213D]/50 uppercase block font-mono"
              style={{ fontFamily: "'IBM Plex Mono', monospace" }}
            >
              Submitted Log Entries
            </span>
            <div
              className="text-2xl font-bold mt-1 text-[#3D5A80]"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {historyLogs.length} Records
            </div>
          </div>
        </div>

        {/* Schedule Activities List */}
        <div className="bg-white rounded-lg border border-[#14213D]/10 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-[#14213D]/10 flex justify-between items-center bg-[#14213D]/[0.02]">
            <div>
              <h2
                className="text-base font-medium"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Today's Daily Work Schedule (10 Activities)
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
                      <span
                        className="text-xs px-2 py-0.5 bg-[#14213D]/10 rounded font-semibold text-[#14213D] font-mono"
                        style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                      >
                        WBS {task.wbsCode}
                      </span>
                      <span
                        className="text-xs text-[#3D5A80] font-medium font-mono"
                        style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                      >
                        {task.projectName}
                      </span>
                    </div>
                    <h3 className="text-sm font-medium text-[#14213D] group-hover:text-[#3D5A80] transition-colors">
                      {task.activityName}
                    </h3>
                    <p
                      className="text-xs text-[#14213D]/60 font-mono"
                      style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                    >
                      📍 {task.location}
                    </p>

                    <div className="pt-2 w-full max-w-xs">
                      <div
                        className="flex justify-between text-[11px] text-[#14213D]/60 mb-1 font-mono"
                        style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                      >
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
                      style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                    >
                      {task.status}
                    </span>

                    <button
                      onClick={(e) => handleOpenLogModal(task, e)}
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

        {/* Audit Trail & Log History */}
        <div className="bg-white rounded-lg border border-[#14213D]/10 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-[#14213D]/10 bg-[#14213D]/[0.02]">
            <h2
              className="text-base font-medium"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Daily Submission Audit Trail
            </h2>
            <p className="text-xs text-[#14213D]/50">
              Recent daily logs captured by site engineer.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead
                className="bg-[#F7F7F7] border-b border-[#14213D]/10 text-[#14213D]/50 font-mono uppercase text-[10px]"
                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
              >
                <tr>
                  <th className="px-5 py-3">Log ID</th>
                  <th className="px-5 py-3">WBS Code</th>
                  <th className="px-5 py-3">Activity</th>
                  <th className="px-5 py-3">Logged Qty</th>
                  <th className="px-5 py-3">Evidence File</th>
                  <th className="px-5 py-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#14213D]/10">
                {historyLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                    <td
                      className="px-5 py-3.5 font-mono text-[#14213D]/60 font-semibold"
                      style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                    >
                      {log.id}
                    </td>
                    <td
                      className="px-5 py-3.5 font-mono text-[#3D5A80]"
                      style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                    >
                      {log.wbsCode}
                    </td>
                    <td className="px-5 py-3.5 font-medium text-[#14213D] max-w-xs truncate">
                      {log.activityName}
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-[#4C7A4C]">
                      {log.loggedQty} {log.unit}
                    </td>
                    <td
                      className="px-5 py-3.5 font-mono text-xs text-[#14213D]/70"
                      style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                    >
                      📷 {log.photoName}
                    </td>
                    <td
                      className="px-5 py-3.5 font-mono text-[#14213D]/50 text-[11px]"
                      style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                    >
                      {log.timestamp}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Activity Details */}
        {selectedTaskDetails && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-40">
            <div className="bg-white rounded-lg max-w-2xl w-full p-6 shadow-2xl border border-[#14213D]/10 space-y-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start border-b border-[#14213D]/10 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-xs bg-[#14213D]/10 px-2 py-0.5 rounded font-semibold font-mono"
                      style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                    >
                      WBS {selectedTaskDetails.wbsCode}
                    </span>
                    <span
                      className="text-xs text-[#3D5A80] font-mono"
                      style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                    >
                      {selectedTaskDetails.projectName}
                    </span>
                  </div>
                  <h2
                    className="text-lg font-medium text-[#14213D]"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
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

              <div
                className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-[#F7F7F7] p-4 rounded-lg border border-[#14213D]/10 font-mono"
                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
              >
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
                <h4
                  className="text-xs text-[#14213D]/50 uppercase mb-1 font-mono"
                  style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                >
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
                  style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                >
                  Close
                </button>
                <button
                  onClick={(e) => {
                    const taskToLog = selectedTaskDetails;
                    setSelectedTaskDetails(null);
                    handleOpenLogModal(taskToLog, e);
                  }}
                  className="px-5 py-2 rounded text-xs font-medium bg-[#14213D] text-white hover:bg-[#1a2847]"
                >
                  Log Daily Progress →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Daily Log Data Capture */}
        {activeTaskForLog && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-lg w-full p-6 shadow-xl border border-[#14213D]/10 space-y-5">
              <div className="flex justify-between items-start border-b border-[#14213D]/10 pb-3">
                <div>
                  <span
                    className="text-[10px] text-[#14213D]/50 uppercase font-mono block"
                    style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                  >
                    Daily Progress Log
                  </span>
                  <h2
                    className="text-base font-medium"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {activeTaskForLog.activityName}
                  </h2>
                  <p
                    className="text-xs text-[#14213D]/50 font-mono"
                    style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                  >
                    WBS: {activeTaskForLog.wbsCode} · Target: {activeTaskForLog.targetQty}{' '}
                    {activeTaskForLog.unit}
                  </p>
                </div>
                <button
                  onClick={() => setActiveTaskForLog(null)}
                  className="text-gray-400 hover:text-black font-mono text-sm"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleDataSubmit} className="space-y-4">
                <div>
                  <label
                    className="block text-[11px] uppercase text-[#14213D]/50 mb-1 font-mono"
                    style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                  >
                    Logged Completed Quantity ({activeTaskForLog.unit})
                  </label>
                  <input
                    type="number"
                    required
                    max={activeTaskForLog.targetQty * 1.5}
                    value={completedInput}
                    onChange={(e) => setCompletedInput(e.target.value)}
                    placeholder={`e.g. ${activeTaskForLog.targetQty}`}
                    className="w-full px-4 py-2.5 rounded border border-[#14213D]/15 text-sm focus:outline-none focus:border-[#3D5A80]"
                  />
                </div>

                <div>
                  <label
                    className="block text-[11px] uppercase text-[#14213D]/50 mb-1 font-mono"
                    style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                  >
                    Attach Site Evidence Photo
                  </label>
                  <label className="flex flex-col items-center justify-center border border-dashed border-[#14213D]/25 rounded py-5 cursor-pointer hover:border-[#3D5A80] transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={(e) => setPhoto(e.target.files[0])}
                      className="hidden"
                    />
                    <span
                      className="text-xs text-[#14213D]/60 font-mono"
                      style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                    >
                      {photo
                        ? photo.name
                        : activeTaskForLog.photoName || 'Click to select site image'}
                    </span>
                  </label>
                </div>

                <div>
                  <label
                    className="block text-[11px] uppercase text-[#14213D]/50 mb-1 font-mono"
                    style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                  >
                    Daily Field Remarks / Notes
                  </label>
                  <textarea
                    value={notesInput}
                    onChange={(e) => setNotesInput(e.target.value)}
                    rows={3}
                    placeholder="Enter site observations, delays, equipment used..."
                    className="w-full px-4 py-2.5 rounded border border-[#14213D]/15 text-sm resize-none focus:outline-none focus:border-[#3D5A80]"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-[#14213D]/10">
                  <button
                    type="button"
                    onClick={() => setActiveTaskForLog(null)}
                    className="px-4 py-2 rounded text-xs border border-[#14213D]/20 text-[#14213D]/70 font-mono"
                    style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded text-xs font-medium bg-[#14213D] text-white hover:bg-[#1a2847]"
                  >
                    Submit Daily Log
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}