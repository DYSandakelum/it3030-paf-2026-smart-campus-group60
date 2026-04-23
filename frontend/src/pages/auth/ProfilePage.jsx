import useAuth from '../../hooks/useAuth';

const getRoleBadgeColor = (role) => {
  switch (role) {
    case 'ADMIN':
      return 'bg-red-100 text-red-700';
    case 'TECHNICIAN':
      return 'bg-blue-100 text-blue-700';
    default:
      return 'bg-green-100 text-green-700';
  }
};

const ProfilePage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          My Profile
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Your account details
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm
        border border-gray-100 overflow-hidden">

        <div className="bg-gradient-to-r from-primary-500
          to-primary-700 h-24">
        </div>

        <div className="px-6 pb-6">
          <div className="flex items-end gap-4 -mt-10 mb-6">
            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={user.name}
                className="h-20 w-20 rounded-full
                  object-cover border-4 border-white
                  shadow-md"/>
            ) : (
              <div className="h-20 w-20 rounded-full
                bg-primary-100 border-4 border-white
                shadow-md flex items-center justify-center">
                <span className="text-primary-600
                  text-2xl font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className="mb-2">
              <h2 className="text-xl font-bold text-gray-800">
                {user?.name}
              </h2>
              <span className={`inline-flex px-2 py-0.5
                rounded-full text-xs font-medium
                ${getRoleBadgeColor(user?.role)}`}>
                {user?.role}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3
              p-4 bg-gray-50 rounded-lg">
              <div className="shrink-0">
                <p className="text-xs text-gray-400 mb-0.5">
                  Full Name
                </p>
                <p className="text-sm font-medium text-gray-800">
                  {user?.name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3
              p-4 bg-gray-50 rounded-lg">
              <div className="shrink-0">
                <p className="text-xs text-gray-400 mb-0.5">
                  Email Address
                </p>
                <p className="text-sm font-medium text-gray-800">
                  {user?.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3
              p-4 bg-gray-50 rounded-lg">
              <div className="shrink-0">
                <p className="text-xs text-gray-400 mb-0.5">
                  Role
                </p>
                <p className="text-sm font-medium text-gray-800">
                  {user?.role}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3
              p-4 bg-gray-50 rounded-lg">
              <div className="shrink-0">
                <p className="text-xs text-gray-400 mb-0.5">
                  Login Provider
                </p>
                <p className="text-sm font-medium text-gray-800
                  capitalize">
                  {user?.oauthProvider || 'Google'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3
              p-4 bg-gray-50 rounded-lg">
              <div className="shrink-0">
                <p className="text-xs text-gray-400 mb-0.5">
                  Member Since
                </p>
                <p className="text-sm font-medium text-gray-800">
                  {user?.createdAt
                    ? new Date(user.createdAt)
                        .toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <button
              onClick={logout}
              className="w-full bg-red-50 text-red-600
                border border-red-100 rounded-xl py-3
                text-sm font-medium hover:bg-red-100
                transition-colors">
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;