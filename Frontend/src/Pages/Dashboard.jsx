import { activities } from '../services/mockData';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

function Dashboard() {
  // Calculate summary stats
  const totalActivities = activities.length;
  const delayedCount = activities.filter(a => a.status === 'Delayed').length;
  const completedCount = activities.filter(a => a.status === 'Completed').length;

  // Prepare chart data: Planned vs Actual quantity per activity
  const chartData = activities.map(a => ({
    name: a.wbsCode,
    Planned: a.plannedQty,
    Actual: a.actualQty,
  }));

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white shadow rounded-lg p-5 border-l-4 border-blue-500">
          <p className="text-gray-500 text-sm">Total Activities</p>
          <p className="text-3xl font-bold text-gray-800">{totalActivities}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-5 border-l-4 border-red-500">
          <p className="text-gray-500 text-sm">Delayed</p>
          <p className="text-3xl font-bold text-red-600">{delayedCount}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-5 border-l-4 border-green-500">
          <p className="text-gray-500 text-sm">Completed</p>
          <p className="text-3xl font-bold text-green-600">{completedCount}</p>
        </div>
      </div>

      {/* Chart: Planned vs Actual */}
      <div className="bg-white shadow rounded-lg p-5 mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Planned vs Actual Quantity</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="Planned" fill="#93c5fd" />
            <Bar dataKey="Actual" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Alerts */}
      <div className="bg-white shadow rounded-lg p-5">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Risk Alerts</h2>
        <ul className="space-y-2">
          {activities
            .filter(a => a.riskScore === 'High')
            .map(a => (
              <li key={a.id} className="flex justify-between items-center bg-red-50 px-4 py-2 rounded">
                <span className="text-gray-700">{a.activityName} ({a.wbsCode})</span>
                <span className="text-red-600 font-semibold text-sm">High Risk</span>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;