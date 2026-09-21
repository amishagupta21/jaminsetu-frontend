"use client";

import React, { useState } from "react";
import { Property } from "@/types";
import { VerificationStepper } from "./VerificationStepper";
import { MapComponent } from "./MapComponent";
import { AmenitiesSection } from "./AmenitiesSection";
import { RatingDisplay } from "./RatingDisplay";
import { RatingForm } from "./RatingForm";
import { BookingModal } from "./BookingModal";
import { NegotiationModal } from "./NegotiationModal";
import { FileText, MapPin, Ruler, Download, MessageCircle, Calendar, ShoppingCart, Zap } from "lucide-react";
import { formatPrice, formatPriceDetailed, generateWhatsAppLink } from "@/utils/converters";

interface LandPassportDossierProps {
  property: Property;
}

export const LandPassportDossier: React.FC<LandPassportDossierProps> = ({ property }) => {
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showNegotiationModal, setShowNegotiationModal] = useState(false);
  const whatsappLink = generateWhatsAppLink(property);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Content - 2/3 width */}
      <div className="lg:col-span-2 space-y-6">
        {/* Hero Gallery */}
        <div className="bg-white rounded-lg overflow-hidden border border-slate-200">
          <div className="relative h-96 bg-gradient-to-br from-slate-200 to-slate-300">
            <img
              src={property.images[0]}
              alt="Property frontage"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/10" />
          </div>

          {/* Thumbnails */}
          <div className="p-4 flex gap-2 overflow-x-auto">
            {property.images.map((img, idx) => (
              <div key={idx} className="flex-shrink-0">
                <img
                  src={img}
                  alt={`Gallery ${idx}`}
                  className="w-16 h-16 rounded object-cover border border-slate-200 cursor-pointer hover:border-emerald-600 transition"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Official Land Passport */}
        <div className="bg-white rounded-lg border-2 border-slate-900 p-6">
          <div className="text-center mb-6 pb-4 border-b-2 border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900">OFFICIAL BIHAR LAND PASSPORT</h2>
            <p className="text-xs text-slate-600 mt-1">(Cross-referenced with Bihar Bhumi records)</p>
            <p className="text-sm font-mono text-slate-700 mt-2 bg-slate-50 inline-block px-3 py-1 rounded">
              {property.code}
            </p>
          </div>

          {/* Revenue Identifiers Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div className="border-2 border-slate-300 rounded-lg p-4 bg-slate-50">
              <div className="text-xs font-semibold text-slate-600 uppercase">Khata Number</div>
              <div className="text-2xl font-bold text-slate-900 mt-1">{property.khata}</div>
            </div>
            <div className="border-2 border-slate-300 rounded-lg p-4 bg-slate-50">
              <div className="text-xs font-semibold text-slate-600 uppercase">Khesra Number</div>
              <div className="text-2xl font-bold text-slate-900 mt-1">{property.khesra}</div>
            </div>
            <div className="border-2 border-slate-300 rounded-lg p-4 bg-slate-50">
              <div className="text-xs font-semibold text-slate-600 uppercase">Jamabandi No</div>
              <div className="text-2xl font-bold text-slate-900 mt-1">{property.jamabandi}</div>
            </div>
            <div className="border-2 border-slate-300 rounded-lg p-4 bg-slate-50">
              <div className="text-xs font-semibold text-slate-600 uppercase">Mauza</div>
              <div className="text-xl font-bold text-slate-900 mt-1">{property.mauza}</div>
            </div>
            <div className="border-2 border-slate-300 rounded-lg p-4 bg-slate-50">
              <div className="text-xs font-semibold text-slate-600 uppercase">Anchal</div>
              <div className="text-xl font-bold text-slate-900 mt-1">{property.anchal}</div>
            </div>
            <div className="border-2 border-slate-300 rounded-lg p-4 bg-slate-50">
              <div className="text-xs font-semibold text-slate-600 uppercase">Thana</div>
              <div className="text-2xl font-bold text-slate-900 mt-1">{property.thanaNumber}</div>
            </div>
          </div>

          {/* Property Specifications */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t-2 border-slate-300">
            <div className="p-3">
              <div className="text-xs font-semibold text-slate-600">ROAD WIDTH</div>
              <div className="text-lg font-bold text-slate-900 mt-1">{property.roadWidth} Feet</div>
            </div>
            <div className="p-3">
              <div className="text-xs font-semibold text-slate-600">ROAD TYPE</div>
              <div className="text-lg font-bold text-slate-900 mt-1">{property.roadType}</div>
            </div>
            <div className="p-3">
              <div className="text-xs font-semibold text-slate-600">FACING</div>
              <div className="text-lg font-bold text-slate-900 mt-1">{property.facing}</div>
            </div>
            <div className="p-3">
              <div className="text-xs font-semibold text-slate-600">POSSESSION</div>
              <div className="text-lg font-bold text-slate-900 mt-1">Pegged</div>
            </div>
            <div className="p-3">
              <div className="text-xs font-semibold text-slate-600">AREA (KATHA)</div>
              <div className="text-lg font-bold text-slate-900 mt-1">{property.areaKatha}</div>
            </div>
            <div className="p-3">
              <div className="text-xs font-semibold text-slate-600">AREA (DECIMAL)</div>
              <div className="text-lg font-bold text-slate-900 mt-1">{property.areaDecimal}</div>
            </div>
          </div>
        </div>

        {/* Verification Stepper */}
        <VerificationStepper property={property} />

        {/* Map Section */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Property Location
          </h3>
          <MapComponent
            coordinates={property.coordinates}
            propertyTitle={property.title}
            amenities={property.amenities}
          />
        </div>

        {/* Amenities Section */}
        {property.amenities && property.amenities.length > 0 && (
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Nearby Amenities</h3>
            <AmenitiesSection amenities={property.amenities} />
          </div>
        )}

        {/* Ratings & Reviews */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Property Ratings</h3>
            <RatingDisplay rating={property.rating} showReviews={true} />
          </div>

          {/* Rating Form */}
          <RatingForm propertyId={property.id} />
        </div>

        {/* Document Vault */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Cadastral Map & Document Vault
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div>
                <p className="font-semibold text-slate-900 text-sm">Jamabandi Extract (Online Match)</p>
                <p className="text-xs text-slate-600">verified against Bihar Bhumi portal</p>
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium text-sm transition">
                View PDF
              </button>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div>
                <p className="font-semibold text-slate-900 text-sm">Field Inspection Report</p>
                <p className="text-xs text-slate-600">Physical verification & measurements</p>
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium text-sm transition">
                View PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - 1/3 width */}
      <div className="space-y-4">
        {/* Price Card */}
        <div className="bg-slate-50 border-2 border-slate-700 rounded-lg p-6">
          <div className="text-sm text-slate-700 font-semibold">ASKING PRICE</div>
          <div className="text-4xl font-bold text-slate-900 mt-2">{formatPrice(property.totalPrice)}</div>
          <div className="mt-4 pt-4 border-t border-slate-200">
            <div className="text-sm text-slate-600">Per Katha</div>
            <div className="text-2xl font-bold text-slate-900">{formatPrice(property.pricePerKatha)}</div>
          </div>
          <div className="mt-4 pt-4 border-t border-emerald-200 text-sm">
            <div className="text-slate-600">Area: {property.areaKatha} Katha ({property.areaDecimal} Dec)</div>
            <div className="text-slate-600 mt-1">Status: <span className="font-bold text-emerald-700">{property.status}</span></div>
          </div>
        </div>

        {/* Verification Badge */}
        <div className={`rounded-lg p-6 ${property.verificationTier >= 3 ? "bg-emerald-50 border-2 border-emerald-600" : "bg-slate-100 border-2 border-slate-600"}`}>
          <div className={`text-2xl font-bold ${property.verificationTier >= 3 ? "text-emerald-700" : "text-slate-700"}`}>
            🟢 TIER {property.verificationTier}
          </div>
          <div className={`text-sm font-semibold mt-2 ${property.verificationTier >= 3 ? "text-emerald-700" : "text-slate-700"}`}>
            {property.verificationTier === 1 && "Pending Verification"}
            {property.verificationTier === 2 && "In Progress"}
            {property.verificationTier === 3 && "Site & Mutation Verified"}
            {property.verificationTier === 4 && "Full Title Search Completed"}
          </div>
        </div>

        {/* Security Commitments */}
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h4 className="font-semibold text-slate-900 mb-3">🛡️ Platform Commitments</h4>
          <ul className="space-y-2 text-sm text-slate-700">
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>Zero advance money held</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>Identity masking enabled</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>Physical check completed</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>Revenue records verified</span>
            </li>
          </ul>
        </div>

        {/* CTA Buttons */}
        {/* PHASE 2: Book Now Button */}
        <button
          onClick={() => setShowBookingModal(true)}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-4 rounded-lg transition flex items-center justify-center gap-2"
        >
          <ShoppingCart className="w-5 h-5" />
          Book Property
        </button>

        {/* PHASE 2: Make Offer Button */}
        <button
          onClick={() => setShowNegotiationModal(true)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-4 rounded-lg transition flex items-center justify-center gap-2"
        >
          <Zap className="w-5 h-5" />
          Make an Offer
        </button>

        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-black hover:bg-slate-900 text-white font-bold py-4 px-4 rounded-lg transition flex items-center justify-center gap-2"
        >
          <MessageCircle className="w-5 h-5" />
          Inquire on WhatsApp
        </a>

        <button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2">
          <Calendar className="w-5 h-5" />
          Request Site Visit
        </button>

        <button className="w-full bg-black hover:bg-slate-900 text-white font-bold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2">
          <Download className="w-5 h-5" />
          Print Land Dossier
        </button>

        {/* Seller Info (Masked) */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm">
          <div className="text-xs font-semibold text-slate-600 uppercase mb-2">Seller Information</div>
          <div className="text-slate-700 space-y-1">
            <div>
              <span className="text-slate-600">Name:</span> <span className="font-semibold">{property.sellerName}</span>
            </div>
            <div>
              <span className="text-slate-600">Phone:</span> <span className="font-mono font-semibold">{property.sellerPhoneMasked}</span>
            </div>
            <div>
              <span className="text-slate-600">Category:</span> <span className="font-semibold">{property.sellerCategory}</span>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3 italic">
            Contact via WhatsApp button above to connect with seller securely.
          </p>
        </div>
      </div>

      {/* PHASE 2: Booking Modal */}
      {showBookingModal && <BookingModal property={property} onClose={() => setShowBookingModal(false)} />}

      {/* PHASE 2: Negotiation Modal */}
      {showNegotiationModal && <NegotiationModal property={property} onClose={() => setShowNegotiationModal(false)} />}
    </div>
  );
};
