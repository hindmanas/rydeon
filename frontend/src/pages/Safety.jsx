import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheckIcon,
  UserCheckIcon,
  MessageSquareIcon,
  CheckCircleIcon,
  ArrowRightIcon
} from '../components/icons';

function Safety() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans pb-20">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28 px-4 border-b border-slate-100 bg-gradient-to-b from-teal-50/40 via-white to-white">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950 text-white text-xs font-bold uppercase tracking-wider">
            <ShieldCheckIcon className="w-4 h-4 text-teal-400" />
            <span>Safety & Trust Standards</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-950 tracking-tight leading-[1.1]">
            Travel with people you can<br className="hidden sm:inline" />
            <span className="text-teal-700"> actually verify.</span>
          </h1>

          <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            Rydeon is built around student-to-student travel. We want you to know who you're travelling with before you get in the car.
          </p>
        </div>
      </section>

      {/* THREE CORE PILLARS */}
      <section className="py-20 px-4 max-w-6xl mx-auto space-y-20">
        
        {/* PILLAR 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-bold text-teal-700 uppercase tracking-widest block">PILLAR 01</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-950">
              Student-first verification
            </h2>
            <p className="text-teal-700 font-semibold text-sm">"Know who's on the other side."</p>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              We require student verification using valid campus credentials before anyone can post or request rides. No random strangers off the street — only peers from your academic ecosystem.
            </p>
          </div>

          <div className="lg:col-span-6">
            <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-3">
              <h3 className="font-bold text-slate-950 text-sm mb-2">Verified Profile Card Preview</h3>
              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-slate-950 text-white font-bold flex items-center justify-center text-sm">
                    SK
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-950">Siddharth Kulkarni</h4>
                    <p className="text-xs text-slate-500">Pimpri Chinchwad University (PCU)</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="text-slate-400 block text-[10px]">VERIFICATION</span>
                    <span className="font-bold text-teal-700">✓ Student Email Verified</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="text-slate-400 block text-[10px]">RIDE HISTORY</span>
                    <span className="font-bold text-slate-900">18 Completed Rides</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PILLAR 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="bg-slate-950 text-white rounded-2xl p-6 shadow-xl space-y-4">
              <span className="text-xs font-bold text-teal-400 uppercase tracking-wider block">DRIVER & RIDER CONTROL</span>
              <div className="space-y-3 text-xs">
                <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white">1. Passenger Requests Seat</p>
                    <p className="text-slate-400 text-[11px]">Seat is not booked yet</p>
                  </div>
                  <span className="px-2 py-1 bg-amber-500/20 text-amber-300 font-bold rounded text-[10px]">Pending</span>
                </div>

                <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white">2. Host Reviews Profile & Route</p>
                    <p className="text-slate-400 text-[11px]">Host accepts or rejects request</p>
                  </div>
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-300 font-bold rounded text-[10px]">Reviewing</span>
                </div>

                <div className="bg-teal-950 p-3.5 rounded-xl border border-teal-500/50 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-teal-200">3. Seat Locked & Confirmed</p>
                    <p className="text-teal-400 text-[11px]">Seat reserved, chat enabled</p>
                  </div>
                  <span className="px-2 py-1 bg-teal-500 text-slate-950 font-bold rounded text-[10px]">Confirmed</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2 space-y-4">
            <span className="text-xs font-bold text-teal-700 uppercase tracking-widest block">PILLAR 02</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-950">
              Request-based confirmation
            </h2>
            <p className="text-teal-700 font-semibold text-sm">"Your request. Your choice."</p>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              Unlike commercial taxi services with automated dispatch, Rydeon uses double-sided confirmation. Drivers always review who wants to join their car before accepting, ensuring complete control for hosts and riders alike.
            </p>
          </div>
        </div>

        {/* PILLAR 3 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-bold text-teal-700 uppercase tracking-widest block">PILLAR 03</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-950">
              Ride-specific communication
            </h2>
            <p className="text-teal-700 font-semibold text-sm">"Keep conversations where the ride lives."</p>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              Chat opens only after a request is accepted. It stays tied strictly to that specific trip, so you never have to post phone numbers in public groups or deal with spam messages.
            </p>
          </div>

          <div className="lg:col-span-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md space-y-3">
              <div className="flex items-center gap-2 text-slate-950 font-bold text-sm border-b border-slate-100 pb-3">
                <MessageSquareIcon className="w-4 h-4 text-teal-600" />
                <span>Protected Sandbox Chat</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-2">
                <p className="text-slate-500">🔒 Messages are end-to-end sandbox protected within Rydeon.</p>
                <p className="text-slate-500">📞 No phone number exchange required before confirmation.</p>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* PRACTICAL SAFETY TIPS */}
      <section className="py-16 px-4 bg-slate-50 border-t border-b border-slate-200/80">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold text-teal-700 uppercase tracking-widest block mb-2">COMMUNITY SAFETY TIPS</span>
            <h2 className="text-3xl font-extrabold text-slate-950">Practical advice for every travel day</h2>
            <p className="text-slate-600 text-sm mt-2">
              We promote honest, common-sense practices for a comfortable ride.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                number: "01",
                title: "Meet at clear pickup points",
                desc: "Choose well-lit, recognizable spots like campus security gates, main library plazas, or official transit stands."
              },
              {
                number: "02",
                title: "Check profile before accepting",
                desc: "Review student verification, mutual campus affiliations, and ride history before confirming requests."
              },
              {
                number: "03",
                title: "Share trip details",
                desc: "Let a friend or family member know your route and expected time of arrival whenever heading on long rides."
              },
              {
                number: "04",
                title: "Keep sensitive info private",
                desc: "Use Rydeon's in-app chat for all coordination instead of sharing private social media handles prematurely."
              },
              {
                number: "05",
                title: "Report anything wrong",
                desc: "If any user violates community standards, report them directly through our team support email immediately."
              },
              {
                number: "06",
                title: "Fair split-cost transparency",
                desc: "Prices represent shared fuel costs, not commercial profits. Clear expectations prevent misunderstandings."
              }
            ].map((tip, idx) => (
              <div key={idx} className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm hover:shadow transition">
                <span className="text-xs font-black text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg block w-fit mb-3">
                  Tip {tip.number}
                </span>
                <h3 className="font-bold text-slate-950 text-base mb-2">{tip.title}</h3>
                <p className="text-slate-600 text-xs leading-relaxed">{tip.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM DISCLAIMER / CTA */}
      <section className="mt-16 text-center max-w-4xl mx-auto px-4">
        <p className="text-xs text-slate-500 max-w-xl mx-auto leading-relaxed mb-6">
          Rydeon is a peer-to-peer student matching platform. We encourage respectful, common-sense precautions on every ride.
        </p>
        <Link
          to="/signup"
          className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-6 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-slate-800"
        >
          <span>Explore Verified Rides</span>
          <ArrowRightIcon className="w-4 h-4" />
        </Link>
      </section>

    </div>
  );
}

export default Safety;
