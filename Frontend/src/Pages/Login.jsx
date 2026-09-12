import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Site Engineer');
  const [error, setError] = useState('');

  // 'Client' role removed
  const roles = ['Site Engineer', 'Project Manager', 'Planner'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter email and password.');
      return;
    }
    // No backend yet — mock login, store role locally
    localStorage.setItem('userRole', role);
    localStorage.setItem('userEmail', email);

    // Role ke hisaab se apna specific dashboard khulega
    if (role === 'Site Engineer') {
      navigate('/engineer-dashboard');
    } else if (role === 'Project Manager') {
      navigate('/pm-dashboard');
    } else if (role === 'Planner') {
      navigate('/planner-dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-5"
      style={{
        backgroundColor: '#EAE7E1',
        backgroundImage: `linear-gradient(#14213D0A 1px, transparent 1px), linear-gradient(90deg, #14213D0A 1px, transparent 1px)`,
        backgroundSize: '32px 32px',
        fontFamily: "'IBM Plex Sans', sans-serif",
      }}
    >
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="mb-10 text-center">
          <div
            className="text-2xl font-medium text-[#14213D] tracking-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Intelli-Progress
          </div>
          <div
            className="text-[11px] text-[#14213D]/40 mt-1"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            SIH26122 · Oil India Limited
          </div>
        </div>

        {/* Card */}
        <div className="bg-white border border-[#14213D]/10 rounded-lg p-8 shadow-sm">
          <h1
            className="text-lg font-medium text-[#14213D] mb-6"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Sign in
          </h1>

          {error && (
            <div
              className="mb-5 px-4 py-2.5 rounded text-sm"
              style={{ backgroundColor: '#E85D2F1A', color: '#E85D2F' }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                className="block text-[11px] uppercase text-[#14213D]/50 mb-2"
                style={{ fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '0.06em' }}
              >
                Role
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {roles.map((r) => (
                  <button
                    type="button"
                    key={r}
                    onClick={() => setRole(r)}
                    className={`text-xs font-medium px-2 py-2 rounded border transition-colors ${
                      role === r
                        ? 'bg-[#14213D] text-white border-[#14213D]'
                        : 'bg-white text-[#14213D]/60 border-[#14213D]/15 hover:border-[#3D5A80]'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label
                className="block text-[11px] uppercase text-[#14213D]/50 mb-2"
                style={{ fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '0.06em' }}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@oilindia.in"
                className="w-full px-4 py-2.5 rounded border border-[#14213D]/15 bg-white text-sm text-[#14213D] focus:outline-none focus:border-[#3D5A80] transition-colors"
              />
            </div>

            <div>
              <label
                className="block text-[11px] uppercase text-[#14213D]/50 mb-2"
                style={{ fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '0.06em' }}
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded border border-[#14213D]/15 bg-white text-sm text-[#14213D] focus:outline-none focus:border-[#3D5A80] transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full px-6 py-2.5 rounded bg-[#14213D] text-white text-sm font-medium hover:bg-[#1a2847] transition-colors"
            >
              Sign in as {role}
            </button>
          </form>
        </div>

        <div className="text-center text-xs text-[#14213D]/40 mt-6">
          Planning-to-Execution Bridge
        </div>
      </div>
    </div>
  );
}

export default Login;