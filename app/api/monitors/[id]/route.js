import { NextResponse } from 'next/server';
import { MonitorModel } from '@/lib/models';
import { monitoringService } from '@/lib/monitor-service';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const monitor = MonitorModel.getById(id);
    
    if (!monitor) {
      return NextResponse.json(
        { error: 'Monitor not found' },
        { status: 404 }
      );
    }

    const monitorWithStatus = {
      ...monitor,
      ...monitoringService.getMonitorStatus(id),
    };

    return NextResponse.json(monitorWithStatus);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch monitor' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const existingMonitor = MonitorModel.getById(id);
    if (!existingMonitor) {
      return NextResponse.json(
        { error: 'Monitor not found' },
        { status: 404 }
      );
    }

    // Ensure numeric values are properly converted
    const updateData = {
      ...body,
      interval: body.interval ? Math.max(parseInt(body.interval), 1) : undefined,
      timeout: body.timeout ? parseInt(body.timeout) : undefined,
      expectedStatus: body.expectedStatus ? parseInt(body.expectedStatus) : undefined,
    };
    
    // Update the monitor
    const updatedMonitor = MonitorModel.update(id, updateData);
    
    // Restart monitoring with new settings
    if (updatedMonitor.isActive) {
      monitoringService.restartMonitoring(id);
    } else {
      monitoringService.stopMonitoring(id);
    }

    return NextResponse.json(updatedMonitor);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update monitor' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const monitor = MonitorModel.getById(id);
    if (!monitor) {
      return NextResponse.json(
        { error: 'Monitor not found' },
        { status: 404 }
      );
    }

    // Stop monitoring and delete
    monitoringService.stopMonitoring(id);
    MonitorModel.delete(id);

    return NextResponse.json(
      { message: 'Monitor deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete monitor' },
      { status: 500 }
    );
  }
}
