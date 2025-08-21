import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import Request from '@/lib/models/Request';
import { HTTP_STATUS_CODE } from '@/lib/types/apiResponse';

export async function GET() {
  try {
    await dbConnect();

    // Get counts for each status
    const pendingCount = await Request.countDocuments({ status: 'pending' });
    const completedCount = await Request.countDocuments({ status: 'completed' });
    const approvedCount = await Request.countDocuments({ status: 'approved' });
    const rejectedCount = await Request.countDocuments({ status: 'rejected' });
    const totalCount = pendingCount + completedCount + approvedCount + rejectedCount;

    return NextResponse.json({
      counts: {
        pending: pendingCount,
        completed: completedCount,
        approved: approvedCount,
        rejected: rejectedCount,
        total: totalCount
      }
    }, { status: HTTP_STATUS_CODE.OK });

  } catch (error) {
    console.error('Error fetching status counts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR }
    );
  }
}
