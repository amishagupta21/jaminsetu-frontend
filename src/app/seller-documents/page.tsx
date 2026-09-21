"use client";

import React, { useState } from "react";
import { DocumentChecklist } from "@/components/DocumentChecklist";
import { useProperties } from "@/context/PropertyContext";
import Link from "next/link";

export default function SellerDocumentsPage() {
  const { properties, currentUserKYC } = useProperties();
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);

  // Filter properties owned by current seller
  const sellerProperties = currentUserKYC
    ? properties.filter((p) => p.sellerName === currentUserKYC.basicInfo?.name)
    : [];

  if (!currentUserKYC) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-900 mb-6">Seller Document Management</h1>

          <div className="bg-white rounded-lg p-8 text-center space-y-4">
            <div className="text-4xl">🔒</div>
            <h2 className="text-xl font-semibold text-slate-900">KYC Verification Required</h2>
            <p className="text-slate-600">
              Complete KYC verification to access seller features and upload documents.
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

  if (sellerProperties.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-900 mb-6">Seller Document Management</h1>

          <div className="bg-white rounded-lg p-8 text-center space-y-4">
            <div className="text-4xl">📝</div>
            <h2 className="text-xl font-semibold text-slate-900">No Properties Found</h2>
            <p className="text-slate-600">
              You don't have any properties listed yet. List a property to start managing documents.
            </p>
            <Link
              href="/add-property"
              className="inline-block px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              List a Property
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
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Seller Document Management</h1>
          <p className="text-slate-600">Upload and manage documents for your listed properties</p>
        </div>

        {/* Seller Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <div className="flex items-start gap-3">
            <div className="text-3xl">🏠</div>
            <div>
              <p className="font-semibold text-blue-900">Seller Account</p>
              <p className="text-sm text-blue-800">
                Name: <span className="font-medium">{currentUserKYC.basicInfo.name}</span>
              </p>
              <p className="text-sm text-blue-800">
                Properties Listed: <span className="font-medium">{sellerProperties.length}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Properties Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {sellerProperties.map((property) => (
            <button
              key={property.id}
              onClick={() => setSelectedProperty(property.id)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                selectedProperty === property.id
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <p className="font-semibold text-sm mb-1">{property.code}</p>
              <p className="text-xs opacity-75">{property.title}</p>
              <div className="mt-2 text-xs">
                {property.documents?.filter((d) => d.status === "verified").length || 0} / 6 Verified
              </div>
            </button>
          ))}
        </div>

        {/* Document Checklist */}
        {selectedProperty && (
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                {sellerProperties.find((p) => p.id === selectedProperty)?.title}
              </h2>
              <p className="text-slate-600 mt-1">
                {sellerProperties.find((p) => p.id === selectedProperty)?.code}
              </p>
            </div>

            <DocumentChecklist propertyId={selectedProperty} />
          </div>
        )}

        {/* Information Section */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Document Upload Guide</h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                <span className="text-2xl">📄</span>
                Required Documents
              </h3>
              <ul className="space-y-2 text-sm text-slate-700 ml-8">
                <li>• <span className="font-medium">Property Deed/Title Deed</span> - Original title deed proving ownership</li>
                <li>• <span className="font-medium">Khata Certificate</span> - Municipal tax registration certificate</li>
                <li>• <span className="font-medium">Jamabandi Extract</span> - Revenue record from Bihar Bhumi portal</li>
                <li>• <span className="font-medium">3-Year Tax Receipts</span> - Property tax payments for last 3 years</li>
                <li>• <span className="font-medium">Encumbrance Certificate</span> - 30-year search for any legal claims</li>
                <li>• <span className="font-medium">NOC from Authorities</span> - If applicable, clearance certificates</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                <span className="text-2xl">✓</span>
                Verification Process
              </h3>
              <div className="space-y-2 text-sm text-slate-700 ml-8">
                <p><span className="font-medium">1. Submit Documents:</span> Upload scans or photos of your documents</p>
                <p><span className="font-medium">2. Verification:</span> Our team reviews documents within 24-48 hours</p>
                <p><span className="font-medium">3. Approval:</span> Once verified, a green checkmark appears next to the document</p>
                <p><span className="font-medium">4. Buyer Confidence:</span> Verified documents build trust with potential buyers</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                <span className="text-2xl">📋</span>
                Tips for Faster Verification
              </h3>
              <ul className="space-y-2 text-sm text-slate-700 ml-8">
                <li>• Upload clear, high-quality scans or photos of documents</li>
                <li>• Ensure all text is readable and dates are visible</li>
                <li>• Submit all documents together, don't upload one at a time</li>
                <li>• Include both sides of documents if applicable</li>
                <li>• Respond quickly to any clarification requests</li>
              </ul>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-900">
                <span className="font-semibold">Benefits of Verified Documents:</span> Properties with verified documents receive
                more inquiries, sell faster, and command better prices. Buyers are more confident dealing with verified sellers.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Do I need to upload all documents?</h3>
              <p className="text-sm text-slate-700">
                Yes. Buyers expect all 6 documents to be verified before making an offer. Incomplete documentation may result in
                lower offers or fewer inquiries.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Can I upload documents after listing a property?</h3>
              <p className="text-sm text-slate-700">
                Yes. You can upload documents anytime, but we recommend uploading them immediately after listing to attract
                serious buyers.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">What if a document is rejected?</h3>
              <p className="text-sm text-slate-700">
                If rejected, we'll provide specific feedback. You can then upload a corrected version or provide additional
                supporting documents. Contact our support team if you need help.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">How long does verification take?</h3>
              <p className="text-sm text-slate-700">
                Most documents are verified within 24-48 hours. During high volume periods, it may take up to 72 hours. You'll
                receive email notifications when each document is verified.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Can I replace a verified document?</h3>
              <p className="text-sm text-slate-700">
                Yes. You can replace any document anytime. Simply upload a new version and it will go through verification again.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
