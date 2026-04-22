import useAuth from '../../hooks/useAuth';

const DashboardPage = () => {
  const { user, isAdmin } = useAuth();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome, {user?.name}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Smart Campus Operations Hub
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm
          border border-gray-100 p-6">
          <h3 className="text-sm font-medium text-gray-500">
            My Bookings
          </h3>
          <p className="text-2xl font-bold text-primary-600 mt-2">
            0
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm
          border border-gray-100 p-6">
          <h3 className="text-sm font-medium text-gray-500">
            My Tickets
          </h3>
          <p className="text-2xl font-bold text-primary-600 mt-2">
            0
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm
          border border-gray-100 p-6">
          <h3 className="text-sm font-medium text-gray-500">
            Notifications
          </h3>
          <p className="text-2xl font-bold text-primary-600 mt-2">
            0
          </p>
        </div>
      </div>

      {isAdmin() && (
        <div className="mt-6 bg-primary-50 border
          border-primary-100 rounded-xl p-4">
          <p className="text-primary-700 text-sm font-medium">
            You are logged in as Admin — you have full access
            to all modules.
          </p>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;