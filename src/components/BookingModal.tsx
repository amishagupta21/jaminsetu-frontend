"use client";

import React, { useState } from "react";
import { Property, Booking } from "@/types";
import { useProperties } from "@/context/PropertyContext";

interface BookingModalProps {
  property: Property;
  onClose: () => void;
  onBookingConfirmed?: (booking: Booking) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ property, onClose, onBookingConfirmed }) => {
  const { addBooking, currentUserKYC } = useProperties();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState({
    paymentMethod: "bank_transfer" as "bank_transfer" | "upi" | "check",
    termsAccepted: false,
    possessionDate: "",
  });

  const holdingDeposit = Math.round(property.totalPrice * 0.075); // 7.5%
  const gst = Math.round(holdingDeposit * 0.18); // 18% GST
  const totalWithGST = holdingDeposit + gst;

  const handleBooking = () => {
    if (!currentUserKYC || currentUserKYC.status !== "verified") {
      alert("Please complete KYC verification before booking");
      return;
    }

    const booking: Booking = {
      id: `booking-${Date.now()}`,
      propertyId: property.id,
      buyerId: currentUserKYC.userId,
      amount: property.totalPrice,
      holdingDeposit: totalWithGST,
      depositStatus: "pending",
      paymentMethod: formData.paymentMethod,
      status: "pending",
      createdAt: new Date().toISOString(),
      possessionDate: formData.possessionDate || undefined,
      termsAccepted: formData.termsAccepted,
    };

    addBooking(booking);
    if (onBookingConfirmed) {
      onBookingConfirmed(booking);
    }
    onClose();
  };

  const isStep1Valid = formData.termsAccepted;
  const isStep2Valid = formData.paymentMethod;
  const isStep3Valid = formData.possessionDate;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-slate-900">Book Property</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                      step >= s ? "bg-slate-900 text-white" : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {s}
                  </div>
                  {s < 3 && (
                    <div className={`flex-1 h-1 mx-2 ${step > s ? "bg-slate-900" : "bg-slate-200"}`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className={step >= 1 ? "text-slate-900 font-semibold" : "text-slate-500"}>
                Property & Terms
              </span>
              <span className={step >= 2 ? "text-slate-900 font-semibold" : "text-slate-500"}>
                Payment Method
              </span>
              <span className={step >= 3 ? "text-slate-900 font-semibold" : "text-slate-500"}>
                Possession Date
              </span>
            </div>
          </div>

          {/* Step 1: Property Details & Terms */}
          {step === 1 && (
            <div className="space-y-4">
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
                    <span className="font-medium">{property.areaDecimal} Decimal ({property.areaKatha} Katha)</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-2 mt-2">
                    <span className="text-slate-600 font-medium">Property Price:</span>
                    <span className="font-bold text-slate-900">₹ {property.totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Holding Deposit Breakdown</h4>
                <div className="space-y-1 text-sm text-blue-900">
                  <div className="flex justify-between">
                    <span>Holding Deposit (7.5%):</span>
                    <span className="font-medium">₹ {holdingDeposit.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (18%):</span>
                    <span className="font-medium">₹ {gst.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t border-blue-200 pt-1 mt-1">
                    <span className="font-semibold">Total Holding Deposit:</span>
                    <span className="font-bold">₹ {totalWithGST.toLocaleString()}</span>
                  </div>
                </div>
                <p className="text-xs text-blue-800 mt-2">
                  This holding deposit will be refunded or adjusted towards purchase amount upon cancellation or completion.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-slate-900">Terms & Conditions</h4>
                <div className="bg-white rounded-lg p-3 max-h-40 overflow-y-auto text-sm text-slate-700 space-y-2">
                  <p>• Holding deposit is non-refundable if buyer cancels without valid reason after 7 days</p>
                  <p>• Seller has the right to cancel booking if holding deposit is not paid within 48 hours</p>
                  <p>• All documents must be verified before possession</p>
                  <p>• Buyer agrees to complete KYC and document verification process</p>
                  <p>• Property inspection is buyer's responsibility</p>
                  <p>• Possession date to be mutually agreed upon after booking confirmation</p>
                </div>

                <label className="flex items-start gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-white">
                  <input
                    type="checkbox"
                    checked={formData.termsAccepted}
                    onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                    className="mt-1 w-5 h-5 accent-slate-900"
                  />
                  <span className="text-sm text-slate-700">
                    I agree to the terms and conditions and accept the booking terms
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Step 2: Payment Method */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-900">Select Payment Method</h3>

              {(["bank_transfer", "upi", "check"] as const).map((method) => (
                <label
                  key={method}
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.paymentMethod === method ? "border-slate-900 bg-white" : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    checked={formData.paymentMethod === method}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as any })}
                    className="w-5 h-5 accent-slate-900"
                  />
                  <div className="ml-4">
                    <p className="font-medium text-slate-900">
                      {method === "bank_transfer"
                        ? "Bank Transfer"
                        : method === "upi"
                          ? "UPI Payment"
                          : "Check"}
                    </p>
                    <p className="text-sm text-slate-600 mt-1">
                      {method === "bank_transfer"
                        ? "Direct bank transfer - payment reference will be required"
                        : method === "upi"
                          ? "Instant UPI payment - fastest option"
                          : "Cheque deposit - cheque must be post-dated to possession date"}
                    </p>
                  </div>
                </label>
              ))}

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                <p className="text-sm text-yellow-900">
                  <span className="font-semibold">Note:</span> Payment receipt will be sent immediately after confirmation. Keep it safe for
                  reference.
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Possession Date */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-900">Expected Possession Date</h3>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  When do you plan to take possession?
                </label>
                <input
                  type="date"
                  value={formData.possessionDate}
                  onChange={(e) => setFormData({ ...formData, possessionDate: e.target.value })}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                />
                <p className="text-sm text-slate-600 mt-1">
                  This is a tentative date. Final possession date will be mutually agreed upon.
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 space-y-2">
                <h4 className="font-semibold text-slate-900">Booking Summary</h4>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Holding Deposit:</span>
                    <span className="font-medium">₹ {totalWithGST.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Method:</span>
                    <span className="font-medium">
                      {formData.paymentMethod === "bank_transfer"
                        ? "Bank Transfer"
                        : formData.paymentMethod === "upi"
                          ? "UPI"
                          : "Check"}
                    </span>
                  </div>
                  {formData.possessionDate && (
                    <div className="flex justify-between">
                      <span>Proposed Possession:</span>
                      <span className="font-medium">{new Date(formData.possessionDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-900">
                  <span className="font-semibold">Ready to confirm?</span> Your booking will be sent to the seller for approval. You'll receive updates via email and SMS.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-8 pt-6 border-t border-slate-200">
            <button
              onClick={() => setStep((s) => (s > 1 ? (s - 1 as any) : s))}
              disabled={step === 1}
              className="px-6 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            {step < 3 ? (
              <button
                onClick={() => {
                  if (step === 1 && isStep1Valid) setStep(2);
                  if (step === 2 && isStep2Valid) setStep(3);
                }}
                disabled={step === 1 ? !isStep1Valid : !isStep2Valid}
                className="flex-1 px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleBooking}
                disabled={!isStep3Valid}
                className="flex-1 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Confirm Booking
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
