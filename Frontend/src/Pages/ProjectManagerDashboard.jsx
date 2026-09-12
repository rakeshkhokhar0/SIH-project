import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const statusPriority = { Delayed: 0, 'At Risk': 1, 'On Track': 2 };

const statusStyle = {
  'On Track': { color: '#4C7A4C', bg: '#4C7A4C1A' },
  'At Risk': { color: '#B08900', bg: '#FDF0C41A' },
  Delayed: { color: '#E85D2F', bg: '#E85D2F1A' },
};

const healthColor = {
  green: '#4C7A4C',
  yellow: '#D9A400',
  red: '#E85D2F',
};

function deriveProjectStatus(actualProgress, riskCount) {
  if (riskCount > 1 || actualProgress < 40) return 'Delayed';
  if (actualProgress < 75) return 'At Risk';
  return 'On Track';
}

function buildProjectsFromTasks(tasks) {
  const grouped = {};
  tasks.forEach((task) => {
    if (!grouped[task.projectName]) grouped[task.projectName] = [];
    grouped[task.projectName].push(task);
  });

  return Object.entries(grouped).map(([projectName, projectTasks], idx) => {
    const totalActivities = projectTasks.length;
    const completedActivities = projectTasks.filter((t) => t.status === 'Completed').length;

    const totalTarget = projectTasks.reduce((sum, t) => sum + Number(t.targetQty || 0), 0);
    const totalCompleted = projectTasks.reduce((sum, t) => sum + Number(t.completedQty || 0), 0);
    const actualProgress = totalTarget > 0 ? Math.round((totalCompleted / totalTarget) * 100) : 0;

    const riskActivities = projectTasks
      .filter((t) => t.status !== 'Completed' && t.completedQty / t.targetQty < 0.5)
      .map((t) => ({
        wbs: t.wbsCode,
        name: t.activityName,
        delayDays: Math.max(1, Math.round((1 - t.completedQty / t.targetQty) * 5)),
      }));

    const activityHealth = projectTasks.map((t) => {
      const pct = t.targetQty > 0 ? (t.completedQty / t.targetQty) * 100 : 0;
      if (pct >= 75) return 'green';
      if (pct >= 40) return 'yellow';
      return 'red';
    });

    return {
      id: `PRJ-${idx + 1}`,
      name: projectName,
      location: projectTasks[0]?.location || '—',
      actualProgress,
      status: deriveProjectStatus(actualProgress, riskActivities.length),
      totalActivities,
      completedActivities,
      riskActivities,
      activityHealth,
    };
  });
}

