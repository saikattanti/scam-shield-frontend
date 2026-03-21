'use client';

import React, { useEffect, useState } from 'react';
import Map, { Marker, Popup, NavigationControl } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';

interface ThreatPoint {
  id: string;
  riskScore: number;
  category: string;
  type: string;
  time: string;
  lat: number;
  lng: number;
  region: string;
}

export default function ThreatMap() {
  const [threats, setThreats] = useState<ThreatPoint[]>([]);
  const [selectedThreat, setSelectedThreat] = useState<ThreatPoint | null>(null);

  // Use a fallback token strictly for development if mapbox token isn't provided
  // Note: the user must provide their own token for production.
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

  useEffect(() => {
    // Fetch live threats
    const loadThreats = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/map/threats');
        const result = await response.json();
        if (result.success) {
            setThreats(result.data);
        }
      } catch (err) {
        console.error("Could not load threat map data:", err);
      }
    };
    
    loadThreats();
    // Refresh randomly every 15-30 secs to simulate live traffic
    const interval = setInterval(loadThreats, 20000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full relative bg-slate-900 rounded-2xl overflow-hidden shadow-sm border border-slate-200 mt-2 mb-8">
      {/* Map Container */}
      <div className="h-[400px] w-full">
        <Map
          initialViewState={{
            longitude: 78.9629,
            latitude: 22.5937,
            zoom: 3.8
          }}
          mapStyle="mapbox://styles/mapbox/dark-v11"
          mapboxAccessToken={mapboxToken}
          attributionControl={false}
        >
          <NavigationControl position="bottom-right" />

          {threats.map((threat) => (
            <Marker
              key={threat.id}
              longitude={threat.lng}
              latitude={threat.lat}
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                setSelectedThreat(threat);
              }}
            >
              <div 
                className={`w-4 h-4 rounded-full cursor-pointer hover:scale-150 transition-transform ${
                  threat.riskScore > 80 ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)]' : 
                  'bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.8)]'
                } animate-pulse`} 
              />
            </Marker>
          ))}

          {selectedThreat && (
            <Popup
              longitude={selectedThreat.lng}
              latitude={selectedThreat.lat}
              closeOnClick={false}
              onClose={() => setSelectedThreat(null)}
              className="z-50"
              maxWidth="300px"
              focusAfterOpen={false}
            >
              <div className="p-3 bg-white text-slate-800 selection:bg-blue-200 rounded">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                    selectedThreat.riskScore > 80 ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {selectedThreat.riskScore > 80 ? 'CRITICAL' : 'HIGH'}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">#{selectedThreat.id.substring(0,6)}</span>
                </div>
                
                <h3 className="font-bold text-base mb-1 text-slate-900">
                  {selectedThreat.category.replace(/_/g, ' ')}
                </h3>
                
                <div className="space-y-1 mt-3">
                  <p className="text-sm flex justify-between">
                    <span className="text-slate-500">Risk Score:</span>
                    <span className="font-bold">{selectedThreat.riskScore}/100</span>
                  </p>
                  <p className="text-sm flex justify-between">
                    <span className="text-slate-500">Location:</span>
                    <span className="font-medium text-blue-600">{selectedThreat.region}</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-2 text-right">
                    {new Date(selectedThreat.time).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </Popup>
          )}
        </Map>
      </div>
      
      {/* Decorative Overlay */}
      <div className="absolute top-4 left-4 pointer-events-none">
        <div className="bg-slate-900/80 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 shadow-lg">
          <h2 className="font-bold text-white flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            Community Threat Map
          </h2>
          <p className="text-sm text-slate-400 mt-1 flex items-center gap-2">
            <span className="text-emerald-400 font-mono">{threats.length}</span> Active threats tracked in India
          </p>
        </div>
      </div>
      
      {!process.env.NEXT_PUBLIC_MAPBOX_TOKEN && (
        <div className="absolute bottom-4 left-4 z-50 pointer-events-none">
          <div className="bg-amber-500/10 backdrop-blur border border-amber-500/20 text-amber-200 px-3 py-1.5 rounded text-xs">
            Using Development Token - Add NEXT_PUBLIC_MAPBOX_TOKEN to .env.local
          </div>
        </div>
      )}
    </div>
  );
}
