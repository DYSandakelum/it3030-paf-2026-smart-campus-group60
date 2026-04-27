import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const NOTIFICATION_TYPES = [
  { value: 'GENERAL',              label: 'General' },
  { value: 'BOOKING_APPROVED',     label: 'Booking Approved' },
  { value: 'BOOKING_REJECTED',     label: 'Booking Rejected' },
  { value: 'BOOKING_CANCELLED',    label: 'Booking Cancelled' },
  { value: 'TICKET_STATUS_UPDATED',label: 'Ticket Status Updated' },
  { value: 'TICKET_ASSIGNED',      label: 'Ticket Assigned' },
  { value: 'TICKET_COMMENT_ADDED', label: 'Ticket Comment Added' },
];

const typeColors = {
  GENERAL:               { bg: '#f5f5f5',  color: '#424242' },
  BOOKING_APPROVED:      { bg: '#e8f5e9',  color: '#2e7d32' },
  BOOKING_REJECTED:      { bg: '#fdecea',  color: '#c62828' },
  BOOKING_CANCELLED:     { bg: '#fff3e0',  color: '#e65100' },
  TICKET_STATUS_UPDATED: { bg: '#e3f2fd',  color: '#1565c0' },
  TICKET_ASSIGNED:       { bg: '#ede7f6',  color: '#4527a0' },
  TICKET_COMMENT_ADDED:  { bg: '#fce4ec',  color: '#880e4f' },
};

