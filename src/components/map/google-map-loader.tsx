'use client';

import React, { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import GoogleMap from './google-map';
import type { Report } from '@/lib/types';

interface GoogleMapLoaderProps {
  reports: Report[];
}

const GoogleMapLoader: React.FC<GoogleMapLoaderProps> = ({ reports }) => {
  const [isApiLoaded, setApiLoaded] = useState(false);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    if (!apiKey) {
      console.error('Firebase API key is not configured.');
      return;
    }

    const scriptId = 'google-maps-script';
    if (window.google && window.google.maps && window.google.maps.marker) {
      setApiLoaded(true);
      return;
    }

    const existingScript = document.getElementById(scriptId);
    if (existingScript) {
      const checkReady = () => {
        if (window.google && window.google.maps && window.google.maps.marker) {
          setApiLoaded(true);
        } else {
          setTimeout(checkReady, 100);
        }
      };
      checkReady();
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=marker&v=beta`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setApiLoaded(true);
    };
    script.onerror = () => {
      console.error('Google Maps script failed to load.');
    };
    document.head.appendChild(script);

    return () => {
      const scriptElement = document.getElementById(scriptId);
      if (scriptElement && scriptElement.parentElement) {
      }
    };
  }, []);

  if (!isApiLoaded) {
    return <Skeleton className="h-full w-full" />;
  }

  return <GoogleMap reports={reports} />;
};

export default GoogleMapLoader;
