import React from "react";

interface StatusTabsProps {
  activeStatus: string | null;
  onStatusChange: (status: string | null) => void;
  counts: Record<string, number>;
  totalCount: number;
}

const statusOptions = [
  { value: "all", label: "All", color: "bg-gray-100 text-gray-800" },
  { value: "pending", label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  { value: "completed", label: "Completed", color: "bg-green-100 text-green-800" },
  { value: "approved", label: "Approved", color: "bg-blue-100 text-blue-800" },
  { value: "rejected", label: "Rejected", color: "bg-red-100 text-red-800" },
];

export default function StatusTabs({ activeStatus, onStatusChange, counts, totalCount }: StatusTabsProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {statusOptions.map((status) => {
        const isActive = (activeStatus === null && status.value === "all") || activeStatus === status.value;
        const count = status.value === "all"
          ? totalCount
          : counts[status.value] || 0;

        return (
          <button
            key={status.value}
            onClick={() => onStatusChange(status.value === "all" ? null : status.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? "bg-primary text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <span className="flex items-center gap-2">
              {status.label}
              <span className={`px-2 py-1 rounded-full text-xs ${
                isActive ? "bg-white bg-opacity-20" : status.color
              }`}>
                {count}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
