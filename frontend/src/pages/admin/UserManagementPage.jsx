import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';

const ROLES = ['USER', 'ADMIN', 'TECHNICIAN'];

const roleBadge = (role) => {
  const styles = {
    ADMIN:      { bg: '#fdecea', color: '#c62828' },
    TECHNICIAN: { bg: '#e3f2fd', color: '#1565c0' },
    USER:       { bg: '#e8f5e9', color: '#2e7d32' },
  };
  return styles[role] || styles.USER;
};

const UserManagementPage = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers]       = useState([]);
  const [loading, setLoading]   = useState(true);
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
      toast.success('Role updated');
    } catch (err) {
      toast.error('Failed to update role');
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '48px'
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          border: '3px solid #e0e0e0',
          borderTop: '3px solid #1a2b5e',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}/>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: 700,
          color: '#1a2b5e',
          margin: 0
        }}>
          User Management
        </h1>
        <p style={{
          color: '#888',
          fontSize: '14px',
          marginTop: '4px'
        }}>
          Manage user roles and access levels
        </p>
      </div>

      <div style={{
        background: '#fff',
        borderRadius: '14px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
        border: '1px solid #eee',
        overflow: 'hidden'
      }}>

        <div style={{
          padding: '14px 20px',
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <p style={{
            fontSize: '13px',
            color: '#888',
            margin: 0
          }}>
            Total users:{' '}
            <span style={{
              fontWeight: 600,
              color: '#1a2b5e'
            }}>
              {users.length}
            </span>
          </p>
        </div>

        <table style={{
          width: '100%',
          borderCollapse: 'collapse'
        }}>
          <thead>
            <tr style={{ background: '#f8f9fb' }}>
              {['User', 'Email', 'Role',
                'Change Role', 'Joined'].map(h => (
                <th
                  key={h}
                  style={{
                    padding: '12px 20px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#888',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    borderBottom: '1px solid #f0f0f0'
                  }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => {
              const badge = roleBadge(u.role);
              return (
                <tr
                  key={u.id}
                  style={{
                    background: i % 2 === 0
                      ? '#fff' : '#fafafa',
                    borderBottom: '1px solid #f5f5f5'
                  }}>

                  <td style={{ padding: '14px 20px' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}>
                      {u.profilePicture ? (
                        <img
                          src={u.profilePicture}
                          alt={u.name}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            objectFit: 'cover'
                          }}/>
                      ) : (
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: '#1a2b5e',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          fontSize: '12px',
                          fontWeight: 600
                        }}>
                          {u.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p style={{
                          fontSize: '14px',
                          fontWeight: 500,
                          color: '#1a2b5e',
                          margin: 0
                        }}>
                          {u.name}
                          {u.id === currentUser?.id && (
                            <span style={{
                              marginLeft: '6px',
                              fontSize: '11px',
                              color: '#5c7bd4'
                            }}>
                              (you)
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td style={{ padding: '14px 20px' }}>
                    <p style={{
                      fontSize: '13px',
                      color: '#666',
                      margin: 0
                    }}>
                      {u.email}
                    </p>
                  </td>

                  <td style={{ padding: '14px 20px' }}>
                    <span style={{
                      display: 'inline-block',
                      background: badge.bg,
                      color: badge.color,
                      fontSize: '11px',
                      fontWeight: 600,
                      padding: '3px 10px',
                      borderRadius: '20px'
                    }}>
                      {u.role}
                    </span>
                  </td>

                  <td style={{ padding: '14px 20px' }}>
                    {u.id === currentUser?.id ? (
                      <span style={{
                        fontSize: '12px',
                        color: '#bbb'
                      }}>
                        Cannot change own role
                      </span>
                    ) : (
                      <select
                        value={u.role}
                        onChange={(e) =>
                          updateRole(u.id, e.target.value)}
                        disabled={updating === u.id}
                        style={{
                          border: '1px solid #e0e0e0',
                          borderRadius: '8px',
                          padding: '6px 10px',
                          fontSize: '13px',
                          color: '#1a2b5e',
                          background: '#fff',
                          outline: 'none',
                          cursor: 'pointer'
                        }}>
                        {ROLES.map(role => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    )}
                  </td>

                  <td style={{ padding: '14px 20px' }}>
                    <p style={{
                      fontSize: '13px',
                      color: '#aaa',
                      margin: 0
                    }}>
                      {new Date(u.createdAt)
                        .toLocaleDateString()}
                    </p>
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagementPage;