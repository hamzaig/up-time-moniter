import axios from 'axios';
import { MonitorModel, StatusCheckModel } from './models.js';

class MonitoringService {
  constructor() {
    this.activeChecks = new Map();
  }

  async checkMonitor(monitor) {
    const startTime = Date.now();
    
    try {
      const response = await axios({
        method: monitor.method || 'GET',
        url: monitor.url,
        timeout: (monitor.timeout || 30) * 1000,
        validateStatus: () => true, // Don't throw on any status code
      });

      const responseTime = Date.now() - startTime;
      const expectedStatus = parseInt(monitor.expectedStatus) || 200;
      const isUp = response.status === expectedStatus;

      const statusCheck = {
        monitorId: monitor.id,
        status: isUp ? 'up' : 'down',
        responseTime,
        statusCode: response.status,
        error: isUp ? null : `Expected status ${expectedStatus}, got ${response.status}`,
      };

      return await StatusCheckModel.create(statusCheck);
    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      const statusCheck = {
        monitorId: monitor.id,
        status: 'down',
        responseTime,
        statusCode: null,
        error: error.message,
      };

      return await StatusCheckModel.create(statusCheck);
    }
  }

  startMonitoring(monitor) {
    if (!monitor.isActive) return;

    // Clear any existing interval for this monitor
    this.stopMonitoring(monitor.id);

    // Perform initial check
    this.checkMonitor(monitor);

    // Set up recurring checks
    const intervalId = setInterval(() => {
      this.checkMonitor(monitor);
    }, (monitor.interval || 60) * 1000);

    this.activeChecks.set(monitor.id, intervalId);
    console.log(`Started monitoring ${monitor.name} (${monitor.url}) every ${monitor.interval}s`);
  }

  stopMonitoring(monitorId) {
    const intervalId = this.activeChecks.get(monitorId);
    if (intervalId) {
      clearInterval(intervalId);
      this.activeChecks.delete(monitorId);
      console.log(`Stopped monitoring for monitor ${monitorId}`);
    }
  }

  async startAllMonitors() {
    const monitors = await MonitorModel.getAll();
    monitors.forEach((monitor) => {
      if (monitor.isActive) {
        this.startMonitoring(monitor);
      }
    });
    console.log(`Started monitoring ${monitors.filter((m) => m.isActive).length} active monitors`);
  }

  stopAllMonitors() {
    this.activeChecks.forEach((intervalId) => {
      clearInterval(intervalId);
    });
    this.activeChecks.clear();
    console.log('Stopped all monitoring');
  }

  async restartMonitoring(monitorId) {
    const monitor = await MonitorModel.getById(monitorId);
    if (monitor) {
      this.stopMonitoring(monitorId);
      this.startMonitoring(monitor);
    }
  }

  async getMonitorStatus(monitorId) {
    const [latestCheck, uptimePercentage, averageResponseTime] = await Promise.all([
      StatusCheckModel.getLatestByMonitorId(monitorId),
      StatusCheckModel.getUptimePercentage(monitorId),
      StatusCheckModel.getAverageResponseTime(monitorId),
    ]);
    return {
      isActive: this.activeChecks.has(monitorId),
      latestCheck,
      uptimePercentage,
      averageResponseTime,
    };
  }

  async getAllMonitorStatuses() {
    const monitors = await MonitorModel.getAll();
    const statuses = await Promise.all(
      monitors.map(async (monitor) => ({
        ...monitor,
        ...(await this.getMonitorStatus(monitor.id)),
      }))
    );
    return statuses;
  }
}

// Create a singleton instance
export const monitoringService = new MonitoringService();

// Auto-start monitoring when the module loads (in development)
let monitoringStarted = false;
if (process.env.NODE_ENV === 'development' && !monitoringStarted) {
  // Start monitoring after a short delay to allow the app to initialize
  setTimeout(() => {
    if (!monitoringStarted) {
      monitoringStarted = true;
      monitoringService.startAllMonitors();
    }
  }, 2000);
}
