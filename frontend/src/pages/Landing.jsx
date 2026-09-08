import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Image assets
import studentDriver from '../assets/student_driver.jpg';
import campusStudentsWaiting from '../assets/campus_students_waiting.jpg';
import studentCarpoolChat from '../assets/student_carpool_chat.jpg';
import studentsBook from '../assets/students_book.jpg';
import studentsRide from '../assets/students_ride.jpg';

import CampusNetwork from '../components/CampusNetwork';
import {
  ArrowRightIcon,
  ShieldCheckIcon,
  RouteIcon,
  MessageSquareIcon,
  CheckCircleIcon,
  UserCheckIcon,
  ClockIcon,
  MapPinIcon,
  UsersIcon,
  ChevronDownIcon,
  LockIcon,
  CarFrontIcon
} from '../components/icons';

function Landing() {
  const navigate = useNavigate();
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [openFaq, setOpenFaq] = useState(4); // Default open FAQ
  const [userMode, setUserMode] = useState('rider'); // 'rider' or 'host'
  const [reducedMotion, setReducedMotion] = useState(false);

  // Normalized Scroll Progress (0.0 to 1.0) inside the Story Container
  const storyContainerRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Check reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const listener = (e) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  // Continuous Scroll Progress Calculation with requestAnimationFrame
  useEffect(() => {
    let animationFrameId;

    const handleScroll = () => {
      if (!storyContainerRef.current) return;
      const rect = storyContainerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      const totalScrollableDistance = rect.height - windowHeight;
      if (totalScrollableDistance <= 0) return;

      const currentScroll = -rect.top;
      const rawProgress = currentScroll / totalScrollableDistance;
      const clampedProgress = Math.max(0, Math.min(1, rawProgress));

      setScrollProgress(clampedProgress);
    };

    const onScroll = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!pickup && !destination) return;
    navigate('/find-rides', { state: { pickup, destination } });
  };

  // Derive phone transform values & states from scrollProgress:
  // 0.00 - 0.12: Hero -> Descend
  // 0.12 - 0.28: Step 1 (Find Your Ride) - Phone Left
  // 0.28 - 0.44: Step 2 (Request a Seat + 3D Flip) - Phone moves Right
  // 0.44 - 0.60: Step 3 (Host Decides + Flip) - Phone moves Left
  // 0.60 - 0.75: Step 4 (Confirmed & Chat) - Phone Center-Left
  // 0.75 - 1.00: 3-Phone Verification Spread & Background Blue transition

  // 1. Phone X position (in vw)
  let phoneX = 0;
  if (scrollProgress < 0.12) {
    phoneX = (scrollProgress / 0.12) * -28; // 0 -> -28vw (Left)
  } else if (scrollProgress >= 0.12 && scrollProgress < 0.28) {
    phoneX = -28; // Hold Left
  } else if (scrollProgress >= 0.28 && scrollProgress < 0.44) {
    const t = (scrollProgress - 0.28) / 0.16;
    phoneX = -28 + t * 56; // -28vw -> +28vw (Move to Right)
  } else if (scrollProgress >= 0.44 && scrollProgress < 0.60) {
    const t = (scrollProgress - 0.44) / 0.16;
    phoneX = 28 - t * 52; // +28vw -> -24vw (Move to Left)
  } else if (scrollProgress >= 0.60 && scrollProgress < 0.75) {
    phoneX = -24; // Hold Left
  } else {
    phoneX = -24; // 3-phone spread handles final transition
  }

  // 2. Phone Y translation (px)
  let phoneY = 0;
  if (scrollProgress < 0.12) {
    phoneY = (scrollProgress / 0.12) * 140; // Descend 0 -> 140px
  } else {
    phoneY = 140;
  }

  // 3. Phone Scale (1.0 -> 0.75)
  let phoneScale = 1.0;
  if (scrollProgress < 0.12) {
    phoneScale = 1.0 - (scrollProgress / 0.12) * 0.25;
  } else if (scrollProgress >= 0.75) {
    const t = (scrollProgress - 0.75) / 0.25;
    phoneScale = 0.75 + t * 0.1;
  } else {
    phoneScale = 0.75;
  }

  // 4. Phone 3D Rotation (rotateY in degrees)
  let phoneRotateY = 0;
  if (!reducedMotion) {
    if (scrollProgress >= 0.28 && scrollProgress < 0.36) {
      const t = (scrollProgress - 0.28) / 0.08;
      phoneRotateY = t * 180; // 0 -> 180deg flip
    } else if (scrollProgress >= 0.36 && scrollProgress < 0.44) {
      phoneRotateY = 180;
    } else if (scrollProgress >= 0.44 && scrollProgress < 0.52) {
      const t = (scrollProgress - 0.44) / 0.08;
      phoneRotateY = 180 + t * 180; // 180 -> 360deg flip
    } else if (scrollProgress >= 0.52) {
      phoneRotateY = 360;
    }
  }

  // 5. Active Screen State inside the Phone
  let phoneScreen = 'find'; // 'find', 'request', 'host_decides', 'confirmed', 'chat'
  if (scrollProgress < 0.28) {
    phoneScreen = 'find';
  } else if (scrollProgress >= 0.28 && scrollProgress < 0.44) {
    phoneScreen = 'request';
  } else if (scrollProgress >= 0.44 && scrollProgress < 0.60) {
    phoneScreen = 'host_decides';
  } else if (scrollProgress >= 0.60 && scrollProgress < 0.70) {
    phoneScreen = 'confirmed';
  } else {
    phoneScreen = 'chat';
  }

  // 6. SVG Route Stroke Dashoffset (100% -> 0%)
  const routeDashoffset = Math.max(0, 100 - (scrollProgress / 0.75) * 100);

  // 7. 3-Phone Verification Spread Progress (0 -> 1)
  const verificationProgress = Math.max(0, (scrollProgress - 0.75) / 0.25);
  const leftPhoneX = verificationProgress * -260; // px
  const rightPhoneX = verificationProgress * 260; // px

  // Testimonials Rows Data
  const testimonialsRow1 = [
    {
      id: 1,
      quote: "No more searching through five WhatsApp groups just to find someone going the same way. I posted my route and found a classmate in minutes.",
      name: "Priya Sharma",
      role: "2nd Year CS",
      college: "PCU Campus",
      route: "Campus → Pune Station",
      savings: "Saves ₹90 / trip"
    },
    {
      id: 2,
      quote: "I used to spend ₹200+ on a solo cab to Hinjewadi. Now I share the ride with classmates travelling the exact same corridor.",
      name: "Ananya Gupta",
      role: "3rd Year B.Tech",
      college: "PCU Campus",
      route: "Campus → Hinjewadi",
      savings: "Saves ₹140 / trip"
    },
    {
      id: 3,
      quote: "As a host driver, offering my empty seats lets me cover fuel costs while making reliable campus connections.",
      name: "Mohit Shrivas",
      role: "4th Year Student Host",
      college: "PCU Campus",
      route: "Wakad → Pune Station",
      savings: "Covers 100% Fuel"
    }
  ];

  const testimonialsRow2 = [
    {
      id: 4,
      quote: "The best part is knowing whether my request is actually accepted. Once confirmed, we can chat and sort out pickup points cleanly.",
      name: "Arjun Tomar",
      role: "Regular Commuter",
      college: "Pune University",
      route: "Baner → Main Gate",
      savings: "Saves ₹80 / trip"
    },
    {
      id: 5,
      quote: "Women-only ride filter gives me total peace of mind when booking late evening commutes from college.",
      name: "Priyanshi S.",
      role: "3rd Year Student",
      college: "PCU Campus",
      route: "Campus → Railway Station",
      savings: "Saves ₹110 / trip"
    },
    {
      id: 6,
      quote: "Instant transparency on seats, driver profile, and price per seat makes Rydeon the best way to travel around Pune.",
      name: "Rakshan Parashar",
      role: "2nd Year Student",
      college: "PCU Campus",
      route: "Admin Block → Wakad",
      savings: "Saves ₹95 / trip"
    }
  ];

  const faqs = [
    {
      id: 1,
      q: 'What is Rydeon?',
      a: 'Rydeon is a student-only ride-sharing platform that connects verified college commuters heading in similar directions across campus and city corridors.'
    },
    {
      id: 2,
      q: 'How does student ride-sharing work?',
      a: 'Verified students driving to college, internships, or home post their empty seats. Riders search by route, date, and time, then send a request to join.'
    },
    {
      id: 3,
      q: 'How do I request a seat?',
      a: 'Find a ride matching your corridor, review the driver profile, seat price, and departure time, then click "Request to Join".'
    },
    {
      id: 4,
      q: 'Is my ride confirmed immediately?',
      a: 'No. A request tells the driver you would like to join. Your seat becomes confirmed ONLY after the host reviews your profile and accepts your request.',
      highlight: true
    },
    {
      id: 5,
      q: 'How does student verification work?',
      a: 'Students verify their identity using official college email addresses or valid student IDs before requesting or hosting rides.'
    },
    {
      id: 6,
      q: 'Can I offer my own ride?',
      a: 'Yes! If you are a verified student driving along campus routes, you can post empty seats, review incoming requests, and split fuel costs.'
    },
    {
      id: 7,
      q: 'How does pricing work?',
      a: 'Drivers set transparent per-seat pricing to cover shared fuel costs, avoiding solo taxi markups or excessive ride-hailing surge charges.'
    }
  ];

  return (
    <div className="font-sans text-slate-900 bg-[#f8fafc] min-h-screen overflow-x-hidden selection:bg-teal-600 selection:text-white">

      {/* ============================================================ */}
      {/* 4. HERO SECTION */}
      {/* ============================================================ */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          
          {/* Trust Tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-bold text-slate-700">
            <span className="px-3 py-1 rounded-full bg-white border border-slate-200 shadow-sm flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse"></span>
              Built for students
            </span>
            <span className="px-3 py-1 rounded-full bg-white border border-slate-200 shadow-sm">
              Verified campus community
            </span>
            <span className="px-3 py-1 rounded-full bg-white border border-slate-200 shadow-sm">
              Real-time ride matching
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-950 leading-[1.08] tracking-tight">
            Going somewhere?<br />
            <span className="text-teal-700">Go together.</span>
          </h1>

          {/* Supporting Copy */}
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-normal">
            Find verified students travelling your way. Share the ride. Save more.
          </p>

          {/* CTA Group */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/find-rides"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-slate-950 text-white hover:bg-slate-800 rounded-xl text-sm font-bold shadow-sm transition duration-200"
            >
              <span>Find a Ride</span>
              <ArrowRightIcon className="w-4 h-4 text-teal-400" />
            </Link>

            <Link
              to="/offer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-slate-800 border border-slate-200 hover:bg-slate-100 rounded-xl text-sm font-bold transition duration-200 shadow-sm"
            >
              <span>Offer a Ride</span>
            </Link>
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 5, 6, 7 & 8 CONTINUOUS SCROLL STORY CONTAINER */}
      {/* ============================================================ */}
      <div ref={storyContainerRef} className="relative min-h-[550vh] w-full">
        
        {/* Sticky Viewport Container */}
        <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between pt-20 pb-8 px-4 sm:px-8">
          
          {/* Header Controls inside Story Viewport */}
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between z-30 pointer-events-auto">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-teal-700 block">HOW IT WORKS</span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950">Your ride, from request to confirmed.</h2>
            </div>

            {/* Rider / Host Segmented Control */}
            <div className="flex bg-slate-200/80 p-1 rounded-xl border border-slate-300 text-xs font-bold">
              <button
                onClick={() => setUserMode('rider')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  userMode === 'rider' ? 'bg-slate-950 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                I'm a Rider
              </button>
              <button
                onClick={() => setUserMode('host')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  userMode === 'host' ? 'bg-slate-950 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                I'm a Host
              </button>
            </div>
          </div>

          {/* SVG Animated Curved Route Layer */}
          <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
            <svg className="w-full h-full max-w-6xl select-none" viewBox="0 0 1000 600" fill="none">
              {/* Base Inactive Light Path */}
              <path
                d="M 150 100 C 400 120, 600 240, 300 360 C 150 420, 500 520, 850 500"
                stroke="#e2e8f0"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />

              {/* Active Rydeon Teal Route (Scroll Progress Driven) */}
              <path
                d="M 150 100 C 400 120, 600 240, 300 360 C 150 420, 500 520, 850 500"
                stroke="#0f766e"
                strokeWidth="5"
                strokeLinecap="round"
                fill="none"
                strokeDasharray="1400"
                strokeDashoffset={1400 * (routeDashoffset / 100)}
                className="transition-all duration-75"
              />

              {/* Route Endpoint Marker */}
              <circle
                cx={150 + (850 - 150) * (1 - routeDashoffset / 100)}
                cy={100 + (500 - 100) * (1 - routeDashoffset / 100)}
                r="7"
                fill="#10b981"
                stroke="#ffffff"
                strokeWidth="2.5"
                className="shadow-md"
              />
            </svg>
          </div>

          {/* Central Animated Phone & Story Content Split View */}
          <div className="max-w-7xl mx-auto w-full flex-1 relative flex items-center justify-between z-20">
            
            {/* LEFT STORY TEXT PANEL (Visible when Phone is Right/Center) */}
            <div className={`w-full max-w-sm space-y-4 transition-all duration-300 ${
              scrollProgress >= 0.28 && scrollProgress < 0.44 ? 'opacity-100 translate-x-0' : 'opacity-20 pointer-events-none'
            }`}>
              <span className="px-3 py-1 rounded-full bg-slate-950 text-teal-400 text-xs font-black">02 · REQUEST A SEAT</span>
              <h3 className="text-2xl font-extrabold text-slate-950">Found the right route? Ask to join.</h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Check the route, timing, available seats and student profile before sending a request.
              </p>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs font-semibold">
                ⚠️ <strong>Important Rule:</strong> Requesting a seat does not confirm your ride.
              </div>
            </div>

            {/* CENTRAL 3D PHYSICAL IPHONE MOCKUP FRAME */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                style={{
                  transform: `translate3d(${phoneX}vw, ${phoneY}px, 0px) scale(${phoneScale}) rotateY(${phoneRotateY}deg)`,
                  transformStyle: 'preserve-3d',
                  perspective: '1200px',
                  transition: reducedMotion ? 'none' : 'transform 75ms linear'
                }}
                className="w-[300px] sm:w-[340px] shrink-0 pointer-events-auto shadow-2xl rounded-[48px] border-[10px] border-slate-900 bg-slate-950 p-3 relative"
              >
                {/* Dynamic Island / iPhone Notch */}
                <div className="w-24 h-4 bg-slate-900 rounded-full mx-auto mb-2 relative z-30"></div>

                {/* iPhone Screen Content Wrapper */}
                <div className="bg-slate-950 text-white rounded-[36px] overflow-hidden min-h-[480px] p-4 flex flex-col justify-between border border-slate-800 relative z-20">
                  
                  {/* SCREEN 1: FIND A RIDE */}
                  {phoneScreen === 'find' && (
                    <div className="space-y-4 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="text-xs font-bold text-white">Rydeon App</span>
                        <span className="text-[10px] text-teal-400 font-bold">Find Rides</span>
                      </div>

                      <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 space-y-2">
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Corridor Search</p>
                        <div className="bg-slate-950 p-2.5 rounded-xl text-xs font-bold border border-slate-800 flex justify-between">
                          <span>Campus</span>
                          <span className="text-teal-400">→</span>
                          <span>Hinjewadi</span>
                        </div>
                        <p className="text-[10px] text-slate-400">Today · 4:00 PM</p>
                      </div>

                      {/* Ride Card Result 1 */}
                      <div className="bg-slate-900 border border-slate-700 p-3 rounded-2xl space-y-2 shadow-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-teal-600 text-white font-bold flex items-center justify-center text-xs">AK</div>
                            <div>
                              <p className="text-xs font-bold text-white">Aniket Kumar</p>
                              <p className="text-[9px] text-teal-400">✓ Verified Student</p>
                            </div>
                          </div>
                          <span className="text-xs font-black text-white">₹120/seat</span>
                        </div>
                        <div className="pt-1.5 flex items-center justify-between text-[11px] border-t border-slate-800">
                          <span className="text-slate-300">4:00 PM · 3 seats left</span>
                          <span className="text-teal-400 font-bold text-[10px]">Available</span>
                        </div>
                      </div>

                      {/* Ride Card Result 2 */}
                      <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-white">Mohit S. (4:30 PM)</span>
                          <span className="font-bold text-slate-200">₹100/seat</span>
                        </div>
                        <p className="text-[10px] text-slate-400">2 seats left · Campus → Hinjewadi</p>
                      </div>
                    </div>
                  )}

                  {/* SCREEN 2: RIDE MATCH / REQUEST */}
                  {phoneScreen === 'request' && (
                    <div className="space-y-4 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="text-xs font-bold text-white">Ride Details</span>
                        <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-bold">
                          PENDING
                        </span>
                      </div>

                      <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 space-y-2">
                        <p className="text-xs font-bold text-white">Pune / Campus → Hinjewadi</p>
                        <p className="text-xs text-slate-300">Host: Verified Student Driver</p>
                        <p className="text-xs text-slate-300">Price: ₹120 · Available seats: 2</p>
                      </div>

                      <div className="p-3 bg-amber-950/40 border border-amber-800/60 rounded-xl text-[11px] text-amber-200">
                        Sending a request tells the driver you'd like to join. Requesting does not confirm your ride.
                      </div>

                      <button className="w-full bg-teal-600 text-white font-bold py-2.5 rounded-xl text-xs shadow">
                        Request Sent (Status: Pending)
                      </button>
                    </div>
                  )}

                  {/* SCREEN 3: HOST DECIDES */}
                  {phoneScreen === 'host_decides' && (
                    <div className="space-y-4 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="text-xs font-bold text-teal-400">Host Dashboard</span>
                        <span className="text-[10px] text-slate-400">1 Request</span>
                      </div>

                      <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 space-y-3">
                        <p className="text-xs font-bold text-white">NEW RIDE REQUEST</p>
                        <p className="text-xs text-slate-300">Manas Pandya (Verified Student)</p>
                        <p className="text-[11px] text-slate-400">Pune → Hinjewadi · 1 seat</p>

                        <div className="flex gap-2 pt-1">
                          <button className="flex-1 bg-emerald-600 text-white font-bold py-2 rounded-lg text-xs">
                            [ Accept ]
                          </button>
                          <button className="flex-1 bg-rose-950 text-rose-300 border border-rose-800 font-bold py-2 rounded-lg text-xs">
                            [ Reject ]
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SCREEN 4: CONFIRMED */}
                  {phoneScreen === 'confirmed' && (
                    <div className="space-y-4 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="text-xs font-bold text-emerald-400">✓ RIDE CONFIRMED</span>
                        <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded font-bold">
                          Seat Locked
                        </span>
                      </div>

                      <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 space-y-2 text-xs">
                        <p className="text-slate-200 font-bold">Pune → Hinjewadi</p>
                        <p className="text-emerald-400 font-semibold">Status: CONFIRMED</p>
                        <p className="text-slate-400">Driver: Verified Student</p>
                      </div>

                      <div className="bg-emerald-950/60 border border-emerald-800/60 p-3 rounded-xl text-xs text-emerald-200">
                        🎉 Chat is now available!
                      </div>

                      <button className="w-full bg-teal-600 text-white font-bold py-2 rounded-xl text-xs">
                        [ Open Chat ]
                      </button>
                    </div>
                  )}

                  {/* SCREEN 5: CHAT */}
                  {phoneScreen === 'chat' && (
                    <div className="space-y-3 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="text-xs font-bold text-white">Ride Chat</span>
                        <span className="text-[9px] bg-teal-950 text-teal-300 border border-teal-800 px-2 py-0.5 rounded-full font-bold">
                          Unlocked Post-Acceptance
                        </span>
                      </div>

                      <div className="space-y-2 text-[11px]">
                        <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-slate-200 max-w-[85%]">
                          <p className="text-[9px] text-teal-400 font-bold">Driver:</p>
                          <p>"Hey, I'm leaving campus at 4."</p>
                        </div>
                        <div className="bg-teal-950 border border-teal-800 p-2.5 rounded-xl text-teal-100 max-w-[85%] ml-auto">
                          <p className="text-[9px] text-teal-300 font-bold">You:</p>
                          <p>"Perfect, I'll meet you near the main gate."</p>
                        </div>
                      </div>

                      <div className="pt-2 text-center text-[10px] font-bold text-emerald-400">
                        ✓ Ride confirmed & coordinated
                      </div>
                    </div>
                  )}

                  <div className="text-center pt-2 border-t border-slate-800 text-[10px] text-slate-500 font-mono">
                    Rydeon Verified Lifecycle
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT STORY TEXT PANEL (Visible when Phone is Left/Center) */}
            <div className={`w-full max-w-sm space-y-4 ml-auto transition-all duration-300 ${
              scrollProgress < 0.28 || (scrollProgress >= 0.44 && scrollProgress < 0.60) ? 'opacity-100 translate-x-0' : 'opacity-20 pointer-events-none'
            }`}>
              {scrollProgress < 0.28 ? (
                <>
                  <span className="px-3 py-1 rounded-full bg-slate-950 text-teal-400 text-xs font-black">01 · FIND YOUR RIDE</span>
                  <h3 className="text-2xl font-extrabold text-slate-950">Tell us where you're headed.</h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    Search routes from students travelling the same way. See the time, seats and price before you request a ride.
                  </p>
                </>
              ) : (
                <>
                  <span className="px-3 py-1 rounded-full bg-slate-950 text-teal-400 text-xs font-black">03 · HOST DECIDES</span>
                  <h3 className="text-2xl font-extrabold text-slate-950">The host decides who joins.</h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    The driver receives your request and can accept or reject it based on seat availability and route fit.
                  </p>
                </>
              )}
            </div>

          </div>

          {/* Footer Guidance inside Viewport */}
          <div className="max-w-7xl mx-auto w-full text-center text-xs font-bold text-slate-400 z-30">
            Scroll to progress through the Rydeon product story ↓
          </div>

        </div>

      </div>

      {/* ============================================================ */}
      {/* 15, 16, 17 & 18 THREE-PHONE VERIFICATION & BOLD BLUE SECTION */}
      {/* ============================================================ */}
      <section className="py-24 px-4 sm:px-6 bg-[#0a0f1d] text-white relative overflow-hidden transition-colors duration-500">
        
        <div className="max-w-7xl mx-auto text-center space-y-12 relative z-10">
          
          <div className="space-y-3 max-w-3xl mx-auto">
            <span className="text-xs font-bold text-teal-400 uppercase tracking-widest block">VERIFIED CAMPUS TRUST</span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              Every ride, verified.
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Know who's on the other side. Connect with verified students from your campus community.
            </p>
          </div>

          {/* THREE-PHONE COMPOSITION */}
          <div className="py-8 flex items-center justify-center relative min-h-[460px]">
            
            {/* LEFT PHONE: STUDENT IDENTITY */}
            <div
              style={{
                transform: `translateX(${leftPhoneX}px) scale(0.85) rotateZ(-8deg) rotateY(-10deg)`,
                transition: reducedMotion ? 'none' : 'transform 100ms ease-out'
              }}
              className="w-[260px] sm:w-[300px] rounded-[36px] border-[8px] border-slate-800 bg-slate-950 p-3 shadow-2xl shrink-0 absolute z-10"
            >
              <div className="bg-slate-900 rounded-[28px] p-4 text-left space-y-3 border border-slate-800 text-xs">
                <span className="text-[10px] font-bold text-teal-400 bg-teal-950 px-2 py-0.5 rounded border border-teal-800">
                  Student Verification
                </span>
                <p className="font-extrabold text-white text-sm">Student Identity</p>
                <p className="text-slate-300">College: Pimpri Chinchwad University</p>
                <div className="pt-2 border-t border-slate-800 space-y-1 text-slate-400 text-[11px]">
                  <p>✓ College Email Verified</p>
                  <p>✓ Student Community ID</p>
                </div>
              </div>
            </div>

            {/* CENTER PHONE: CAMPUS IDENTITY */}
            <div
              style={{
                transform: 'scale(1.0)',
                transition: reducedMotion ? 'none' : 'transform 100ms ease-out'
              }}
              className="w-[280px] sm:w-[320px] rounded-[40px] border-[8px] border-teal-600 bg-slate-950 p-3 shadow-2xl shrink-0 relative z-20"
            >
              <div className="bg-slate-900 rounded-[32px] p-5 text-left space-y-3 border border-slate-800 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400">✓ EMAIL VERIFIED</span>
                  <span className="text-[10px] text-slate-400">Campus Complete</span>
                </div>
                <p className="font-black text-white text-base">Campus Identity</p>
                <p className="text-slate-300">Connect your account with your verified college identity.</p>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] space-y-1 text-slate-300">
                  <p>✓ 14 Verified Transits</p>
                  <p>✓ 4.9 Student Rating</p>
                </div>
              </div>
            </div>

            {/* RIGHT PHONE: DRIVER VERIFICATION */}
            <div
              style={{
                transform: `translateX(${rightPhoneX}px) scale(0.85) rotateZ(8deg) rotateY(10deg)`,
                transition: reducedMotion ? 'none' : 'transform 100ms ease-out'
              }}
              className="w-[260px] sm:w-[300px] rounded-[36px] border-[8px] border-slate-800 bg-slate-950 p-3 shadow-2xl shrink-0 absolute z-10"
            >
              <div className="bg-slate-900 rounded-[28px] p-4 text-left space-y-3 border border-slate-800 text-xs">
                <span className="text-[10px] font-bold text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800">
                  Driver Verification
                </span>
                <p className="font-extrabold text-white text-sm">Driver Verification</p>
                <p className="text-slate-300">Verified drivers offer rides with trust & transparency.</p>
                <div className="pt-2 border-t border-slate-800 space-y-1 text-slate-400 text-[11px]">
                  <p>✓ Verified Driver Profile</p>
                  <p>✓ Route Details Checked</p>
                </div>
              </div>
            </div>

          </div>

          {/* THREE SUPPORTING VERIFICATION CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left pt-6 max-w-5xl mx-auto">
            <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-2">
              <h4 className="text-base font-bold text-white">Student identity</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Verify your student identity and build trust within the Rydeon campus community.
              </p>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-2">
              <h4 className="text-base font-bold text-white">Campus identity</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Connect your account with your verified college identity for safer shared routes.
              </p>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-2">
              <h4 className="text-base font-bold text-white">Driver verification</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Verified drivers can offer rides with greater trust, profile visibility, and route clarity.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 20, 21 & 22. EARLY RIDERS / TESTIMONIAL MARQUEE SECTION */}
      {/* ============================================================ */}
      <section className="py-20 sm:py-28 bg-[#f4f7fb] border-b border-slate-200/80 overflow-hidden">
        <div className="space-y-12">
          
          <div className="text-center max-w-3xl mx-auto px-4 space-y-3">
            <span className="text-xs font-bold text-teal-700 uppercase tracking-widest block">EARLY RIDERS</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
              Real students. Real routes. Real savings.
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              What students are saying after sharing rides with people from their campus.
            </p>
          </div>

          {/* MARQUEE CONTAINER (Hover pauses tracks) */}
          <div className="marquee-container space-y-6">
            
            {/* ROW 1: LEADING RIGHT */}
            <div className="overflow-hidden w-full">
              <div className="marquee-track-right">
                {[...testimonialsRow1, ...testimonialsRow1].map((item, idx) => (
                  <div
                    key={`r1-${idx}`}
                    className="w-[340px] sm:w-[380px] bg-white p-6 rounded-2xl border border-slate-200 shadow-sm shrink-0 flex flex-col justify-between space-y-4"
                  >
                    <p className="text-slate-700 text-xs sm:text-sm leading-relaxed italic">
                      "{item.quote}"
                    </p>
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-slate-950">{item.name}</p>
                        <p className="text-[10px] text-slate-500">{item.role} · {item.college}</p>
                      </div>
                      <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-100">
                        {item.savings}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ROW 2: LEADING LEFT */}
            <div className="overflow-hidden w-full">
              <div className="marquee-track-left">
                {[...testimonialsRow2, ...testimonialsRow2].map((item, idx) => (
                  <div
                    key={`r2-${idx}`}
                    className="w-[340px] sm:w-[380px] bg-white p-6 rounded-2xl border border-slate-200 shadow-sm shrink-0 flex flex-col justify-between space-y-4"
                  >
                    <p className="text-slate-700 text-xs sm:text-sm leading-relaxed italic">
                      "{item.quote}"
                    </p>
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-slate-950">{item.name}</p>
                        <p className="text-[10px] text-slate-500">{item.role} · {item.college}</p>
                      </div>
                      <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-100">
                        {item.savings}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 23. FAQ SECTION */}
      {/* ============================================================ */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 max-w-7xl mx-auto border-b border-slate-200/80">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT SIDE: FAQ HEADER & CTAs */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-bold text-teal-700 uppercase tracking-widest block">QUESTIONS, ANSWERED</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
              Ready to ride?
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Straight answers about safety, student verification, ride requests and how Rydeon works.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                to="/find-rides"
                className="px-6 py-3 bg-slate-950 text-white rounded-xl text-xs font-bold shadow hover:bg-slate-800 transition"
              >
                Find a Ride
              </Link>
              <Link
                to="/about"
                className="px-6 py-3 bg-white border border-slate-200 text-slate-800 rounded-xl text-xs font-bold hover:bg-slate-50 transition"
              >
                About Rydeon →
              </Link>
            </div>
          </div>

          {/* RIGHT SIDE: ACCORDION LIST */}
          <div className="lg:col-span-7 space-y-3">
            {faqs.map((faq) => {
              const isOpen = openFaq === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    faq.highlight
                      ? 'bg-amber-50/60 border-amber-200'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-950 focus:outline-none"
                  >
                    <span className="flex items-center gap-2">
                      {faq.highlight && <span className="text-amber-600">⚡</span>}
                      {faq.q}
                    </span>
                    <span className={`grid h-7 w-7 place-items-center rounded-xl bg-slate-100 text-slate-600 font-bold transition-transform duration-200 ${
                      isOpen ? 'rotate-45 bg-slate-950 text-white' : ''
                    }`}>
                      +
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 24. SPACIOUS FOOTER */}
      {/* ============================================================ */}
      <footer className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 text-center md:text-left">
            
            {/* Brand */}
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center justify-center md:justify-start gap-2.5">
                <img src="/logo.png" alt="Rydeon Logo" className="h-8 w-8 object-contain" />
                <span className="text-2xl font-black text-slate-950">Rydeon</span>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed max-w-sm mx-auto md:mx-0">
                Student-to-student ride-sharing platform connecting verified commuters across Pune campus corridors.
              </p>
              <p className="text-slate-400 text-[11px]">© 2026 Rydeon. All rights reserved.</p>
            </div>

            {/* Product Links */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-950">PRODUCT</h4>
              <ul className="space-y-2 text-xs font-semibold text-slate-600">
                <li><Link to="/how-it-works" className="hover:text-slate-950 transition">How It Works</Link></li>
                <li><Link to="/find-rides" className="hover:text-slate-950 transition">Find a Ride</Link></li>
                <li><Link to="/offer" className="hover:text-slate-950 transition">Offer a Ride</Link></li>
                <li><Link to="/safety" className="hover:text-slate-950 transition">Safety</Link></li>
                <li><Link to="/dashboard" className="hover:text-slate-950 transition">FAQ</Link></li>
              </ul>
            </div>

            {/* Company Links */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-950">COMPANY</h4>
              <ul className="space-y-2 text-xs font-semibold text-slate-600">
                <li><Link to="/about" className="hover:text-slate-950 transition">About</Link></li>
                <li><Link to="/resources" className="hover:text-slate-950 transition">Resources</Link></li>
                <li><a href="mailto:teamrydeon@gmail.com" className="hover:text-slate-950 transition">Contact</a></li>
              </ul>
            </div>

            {/* Legal / Social */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-950">LEGAL & SOCIAL</h4>
              <ul className="space-y-2 text-xs font-semibold text-slate-600">
                <li><Link to="/safety" className="hover:text-slate-950 transition">Privacy Policy</Link></li>
                <li><Link to="/safety" className="hover:text-slate-950 transition">Terms & Conditions</Link></li>
                <li><a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-slate-950 transition">LinkedIn</a></li>
                <li><a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-slate-950 transition">Instagram</a></li>
              </ul>
            </div>

          </div>

          {/* Large Wordmark at Bottom */}
          <div className="pt-8 border-t border-slate-100 text-center">
            <span className="text-5xl sm:text-7xl font-black tracking-widest text-slate-200 select-none uppercase">
              RYDEON
            </span>
          </div>

        </div>
      </footer>

    </div>
  );
}

export default Landing;
