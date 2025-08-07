'use client';

import { useState, useEffect } from 'react';
import { Monitor, Plus, Activity, Clock, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import MonitorCard from './components/MonitorCard';
import AddMonitorForm from './components/AddMonitorForm';
import EditMonitorForm from './components/EditMonitorForm';
import StatsOverview from './components/StatsOverview';
import NotificationBanner from './components/NotificationBanner';

export default function Home() {
  const [monitors, setMonitors] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingMonitor, setEditingMonitor] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMonitors = async () => {
    try {
      const response = await fetch('/api/monitors');
      const data = await response.json();
      setMonitors(data);
    } catch (error) {
      console.error('Failed to fetch monitors:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonitors();
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchMonitors, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleAddMonitor = async (monitorData) => {
    try {
      const response = await fetch('/api/monitors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(monitorData),
      });
      
      if (response.ok) {
        setShowAddForm(false);
        fetchMonitors();
      }
    } catch (error) {
      console.error('Failed to add monitor:', error);
    }
  };

  const handleDeleteMonitor = async (id) => {
    if (!confirm('Are you sure you want to delete this monitor?')) return;
    
    try {
      const response = await fetch(`/api/monitors/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        fetchMonitors();
      }
    } catch (error) {
      console.error('Failed to delete monitor:', error);
    }
  };

  const handleToggleMonitor = async (id, isActive) => {
    try {
      const response = await fetch(`/api/monitors/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive }),
      });
      
      if (response.ok) {
        fetchMonitors();
      }
    } catch (error) {
      console.error('Failed to toggle monitor:', error);
    }
  };

  const handleEditMonitor = (monitor) => {
    setEditingMonitor(monitor);
    setShowEditForm(true);
  };

  const handleUpdateMonitor = async (id, monitorData) => {
    try {
      const response = await fetch(`/api/monitors/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(monitorData),
      });
      
      if (response.ok) {
        setShowEditForm(false);
        setEditingMonitor(null);
        fetchMonitors();
      }
    } catch (error) {
      console.error('Failed to update monitor:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Activity className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-gray-600 dark:text-gray-300">Loading monitors...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Monitor className="w-8 h-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Uptime Monitor
              </h1>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Monitor
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Notifications */}
        <NotificationBanner monitors={monitors} />
        
        {/* Stats Overview */}
        <StatsOverview monitors={monitors} />

        {/* Monitors Grid */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
            Monitors ({monitors.length})
          </h2>
          
          {monitors.length === 0 ? (
            <div className="text-center py-12">
              <Monitor className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No monitors yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Get started by adding your first website monitor
              </p>
              <button
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Monitor
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {monitors.map((monitor) => (
                <MonitorCard
                  key={monitor.id}
                  monitor={monitor}
                  onDelete={handleDeleteMonitor}
                  onToggle={handleToggleMonitor}
                  onEdit={handleEditMonitor}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Add Monitor Modal */}
      {showAddForm && (
        <AddMonitorForm
          onAdd={handleAddMonitor}
          onClose={() => setShowAddForm(false)}
        />
      )}

      {/* Edit Monitor Modal */}
      {showEditForm && editingMonitor && (
        <EditMonitorForm
          monitor={editingMonitor}
          onUpdate={handleUpdateMonitor}
          onClose={() => {
            setShowEditForm(false);
            setEditingMonitor(null);
          }}
        />
      )}
    </div>
  );
}