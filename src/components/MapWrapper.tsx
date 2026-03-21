"use client";

import React from 'react';
import dynamic from 'next/dynamic';

const ThreatMap = dynamic(() => import('@/components/ThreatMap'), {
  ssr: false,
  loading: () => <div className="h-96 w-full animate-pulse bg-slate-800 rounded-3xl my-8 text-center text-slate-400 flex items-center justify-center">Loading Live Community Map...</div>
});

export default function MapWrapper() {
  return <ThreatMap />;
}
