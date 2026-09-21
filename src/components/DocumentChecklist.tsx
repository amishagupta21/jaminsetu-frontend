"use client";

import React, { useState } from "react";
import { Document } from "@/types";
import { useProperties } from "@/context/PropertyContext";

interface DocumentChecklistProps {
  propertyId: string;
  onDocumentUpload?: (document: Document) => void;
}

const REQUIRED_DOCUMENTS = [
  { type: "DeedCertificate", label: "Property Deed/Title Deed", description: "Original title deed of the property" },
  { type: "KhataCertificate", label: "Khata Certificate", description: "Tax registration certificate" },
  { type: "JamabandExtract", label: "Jamabandi Extract", description: "Revenue record from Bihar Bhumi portal" },
  { type: "TaxReceipts", label: "3-Year Tax Receipts", description: "Property tax receipts for last 3 years" },
  { type: "EncumbranceCertificate", label: "Encumbrance Certificate", description: "30-year encumbrance search" },
  { type: "NOCFromAuthorities", label: "NOC from Authorities", description: "If applicable - clearance from government authorities" },
];

export const DocumentChecklist: React.FC<DocumentChecklistProps> = ({ propertyId, onDocumentUpload }) => {
  const { submitDocument, getPropertyDocuments } = useProperties();
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null);
  const documents = getPropertyDocuments(propertyId);

  const getDocumentStatus = (docType: string) => {
    return documents.find((d) => d.type === docType);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, docType: string, docLabel: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        const newDocument: Document = {
          id: `doc-${Date.now()}`,
          name: docLabel,
          type: docType as any,
          status: "pending",
          uploadedAt: new Date().toISOString(),
          documentUrl: base64,
        };
        submitDocument(propertyId, newDocument);
        if (onDocumentUpload) {
          onDocumentUpload(newDocument);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const getStatusBadge = (status: "pending" | "verified" | "rejected") => {
    const badgeClasses = {
      pending: "bg-yellow-100 text-yellow-800",
      verified: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };
    const icons = {
      pending: "⧗",
      verified: "✓",
      rejected: "✕",
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${badgeClasses[status]} flex items-center gap-1`}>
        <span>{icons[status]}</span>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const verifiedCount = documents.filter((d) => d.status === "verified").length;
  const totalCount = REQUIRED_DOCUMENTS.length;

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-slate-900">Document Verification Checklist</h3>
          <span className="text-sm text-slate-600">
            {verifiedCount} / {totalCount} Verified
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div
            className="bg-slate-900 h-2 rounded-full transition-all"
            style={{ width: `${(verifiedCount / totalCount) * 100}%` }}
          />
        </div>
      </div>

      <div className="space-y-2">
        {REQUIRED_DOCUMENTS.map((doc) => {
          const docStatus = getDocumentStatus(doc.type);
          const isExpanded = expandedDoc === doc.type;

          return (
            <div key={doc.type} className="border border-slate-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setExpandedDoc(isExpanded ? null : doc.type)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-white transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="text-2xl">
                    {docStatus?.status === "verified" ? "✓" : docStatus ? "⧗" : "○"}
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-slate-900">{doc.label}</p>
                    <p className="text-sm text-slate-500">{doc.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {docStatus && getStatusBadge(docStatus.status)}
                  <svg
                    className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
              </button>

              {isExpanded && (
                <div className="px-4 py-4 bg-white border-t border-slate-200 space-y-3">
                  {docStatus ? (
                    <div className="space-y-2">
                      <p className="text-sm text-slate-600">
                        <span className="font-medium">Uploaded:</span> {new Date(docStatus.uploadedAt).toLocaleDateString()}
                      </p>
                      {docStatus.verifiedAt && (
                        <p className="text-sm text-slate-600">
                          <span className="font-medium">Verified:</span>{" "}
                          {new Date(docStatus.verifiedAt).toLocaleDateString()}
                        </p>
                      )}
                      {docStatus.feedback && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
                          <p className="text-sm text-yellow-800">
                            <span className="font-medium">Feedback:</span> {docStatus.feedback}
                          </p>
                        </div>
                      )}
                      <button
                        onClick={() =>
                          handleFileUpload(
                            { target: { files: null } } as any,
                            doc.type,
                            doc.label
                          )
                        }
                        className="text-sm text-slate-600 hover:text-slate-900 underline"
                      >
                        Replace Document
                      </button>
                    </div>
                  ) : (
                    <div>
                      <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-slate-900 transition-colors">
                        <div className="text-center">
                          <svg
                            className="w-8 h-8 mx-auto mb-2 text-slate-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                          <p className="text-sm font-medium text-slate-700">Click to upload document</p>
                          <p className="text-xs text-slate-500 mt-1">PDF, JPG, PNG up to 10MB</p>
                        </div>
                        <input
                          type="file"
                          onChange={(e) => handleFileUpload(e, doc.type, doc.label)}
                          className="hidden"
                          accept=".pdf,image/*"
                        />
                      </label>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
        <p className="text-sm text-blue-900">
          <span className="font-semibold">Note:</span> All documents must be verified before finalizing any property transaction.
          Our team will review documents within 24-48 hours.
        </p>
      </div>
    </div>
  );
};
