import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

function Dashboard() {
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

  const total = activities.length;
  const delayed = activities.filter(
    (a) => a.status !== 'Completed' && a.completedQty / a.targetQty < 0.5
  ).length;
  const completed = activities.filter((a) => a.status === 'Completed').length;
  const avgProgress =
    total > 0
      ? Math.round(
          (activities.reduce((sum, a) => sum + (a.completedQty || 0) / (a.targetQty || 1), 0) / total) * 100
        )
      : 0;

  const chartData = activities.map((a) => ({
    name: a.wbsCode,
    Planned: a.targetQty,
    Actual: a.completedQty,
  }));

  const highRiskActivities = activities.filter(
    (a) => a.status !== 'Completed' && a.completedQty / a.targetQty < 0.4
  );

  return (
    <div className="px-5 md:px-10 py-7 md:py-9 max-w-5xl">
      <div className="mb-8 md:mb-10 flex items-center justify-between">
        <div>
          <div className="text-[13px] text-[#14213D]/50 mb-1" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
            OVERVIEW
          </div>
          <h1 className="text-2xl md:text-3xl font-medium text-[#14213D]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Dashboard
          </h1>
        </div>
        <button
          onClick={loadData}
          className="text-xs px-3 py-1.5 rounded border border-[#14213D]/20 hover:bg-[#14213D]/5 transition-colors font-mono"
        >
          ↻ Refresh
        </button>
      </div>

      {total === 0 ? (
        <div className="text-center text-[#14213D]/50 py-16 border border-dashed border-[#14213D]/20 rounded-lg">
          No site data logged yet. Once a Site Engineer submits progress, it will appear here.
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-10 mb-8 md:mb-10 pb-8 border-b border-[#14213D]/10">
            <div>
              <div className="text-5xl md:text-6xl font-medium text-[#3D5A80] leading-none" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {avgProgress}%
              </div>
              <div className="text-sm text-[#14213D]/60 mt-2">Average completion across active work</div>
            </div>
            <div className="flex gap-6 md:gap-8 md:pb-1">
              <div>
                <div className="text-xl md:text-2xl font-medium text-[#14213D]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{total}</div>
                <div className="text-xs text-[#14213D]/50 mt-1">Total activities</div>
              </div>
              <div>
                <div className="text-xl md:text-2xl font-medium text-[#E85D2F]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{delayed}</div>
                <div className="text-xs text-[#14213D]/50 mt-1">Delayed</div>
              </div>
              <div>
                <div className="text-xl md:text-2xl font-medium text-[#4C7A4C]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{completed}</div>
                <div className="text-xs text-[#14213D]/50 mt-1">Completed</div>
              </div>
            </div>
          </div>

          <div className="mb-8 md:mb-10">
            <h2 className="text-[11px] font-medium text-[#14213D]/70 mb-4 uppercase tracking-wide" style={{ fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '0.05em' }}>
              Planned vs Actual Quantity
            </h2>
            <div className="overflow-x-auto">
              <ResponsiveContainer width="100%" height={260} minWidth={500}>
                <BarChart data={chartData} barGap={4}>
                  <CartesianGrid strokeDasharray="2 4" stroke="#14213D" strokeOpacity={0.08} vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#14213D99' }} axisLine={{ stroke: '#14213D22' }} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#14213D99' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 4, border: '1px solid #14213D22', fontSize: 13 }} />
                  <Bar dataKey="Planned" fill="#3D5A80" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="Actual" fill="#E85D2F" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <h2 className="text-[11px] font-medium text-[#14213D]/70 mb-3 uppercase tracking-wide" style={{ fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '0.05em' }}>
              Risk Alerts
            </h2>
            {highRiskActivities.length === 0 ? (
              <p className="text-sm text-[#14213D]/50 py-3">No high-risk activities right now.</p>
            ) : (
              <div className="divide-y divide-[#14213D]/10 border-t border-b border-[#14213D]/10">
                {highRiskActivities.map((a) => (
                  <div key={a.id} className="flex flex-col md:flex-row md:justify-between md:items-center py-3 gap-1 md:gap-0">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-[#14213D]/40" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{a.wbsCode}</span>
                      <span className="text-sm text-[#14213D]">{a.activityName}</span>
                    </div>
                    <span className="text-xs font-medium text-[#E85D2F]">High risk</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;