const SendNotificationPage = () => {
  const [users, setUsers]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [sending, setSending]     = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [form, setForm] = useState({
    userId:  '',
    type:    'GENERAL',
    message: '',
  });

  const [selectedUser, setSelectedUser] = useState(null);
  const [sent, setSent]                 = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data.data || []);
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const selectUser = (user) => {
    setSelectedUser(user);
    setForm(prev => ({ ...prev, userId: user.id }));
    setSearchTerm('');
  };

  const handleSend = async () => {
    if (!form.userId) {
      toast.error('Please select a user');
      return;
    }
    if (!form.message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    setSending(true);
    try {
      await api.post('/notifications/send', {
        userId:  form.userId,
        type:    form.type,
        message: form.message.trim(),
      });

      toast.success('Notification sent successfully');

      setSent(prev => [{
        id:       Date.now(),
        userName: selectedUser?.name,
        type:     form.type,
        message:  form.message.trim(),
        sentAt:   new Date().toLocaleTimeString()
      }, ...prev]);

      setForm(prev => ({
        ...prev,
        message: '',
        type:    'GENERAL'
      }));

    } catch (err) {
      toast.error('Failed to send notification');
    } finally {
      setSending(false);
    }
  };

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(
      searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(
      searchTerm.toLowerCase())
  );

  const inputStyle = {
    width: '100%',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '10px 12px',
    fontSize: '14px',
    color: '#1a2b5e',
    outline: 'none',
    background: '#fff',
    boxSizing: 'border-box'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '13px',
    fontWeight: 500,
    color: '#444',
    marginBottom: '6px'
  };

  const previewBadge = typeColors[form.type]
    || typeColors.GENERAL;

  return (
    <div style={{ padding: '8px 0' }}>

      <div style={{ marginBottom: '28px' }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: 700,
          color: '#1a2b5e',
          margin: 0
        }}>
          Send Notification
        </h1>
        <p style={{
          color: '#888',
          fontSize: '14px',
          marginTop: '4px'
        }}>
          Send a notification directly to any user
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px',
        alignItems: 'start'
      }}>

        <div style={{
          background: '#fff',
          borderRadius: '14px',
          padding: '24px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
          border: '1px solid #eee'
        }}>
          <h2 style={{
            fontSize: '16px',
            fontWeight: 700,
            color: '#1a2b5e',
            margin: '0 0 20px 0'
          }}>
            Compose
          </h2>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>
              Select User
            </label>

            {selectedUser ? (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#eef1fa',
                border: '1px solid #d0d8f0',
                borderRadius: '8px',
                padding: '10px 12px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  {selectedUser.profilePicture ? (
                    <img
                      src={selectedUser.profilePicture}
                      alt={selectedUser.name}
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        objectFit: 'cover'
                      }}/>
                  ) : (
                    <div style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      background: '#1a2b5e',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: '12px',
                      fontWeight: 600
                    }}>
                      {selectedUser.name
                        ?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#1a2b5e',
                      margin: 0
                    }}>
                      {selectedUser.name}
                    </p>
                    <p style={{
                      fontSize: '11px',
                      color: '#888',
                      margin: 0
                    }}>
                      {selectedUser.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedUser(null);
                    setForm(prev =>
                      ({ ...prev, userId: '' }));
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#888',
                    cursor: 'pointer',
                    fontSize: '18px',
                    lineHeight: 1
                  }}>
                  ×
                </button>
              </div>
            ) : (
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={e =>
                    setSearchTerm(e.target.value)}
                  style={inputStyle}/>
                {searchTerm && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    background: '#fff',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    boxShadow:
                      '0 4px 12px rgba(0,0,0,0.1)',
                    zIndex: 50,
                    maxHeight: '200px',
                    overflowY: 'auto',
                    marginTop: '4px'
                  }}>
                    {loading ? (
                      <p style={{
                        padding: '12px',
                        color: '#aaa',
                        fontSize: '13px',
                        margin: 0
                      }}>
                        Loading...
                      </p>
                    ) : filteredUsers.length === 0 ? (
                      <p style={{
                        padding: '12px',
                        color: '#aaa',
                        fontSize: '13px',
                        margin: 0
                      }}>
                        No users found
                      </p>
                    ) : (
                      filteredUsers.map(u => (
                        <div
                          key={u.id}
                          onClick={() => selectUser(u)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '10px 12px',
                            cursor: 'pointer',
                            borderBottom:
                              '1px solid #f5f5f5'
                          }}
                          onMouseEnter={e =>
                            e.currentTarget.style
                              .background = '#f8f9fb'}
                          onMouseLeave={e =>
                            e.currentTarget.style
                              .background = '#fff'}>
                          {u.profilePicture ? (
                            <img
                              src={u.profilePicture}
                              alt={u.name}
                              style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '50%',
                                objectFit: 'cover'
                              }}/>
                          ) : (
                            <div style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '50%',
                              background: '#1a2b5e',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#fff',
                              fontSize: '11px',
                              fontWeight: 600,
                              flexShrink: 0
                            }}>
                              {u.name?.charAt(0)
                                .toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p style={{
                              fontSize: '13px',
                              fontWeight: 500,
                              color: '#1a2b5e',
                              margin: 0
                            }}>
                              {u.name}
                            </p>
                            <p style={{
                              fontSize: '11px',
                              color: '#aaa',
                              margin: 0
                            }}>
                              {u.email} · {u.role}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>
              Notification Type
            </label>
            <select
              value={form.type}
              onChange={e => setForm(prev =>
                ({ ...prev, type: e.target.value }))}
              style={inputStyle}>
              {NOTIFICATION_TYPES.map(t => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>
              Message
            </label>
            <textarea
              value={form.message}
              onChange={e => setForm(prev =>
                ({ ...prev, message: e.target.value }))}
              placeholder="Type your notification message here..."
              rows={4}
              style={{
                ...inputStyle,
                resize: 'vertical'
              }}/>
            <p style={{
              fontSize: '12px',
              color: '#bbb',
              marginTop: '4px',
              textAlign: 'right'
            }}>
              {form.message.length} characters
            </p>
          </div>

          {form.message && selectedUser && (
            <div style={{
              background: '#f8f9fb',
              border: '1px solid #eee',
              borderRadius: '10px',
              padding: '14px',
              marginBottom: '20px'
            }}>
              <p style={{
                fontSize: '11px',
                color: '#aaa',
                margin: '0 0 8px 0',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Preview
              </p>
              <div style={{
                background: '#f0f4ff',
                borderRadius: '8px',
                padding: '12px',
                border: '1px solid #c7d3f5'
              }}>
                <p style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#1a2b5e',
                  margin: '0 0 6px 0'
                }}>
                  {form.message}
                </p>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <span style={{
                    display: 'inline-block',
                    background: previewBadge.bg,
                    color: previewBadge.color,
                    fontSize: '10px',
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: '20px'
                  }}>
                    {form.type.replace(/_/g, ' ')}
                  </span>
                  <span style={{
                    fontSize: '11px',
                    color: '#bbb'
                  }}>
                    Just now
                  </span>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleSend}
            disabled={
              sending ||
              !form.userId ||
              !form.message.trim()
            }
            style={{
              width: '100%',
              background: sending ||
                !form.userId ||
                !form.message.trim()
                  ? '#ccc' : '#1a2b5e',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              padding: '12px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: sending ||
                !form.userId ||
                !form.message.trim()
                  ? 'not-allowed' : 'pointer'
            }}>
            {sending
              ? 'Sending...'
              : 'Send Notification'}
          </button>
        </div>

        <div style={{
          background: '#fff',
          borderRadius: '14px',
          padding: '24px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
          border: '1px solid #eee'
        }}>
          <h2 style={{
            fontSize: '16px',
            fontWeight: 700,
            color: '#1a2b5e',
            margin: '0 0 20px 0'
          }}>
            Sent This Session
          </h2>

          {sent.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: '#f5f5f5',
                margin: '0 auto 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg
                  width="20" height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ccc"
                  strokeWidth="2">
                  <path d="M22 17H2a3 3 0 0 0
                    3-3V9a7 7 0 0 1 14 0v5a3
                    3 0 0 0 3 3zm-8.27
                    4a2 2 0 0 1-3.46 0"/>
                </svg>
              </div>
              <p style={{
                color: '#bbb',
                fontSize: '14px',
                margin: 0
              }}>
                No notifications sent yet
              </p>
            </div>
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              {sent.map(s => {
                const badge = typeColors[s.type]
                  || typeColors.GENERAL;
                return (
                  <div
                    key={s.id}
                    style={{
                      background: '#f8f9fb',
                      borderRadius: '10px',
                      padding: '12px 14px',
                      border: '1px solid #eee'
                    }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '6px'
                    }}>
                      <span style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#1a2b5e'
                      }}>
                        → {s.userName}
                      </span>
                      <span style={{
                        fontSize: '11px',
                        color: '#bbb'
                      }}>
                        {s.sentAt}
                      </span>
                    </div>
                    <p style={{
                      fontSize: '13px',
                      color: '#444',
                      margin: '0 0 6px 0'
                    }}>
                      {s.message}
                    </p>
                    <span style={{
                      display: 'inline-block',
                      background: badge.bg,
                      color: badge.color,
                      fontSize: '10px',
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: '20px'
                    }}>
                      {s.type.replace(/_/g, ' ')}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default SendNotificationPage;