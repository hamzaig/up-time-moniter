import { getDb } from './db';

// MongoDB-backed data access layer
export const MonitorModel = {
  async getAll() {
    const db = await getDb();
    return db.collection('monitors').find({}).sort({ createdAt: -1 }).toArray();
  },

  async getById(id) {
    const db = await getDb();
    return db.collection('monitors').findOne({ id });
  },

  async create(monitorData) {
    const db = await getDb();
    const now = new Date();
    const monitor = {
      id: Date.now().toString(),
      ...monitorData,
      createdAt: now,
      updatedAt: now,
    };
    await db.collection('monitors').insertOne(monitor);
    return monitor;
  },

  async update(id, updateData) {
    const db = await getDb();
    const { value } = await db.collection('monitors').findOneAndUpdate(
      { id },
      { $set: { ...updateData, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );
    return value;
  },

  async delete(id) {
    const db = await getDb();
    await db.collection('statusChecks').deleteMany({ monitorId: id });
    const { value } = await db.collection('monitors').findOneAndDelete({ id });
    return value;
  },
};

export const StatusCheckModel = {
  async getAll() {
    const db = await getDb();
    return db.collection('statusChecks').find({}).toArray();
  },

  async getByMonitorId(monitorId) {
    const db = await getDb();
    return db
      .collection('statusChecks')
      .find({ monitorId })
      .sort({ timestamp: -1 })
      .toArray();
  },

  async getLatestByMonitorId(monitorId) {
    const db = await getDb();
    return db
      .collection('statusChecks')
      .find({ monitorId })
      .sort({ timestamp: -1 })
      .limit(1)
      .next();
  },

  async create(checkData) {
    const db = await getDb();
    const check = {
      id: Date.now().toString() + Math.random().toString(36).slice(2, 11),
      ...checkData,
      timestamp: new Date(),
    };
    await db.collection('statusChecks').insertOne(check);

    // Keep only last 100 checks per monitor
    const excess = await db
      .collection('statusChecks')
      .find({ monitorId: checkData.monitorId })
      .sort({ timestamp: -1 })
      .skip(100)
      .project({ _id: 1 })
      .toArray();
    if (excess.length > 0) {
      await db
        .collection('statusChecks')
        .deleteMany({ _id: { $in: excess.map((d) => d._id) } });
    }

    return check;
  },

  async getUptimePercentage(monitorId, hours = 24) {
    const db = await getDb();
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
    const recentChecks = await db
      .collection('statusChecks')
      .find({ monitorId, timestamp: { $gt: cutoff } })
      .toArray();
    if (recentChecks.length === 0) return 0;
    const upChecks = recentChecks.filter((sc) => sc.status === 'up').length;
    return (upChecks / recentChecks.length) * 100;
  },

  async getAverageResponseTime(monitorId, hours = 24) {
    const db = await getDb();
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
    const recentChecks = await db
      .collection('statusChecks')
      .find({ monitorId, timestamp: { $gt: cutoff }, status: 'up' })
      .toArray();
    if (recentChecks.length === 0) return 0;
    const total = recentChecks.reduce((sum, check) => sum + check.responseTime, 0);
    return Math.round(total / recentChecks.length);
  },
};
