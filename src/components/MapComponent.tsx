"use client";

import { useEffect, useRef } from "react";
import { Coordinates, Amenity } from "@/types";
import { MapPin } from "lucide-react";

interface MapComponentProps {
  coordinates?: Coordinates;
  amenities?: Amenity[];
  propertyTitle?: string;
  height?: string;
}

export const MapComponent: React.FC<MapComponentProps> = ({
  coordinates,
  amenities,
  propertyTitle = "Property Location",
  height = "h-96",
}) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current || !coordinates) return;

    // Dynamically load Leaflet
    const loadMap = async () => {
      // Load CSS
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
      document.head.appendChild(link);

      // Load JS
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
      script.onload = () => {
        const L = (window as any).L;

        // Clear previous map
        if (mapRef.current) {
          mapRef.current.innerHTML = "";
        }

        const map = L.map(mapRef.current).setView(
          [coordinates.lat, coordinates.lng],
          14
        );

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 19,
        }).addTo(map);

        // Add property marker
        const propertyMarker = L.marker([coordinates.lat, coordinates.lng], {
          icon: L.icon({
            iconUrl:
              "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png",
            shadowUrl:
              "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
          }),
        }).bindPopup(`<strong>${propertyTitle}</strong>`);
        propertyMarker.addTo(map);

        // Add amenity markers
        if (amenities && amenities.length > 0) {
          amenities.forEach((amenity) => {
            if (amenity.coordinates) {
              const amenityIcon = L.icon({
                iconUrl:
                  "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
                shadowUrl:
                  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41],
              });

              L.marker([amenity.coordinates.lat, amenity.coordinates.lng], {
                icon: amenityIcon,
              })
                .bindPopup(`<strong>${amenity.name}</strong><br/>${amenity.type}`)
                .addTo(map);
            }
          });
        }
      };
      document.body.appendChild(script);
    };

    loadMap();
  }, [coordinates, amenities, propertyTitle]);

  if (!coordinates) {
    return (
      <div className={height + " bg-white rounded-lg border border-slate-200 flex items-center justify-center"}>
        <div className="text-center">
          <MapPin className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-slate-600">Location coordinates not available</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mapRef}
      className={height + " rounded-lg border border-slate-200 overflow-hidden"}
    />
  );
};
