import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { INITIAL_TASKS } from '../services/mockData';

export default function DataCapture() {
  const navigate = useNavigate();
  const routeLocation = useLocation();

  // Task passed via navigate() state, e.g. from "Log Progress" button
  const passedTask = routeLocation.state?.task || null;

  // If no task was passed, allow picking one from the current task list
  const [availableTasks] = useState(() => {
    const saved = localStorage.getItem('site_engineer_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });
  const [selectedWbs, setSelectedWbs] = useState(passedTask?.wbsCode || '');

  const activeTask = passedTask || availableTasks.find((t) => t.wbsCode === selectedWbs) || null;

  const [quantity, setQuantity] = useState(activeTask?.completedQty > 0 ? activeTask.completedQty : '');
  const [notes, setNotes] = useState(activeTask?.notes || '');
  const [photo, setPhoto] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  // ---------- AI "Analyzing image" simulation ----------
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState(null);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhoto(file);
    setAiSuggestion(null);

    if (!activeTask) return; // no target to compare against yet

    setAiAnalyzing(true);
    setTimeout(() => {
      const simulatedPct = Math.floor(Math.random() * (85 - 45 + 1)) + 45; // 45–85%
      const suggestedQty = Math.round((simulatedPct / 100) * activeTask.targetQty);
      setAiSuggestion({ pct: simulatedPct, qty: suggestedQty });
      setAiAnalyzing(false);
    }, 1600);
  };

  const applyAiSuggestion = () => {
    if (aiSuggestion) setQuantity(aiSuggestion.qty);
  };

  // ---------- GPS auto-tag ----------
  const [coords, setCoords] = useState(null);
  const [locationStatus, setLocationStatus] = useState('loading'); // loading | success | denied | unsupported

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus('unsupported');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationStatus('success');
      },
      () => setLocationStatus('denied'),
      { timeout: 8000 }
    );
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!activeTask) return;

    const loggedQty = Number(quantity);
    const updatedStatus = loggedQty >= activeTask.targetQty ? 'Completed' : 'In Progress';
    const currentTimestamp = new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    const photoFileName = photo ? photo.name : activeTask.photoName || 'site_evidence.jpg';

    // Update the task in site_engineer_tasks
    const savedTasks = localStorage.getItem('site_engineer_tasks');
    const tasksList = savedTasks ? JSON.parse(savedTasks) : INITIAL_TASKS;
    const updatedTasks = tasksList.map((t) =>
      t.id === activeTask.id
        ? { ...t, completedQty: loggedQty, status: updatedStatus, notes, photoName: photoFileName }
        : t
    );
    localStorage.setItem('site_engineer_tasks', JSON.stringify(updatedTasks));

    // Append to audit trail
    const savedHistory = localStorage.getItem('site_engineer_history');
    const historyList = savedHistory ? JSON.parse(savedHistory) : [];
    const newLogEntry = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      taskId: activeTask.id,
      wbsCode: activeTask.wbsCode,
      activityName: activeTask.activityName,
      loggedQty,
      unit: activeTask.unit,
      timestamp: currentTimestamp,
      photoName: photoFileName,
      notes: notes || 'No extra notes provided.',
      geoTag:
        locationStatus === 'success'
          ? `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`
          : null,
    };
    localStorage.setItem('site_engineer_history', JSON.stringify([newLogEntry, ...historyList]));

    setSubmitted(true);
    setTimeout(() => {
      navigate('/engineer-dashboard', { state: { justLogged: true } });
    }, 1200);
  };

  return (
    <div
      className="min-h-screen bg-[#F7F7F7] text-[#14213D]"
      style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
    >
      <header className="border-b border-[#14213D]/10 bg-white px-6 py-4 flex items-center gap-4 shadow-sm">
        <button
          onClick={() => navigate('/engineer-dashboard')}
          className="text-xs px-3 py-1.5 rounded border border-[#14213D]/20 hover:bg-[#14213D]/5 font-mono"
        >
          ← Back
        </button>
        <div>
          <span className="text-[11px] uppercase tracking-widest text-[#14213D]/50 block font-mono">
            SIH26122 · Field Entry
          </span>
          <h1 className="text-xl font-medium" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Data Capture
          </h1>
        </div>
      </header>

      <main className="px-5 md:px-10 py-7 md:py-9 max-w-2xl mx-auto">
        {submitted && (
          <div className="mb-6 px-4 py-3 rounded text-sm bg-[#4C7A4C1A] text-[#4C7A4C]">
            ✓ Progress entry submitted successfully. Redirecting to dashboard...
          </div>
        )}

        {/* If no task passed, let user pick one */}
        {!passedTask && (
          <div className="mb-6">
            <label className="block text-[11px] uppercase text-[#14213D]/50 mb-2 font-mono">
              Activity
            </label>
            <select
              required
              value={selectedWbs}
              onChange={(e) => setSelectedWbs(e.target.value)}
              className="w-full px-4 py-2.5 rounded border border-[#14213D]/15 bg-white text-sm focus:outline-none focus:border-[#3D5A80]"
            >
              <option value="">Select an activity</option>
              {availableTasks.map((a) => (
                <option key={a.id} value={a.wbsCode}>
                  {a.wbsCode} — {a.activityName}
                </option>
              ))}
            </select>
          </div>
        )}

        {!activeTask ? (
          <p className="text-sm text-[#14213D]/50">
            Select an activity above to begin logging progress.
          </p>
        ) : (
          <>
            {/* Task info card */}
            <div className="bg-white rounded-lg border border-[#14213D]/10 p-4 mb-6">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs bg-[#14213D]/10 px-2 py-0.5 rounded font-semibold font-mono">
                  WBS {activeTask.wbsCode}
                </span>
                <span className="text-xs text-[#3D5A80] font-mono">{activeTask.projectName}</span>
              </div>
              <h2 className="text-base font-medium" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {activeTask.activityName}
              </h2>
              <p className="text-xs text-[#14213D]/50 font-mono mt-1">
                Target: {activeTask.targetQty} {activeTask.unit}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Quantity */}
              <div>
                <label className="block text-[11px] uppercase text-[#14213D]/50 mb-2 font-mono">
                  Quantity Completed ({activeTask.unit})
                </label>
                <input
                  type="number"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder={`e.g. ${activeTask.targetQty}`}
                  className="w-full px-4 py-2.5 rounded border border-[#14213D]/15 bg-white text-sm focus:outline-none focus:border-[#3D5A80]"
                />
              </div>

              {/* Photo upload */}
              <div>
                <label className="block text-[11px] uppercase text-[#14213D]/50 mb-2 font-mono">
                  Evidence Photo
                </label>
                <label className="flex items-center justify-center border border-dashed border-[#14213D]/25 rounded py-8 cursor-pointer hover:border-[#3D5A80] transition-colors">
                  <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                  <span className="text-sm text-[#14213D]/50">
                    {photo ? photo.name : 'Click to upload a site photo'}
                  </span>
                </label>

                {/* AI Analyzing simulation */}
                {aiAnalyzing && (
                  <div className="mt-3 flex items-center gap-2 text-xs text-[#3D5A80] font-mono">
                    <span className="w-3 h-3 border-2 border-[#3D5A80] border-t-transparent rounded-full animate-spin" />
                    Analyzing image...
                  </div>
                )}

                {aiSuggestion && !aiAnalyzing && (
                  <div className="mt-3 p-3 rounded bg-[#3D5A80]/5 border border-[#3D5A80]/20 flex items-center justify-between gap-3">
                    <div className="text-xs text-[#14213D]/80">
                      <span className="font-semibold text-[#3D5A80]">AI Suggestion:</span> ~
                      {aiSuggestion.pct}% complete (≈ {aiSuggestion.qty} {activeTask.unit})
                      <div className="text-[10px] text-[#14213D]/40 mt-0.5">
                        Simulated preview — full vision model integration planned for backend phase.
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={applyAiSuggestion}
                      className="text-xs px-3 py-1.5 rounded bg-[#3D5A80] text-white shrink-0"
                    >
                      Use this value
                    </button>
                  </div>
                )}
              </div>

              {/* Notes */}
              <div>
                <label className="block text-[11px] uppercase text-[#14213D]/50 mb-2 font-mono">
                  Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  placeholder="Any observations from site..."
                  className="w-full px-4 py-2.5 rounded border border-[#14213D]/15 bg-white text-sm resize-none focus:outline-none focus:border-[#3D5A80]"
                />
              </div>

              {/* GPS auto-tag */}
              <div className="flex items-center gap-2 text-xs text-[#14213D]/60 font-mono">
                {locationStatus === 'loading' && (
                  <>
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    Detecting location...
                  </>
                )}
                {locationStatus === 'success' && (
                  <>
                    <span className="w-2 h-2 rounded-full bg-[#4C7A4C]" />
                    📍 Location captured: {coords.lat.toFixed(4)}°N, {coords.lng.toFixed(4)}°E
                  </>
                )}
                {(locationStatus === 'denied' || locationStatus === 'unsupported') && (
                  <>
                    <span className="w-2 h-2 rounded-full bg-[#14213D]/30" />
                    Location unavailable — entry will be saved without geo-tag.
                  </>
                )}
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded bg-[#14213D] text-white text-sm font-medium hover:bg-[#1a2847] transition-colors"
              >
                Submit Progress
              </button>
            </form>
          </>
        )}
      </main>
    </div>
  );
}