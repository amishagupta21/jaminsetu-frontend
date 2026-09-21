"use client";

import React, { useState } from "react";
import { KYCData } from "@/types";
import { useProperties } from "@/context/PropertyContext";

interface KYCFormProps {
  onSubmit?: (data: KYCData) => void;
  initialData?: Partial<KYCData>;
}

export const KYCForm: React.FC<KYCFormProps> = ({ onSubmit, initialData }) => {
  const { submitKYC } = useProperties();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState<Partial<KYCData>>({
    userId: `user-${Date.now()}`,
    tier: "basic",
    status: "pending",
    basicInfo: {
      name: "",
      email: "",
      phone: "",
      address: "",
    },
    ...initialData,
  });

  const handleBasicInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      basicInfo: {
        ...prev.basicInfo!,
        [name]: value,
      },
    }));
  };

  const handleIdentityProofChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "type") {
      setFormData((prev) => ({
        ...prev,
        identityProof: {
          type: value as any,
          value: prev.identityProof?.value || "",
          documentUrl: prev.identityProof?.documentUrl,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        identityProof: {
          ...prev.identityProof!,
          [name]: value,
        },
      }));
    }
  };

  const handleAddressProofChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "type") {
      setFormData((prev) => ({
        ...prev,
        addressProof: {
          type: value as "bank_statement" | "utility_bill" | "passport",
          documentUrl: prev.addressProof?.documentUrl,
        },
      }));
    }
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "identity" | "address"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        if (field === "identity") {
          setFormData((prev) => ({
            ...prev,
            identityProof: {
              ...prev.identityProof!,
              documentUrl: base64,
            },
          }));
        } else {
          setFormData((prev) => ({
            ...prev,
            addressProof: {
              ...prev.addressProof!,
              documentUrl: base64,
            },
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    const kycData: KYCData = {
      userId: formData.userId!,
      tier: "complete",
      basicInfo: formData.basicInfo!,
      identityProof: formData.identityProof,
      addressProof: formData.addressProof,
      status: "verified", // In real app, would be 'pending' until verified
      verifiedAt: new Date().toISOString(),
    };
    submitKYC(kycData);
    if (onSubmit) {
      onSubmit(kycData);
    }
  };

  const isStep1Valid =
    formData.basicInfo?.name && formData.basicInfo?.email && formData.basicInfo?.phone && formData.basicInfo?.address;
  const isStep2Valid = formData.identityProof?.type && formData.identityProof?.value && formData.identityProof?.documentUrl;
  const isStep3Valid = formData.addressProof?.type && formData.addressProof?.documentUrl;

  return (
    <div className="w-full max-w-2xl mx-auto">
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
            Basic Info
          </span>
          <span className={step >= 2 ? "text-slate-900 font-semibold" : "text-slate-500"}>
            Identity Proof
          </span>
          <span className={step >= 3 ? "text-slate-900 font-semibold" : "text-slate-500"}>
            Address Proof
          </span>
        </div>
      </div>

      {/* Step 1: Basic Information */}
      {step === 1 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">Basic Information</h3>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.basicInfo?.name || ""}
              onChange={handleBasicInfoChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.basicInfo?.email || ""}
              onChange={handleBasicInfoChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.basicInfo?.phone || ""}
              onChange={handleBasicInfoChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              placeholder="Enter your phone number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
            <textarea
              name="address"
              value={formData.basicInfo?.address || ""}
              onChange={handleBasicInfoChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              placeholder="Enter your full address"
              rows={3}
            />
          </div>
        </div>
      )}

      {/* Step 2: Identity Proof */}
      {step === 2 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">Identity Proof</h3>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Identity Type</label>
            <select
              name="type"
              value={formData.identityProof?.type || ""}
              onChange={handleIdentityProofChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
            >
              <option value="">Select identity type</option>
              <option value="aadhar">Aadhar</option>
              <option value="pan">PAN</option>
              <option value="passport">Passport</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {formData.identityProof?.type === "aadhar"
                ? "Aadhar Number"
                : formData.identityProof?.type === "pan"
                  ? "PAN Number"
                  : "Passport Number"}
            </label>
            <input
              type="text"
              name="value"
              value={formData.identityProof?.value || ""}
              onChange={handleIdentityProofChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              placeholder="Enter identity number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Upload Document</label>
            <label className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-slate-900 transition-colors">
              <div className="text-center">
                <svg className="w-8 h-8 mx-auto mb-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <p className="text-sm text-slate-600">Click to upload document</p>
              </div>
              <input
                type="file"
                onChange={(e) => handleFileUpload(e, "identity")}
                className="hidden"
                accept="image/*,.pdf"
              />
            </label>
            {formData.identityProof?.documentUrl && (
              <p className="text-sm text-green-600 mt-2">Document uploaded successfully</p>
            )}
          </div>
        </div>
      )}

      {/* Step 3: Address Proof */}
      {step === 3 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">Address Proof</h3>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Document Type</label>
            <select
              name="type"
              value={formData.addressProof?.type || ""}
              onChange={handleAddressProofChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
            >
              <option value="">Select document type</option>
              <option value="bank_statement">Bank Statement</option>
              <option value="utility_bill">Utility Bill</option>
              <option value="passport">Passport</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Upload Document</label>
            <label className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-slate-900 transition-colors">
              <div className="text-center">
                <svg className="w-8 h-8 mx-auto mb-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <p className="text-sm text-slate-600">Click to upload document</p>
              </div>
              <input
                type="file"
                onChange={(e) => handleFileUpload(e, "address")}
                className="hidden"
                accept="image/*,.pdf"
              />
            </label>
            {formData.addressProof?.documentUrl && (
              <p className="text-sm text-green-600 mt-2">Document uploaded successfully</p>
            )}
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-4 mt-8">
        <button
          onClick={() => setStep((s) => (s > 1 ? (s - 1 as any) : s))}
          disabled={step === 1}
          className="px-6 py-2 bg-black text-white rounded-lg hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
            className="flex-1 px-6 py-2 bg-black text-white rounded-lg hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!isStep3Valid}
            className="flex-1 px-6 py-2 bg-black text-white rounded-lg hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Complete KYC
          </button>
        )}
      </div>
    </div>
  );
};
