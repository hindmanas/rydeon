import React from 'react';
import { Link } from 'react-router-dom';
import {
  SearchIcon,
  UserCheckIcon,
  CheckCircleIcon,
  MessageSquareIcon,
  MapPinIcon,
  ClockIcon,
  UsersIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  RouteIcon
} from '../components/icons';

import studentDriver from '../assets/student_driver.jpg';
import campusStudentsWaiting from '../assets/campus_students_waiting.jpg';
import studentCarpoolChat from '../assets/student_carpool_chat.jpg';
import studentsBook from '../assets/students_book.jpg';
import studentsRide from '../assets/students_ride.jpg';

function HowItWorks() {
  return (
    <div className="min-h-screen bg-[#F7FAFE] text-[#101D3A] font-sans pb-20">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 px-4 border-b border-[#DCE5F0] bg-gradient-to-b from-[#EEF7FF]/80 via-white to-white">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEF7FF] border border-[#DCE5F0] text-[#1683F8] text-xs font-extrabold uppercase tracking-wider">
            <img src="/logo.png" alt="Rydeon" className="h-4 w-4 object-contain" />
            <span>Verified Student Network</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-[#101D3A] tracking-tight leading-[1.1] max-w-4xl mx-auto">
            Your route. Their route.<br className="hidden sm:inline" />
            <span className="text-[#1683F8]"> Maybe it's the same ride.</span>
          </h1>

          <p className="text-base sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-normal">
            Rydeon makes it easier for verified students to find people heading the same way, request a seat, and travel together without the usual WhatsApp-group chaos.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#1683F8] hover:bg-[#168BFF] px-7 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-[#1683F8]/30 transition-all"
            >
              <span>Find a Ride</span>
              <ArrowRightIcon className="w-4 h-4 text-white" />
            </Link>
            <Link
              to="/hosts"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-[#DCE5F0] bg-white px-7 py-3.5 text-sm font-extrabold text-[#101D3A] shadow-sm transition-all hover:bg-[#EEF7FF]"
            >
              <span>Offer a Ride</span>
            </Link>
          </div>
        </div>
      </section>

      {/* DETAILED 4-STEP JOURNEY WITH GENUINE THEMATIC IMAGES & MOCKUPS */}
      <section className="py-20 px-4 max-w-6xl mx-auto space-y-24">
        
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-[#1683F8] uppercase tracking-widest block">THE COMPLETE LIFE CYCLE</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#101D3A] tracking-tight">
            How a ride happens on Rydeon
          </h2>
          <p className="text-slate-500 text-sm sm:text-base">
            Every step is designed to keep requests predictable, safe, and organized.
          </p>
        </div>

        {/* STEP 01 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#101D3A] text-[#168BFF] font-black text-lg shadow">
              01
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-[#101D3A]">
              Find a ride
            </h3>
            <p className="text-[#1683F8] font-extrabold text-sm">"See who's going your way"</p>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              Enter your pickup spot, destination, and preferred travel date and time. Instantly browse available rides posted by verified students traveling along the exact same corridor — PCU to Hinjewadi, Nigdi to Pune Railway Station.
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-xs font-bold text-slate-600">
              <span className="px-3 py-1.5 bg-white border border-[#DCE5F0] rounded-xl">📍 Campus Gates</span>
              <span className="px-3 py-1.5 bg-white border border-[#DCE5F0] rounded-xl">🚉 Transit Hubs</span>
              <span className="px-3 py-1.5 bg-white border border-[#DCE5F0] rounded-xl">🏠 Housing Clusters</span>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden border border-[#DCE5F0] shadow-xl bg-[#F7FAFE]">
              <img
                src={campusStudentsWaiting}
                alt="Students coordinating ride near campus gate"
                className="w-full h-auto object-cover max-h-[380px]"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-[#101D3A]/90 backdrop-blur text-white p-3.5 rounded-2xl text-xs space-y-1">
                <p className="font-bold text-[#168BFF]">Step 01: Browse Verified Campus Rides</p>
                <p className="text-[11px] text-blue-100">Filtered matching student drivers traveling identical corridors</p>
              </div>
            </div>
          </div>
        </div>

        {/* STEP 02 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="bg-white border border-[#DCE5F0] rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-[#EEF7FF] pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#EEF7FF] text-[#1683F8] font-black flex items-center justify-center text-sm">
                    RP
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#101D3A]">Rakshan Parashar</h4>
                    <span className="text-[10px] font-bold text-[#1683F8] bg-[#EEF7FF] px-2 py-0.5 rounded-full">
                      ✓ Verified Student Driver
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-[#101D3A]">₹30</span>
                  <span className="block text-[10px] text-slate-400 font-semibold">split cost per seat</span>
                </div>
              </div>

              <div className="text-xs space-y-2 text-slate-600 bg-[#F7FAFE] p-3.5 rounded-2xl border border-[#DCE5F0]">
                <p><strong className="text-[#101D3A]">Route:</strong> Admin Block → Pune Junction</p>
                <p><strong className="text-[#101D3A]">Departure:</strong> Today at 4:30 PM</p>
                <p><strong className="text-[#101D3A]">Available Seats:</strong> 2 seats remaining</p>
              </div>

              <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-3.5 text-xs text-amber-800 font-semibold flex items-start gap-2">
                <span className="text-base leading-none">⚠️</span>
                <p>Requesting does NOT automatically confirm a seat. The driver reviews all incoming requests before accepting.</p>
              </div>

              <button className="w-full bg-[#1683F8] hover:bg-[#168BFF] text-white py-3 rounded-xl text-xs font-bold shadow-lg shadow-[#1683F8]/20 transition">
                Request Seat
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2 space-y-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#101D3A] text-[#168BFF] font-black text-lg shadow">
              02
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-[#101D3A]">
              Request a seat
            </h3>
            <p className="text-[#1683F8] font-extrabold text-sm">"Found your route? Ask to join."</p>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              View the driver's verified student profile, departure timing, available seats, and split-cost price per seat. Tap request to send your interest directly to the host.
            </p>
          </div>
        </div>

        {/* STEP 03 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#101D3A] text-[#168BFF] font-black text-lg shadow">
              03
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-[#101D3A]">
              Get confirmed
            </h3>
            <p className="text-[#1683F8] font-extrabold text-sm">"The driver accepts. Your seat is yours."</p>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              The driver receives your request and decides whether to accept or reject. Once accepted, your booking status transforms into <strong className="text-[#101D3A]">CONFIRMED</strong>, available seats decrement, and you receive immediate confirmation.
            </p>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden border border-[#DCE5F0] shadow-xl bg-[#F7FAFE]">
              <img
                src={studentDriver}
                alt="Verified student driver reviewing request"
                className="w-full h-auto object-cover max-h-[380px]"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-[#101D3A]/90 backdrop-blur text-white p-3.5 rounded-2xl text-xs space-y-1">
                <p className="font-bold text-[#168BFF]">Step 03: PENDING → ACCEPTED → CONFIRMED</p>
                <p className="text-[11px] text-blue-100">Host driver reviews profile and accepts your seat request</p>
              </div>
            </div>
          </div>
        </div>

        {/* STEP 04 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="relative rounded-3xl overflow-hidden border border-[#DCE5F0] shadow-xl bg-[#F7FAFE]">
              <img
                src={studentCarpoolChat}
                alt="Students coordinating in car after ride acceptance"
                className="w-full h-auto object-cover max-h-[380px]"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-[#101D3A]/90 backdrop-blur text-white p-3.5 rounded-2xl text-xs space-y-1">
                <p className="font-bold text-[#168BFF]">Step 04: In-App Ride Chat Enabled</p>
                <p className="text-[11px] text-blue-100">Coordinate exact meeting spot safely inside Rydeon sandbox</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2 space-y-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#101D3A] text-[#168BFF] font-black text-lg shadow">
              04
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-[#101D3A]">
              Chat and coordinate
            </h3>
            <p className="text-[#1683F8] font-extrabold text-sm">"Now you can talk."</p>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              Once your request is accepted, dedicated in-app ride chat unlocks between you and the driver. Coordinate exact pickup spots, luggage details, or timing tweaks safely inside Rydeon.
            </p>
          </div>
        </div>

      </section>

      {/* BOTTOM BRAND CTA */}
      <section className="mt-16 py-16 px-4 bg-[#101D3A] text-white text-center rounded-3xl max-w-6xl mx-auto shadow-2xl space-y-6">
        <div className="flex items-center justify-center gap-2">
          <img src="/logo.png" alt="Rydeon" className="h-7 w-7 object-contain" />
          <span className="text-xl font-black">Rydeon</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Ready to travel smarter on your campus route?
        </h2>
        <p className="text-blue-100 text-sm sm:text-base max-w-xl mx-auto">
          Join verified students sharing rides across PCU and Pune institute corridors every single day.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
          <Link to="/signup" className="px-7 py-3.5 bg-[#1683F8] hover:bg-[#168BFF] text-white font-extrabold rounded-xl transition text-sm shadow-lg shadow-[#1683F8]/30">
            Find a Ride Now
          </Link>
          <Link to="/hosts" className="px-7 py-3.5 bg-[#1683F8]/20 border border-[#1683F8]/40 hover:bg-[#1683F8]/30 text-white font-bold rounded-xl transition text-sm">
            Learn About Hosting
          </Link>
        </div>
      </section>

    </div>
  );
}

export default HowItWorks;
