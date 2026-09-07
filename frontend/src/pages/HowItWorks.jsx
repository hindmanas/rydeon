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
  ShieldCheckIcon
} from '../components/icons';
import studentsBook from '../assets/students_book.jpg';

function HowItWorks() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans pb-20">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28 px-4 border-b border-slate-100 bg-gradient-to-b from-slate-50/80 to-white">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/60 text-teal-800 text-xs font-bold uppercase tracking-wider">
            <ShieldCheckIcon className="w-4 h-4 text-teal-600" />
            <span>Verified Student Network</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-950 tracking-tight leading-[1.1] max-w-4xl mx-auto">
            Your route. Their route.<br className="hidden sm:inline" />
            <span className="text-teal-700"> Maybe it's the same ride.</span>
          </h1>

          <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            Rydeon makes it easier for verified students to find people heading the same way, request a seat, and travel together without the usual WhatsApp-group chaos.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-slate-950/10 transition-all hover:bg-slate-800 active:scale-[0.98]"
            >
              <span>Find a Ride</span>
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
            <Link
              to="/hosts"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-800 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98]"
            >
              <span>Offer a Ride</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 4-STEP VISUAL JOURNEY */}
      <section className="py-20 px-4 max-w-6xl mx-auto space-y-24">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold text-teal-700 uppercase tracking-widest block mb-2">SIMPLE & TRANSPARENT</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
            How a ride happens on Rydeon
          </h2>
          <p className="text-slate-500 mt-2 text-sm sm:text-base">
            Every step is designed to keep requests predictable, safe, and organized.
          </p>
        </div>

        {/* STEP 01 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-950 text-teal-400 font-black text-lg shadow-sm">
              01
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-950">
              Find a ride
            </h3>
            <p className="text-teal-700 font-semibold text-sm">"See who's going your way"</p>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              Enter your pickup spot, destination, and preferred travel date and time. Instantly browse available rides posted by verified students traveling along the exact same corridor.
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-xs font-semibold text-slate-500">
              <span className="px-3 py-1 bg-slate-100 rounded-lg">📍 Campus Gates</span>
              <span className="px-3 py-1 bg-slate-100 rounded-lg">🚉 Transit Hubs</span>
              <span className="px-3 py-1 bg-slate-100 rounded-lg">🏠 Student Corridors</span>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">Search Filters</span>
                <span className="text-[11px] text-slate-400">Live Campus Feed</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
                  <MapPinIcon className="w-4 h-4 text-teal-400 shrink-0" />
                  <div className="text-xs">
                    <p className="text-slate-400">Pickup</p>
                    <p className="font-bold text-white">PCU Main Gate, Nigdi</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
                  <MapPinIcon className="w-4 h-4 text-rose-400 shrink-0" />
                  <div className="text-xs">
                    <p className="text-slate-400">Destination</p>
                    <p className="font-bold text-white">Hinjewadi Phase 1</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
                  <ClockIcon className="w-4 h-4 text-amber-400 shrink-0" />
                  <div className="text-xs">
                    <p className="text-slate-400">Time</p>
                    <p className="font-bold text-white">Today, 5:30 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* STEP 02 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-teal-700 text-white font-bold flex items-center justify-center text-sm">
                    RP
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-950">Rakshan Parashar</h4>
                    <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
                      ✓ Verified Student Driver
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-base font-black text-slate-950">₹30</span>
                  <span className="block text-[10px] text-slate-400">per seat</span>
                </div>
              </div>

              <div className="text-xs space-y-2 text-slate-600 bg-slate-50 p-3 rounded-xl">
                <p><strong className="text-slate-950">Route:</strong> Admin Block → Pune Junction</p>
                <p><strong className="text-slate-950">Available Seats:</strong> 2 seats remaining</p>
              </div>

              <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3 text-xs text-amber-800 font-medium flex items-start gap-2">
                <span className="text-base leading-none">⚠️</span>
                <p>Requesting does NOT automatically confirm a seat. The driver reviews all incoming student requests before accepting.</p>
              </div>

              <button className="w-full bg-slate-950 text-white py-2.5 rounded-xl text-xs font-bold shadow">
                Request Seat
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2 space-y-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-950 text-teal-400 font-black text-lg shadow-sm">
              02
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-950">
              Request a seat
            </h3>
            <p className="text-teal-700 font-semibold text-sm">"Found your route? Ask to join."</p>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              View the driver's verified profile, vehicle details, departure timing, available seats, and split-cost price per seat. Tap request to send your interest to the driver.
            </p>
          </div>
        </div>

        {/* STEP 03 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-950 text-teal-400 font-black text-lg shadow-sm">
              03
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-950">
              Get confirmed
            </h3>
            <p className="text-teal-700 font-semibold text-sm">"The driver accepts. Your seat is yours."</p>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              The driver receives your request and decides whether to accept or reject. Once accepted, your booking transforms into <strong className="text-slate-950">CONFIRMED</strong>, the seat count decrements automatically, and you get instant notification.
            </p>
          </div>

          <div className="lg:col-span-6">
            {/* LIFECYCLE DIAGRAM MOCKUP */}
            <div className="bg-slate-950 text-white rounded-2xl p-6 shadow-xl space-y-6">
              <span className="text-xs font-bold text-teal-400 uppercase tracking-widest block">REQUEST LIFECYCLE</span>
              
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center text-xs">
                {/* PENDING */}
                <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-4 w-full">
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold mx-auto mb-2 flex items-center justify-center text-[10px]">
                    ⏳
                  </div>
                  <p className="font-bold text-amber-400">1. PENDING</p>
                  <p className="text-[10px] text-slate-400 mt-1">Driver notified</p>
                </div>

                <div className="text-slate-600 font-bold hidden sm:block">→</div>

                {/* ACCEPTED / REJECTED */}
                <div className="flex-1 bg-slate-900 border border-teal-500/40 rounded-xl p-4 w-full">
                  <div className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 font-bold mx-auto mb-2 flex items-center justify-center text-[10px]">
                    ✓
                  </div>
                  <p className="font-bold text-teal-400">2. ACCEPTED</p>
                  <p className="text-[10px] text-slate-400 mt-1">Driver reviews & accepts</p>
                </div>

                <div className="text-slate-600 font-bold hidden sm:block">→</div>

                {/* CONFIRMED */}
                <div className="flex-1 bg-teal-950 border border-teal-500 rounded-xl p-4 w-full">
                  <div className="w-6 h-6 rounded-full bg-teal-500 text-slate-950 font-black mx-auto mb-2 flex items-center justify-center text-[10px]">
                    ★
                  </div>
                  <p className="font-extrabold text-white">3. CONFIRMED</p>
                  <p className="text-[10px] text-teal-200 mt-1">Seat locked & chat unlocked</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* STEP 04 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <MessageSquareIcon className="w-4 h-4 text-teal-600" />
                  <span className="font-bold text-xs text-slate-950">Ride Chat (Locked until accepted)</span>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">Active</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="bg-slate-100 p-2.5 rounded-xl max-w-[80%] text-slate-800">
                  Hey! I accepted your request. I'll meet you near Gate 2 at 5:15 PM.
                </div>
                <div className="bg-slate-950 text-white p-2.5 rounded-xl max-w-[80%] ml-auto text-right">
                  Awesome! I'll be wearing a red jacket. See you there.
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2 space-y-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-950 text-teal-400 font-black text-lg shadow-sm">
              04
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-950">
              Chat and coordinate
            </h3>
            <p className="text-teal-700 font-semibold text-sm">"Now you can talk."</p>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              Once your request is accepted, dedicated in-app ride chat unlocks between you and the driver. Coordinate exact pickup spots, luggage details, or timing tweaks safely inside Rydeon.
            </p>
          </div>
        </div>

      </section>

      {/* FINAL CTA */}
      <section className="mt-16 py-16 px-4 bg-slate-950 text-white text-center rounded-3xl max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
          Ready to travel smarter?
        </h2>
        <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto mb-8">
          Join thousands of verified students sharing rides across Pune institutes every single day.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/signup" className="px-6 py-3.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold rounded-xl transition text-sm">
            Find a Ride Now
          </Link>
          <Link to="/hosts" className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition text-sm">
            Learn About Hosting
          </Link>
        </div>
      </section>

    </div>
  );
}

export default HowItWorks;
