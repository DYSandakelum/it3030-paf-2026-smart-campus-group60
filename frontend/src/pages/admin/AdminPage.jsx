import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const modules = [
  {
    title: 'User Management',
    description: 'View all users, assign roles and manage access',
    link: '/admin/users',
    bg: '#eef1fa',
    color: '#1a2b5e'
  },
  {
    title: 'Resource Catalogue',
    description: 'Manage rooms, labs, equipment and availability',
    link: '/resources',
    bg: '#e8f5e9',
    color: '#2e7d32'
  },
  {
    title: 'Booking Requests',
    description: 'Review, approve or reject booking requests',
    link: '/admin/bookings',
    bg: '#fff8e1',
    color: '#f57f17'
  },
  {
    title: 'Incident Tickets',
    description: 'Manage tickets and assign technicians',
    link: '/tickets',
    bg: '#fce4ec',
    color: '#880e4f'
  },
];

const AdminPage = () => {
  const { user } = useAuth();

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: 700,
          color: '#1a2b5e',
          margin: 0
        }}>
          Admin Panel
        </h1>
        <p style={{
          color: '#888',
          fontSize: '14px',
          marginTop: '4px'
        }}>
          Manage all campus operations from here
        </p>
      </div>

      <div style={{
        background: '#eef1fa',
        border: '1px solid #d0d8f0',
        borderRadius: '10px',
        padding: '14px 18px',
        marginBottom: '28px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        {user?.profilePicture ? (
          <img
            src={user.profilePicture}
            alt={user.name}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              objectFit: 'cover'
            }}/>
        ) : (
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: '#1a2b5e',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 600,
            fontSize: '14px',
            flexShrink: 0
          }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <p style={{
            fontSize: '14px',
            fontWeight: 600,
            color: '#1a2b5e',
            margin: 0
          }}>
            {user?.name}
          </p>
          <p style={{
            fontSize: '12px',
            color: '#5c7bd4',
            margin: 0
          }}>
            Administrator — full access to all modules
          </p>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '16px'
      }}>
        {modules.map(m => (
          <Link
            key={m.title}
            to={m.link}
            style={{ textDecoration: 'none' }}>
            <div style={{
              background: '#fff',
              borderRadius: '12px',
              padding: '22px',
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
                display: 'inline-block',
                background: m.bg,
                borderRadius: '8px',
                width: '36px',
                height: '36px',
                marginBottom: '14px'
              }}/>
              <h3 style={{
                fontSize: '15px',
                fontWeight: 700,
                color: '#1a2b5e',
                margin: '0 0 6px 0'
              }}>
                {m.title}
              </h3>
              <p style={{
                fontSize: '13px',
                color: '#888',
                margin: 0
              }}>
                {m.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminPage;