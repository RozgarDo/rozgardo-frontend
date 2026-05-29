import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Download, Eye, UserX, UserCheck, X, Loader2 } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const ManageUsers = ({ usersTab, setUsersTab, totalEmployers, totalEmployees, usersData, exportUsers, refreshUsers }) => {
  const filteredUsers = usersTab === 'employer' ? usersData.employers : usersData.employees;

  const [selectedUser, setSelectedUser] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [userDetails, setUserDetails] = useState(null);

  // Lock body scroll when modal is open (robust, matches Navbar modal behavior)
  const scrollPosition = useRef(0);
  useEffect(() => {
    if (selectedUser) {
      scrollPosition.current = window.scrollY;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPosition.current}px`;
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollPosition.current);
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [selectedUser]);

  const fetchUserDetails = async (userId, role) => {
    setModalLoading(true);
    try {
      const endpoint = role === 'employee'
        ? `${API_BASE_URL}/api/auth/admin/employee/${userId}`
        : `${API_BASE_URL}/api/auth/admin/employer/${userId}`;
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error('Failed to fetch details');
      const data = await res.json();
      setUserDetails(data);
    } catch (err) {
      alert('Error loading details: ' + err.message);
    } finally {
      setModalLoading(false);
    }
  };

  const openModal = (user, role) => {
    setSelectedUser({ ...user, role });
    fetchUserDetails(user.id, role);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setUserDetails(null);
  };

  const handleRowAction = async (userId, role, newStatus) => {
    const action = newStatus === 'suspended' ? 'suspend' : 'reactivate';
    if (!window.confirm(`Are you sure you want to ${action} this account?`)) return;

    setActionLoading(true);
    try {
      const endpoint = role === 'employee'
        ? `${API_BASE_URL}/api/auth/admin/employee-status`
        : `${API_BASE_URL}/api/auth/admin/employer-status`;
      const res = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, status: newStatus })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Update failed');
      alert(`Account ${newStatus === 'suspended' ? 'suspended' : 'reactivated'} successfully!`);
      if (refreshUsers) refreshUsers();
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'suspended': return 'bg-orange-100 text-orange-700';
      case 'deactivated': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <>
      <div className="flex gap-2 mb-6">
        <button onClick={() => setUsersTab('employer')} className={`px-4 py-2 rounded-full font-bold text-sm ${usersTab === 'employer' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'}`}>Employers ({totalEmployers})</button>
        <button onClick={() => setUsersTab('employee')} className={`px-4 py-2 rounded-full font-bold text-sm ${usersTab === 'employee' ? 'bg-green-100 text-green-700' : 'text-gray-500 hover:bg-gray-100'}`}>Employees ({totalEmployees})</button>
        <button onClick={exportUsers} className="ml-auto px-3 py-1 bg-green-600 text-white rounded text-sm font-bold"><Download size={14} className="inline mr-1" /> Export {usersTab}s</button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left bg-white rounded-lg shadow-sm text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Email</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(u => (
              <tr key={u.id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-semibold">{u.full_name || u.name || u.company_name || 'N/A'}</td>
                <td className="p-4">{u.phone_number || u.phone || u.contact_number || 'N/A'}</td>
                <td className="p-4">{u.email || u.official_email || 'N/A'}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(u.account_status)}`}>
                    {u.account_status || 'active'}
                  </span>
                </td>
                <td className="p-4">
                  <button onClick={() => openModal(u, usersTab === 'employee' ? 'employee' : 'employer')} className="text-indigo-600 hover:text-indigo-800 text-xs mr-3">
                    <Eye size={16} className="inline mr-1" /> View
                  </button>
                  {u.account_status === 'active' ? (
                    <button onClick={() => handleRowAction(u.id, usersTab === 'employee' ? 'employee' : 'employer', 'suspended')} className="text-red-600 hover:text-red-800 text-xs">
                      <UserX size={16} className="inline mr-1" /> Suspend
                    </button>
                  ) : (
                    <button onClick={() => handleRowAction(u.id, usersTab === 'employee' ? 'employee' : 'employer', 'active')} className="text-green-600 hover:text-green-800 text-xs">
                      <UserCheck size={16} className="inline mr-1" /> Reactivate
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal rendered via Portal to cover entire screen */}
      {selectedUser && ReactDOM.createPortal(
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[85vh] flex flex-col shadow-2xl mx-4">
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h3 className="text-xl font-bold">
                {selectedUser.role === 'employee' ? 'Employee Details' : 'Employer Details'}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {modalLoading ? (
                <div className="flex justify-center py-8"><Loader2 size={32} className="animate-spin text-indigo-600" /></div>
              ) : userDetails ? (
                <div className="space-y-4">
                  {selectedUser.role === 'employee' ? (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div><label className="text-sm font-semibold text-gray-500">Full Name</label><p className="text-gray-900">{userDetails.full_name || 'N/A'}</p></div>
                        <div><label className="text-sm font-semibold text-gray-500">Phone</label><p className="text-gray-900">{userDetails.phone_number || 'N/A'}</p></div>
                        <div><label className="text-sm font-semibold text-gray-500">Email</label><p className="text-gray-900">{userDetails.email || 'N/A'}</p></div>
                        <div><label className="text-sm font-semibold text-gray-500">Location</label><p className="text-gray-900">{userDetails.location || 'N/A'}</p></div>
                        <div><label className="text-sm font-semibold text-gray-500">Highest Qualification</label><p className="text-gray-900">{userDetails.highest_qualification || 'N/A'}</p></div>
                        <div><label className="text-sm font-semibold text-gray-500">Expected Salary</label><p className="text-gray-900">₹{userDetails.expected_salary?.toLocaleString() || 'N/A'}</p></div>
                        <div><label className="text-sm font-semibold text-gray-500">Preferred Job Types</label><p className="text-gray-900">{Array.isArray(userDetails.job_types) ? userDetails.job_types.join(', ') : (userDetails.job_types || 'N/A')}</p></div>
                        <div><label className="text-sm font-semibold text-gray-500">Preferred Languages</label><p className="text-gray-900">{Array.isArray(userDetails.preferred_languages) ? userDetails.preferred_languages.join(', ') : (userDetails.preferred_languages || 'N/A')}</p></div>
                      </div>
                      <div><label className="text-sm font-semibold text-gray-500">Skills</label><p className="text-gray-900">{Array.isArray(userDetails.skills) ? userDetails.skills.join(', ') : (userDetails.skills || 'N/A')}</p></div>
                      <div><label className="text-sm font-semibold text-gray-500">Experience</label><p className="text-gray-900">{userDetails.experience ? JSON.stringify(userDetails.experience) : 'N/A'}</p></div>
                      <div><label className="text-sm font-semibold text-gray-500">Bio</label><p className="text-gray-900">{userDetails.bio || 'N/A'}</p></div>
                    </>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div><label className="text-sm font-semibold text-gray-500">Company Name</label><p className="text-gray-900">{userDetails.company_name || 'N/A'}</p></div>
                        <div><label className="text-sm font-semibold text-gray-500">Contact Number</label><p className="text-gray-900">{userDetails.contact_number || 'N/A'}</p></div>
                        <div><label className="text-sm font-semibold text-gray-500">Official Email</label><p className="text-gray-900">{userDetails.official_email || 'N/A'}</p></div>
                        <div><label className="text-sm font-semibold text-gray-500">Office Location</label><p className="text-gray-900">{userDetails.office_location || 'N/A'}</p></div>
                        <div><label className="text-sm font-semibold text-gray-500">HR First Name</label><p className="text-gray-900">{userDetails.hr_first_name || 'N/A'}</p></div>
                        <div><label className="text-sm font-semibold text-gray-500">HR Last Name</label><p className="text-gray-900">{userDetails.hr_last_name || 'N/A'}</p></div>
                        <div><label className="text-sm font-semibold text-gray-500">HR LinkedIn</label><p className="text-gray-900">{userDetails.hr_linkedin || 'N/A'}</p></div>
                        <div><label className="text-sm font-semibold text-gray-500">Website</label><p className="text-gray-900">{userDetails.website || 'N/A'}</p></div>
                        <div><label className="text-sm font-semibold text-gray-500">Industry</label><p className="text-gray-900">{userDetails.industry || 'N/A'}</p></div>
                        <div><label className="text-sm font-semibold text-gray-500">Employee Count</label><p className="text-gray-900">{userDetails.employee_count || 'N/A'}</p></div>
                      </div>
                      <div><label className="text-sm font-semibold text-gray-500">Company Description</label><p className="text-gray-900">{userDetails.company_description || 'N/A'}</p></div>
                    </>
                  )}
                  <div className="border-t pt-4 mt-4 flex justify-end">
                    <button onClick={closeModal} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">Close</button>
                  </div>
                </div>
              ) : (
                <p className="text-center text-red-500">Failed to load details</p>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default ManageUsers;