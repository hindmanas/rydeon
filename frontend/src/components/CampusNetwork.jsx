import React, { useState } from 'react';

const NODES = [
  { id: 'pcu', name: 'PCU Campus', x: 160, y: 120, type: 'edu', desc: 'Pimpri Chinchwad University Hub', color: '#0f766e', accent: 'teal' },
  { id: 'wakad', name: 'Wakad', x: 260, y: 260, type: 'hub', desc: 'Key Transit Junction', color: '#0f766e', accent: 'teal' },
  { id: 'hinjewadi', name: 'Hinjewadi', x: 150, y: 390, type: 'work', desc: 'IT Park & Internship Hub', color: '#0f766e', accent: 'teal' },
  { id: 'pune_jn', name: 'Pune Junction', x: 540, y: 310, type: 'transit', desc: 'Railway Connectivity Hub', color: '#047857', accent: 'emerald' },
  { id: 'pune_airport', name: 'Pune Airport', x: 670, y: 140, type: 'transit', desc: 'Airport Connectivity Hub', color: '#0891b2', accent: 'cyan' }
];

const ROUTES = [
  // PCU <-> Wakad
  { id: 'pcu-wakad', from: 'pcu', to: 'wakad', path: 'M 160 120 Q 200 200 260 260', color: '#0f766e', isDashed: false, dur: '5.2s' },
  { id: 'wakad-pcu', from: 'wakad', to: 'pcu', path: 'M 260 260 Q 200 200 160 120', color: '#0f766e', isDashed: false, dur: '6s' },
  
  // Wakad <-> Hinjewadi
  { id: 'wakad-hinj', from: 'wakad', to: 'hinjewadi', path: 'M 260 260 Q 200 320 150 390', color: '#0f766e', isDashed: false, dur: '4.8s' },
  { id: 'hinj-wakad', from: 'hinjewadi', to: 'wakad', path: 'M 150 390 Q 200 320 260 260', color: '#0f766e', isDashed: false, dur: '5.5s' },
  
  // Wakad <-> Pune Junction
  { id: 'wakad-pj', from: 'wakad', to: 'pune_jn', path: 'M 260 260 Q 400 300 540 310', color: '#047857', isDashed: false, dur: '7.5s' },
  { id: 'pj-wakad', from: 'pune_jn', to: 'wakad', path: 'M 540 310 Q 400 300 260 260', color: '#047857', isDashed: false, dur: '8.2s' },
  
  // Pune Junction <-> Pune Airport
  { id: 'pj-airport', from: 'pune_jn', to: 'pune_airport', path: 'M 540 310 Q 615 220 670 140', color: '#0891b2', isDashed: false, dur: '6.5s' },
  { id: 'airport-pj', from: 'pune_airport', to: 'pune_jn', path: 'M 670 140 Q 615 220 540 310', color: '#0891b2', isDashed: false, dur: '5.8s' },
  
  // Express Direct: PCU <-> Pune Junction
  { id: 'pcu-pj-express', from: 'pcu', to: 'pune_jn', path: 'M 160 120 Q 340 160 540 310', color: '#2563eb', isDashed: true, dur: '9.5s' }
];

const INITIAL_RIDES = [
  {
    id: 1,
    driver: "Mohit Shrivas",
    verified: true,
    origin: "PCU Campus",
    originId: "pcu",
    destination: "Pune Junction",
    destinationId: "pune_jn",
    time: "4:00 PM",
    price: 40,
    seats: 2,
    avatar: "M"
  },
  {
    id: 2,
    driver: "Anayat Sharma",
    verified: true,
    origin: "PCU Campus",
    originId: "pcu",
    destination: "Wakad",
    destinationId: "wakad",
    time: "4:30 PM",
    price: 30,
    seats: 1,
    avatar: "A"
  },
  {
    id: 3,
    driver: "Snehal Deshmukh",
    verified: true,
    origin: "PCU Campus",
    originId: "pcu",
    destination: "Wakad",
    destinationId: "wakad",
    time: "5:15 PM",
    price: 25,
    seats: 3,
    avatar: "S"
  },
  {
    id: 4,
    driver: "Kabir Malhotra",
    verified: true,
    origin: "Wakad",
    originId: "wakad",
    destination: "Pune Junction",
    destinationId: "pune_jn",
    time: "6:00 PM",
    price: 35,
    seats: 2,
    avatar: "K"
  },
  {
    id: 5,
    driver: "Tanya Sen",
    verified: true,
    origin: "Pune Junction",
    originId: "pune_jn",
    destination: "Pune Airport",
    destinationId: "pune_airport",
    time: "7:30 PM",
    price: 50,
    seats: 1,
    avatar: "T"
  }
];

