import { activities } from '../services/mockData';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function Reports() {
  const statusCounts = activities.reduce((acc, a) => {
    acc[a.status] = (acc[a.status] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.keys(statusCounts).map((status) => ({
    name: status,
    value: statusCounts[status],
  }));

  const COLORS = {
    Completed: '#4C7A4C',
    Delayed: '#E85D2F',
    'In Progress': '#3D5A80',
    'Not Started': '#14213D66',
  };

  const varianceData = activities.map((a) => ({
    ...a,
    variance: a.plannedQty - a.actualQty,
  }));

  return (
    <div className="px-5 md:px-10 py-7 md:py-9 max-w-5xl">
      <div className="mb-8 md:mb-10">
        <div className="text-[13px] text-[#14213D]/50 mb-1" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
          ANALYTICS
        </div>
        <h1 className="text-2xl md:text-3xl font-medium text-[#14213D]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Reports
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 mb-8 md:mb-10 pb-8 md:pb-10 border-b border-[#14213D]/10">
        <div>
          <h2 className="text-[11px] uppercase text-[#14213D]/50 mb-4" style={{ fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '0.05em' }}>
            Status Distribution
          </h2>
          <ResponsiveContainer width="100%" height={230}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75}>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#8884d8'} />
                ))}
              </Pie>
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h2 className="text-[11px] uppercase text-[#14213D]/50 mb-4" style={{ fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '0.05em' }}>
            Risk Summary
          </h2>
          <div className="divide-y divide-[#14213D]/10">
            {activities.map((a) => (
              <div key={a.id} className="flex justify-between items-center py-2.5 gap-3">
                <span className="text-sm text-[#14213D]/80">{a.activityName}</span>
                <span
                  className="text-xs font-medium px-2 py-0.5 rounded shrink-0"
                  style={{
                    color: a.riskScore === 'High' ? '#E85D2F' : a.riskScore === 'Medium' ? '#14213D' : '#4C7A4C',
                    backgroundColor: a.riskScore === 'High' ? '#E85D2F1A' : a.riskScore === 'Medium' ? '#14213D0D' : '#4C7A4C1A',
                  }}
                >
                  {a.riskScore}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-[11px] uppercase text-[#14213D]/50 mb-4" style={{ fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '0.05em' }}>
          Planned vs Actual Variance
        </h2>

        {/* Desktop table */}
        <div className="hidden md:block border-t border-[#14213D]/10">
          <div
            className="grid grid-cols-[90px_1.6fr_120px_120px_120px] gap-6 py-3 text-[11px] uppercase text-[#14213D]/45 border-b border-[#14213D]/10"
            style={{ fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '0.05em' }}
          >
            <div>WBS</div>
            <div>Activity</div>
            <div>Planned</div>
            <div>Actual</div>
            <div>Variance</div>
          </div>
          {varianceData.map((a) => (
            <div key={a.id} className="grid grid-cols-[90px_1.6fr_120px_120px_120px] gap-6 py-3.5 items-center border-b border-[#14213D]/10">
              <div className="text-[13px] text-[#14213D]/60" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{a.wbsCode}</div>
              <div className="text-sm text-[#14213D]">{a.activityName}</div>
              <div className="text-sm text-[#14213D]/60">{a.plannedQty}</div>
              <div className="text-sm text-[#14213D]/60">{a.actualQty}</div>
              <div className="text-sm font-medium" style={{ color: a.variance > 0 ? '#E85D2F' : '#4C7A4C' }}>
                {a.variance > 0 ? `-${a.variance}` : 'On track'}
              </div>
            </div>
          ))}
        </div>

        {/* Mobile cards */}
        <div className="md:hidden border-t border-[#14213D]/10">
          {varianceData.map((a) => (
            <div key={a.id} className="py-3.5 border-b border-[#14213D]/10 space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-[13px] text-[#14213D]/60" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{a.wbsCode}</span>
                <span className="text-sm font-medium" style={{ color: a.variance > 0 ? '#E85D2F' : '#4C7A4C' }}>
                  {a.variance > 0 ? `-${a.variance}` : 'On track'}
                </span>
              </div>
              <div className="text-sm text-[#14213D]">{a.activityName}</div>
              <div className="text-xs text-[#14213D]/50">Planned: {a.plannedQty} · Actual: {a.actualQty}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Reports;