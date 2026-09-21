"use client";

import React from "react";
import { Booking, Negotiation } from "@/types";

interface TransactionTimelineProps {
  booking?: Booking;
  negotiations?: Negotiation[];
}

export const TransactionTimeline: React.FC<TransactionTimelineProps> = ({ booking, negotiations = [] }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "confirmed":
      case "accepted":
        return "bg-green-100 text-green-800 border-green-300";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-300";
      case "paid":
        return "bg-green-100 text-green-800 border-green-300";
      case "expired":
        return "bg-slate-100 text-slate-800 border-slate-300";
      default:
        return "bg-slate-100 text-slate-800 border-slate-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return "⧗";
      case "confirmed":
      case "accepted":
      case "paid":
        return "✓";
      case "rejected":
      case "cancelled":
        return "✕";
      case "expired":
        return "⏱";
      default:
        return "○";
    }
  };

  return (
    <div className="space-y-6">
      {/* Booking Timeline */}
      {booking && (
        <div className="bg-white rounded-lg p-4">
          <h3 className="font-semibold text-slate-900 mb-4">Booking Timeline</h3>

          <div className="space-y-4">
            {/* Step 1: Offer Made */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center text-lg font-bold">
                  1
                </div>
                <div className="w-1 h-8 bg-slate-300 mt-2" />
              </div>
              <div className="pb-4">
                <p className="font-semibold text-slate-900">Booking Offer Sent</p>
                <p className="text-sm text-slate-600">{new Date(booking.createdAt).toLocaleDateString()}</p>
                <p className="text-xs text-slate-500 mt-1">Your booking request was sent to the seller for approval</p>
              </div>
            </div>

            {/* Step 2: Deposit Status */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${
                    booking.depositStatus === "paid" ? "bg-green-100 text-green-800" : "bg-slate-200 text-slate-600"
                  }`}
                >
                  2
                </div>
                <div className={`w-1 h-8 mt-2 ${booking.depositStatus === "paid" ? "bg-green-300" : "bg-slate-300"}`} />
              </div>
              <div className="pb-4">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-slate-900">Holding Deposit Payment</p>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded border ${getStatusColor(booking.depositStatus)}`}
                  >
                    {getStatusIcon(booking.depositStatus)} {booking.depositStatus.charAt(0).toUpperCase() + booking.depositStatus.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-slate-600">₹ {booking.holdingDeposit.toLocaleString()}</p>
                {booking.depositPaidAt ? (
                  <p className="text-xs text-slate-500 mt-1">Paid on {new Date(booking.depositPaidAt).toLocaleDateString()}</p>
                ) : (
                  <p className="text-xs text-slate-500 mt-1">Awaiting payment confirmation</p>
                )}
              </div>
            </div>

            {/* Step 3: Booking Confirmation */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${
                    booking.status === "confirmed" ? "bg-green-100 text-green-800" : "bg-slate-200 text-slate-600"
                  }`}
                >
                  3
                </div>
                <div className={`w-1 h-8 mt-2 ${booking.status === "confirmed" ? "bg-green-300" : "bg-slate-300"}`} />
              </div>
              <div className="pb-4">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-slate-900">Booking Confirmation</p>
                  <span className={`px-2 py-1 text-xs font-medium rounded border ${getStatusColor(booking.status)}`}>
                    {getStatusIcon(booking.status)} {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Seller approval of your booking request</p>
              </div>
            </div>

            {/* Step 4: Possession */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-lg font-bold">
                  4
                </div>
              </div>
              <div>
                <p className="font-semibold text-slate-900">Possession</p>
                <p className="text-sm text-slate-600">
                  {booking.possessionDate ? new Date(booking.possessionDate).toLocaleDateString() : "To be confirmed"}
                </p>
                <p className="text-xs text-slate-500 mt-1">Property handover to buyer</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Negotiations Timeline */}
      {negotiations.length > 0 && (
        <div className="bg-white rounded-lg p-4">
          <h3 className="font-semibold text-slate-900 mb-4">Negotiation History</h3>

          <div className="space-y-4">
            {negotiations.map((neg) => (
              <div key={neg.id} className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-slate-900">Offer #{neg.id.slice(-6)}</p>
                    <p className="text-sm text-slate-600">{new Date(neg.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded border ${getStatusColor(neg.status)}`}>
                    {getStatusIcon(neg.status)} {neg.status.charAt(0).toUpperCase() + neg.status.slice(1)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-2 text-sm">
                  <div>
                    <p className="text-slate-600">Asking Price</p>
                    <p className="font-bold text-slate-900">₹ {neg.askingPrice.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-slate-600">Your Offer</p>
                    <p className="font-bold text-slate-900">₹ {neg.offeredPrice.toLocaleString()}</p>
                  </div>
                </div>

                {neg.message && (
                  <div className="bg-white rounded p-2 mb-2 text-sm">
                    <p className="text-slate-600">Your Message:</p>
                    <p className="text-slate-900">{neg.message}</p>
                  </div>
                )}

                <div className="flex justify-between items-center text-xs text-slate-600 pt-2 border-t border-slate-200">
                  <span>Valid until {new Date(neg.validUntil).toLocaleDateString()}</span>
                  {neg.response && <span>Response: {neg.response}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!booking && negotiations.length === 0 && (
        <div className="bg-white rounded-lg p-6 text-center">
          <p className="text-slate-600">No transaction history yet</p>
        </div>
      )}
    </div>
  );
};
