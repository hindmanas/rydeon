import React, { useState } from 'react';

const NODES = [
  { id: 'pcu', name: 'PCU Campus', x: 160, y: 120, type: 'edu', desc: 'Pimpri Chinchwad University Hub', color: '#1683F8', accent: 'blue' },
  { id: 'wakad', name: 'Wakad', x: 260, y: 260, type: 'hub', desc: 'Key Transit Junction', color: '#1683F8', accent: 'blue' },
  { id: 'hinjewadi', name: 'Hinjewadi', x: 150, y: 390, type: 'work', desc: 'IT Park & Internship Hub', color: '#1683F8', accent: 'blue' },
  { id: 'pune_jn', name: 'Pune Junction', x: 540, y: 310, type: 'transit', desc: 'Railway Connectivity Hub', color: '#101D3A', accent: 'navy' },
  { id: 'pune_airport', name: 'Pune Airport', x: 670, y: 140, type: 'transit', desc: 'Airport Connectivity Hub', color: '#168BFF', accent: 'bright-blue' }
];

const ROUTES = [
  // PCU <-> Wakad
  { id: 'pcu-wakad', from: 'pcu', to: 'wakad', path: 'M 160 120 Q 200 200 260 260', color: '#1683F8', isDashed: false, dur: '5.2s' },
  { id: 'wakad-pcu', from: 'wakad', to: 'pcu', path: 'M 260 260 Q 200 200 160 120', color: '#1683F8', isDashed: false, dur: '6s' },
  
  // Wakad <-> Hinjewadi
  { id: 'wakad-hinj', from: 'wakad', to: 'hinjewadi', path: 'M 260 260 Q 200 320 150 390', color: '#1683F8', isDashed: false, dur: '4.8s' },
  { id: 'hinj-wakad', from: 'hinjewadi', to: 'wakad', path: 'M 150 390 Q 200 320 260 260', color: '#1683F8', isDashed: false, dur: '5.5s' },
  
  // Wakad <-> Pune Junction
  { id: 'wakad-pj', from: 'wakad', to: 'pune_jn', path: 'M 260 260 Q 400 300 540 310', color: '#101D3A', isDashed: false, dur: '7.5s' },
  { id: 'pj-wakad', from: 'pune_jn', to: 'wakad', path: 'M 540 310 Q 400 300 260 260', color: '#101D3A', isDashed: false, dur: '8.2s' },
  
  // Pune Junction <-> Pune Airport
  { id: 'pj-airport', from: 'pune_jn', to: 'pune_airport', path: 'M 540 310 Q 615 220 670 140', color: '#168BFF', isDashed: false, dur: '6.5s' },
  { id: 'airport-pj', from: 'pune_airport', to: 'pune_jn', path: 'M 670 140 Q 615 220 540 310', color: '#168BFF', isDashed: false, dur: '5.8s' },
  
  // Express Direct: PCU <-> Pune Junction
  { id: 'pcu-pj-express', from: 'pcu', to: 'pune_jn', path: 'M 160 120 Q 340 160 540 310', color: '#1683F8', isDashed: true, dur: '9.5s' }
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

export function CampusNetworkBackground({ className = '' }) {
  return (
    <div className={`absolute inset-0 w-full h-full network-grid overflow-hidden bg-[#F5FAFF] ${className}`}>
      {/* CSS Styles injection for hardware accelerated SVG grid and animations */}
      <style>{`
        .network-grid {
          background-image: radial-gradient(#DCE5F0 1px, transparent 1px);
          background-size: 24px 24px;
        }
        
        .pulse-route {
          stroke-dasharray: 8 8;
          animation: flowDash 30s linear infinite;
        }

        .pulse-route-glow {
          opacity: 0.15;
          transition: opacity 0.3s ease;
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
          filter: drop-shadow(0px 1px 2px rgba(22, 131, 248, 0.35));
        }

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

      {/* SVG Canvas Background */}
      <svg
        className="absolute inset-0 w-full h-full select-none"
        viewBox="-40 -30 880 520"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Soft Blue Background Water / Land Curves */}
        <path d="M -40,360 Q 300,310 600,370 T 880,340 L 880,520 L -40,520 Z" fill="#EEF7FF" opacity="0.6" />

        {/* Network Grid Overlay lines */}
        <g opacity="0.35">
          <circle cx="160" cy="120" r="160" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="4 6" />
          <circle cx="160" cy="120" r="280" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="4 6" />
        </g>

        {/* Route Tracks */}
        {ROUTES.map((route) => (
          <g key={route.id}>
            <path
              d={route.path}
              fill="none"
              stroke={route.color}
              strokeWidth="8"
              className="pulse-route-glow"
            />
            <path
              d={route.path}
              fill="none"
              stroke={route.color}
              strokeWidth={route.isDashed ? "1.5" : "2.5"}
              strokeDasharray={route.isDashed ? "3 5" : undefined}
              opacity="0.45"
              strokeLinecap="round"
            />
            {!route.isDashed && (
              <path
                d={route.path}
                fill="none"
                stroke={route.color}
                strokeWidth="2.5"
                className="pulse-route"
                opacity="0.5"
                strokeLinecap="round"
              />
            )}
          </g>
        ))}

        {/* Moving Pulse Glow Dots */}
        {ROUTES.map((route) => (
          <g key={`anim-${route.id}`}>
            <circle
              r="4"
              fill={route.color}
              className="glow-dot"
            >
              <animateMotion
                dur={route.dur}
                repeatCount="indefinite"
                path={route.path}
                calcMode="linear"
              />
            </circle>
          </g>
        ))}

        {/* Nodes Render */}
        {NODES.map((node) => (
          <g key={node.id}>
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
            <circle
              cx={node.x}
              cy={node.y}
              r="8"
              fill={node.color}
              opacity="0.2"
            />
            <circle
              cx={node.x}
              cy={node.y}
              r="4.5"
              fill={node.color}
              stroke="#ffffff"
              strokeWidth="1.5"
            />
          </g>
        ))}

        {/* SVG Node Labels locked inside SVG coordinate system */}
        {NODES.map((node) => (
          <foreignObject
            key={`bg-label-${node.id}`}
            x={node.x - 70}
            y={node.y - 36}
            width="140"
            height="32"
            className="overflow-visible pointer-events-none"
          >
            <div className="w-full h-full flex items-center justify-center pointer-events-none">
              <div className="px-2 py-0.5 rounded-md border border-[#DCE5F0] text-[9px] sm:text-[10px] font-bold whitespace-nowrap bg-white/95 text-[#101D3A] flex items-center gap-1 shadow-xs backdrop-blur-xs">
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: node.color }} />
                <span>{node.name}</span>
              </div>
            </div>
          </foreignObject>
        ))}
      </svg>
    </div>
  );
}

function CampusNetwork({ mode = 'full', backgroundOnly = false }) {
  const [selectedNode, setSelectedNode] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);

  if (mode === 'background' || backgroundOnly) {
    return <CampusNetworkBackground />;
  }

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
    <div className="bg-white text-[#101D3A] rounded-2xl border border-[#DCE5F0] overflow-hidden shadow-xl flex flex-col lg:flex-row w-full">
      {/* CSS Styles injection for hardware accelerated SVG grid and animations */}
      <style>{`
        .network-grid {
          background-image: radial-gradient(#DCE5F0 1px, transparent 1px);
          background-size: 24px 24px;
        }
        
        .pulse-route {
          stroke-dasharray: 8 8;
          animation: flowDash 30s linear infinite;
        }

        .pulse-route-glow {
          opacity: 0.08;
          transition: opacity 0.3s ease;
        }

        .route-hoverable:hover .pulse-route-glow {
          opacity: 0.2;
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
          filter: drop-shadow(0px 1px 2px rgba(22, 131, 248, 0.3));
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
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#DCE5F0] rounded-full text-[11px] font-semibold tracking-wider text-[#101D3A] shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#18B76A] animate-pulse"></span>
            LIVE NETWORK CORE
          </div>
          
          <div className="flex items-center gap-6 text-xs text-slate-500 font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-1 bg-[#1683F8] rounded-full"></span>
              <span>Campus Line</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-1 bg-[#101D3A] rounded-full"></span>
              <span>City Line</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-1 bg-[#168BFF] rounded-full"></span>
              <span>Metro Link</span>
            </div>
          </div>
        </div>

        {/* The SVG Network Diagram Wrapper */}
        <div className="relative w-full my-auto aspect-[880/520]">
          <svg
            className="w-full h-full select-none"
            viewBox="-40 -30 880 520"
            preserveAspectRatio="xMidYMid meet"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Network Grid Overlay lines */}
            <g opacity="0.4">
              <circle cx="160" cy="120" r="160" stroke="#EEF7FF" strokeWidth="1" strokeDasharray="4 6" />
              <circle cx="160" cy="120" r="280" stroke="#EEF7FF" strokeWidth="1" strokeDasharray="4 6" />
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
                    opacity={isActive ? 0.45 : 0.1}
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
                      opacity="0.25"
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
                    r="3.5"
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
                    opacity={isSelected || isHovered ? "0.25" : "0.15"}
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

            {/* SVG Location Overlay Labels */}
            {NODES.map((node) => {
              const isSelected = selectedNode === node.id;
              const isHovered = hoveredNode === node.id;
              const isDimmed = selectedNode && !isSelected && hoveredNode !== node.id;
              
              return (
                <foreignObject
                  key={`label-${node.id}`}
                  x={node.x - 70}
                  y={node.y - 38}
                  width="140"
                  height="34"
                  className="overflow-visible pointer-events-none"
                >
                  <div className={`w-full h-full flex items-center justify-center pointer-events-none transition-all duration-300 ${
                    isDimmed ? 'opacity-40 scale-95' : 'opacity-100 scale-100'
                  }`}>
                    <div
                      className={`px-2.5 py-1 rounded-md border text-[10px] sm:text-xs font-bold whitespace-nowrap bg-white text-[#101D3A] flex items-center gap-1.5 shadow-md transition-all duration-300 ${
                        isSelected
                          ? 'border-[#1683F8] text-[#1683F8] bg-[#EEF7FF] scale-105 shadow-blue-100'
                          : isHovered
                          ? 'border-[#1683F8] text-[#101D3A] bg-white'
                          : 'border-[#DCE5F0]'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: node.color }}></span>
                      <span>{node.name}</span>
                    </div>
                  </div>
                </foreignObject>
              );
            })}
          </svg>
        </div>

        {/* Map Footer Guidance Overlay */}
        <div className="relative z-10 text-[10px] sm:text-xs text-slate-500 font-semibold">
          {selectedNode ? (
            <button
              onClick={() => setSelectedNode(null)}
              className="text-[#1683F8] hover:text-[#168BFF] font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <span>← Click destination or click here to reset filter</span>
            </button>
          ) : (
            <span className="italic">Click any node to filter upcoming rides for that corridor</span>
          )}
        </div>
      </div>

      {/* Dashboard & Ride Feed Column */}
      <div className="w-full lg:w-[380px] p-6 lg:p-8 flex flex-col justify-between bg-[#F7FAFE] border-t lg:border-t-0 lg:border-l border-[#DCE5F0]">
        
        {/* Live Statistics Section */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-[#DCE5F0] mb-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Live Statistics</h3>
            <span className="flex items-center gap-1 text-[10px] text-[#18B76A] font-bold bg-[#ECFDF3] border border-[#D1FADF] px-2.5 py-0.5 rounded-full">
              <span className="w-1 h-1 bg-[#18B76A] rounded-full animate-pulse"></span>
              Live
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="bg-white border border-[#DCE5F0] p-3 rounded-xl text-center shadow-sm">
              <span className="block text-xl font-bold text-[#1683F8]">12</span>
              <span className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">Live Rides</span>
            </div>
            <div className="bg-white border border-[#DCE5F0] p-3 rounded-xl text-center shadow-sm">
              <span className="block text-xl font-bold text-[#101D3A]">23</span>
              <span className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">Commuters</span>
            </div>
            <div className="bg-white border border-[#DCE5F0] p-3 rounded-xl text-center shadow-sm">
              <span className="block text-xl font-bold text-[#168BFF]">8</span>
              <span className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">Hubs</span>
            </div>
          </div>

          {/* Ride Card Feed */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>{selectedNode ? `Corridor Transits (${filteredRides.length})` : 'Active Transits'}</span>
              {selectedNode && (
                <button
                  onClick={() => setSelectedNode(null)}
                  className="text-slate-400 hover:text-[#1683F8] font-semibold"
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
                    className="group bg-[#FFFFFF] border border-[#DCE5F0] p-4 rounded-xl shadow-sm hover:shadow-md hover:border-[#1683F8]/30 transition"
                  >
                    <div className="flex items-center justify-between gap-3 mb-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#EEF7FF] flex items-center justify-center text-[10px] font-bold text-[#1683F8]">
                          {ride.avatar}
                        </div>
                        <div>
                          <span className="text-[11px] font-bold text-[#101D3A] group-hover:text-[#1683F8] transition flex items-center gap-1">
                            {ride.driver}
                            <span className="text-[10px] text-[#1683F8] font-normal">✓</span>
                          </span>
                          <span className="block text-[9px] text-slate-400 font-semibold">{ride.time}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="block text-xs font-black text-[#101D3A]">₹{ride.price}</span>
                        <span className="text-[9px] text-slate-400 font-semibold">{ride.seats} seats left</span>
                      </div>
                    </div>

                    <div className="bg-[#F7FAFE] border border-[#DCE5F0] rounded-lg p-2.5 flex items-center justify-between text-[10px] text-[#101D3A] font-medium">
                      <span className="truncate max-w-[100px] text-slate-500 font-semibold">{ride.origin}</span>
                      <span className="text-[#1683F8] font-bold shrink-0 mx-2">→</span>
                      <span className="truncate max-w-[100px] text-slate-500 font-semibold">{ride.destination}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-400 border border-dashed border-[#DCE5F0] bg-white rounded-xl">
                  <p className="text-xs">No active rides matching this hub</p>
                  <button
                    onClick={() => setSelectedNode(null)}
                    className="text-xs text-[#1683F8] hover:text-[#168BFF] font-bold mt-2 cursor-pointer"
                  >
                    View all routes
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Selected Hub info overlay or Call to action */}
        <div className="mt-6 pt-4 border-t border-[#DCE5F0]">
          {selectedNode ? (
            (() => {
              const node = NODES.find((n) => n.id === selectedNode);
              return (
                <div className="bg-white border border-[#DCE5F0] p-3 rounded-xl flex items-center justify-between shadow-sm">
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold block">Commute Focus</span>
                    <span className="text-xs font-bold text-[#101D3A]">{node.name}</span>
                  </div>
                  <button
                    onClick={() => setSelectedNode(null)}
                    className="text-[10px] bg-[#EEF7FF] hover:bg-[#1683F8] hover:text-white text-[#1683F8] px-2.5 py-1 rounded-md font-bold transition"
                  >
                    Reset View
                  </button>
                </div>
              );
            })()
          ) : (
            <div className="text-[11px] text-slate-400 text-center font-medium leading-relaxed">
              Commutes operate directly between key student nodes and airport/junction transits.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default CampusNetwork;


