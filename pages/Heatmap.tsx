import React, { useEffect, useRef, useState } from 'react';
import { getTickets } from '../services/dbService';
import { Ticket, Severity } from '../types';

// We use the global L variable from the script tag in index.html
declare const L: any;

const Heatmap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const routeLayerGroup = useRef<any>(null);
  const markersLayerGroup = useRef<any>(null);

  const [startLoc, setStartLoc] = useState('');
  const [endLoc, setEndLoc] = useState('');
  const [isRouting, setIsRouting] = useState(false);
  const [routeInfo, setRouteInfo] = useState<{
    distance: string;
    duration: string;
    issuesFound: number;
    issues: Ticket[];
  } | null>(null);
  const [showPanel, setShowPanel] = useState(false);

  // Initial Map Setup
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current).setView([12.9716, 77.5946], 13);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    mapInstance.current = map;
    routeLayerGroup.current = L.layerGroup().addTo(map);
    markersLayerGroup.current = L.layerGroup().addTo(map);

    refreshMarkers();

    // Fix map resize issues when loading
    setTimeout(() => {
        map.invalidateSize();
    }, 100);
  }, []);

  const refreshMarkers = () => {
      if (!mapInstance.current || !markersLayerGroup.current) return;
      
      markersLayerGroup.current.clearLayers();
      const tickets = getTickets();
      
      const severityColors: any = {
        [Severity.LOW]: '#22c55e', // green-500
        [Severity.MEDIUM]: '#facc15', // yellow-400
        [Severity.HIGH]: '#f97316', // orange-500
        [Severity.EMERGENCY]: '#ef4444' // red-500
      };

      tickets.forEach(ticket => {
        let { lat, lng } = ticket.location;
        // Jitter for demo if 0,0 (handles legacy mock data)
        if (lat === 0 && lng === 0) {
            lat = 12.9716 + (Math.random() - 0.5) * 0.05;
            lng = 77.5946 + (Math.random() - 0.5) * 0.05;
        }

        L.circleMarker([lat, lng], {
            radius: 8,
            fillColor: severityColors[ticket.severity] || 'blue',
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
        })
        .bindPopup(`
            <div class="min-w-[150px]">
                <h3 class="font-bold text-sm">${ticket.title}</h3>
                <span class="text-xs px-2 py-0.5 rounded-full text-white bg-slate-500" style="background-color: ${severityColors[ticket.severity]}">${ticket.severity}</span>
                <p class="text-xs text-slate-500 mt-1 truncate">${ticket.description}</p>
                <a href="#/ticket/${ticket.id}" class="text-blue-600 text-xs font-bold mt-1 block">View Details</a>
            </div>
        `)
        .addTo(markersLayerGroup.current);
      });
  };

  // Helper: Haversine Distance in Kilometers
  const getDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; 
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const geocode = async (query: string): Promise<[number, number] | null> => {
    try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data && data.length > 0) {
            return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
        }
    } catch (e) {
        console.error("Geocoding failed", e);
    }
    return null;
  };

  const handleLiveLocation = () => {
      if (navigator.geolocation) {
          setStartLoc("Getting location...");
          navigator.geolocation.getCurrentPosition(async (pos) => {
              const { latitude, longitude } = pos.coords;
              try {
                  const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                  const data = await res.json();
                  setStartLoc(data.display_name || `${latitude}, ${longitude}`);
              } catch {
                  setStartLoc(`${latitude}, ${longitude}`);
              }
          }, (err) => {
              alert("Could not get location. Ensure permissions are granted.");
              setStartLoc("");
          });
      } else {
          alert("Geolocation not supported by this browser.");
      }
  };

  const handleGetDirections = async () => {
      if (!startLoc || !endLoc) return;
      setIsRouting(true);
      setRouteInfo(null);
      if (routeLayerGroup.current) routeLayerGroup.current.clearLayers();

      try {
          // 1. Geocode both locations
          const startCoords = await geocode(startLoc);
          const endCoords = await geocode(endLoc);

          if (!startCoords || !endCoords) {
              alert("Could not find one of the locations. Please check the spelling.");
              setIsRouting(false);
              return;
          }

          // 2. Route (OSRM Public API)
          // OSRM expects lon,lat format
          const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${startCoords[1]},${startCoords[0]};${endCoords[1]},${endCoords[0]}?overview=full&geometries=geojson`;
          const routeRes = await fetch(osrmUrl);
          const routeData = await routeRes.json();

          if (!routeData.routes || routeData.routes.length === 0) {
              alert("No route found between these locations.");
              setIsRouting(false);
              return;
          }

          const route = routeData.routes[0];
          const geometry = route.geometry.coordinates; // GeoJSON is [lon, lat]
          
          // Convert to [lat, lon] for Leaflet
          const latLngs = geometry.map((coord: any) => [coord[1], coord[0]]);

          // 3. Draw Route
          const polyline = L.polyline(latLngs, { color: '#3b82f6', weight: 6, opacity: 0.8 }).addTo(routeLayerGroup.current);
          mapInstance.current.fitBounds(polyline.getBounds(), { padding: [50, 50] });

          // 4. Check Intersections with Issues
          const tickets = getTickets();
          const issuesOnRoute: Ticket[] = [];
          
          tickets.forEach(t => {
              // Optimization: Check if ticket is vaguely within the route bounds first
              if (polyline.getBounds().contains([t.location.lat, t.location.lng])) {
                   // Precise check: distance to any point on the route
                   let minD = Infinity;
                   for (const pt of latLngs) {
                       const d = getDistanceKm(t.location.lat, t.location.lng, pt[0], pt[1]);
                       if (d < minD) minD = d;
                   }
                   // If issue is within 100 meters of the road
                   if (minD < 0.1) { 
                       issuesOnRoute.push(t);
                   }
              }
          });

          setRouteInfo({
              distance: (route.distance / 1000).toFixed(1) + ' km',
              duration: (route.duration / 60).toFixed(0) + ' min',
              issuesFound: issuesOnRoute.length,
              issues: issuesOnRoute
          });

          // Highlight found issues visually
          issuesOnRoute.forEach(t => {
              L.circleMarker([t.location.lat, t.location.lng], {
                  radius: 15,
                  color: 'red',
                  fillColor: 'transparent',
                  weight: 2,
                  dashArray: '5, 5'
              }).addTo(routeLayerGroup.current);
          });

      } catch (e) {
          console.error(e);
          alert("Error getting directions. Please try again.");
      } finally {
          setIsRouting(false);
      }
  };

  return (
    <div className="h-[calc(100vh-64px)] w-full relative">
        <div ref={mapRef} className="w-full h-full z-0" />
        
        {/* Directions Control Panel */}
        <div className="absolute top-4 left-4 z-[400] flex flex-col gap-2">
            <button 
                onClick={() => setShowPanel(!showPanel)}
                className="bg-white text-slate-800 px-4 py-2 rounded-lg shadow-lg font-bold flex items-center gap-2 hover:bg-slate-50 transition-colors border border-slate-200"
            >
                <i className={`fa-solid ${showPanel ? 'fa-map' : 'fa-diamond-turn-right'}`}></i>
                {showPanel ? 'Hide Directions' : 'Get Directions'}
            </button>
            
            {showPanel && (
                <div className="bg-white p-4 rounded-lg shadow-xl w-80 animate-fadeIn border border-slate-200">
                    <div className="space-y-3">
                        <div className="relative">
                            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 mb-1 block">Start Location</label>
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    value={startLoc}
                                    onChange={(e) => setStartLoc(e.target.value)}
                                    placeholder="Enter location"
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                                />
                                <button 
                                    onClick={handleLiveLocation}
                                    className="px-3 bg-slate-100 text-blue-600 rounded-lg hover:bg-blue-50 border border-slate-200 transition-colors"
                                    title="Use Current Location"
                                >
                                    <i className="fa-solid fa-location-crosshairs"></i>
                                </button>
                            </div>
                        </div>
                        
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 mb-1 block">Destination</label>
                            <input 
                                type="text" 
                                value={endLoc}
                                onChange={(e) => setEndLoc(e.target.value)}
                                placeholder="Enter destination"
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                            />
                        </div>

                        <button 
                            onClick={handleGetDirections}
                            disabled={isRouting}
                            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:bg-slate-300 flex justify-center items-center gap-2 shadow-md shadow-blue-600/20"
                        >
                            {isRouting ? (
                                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Calculating...</>
                            ) : (
                                <><i className="fa-solid fa-route"></i> Find Safe Route</>
                            )}
                        </button>
                    </div>

                    {routeInfo && (
                        <div className="mt-4 pt-4 border-t border-slate-100 animate-fadeIn">
                            <div className="flex justify-between items-center mb-2">
                                <div className="text-sm font-bold text-slate-700">
                                    {routeInfo.distance} <span className="text-slate-300 mx-1">|</span> {routeInfo.duration}
                                </div>
                            </div>
                            
                            <div className={`p-3 rounded-lg border ${routeInfo.issuesFound > 0 ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}>
                                <div className="flex items-start gap-3">
                                    <div className={`mt-0.5 ${routeInfo.issuesFound > 0 ? 'text-red-500' : 'text-green-500'}`}>
                                        <i className={`fa-solid ${routeInfo.issuesFound > 0 ? 'fa-triangle-exclamation' : 'fa-shield-heart'}`}></i>
                                    </div>
                                    <div>
                                        <h4 className={`text-sm font-bold ${routeInfo.issuesFound > 0 ? 'text-red-800' : 'text-green-800'}`}>
                                            {routeInfo.issuesFound > 0 ? `${routeInfo.issuesFound} Hazards Detected` : 'Route Clear'}
                                        </h4>
                                        <p className="text-xs text-slate-600 mt-1 leading-snug">
                                            {routeInfo.issuesFound > 0 
                                              ? "Caution: There are reported civic issues along your route." 
                                              : "No active civic issues reported along this path."}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>

        {/* Severity Legend */}
        <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg z-[400] hidden sm:block border border-slate-200">
            <h3 className="font-bold mb-3 text-xs uppercase tracking-wider text-slate-500">Issue Severity</h3>
            <div className="flex items-center gap-2 mb-2"><div className="w-3 h-3 rounded-full bg-[#ef4444]"></div> <span className="text-xs font-medium text-slate-700">Emergency</span></div>
            <div className="flex items-center gap-2 mb-2"><div className="w-3 h-3 rounded-full bg-[#f97316]"></div> <span className="text-xs font-medium text-slate-700">High</span></div>
            <div className="flex items-center gap-2 mb-2"><div className="w-3 h-3 rounded-full bg-[#facc15]"></div> <span className="text-xs font-medium text-slate-700">Medium</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#22c55e]"></div> <span className="text-xs font-medium text-slate-700">Low</span></div>
        </div>
    </div>
  );
};

export default Heatmap;