export default function ProjectManagerDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview'); // overview | projects | approvals | reports
  const [projects, setProjects] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  const userEmail = localStorage.getItem('userEmail') || 'pm@oilindia.in';

  const loadData = () => {
    const savedTasks = localStorage.getItem('site_engineer_tasks');
    setProjects(savedTasks ? buildProjectsFromTasks(JSON.parse(savedTasks)) : []);

    const savedSubmissions = localStorage.getItem('planner_submissions');
    const all = savedSubmissions ? JSON.parse(savedSubmissions) : [];
    setPendingApprovals(all.filter((s) => s.status === 'Pending'));
  };

  useEffect(() => {
    loadData();
    window.addEventListener('storage', loadData);
    return () => window.removeEventListener('storage', loadData);
  }, []);

  const handleApprove = (id) => {
    const saved = localStorage.getItem('planner_submissions');
    const all = saved ? JSON.parse(saved) : [];
    const updated = all.map((s) => (s.id === id ? { ...s, status: 'Approved' } : s));
    localStorage.setItem('planner_submissions', JSON.stringify(updated));
    setPendingApprovals(updated.filter((s) => s.status === 'Pending'));
  };

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    navigate('/');
  };

  const atRiskCount = projects.filter((p) => p.status !== 'On Track').length;
  const sortedProjects = [...projects].sort(
    (a, b) => statusPriority[a.status] - statusPriority[b.status]
  );
  const toggleExpand = (id) => setExpandedId(expandedId === id ? null : id);

  const NAV_ITEMS = [
    { key: 'overview', n: '01', label: 'Portfolio Overview' },
    { key: 'projects', n: '02', label: 'Projects' },
    { key: 'approvals', n: '03', label: 'Approvals' },
    { key: 'reports', n: '04', label: 'Reports' },
  ];

  // Reusable project list block (used in both Overview-preview and full Projects tab)
  const renderProjectCard = (project) => (
    <div
      key={project.id}
      onClick={() => toggleExpand(project.id)}
      className="p-5 hover:bg-[#14213D]/[0.03] cursor-pointer transition-colors"
    >
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-sm font-medium">{project.name}</h3>
          <p className="text-xs text-[#14213D]/50 font-mono">📍 {project.location}</p>
        </div>
        <span
          className="text-[11px] px-2.5 py-1 rounded font-medium font-mono"
          style={{
            color: statusStyle[project.status]?.color,
            backgroundColor: statusStyle[project.status]?.bg,
          }}
        >
          {project.status}
        </span>
      </div>

      <div className="flex items-center gap-4 text-xs text-[#14213D]/60 font-mono mb-2">
        <span>Actual: {project.actualProgress}%</span>
        <span>{project.completedActivities}/{project.totalActivities} activities</span>
      </div>

      <div className="w-full bg-[#14213D]/10 h-1.5 rounded-full overflow-hidden mb-3">
        <div
          className="h-full rounded-full"
          style={{
            width: `${project.actualProgress}%`,
            backgroundColor:
              project.status === 'Delayed'
                ? '#E85D2F'
                : project.status === 'At Risk'
                ? '#D9A400'
                : '#4C7A4C',
          }}
        />
      </div>

      <div className="flex items-center gap-2">
        <span className="text-[10px] text-[#14213D]/40 font-mono uppercase">
          Activity health
        </span>
        <div className="flex gap-1">
          {project.activityHealth.map((h, idx) => (
            <div
              key={idx}
              className="w-3.5 h-3.5 rounded-sm"
              style={{ backgroundColor: healthColor[h] }}
              title={h}
            />
          ))}
        </div>
      </div>

      {expandedId === project.id && (
        <div
          className="mt-4 bg-[#F7F7F7] rounded p-4 border border-[#14213D]/10"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="text-[10px] uppercase text-[#14213D]/50 mb-2 font-mono">
            Top At-Risk Activities
          </p>
          {project.riskActivities.length === 0 ? (
            <p className="text-xs text-[#14213D]/50">
              No at-risk activities — project is healthy.
            </p>
          ) : (
            project.riskActivities.map((act, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between py-2 text-xs border-b border-[#14213D]/10 last:border-none"
              >
                <div>
                  <span className="font-mono font-semibold text-[#3D5A80]">
                    WBS {act.wbs}
                  </span>
                  <span className="text-[#14213D]/70"> — {act.name}</span>
                </div>
                <span className="text-[#E85D2F] font-medium">
                  ~{act.delayDays}d behind
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );

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
              {item.key === 'approvals' && pendingApprovals.length > 0 && (
                <span className="text-[10px] bg-white/20 rounded-full px-2 py-0.5">
                  {pendingApprovals.length}
                </span>
              )}
              {item.key === 'projects' && atRiskCount > 0 && (
                <span className="text-[10px] bg-[#E85D2F]/80 rounded-full px-2 py-0.5">
                  {atRiskCount}
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
              SIH26122 · Portfolio Oversight
            </span>
            <h1 className="text-xl font-medium" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {NAV_ITEMS.find((n) => n.key === activeTab)?.label}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-medium">{userEmail}</div>
              <div className="text-[10px] text-[#4C7A4C] font-mono">● Live Sync Active</div>
            </div>
            <button
              onClick={loadData}
              className="text-xs px-3 py-1.5 rounded border border-[#14213D]/20 hover:bg-[#14213D]/5 font-mono"
            >
              ↻ Refresh
            </button>
          </div>
        </header>

        <main className="p-5 md:p-8 max-w-5xl mx-auto space-y-8">

          {/* ---------- OVERVIEW TAB ---------- */}
          {activeTab === 'overview' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg border border-[#14213D]/10">
                  <span className="text-[11px] text-[#14213D]/50 uppercase block font-mono">
                    Total Projects
                  </span>
                  <div className="text-2xl font-bold mt-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {projects.length}
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-[#14213D]/10">
                  <span className="text-[11px] text-[#14213D]/50 uppercase block font-mono">
                    At Risk / Delayed
                  </span>
                  <div
                    className="text-2xl font-bold mt-1 text-[#E85D2F]"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {atRiskCount}
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-[#14213D]/10">
                  <span className="text-[11px] text-[#14213D]/50 uppercase block font-mono">
                    Pending Approvals
                  </span>
                  <div
                    className="text-2xl font-bold mt-1 text-[#3D5A80]"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {pendingApprovals.length}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-[#14213D]/10 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-[#14213D]/10 bg-[#14213D]/[0.02] flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-medium" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      Highest Priority Projects
                    </h2>
                    <p className="text-xs text-[#14213D]/50">
                      Auto-sorted by risk. Click a project to see at-risk WBS activities.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('projects')}
                    className="text-xs text-[#3D5A80] font-mono hover:underline shrink-0"
                  >
                    View all →
                  </button>
                </div>

                {projects.length === 0 ? (
                  <div className="p-8 text-center text-sm text-[#14213D]/50">
                    No site engineer data found yet.
                  </div>
                ) : (
                  <div className="divide-y divide-[#14213D]/10">
                    {sortedProjects.slice(0, 3).map(renderProjectCard)}
                  </div>
                )}
              </div>
            </>
          )}

          {/* ---------- PROJECTS TAB ---------- */}
          {activeTab === 'projects' && (
            <div className="bg-white rounded-lg border border-[#14213D]/10 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-[#14213D]/10 bg-[#14213D]/[0.02]">
                <h2 className="text-base font-medium" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  All Projects
                </h2>
                <p className="text-xs text-[#14213D]/50">
                  Auto-sorted by risk. Click a project to see at-risk WBS activities.
                </p>
              </div>

              {projects.length === 0 ? (
                <div className="p-8 text-center text-sm text-[#14213D]/50">
                  No site engineer data found yet.
                </div>
              ) : (
                <div className="divide-y divide-[#14213D]/10">
                  {sortedProjects.map(renderProjectCard)}
                </div>
              )}
            </div>
          )}

          {/* ---------- APPROVALS TAB ---------- */}
          {activeTab === 'approvals' && (
            <div className="bg-white rounded-lg border border-[#14213D]/10 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-[#14213D]/10 bg-[#14213D]/[0.02]">
                <h2 className="text-base font-medium" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Pending Approvals
                </h2>
                <p className="text-xs text-[#14213D]/50">
                  Schedule updates submitted by Planners, awaiting your review.
                </p>
              </div>

              {pendingApprovals.length === 0 ? (
                <div className="p-6 text-center text-sm text-[#14213D]/50">
                  No pending approvals right now.
                </div>
              ) : (
                <div className="divide-y divide-[#14213D]/10">
                  {pendingApprovals.map((item) => (
                    <div key={item.id} className="p-5 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs text-[#14213D]/50 font-mono">{item.date}</p>
                        <p className="text-sm font-medium">{item.project}</p>
                        <p className="text-sm text-[#14213D]/70">{item.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-[11px] text-[#14213D]/40 font-mono">
                            Submitted by {item.submittedBy}
                          </p>
                          <span
                            className="text-[10px] font-medium px-2 py-0.5 rounded font-mono"
                            style={{
                              color: item.aiConfidence >= 85 ? '#4C7A4C' : '#D9A400',
                              backgroundColor: item.aiConfidence >= 85 ? '#4C7A4C1A' : '#FDF0C41A',
                            }}
                          >
                            AI Confidence: {item.aiConfidence}%
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleApprove(item.id)}
                        className="px-4 py-2 text-xs font-medium rounded bg-[#14213D] text-white hover:bg-[#1a2847] shrink-0"
                      >
                        Approve
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ---------- REPORTS TAB ---------- */}
          {activeTab === 'reports' && (
            <div className="bg-white rounded-lg border border-[#14213D]/10 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-[#14213D]/10 bg-[#14213D]/[0.02]">
                <h2 className="text-base font-medium" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Portfolio Summary Report
                </h2>
                <p className="text-xs text-[#14213D]/50">
                  Plan vs actual snapshot across all active projects.
                </p>
              </div>

              {projects.length === 0 ? (
                <div className="p-8 text-center text-sm text-[#14213D]/50">
                  No data to report yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-[11px] uppercase text-[#14213D]/50 font-mono border-b border-[#14213D]/10">
                        <th className="px-5 py-3">Project</th>
                        <th className="px-5 py-3">Progress</th>
                        <th className="px-5 py-3">Activities</th>
                        <th className="px-5 py-3">At-Risk</th>
                        <th className="px-5 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#14213D]/10">
                      {sortedProjects.map((project) => (
                        <tr key={project.id}>
                          <td className="px-5 py-3 font-medium">{project.name}</td>
                          <td className="px-5 py-3 font-mono">{project.actualProgress}%</td>
                          <td className="px-5 py-3 font-mono">
                            {project.completedActivities}/{project.totalActivities}
                          </td>
                          <td className="px-5 py-3 font-mono">{project.riskActivities.length}</td>
                          <td className="px-5 py-3">
                            <span
                              className="text-[11px] px-2.5 py-1 rounded font-medium font-mono"
                              style={{
                                color: statusStyle[project.status]?.color,
                                backgroundColor: statusStyle[project.status]?.bg,
                              }}
                            >
                              {project.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}