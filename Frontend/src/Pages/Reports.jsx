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

  const COLORS = { 'Completed': '#22c55e', 'Delayed': '#ef4444', 'In Progress': '#eab308' };

  const varianceData = activities.map((a) => ({
    ...a,
    variance: a.plannedQty - a.actualQty,
  }));

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Reports & Risk Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white shadow rounded-lg p-5">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Activity Status Distribution</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#8884d8'} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white shadow rounded-lg p-5">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Risk Summary</h2>
          <ul className="space-y-3">
            {activities.map((a) => (
              <li key={a.id} className="flex justify-between items-center border-b pb-2">
                <span className="text-gray-700 text-sm">{a.activityName}</span>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    a.riskScore === 'High'
                      ? 'bg-red-100 text-red-600'
                      : 'bg-green-100 text-green-600'
                  }`}
                >
                  {a.riskScore} Risk
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <h2 className="text-lg font-semibold text-gray-700 p-5 pb-0">Planned vs Actual Variance</h2>
        <table className="w-full text-left mt-4">
          <thead className="bg-gray-100 text-gray-600 text-sm uppercase">
            <tr>
              <th className="px-4 py-3">WBS Code</th>
              <th className="px-4 py-3">Planned Qty</th>
              <th className="px-4 py-3">Actual Qty</th>
              <th className="px-4 py-3">Variance</th>
            </tr>
          </thead>
          <tbody>
            {varianceData.map((a) => (
              <tr key={a.id} className="border-t">
                <td className="px-4 py-3 font-medium text-gray-700">{a.wbsCode}</td>
                <td className="px-4 py-3 text-gray-500">{a.plannedQty}</td>
                <td className="px-4 py-3 text-gray-500">{a.actualQty}</td>
                <td
                  className={`px-4 py-3 font-semibold ${
                    a.variance > 0 ? 'text-red-600' : 'text-green-600'
                  }`}
                >
                  {a.variance > 0 ? `-${a.variance}` : 'On Track'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Reports;