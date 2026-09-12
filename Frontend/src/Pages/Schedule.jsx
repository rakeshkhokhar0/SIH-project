import { useState, useEffect } from 'react';

function Schedule() {
  const [activities, setActivities] = useState([]);

  const loadData = () => {
    const saved = localStorage.getItem('site_engineer_tasks');
    setActivities(saved ? JSON.parse(saved) : []);
  };

  useEffect(() => {
    loadData();
    window.addEventListener('storage', loadData);
    return () => window.removeEventListener('storage', loadData);
  }, []);

  const statusStyles = {
    Completed: { color: '#4C7A4C', bg: '#4C7A4C1A' },
    Delayed: { color: '#E85D2F', bg: '#E85D2F1A' },
    'In Progress': { color: '#3D5A80', bg: '#3D5A801A' },
    Pending: { color: '#14213D', bg: '#14213D0D' },
    'Not Started': { color: '#14213D', bg: '#14213D0D' },
  };

  return (
    <div className="px-5 md:px-10 py-7 md:py-9 max-w-5xl">
      <div className="mb-8 md:mb-10 flex items-center justify-between">
        <div>
          <div className="text-[13px] text-[#14213D]/50 mb-1" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
            WORK BREAKDOWN
          </div>
          <h1 className="text-2xl md:text-3xl font-medium text-[#14213D]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Schedule
          </h1>
        </div>
        <button
          onClick={loadData}
          className="text-xs px-3 py-1.5 rounded border border-[#14213D]/20 hover:bg-[#14213D]/5 transition-colors font-mono"
        >
          ↻ Refresh
        </button>
      </div>

      {activities.length === 0 ? (
        <div className="text-center text-[#14213D]/50 py-16 border border-dashed border-[#14213D]/20 rounded-lg">
          No site data logged yet. Once a Site Engineer submits progress, schedule will appear here.
        </div>
      ) : (
        <div className="border-t border-[#14213D]/10">
          <div
            className="hidden md:grid grid-cols-[90px_1.4fr_1fr_110px_110px_110px] gap-6 py-3 text-[11px] uppercase text-[#14213D]/45 border-b border-[#14213D]/10"
            style={{ fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '0.06em' }}
          >
            <div>WBS</div>
            <div>Activity</div>
            <div>Progress</div>
            <div>Start</div>
            <div>End</div>
            <div>Status</div>
          </div>

          {activities.map((a) => {
            const pct = Math.min(Math.round((a.completedQty / a.targetQty) * 100), 100);
            const progressBar = (
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-[#14213D]/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: pct >= 100 ? '#4C7A4C' : pct < 50 ? '#E85D2F' : '#3D5A80',
                    }}
                  />
                </div>
                <span className="text-xs text-[#14213D]/50 w-9 text-right" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                  {pct}%
                </span>
              </div>
            );
            const statusBadge = (
              <span
                className="text-xs font-medium px-2.5 py-1 rounded w-fit"
                style={{
                  color: statusStyles[a.status]?.color || '#14213D',
                  backgroundColor: statusStyles[a.status]?.bg || '#14213D1A',
                }}
              >
                {a.status}
              </span>
            );

            return (
              <div key={a.id} className="border-b border-[#14213D]/10">
                <div className="hidden md:grid grid-cols-[90px_1.4fr_1fr_110px_110px_110px] gap-6 py-5 items-center hover:bg-[#14213D]/[0.025] transition-colors">
                  <div className="text-[13px] text-white bg-[#14213D] px-2 py-1 rounded w-fit" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                    {a.wbsCode}
                  </div>
                  <div className="text-[15px] text-[#14213D] font-medium leading-snug">{a.activityName}</div>
                  {progressBar}
                  <div className="text-sm text-[#14213D]/60">{a.startDate}</div>
                  <div className="text-sm text-[#14213D]/60">{a.targetEndDate}</div>
                  <div>{statusBadge}</div>
                </div>

                <div className="md:hidden py-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="text-[13px] text-white bg-[#14213D] px-2 py-1 rounded w-fit" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                      {a.wbsCode}
                    </div>
                    {statusBadge}
                  </div>
                  <div className="text-[15px] text-[#14213D] font-medium leading-snug">{a.activityName}</div>
                  {progressBar}
                  <div className="text-xs text-[#14213D]/50">
                    {a.startDate} → {a.targetEndDate}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Schedule;