import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const AdminCard = ({ title, description, link, color }) => (
  <Link to={link}
    className={`block bg-white rounded-xl shadow-sm
      border border-gray-100 p-6 hover:shadow-md
      hover:border-primary-200 transition-all duration-200`}>
    <div className={`inline-flex p-3 rounded-lg
      mb-4 ${color}`}>
    </div>
    <h3 className="font-semibold text-gray-800 mb-1">
      {title}
    </h3>
    <p className="text-sm text-gray-500">
      {description}
    </p>
  </Link>
);

const AdminPage = () => {
  const { user } = useAuth();

  const adminModules = [
    {
      title: 'User Management',
      description: 'View all users, assign roles and manage access levels',
      link: '/admin/users',
      color: 'bg-purple-100'
    },
    {
      title: 'Resource Catalogue',
      description: 'Manage rooms, labs, equipment and their availability',
      link: '/resources',
      color: 'bg-blue-100'
    },
    {
      title: 'Booking Requests',
      description: 'Review, approve or reject pending booking requests',
      link: '/bookings',
      color: 'bg-green-100'
    },
    {
      title: 'Incident Tickets',
      description: 'Manage maintenance tickets and assign technicians',
      link: '/tickets',
      color: 'bg-orange-100'
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          Admin Panel
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage all campus operations from here
        </p>
      </div>

      <div className="bg-primary-50 border border-primary-100
        rounded-xl p-4 mb-8 flex items-center gap-3">
        <div className="h-10 w-10 rounded-full
          bg-primary-100 flex items-center justify-center
          shrink-0">
          {user?.profilePicture ? (
            <img src={user.profilePicture}
              alt={user.name}
              className="h-10 w-10 rounded-full object-cover"/>
          ) : (
            <span className="text-primary-600 font-medium">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div>
          <p className="text-primary-800 font-medium text-sm">
            Logged in as {user?.name}
          </p>
          <p className="text-primary-600 text-xs">
            Administrator — full access to all modules
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2
        lg:grid-cols-2 gap-4">
        {adminModules.map((module) => (
          <AdminCard key={module.title} {...module} />
        ))}
      </div>
    </div>
  );
};

export default AdminPage;