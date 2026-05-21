import React from 'react';
import Card from '../../../components/Card';
import { Calendar, Building, Download } from 'lucide-react';

const Analytics = ({ monthlyData, employerStats, exportMonthlyAnalytics, exportEmployerStats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold flex items-center gap-2"><Calendar size={20} /> Monthly Overview</h3>
          <button onClick={exportMonthlyAnalytics} className="px-3 py-1 bg-green-600 text-white rounded text-sm font-bold flex items-center gap-1"><Download size={14} /> Export</button>
        </div>
        <table className="w-full text-sm">
          <thead><tr className="border-b"><th className="text-left py-2">Month</th><th className="text-right py-2">Jobs</th><th className="text-right py-2">Revenue</th></tr></thead>
          <tbody>{monthlyData.map((row, i) => (<tr key={i} className="border-b"><td className="py-2">{row.month}</td><td className="text-right">{row.jobs}</td><td className="text-right font-semibold">₹{row.revenue.toLocaleString()}</td></tr>))}</tbody>
        </table>
      </Card>
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold flex items-center gap-2"><Building size={20} /> Top Employers</h3>
          <button onClick={exportEmployerStats} className="px-3 py-1 bg-green-600 text-white rounded text-sm font-bold flex items-center gap-1"><Download size={14} /> Export</button>
        </div>
        {!employerStats.length ? <p className="text-muted">No employer data yet</p> : (
          <table className="w-full text-sm"><thead><tr className="border-b"><th className="text-left py-2">Employer</th><th className="text-right py-2">Jobs</th><th className="text-right py-2">Revenue</th></tr></thead>
          <tbody>{employerStats.map((emp, i) => (<tr key={i} className="border-b"><td className="py-2 truncate max-w-[150px]">{emp.name}</td><td className="text-right">{emp.jobs}</td><td className="text-right font-semibold">₹{emp.revenue.toLocaleString()}</td></tr>))}</tbody>
         </table>
        )}
      </Card>
    </div>
  );
};

export default Analytics;