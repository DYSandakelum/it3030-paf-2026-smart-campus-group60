import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import api from '../../services/api';

const StatCard = ({ title, value, bg, color, link }) => (
  <Link to={link || '#'} style={{ textDecoration: 'none' }}>
    <div style={{
      background: '#fff',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      border: '1px solid #eee',
      cursor: 'pointer',
      transition: 'box-shadow 0.2s'
    }}
    onMouseEnter={e =>
      e.currentTarget.style.boxShadow =
        '0 4px 12px rgba(0,0,0,0.1)'}
    onMouseLeave={e =>
      e.currentTarget.style.boxShadow =
        '0 1px 3px rgba(0,0,0,0.08)'}>
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '10px',
        background: bg,
        marginBottom: '14px'
      }}/>
      <p style={{
        fontSize: '13px',
        color: '#888',
        marginBottom: '6px',
        fontWeight: 400
      }}>
        {title}
      </p>
      <p style={{
        fontSize: '28px',
        fontWeight: 700,
        color: color || '#1a2b5e',
        margin: 0
      }}>
        {value}
      </p>
    </div>
  </Link>
);

const ModuleCard = ({ title, description,
  link, bg, color }) => (
  <Link to={link} style={{ textDecoration: 'none' }}>
    <div style={{
      background: '#fff',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.07)',
      border: '1px solid #eee',
      cursor: 'pointer',
      transition: 'box-shadow 0.2s'
    }}
    onMouseEnter={e =>
      e.currentTarget.style.boxShadow =
        '0 4px 12px rgba(0,0,0,0.1)'}
    onMouseLeave={e =>
      e.currentTarget.style.boxShadow =
        '0 1px 3px rgba(0,0,0,0.07)'}>
      <div style={{
        width: '36px',
        height: '36px',
        borderRadius: '8px',
        background: bg,
        marginBottom: '12px'
      }}/>
      <h3 style={{
        fontSize: '15px',
        fontWeight: 700,
        color: '#1a2b5e',
        margin: '0 0 6px 0'
      }}>
        {title}
      </h3>
      <p style={{
        fontSize: '13px',
        color: '#888',
        margin: '0 0 12px 0'
      }}>
        {description}
      </p>
      <span style={{
        fontSize: '12px',
        color: color,
        fontWeight: 600
      }}>
        Manage →
      </span>
    </div>
  </Link>
);

const AdminDashboardPage = () => {
  const { user }                          = useAuth();
  const [unreadCount, setUnreadCount]     = useState(0);
  const [userCount, setUserCount]         = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [notifRes, usersRes] = await Promise.all([
        api.get('/notifications/unread-count'),
        api.get('/users'),
      ]);
      setUnreadCount(notifRes.data.data);
      setUserCount(usersRes.data.data?.length || 0);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '8px 0' }}>

      <div style={{
        background: 'linear-gradient(135deg, #1a2b5e, #2d4a9e)',
        borderRadius: '16px',
        padding: '28px 32px',
        marginBottom: '28px',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          {user?.profilePicture ? (
            <img
              src={user.profilePicture}
              alt={user.name}
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                border: '3px solid rgba(255,255,255,0.3)',
                objectFit: 'cover'
              }}/>
          ) : (
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              fontWeight: 700,
              color: '#fff',
              border: '3px solid rgba(255,255,255,0.3)'
            }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p style={{
              fontSize: '13px',
              color: 'rgba(255,255,255,0.7)',
              margin: '0 0 4px 0'
            }}>
              Admin Panel
            </p>
            <h1 style={{
              fontSize: '22px',
              fontWeight: 700,
              margin: '0 0 4px 0'
            }}>
              Welcome, {user?.name}
            </h1>
            <span style={{
              display: 'inline-block',
              background: 'rgba(255,255,255,0.2)',
              color: '#fff',
              fontSize: '11px',
              fontWeight: 600,
              padding: '2px 10px',
              borderRadius: '20px'
            }}>
              ADMINISTRATOR
            </span>
          </div>
        </div>

        <Link to="/admin/users" style={{
          background: 'rgba(255,255,255,0.15)',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.3)',
          borderRadius: '10px',
          padding: '10px 20px',
          textDecoration: 'none',
          fontSize: '13px',
          fontWeight: 600
        }}>
          Manage Users
        </Link>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px',
        marginBottom: '28px'
      }}>
        <StatCard
          title="Total Users"
          value={userCount}
          bg="#eef1fa"
          color="#1a2b5e"
          link="/admin/users"/>
        <StatCard
          title="All Bookings"
          value="0"
          bg="#e8f5e9"
          color="#2e7d32"
          link="/admin/bookings"/>
        <StatCard
          title="Open Tickets"
          value="0"
          bg="#fce4ec"
          color="#880e4f"
          link="/tickets"/>
        <StatCard
          title="Notifications"
          value={unreadCount}
          bg="#fff8e1"
          color="#f57f17"
          link="/notifications"/>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2 style={{
          fontSize: '16px',
          fontWeight: 700,
          color: '#1a2b5e',
          margin: '0 0 16px 0'
        }}>
          Manage Modules
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '16px'
        }}>
          <ModuleCard
            title="User Management"
            description="View all users, assign and change roles"
            link="/admin/users"
            bg="#eef1fa"
            color="#1a2b5e"/>
          <ModuleCard
            title="Resource Catalogue"
            description="Manage rooms, labs, equipment availability"
            link="/resources"
            bg="#e8f5e9"
            color="#2e7d32"/>
          <ModuleCard
            title="Booking Requests"
            description="Review, approve or reject booking requests"
            link="/admin/bookings"
            bg="#fff8e1"
            color="#f57f17"/>
          <ModuleCard
            title="Incident Tickets"
            description="Manage tickets and assign technicians"
            link="/tickets"
            bg="#fce4ec"
            color="#880e4f"/>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboardPage;