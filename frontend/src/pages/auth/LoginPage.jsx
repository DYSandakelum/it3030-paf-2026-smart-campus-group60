const LoginPage = () => {
  const handleGoogleLogin = () => {
    window.location.href =
      'http://localhost:8081/oauth2/authorization/google';
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f5f6fa',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '16px',
        padding: '40px 36px',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        border: '1px solid #eee'
      }}>

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{
            fontSize: '26px',
            fontWeight: 800,
            color: '#1a2b5e',
            margin: '0 0 6px 0'
          }}>
            SmartCampus
          </h1>
          <p style={{
            color: '#888',
            fontSize: '13px',
            margin: 0
          }}>
            Operations Hub — SLIIT Faculty of Computing
          </p>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: 700,
            color: '#1a2b5e',
            margin: '0 0 6px 0'
          }}>
            Welcome back
          </h2>
          <p style={{
            color: '#aaa',
            fontSize: '13px',
            margin: 0
          }}>
            Sign in to access the platform
          </p>
        </div>

        <button
          onClick={handleGoogleLogin}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            background: '#fff',
            border: '1.5px solid #e0e0e0',
            borderRadius: '10px',
            padding: '13px 20px',
            fontSize: '14px',
            fontWeight: 600,
            color: '#333',
            cursor: 'pointer',
            transition: 'border-color 0.2s'
          }}
          onMouseEnter={e =>
            e.target.style.borderColor = '#1a2b5e'}
          onMouseLeave={e =>
            e.target.style.borderColor = '#e0e0e0'}>
          <svg
            width="18" height="18"
            viewBox="0 0 24 24">
            <path fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26
              1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92
              3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23
              1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99
              20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43
              8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09
              14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66
              2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <p style={{
          textAlign: 'center',
          fontSize: '12px',
          color: '#ccc',
          marginTop: '20px',
          marginBottom: 0
        }}>
          Only SLIIT accounts are authorized to access this system
        </p>
      </div>
    </div>
  );
};

export default LoginPage;