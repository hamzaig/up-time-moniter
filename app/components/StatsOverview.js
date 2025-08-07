'use client';

import { CheckCircle, XCircle, Clock, Activity, TrendingUp, AlertTriangle } from 'lucide-react';

export default function StatsOverview({ monitors }) {
  const totalMonitors = monitors.length;
  const activeMonitors = monitors.filter(m => m.isActive).length;
  const upMonitors = monitors.filter(m => m.latestCheck?.status === 'up').length;
  const downMonitors = monitors.filter(m => m.latestCheck?.status === 'down').length;
  
  const averageUptime = totalMonitors > 0 
    ? monitors.reduce((sum, m) => sum + (m.uptimePercentage || 0), 0) / totalMonitors 
    : 0;
    
  const averageResponseTime = totalMonitors > 0
    ? monitors
        .filter(m => m.averageResponseTime)
        .reduce((sum, m) => sum + m.averageResponseTime, 0) / 
      Math.max(monitors.filter(m => m.averageResponseTime).length, 1)
    : 0;

  const stats = [
    {
      name: 'Total Monitors',
      value: totalMonitors,
      icon: Activity,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
    },
    {
      name: 'Online',
      value: upMonitors,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900',
    },
    {
      name: 'Offline',
      value: downMonitors,
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100 dark:bg-red-900',
    },
    {
      name: 'Avg Uptime',
      value: `${averageUptime.toFixed(1)}%`,
      icon: TrendingUp,
      color: averageUptime >= 99 ? 'text-green-600' : averageUptime >= 95 ? 'text-yellow-600' : 'text-red-600',
      bgColor: averageUptime >= 99 ? 'bg-green-100 dark:bg-green-900' : averageUptime >= 95 ? 'bg-yellow-100 dark:bg-yellow-900' : 'bg-red-100 dark:bg-red-900',
    },
    {
      name: 'Avg Response',
      value: averageResponseTime > 0 ? `${Math.round(averageResponseTime)}ms` : 'N/A',
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900',
    },
  ];

  if (totalMonitors === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No Monitoring Data Yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Add your first monitor to start tracking website uptime and performance.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.name}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.name}
                </p>
                <p className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
