"use client";

import React, { useState } from "react";
import { Property, Negotiation } from "@/types";
import { useProperties } from "@/context/PropertyContext";

interface NegotiationModalProps {
  property: Property;
  onClose: () => void;
  onOfferSubmitted?: (negotiation: Negotiation) => void;
}

export const NegotiationModal: React.FC<NegotiationModalProps> = ({ property, onClose, onOfferSubmitted }) => {
  const { addNegotiation, currentUserKYC } = useProperties();
  const [offeredPrice, setOfferedPrice] = useState(Math.round(property.totalPrice * 0.9)); // Start at 90%
  const [message, setMessage] = useState("");
  const [validityDays, setValidityDays] = useState(7);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const priceDifference = property.totalPrice - offeredPrice;
  const discountPercent = ((priceDifference / property.totalPrice) * 100).toFixed(1);

  const handleSubmitOffer = () => {
    if (!currentUserKYC || currentUserKYC.status !== "verified") {
      alert("Please complete KYC verification before making an offer");
      return;
    }

    setIsSubmitting(true);

    const negotiation: Negotiation = {
      id: `neg-${Date.now()}`,
      propertyId: property.id,
      buyerId: currentUserKYC.userId,
      sellerId: `seller-${property.id}`, // In real app, would be actual seller ID
      askingPrice: property.totalPrice,
      offeredPrice,
      message: message || undefined,
      status: "pending",
      validUntil: new Date(Date.now() + validityDays * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
    };

    addNegotiation(negotiation);
    if (onOfferSubmitted) {
      onOfferSubmitted(negotiation);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
    }, 500);
  };

  const isOfferValid = offeredPrice > 0 && offeredPrice < property.totalPrice;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-slate-900">Make an Offer</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Property Summary */}
          <div className="bg-white rounded-lg p-4">
            <h3 className="font-semibold text-slate-900 mb-3">Property Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Property Code:</span>
                <span className="font-medium">{property.code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Location:</span>
                <span className="font-medium">{property.mauza}, {property.anchal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Area:</span>
                <span className="font-medium">{property.areaDecimal} Decimal</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 mt-2">
                <span className="text-slate-600 font-medium">Asking Price:</span>
                <span className="font-bold text-slate-900">₹ {property.totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Offered Price */}
          <div className="space-y-3">
            <label className="block">
              <span className="text-sm font-medium text-slate-700 mb-2 block">Your Offered Price</span>
              <input
                type="number"
                value={offeredPrice}
                onChange={(e) => setOfferedPrice(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent text-lg"
              />
            </label>

            {/* Price Comparison */}
            <div className={`p-4 rounded-lg ${parseFloat(discountPercent) > 0 ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className={parseFloat(discountPercent) > 0 ? "text-green-700" : "text-red-700"}>
                    Difference:
                  </span>
                  <span className={`font-bold ${parseFloat(discountPercent) > 0 ? "text-green-700" : "text-red-700"}`}>
                    ₹ {Math.abs(priceDifference).toLocaleString()} ({Math.abs(parseFloat(discountPercent))}%)
                  </span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className={parseFloat(discountPercent) > 0 ? "text-green-900" : "text-red-900"}>
                    {parseFloat(discountPercent) > 0 ? "Discount" : "Premium"}:
                  </span>
                  <span className={parseFloat(discountPercent) > 0 ? "text-green-900" : "text-red-900"}>
                    {parseFloat(discountPercent) > 0 ? "-" : "+"}{Math.abs(parseFloat(discountPercent))}%
                  </span>
                </div>
              </div>
            </div>

            {/* Price Slider */}
            <div className="space-y-2">
              <input
                type="range"
                min={Math.round(property.totalPrice * 0.5)}
                max={property.totalPrice}
                step={100000}
                value={offeredPrice}
                onChange={(e) => setOfferedPrice(parseInt(e.target.value))}
                className="w-full accent-slate-900"
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>50% (₹{Math.round(property.totalPrice * 0.5).toLocaleString()})</span>
                <span>100% (₹{property.totalPrice.toLocaleString()})</span>
              </div>
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block">
              <span className="text-sm font-medium text-slate-700 mb-2 block">Message to Seller (Optional)</span>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="e.g., 'I'm a serious buyer ready for quick possession' or 'Can you negotiate on this price?'"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm resize-none"
                rows={3}
              />
            </label>
          </div>

          {/* Validity */}
          <div>
            <label className="block">
              <span className="text-sm font-medium text-slate-700 mb-2 block">Offer Valid For</span>
              <select
                value={validityDays}
                onChange={(e) => setValidityDays(parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              >
                <option value={7}>7 Days</option>
                <option value={15}>15 Days</option>
                <option value={30}>30 Days</option>
              </select>
              <p className="text-xs text-slate-500 mt-1">
                Expires on {new Date(Date.now() + validityDays * 24 * 60 * 60 * 1000).toLocaleDateString()}
              </p>
            </label>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <span className="font-semibold">How it works:</span> Your offer will be sent to the seller. They can accept, reject, or
              make a counter-offer. You'll receive updates via email and SMS.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 border-t border-slate-200">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitOffer}
              disabled={!isOfferValid || isSubmitting}
              className="flex-1 px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isSubmitting ? "Submitting..." : "Submit Offer"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
