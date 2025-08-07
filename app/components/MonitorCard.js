'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle, Clock, AlertTriangle, Globe, Trash2, Power, PowerOff, MoreVertical, ExternalLink, Edit } from 'lucide-react';

export default function MonitorCard({ monitor, onDelete, onToggle, onEdit }) {
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'up':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'down':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'up':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'down':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    }
  };

  const formatResponseTime = (responseTime) => {
    if (!responseTime) return 'N/A';
    return `${responseTime}ms`;
  };

  const formatUptime = (uptime) => {
    if (uptime === undefined || uptime === null) return 'N/A';
    return `${uptime.toFixed(1)}%`;
  };

  const getUptimeColor = (uptime) => {
    if (uptime >= 99) return 'text-green-600 dark:text-green-400';
    if (uptime >= 95) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const latestCheck = monitor.latestCheck;
  const status = latestCheck?.status || 'unknown';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 relative">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Globe className="w-5 h-5 text-gray-400" />
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
              {monitor.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {monitor.url}
            </p>
          </div>
        </div>
        
        {/* Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <MoreVertical className="w-4 h-4 text-gray-400" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg border border-gray-200 dark:border-gray-600 z-10">
              <button
                onClick={() => {
                  router.push(`/monitor/${monitor.id}`);
                  setShowMenu(false);
                }}
                className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <ExternalLink className="w-4 h-4" />
                <span>View Details</span>
              </button>
              <button
                onClick={() => {
                  onEdit(monitor);
                  setShowMenu(false);
                }}
                className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <Edit className="w-4 h-4" />
                <span>Edit Monitor</span>
              </button>
              <button
                onClick={() => {
                  onToggle(monitor.id, !monitor.isActive);
                  setShowMenu(false);
                }}
                className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                {monitor.isActive ? (
                  <>
                    <PowerOff className="w-4 h-4" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Power className="w-4 h-4" />
                    <span>Resume</span>
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  onDelete(monitor.id);
                  setShowMenu(false);
                }}
                className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          {getStatusIcon(status)}
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
            {status.toUpperCase()}
          </span>
        </div>
        
        {!monitor.isActive && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
            PAUSED
          </span>
        )}
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500 dark:text-gray-400">Response</span>
          </div>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {formatResponseTime(latestCheck?.responseTime)}
          </p>
        </div>
        
        <div>
          <div className="flex items-center space-x-1">
            <CheckCircle className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500 dark:text-gray-400">Uptime</span>
          </div>
          <p className={`text-lg font-semibold ${getUptimeColor(monitor.uptimePercentage)}`}>
            {formatUptime(monitor.uptimePercentage)}
          </p>
        </div>
      </div>

      {/* Last checked */}
      {latestCheck && (
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Last checked: {new Date(latestCheck.timestamp).toLocaleTimeString()}
        </div>
      )}

      {/* Error message */}
      {latestCheck?.error && (
        <div className="mt-2 p-2 bg-red-50 dark:bg-red-900 rounded text-xs text-red-600 dark:text-red-300">
          {latestCheck.error}
        </div>
      )}

      {/* Click overlay to close menu */}
      {showMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
}
