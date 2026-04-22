import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading]             = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data.data);
    } catch (err) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(prev =>
        prev.map(n =>
          n.id === id ? { ...n, read: true } : n));
    } catch (err) {
      toast.error('Failed to mark as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true })));
      toast.success('All notifications marked as read');
    } catch (err) {
      toast.error('Failed to mark all as read');
    }
  };

  const deleteNotification = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(prev =>
        prev.filter(n => n.id !== id));
      toast.success('Notification deleted');
    } catch (err) {
      toast.error('Failed to delete notification');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8
          border-t-2 border-b-2 border-primary-600">
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Notifications
        </h1>
        {notifications.some(n => !n.read) && (
          <button
            onClick={markAllAsRead}
            className="text-sm text-primary-600
              hover:underline">
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm
          border border-gray-100 p-12 text-center">
          <p className="text-gray-400">
            No notifications yet
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map(n => (
            <div
              key={n.id}
              className={`bg-white rounded-xl shadow-sm
                border p-4 flex items-start
                justify-between gap-4
                ${!n.read
                  ? 'border-primary-200 bg-primary-50'
                  : 'border-gray-100'}`}>

              <div className="flex-1">
                <p className={`text-sm ${!n.read
                  ? 'font-medium text-gray-800'
                  : 'text-gray-600'}`}>
                  {n.message}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
                <span className="inline-block mt-2 text-xs
                  bg-gray-100 text-gray-500 px-2 py-0.5
                  rounded-full">
                  {n.type?.replace(/_/g, ' ')}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {!n.read && (
                  <button
                    onClick={() => markAsRead(n.id)}
                    className="text-xs text-primary-600
                      hover:underline whitespace-nowrap">
                    Mark read
                  </button>
                )}
                <button
                  onClick={() => deleteNotification(n.id)}
                  className="text-xs text-red-400
                    hover:text-red-600">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;