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

const QuickActionCard = ({ title, description,
  link, buttonText, bg }) => (
  <div style={{
    background: '#fff',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    border: '1px solid #eee',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  }}>
    <div style={{
      width: '36px',
      height: '36px',
      borderRadius: '8px',
      background: bg
    }}/>
    <div>
      <h3 style={{
        fontSize: '15px',
        fontWeight: 700,
        color: '#1a2b5e',
        margin: '0 0 4px 0'
      }}>
        {title}
      </h3>
      <p style={{
        fontSize: '13px',
        color: '#888',
        margin: 0
      }}>
        {description}
      </p>
    </div>
    <Link to={link} style={{
      display: 'inline-block',
      background: '#1a2b5e',
      color: '#fff',
      padding: '8px 16px',
      borderRadius: '8px',
      textDecoration: 'none',
      fontSize: '13px',
      fontWeight: 600,
      alignSelf: 'flex-start',
      marginTop: '4px'
    }}>
      {buttonText}
    </Link>
  </div>
);

const UserDashboardPage = () => {
  const { user }                      = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchUnreadCount();
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const res = await api.get(
        '/notifications/unread-count');
      setUnreadCount(res.data.data);
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
        color: '#fff'
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
              Welcome back
            </p>
            <h1 style={{
              fontSize: '22px',
              fontWeight: 700,
              margin: '0 0 4px 0'
            }}>
              {user?.name}
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
              {user?.role}
            </span>
          </div>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '16px',
        marginBottom: '28px'
      }}>
        <StatCard
          title="My Bookings"
          value="0"
          bg="#eef1fa"
          color="#1a2b5e"
          link="/bookings"/>
        <StatCard
          title="My Tickets"
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
          Quick Actions
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px'
        }}>
          <QuickActionCard
            title="Book a Resource"
            description="Reserve rooms, labs or equipment for your needs"
            link="/bookings/new"
            buttonText="Create Booking"
            bg="#eef1fa"/>
          <QuickActionCard
            title="Report an Incident"
            description="Create a maintenance ticket for a facility issue"
            link="/tickets/new"
            buttonText="Create Ticket"
            bg="#fce4ec"/>
          <QuickActionCard
            title="Browse Resources"
            description="View available rooms, labs and equipment"
            link="/resources"
            buttonText="View Resources"
            bg="#e8f5e9"/>
        </div>
      </div>

      {unreadCount > 0 && (
        <div style={{
          background: '#fff8e1',
          border: '1px solid #ffe082',
          borderRadius: '10px',
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <p style={{
            color: '#f57f17',
            fontSize: '14px',
            fontWeight: 500,
            margin: 0
          }}>
            You have {unreadCount} unread
            notification{unreadCount > 1 ? 's' : ''}
          </p>
          <Link to="/notifications" style={{
            background: '#f57f17',
            color: '#fff',
            padding: '6px 14px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontSize: '13px',
            fontWeight: 600
          }}>
            View
          </Link>
        </div>
      )}

    </div>
  );
};

export default UserDashboardPage;