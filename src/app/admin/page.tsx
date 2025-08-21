"use client";

import React, { useState, useEffect } from "react";
import RequestsTable from "@/components/tables/RequestsTable";
import StatusTabs from "@/components/molecules/StatusTabs";
import Pagination from "@/components/molecules/Pagination";
import BatchOperations from "@/components/molecules/BatchOperations";


interface Request {
  _id: string;
  requestorName: string;
  itemRequested: string;
  createdDate: string;
  lastEditedDate?: string;
  status: "pending" | "completed" | "approved" | "rejected";
}

interface ApiResponse {
  data: Request[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    pageSize: number;
  };
}

export default function AdminPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeStatus, setActiveStatus] = useState<string | null>(null);
  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);
  const [statusCounts, setStatusCounts] = useState<{
    pending: number;
    completed: number;
    approved: number;
    rejected: number;
    total: number;
  }>({
    pending: 0,
    completed: 0,
    approved: 0,
    rejected: 0,
    total: 0
  });


  // Fetch requests from API
  const fetchRequests = async (page: number, status?: string | null) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      params.append('page', page.toString());
      if (status) {
        params.append('status', status);
      }

      const response = await fetch(`/api/request?${params}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ApiResponse = await response.json();
      setRequests(data.data);
      
      // Update pagination state
      setCurrentPage(data.pagination.currentPage);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Fetch status counts for tabs
  const fetchStatusCounts = async () => {
    try {
      const response = await fetch('/api/request/status-counts');
      if (response.ok) {
        const data = await response.json();
        setStatusCounts(data.counts);
      }
    } catch (err) {
      console.error('Error fetching status counts:', err);
    }
  };

  // Handle status change for individual request
  const handleRequestStatusChange = async (id: string, newStatus: string) => {
    try {

      
      const response = await fetch('/api/request', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Update local state
      setRequests(prev => 
        prev.map(req => 
          req._id === id 
            ? { ...req, status: newStatus as "pending" | "completed" | "approved" | "rejected", lastEditedDate: new Date().toISOString() }
            : req
        )
      );

      // Refresh status counts
      fetchStatusCounts();
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    }
  };

  // Handle batch operations
  const handleBatchUpdate = async (status: string) => {
    if (selectedRequests.length === 0) return;

    try {
      const response = await fetch('/api/request/batch', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: selectedRequests, status }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Update local state
      setRequests(prev => 
        prev.map(req => 
          selectedRequests.includes(req._id)
            ? { ...req, status: status as "pending" | "completed" | "approved" | "rejected", lastEditedDate: new Date().toISOString() }
            : req
        )
      );

      // Clear selection and refresh data
      setSelectedRequests([]);
      fetchRequests(currentPage, activeStatus);
      fetchStatusCounts();
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to batch update');
    }
  };

  const handleBatchDelete = async () => {
    if (selectedRequests.length === 0) return;

    try {
      const response = await fetch('/api/request/batch', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: selectedRequests }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Clear selection and refresh data
      setSelectedRequests([]);
      fetchRequests(currentPage, activeStatus);
      fetchStatusCounts();
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to batch delete');
    }
  };

  // Handle request selection
  const handleRequestSelect = (id: string) => {
    setSelectedRequests(prev => 
      prev.includes(id) 
        ? prev.filter(reqId => reqId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedRequests.length === requests.length) {
      setSelectedRequests([]);
    } else {
      setSelectedRequests(requests.map(req => req._id));
    }
  };

  // Handle status tab change
  const handleStatusChange = (status: string | null) => {
    setActiveStatus(status);
    setCurrentPage(1);
    setSelectedRequests([]);
    fetchRequests(1, status);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedRequests([]);
    fetchRequests(page, activeStatus);
  };

  // Initial data fetch
  useEffect(() => {
    fetchRequests(1);
    fetchStatusCounts();
  }, []);

  if (loading && requests.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading requests...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Item Requests Admin</h1>
          <p className="mt-2 text-gray-600">
            Manage and track item requests from affected areas
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={() => setError(null)}
                  className="text-red-400 hover:text-red-600"
                >
                  <span className="sr-only">Dismiss</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Status Tabs */}
        <StatusTabs
          activeStatus={activeStatus}
          onStatusChange={handleStatusChange}
          counts={statusCounts}
        />

        {/* Batch Operations */}
        <BatchOperations
          selectedCount={selectedRequests.length}
          onBatchUpdate={handleBatchUpdate}
          onBatchDelete={handleBatchDelete}
          disabled={loading}
        />

        {/* Requests Table */}
        <div className="bg-white rounded-lg shadow">
          <RequestsTable
            requests={requests}
            onStatusChange={handleRequestStatusChange}
            selectedRequests={selectedRequests}
            onRequestSelect={handleRequestSelect}
            onSelectAll={handleSelectAll}
          />
        </div>

        {/* Pagination */}
        {requests.length > 0 && (
          <div className="mt-6 flex justify-center">
            <Pagination
              pageNumber={currentPage}
              pageSize={6}
              totalRecords={statusCounts.total || requests.length}
              onPageChange={handlePageChange}
            />
          </div>
        )}

        {/* Empty State */}
        {!loading && requests.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No requests found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {activeStatus 
                ? `No requests with status "${activeStatus}" found.`
                : "Get started by creating a new request."
              }
            </p>
      </div>
        )}
      </div>
    </div>
  );
}
