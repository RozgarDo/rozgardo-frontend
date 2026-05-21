import React from 'react';
import Card from '../../../components/Card';
import { TrendingUp, DollarSign, Briefcase, Building } from 'lucide-react';

const KPICards = ({ stats }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
    <Card className="p-4 text-center">
      <TrendingUp size={24} className="mx-auto text-green-600 mb-2" />
      <p className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</p>
      <p className="text-sm text-gray-500">Total Revenue</p>
    </Card>
    <Card className="p-4 text-center">
      <DollarSign size={24} className="mx-auto text-blue-600 mb-2" />
      <p className="text-2xl font-bold">₹{stats.thisMonthRevenue.toLocaleString()}</p>
      <p className="text-sm text-gray-500">This Month</p>
    </Card>
    <Card className="p-4 text-center">
      <Briefcase size={24} className="mx-auto text-purple-600 mb-2" />
      <p className="text-2xl font-bold">{stats.approvedJobs}</p>
      <p className="text-sm text-gray-500">Jobs Approved</p>
    </Card>
    <Card className="p-4 text-center">
      <Building size={24} className="mx-auto text-indigo-600 mb-2" />
      <p className="text-2xl font-bold">{stats.totalEmployers}</p>
      <p className="text-sm text-gray-500">Employers</p>
    </Card>
  </div>
);

export default KPICards;