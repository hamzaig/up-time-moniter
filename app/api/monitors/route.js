import { NextResponse } from 'next/server';
import { MonitorModel } from '@/lib/models';
import { monitoringService } from '@/lib/monitor-service';

export async function GET() {
  try {
    const monitors = await monitoringService.getAllMonitorStatuses();
    return NextResponse.json(monitors);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch monitors' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.url) {
      return NextResponse.json(
        { error: 'Name and URL are required' },
        { status: 400 }
      );
    }

    // Create the monitor
    const newMonitor = await MonitorModel.create({
      name: body.name,
      url: body.url,
      interval: Math.max(parseInt(body.interval) || 60, 1),
      method: body.method || 'GET',
      timeout: parseInt(body.timeout) || 30,
      expectedStatus: parseInt(body.expectedStatus) || 200,
      isActive: body.isActive !== false, // Default to true
    });

    // Start monitoring if active
    if (newMonitor.isActive) {
      monitoringService.startMonitoring(newMonitor);
    }

    return NextResponse.json(newMonitor, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create monitor' },
      { status: 500 }
    );
  }
}
