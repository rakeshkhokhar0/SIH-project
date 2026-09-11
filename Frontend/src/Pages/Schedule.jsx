import { activities } from '../services/mockData';

function Schedule() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Schedule / WBS View</h1>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-gray-600 text-sm uppercase">
            <tr>
              <th className="px-4 py-3">WBS Code</th>
              <th className="px-4 py-3">Activity</th>
              <th className="px-4 py-3">Planned Start</th>
              <th className="px-4 py-3">Planned End</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((a) => (
              <tr key={a.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-700">{a.wbsCode}</td>
                <td className="px-4 py-3 text-gray-700">{a.activityName}</td>
                <td className="px-4 py-3 text-gray-500">{a.plannedStart}</td>
                <td className="px-4 py-3 text-gray-500">{a.plannedEnd}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      a.status === 'Completed'
                        ? 'bg-green-100 text-green-700'
                        : a.status === 'Delayed'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {a.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Schedule;