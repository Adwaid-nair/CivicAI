import React, { useEffect, useRef } from 'react';
import { getTickets } from '../services/dbService';

// We use the global L variable from the script tag in index.html
declare const L: any;

const Heatmap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    // Default center (can be dynamic based on tickets)
    const map = L.map(mapRef.current).setView([12.9716, 77.5946], 13); // Example: Bangalore coords

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    mapInstance.current = map;

    // Load tickets and add markers
    const tickets = getTickets();
    
    // Custom Icons
    const severityColors: any = {
      Low: 'green',
      Medium: 'gold',
      High: 'orange',
      Emergency: 'red'
    };

    tickets.forEach(ticket => {
        // If location is 0,0, randomize slightly around center for demo
        let lat = ticket.location.lat;
        let lng = ticket.location.lng;
        
        if (lat === 0 && lng === 0) {
            lat = 12.9716 + (Math.random() - 0.5) * 0.05;
            lng = 77.5946 + (Math.random() - 0.5) * 0.05;
        }

        const color = severityColors[ticket.severity] || 'blue';
        
        // Simple circle marker
        L.circleMarker([lat, lng], {
            radius: 8,
            fillColor: color,
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
        })
        .addTo(map)
        .bindPopup(`<b>${ticket.title}</b><br/>${ticket.severity}<br/><a href="#/ticket/${ticket.id}">View</a>`);
    });

  }, []);

  return (
    <div className="h-[calc(100vh-64px)] w-full relative">
        <div ref={mapRef} className="w-full h-full" />
        <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg z-[400]">
            <h3 className="font-bold mb-2">Severity Legend</h3>
            <div className="flex items-center gap-2 mb-1"><div className="w-3 h-3 rounded-full bg-red-500"></div> <span className="text-sm">Emergency</span></div>
            <div className="flex items-center gap-2 mb-1"><div className="w-3 h-3 rounded-full bg-orange-500"></div> <span className="text-sm">High</span></div>
            <div className="flex items-center gap-2 mb-1"><div className="w-3 h-3 rounded-full bg-yellow-400"></div> <span className="text-sm">Medium</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500"></div> <span className="text-sm">Low</span></div>
        </div>
    </div>
  );
};

export default Heatmap;