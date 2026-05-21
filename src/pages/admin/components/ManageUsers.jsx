import React from 'react';
import { Download } from 'lucide-react';

const ManageUsers = ({ usersTab, setUsersTab, totalEmployers, totalEmployees, usersData, exportUsers }) => {
  const filteredUsers = usersTab === 'employer' ? usersData.employers : usersData.employees;
  return (
    <>
      <div className="flex gap-2 mb-6">
        <button onClick={() => setUsersTab('employer')} className={`px-4 py-2 rounded-full font-bold text-sm ${usersTab === 'employer' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'}`}>Employers ({totalEmployers})</button>
        <button onClick={() => setUsersTab('employee')} className={`px-4 py-2 rounded-full font-bold text-sm ${usersTab === 'employee' ? 'bg-green-100 text-green-700' : 'text-gray-500 hover:bg-gray-100'}`}>Employees ({totalEmployees})</button>
        <button onClick={exportUsers} className="ml-auto px-3 py-1 bg-green-600 text-white rounded text-sm font-bold"><Download size={14} className="inline mr-1" /> Export {usersTab}s</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left bg-white rounded-lg shadow-sm text-sm">
          <thead className="bg-gray-50 border-b"><tr><th className="p-4">Name</th><th className="p-4">Phone</th><th className="p-4">Email</th><th className="p-4">Actions</th></tr></thead>
          <tbody>
            {filteredUsers.map(u => (
              <tr key={u.id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-semibold">{u.full_name || u.name || u.company_name || 'N/A'}</td>
                <td className="p-4">{u.phone_number || u.phone || u.contact_number || 'N/A'}</td>
                <td className="p-4">{u.email || u.official_email || 'N/A'}</td>
                <td className="p-4"><button className="text-primary hover:underline text-xs mr-3">View</button><button className="text-danger hover:underline text-xs">Suspend</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ManageUsers;