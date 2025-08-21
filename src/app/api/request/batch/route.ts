import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import Request from '@/lib/models/Request';
import { HTTP_STATUS_CODE } from '@/lib/types/apiResponse';

export async function PATCH(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { ids, status } = body;

    // Validation
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'Missing or invalid ids array' },
        { status: HTTP_STATUS_CODE.BAD_REQUEST }
      );
    }

    if (!status || !['pending', 'completed', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Missing or invalid status value' },
        { status: HTTP_STATUS_CODE.BAD_REQUEST }
      );
    }

    // Update multiple requests
    const result = await Request.updateMany(
      { _id: { $in: ids } },
      { 
        status,
        lastEditedDate: new Date()
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'No requests found with the provided ids' },
        { status: HTTP_STATUS_CODE.NOT_FOUND }
      );
    }

    return NextResponse.json({
      message: `Successfully updated ${result.modifiedCount} requests`,
      data: {
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount
      }
    }, { status: HTTP_STATUS_CODE.OK });

  } catch (error) {
    console.error('Error batch updating requests:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { ids } = body;

    // Validation
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'Missing or invalid ids array' },
        { status: HTTP_STATUS_CODE.BAD_REQUEST }
      );
    }

    // Delete multiple requests
    const result = await Request.deleteMany({ _id: { $in: ids } });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'No requests found with the provided ids' },
        { status: HTTP_STATUS_CODE.NOT_FOUND }
      );
    }

    return NextResponse.json({
      message: `Successfully deleted ${result.deletedCount} requests`,
      data: {
        deletedCount: result.deletedCount
      }
    }, { status: HTTP_STATUS_CODE.OK });

  } catch (error) {
    console.error('Error batch deleting requests:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR }
    );
  }
}
