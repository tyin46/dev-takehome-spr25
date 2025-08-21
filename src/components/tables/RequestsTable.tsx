import React from "react";
import Dropdown from "@/components/atoms/Dropdown";

interface Request {
  _id: string;
  requestorName: string;
  itemRequested: string;
  createdDate: string;
  lastEditedDate?: string;
  status: "pending" | "completed" | "approved" | "rejected";
}

interface RequestsTableProps {
  requests: Request[];
  onStatusChange: (id: string, status: string) => void;
  selectedRequests: string[];
  onRequestSelect: (id: string) => void;
  onSelectAll: () => void;
}

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800",
  approved: "bg-blue-100 text-blue-800",
  rejected: "bg-red-100 text-red-800",
};

export default function RequestsTable({
  requests,
  onStatusChange,
  selectedRequests,
  onRequestSelect,
  onSelectAll,
}: RequestsTableProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const allSelected = requests.length > 0 && selectedRequests.length === requests.length;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={onSelectAll}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Requestor Name
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Item Requested
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created Date
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Last Edited
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {requests.map((request) => (
            <tr key={request._id} className="hover:bg-gray-50">
              <td className="px-4 py-4 whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={selectedRequests.includes(request._id)}
                  onChange={() => onRequestSelect(request._id)}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {request.requestorName}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                {request.itemRequested}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                {formatDate(request.createdDate)}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                {request.lastEditedDate ? formatDate(request.lastEditedDate) : formatDate(request.createdDate)}
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <Dropdown
                  options={statusOptions}
                  value={request.status}
                  onChange={(status) => onStatusChange(request._id, status)}
                  className="w-32"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile responsive view */}
      <div className="md:hidden space-y-4 mt-4">
        {requests.map((request) => (
          <div key={request._id} className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <input
                type="checkbox"
                checked={selectedRequests.includes(request._id)}
                onChange={() => onRequestSelect(request._id)}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[request.status]}`}>
                {request.status}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{request.requestorName}</p>
              <p className="text-sm text-gray-600">{request.itemRequested}</p>
            </div>
            <div className="text-xs text-gray-500 space-y-1">
              <p>Created: {formatDate(request.createdDate)}</p>
              {request.lastEditedDate && (
                <p>Edited: {formatDate(request.lastEditedDate)}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
              <Dropdown
                options={statusOptions}
                value={request.status}
                onChange={(status) => onStatusChange(request._id, status)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
