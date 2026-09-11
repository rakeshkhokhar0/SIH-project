import { useState } from 'react';
import { activities } from '../services/mockData';

function DataCapture() {
  const [selectedActivity, setSelectedActivity] = useState('');
  const [quantity, setQuantity] = useState('');
  const [notes, setNotes] = useState('');
  const [photo, setPhoto] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) setPhoto(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Dummy submit - no backend yet
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setSelectedActivity('');
    setQuantity('');
    setNotes('');
    setPhoto(null);
  };

  return (
    <div className="px-5 md:px-10 py-7 md:py-9 max-w-2xl">
      <div className="mb-8 md:mb-10">
        <div className="text-[13px] text-[#14213D]/50 mb-1" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
          FIELD ENTRY
        </div>
        <h1 className="text-2xl md:text-3xl font-medium text-[#14213D]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Data Capture
        </h1>
      </div>

      {submitted && (
        <div className="mb-6 px-4 py-3 rounded text-sm" style={{ backgroundColor: '#4C7A4C1A', color: '#4C7A4C' }}>
          Progress entry submitted successfully.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Activity select */}
        <div>
          <label className="block text-[11px] uppercase text-[#14213D]/50 mb-2" style={{ fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '0.05em' }}>
            Activity
          </label>
          <select
            required
            value={selectedActivity}
            onChange={(e) => setSelectedActivity(e.target.value)}
            className="w-full px-4 py-2.5 rounded border border-[#14213D]/15 bg-white text-sm text-[#14213D] focus:outline-none focus:border-[#3D5A80]"
          >
            <option value="">Select an activity</option>
            {activities.map((a) => (
              <option key={a.id} value={a.wbsCode}>
                {a.wbsCode} — {a.activityName}
              </option>
            ))}
          </select>
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-[11px] uppercase text-[#14213D]/50 mb-2" style={{ fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '0.05em' }}>
            Quantity Completed Today
          </label>
          <input
            type="number"
            required
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="e.g. 12"
            className="w-full px-4 py-2.5 rounded border border-[#14213D]/15 bg-white text-sm text-[#14213D] focus:outline-none focus:border-[#3D5A80]"
          />
        </div>

        {/* Photo upload */}
        <div>
          <label className="block text-[11px] uppercase text-[#14213D]/50 mb-2" style={{ fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '0.05em' }}>
            Evidence Photo
          </label>
          <label className="flex items-center justify-center border border-dashed border-[#14213D]/25 rounded py-8 cursor-pointer hover:border-[#3D5A80] transition-colors">
            <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
            <span className="text-sm text-[#14213D]/50">
              {photo ? photo.name : 'Click to upload a site photo'}
            </span>
          </label>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-[11px] uppercase text-[#14213D]/50 mb-2" style={{ fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '0.05em' }}>
            Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            placeholder="Any observations from site..."
            className="w-full px-4 py-2.5 rounded border border-[#14213D]/15 bg-white text-sm text-[#14213D] focus:outline-none focus:border-[#3D5A80] resize-none"
          />
        </div>

        {/* Location - placeholder for GPS */}
        <div className="flex items-center gap-2 text-xs text-[#14213D]/50">
          <span className="w-2 h-2 rounded-full bg-[#4C7A4C]" />
          Location auto-captured on submit
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 rounded bg-[#14213D] text-white text-sm font-medium hover:bg-[#1a2847] transition-colors"
        >
          Submit Progress
        </button>
      </form>
    </div>
  );
}

export default DataCapture;