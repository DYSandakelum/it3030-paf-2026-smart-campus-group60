import useAuth from '../../hooks/useAuth';

const roleBadge = (role) => {
  const styles = {
    ADMIN:      { bg: '#fdecea', color: '#c62828' },
    TECHNICIAN: { bg: '#e3f2fd', color: '#1565c0' },
    USER:       { bg: '#e8f5e9', color: '#2e7d32' },
  };
  return styles[role] || styles.USER;
};

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const badge = roleBadge(user?.role);

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto' }}>

      <div style={{ marginBottom: '24px' }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: 700,
          color: '#1a2b5e',
          margin: 0
        }}>
          My Profile
        </h1>
        <p style={{
          color: '#888',
          fontSize: '14px',
          marginTop: '4px'
        }}>
          Your account details
        </p>
      </div>

      <div style={{
        background: '#fff',
        borderRadius: '14px',
        overflow: 'hidden',
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
        border: '1px solid #eee'
      }}>

        <div style={{
          background: 'linear-gradient(135deg, #1a2b5e, #2d4a9e)',
          height: '80px'
        }}/>

        <div style={{ padding: '0 24px 28px' }}>

          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: '16px',
            marginTop: '-32px',
            marginBottom: '24px'
          }}>
            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={user.name}
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  border: '3px solid #fff',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  objectFit: 'cover'
                }}/>
            ) : (
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: '#1a2b5e',
                border: '3px solid #fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '22px',
                fontWeight: 600,
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
              }}>
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <div style={{ marginBottom: '6px' }}>
              <h2 style={{
                fontSize: '18px',
                fontWeight: 700,
                color: '#1a2b5e',
                margin: '0 0 4px 0'
              }}>
                {user?.name}
              </h2>
              <span style={{
                display: 'inline-block',
                background: badge.bg,
                color: badge.color,
                fontSize: '11px',
                fontWeight: 600,
                padding: '3px 10px',
                borderRadius: '20px'
              }}>
                {user?.role}
              </span>
            </div>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {[
              { label: 'Full Name',       value: user?.name },
              { label: 'Email Address',   value: user?.email },
              { label: 'Role',            value: user?.role },
              {
                label: 'Login Provider',
                value: user?.oauthProvider || 'Google'
              },
              {
                label: 'Member Since',
                value: user?.createdAt
                  ? new Date(user.createdAt)
                      .toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                  : 'N/A'
              },
            ].map(item => (
              <div
                key={item.label}
                style={{
                  background: '#f8f9fb',
                  borderRadius: '10px',
                  padding: '14px 16px',
                  border: '1px solid #eee'
                }}>
                <p style={{
                  fontSize: '12px',
                  color: '#aaa',
                  margin: '0 0 4px 0'
                }}>
                  {item.label}
                </p>
                <p style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#1a2b5e',
                  margin: 0,
                  textTransform: item.label === 'Login Provider'
                    ? 'capitalize' : 'none'
                }}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          <button
            onClick={logout}
            style={{
              width: '100%',
              marginTop: '24px',
              background: '#fff',
              color: '#e53e3e',
              border: '1px solid #fed7d7',
              borderRadius: '10px',
              padding: '12px',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer'
            }}>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;