import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import api from '../../services/api';

const Navbar = () => {
  const { user, logout, isAdmin }         = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount]     = useState(0);
  const [showPanel, setShowPanel]         = useState(false);

  useEffect(() => {
    if (user) fetchUnreadCount();
  }, [user]);

  const fetchUnreadCount = async () => {
    try {
      const res = await api.get('/notifications/unread-count');
      setUnreadCount(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const togglePanel = () => {
    if (!showPanel) fetchNotifications();
    setShowPanel(!showPanel);
  };

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(prev =>
        prev.map(n =>
          n.id === id ? { ...n, read: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true }))
      );
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <nav style={{
      background: '#fff',
      borderBottom: '1px solid #eee',
      padding: '0 32px',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>

      <Link to="/dashboard" style={{
        fontSize: '20px',
        fontWeight: 700,
        color: '#1a2b5e',
        textDecoration: 'none'
      }}>
        SmartCampus
      </Link>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '20px'
      }}>

        {isAdmin() && (
          <Link to="/admin" style={{
            fontSize: '14px',
            color: '#555',
            textDecoration: 'none',
            fontWeight: 500
          }}>
            Admin
          </Link>
        )}

        <div style={{ position: 'relative' }}>
          <button
            onClick={togglePanel}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '6px',
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}>
            <svg
              width="22" height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#555"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3
                9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '2px',
                right: '2px',
                background: '#e53e3e',
                color: '#fff',
                fontSize: '10px',
                fontWeight: 700,
                borderRadius: '50%',
                width: '16px',
                height: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {showPanel && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '44px',
              width: '320px',
              background: '#fff',
              borderRadius: '12px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              border: '1px solid #eee',
              zIndex: 200
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 16px',
                borderBottom: '1px solid #f0f0f0'
              }}>
                <h3 style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#1a2b5e',
                  margin: 0
                }}>
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#1a2b5e',
                      fontSize: '12px',
                      cursor: 'pointer',
                      fontWeight: 500
                    }}>
                    Mark all read
                  </button>
                )}
              </div>

              <div style={{
                maxHeight: '320px',
                overflowY: 'auto'
              }}>
                {notifications.length === 0 ? (
                  <p style={{
                    textAlign: 'center',
                    color: '#aaa',
                    fontSize: '13px',
                    padding: '24px'
                  }}>
                    No notifications
                  </p>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() =>
                        !n.read && markAsRead(n.id)}
                      style={{
                        padding: '12px 16px',
                        borderBottom: '1px solid #f8f8f8',
                        cursor: n.read
                          ? 'default' : 'pointer',
                        background: n.read
                          ? '#fff' : '#f0f4ff'
                      }}>
                      <p style={{
                        fontSize: '13px',
                        fontWeight: n.read ? 400 : 600,
                        color: '#1a2b5e',
                        margin: '0 0 4px 0'
                      }}>
                        {n.message}
                      </p>
                      <p style={{
                        fontSize: '11px',
                        color: '#bbb',
                        margin: 0
                      }}>
                        {new Date(n.createdAt)
                          .toLocaleDateString()}
                      </p>
                    </div>
                  ))
                )}
              </div>

              <div style={{
                padding: '10px 16px',
                borderTop: '1px solid #f0f0f0'
              }}>
                <Link
                  to="/notifications"
                  onClick={() => setShowPanel(false)}
                  style={{
                    fontSize: '13px',
                    color: '#1a2b5e',
                    textDecoration: 'none',
                    fontWeight: 500
                  }}>
                  View all notifications →
                </Link>
              </div>
            </div>
          )}
        </div>

        <Link
          to="/profile"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textDecoration: 'none'
          }}>
          {user?.profilePicture ? (
            <img
              src={user.profilePicture}
              alt={user.name}
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid #e0e0e0'
              }}/>
          ) : (
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: '#1a2b5e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '13px',
              fontWeight: 600
            }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          )}
          <span style={{
            fontSize: '14px',
            fontWeight: 500,
            color: '#333'
          }}>
            {user?.name}
          </span>
        </Link>

        <button
          onClick={logout}
          style={{
            background: 'none',
            border: '1px solid #eee',
            borderRadius: '8px',
            padding: '6px 14px',
            fontSize: '13px',
            color: '#e53e3e',
            cursor: 'pointer',
            fontWeight: 500
          }}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;