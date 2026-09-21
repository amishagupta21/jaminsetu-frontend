"use client";

import React, { useState } from "react";
import { useProperties } from "@/context/PropertyContext";
import { KYCStatus } from "@/components/KYCStatus";
import { TransactionTimeline } from "@/components/TransactionTimeline";
import Link from "next/link";

export default function BookingsPage() {
  const { userBookings, properties, currentUserKYC, getPropertyNegotiations } = useProperties();
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);

  const getPropertyById = (propertyId: string) => {
    return properties.find((p) => p.id === propertyId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const getDepositStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-50 border-yellow-200 text-yellow-900";
      case "paid":
        return "bg-green-50 border-green-200 text-green-900";
      case "refunded":
        return "bg-blue-50 border-blue-200 text-blue-900";
      default:
        return "bg-white border-slate-200 text-slate-900";
    }
  };

  if (!currentUserKYC) {
    return (
      <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-900 mb-6">My Bookings</h1>

          <div className="bg-white rounded-lg p-8 text-center space-y-4">
            <div className="text-4xl">🔒</div>
            <h2 className="text-xl font-semibold text-slate-900">KYC Verification Required</h2>
            <p className="text-slate-600">
              Complete KYC verification to view and manage your bookings.
            </p>
            <Link
              href="/kyc"
              className="inline-block px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              Complete KYC Now
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">My Bookings</h1>
          <p className="text-slate-600">Manage your property bookings and holding deposits</p>
        </div>

        {/* KYC Status */}
        <div className="mb-8">
          <KYCStatus kycData={currentUserKYC} showDetails={false} />
        </div>

        {/* Bookings List */}
        {userBookings.length > 0 ? (
          <div className="space-y-4">
            {userBookings.map((booking) => {
              const property = getPropertyById(booking.propertyId);
              const negotiations = getPropertyNegotiations(booking.propertyId);
              const isExpanded = selectedBooking === booking.id;

              return (
                <div key={booking.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-slate-200">
                  {/* Booking Header */}
                  <button
                    onClick={() => setSelectedBooking(isExpanded ? null : booking.id)}
                    className="w-full px-6 py-4 hover:bg-white transition-colors text-left flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-slate-900">Booking #{booking.id.slice(-6)}</h3>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600">{property?.title}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        Booked on {new Date(booking.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="text-right mr-4">
                      <p className="font-bold text-slate-900">₹ {booking.holdingDeposit.toLocaleString()}</p>
                      <p className="text-xs text-slate-600">Holding Deposit</p>
                    </div>

                    <svg
                      className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </button>

                  {/* Expanded Details */}
                  {isExpanded && property && (
                    <div className="px-6 py-4 bg-white border-t border-slate-200 space-y-4">
                      {/* Property Details */}
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-2">Property Details</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-slate-600">Location</p>
                            <p className="font-medium text-slate-900">
                              {property.mauza}, {property.anchal}
                            </p>
                          </div>
                          <div>
                            <p className="text-slate-600">Area</p>
                            <p className="font-medium text-slate-900">
                              {property.areaDecimal} Decimal ({property.areaKatha} Katha)
                            </p>
                          </div>
                          <div>
                            <p className="text-slate-600">Property Price</p>
                            <p className="font-medium text-slate-900">₹ {property.totalPrice.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-slate-600">Road Type</p>
                            <p className="font-medium text-slate-900">{property.roadType}</p>
                          </div>
                        </div>
                      </div>

                      {/* Deposit Status */}
                      <div className={`p-4 rounded-lg border ${getDepositStatusColor(booking.depositStatus)}`}>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-semibold">Holding Deposit Status</p>
                            <p className="text-sm mt-1">
                              {booking.depositStatus === "pending"
                                ? "Please make payment within 48 hours to confirm your booking"
                                : booking.depositStatus === "paid"
                                  ? "Your deposit has been received and verified"
                                  : "Your deposit has been refunded"}
                            </p>
                          </div>
                          <span className="text-2xl">
                            {booking.depositStatus === "paid" ? "✓" : booking.depositStatus === "pending" ? "⧗" : "↶"}
                          </span>
                        </div>
                      </div>

                      {/* Payment Method */}
                      {booking.paymentMethod && (
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-2">Payment Method</h4>
                          <p className="text-sm text-slate-700">
                            {booking.paymentMethod === "bank_transfer"
                              ? "Bank Transfer"
                              : booking.paymentMethod === "upi"
                                ? "UPI Payment"
                                : "Cheque"}
                          </p>
                        </div>
                      )}

                      {/* Possession Date */}
                      {booking.possessionDate && (
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-2">Proposed Possession Date</h4>
                          <p className="text-sm text-slate-700">{new Date(booking.possessionDate).toLocaleDateString()}</p>
                        </div>
                      )}

                      {/* Timeline */}
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-3">Transaction Timeline</h4>
                        <TransactionTimeline booking={booking} negotiations={negotiations} />
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-4 border-t border-slate-200">
                        <button className="flex-1 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 text-sm font-medium transition-colors">
                          View Details
                        </button>
                        {booking.status === "pending" && (
                          <button className="flex-1 px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 text-sm font-medium transition-colors">
                            Cancel Booking
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center space-y-4">
            <div className="text-4xl">📋</div>
            <h2 className="text-xl font-semibold text-slate-900">No Bookings Yet</h2>
            <p className="text-slate-600">You haven't booked any properties yet. Browse available properties to get started.</p>
            <Link
              href="/properties"
              className="inline-block px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              Browse Properties
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
