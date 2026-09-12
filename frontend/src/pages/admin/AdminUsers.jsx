import React, { useState, useEffect } from 'react';
import {
  Users,
  Shield,
  ShieldCheck,
  UserCheck,
  AlertCircle,
  CheckCircle,
  Loader2,
  RefreshCw,
  Search,
  ShoppingBag,
  IndianRupee,
  Calendar,
  Phone,
  Mail,
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils';

const AdminUsers = () => {
  const { user: currentAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      let url = '/admin/users';
      const params = new URLSearchParams();
      if (roleFilter !== 'all') params.append('role', roleFilter);
      if (search.trim()) params.append('search', search.trim());

      const qs = params.toString();
      if (qs) url += `?${qs}`;

      const { data } = await api.get(url);
      if (data.success) {
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error('[Fetch Users Error]:', err.message);
      setError(err.response?.data?.message || 'Failed to fetch user accounts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleRoleToggle = async (user) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    const confirmMsg = `Are you sure you want to change ${user.name}'s role to ${newRole.toUpperCase()}?`;
    if (!window.confirm(confirmMsg)) return;

    try {
      const { data } = await api.put(`/admin/users/${user._id}/role`, { role: newRole });
      if (data.success) {
        setNotification({
          type: 'success',
          message: `User ${user.name} role updated to ${newRole.toUpperCase()}`,
        });
        fetchUsers();
        setTimeout(() => setNotification(null), 4000);
      }
    } catch (err) {
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Failed to change user role',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-600" />
            Customer & User Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Real customer spending stats, order metrics, registration history, and role authorizations.
          </p>
        </div>

        <button
          onClick={fetchUsers}
          className="p-2 text-gray-600 hover:text-gray-900 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 transition self-start sm:self-auto"
          title="Refresh user list"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Notifications */}
      {notification && (
        <div
          className={`p-4 rounded-lg text-sm flex items-center gap-2 border animate-in fade-in duration-150 ${
            notification.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="w-full md:w-80 relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name, email, phone..."
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-300 rounded text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-600"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </form>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-gray-500 font-semibold">Account Role:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-gray-50 border border-gray-300 rounded text-xs font-semibold focus:bg-white"
          >
            <option value="all">All Roles</option>
            <option value="user">Customers Only</option>
            <option value="admin">Admins Only</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Total Orders</th>
                <th className="py-3.5 px-4">Total Spending</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Joined Date</th>
                <th className="py-3.5 px-4 text-right">Role Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-16 text-center text-gray-500">
                    <Loader2 className="w-8 h-8 text-purple-600 animate-spin mx-auto mb-2" />
                    <span className="text-xs">Loading registered customers...</span>
                  </td>
                </tr>
              ) : users.length > 0 ? (
                users.map((u) => {
                  const isCurrent = u._id === currentAdmin?._id;

                  return (
                    <tr key={u._id} className="hover:bg-gray-50 transition">
                      <td className="py-3.5 px-4 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-700 font-black flex items-center justify-center text-sm uppercase">
                          {u.name ? u.name[0] : 'U'}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-xs flex items-center gap-1.5">
                            {u.name}
                            {isCurrent && (
                              <span className="text-[10px] bg-purple-100 text-purple-700 font-bold px-1.5 py-0.2 rounded">
                                Current Admin
                              </span>
                            )}
                          </p>
                          <p className="text-[11px] text-gray-500">{u.email}</p>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-xs text-gray-600">
                        {u.phone ? (
                          <span className="font-semibold text-gray-800">{u.phone}</span>
                        ) : (
                          <span className="text-gray-400 italic">Not provided</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-gray-900 bg-gray-100 px-2.5 py-1 rounded-full text-[11px]">
                          {u.ordersCount ?? 0} {u.ordersCount === 1 ? 'order' : 'orders'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-black text-gray-900 text-xs">
                        {formatCurrency(u.totalSpent ?? 0)}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            u.role === 'admin'
                              ? 'bg-purple-100 text-purple-800 border border-purple-200'
                              : 'bg-gray-100 text-gray-700 border border-gray-200'
                          }`}
                        >
                          {u.role === 'admin' ? (
                            <ShieldCheck className="w-3 h-3 text-purple-600" />
                          ) : (
                            <UserCheck className="w-3 h-3 text-gray-500" />
                          )}
                          {u.role.toUpperCase()}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-xs text-gray-500">
                        {u.createdAt
                          ? new Date(u.createdAt).toLocaleDateString('en-IN', {
                              dateStyle: 'medium',
                            })
                          : 'N/A'}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {!isCurrent ? (
                          <button
                            onClick={() => handleRoleToggle(u)}
                            className={`text-xs font-bold px-3 py-1 rounded transition border ${
                              u.role === 'admin'
                                ? 'text-amber-700 border-amber-300 hover:bg-amber-50'
                                : 'text-purple-700 border-purple-300 hover:bg-purple-50'
                            }`}
                          >
                            {u.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                          </button>
                        ) : (
                          <span className="text-[11px] text-gray-400 italic">Self Account</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-gray-500 text-xs">
                    No customers found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
