import { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import api from '../../services/api';

const StatCard = ({ title, value }) => (
  <div style={{
    background: '#fff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    border: '1px solid #eee'
  }}>
    <p style={{
      fontSize: '13px',
      color: '#888',
      marginBottom: '8px',
      fontWeight: 400
    }}>
      {title}
    </p>
    <p style={{
      fontSize: '28px',
      fontWeight: 600,
      color: '#1a2b5e',
      margin: 0
    }}>
      {value}
    </p>
  </div>
);

const DashboardPage = () => {
  const { user, isAdmin }             = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchUnreadCount();
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const res = await api.get('/notifications/unread-count');
      setUnreadCount(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '8px 0' }}>

      <div style={{ marginBottom: '28px' }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: 700,
          color: '#1a2b5e',
          margin: 0
        }}>
          Welcome, {user?.name}
        </h1>
        <p style={{
          color: '#888',
          fontSize: '14px',
          marginTop: '4px'
        }}>
          Smart Campus Operations Hub
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '16px',
        marginBottom: '28px'
      }}>
        <StatCard title="My Bookings" value="0" />
        <StatCard title="My Tickets" value="0" />
        <StatCard
          title="Unread Notifications"
          value={unreadCount}/>
      </div>

      {isAdmin() && (
        <div style={{
          background: '#eef1fa',
          border: '1px solid #d0d8f0',
          borderRadius: '10px',
          padding: '14px 18px'
        }}>
          <p style={{
            color: '#1a2b5e',
            fontSize: '14px',
            fontWeight: 500,
            margin: 0
          }}>
            You are logged in as Admin — you have full
            access to all modules.
          </p>
        </div>
      )}

    </div>
  );
};

export default DashboardPage;