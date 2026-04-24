import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const MainLayout = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#f5f6fa'
    }}>
      <Navbar />
      <main style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '32px 24px'
      }}>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;