"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useProperties } from "@/context/PropertyContext";
import { SellerFormData } from "@/types";
import { convertDecimalToKatha } from "@/utils/converters";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";

export const SellerForm = () => {
  const router = useRouter();
  const { addProperty } = useProperties();
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState<SellerFormData>({
    anchal: "",
    mauza: "",
    thanaNumber: "",
    areaDecimal: 0,
    roadWidth: 0,
    roadType: "Pakka",
    facing: "North",
    khata: "",
    khesra: "",
    jamabandi: "",
    totalPrice: 0,
    sellerName: "",
    sellerPhone: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const ANCHALS = ["Bikramganj", "Sasaram", "Dehri"];
  const MAUZAS: Record<string, string[]> = {
    Bikramganj: ["Tenduni", "Banspatti", "Bikramganj Main"],
    Sasaram: ["Sasaram City", "Sasaram Muffasil", "Sasaram Nagar"],
    Dehri: ["Dehri", "Dehri Industrial"],
  };
  const ROAD_TYPES = ["Pakka", "Soling", "Kachha"];
  const FACINGS = ["North", "South", "East", "West", "Northeast", "Northwest", "Southeast", "Southwest"];

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.anchal) newErrors.anchal = "Anchal is required";
      if (!formData.mauza) newErrors.mauza = "Mauza is required";
      if (!formData.thanaNumber) newErrors.thanaNumber = "Thana number is required";
    } else if (step === 2) {
      if (!formData.areaDecimal || formData.areaDecimal <= 0) newErrors.areaDecimal = "Valid area required";
      if (!formData.roadWidth || formData.roadWidth <= 0) newErrors.roadWidth = "Valid road width required";
      if (!formData.roadType) newErrors.roadType = "Road type is required";
      if (!formData.facing) newErrors.facing = "Facing is required";
    } else if (step === 3) {
      if (!formData.khata) newErrors.khata = "Khata number is required";
      if (!formData.khesra) newErrors.khesra = "Khesra number is required";
      if (!formData.jamabandi) newErrors.jamabandi = "Jamabandi number is required";
    } else if (step === 4) {
      if (!formData.totalPrice || formData.totalPrice <= 0) newErrors.totalPrice = "Valid price required";
      if (!formData.sellerName) newErrors.sellerName = "Name is required";
      if (!formData.sellerPhone) newErrors.sellerPhone = "Phone is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const handleSubmit = () => {
    if (validateStep()) {
      addProperty(formData);
      router.push("/");
    }
  };

  const renderField = (label: string, field: string, type = "text", required = true) => (
    <div key={field}>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={formData[field as keyof SellerFormData]}
        onChange={(e) => handleInputChange(field, e.target.value)}
        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none ${
          errors[field] ? "border-red-500" : "border-slate-300"
        }`}
        placeholder={`Enter ${label.toLowerCase()}`}
      />
      {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]}</p>}
    </div>
  );

  const renderSelect = (label: string, field: string, options: string[], required = true) => (
    <div key={field}>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        value={formData[field as keyof SellerFormData]}
        onChange={(e) => handleInputChange(field, e.target.value)}
        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none ${
          errors[field] ? "border-red-500" : "border-slate-300"
        }`}
      >
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]}</p>}
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm transition ${
                s < step
                  ? "bg-emerald-600 text-white"
                  : s === step
                  ? "bg-emerald-600 text-white ring-2 ring-emerald-400"
                  : "bg-slate-200 text-slate-600"
              }`}
            >
              {s < step ? <Check className="w-5 h-5" /> : s}
            </div>
          ))}
        </div>
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-600 transition-all"
            style={{ width: `${(step - 1) * 33.33}%` }}
          />
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {step === 1 && "Step 1: Location Details"}
          {step === 2 && "Step 2: Land Dimensions"}
          {step === 3 && "Step 3: Revenue Identifiers"}
          {step === 4 && "Step 4: Pricing & Contact"}
        </h2>
        <p className="text-slate-600">
          {step === 1 && "Where is your land located?"}
          {step === 2 && "What are the land specifications?"}
          {step === 3 && "Enter the official Bihar land revenue numbers"}
          {step === 4 && "Final details and asking price"}
        </p>
      </div>

      {/* Step Content */}
      <div className="space-y-4 mb-8">
        {step === 1 && (
          <>
            {renderSelect("Anchal (District Division)", "anchal", ANCHALS)}
            {renderSelect(
              "Mauza (Village)",
              "mauza",
              formData.anchal ? MAUZAS[formData.anchal] || [] : []
            )}
            {renderField("Thana Number", "thanaNumber")}
          </>
        )}

        {step === 2 && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                {renderField("Area (Decimal)", "areaDecimal", "number")}
                {formData.areaDecimal > 0 && (
                  <p className="text-sm text-emerald-600 mt-1">
                    ≈ {convertDecimalToKatha(formData.areaDecimal)} Katha
                  </p>
                )}
              </div>
              {renderField("Road Width (Feet)", "roadWidth", "number")}
            </div>
            {renderSelect("Road Type (Surface)", "roadType", ROAD_TYPES)}
            {renderSelect("Land Facing", "facing", FACINGS)}
          </>
        )}

        {step === 3 && (
          <>
            {renderField("Khata Number", "khata")}
            {renderField("Khesra Number", "khesra")}
            {renderField("Jamabandi Number", "jamabandi")}
          </>
        )}

        {step === 4 && (
          <>
            {renderField("Asking Price (₹)", "totalPrice", "number")}
            {renderField("Your Name", "sellerName")}
            {renderField("Phone Number (+91...)", "sellerPhone")}
            <div className="bg-slate-100 border border-slate-300 rounded-lg p-4 text-sm text-slate-800">
              <p className="font-semibold mb-1">📋 Verification Note</p>
              <p>
                Your property will start at Tier 1 verification. After submitting, our team will contact you
                to verify ownership and conduct physical inspections.
              </p>
            </div>
          </>
        )}
      </div>

      {/* Buttons */}
      <div className="flex justify-between gap-4">
        <button
          onClick={handlePrevious}
          disabled={step === 1}
          className="flex items-center gap-2 px-6 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        {step < 4 ? (
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-2 rounded-lg bg-black text-white font-medium hover:bg-slate-900 transition"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-6 py-2 rounded-lg bg-black text-white font-medium hover:bg-slate-900 transition"
          >
            <Check className="w-4 h-4" />
            List My Property
          </button>
        )}
      </div>
    </div>
  );
};
