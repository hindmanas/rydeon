import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Image assets
import studentDriver from '../assets/student_driver.jpg';
import campusStudentsWaiting from '../assets/campus_students_waiting.jpg';
import studentCarpoolChat from '../assets/student_carpool_chat.jpg';
import studentsBook from '../assets/students_book.jpg';
import studentsRide from '../assets/students_ride.jpg';

// Uploaded Real Rydeon Phone Assets
import rydeonCover from '../assets/rydeon cover.png';
import findRide from '../assets/Find ride.png';
import findRequest from '../assets/find request.png';
import requestAccepted from '../assets/request accepted.png';
import emailVerified from '../assets/email verified.png';
import identityAsset from '../assets/Identity.png';
import verificationAsset from '../assets/verification.png';

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

const storySteps = [
  {
    id: 1,
    stepNum: '01',
    eyebrow: 'FIND YOUR RIDE',
    title: "Tell us where you're headed.",
    description: 'Search routes from students travelling the same way. See the time, seats and price before you request a ride.',
    phoneImage: findRide,
    alertText: null
  },
  {
    id: 2,
    stepNum: '02',
    eyebrow: 'REQUEST A SEAT',
    title: 'Found the right route? Ask to join.',
    description: 'Check the route, timing, available seats and student profile before sending a request.',
    phoneImage: findRequest,
    alertText: 'Requesting a seat does not confirm your ride.'
  },
  {
    id: 3,
    stepNum: '03',
    eyebrow: 'HOST DECIDES',
    title: 'The host decides who joins.',
    description: 'The driver receives your request and can accept or reject it based on seat availability and route fit.',
    phoneImage: requestAccepted,
    alertText: null
  },
  {
    id: 4,
    stepNum: '04',
    eyebrow: 'CONFIRMED & CHAT',
    title: 'Once accepted, chat is unlocked.',
    description: 'Coordinate pickup spots, departure timings and ride details securely within the app.',
    phoneImage: verificationAsset,
    alertText: null
  }
];

