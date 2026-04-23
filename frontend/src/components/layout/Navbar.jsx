import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import api from '../../services/api';

const Navbar = () => {
  const { user, logout, isAdmin }     = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount]     = useState(0);
  const [showPanel, setShowPanel]         = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) fetchUnreadCount();
  }, [user]);

  const fetchUnreadCount = async () => {
    try {
      const res = await api.get('/notifications/unread-count');
      setUnreadCount(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const togglePanel = () => {
    if (!showPanel) fetchNotifications();
    setShowPanel(!showPanel);
  };

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true }))
      );
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200
      px-6 py-4 flex items-center justify-between">

      <Link to="/dashboard"
        className="text-xl font-bold text-primary-600">
        Smart Campus
      </Link>

      <div className="flex items-center gap-4">

        {isAdmin() && (
          <Link to="/admin"
            className="text-sm text-gray-600 hover:text-primary-600">
            Admin
          </Link>
        )}

        <div className="relative">
          <button
            onClick={togglePanel}
            className="relative p-2 text-gray-600
              hover:text-primary-600 focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0
                  0118 14.158V11a6.002 6.002 0
                  00-4-5.659V5a2 2 0 10-4
                  0v.341C7.67 6.165 6 8.388 6
                  11v3.159c0 .538-.214
                  1.055-.595 1.436L4 17h5m6
                  0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1
                bg-red-500 text-white text-xs rounded-full
                h-5 w-5 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {showPanel && (
            <div className="absolute right-0 mt-2 w-80
              bg-white rounded-lg shadow-lg border
              border-gray-200 z-50">

              <div className="flex items-center justify-between
                px-4 py-3 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800">
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-primary-600
                      hover:underline">
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-center text-gray-400
                    text-sm py-6">
                    No notifications
                  </p>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() => !n.read && markAsRead(n.id)}
                      className={`px-4 py-3 border-b
                        border-gray-50 cursor-pointer
                        hover:bg-gray-50 transition-colors
                        ${!n.read ? 'bg-primary-50' : ''}`}>
                      <p className={`text-sm ${!n.read
                        ? 'font-medium text-gray-800'
                        : 'text-gray-600'}`}>
                        {n.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(n.createdAt)
                          .toLocaleDateString()}
                      </p>
                    </div>
                  ))
                )}
              </div>

              <div className="px-4 py-2 border-t border-gray-100">
                <Link
                  to="/notifications"
                  onClick={() => setShowPanel(false)}
                  className="text-xs text-primary-600
                    hover:underline">
                  View all notifications
                </Link>
              </div>
            </div>
          )}
        </div>

        <Link to="/profile"
          className="flex items-center gap-2
            hover:opacity-80 transition-opacity">
          {user?.profilePicture ? (
            <img
              src={user.profilePicture}
              alt={user.name}
              className="h-8 w-8 rounded-full object-cover"/>
          ) : (
            <div className="h-8 w-8 rounded-full
              bg-primary-100 flex items-center justify-center">
              <span className="text-primary-600 text-sm font-medium">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <span className="text-sm text-gray-700">
            {user?.name}
          </span>
        </Link>

        <button
          onClick={logout}
          className="text-sm text-red-500 hover:text-red-700">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;