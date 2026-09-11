import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

function MainLayout({ children }) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', code: '01' },
    { name: 'Schedule', path: '/schedule', code: '02' },
    { name: 'Reports', path: '/reports', code: '03' },
    { name: 'Data Capture', path: '/data-capture', code: '04' },
  ];

  return (
    <div className="flex min-h-screen bg-[#EAE7E1]" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <div className="md:hidden fixed top-0 left-0 right-0 z-20 bg-[#14213D] text-white flex items-center justify-between px-4 py-3">
        <div className="text-base font-medium" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Intelli-Progress
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white/80 text-2xl leading-none px-2">
          {sidebarOpen ? '×' : '☰'}
        </button>
      </div>

      <aside
        className={`w-60 text-white flex-col fixed md:static top-0 left-0 h-full z-10 transition-transform duration-200
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 flex`}
        style={{ backgroundImage: 'radial-gradient(circle at 20% 0%, #1a2847 0%, #14213D 60%)' }}
      >
        <div className="px-6 py-7 border-b border-white/10 hidden md:block">
          <div className="text-lg font-medium tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Intelli-Progress
          </div>
          <div className="text-[11px] text-white/40 mt-1" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
            SIH26122 · v0.1
          </div>
        </div>
        <nav className="flex-1 px-3 py-6 space-y-1 mt-14 md:mt-0">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded transition-colors ${
                  active ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="text-[11px] text-white/30" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                  {item.code}
                </span>
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 bg-black/40 z-[5]" onClick={() => setSidebarOpen(false)} />
      )}

      <main
        className="flex-1 overflow-y-auto pt-14 md:pt-0"
        style={{
          backgroundImage: `linear-gradient(#14213D0A 1px, transparent 1px), linear-gradient(90deg, #14213D0A 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
          backgroundColor: '#EAE7E1',
        }}
      >
        {children}
      </main>
    </div>
  );
}

export default MainLayout;