function Landing() {
  const navigate = useNavigate();
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [openFaq, setOpenFaq] = useState(4);
  const [userMode, setUserMode] = useState('rider');
  const [isMobile, setIsMobile] = useState(false);

  // GSAP Animation Refs
  const outerWrapperRef = useRef(null);
  const pinnedStageRef = useRef(null);
  const svgPathRef = useRef(null);
  const phoneWrapperRef = useRef(null);
  const phoneImagesRef = useRef([]);
  const textBlocksRef = useRef([]);
  const dotsRef = useRef([]);
  const activeStepTextRef = useRef(null);

  // Section 3 Fan-In Refs
  const section3Ref = useRef(null);
  const fanPhoneLeftRef = useRef(null);
  const fanPhoneCenterRef = useRef(null);
  const fanPhoneRightRef = useRef(null);
  const fanCardsRef = useRef(null);

  const [activeStep, setActiveStep] = useState(0);

  // Check mobile viewport (< 768px gets vertical fallback for pinned section; >= 768px gets GSAP pinned scrub)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // GSAP Pinned Storytelling & ScrollTrigger Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Pinned Scrubbed Storytelling (Laptop & Desktop viewports >= 768px)
      if (window.innerWidth >= 768 && outerWrapperRef.current) {
        const path = svgPathRef.current;
        if (path) {
          const length = path.getTotalLength();
          gsap.set(path, {
            strokeDasharray: length,
            strokeDashoffset: length
          });
        }

        // Initialize text blocks (Step 0 visible, 1-3 hidden)
        textBlocksRef.current.forEach((el, index) => {
          if (el) {
            gsap.set(el, {
              opacity: index === 0 ? 1 : 0,
              y: index === 0 ? 0 : 20,
              pointerEvents: index === 0 ? 'auto' : 'none'
            });
          }
        });

        // Initialize phone image screens (Step 0 visible, 1-3 hidden)
        phoneImagesRef.current.forEach((img, index) => {
          if (img) {
            gsap.set(img, {
              opacity: index === 0 ? 1 : 0
            });
          }
        });

        // Initialize progress dots (Step 0 expanded & active)
        dotsRef.current.forEach((dot, index) => {
          if (dot) {
            gsap.set(dot, {
              width: index === 0 ? 32 : 10,
              backgroundColor: index === 0 ? '#0d9488' : '#cbd5e1'
            });
          }
        });

        // Main Scrubbed Pinned Animation Timeline
        const mainTl = gsap.timeline({
          scrollTrigger: {
            trigger: outerWrapperRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
            pin: pinnedStageRef.current,
            anticipatePin: 1,
            // markers: true, // Commented-out debug markers (remember to remove before shipping)
          }
        });

        // Path Draw across timeline duration (4.0 units)
        if (path) {
          mainTl.to(path, {
            strokeDashoffset: 0,
            ease: 'none',
            duration: 4.0
          }, 0);
        }

        // Step transitions (0 -> 1 -> 2 -> 3)
        const stepsCount = storySteps.length;
        for (let i = 0; i < stepsCount; i++) {
          const stepTime = i * 1.0;

          mainTl.call(() => {
            setActiveStep(i);
          }, null, stepTime === 0 ? 0.01 : stepTime);

          dotsRef.current.forEach((dot, dIdx) => {
            if (dot) {
              mainTl.to(dot, {
                width: dIdx === i ? 32 : 10,
                backgroundColor: dIdx === i ? '#0d9488' : '#cbd5e1',
                duration: 0.35,
                ease: 'power2.out'
              }, stepTime);
            }
          });

          if (i < stepsCount - 1) {
            const nextStepTime = (i + 1) * 1.0;
            const exitTime = nextStepTime - 0.25;
            const enterTime = nextStepTime + 0.05;

            if (textBlocksRef.current[i]) {
              mainTl.to(textBlocksRef.current[i], {
                opacity: 0,
                y: -16,
                pointerEvents: 'none',
                duration: 0.35,
                ease: 'power2.in'
              }, exitTime);
            }

            if (textBlocksRef.current[i + 1]) {
              mainTl.to(textBlocksRef.current[i + 1], {
                opacity: 1,
                y: 0,
                pointerEvents: 'auto',
                duration: 0.4,
                ease: 'power3.out'
              }, enterTime);
            }

            if (phoneWrapperRef.current) {
              mainTl.to(phoneWrapperRef.current, {
                rotateY: -70,
                scale: 0.85,
                opacity: 0.4,
                duration: 0.3,
                ease: 'power2.in'
              }, exitTime);

              if (phoneImagesRef.current[i]) {
                mainTl.to(phoneImagesRef.current[i], {
                  opacity: 0,
                  duration: 0.05
                }, nextStepTime - 0.05);
              }

              if (phoneImagesRef.current[i + 1]) {
                mainTl.to(phoneImagesRef.current[i + 1], {
                  opacity: 1,
                  duration: 0.05
                }, nextStepTime - 0.05);
              }

              mainTl.set(phoneWrapperRef.current, {
                rotateY: 70
              }, nextStepTime - 0.01);

              mainTl.to(phoneWrapperRef.current, {
                rotateY: 0,
                scale: 1,
                opacity: 1,
                duration: 0.45,
                ease: 'power3.out'
              }, enterTime);
            }
          }
        }
      }

      // 2. Sticky Nav Recolor on Section Enter (All viewports)
      const navPill = document.querySelector('.landing-nav-pill');
      if (navPill && section3Ref.current) {
        ScrollTrigger.create({
          trigger: section3Ref.current,
          start: 'top 80px',
          end: 'bottom top',
          onEnter: () => navPill.classList.add('dark-nav'),
          onLeaveBack: () => navPill.classList.remove('dark-nav'),
          onLeave: () => navPill.classList.remove('dark-nav'),
          onEnterBack: () => navPill.classList.add('dark-nav')
        });
      }

      // 3. Fully Responsive Symmetrical Fan-In Entrance for Section 3 ("Every ride, verified.")
      if (section3Ref.current) {
        const fanTl = gsap.timeline({
          scrollTrigger: {
            trigger: section3Ref.current,
            start: 'top 65%',
            toggleActions: 'play reverse play reverse'
          }
        });

        // Compute exact responsive offset based on current viewport width
        const w = window.innerWidth;
        const fanOffset = w >= 1280 ? 280 : w >= 1024 ? 240 : w >= 768 ? 180 : w >= 480 ? 115 : 72;
        const leftRotateZ = w < 480 ? -4 : -6;
        const rightRotateZ = w < 480 ? 4 : 6;

        gsap.set([fanPhoneLeftRef.current, fanPhoneCenterRef.current, fanPhoneRightRef.current], {
          top: '50%',
          left: '50%',
          xPercent: -50,
          yPercent: -50,
          transformOrigin: 'center center'
        });

        // Initial collapsed state in exact center
        gsap.set(fanPhoneLeftRef.current, { x: 0, y: 50, rotateZ: 0, rotateY: 0, scale: 0.65, opacity: 0, zIndex: 10 });
        gsap.set(fanPhoneCenterRef.current, { x: 0, y: 70, rotateZ: 0, rotateY: 0, scale: 0.75, opacity: 0, zIndex: 30 });
        gsap.set(fanPhoneRightRef.current, { x: 0, y: 50, rotateZ: 0, rotateY: 0, scale: 0.65, opacity: 0, zIndex: 10 });

        if (fanCardsRef.current) {
          gsap.set(fanCardsRef.current.children, { y: 30, opacity: 0 });
        }

        fanTl
          .to(fanPhoneCenterRef.current, {
            x: 0,
            y: 0,
            scale: 1.0,
            opacity: 1,
            duration: 0.75,
            ease: 'power3.out'
          })
          .to(fanPhoneLeftRef.current, {
            x: -fanOffset,
            y: 0,
            rotateZ: leftRotateZ,
            rotateY: -10,
            scale: 0.85,
            opacity: 1,
            duration: 0.75,
            ease: 'power3.out'
          }, '-=0.45')
          .to(fanPhoneRightRef.current, {
            x: fanOffset,
            y: 0,
            rotateZ: rightRotateZ,
            rotateY: 10,
            scale: 0.85,
            opacity: 1,
            duration: 0.75,
            ease: 'power3.out'
          }, '-=0.45')
          .to(fanCardsRef.current ? fanCardsRef.current.children : [], {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.12,
            ease: 'power2.out'
          }, '-=0.3');
      }

    }, outerWrapperRef);

    return () => ctx.revert();
  }, [isMobile]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!pickup && !destination) return;
    navigate('/find-rides', { state: { pickup, destination } });
  };

  // Testimonials Rows Data
  const testimonialsRow1 = [
    {
      id: 1,
      quote: "No more searching through five WhatsApp groups just to find someone going the same way. I posted my route and found a classmate in minutes.",
      name: "Om Lokhande",
      role: "4th Year CS",
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
    <div className="font-sans text-[#101D3A] bg-[#F7FAFE] min-h-screen overflow-x-hidden selection:bg-[#1683F8] selection:text-white">

      {/* ============================================================ */}
      {/* SECTION 1: HERO & SEARCH BANNER */}
      {/* ============================================================ */}
      <section className="relative pt-24 sm:pt-28 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#101D3A] via-[#101D3A] to-[#1683F8]/90 text-white overflow-hidden min-h-[80vh] flex flex-col justify-between">

        {/* Cover Background Accent */}
        <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
          <img src={rydeonCover} alt="Rydeon Background Scene" className="w-full h-full object-cover object-center filter blur-sm scale-105" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#101D3A]/90 via-[#101D3A]/70 to-[#F7FAFE]" />
        </div>

        <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col items-center text-center space-y-6 sm:space-y-8 pt-4 sm:pt-8">

          <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-[#1683F8]/20 border border-[#1683F8]/40 text-blue-200 text-[11px] sm:text-xs font-bold tracking-wide backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#168BFF] animate-pulse" />
            VERIFIED CAMPUS COMMUTE PLATFORM
          </div>

          <div className="max-w-3xl mx-auto space-y-3 sm:space-y-4">
            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight leading-tight">
              <span className="text-[#168BFF] block">Going somewhere?</span>
              <span className="text-white block mt-1">Go together.</span>
            </h1>
            <p className="text-blue-100 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Find verified students travelling your way across Pune. Share the ride, split fuel costs, and ride safe.
            </p>
          </div>

          {/* Quick Route Search Form */}
          <form onSubmit={handleSearchSubmit} className="w-full max-w-3xl bg-white/95 backdrop-blur-xl p-3 sm:p-4 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/40 text-[#101D3A] grid grid-cols-1 sm:grid-cols-12 gap-2.5 sm:gap-3 items-center">
            <div className="sm:col-span-5 relative flex items-center">
              <MapPinIcon className="absolute left-3.5 h-4 w-4 sm:h-5 sm:w-5 text-[#1683F8] pointer-events-none" />
              <input
                type="text"
                placeholder="Pickup (e.g. PCU Campus)"
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                className="w-full pl-10 sm:pl-11 pr-3 py-2.5 sm:py-3 rounded-xl bg-[#F7FAFE] border border-[#DCE5F0] text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#1683F8] transition"
              />
            </div>

            <div className="sm:col-span-5 relative flex items-center">
              <RouteIcon className="absolute left-3.5 h-4 w-4 sm:h-5 sm:w-5 text-[#1683F8] pointer-events-none" />
              <input
                type="text"
                placeholder="Destination (e.g. Pune Station)"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full pl-10 sm:pl-11 pr-3 py-2.5 sm:py-3 rounded-xl bg-[#F7FAFE] border border-[#DCE5F0] text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#1683F8] transition"
              />
            </div>

            <button
              type="submit"
              className="sm:col-span-2 w-full py-2.5 sm:py-3 px-4 bg-[#1683F8] hover:bg-[#168BFF] text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-[#1683F8]/30 flex items-center justify-center gap-1.5 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Search</span>
              <ArrowRightIcon className="h-4 w-4" />
            </button>
          </form>

          {/* Hero Standout Phone Preview */}
          <div className="pt-2 sm:pt-4 max-w-[180px] xs:max-w-[210px] sm:max-w-[260px] mx-auto filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)] transform hover:scale-105 transition-transform duration-300">
            <img src={findRide} alt="Rydeon Find Ride App Preview" className="w-full h-auto rounded-2xl sm:rounded-3xl object-contain" />
          </div>

        </div>

      </section>

      {/* ============================================================ */}
      {/* SECTION 2: PINNED STORYTELLING SECTION (GSAP + ScrollTrigger) */}
      {/* ============================================================ */}
      {isMobile ? (
        /* Mobile Vertical Stack Fallback (< 768px Viewports) */
        <section className="py-12 sm:py-16 px-4 bg-white border-t border-[#DCE5F0] space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold text-[#1683F8] uppercase tracking-widest block">HOW IT WORKS</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#101D3A]">Your ride, from request to confirmed.</h2>
          </div>

          <div className="max-w-xl mx-auto space-y-6">
            {storySteps.map((step) => (
              <div key={step.id} className="bg-[#F7FAFE] p-5 sm:p-6 rounded-3xl border border-[#DCE5F0] space-y-3.5 shadow-sm overflow-hidden">
                <span className="inline-block px-3 py-1 rounded-full bg-[#101D3A] text-[#168BFF] text-xs font-black">
                  {step.stepNum} · {step.eyebrow}
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-[#101D3A]">{step.title}</h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{step.description}</p>
                {step.alertText && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs font-semibold flex items-center gap-2">
                    <span>⚠️</span>
                    <span><strong>Important Rule:</strong> {step.alertText}</span>
                  </div>
                )}
                <div className="pt-2 flex justify-center">
                  <img src={step.phoneImage} alt={step.title} className="w-[180px] xs:w-[200px] sm:w-[240px] h-auto drop-shadow-xl rounded-2xl object-contain" />
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        /* Laptop / Desktop Scrubbed Pinned Storytelling Container */
        <div ref={outerWrapperRef} className="relative w-full h-[400vh] bg-[#F7FAFE]">

          {/* Pinned Stage (fixed 100vh during scroll distance) */}
          <div ref={pinnedStageRef} className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between py-6 px-4 sm:px-8 lg:px-12 bg-[#F7FAFE] z-10">

            {/* Background SVG Decorative Hand-Traced Curved Path */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-60" viewBox="0 0 1200 800" fill="none" preserveAspectRatio="none">
              <path
                ref={svgPathRef}
                d="M 120,160 C 400,90 520,420 320,560 C 180,660 780,720 1100,620"
                stroke="url(#pinnedLineGrad)"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="pinnedLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1683F8" />
                  <stop offset="50%" stopColor="#168BFF" />
                  <stop offset="100%" stopColor="#101D3A" />
                </linearGradient>
              </defs>
            </svg>

            {/* Top Stage Header Controls */}
            <div className="max-w-7xl mx-auto w-full flex items-center justify-between z-20 pt-4">
              <div>
                <span className="block text-[11px] font-black uppercase tracking-widest text-[#1683F8]">HOW IT WORKS</span>
                <h2 className="text-2xl lg:text-3xl font-extrabold text-[#101D3A] tracking-tight">Your ride, from request to confirmed.</h2>
              </div>

              {/* Rider / Host Toggle Control */}
              <div className="flex bg-[#EEF7FF] p-1 rounded-xl border border-[#DCE5F0] text-xs font-bold shadow-inner">
                <button
                  type="button"
                  onClick={() => setUserMode('rider')}
                  className={`px-3.5 py-1.5 rounded-lg transition-all ${userMode === 'rider' ? 'bg-[#1683F8] text-white shadow-sm' : 'text-slate-600 hover:text-[#101D3A]'}`}
                >
                  I'm a Rider
                </button>
                <button
                  type="button"
                  onClick={() => setUserMode('host')}
                  className={`px-3.5 py-1.5 rounded-lg transition-all ${userMode === 'host' ? 'bg-[#1683F8] text-white shadow-sm' : 'text-slate-600 hover:text-[#101D3A]'}`}
                >
                  I'm a Host
                </button>
              </div>
            </div>

            {/* Central Pinned Stage Grid (Text Blocks + Center 3D Phone + Progress Dots) */}
            <div className="max-w-7xl mx-auto w-full flex-1 relative grid grid-cols-12 items-center gap-8 z-20">

              {/* LEFT SIDE: TEXT BLOCK STACK (Overlapping absolutely positioned blocks) */}
              <div className="col-span-5 relative h-[320px] flex items-center">
                {storySteps.map((step, idx) => (
                  <div
                    key={step.id}
                    ref={(el) => (textBlocksRef.current[idx] = el)}
                    className="absolute inset-x-0 space-y-4 bg-white/90 backdrop-blur-md p-6 lg:p-8 rounded-3xl border border-[#DCE5F0] shadow-xl shadow-blue-900/5 transition-all duration-200"
                  >
                    <span className="inline-block px-3 py-1 rounded-full bg-[#101D3A] text-[#168BFF] text-xs font-black tracking-wide">
                      {step.stepNum} · {step.eyebrow}
                    </span>
                    <h3 className="text-2xl lg:text-3xl font-black text-[#101D3A] leading-tight">
                      {step.title}
                    </h3>
                    <p className="text-slate-600 text-sm lg:text-base leading-relaxed">
                      {step.description}
                    </p>
                    {step.alertText && (
                      <div className="p-3 bg-amber-50/90 border border-amber-200/90 rounded-xl text-amber-900 text-xs font-bold flex items-center gap-2">
                        <span>⚠️</span>
                        <span><strong>Important Rule:</strong> {step.alertText}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* CENTER SIDE: 3D DEVICE MORPH MOCKUP */}
              <div className="col-span-4 flex justify-center items-center relative h-[520px]" style={{ perspective: '1200px' }}>
                <div
                  ref={phoneWrapperRef}
                  className="w-[260px] sm:w-[280px] lg:w-[310px] h-[520px] shrink-0 relative pointer-events-auto filter drop-shadow-[0_25px_50px_rgba(0,0,0,0.3)] transform-gpu"
                >
                  {storySteps.map((step, idx) => (
                    <img
                      key={step.id}
                      ref={(el) => (phoneImagesRef.current[idx] = el)}
                      src={step.phoneImage}
                      alt={step.title}
                      className="absolute inset-0 w-full h-full object-contain rounded-3xl"
                    />
                  ))}
                </div>
              </div>

              {/* RIGHT SIDE: PROGRESS DOTS & STEP CONTROLS */}
              <div className="col-span-3 flex flex-col items-center lg:items-end space-y-6">

                {/* Active Step Indicator Card */}
                <div className="bg-white/90 backdrop-blur-md border border-[#DCE5F0] p-5 rounded-2xl shadow-sm space-y-2 text-right w-full max-w-[220px]">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#1683F8] block">ACTIVE STEP</span>
                  <p ref={activeStepTextRef} className="text-3xl font-black text-[#101D3A]">{storySteps[activeStep].stepNum} / 04</p>
                  <p className="text-xs font-bold text-slate-600 truncate">{storySteps[activeStep].eyebrow}</p>
                </div>

                {/* Progress Dots Row */}
                <div className="flex items-center gap-2.5 bg-[#EEF7FF] px-4 py-2.5 rounded-full border border-[#DCE5F0]">
                  {storySteps.map((step, idx) => (
                    <div
                      key={step.id}
                      ref={(el) => (dotsRef.current[idx] = el)}
                      className="h-2.5 rounded-full transition-all duration-200 cursor-pointer"
                      title={`Step ${step.stepNum}: ${step.eyebrow}`}
                    />
                  ))}
                </div>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* ============================================================ */}
      {/* LIVE CAMPUS NETWORK MODEL SECTION */}
      {/* ============================================================ */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold text-[#1683F8] uppercase tracking-widest block">INTERACTIVE NETWORK</span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#101D3A] tracking-tight">
            Live Campus Commute Network
          </h2>
          <p className="text-slate-600 text-xs sm:text-base leading-relaxed">
            Real-time visual corridor connecting PCU, Wakad, Hinjewadi IT hubs, Pune Junction and Airport transits.
          </p>
        </div>
        <CampusNetwork />
      </section>

      {/* ============================================================ */}
      {/* SECTION 3: VERIFIED CAMPUS TRUST ("Every ride, verified.") */}
      {/* ============================================================ */}
      <section ref={section3Ref} className="py-16 sm:py-24 px-4 sm:px-6 bg-[#101D3A] text-white relative overflow-hidden transition-colors duration-500">

        <div className="max-w-7xl mx-auto text-center space-y-8 sm:space-y-12 relative z-10">

          <div className="space-y-2 sm:space-y-3 max-w-3xl mx-auto">
            <span className="text-xs font-bold text-[#168BFF] uppercase tracking-widest block">VERIFIED CAMPUS TRUST</span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              Every ride, verified.
            </h2>
            <p className="text-blue-100 text-xs sm:text-base leading-relaxed">
              Know who's on the other side. Connect with verified students from your campus community.
            </p>
          </div>

          {/* THREE-PHONE PERFECTLY RESPONSIVE SYMMETRICAL FAN-IN COMPOSITION */}
          <div className="py-4 sm:py-8 flex items-center justify-center relative h-[360px] xs:h-[400px] sm:h-[460px] lg:h-[540px] w-full max-w-6xl mx-auto overflow-hidden" style={{ perspective: '1200px' }}>

            {/* LEFT PHONE: STUDENT IDENTITY */}
            <div
              ref={fanPhoneLeftRef}
              className="w-[130px] xs:w-[150px] sm:w-[220px] lg:w-[300px] h-[300px] xs:h-[340px] sm:h-[440px] lg:h-[520px] drop-shadow-2xl absolute pointer-events-auto flex items-center justify-center"
            >
              <img src={identityAsset} alt="Student Identity Verification" className="w-full h-full object-contain rounded-2xl sm:rounded-3xl" />
            </div>

            {/* CENTER PHONE: CAMPUS IDENTITY */}
            <div
              ref={fanPhoneCenterRef}
              className="w-[150px] xs:w-[170px] sm:w-[250px] lg:w-[320px] h-[320px] xs:h-[360px] sm:h-[460px] lg:h-[540px] drop-shadow-[0_15px_40px_rgba(22,131,248,0.35)] absolute pointer-events-auto flex items-center justify-center"
            >
              <img src={emailVerified} alt="Campus Identity Email Verified" className="w-full h-full object-contain rounded-2xl sm:rounded-3xl" />
            </div>

            {/* RIGHT PHONE: DRIVER VERIFICATION */}
            <div
              ref={fanPhoneRightRef}
              className="w-[130px] xs:w-[150px] sm:w-[220px] lg:w-[300px] h-[300px] xs:h-[340px] sm:h-[440px] lg:h-[520px] drop-shadow-2xl absolute pointer-events-auto flex items-center justify-center"
            >
              <img src={verificationAsset} alt="Driver Verification Profile" className="w-full h-full object-contain rounded-2xl sm:rounded-3xl" />
            </div>

          </div>

          {/* THREE SUPPORTING VERIFICATION CARDS (CASCADING FAN-IN ENTRANCE) */}
          <div ref={fanCardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 text-left pt-4 sm:pt-6 max-w-5xl mx-auto">
            <div className="bg-[#101D3A]/80 border border-blue-900/60 p-5 sm:p-6 rounded-2xl space-y-2 hover:border-[#1683F8]/50 transition-colors">
              <h4 className="text-sm sm:text-base font-bold text-white">Student identity</h4>
              <p className="text-xs text-blue-100 leading-relaxed">
                Verify your student identity and build trust within the Rydeon campus community.
              </p>
            </div>
            <div className="bg-[#101D3A]/80 border border-blue-900/60 p-5 sm:p-6 rounded-2xl space-y-2 hover:border-[#1683F8]/50 transition-colors">
              <h4 className="text-sm sm:text-base font-bold text-white">Campus identity</h4>
              <p className="text-xs text-blue-100 leading-relaxed">
                Connect your account with your verified college identity for safer shared routes.
              </p>
            </div>
            <div className="bg-[#101D3A]/80 border border-blue-900/60 p-5 sm:p-6 rounded-2xl space-y-2 hover:border-[#1683F8]/50 transition-colors">
              <h4 className="text-sm sm:text-base font-bold text-white">Driver verification</h4>
              <p className="text-xs text-blue-100 leading-relaxed">
                Verified drivers can offer rides with greater trust, profile visibility, and route clarity.
              </p>
            </div>
          </div>

        </div>

      </section>

      {/* ============================================================ */}
      {/* SECTION 4: TESTIMONIAL MARQUEE SECTION */}
      {/* ============================================================ */}
      <section className="py-16 sm:py-28 bg-[#F7FAFE] border-b border-[#DCE5F0] overflow-hidden">
        <div className="space-y-8 sm:space-y-12">

          <div className="text-center max-w-3xl mx-auto px-4 space-y-2 sm:space-y-3">
            <span className="text-xs font-bold text-[#1683F8] uppercase tracking-widest block">EARLY RIDERS</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#101D3A] tracking-tight">
              Real students. Real routes. Real savings.
            </h2>
            <p className="text-slate-600 text-xs sm:text-base leading-relaxed">
              What students are saying after sharing rides with people from their campus.
            </p>
          </div>

          {/* MARQUEE CONTAINER */}
          <div className="marquee-container space-y-4 sm:space-y-6">

            {/* ROW 1: LEADING RIGHT */}
            <div className="marquee-row overflow-hidden w-full">
              <div className="marquee-track-right">
                {[...testimonialsRow1, ...testimonialsRow1].map((item, idx) => (
                  <div
                    key={`r1-${idx}`}
                    className="w-[280px] sm:w-[380px] bg-white p-5 sm:p-6 rounded-2xl border border-[#DCE5F0] shadow-sm shrink-0 flex flex-col justify-between space-y-4 transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-900/10"
                  >
                    <p className="text-slate-700 text-xs sm:text-sm leading-relaxed italic">
                      "{item.quote}"
                    </p>
                    <div className="pt-3 border-t border-[#EEF7FF] flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-[#101D3A]">{item.name}</p>
                        <p className="text-[10px] text-slate-500">{item.role} · {item.college}</p>
                      </div>
                      <span className="text-[10px] font-bold text-[#1683F8] bg-[#EEF7FF] px-2.5 py-1 rounded-full border border-[#DCE5F0]">
                        {item.savings}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ROW 2: LEADING LEFT */}
            <div className="marquee-row overflow-hidden w-full">
              <div className="marquee-track-left">
                {[...testimonialsRow2, ...testimonialsRow2].map((item, idx) => (
                  <div
                    key={`r2-${idx}`}
                    className="w-[280px] sm:w-[380px] bg-white p-5 sm:p-6 rounded-2xl border border-[#DCE5F0] shadow-sm shrink-0 flex flex-col justify-between space-y-4 transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-900/10"
                  >
                    <p className="text-slate-700 text-xs sm:text-sm leading-relaxed italic">
                      "{item.quote}"
                    </p>
                    <div className="pt-3 border-t border-[#EEF7FF] flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-[#101D3A]">{item.name}</p>
                        <p className="text-[10px] text-slate-500">{item.role} · {item.college}</p>
                      </div>
                      <span className="text-[10px] font-bold text-[#1683F8] bg-[#EEF7FF] px-2.5 py-1 rounded-full border border-[#DCE5F0]">
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
      {/* SECTION 5: FAQ SECTION */}
      {/* ============================================================ */}
      <section className="py-16 sm:py-28 px-4 sm:px-6 max-w-7xl mx-auto border-b border-[#DCE5F0]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start">

          {/* LEFT SIDE: FAQ HEADER & CTAs */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-6">
            <span className="text-xs font-bold text-[#1683F8] uppercase tracking-widest block">QUESTIONS, ANSWERED</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#101D3A] tracking-tight">
              Ready to ride?
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Straight answers about safety, student verification, ride requests and how Rydeon works.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                to="/find-rides"
                className="px-5 py-2.5 sm:px-6 sm:py-3 bg-[#1683F8] text-white rounded-xl text-xs font-bold shadow-lg shadow-[#1683F8]/30 hover:bg-[#168BFF] transition"
              >
                Find a Ride
              </Link>
              <Link
                to="/about"
                className="px-5 py-2.5 sm:px-6 sm:py-3 bg-white border border-[#DCE5F0] text-[#101D3A] rounded-xl text-xs font-bold hover:bg-[#EEF7FF] transition"
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
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${faq.highlight
                    ? 'bg-amber-50/60 border-amber-200'
                    : 'bg-white border-[#DCE5F0]'
                    }`}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 font-bold text-xs sm:text-sm text-[#101D3A] focus:outline-none"
                  >
                    <span className="flex items-center gap-2">
                      {faq.highlight && <span className="text-amber-600">⚡</span>}
                      {faq.q}
                    </span>
                    <span className={`grid h-6 w-6 sm:h-7 sm:w-7 place-items-center rounded-xl bg-[#EEF7FF] text-[#1683F8] font-bold transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-45 bg-[#1683F8] text-white' : ''
                      }`}>
                      +
                    </span>
                  </button>

                  <div className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                    <div className="overflow-hidden">
                      <div className="border-t border-[#EEF7FF] px-4 sm:px-5 pb-4 sm:pb-5 pt-3 text-xs leading-relaxed text-slate-600 sm:text-sm">
                        {faq.a}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 6: FOOTER */}
      {/* ============================================================ */}
      <footer className="py-12 sm:py-16 bg-white border-t border-[#DCE5F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10 sm:space-y-12">

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 text-center md:text-left">

            {/* Brand */}
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center justify-center md:justify-start gap-2.5">
                <img src="/logo.png" alt="Rydeon Logo" className="h-8 w-8 object-contain" />
                <span className="text-2xl font-black text-[#101D3A]">Rydeon</span>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed max-w-sm mx-auto md:mx-0">
                Student-to-student ride-sharing platform connecting verified commuters across Pune campus corridors.
              </p>
              <p className="text-slate-400 text-[11px]">© 2026 Rydeon. All rights reserved.</p>
            </div>

            {/* Product Links */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#101D3A]">PRODUCT</h4>
              <ul className="space-y-2 text-xs font-semibold text-slate-600">
                <li><Link to="/how-it-works" className="hover:text-[#1683F8] transition">How It Works</Link></li>
                <li><Link to="/find-rides" className="hover:text-[#1683F8] transition">Find a Ride</Link></li>
                <li><Link to="/offer" className="hover:text-[#1683F8] transition">Offer a Ride</Link></li>
                <li><Link to="/safety" className="hover:text-[#1683F8] transition">Safety</Link></li>
                <li><Link to="/dashboard" className="hover:text-[#1683F8] transition">FAQ</Link></li>
              </ul>
            </div>

            {/* Company Links */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#101D3A]">COMPANY</h4>
              <ul className="space-y-2 text-xs font-semibold text-slate-600">
                <li><Link to="/about" className="hover:text-[#1683F8] transition">About</Link></li>
                <li><Link to="/resources" className="hover:text-[#1683F8] transition">Resources</Link></li>
                <li><a href="mailto:teamrydeon@gmail.com" className="hover:text-[#1683F8] transition">Contact</a></li>
              </ul>
            </div>

            {/* Legal / Social */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#101D3A]">LEGAL & SOCIAL</h4>
              <ul className="space-y-2 text-xs font-semibold text-slate-600">
                <li><Link to="/safety" className="hover:text-[#1683F8] transition">Privacy Policy</Link></li>
                <li><Link to="/safety" className="hover:text-[#1683F8] transition">Terms & Conditions</Link></li>
                <li><a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-[#1683F8] transition">LinkedIn</a></li>
                <li><a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-[#1683F8] transition">Instagram</a></li>
              </ul>
            </div>

          </div>

          <div className="pt-6 sm:pt-8 border-t border-[#DCE5F0] text-center">
            <span className="text-4xl sm:text-7xl font-black tracking-widest text-blue-100 select-none uppercase">
              RYDEON
            </span>
          </div>

        </div>
      </footer>

    </div>
  );
}

export default Landing;

