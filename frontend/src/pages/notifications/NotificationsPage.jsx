import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const typeColors = {
  BOOKING_APPROVED:    { bg: '#e8f5e9', color: '#2e7d32' },
  BOOKING_REJECTED:    { bg: '#fdecea', color: '#c62828' },
  BOOKING_CANCELLED:   { bg: '#fff3e0', color: '#e65100' },
  TICKET_STATUS_UPDATED:{ bg: '#e3f2fd', color: '#1565c0' },
  TICKET_ASSIGNED:     { bg: '#ede7f6', color: '#4527a0' },
  TICKET_COMMENT_ADDED:{ bg: '#fce4ec', color: '#880e4f' },
  GENERAL:             { bg: '#f5f5f5', color: '#424242' },
};

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading]             = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data.data);
    } catch (err) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(prev =>
        prev.map(n =>
          n.id === id ? { ...n, read: true } : n));
    } catch (err) {
      toast.error('Failed to mark as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true })));
      toast.success('All notifications marked as read');
    } catch (err) {
      toast.error('Failed to mark all as read');
    }
  };

  const deleteNotification = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(prev =>
        prev.filter(n => n.id !== id));
      toast.success('Notification deleted');
    } catch (err) {
      toast.error('Failed to delete notification');
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
    <div style={{ padding: '8px 0' }}>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px'
      }}>
        <div>
          <h1 style={{
            fontSize: '24px',
            fontWeight: 700,
            color: '#1a2b5e',
            margin: 0
          }}>
            Notifications
          </h1>
          <p style={{
            color: '#888',
            fontSize: '14px',
            marginTop: '4px'
          }}>
            Stay updated on your bookings and tickets
          </p>
        </div>
        {notifications.some(n => !n.read) && (
          <button
            onClick={markAllAsRead}
            style={{
              background: '#1a2b5e',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer'
            }}>
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div style={{
          background: '#fff',
          borderRadius: '12px',
          padding: '60px 24px',
          textAlign: 'center',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          border: '1px solid #eee'
        }}>
          <p style={{ color: '#aaa', fontSize: '15px' }}>
            No notifications yet
          </p>
        </div>
      ) : (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {notifications.map(n => {
            const typeStyle =
              typeColors[n.type] || typeColors.GENERAL;
            return (
              <div
                key={n.id}
                style={{
                  background: n.read ? '#fff' : '#f0f4ff',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.07)',
                  border: n.read
                    ? '1px solid #eee'
                    : '1px solid #c7d3f5',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '16px'
                }}>

                <div style={{ flex: 1 }}>
                  <p style={{
                    fontSize: '14px',
                    fontWeight: n.read ? 400 : 600,
                    color: '#1a2b5e',
                    margin: '0 0 6px 0'
                  }}>
                    {n.message}
                  </p>
                  <p style={{
                    fontSize: '12px',
                    color: '#aaa',
                    margin: '0 0 10px 0'
                  }}>
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                  <span style={{
                    display: 'inline-block',
                    background: typeStyle.bg,
                    color: typeStyle.color,
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '3px 10px',
                    borderRadius: '20px',
                    letterSpacing: '0.3px'
                  }}>
                    {n.type?.replace(/_/g, ' ')}
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  gap: '8px',
                  flexShrink: 0
                }}>
                  {!n.read && (
                    <button
                      onClick={() => markAsRead(n.id)}
                      style={{
                        background: '#1a2b5e',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '5px 12px',
                        fontSize: '12px',
                        cursor: 'pointer',
                        fontWeight: 500
                      }}>
                      Mark read
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(n.id)}
                    style={{
                      background: '#fff0f0',
                      color: '#e53e3e',
                      border: '1px solid #fed7d7',
                      borderRadius: '6px',
                      padding: '5px 12px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      fontWeight: 500
                    }}>
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;