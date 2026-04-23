import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';

const ROLES = ['USER', 'ADMIN', 'TECHNICIAN'];

const UserManagementPage = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data.data);
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (userId, newRole) => {
    setUpdating(userId);
    try {
      await api.patch(`/users/${userId}/role?role=${newRole}`);
      setUsers(prev =>
        prev.map(u =>
          u.id === userId ? { ...u, role: newRole } : u
        )
      );
      toast.success('Role updated successfully');
    } catch (err) {
      toast.error('Failed to update role');
    } finally {
      setUpdating(null);
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-700';
      case 'TECHNICIAN':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8
          border-t-2 border-b-2 border-primary-600">
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          User Management
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage user roles and access levels
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm
        border border-gray-100 overflow-hidden">

        <div className="px-6 py-4 border-b border-gray-100
          flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Total users: <span className="font-medium
            text-gray-800">{users.length}</span>
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs
                  font-medium text-gray-500 uppercase
                  tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs
                  font-medium text-gray-500 uppercase
                  tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs
                  font-medium text-gray-500 uppercase
                  tracking-wider">
                  Current Role
                </th>
                <th className="px-6 py-3 text-left text-xs
                  font-medium text-gray-500 uppercase
                  tracking-wider">
                  Change Role
                </th>
                <th className="px-6 py-3 text-left text-xs
                  font-medium text-gray-500 uppercase
                  tracking-wider">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map(u => (
                <tr key={u.id}
                  className="hover:bg-gray-50 transition-colors">

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {u.profilePicture ? (
                        <img
                          src={u.profilePicture}
                          alt={u.name}
                          className="h-8 w-8 rounded-full
                            object-cover"/>
                      ) : (
                        <div className="h-8 w-8 rounded-full
                          bg-primary-100 flex items-center
                          justify-center">
                          <span className="text-primary-600
                            text-sm font-medium">
                            {u.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium
                          text-gray-800">
                          {u.name}
                          {u.id === currentUser?.id && (
                            <span className="ml-2 text-xs
                              text-primary-500">(you)</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600">
                      {u.email}
                    </p>
                  </td>

                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1
                      rounded-full text-xs font-medium
                      ${getRoleBadgeColor(u.role)}`}>
                      {u.role}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    {u.id === currentUser?.id ? (
                      <span className="text-xs text-gray-400">
                        Cannot change own role
                      </span>
                    ) : (
                      <select
                        value={u.role}
                        onChange={(e) =>
                          updateRole(u.id, e.target.value)}
                        disabled={updating === u.id}
                        className="text-sm border border-gray-200
                          rounded-lg px-3 py-1.5 focus:outline-none
                          focus:border-primary-400
                          disabled:opacity-50 disabled:cursor-not-allowed
                          bg-white">
                        {ROLES.map(role => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    )}
                    {updating === u.id && (
                      <span className="ml-2 text-xs
                        text-gray-400">
                        Updating...
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-400">
                      {new Date(u.createdAt)
                        .toLocaleDateString()}
                    </p>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagementPage;