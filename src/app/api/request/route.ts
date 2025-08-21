import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import Request from '@/lib/models/Request';
import { HTTP_STATUS_CODE, ResponseType, RESPONSES } from '@/lib/types/apiResponse';
import { PAGINATION_PAGE_SIZE } from '@/lib/constants/config';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const status = searchParams.get('status');

    // Build query
    const query: { status?: string } = {};
    if (status && ['pending', 'completed', 'approved', 'rejected'].includes(status)) {
      query.status = status;
    }

    // Calculate pagination
    const skip = (page - 1) * PAGINATION_PAGE_SIZE;
    
    // Get total count for pagination
    const totalCount = await Request.countDocuments(query);
    const totalPages = Math.ceil(totalCount / PAGINATION_PAGE_SIZE);

    // Get requests with pagination and sorting
    const requests = await Request.find(query)
      .sort({ createdDate: -1 })
      .skip(skip)
      .limit(PAGINATION_PAGE_SIZE)
      .lean();

    return NextResponse.json({
      message: RESPONSES[ResponseType.SUCCESS].message,
      data: requests,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        pageSize: PAGINATION_PAGE_SIZE
      }
    }, { status: HTTP_STATUS_CODE.OK });

  } catch (error) {
    console.error('Error fetching requests:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { requestorName, itemRequested } = body;

    // Validation
    if (!requestorName || !itemRequested) {
      return NextResponse.json(
        { error: 'Missing required fields: requestorName and itemRequested' },
        { status: HTTP_STATUS_CODE.BAD_REQUEST }
      );
    }

    if (requestorName.length < 3 || requestorName.length > 30) {
      return NextResponse.json(
        { error: 'Requestor name must be between 3-30 characters' },
        { status: HTTP_STATUS_CODE.BAD_REQUEST }
      );
    }

    if (itemRequested.length < 2 || itemRequested.length > 100) {
      return NextResponse.json(
        { error: 'Item requested must be between 2-100 characters' },
        { status: HTTP_STATUS_CODE.BAD_REQUEST }
      );
    }

    const now = new Date();
    const newRequest = new Request({
      requestorName,
      itemRequested,
      createdDate: now,
      lastEditedDate: now,
      status: 'pending'
    });

    const savedRequest = await newRequest.save();

    return NextResponse.json(
      { 
        message: RESPONSES[ResponseType.CREATED].message,
        data: savedRequest 
      },
      { status: HTTP_STATUS_CODE.CREATED }
    );

  } catch (error) {
    console.error('Error creating request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { id, status } = body;

    // Validation
    if (!id || !status) {
      return NextResponse.json(
        { error: 'Missing required fields: id and status' },
        { status: HTTP_STATUS_CODE.BAD_REQUEST }
      );
    }

    if (!['pending', 'completed', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: HTTP_STATUS_CODE.BAD_REQUEST }
      );
    }

    // Find and update the request
    const updatedRequest = await Request.findByIdAndUpdate(
      id,
      { 
        status,
        lastEditedDate: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!updatedRequest) {
      return NextResponse.json(
        { error: 'Request not found' },
        { status: HTTP_STATUS_CODE.NOT_FOUND }
      );
    }

    return NextResponse.json({
      message: RESPONSES[ResponseType.SUCCESS].message,
      data: updatedRequest
    }, { status: HTTP_STATUS_CODE.OK });

  } catch (error) {
    console.error('Error updating request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR }
    );
  }
}
