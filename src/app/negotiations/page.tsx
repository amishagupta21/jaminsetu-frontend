"use client";

import React, { useState } from "react";
import { useProperties } from "@/context/PropertyContext";
import { KYCStatus } from "@/components/KYCStatus";
import Link from "next/link";

export default function NegotiationsPage() {
  const { userNegotiations, properties, currentUserKYC, updateNegotiation } = useProperties();
  const [selectedNeg, setSelectedNeg] = useState<string | null>(null);

  const getPropertyById = (propertyId: string) => {
    return properties.find((p) => p.id === propertyId);
  };

  const handleAcceptOffer = (negId: string) => {
    updateNegotiation(negId, {
      status: "accepted",
      respondedAt: new Date().toISOString(),
    });
  };

  const handleRejectOffer = (negId: string) => {
    updateNegotiation(negId, {
      status: "rejected",
      respondedAt: new Date().toISOString(),
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "expired":
        return "bg-slate-100 text-slate-800";
      case "counter_offered":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return "⧗";
      case "accepted":
        return "✓";
      case "rejected":
        return "✕";
      case "expired":
        return "⏱";
      case "counter_offered":
        return "↔";
      default:
        return "○";
    }
  };

  if (!currentUserKYC) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-900 mb-6">My Offers</h1>

          <div className="bg-white rounded-lg p-8 text-center space-y-4">
            <div className="text-4xl">🔒</div>
            <h2 className="text-xl font-semibold text-slate-900">KYC Verification Required</h2>
            <p className="text-slate-600">
              Complete KYC verification to make offers and negotiate on properties.
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
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">My Offers</h1>
          <p className="text-slate-600">Track all your offers and counter-offers on properties</p>
        </div>

        {/* KYC Status */}
        <div className="mb-8">
          <KYCStatus kycData={currentUserKYC} showDetails={false} />
        </div>

        {/* Negotiations List */}
        {userNegotiations.length > 0 ? (
          <div className="space-y-4">
            {/* Made Offers */}
            {userNegotiations.length > 0 && (
              <>
                <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">Offers Made ({userNegotiations.length})</h2>

                {userNegotiations.map((neg) => {
                  const property = getPropertyById(neg.propertyId);
                  const isExpanded = selectedNeg === neg.id;
                  const discount = ((neg.askingPrice - neg.offeredPrice) / neg.askingPrice * 100).toFixed(1);
                  const isExpired = new Date(neg.validUntil) < new Date();

                  return (
                    <div key={neg.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-slate-200">
                      {/* Offer Header */}
                      <button
                        onClick={() => setSelectedNeg(isExpanded ? null : neg.id)}
                        className="w-full px-6 py-4 hover:bg-slate-50 transition-colors text-left flex items-center justify-between"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-slate-900">Offer #{neg.id.slice(-6)}</h3>
                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(isExpired ? "expired" : neg.status)}`}>
                              {getStatusIcon(isExpired ? "expired" : neg.status)}{" "}
                              {isExpired ? "Expired" : neg.status.charAt(0).toUpperCase() + neg.status.slice(1)}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600">{property?.title}</p>
                          <div className="flex items-center gap-3 mt-2 text-sm">
                            <span className="text-slate-600">
                              Asking: <span className="font-medium text-slate-900">₹ {neg.askingPrice.toLocaleString()}</span>
                            </span>
                            <span className="text-slate-400">→</span>
                            <span className="text-slate-600">
                              Offered: <span className="font-medium text-slate-900">₹ {neg.offeredPrice.toLocaleString()}</span>
                            </span>
                          </div>
                        </div>

                        <div className="text-right mr-4">
                          <p className={`font-bold text-lg ${parseFloat(discount) > 0 ? "text-green-600" : "text-red-600"}`}>
                            {parseFloat(discount) > 0 ? "-" : "+"}{Math.abs(parseFloat(discount))}%
                          </p>
                          <p className="text-xs text-slate-600">
                            {new Date(neg.validUntil).toLocaleDateString()}
                          </p>
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
                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 space-y-4">
                          {/* Price Breakdown */}
                          <div className="bg-white rounded-lg p-4 border border-slate-200">
                            <h4 className="font-semibold text-slate-900 mb-3">Price Details</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-slate-600">Asking Price:</span>
                                <span className="font-medium text-slate-900">₹ {neg.askingPrice.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-600">Your Offer:</span>
                                <span className="font-medium text-slate-900">₹ {neg.offeredPrice.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between border-t border-slate-200 pt-2">
                                <span className="font-medium text-slate-900">Difference:</span>
                                <span className={`font-bold ${parseFloat(discount) > 0 ? "text-green-600" : "text-red-600"}`}>
                                  {parseFloat(discount) > 0 ? "-" : "+"} ₹ {Math.abs(neg.askingPrice - neg.offeredPrice).toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Message */}
                          {neg.message && (
                            <div>
                              <h4 className="font-semibold text-slate-900 mb-2">Your Message</h4>
                              <p className="text-sm text-slate-700 bg-white rounded-lg p-3 border border-slate-200">
                                {neg.message}
                              </p>
                            </div>
                          )}

                          {/* Validity */}
                          <div className="bg-white rounded-lg p-4 border border-slate-200">
                            <p className="text-sm text-slate-700">
                              <span className="font-medium">Offer Valid Until:</span> {new Date(neg.validUntil).toLocaleDateString()}
                            </p>
                            {isExpired && <p className="text-xs text-red-600 mt-1">This offer has expired</p>}
                          </div>

                          {/* Status Message */}
                          {neg.status === "accepted" && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                              <p className="text-sm text-green-900">
                                <span className="font-semibold">✓ Offer Accepted!</span> The seller has accepted your offer. Next step: arrange holding deposit payment.
                              </p>
                            </div>
                          )}
                          {neg.status === "rejected" && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                              <p className="text-sm text-red-900">
                                <span className="font-semibold">✕ Offer Rejected</span> The seller has rejected your offer. You can make a new offer or browse other properties.
                              </p>
                            </div>
                          )}
                          {neg.status === "counter_offered" && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                              <p className="text-sm text-blue-900 mb-2">
                                <span className="font-semibold">↔ Counter Offer Received</span>
                              </p>
                              {neg.counterOfferPrice && (
                                <p className="text-sm text-blue-900">
                                  Seller's counter: <span className="font-bold">₹ {neg.counterOfferPrice.toLocaleString()}</span>
                                </p>
                              )}
                            </div>
                          )}
                          {neg.status === "pending" && !isExpired && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                              <p className="text-sm text-yellow-900">
                                <span className="font-semibold">⧗ Awaiting Response</span> The seller is reviewing your offer. You'll be notified once they respond.
                              </p>
                            </div>
                          )}

                          {/* Action Buttons */}
                          {neg.status === "pending" && !isExpired && (
                            <div className="flex gap-2 pt-4 border-t border-slate-200">
                              <button className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 text-sm font-medium transition-colors">
                                Modify Offer
                              </button>
                              <button className="flex-1 px-4 py-2 bg-red-50 border border-red-200 text-red-700 rounded-lg hover:bg-red-100 text-sm font-medium transition-colors">
                                Withdraw Offer
                              </button>
                            </div>
                          )}
                          {neg.status === "accepted" && (
                            <div className="flex gap-2 pt-4 border-t border-slate-200">
                              <Link
                                href="/bookings"
                                className="flex-1 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 text-sm font-medium transition-colors text-center"
                              >
                                Proceed to Booking
                              </Link>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center space-y-4">
            <div className="text-4xl">💬</div>
            <h2 className="text-xl font-semibold text-slate-900">No Offers Yet</h2>
            <p className="text-slate-600">You haven't made any offers yet. Browse properties and make an offer to start negotiating.</p>
            <Link
              href="/properties"
              className="inline-block px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              Browse Properties
            </Link>
          </div>
        )}

        {/* Tips Section */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Negotiation Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-700">
            <div className="flex gap-2">
              <span className="text-lg">💡</span>
              <div>
                <p className="font-medium">Start with a reasonable offer</p>
                <p className="text-xs text-slate-600">Extremely low offers are more likely to be rejected immediately</p>
              </div>
            </div>
            <div className="flex gap-2">
              <span className="text-lg">💬</span>
              <div>
                <p className="font-medium">Add context in your message</p>
                <p className="text-xs text-slate-600">Explain why you're interested and your intent to proceed quickly</p>
              </div>
            </div>
            <div className="flex gap-2">
              <span className="text-lg">⏱</span>
              <div>
                <p className="font-medium">Be responsive to counter-offers</p>
                <p className="text-xs text-slate-600">Quick responses show you're serious and can lead to quicker deals</p>
              </div>
            </div>
            <div className="flex gap-2">
              <span className="text-lg">📋</span>
              <div>
                <p className="font-medium">Have documents ready</p>
                <p className="text-xs text-slate-600">Sellers prefer buyers who can quickly move to booking phase</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
