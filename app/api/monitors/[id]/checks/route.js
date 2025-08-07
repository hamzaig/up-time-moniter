import { NextResponse } from 'next/server';
import { StatusCheckModel } from '@/lib/models';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 50;
    
    const checks = StatusCheckModel.getByMonitorId(id)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);

    return NextResponse.json(checks);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch status checks' },
      { status: 500 }
    );
  }
}
