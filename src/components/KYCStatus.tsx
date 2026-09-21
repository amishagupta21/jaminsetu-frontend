"use client";

import React from "react";
import { KYCData } from "@/types";

interface KYCStatusProps {
  kycData?: KYCData | null;
  showDetails?: boolean;
}

export const KYCStatus: React.FC<KYCStatusProps> = ({ kycData, showDetails = true }) => {
  if (!kycData) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-sm text-amber-800">
          <span className="font-semibold">KYC Not Completed:</span> You need to complete KYC verification to book properties.
        </p>
      </div>
    );
  }

  const statusColor = {
    pending: "bg-blue-50 border-blue-200 text-blue-800",
    verified: "bg-green-50 border-green-200 text-green-800",
    rejected: "bg-red-50 border-red-200 text-red-800",
  };

  const statusBadgeColor = {
    pending: "bg-blue-100 text-blue-800",
    verified: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };

  const tierLabels = {
    basic: "Basic (Partial)",
    intermediate: "Intermediate (Verified)",
    complete: "Complete (Full Verification)",
  };

  return (
    <div className={`border rounded-lg p-4 ${statusColor[kycData.status]}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-lg">KYC Status</h3>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusBadgeColor[kycData.status]}`}>
              {kycData.status.charAt(0).toUpperCase() + kycData.status.slice(1)}
            </span>
          </div>

          {showDetails && (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="opacity-75">Tier:</span>
                <span className="font-medium">{tierLabels[kycData.tier]}</span>
              </div>

              {kycData.basicInfo && (
                <>
                  <div className="flex justify-between">
                    <span className="opacity-75">Name:</span>
                    <span className="font-medium">{kycData.basicInfo.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-75">Email:</span>
                    <span className="font-medium">{kycData.basicInfo.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-75">Phone:</span>
                    <span className="font-medium">{kycData.basicInfo.phone}</span>
                  </div>
                </>
              )}

              {kycData.verifiedAt && (
                <div className="flex justify-between">
                  <span className="opacity-75">Verified On:</span>
                  <span className="font-medium">{new Date(kycData.verifiedAt).toLocaleDateString()}</span>
                </div>
              )}

              {kycData.rejectionReason && (
                <div className="mt-2 pt-2 border-t border-current border-opacity-20">
                  <p className="text-xs font-semibold mb-1">Rejection Reason:</p>
                  <p className="text-xs">{kycData.rejectionReason}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="ml-4">
          {kycData.status === "verified" && (
            <div className="text-4xl">
              <span className="text-green-600">✓</span>
            </div>
          )}
          {kycData.status === "pending" && (
            <div className="text-4xl">
              <span className="text-blue-600">⧗</span>
            </div>
          )}
          {kycData.status === "rejected" && (
            <div className="text-4xl">
              <span className="text-red-600">✕</span>
            </div>
          )}
        </div>
      </div>

      {kycData.status === "verified" && kycData.tier === "complete" && (
        <div className="mt-4 pt-4 border-t border-current border-opacity-20">
          <p className="text-sm font-medium flex items-center gap-2">
            <span className="text-lg">🔒</span>
            You are verified to make bookings and place offers
          </p>
        </div>
      )}
    </div>
  );
};
