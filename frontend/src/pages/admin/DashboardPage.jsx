import useAuth from '../../hooks/useAuth';
import UserDashboardPage
  from '../dashboard/UserDashboardPage';
import AdminDashboardPage
  from '../dashboard/AdminDashboardPage';

const DashboardPage = () => {
  const { user, isAdmin, isTechnician } = useAuth();

  if (!user) return null;

  if (isAdmin()) {
    return <AdminDashboardPage />;
  }

  return <UserDashboardPage />;
};

export default DashboardPage;