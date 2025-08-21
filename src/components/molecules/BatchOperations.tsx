import React, { useState } from "react";
import Button from "@/components/atoms/Button";
import Dropdown from "@/components/atoms/Dropdown";

interface BatchOperationsProps {
  selectedCount: number;
  onBatchUpdate: (status: string) => void;
  onBatchDelete: () => void;
  disabled?: boolean;
}

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

export default function BatchOperations({
  selectedCount,
  onBatchUpdate,
  onBatchDelete,
  disabled = false,
}: BatchOperationsProps) {
  const [selectedStatus, setSelectedStatus] = useState("pending");
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  if (selectedCount === 0) return null;

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="text-sm text-gray-700">
          <span className="font-medium">{selectedCount}</span> request{selectedCount !== 1 ? "s" : ""} selected
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Set status to:</span>
            <Dropdown
              options={statusOptions}
              value={selectedStatus}
              onChange={setSelectedStatus}
              className="w-32"
            />
            <Button
              onClick={() => onBatchUpdate(selectedStatus)}
              disabled={disabled}
              className="w-auto px-4"
            >
              Update
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="inverted"
              onClick={() => setShowConfirmDelete(true)}
              disabled={disabled}
              className="w-auto px-4"
            >
              Delete Selected
            </Button>
          </div>
        </div>
      </div>

      {/* Confirmation modal for delete */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Deletion</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete {selectedCount} selected request{selectedCount !== 1 ? "s" : ""}? 
              This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="inverted"
                onClick={() => setShowConfirmDelete(false)}
                className="w-auto px-4"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  onBatchDelete();
                  setShowConfirmDelete(false);
                }}
                className="w-auto px-4 bg-red-600 border-red-600 hover:bg-white hover:text-red-600"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
