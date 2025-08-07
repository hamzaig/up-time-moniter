// In-memory data store for monitors and status checks
// In a production app, you'd use a proper database like MongoDB, PostgreSQL, etc.

// Use global to persist data across hot reloads in development
const globalForData = globalThis;

if (!globalForData.monitorsStore) {
  globalForData.monitorsStore = [
    {
      id: '1',
      name: 'Google',
      url: 'https://google.com',
      interval: 60, // seconds
      method: 'GET',
      timeout: 30,
      expectedStatus: 200,
      isActive: true,
      createdAt: new Date('2024-01-01T00:00:00Z'),
      updatedAt: new Date('2024-01-01T00:00:00Z'),
    },
    {
      id: '2',
      name: 'GitHub',
      url: 'https://github.com',
      interval: 120,
      method: 'GET',
      timeout: 30,
      expectedStatus: 200,
      isActive: true,
      createdAt: new Date('2024-01-01T00:00:00Z'),
      updatedAt: new Date('2024-01-01T00:00:00Z'),
    }
  ];
}

if (!globalForData.statusChecksStore) {
  globalForData.statusChecksStore = [
  {
    id: '1',
    monitorId: '1',
    status: 'up',
    responseTime: 245,
    statusCode: 200,
    timestamp: new Date(Date.now() - 60000), // 1 minute ago
    error: null,
  },
  {
    id: '2',
    monitorId: '1',
    status: 'up',
    responseTime: 189,
    statusCode: 200,
    timestamp: new Date(Date.now() - 120000), // 2 minutes ago
    error: null,
  },
  {
    id: '3',
    monitorId: '2',
    status: 'down',
    responseTime: 0,
    statusCode: null,
    timestamp: new Date(Date.now() - 30000), // 30 seconds ago
    error: 'Connection timeout',
  },
  {
    id: '4',
    monitorId: '2',
    status: 'down',
    responseTime: 0,
    statusCode: 500,
    timestamp: new Date(Date.now() - 90000), // 1.5 minutes ago
    error: 'Server error',
  },
  {
    id: '5',
    monitorId: '1',
    status: 'up',
    responseTime: 6500,
    statusCode: 200,
    timestamp: new Date(Date.now() - 180000), // 3 minutes ago
    error: null,
  }
  ];
}

// Reference to the global stores
let monitors = globalForData.monitorsStore;
let statusChecks = globalForData.statusChecksStore;

// Helper functions for data operations
export const MonitorModel = {
  getAll: () => monitors,
  
  getById: (id) => monitors.find(m => m.id === id),
  
  create: (monitorData) => {
    const newMonitor = {
      id: Date.now().toString(),
      ...monitorData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    monitors.push(newMonitor);
    globalForData.monitorsStore = monitors;
    return newMonitor;
  },
  
  update: (id, updateData) => {
    const index = monitors.findIndex(m => m.id === id);
    if (index !== -1) {
      monitors[index] = {
        ...monitors[index],
        ...updateData,
        updatedAt: new Date(),
      };
      globalForData.monitorsStore = monitors;
      return monitors[index];
    }
    return null;
  },
  
  delete: (id) => {
    const index = monitors.findIndex(m => m.id === id);
    if (index !== -1) {
      const deleted = monitors.splice(index, 1)[0];
      // Also delete related status checks
      statusChecks = statusChecks.filter(sc => sc.monitorId !== id);
      globalForData.monitorsStore = monitors;
      globalForData.statusChecksStore = statusChecks;
      return deleted;
    }
    return null;
  }
};

export const StatusCheckModel = {
  getAll: () => statusChecks,
  
  getByMonitorId: (monitorId) => 
    statusChecks.filter(sc => sc.monitorId === monitorId),
  
  getLatestByMonitorId: (monitorId) => 
    statusChecks
      .filter(sc => sc.monitorId === monitorId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0],
  
  create: (checkData) => {
    const newCheck = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      ...checkData,
      timestamp: new Date(),
    };
    statusChecks.push(newCheck);
    
    // Keep only last 100 checks per monitor
    const monitorChecks = statusChecks.filter(sc => sc.monitorId === checkData.monitorId);
    if (monitorChecks.length > 100) {
      const sortedChecks = monitorChecks.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      const checksToRemove = sortedChecks.slice(100);
      statusChecks = statusChecks.filter(sc => 
        !checksToRemove.some(ctr => ctr.id === sc.id)
      );
    }
    
    globalForData.statusChecksStore = statusChecks;
    return newCheck;
  },
  
  getUptimePercentage: (monitorId, hours = 24) => {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
    const recentChecks = statusChecks.filter(sc => 
      sc.monitorId === monitorId && new Date(sc.timestamp) > cutoff
    );
    
    if (recentChecks.length === 0) return 0;
    
    const upChecks = recentChecks.filter(sc => sc.status === 'up').length;
    return (upChecks / recentChecks.length) * 100;
  },
  
  getAverageResponseTime: (monitorId, hours = 24) => {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
    const recentChecks = statusChecks.filter(sc => 
      sc.monitorId === monitorId && 
      new Date(sc.timestamp) > cutoff &&
      sc.status === 'up'
    );
    
    if (recentChecks.length === 0) return 0;
    
    const totalResponseTime = recentChecks.reduce((sum, check) => sum + check.responseTime, 0);
    return Math.round(totalResponseTime / recentChecks.length);
  }
};
