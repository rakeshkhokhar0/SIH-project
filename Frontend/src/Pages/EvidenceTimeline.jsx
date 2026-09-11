import { useState } from 'react';

function Timeline() {
  const [timelineData, setTimelineData] = useState([
    {
      id: 1,
      date: '11 Sep 2026',
      time: '14:30',
      user: 'Aditi Srivastava',
      role: 'Site Engineer',
      type: 'Photo Upload',
      activity: 'Foundation Concrete Pouring - Zone A',
      status: 'Verified',
      note: 'Slump test passed (100mm). Photo metadata tags match GPS coordinates.',
      image: 'https://placehold.co/600x400/14213D/FFF?text=Concrete+Pouring+Zone+A',
    },
    {
      id: 2,
      date: '10 Sep 2026',
      time: '09:15',
      user: 'Achala',
      role: 'Project Manager',
      type: 'Status Update',
      activity: 'Excavation Work Completed',
      status: 'Approved',
      note: 'Depth checked against design specs. Clearance granted for next phase.',
      image: null,
    },
    {
      id: 3,
      date: '08 Sep 2026',
      time: '16:45',
      user: 'Aditi Srivastava',
      role: 'Site Engineer',
      type: 'Risk Alert',
      activity: 'Material Delivery Delay',
      status: 'Pending Review',
      note: 'Steel reinforcement shipment delayed by 2 days due to transit issues.',
      image: null,
    },
  ]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="mb-6">
        <h1
          className="text-2xl font-medium text-[#14213D]"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Evidence Timeline
        </h1>
        <p
          className="text-xs text-[#14213D]/50 mt-1"
          style={{ fontFamily: "'IBM Plex Mono', monospace" }}
        >
          AUDIT TRAIL & SITE SUBMISSION HISTORY
        </p>
      </div>

      {/* Main Container */}
      <div className="bg-white border border-[#14213D]/10 rounded-lg p-6 shadow-sm">
        {/* Sub Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#14213D]/10">
          <span className="text-sm font-medium text-[#14213D]">Recent Activity Logs</span>
          <span className="text-xs px-2.5 py-1 bg-[#14213D]/5 text-[#14213D] rounded border border-[#14213D]/10 font-medium">
            {timelineData.length} Logs Recorded
          </span>
        </div>

        {/* Timeline List */}
        <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#14213D]/15">
          {timelineData.map((item) => (
            <div key={item.id} className="relative group">
              {/* Dot Marker */}
              <div className="absolute -left-[1.85rem] top-1.5 w-3 h-3 rounded-full bg-[#14213D] border-2 border-white ring-2 ring-[#14213D]/20" />

              {/* Card Container */}
              <div className="bg-[#EAE7E1]/30 border border-[#14213D]/10 rounded-lg p-5">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[11px] text-[#14213D]/60 font-semibold"
                      style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                    >
                      {item.date} · {item.time}
                    </span>
                    <span className="text-xs text-[#14213D]/30">•</span>
                    <span className="text-xs font-medium text-[#14213D]">
                      {item.user} ({item.role})
                    </span>
                  </div>

                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-medium border ${
                      item.status === 'Verified' || item.status === 'Approved'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                    style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                  >
                    {item.status}
                  </span>
                </div>

                <h3 className="text-base font-medium text-[#14213D] mb-1">{item.activity}</h3>
                <p className="text-xs text-[#14213D]/70 leading-relaxed mb-3">{item.note}</p>

                {item.image && (
                  <div className="mt-3">
                    <img
                      src={item.image}
                      alt={item.activity}
                      className="w-full max-w-sm h-40 object-cover rounded border border-[#14213D]/15"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Timeline;