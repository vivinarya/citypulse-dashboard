'use client';

import React, { useEffect, useRef } from 'react';
import type { Report } from '@/lib/types';
import { MapIcon } from 'lucide-react';

interface GoogleMapProps {
  reports: Report[];
}

const GoogleMap: React.FC<GoogleMapProps> = ({ reports }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  const validReports = reports.filter(
    (report) => report.location?.latitude && report.location?.longitude
  );

  useEffect(() => {
    if (
      !mapRef.current ||
      !window.google ||
      !window.google.maps ||
      !window.google.maps.marker
    ) {
      return;
    }

    if (!mapInstanceRef.current) {
      const defaultCenter =
        validReports.length > 0
          ? {
              lat: validReports[0].location.latitude,
              lng: validReports[0].location.longitude,
            }
          : { lat: 40.7128, lng: -74.0060 }; 

      mapInstanceRef.current = new google.maps.Map(mapRef.current, {
        center: defaultCenter,
        zoom: 12,
        mapId: 'CITYPULSE_MAP', 
      });

      infoWindowRef.current = new google.maps.InfoWindow();
    }
    const map = mapInstanceRef.current;

    markersRef.current.forEach((marker) => (marker.map = null));
    markersRef.current = [];

    validReports.forEach((report) => {
      const marker = new google.maps.marker.AdvancedMarkerElement({
        map,
        position: {
          lat: report.location.latitude,
          lng: report.location.longitude,
        },
        title: report.category,
      });

      marker.addListener('click', () => {
        if (!infoWindowRef.current) return;
        infoWindowRef.current.close();
        infoWindowRef.current.setContent(`
          <div style="color: black; max-width: 250px; padding: 5px;">
            <h3 style="font-weight: bold; margin: 0 0 5px;">${
              report.category
            }</h3>
            <p style="margin: 0 0 5px;">${report.description}</p>
            <p style="font-size: 0.75rem; color: #555; margin: 0;">${
              report.location.address
            }</p>
          </div>
        `);
        infoWindowRef.current.open(map, marker);
      });

      markersRef.current.push(marker);
    });

    if (validReports.length > 0 && map) {
      const bounds = new google.maps.LatLngBounds();
      validReports.forEach((report) => {
        bounds.extend({
          lat: report.location.latitude,
          lng: report.location.longitude,
        });
      });
      map.fitBounds(bounds);

      if (validReports.length === 1) {
        google.maps.event.addListenerOnce(map, 'idle', () => {
          if (map.getZoom()! > 14) {
            map.setZoom(14);
          }
        });
      }
    }
  }, [validReports]);

  if (validReports.length === 0) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center text-center p-4 bg-muted">
        <MapIcon className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold text-muted-foreground">
          No Reports Found
        </h3>
        <p className="text-muted-foreground">
          There are no reports with location data matching your current filter
          criteria.
        </p>
      </div>
    );
  }

  return <div ref={mapRef} style={{ height: '100%', width: '100%' }} />;
};

export default GoogleMap;
