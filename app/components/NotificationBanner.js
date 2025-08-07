'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, X, Bell } from 'lucide-react';

export default function NotificationBanner({ monitors }) {
  const [notifications, setNotifications] = useState([]);
  const [dismissedIds, setDismissedIds] = useState(new Set());

  useEffect(() => {
    const newNotifications = [];
    
    monitors.forEach(monitor => {
      const latestCheck = monitor.latestCheck;
      
      // Check if monitor is down
      if (latestCheck && latestCheck.status === 'down' && monitor.isActive) {
        const notificationId = `${monitor.id}-down`;
        if (!dismissedIds.has(notificationId)) {
          newNotifications.push({
            id: notificationId,
            type: 'error',
            title: `${monitor.name} is DOWN`,
            message: latestCheck.error || 'Website is not responding',
            timestamp: new Date(latestCheck.timestamp),
            monitorId: monitor.id,
          });
        }
      }
      
      // Check if uptime is low
      if (monitor.uptimePercentage < 95 && monitor.uptimePercentage > 0 && monitor.isActive) {
        const notificationId = `${monitor.id}-low-uptime`;
        if (!dismissedIds.has(notificationId)) {
          newNotifications.push({
            id: notificationId,
            type: 'warning',
            title: `${monitor.name} has low uptime`,
            message: `Uptime is ${monitor.uptimePercentage.toFixed(1)}% (below 95%)`,
            timestamp: new Date(),
            monitorId: monitor.id,
          });
        }
      }
      
      // Check if response time is high
      if (monitor.averageResponseTime > 5000 && monitor.isActive) {
        const notificationId = `${monitor.id}-slow-response`;
        if (!dismissedIds.has(notificationId)) {
          newNotifications.push({
            id: notificationId,
            type: 'warning',
            title: `${monitor.name} is responding slowly`,
            message: `Average response time is ${monitor.averageResponseTime}ms`,
            timestamp: new Date(),
            monitorId: monitor.id,
          });
        }
      }
    });
    
    setNotifications(newNotifications);
  }, [monitors, dismissedIds]);

  const dismissNotification = (notificationId) => {
    setDismissedIds(prev => new Set([...prev, notificationId]));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <Bell className="w-5 h-5 text-yellow-600" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      default:
        return <Bell className="w-5 h-5 text-blue-600" />;
    }
  };

  const getNotificationStyles = (type) => {
    switch (type) {
      case 'error':
        return 'bg-red-50 border-red-200 dark:bg-red-900 dark:border-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900 dark:border-yellow-800';
      case 'success':
        return 'bg-green-50 border-green-200 dark:bg-green-900 dark:border-green-800';
      default:
        return 'bg-blue-50 border-blue-200 dark:bg-blue-900 dark:border-blue-800';
    }
  };

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2 mb-6">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`border rounded-lg p-4 ${getNotificationStyles(notification.type)}`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              {getNotificationIcon(notification.type)}
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  {notification.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {notification.message}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {notification.timestamp.toLocaleString()}
                </p>
              </div>
            </div>
            <button
              onClick={() => dismissNotification(notification.id)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
