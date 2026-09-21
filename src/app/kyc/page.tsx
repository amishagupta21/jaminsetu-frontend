"use client";

import React, { useState } from "react";
import { KYCForm } from "@/components/KYCForm";
import { KYCStatus } from "@/components/KYCStatus";
import { useProperties } from "@/context/PropertyContext";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

export default function KYCPage() {
  const { currentUserKYC } = useProperties();
  const [showForm, setShowForm] = useState(!currentUserKYC);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const faqs = [
    {
      question: "Why do I need to complete KYC?",
      answer: "KYC verification helps us prevent fraud, comply with regulations, and build trust between buyers and sellers on the platform."
    },
    {
      question: "What documents do I need?",
      answer: "You need basic information (name, email, phone), an identity proof (Aadhar, PAN, or Passport), and an address proof (bank statement or utility bill)."
    },
    {
      question: "Is my data safe?",
      answer: "Yes. All data is encrypted, stored securely, and never shared with third parties without your consent. We comply with all data protection laws."
    },
    {
      question: "Can I edit my information after verification?",
      answer: "Yes. You can update your information anytime, but major changes may require re-verification."
    },
    {
      question: "What if my KYC is rejected?",
      answer: "If rejected, we'll provide specific reasons. You can correct the issues and resubmit. Contact our support team if you need help."
    }
  ];

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">KYC Verification</h1>
          <p className="text-slate-600">
            Complete your Know Your Customer verification to unlock booking and negotiation features
          </p>
        </div>

        {/* Current Status */}
        {currentUserKYC && (
          <div className="mb-8">
            <KYCStatus kycData={currentUserKYC} showDetails={true} />
          </div>
        )}

        {/* KYC Form */}
        {showForm && (
          <div className="bg-white rounded-lg border border-slate-200 p-8">
            <KYCForm
              initialData={currentUserKYC || undefined}
              onSubmit={() => {
                setShowForm(false);
              }}
            />
          </div>
        )}

        {/* Status View */}
        {!showForm && currentUserKYC && (
          <div className="bg-white rounded-lg border border-slate-200 p-8">
            <div className="text-center space-y-6">
              <div className="text-6xl">✓</div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">KYC Verification Complete!</h2>
                <p className="text-slate-600 mb-6">
                  You are now verified to book properties and place offers on the BiharLand platform.
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-left">
                <h3 className="font-semibold text-green-900 mb-3">What you can do now:</h3>
                <ul className="space-y-2 text-sm text-green-900">
                  <li className="flex items-center gap-2">
                    <span className="text-lg">✓</span>
                    Book properties with holding deposits
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-lg">✓</span>
                    Make offers and negotiate prices
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-lg">✓</span>
                    Upload and manage property documents
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-lg">✓</span>
                    View transaction history and timelines
                  </li>
                </ul>
              </div>

              <div className="flex gap-4">
                <Link
                  href="/properties"
                  className="flex-1 px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-center"
                >
                  Browse Properties
                </Link>
                <button
                  onClick={() => setShowForm(true)}
                  className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-white transition-colors"
                >
                  Update Information
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Information Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 border border-slate-200">
            <div className="text-3xl mb-3">🛡️</div>
            <h3 className="font-semibold text-slate-900 mb-2">Secure & Safe</h3>
            <p className="text-sm text-slate-600">
              Your personal information is encrypted and stored securely. We follow all data protection regulations.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 border border-slate-200">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="font-semibold text-slate-900 mb-2">Quick Verification</h3>
            <p className="text-sm text-slate-600">
              Most verifications are completed within 24-48 hours. You'll receive email updates on your status.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 border border-slate-200">
            <div className="text-3xl mb-3">✓</div>
            <h3 className="font-semibold text-slate-900 mb-2">Builds Trust</h3>
            <p className="text-sm text-slate-600">
              Your KYC tier is visible to sellers, building confidence in your transaction credibility.
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12 bg-white rounded-lg border border-slate-200 p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-slate-200 rounded-lg">
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                  className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition"
                >
                  <h3 className="font-semibold text-slate-900 text-left">{faq.question}</h3>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-600 transition-transform flex-shrink-0 ml-2 ${
                      expandedFAQ === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {expandedFAQ === index && (
                  <div className="px-4 pb-4 border-t border-slate-200">
                    <p className="text-slate-600 text-sm mt-3">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