function CampusNetwork() {
  const [selectedNode, setSelectedNode] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);

  const handleNodeClick = (nodeId) => {
    if (selectedNode === nodeId) {
      setSelectedNode(null);
    } else {
      setSelectedNode(nodeId);
    }
  };

  const filteredRides = selectedNode
    ? INITIAL_RIDES.filter(
        (ride) =>
          ride.originId === selectedNode || ride.destinationId === selectedNode
      )
    : INITIAL_RIDES;

  return (
    <div className="bg-white text-neutral-900 rounded-2xl border border-neutral-200 overflow-hidden shadow-xl flex flex-col lg:flex-row w-full">
      {/* CSS Styles injection for hardware accelerated SVG grid and animations */}
      <style>{`
        .network-grid {
          background-image: radial-gradient(#e5e7eb 1px, transparent 1px);
          background-size: 24px 24px;
        }
        
        .pulse-route {
          stroke-dasharray: 8 8;
          animation: flowDash 30s linear infinite;
        }

        .pulse-route-glow {
          opacity: 0.05;
          transition: opacity 0.3s ease;
        }

        .route-hoverable:hover .pulse-route-glow {
          opacity: 0.15;
        }

        @keyframes flowDash {
          to {
            stroke-dashoffset: -320px;
          }
        }

        @keyframes pulsePing {
          0% {
            transform: scale(0.9);
            opacity: 0.6;
          }
          100% {
            transform: scale(2.2);
            opacity: 0;
          }
        }

        .marker-ping-ring {
          transform-origin: center;
          animation: pulsePing 2.8s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
        }

        .glow-dot {
          filter: drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.15));
        }

        /* Reduced motion preferences */
        @media (prefers-reduced-motion: reduce) {
          .pulse-route,
          .marker-ping-ring,
          .glow-dot animateMotion {
            animation: none !important;
            stroke-dashoffset: 0 !important;
          }
          .glow-dot {
            opacity: 0.5;
          }
        }
      `}</style>

      {/* SVG Network Map Column */}
      <div className="relative flex-1 p-4 sm:p-6 lg:p-8 flex flex-col justify-between overflow-hidden network-grid min-h-[360px] sm:min-h-[440px] lg:min-h-[500px]">
        {/* Network Header Overlay */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-neutral-200 rounded-full text-[11px] font-semibold tracking-wider text-neutral-800 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            LIVE NETWORK CORE
          </div>
          
          <div className="flex items-center gap-6 text-xs text-neutral-500 font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-1 bg-[#0f766e] rounded-full"></span>
              <span>Campus Line</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-1 bg-[#047857] rounded-full"></span>
              <span>City Line</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-1 bg-[#0891b2] rounded-full"></span>
              <span>Metro Link</span>
            </div>
          </div>
        </div>

        {/* The SVG Network Diagram Wrapper */}
        <div className="relative w-full my-auto aspect-[800/460]">
          <svg
            className="w-full h-full select-none"
            viewBox="0 0 800 460"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Network Grid Overlay lines */}
            <g opacity="0.4">
              <circle cx="160" cy="120" r="160" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 6" />
              <circle cx="160" cy="120" r="280" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 6" />
            </g>

            {/* Static Route Tracks & Glowing Pulse Backings */}
            {ROUTES.map((route) => {
              const isActive = !selectedNode || selectedNode === route.from || selectedNode === route.to;
              return (
                <g key={route.id} className="route-hoverable">
                  {/* Outer Thick Glow Backing */}
                  <path
                    d={route.path}
                    fill="none"
                    stroke={route.color}
                    strokeWidth="8"
                    className="pulse-route-glow"
                  />
                  {/* Subtle Inner Route Track Line */}
                  <path
                    d={route.path}
                    fill="none"
                    stroke={route.color}
                    strokeWidth={route.isDashed ? "1" : "1.8"}
                    strokeDasharray={route.isDashed ? "3 5" : undefined}
                    opacity={isActive ? 0.35 : 0.08}
                    strokeLinecap="round"
                    className="transition-all duration-300"
                  />
                  {/* Dash Flowing Animation Overlay */}
                  {!route.isDashed && isActive && (
                    <path
                      d={route.path}
                      fill="none"
                      stroke={route.color}
                      strokeWidth="1.8"
                      className="pulse-route"
                      opacity="0.15"
                      strokeLinecap="round"
                    />
                  )}
                </g>
              );
            })}

            {/* Real-time Student Travel Animators (Dots) */}
            {ROUTES.map((route) => {
              const isActive = !selectedNode || selectedNode === route.from || selectedNode === route.to;
              if (!isActive) return null;
              return (
                <g key={`anim-${route.id}`}>
                  <circle
                    r="3.2"
                    fill={route.color}
                    className="glow-dot"
                    style={{ '--accent-color': route.color }}
                  >
                    <animateMotion
                      dur={route.dur}
                      repeatCount="indefinite"
                      path={route.path}
                      calcMode="linear"
                    />
                  </circle>
                </g>
              );
            })}

            {/* Nodes Render */}
            {NODES.map((node) => {
              const isSelected = selectedNode === node.id;
              const isHovered = hoveredNode === node.id;
              const isDimmed = selectedNode && !isSelected && hoveredNode !== node.id;
              
              return (
                <g
                  key={node.id}
                  className="cursor-pointer group"
                  onClick={() => handleNodeClick(node.id)}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  {/* Hover Hitbox */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="24"
                    fill="transparent"
                  />

                  {/* Pulsing Active Ring */}
                  {!isDimmed && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="16"
                      stroke={node.color}
                      strokeWidth="1.2"
                      fill="transparent"
                      className="marker-ping-ring"
                      style={{ transformOrigin: `${node.x}px ${node.y}px` }}
                    />
                  )}

                  {/* Outer glow ring */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isHovered || isSelected ? "10" : "8"}
                    fill={node.color}
                    opacity={isSelected || isHovered ? "0.22" : "0.12"}
                    className="transition-all duration-300"
                  />

                  {/* Node Core */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="4.5"
                    fill={node.color}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    className="transition-all duration-300 group-hover:scale-110"
                    style={{ transformOrigin: `${node.x}px ${node.y}px` }}
                  />
                </g>
              );
            })}
          </svg>

          {/* HTML Location Overlay Labels (Positioned correctly using layout percentages) */}
          {NODES.map((node) => {
            const isSelected = selectedNode === node.id;
            const isHovered = hoveredNode === node.id;
            const isDimmed = selectedNode && !isSelected && hoveredNode !== node.id;
            
            return (
              <div
                key={node.id}
                className={`absolute -translate-x-1/2 -translate-y-full mb-3 pointer-events-none transition-all duration-300 ${
                  isDimmed ? 'opacity-40 scale-95' : 'opacity-100 scale-100'
                }`}
                style={{
                  left: `${(node.x / 800) * 100}%`,
                  top: `${(node.y / 460) * 100}%`
                }}
              >
                <div
                  className={`px-2.5 py-1 rounded-md border text-[10px] sm:text-xs font-bold whitespace-nowrap bg-white text-neutral-800 flex items-center gap-1.5 shadow-md transition-all duration-300 ${
                    isSelected
                      ? 'border-neutral-900 text-black bg-neutral-50 scale-105'
                      : isHovered
                      ? 'border-neutral-400 text-neutral-950 bg-white'
                      : 'border-neutral-200'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: node.color }}></span>
                  <span>{node.name}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Map Footer Guidance Overlay */}
        <div className="relative z-10 text-[10px] sm:text-xs text-neutral-500 font-semibold">
          {selectedNode ? (
            <button
              onClick={() => setSelectedNode(null)}
              className="text-[#0f766e] hover:text-[#0d9488] font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <span>← Click destination or click here to reset filter</span>
            </button>
          ) : (
            <span className="italic">Click any node to filter upcoming rides for that corridor</span>
          )}
        </div>
      </div>

      {/* Dashboard & Ride Feed Column */}
      <div className="w-full lg:w-[380px] p-6 lg:p-8 flex flex-col justify-between bg-neutral-50 border-t lg:border-t-0 lg:border-l border-neutral-200">
        
        {/* Live Statistics Section */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-neutral-200 mb-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500">Live Statistics</h3>
            <span className="flex items-center gap-1 text-[10px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></span>
              Live
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="bg-white border border-neutral-200 p-3 rounded-xl text-center shadow-sm">
              <span className="block text-xl font-bold text-[#0f766e]">12</span>
              <span className="text-[9px] text-neutral-400 uppercase tracking-wider font-semibold">Live Rides</span>
            </div>
            <div className="bg-white border border-neutral-200 p-3 rounded-xl text-center shadow-sm">
              <span className="block text-xl font-bold text-[#047857]">23</span>
              <span className="text-[9px] text-neutral-400 uppercase tracking-wider font-semibold">Commuters</span>
            </div>
            <div className="bg-white border border-neutral-200 p-3 rounded-xl text-center shadow-sm">
              <span className="block text-xl font-bold text-[#0891b2]">8</span>
              <span className="text-[9px] text-neutral-400 uppercase tracking-wider font-semibold">Hubs</span>
            </div>
          </div>

          {/* Ride Card Feed */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-neutral-500">
              <span>{selectedNode ? `Corridor Transits (${filteredRides.length})` : 'Active Transits'}</span>
              {selectedNode && (
                <button
                  onClick={() => setSelectedNode(null)}
                  className="text-neutral-400 hover:text-neutral-600 font-semibold"
                >
                  Clear Filter
                </button>
              )}
            </div>

            <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
              {filteredRides.length > 0 ? (
                filteredRides.map((ride) => (
                  <div
                    key={ride.id}
                    className="group bg-white border border-neutral-200 p-4 rounded-xl shadow-sm hover:shadow hover:border-neutral-300 transition"
                  >
                    <div className="flex items-center justify-between gap-3 mb-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-[10px] font-bold text-neutral-700">
                          {ride.avatar}
                        </div>
                        <div>
                          <span className="text-[11px] font-bold text-neutral-800 group-hover:text-black transition flex items-center gap-1">
                            {ride.driver}
                            <span className="text-[10px] text-teal-600 font-normal">✓</span>
                          </span>
                          <span className="block text-[9px] text-neutral-400 font-semibold">{ride.time}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="block text-xs font-black text-neutral-900">₹{ride.price}</span>
                        <span className="text-[9px] text-neutral-400 font-semibold">{ride.seats} seats left</span>
                      </div>
                    </div>

                    <div className="bg-neutral-50 border border-neutral-100 rounded-lg p-2.5 flex items-center justify-between text-[10px] text-neutral-700 font-medium">
                      <span className="truncate max-w-[100px] text-neutral-500 font-semibold">{ride.origin}</span>
                      <span className="text-neutral-300 font-bold shrink-0 mx-2">→</span>
                      <span className="truncate max-w-[100px] text-neutral-500 font-semibold">{ride.destination}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-neutral-400 border border-dashed border-neutral-200 bg-white rounded-xl">
                  <p className="text-xs">No active rides matching this hub</p>
                  <button
                    onClick={() => setSelectedNode(null)}
                    className="text-xs text-teal-700 hover:text-teal-800 font-bold mt-2 cursor-pointer"
                  >
                    View all routes
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Selected Hub info overlay or Call to action */}
        <div className="mt-6 pt-4 border-t border-neutral-200">
          {selectedNode ? (
            (() => {
              const node = NODES.find((n) => n.id === selectedNode);
              return (
                <div className="bg-white border border-neutral-200 p-3 rounded-xl flex items-center justify-between shadow-sm">
                  <div>
                    <span className="text-[9px] text-neutral-400 uppercase tracking-wider font-semibold block">Commute Focus</span>
                    <span className="text-xs font-bold text-neutral-900">{node.name}</span>
                  </div>
                  <button
                    onClick={() => setSelectedNode(null)}
                    className="text-[10px] bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-2.5 py-1 rounded-md font-bold transition"
                  >
                    Reset View
                  </button>
                </div>
              );
            })()
          ) : (
            <div className="text-[11px] text-neutral-400 text-center font-medium leading-relaxed">
              Commutes operate directly between key student nodes and airport/junction transits.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default CampusNetwork;
