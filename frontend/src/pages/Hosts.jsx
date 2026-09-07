import React from 'react';
import { Link } from 'react-router-dom';
import {
  CarFrontIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserCheckIcon,
  MapPinIcon,
  ClockIcon,
  UsersIcon,
  ArrowRightIcon
} from '../components/icons';

function Hosts() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans pb-20">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28 px-4 border-b border-slate-100 bg-gradient-to-b from-slate-950 to-slate-900 text-white">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-teal-400 text-xs font-bold uppercase tracking-wider">
            <CarFrontIcon className="w-4 h-4" />
            <span>For Student Hosts & Drivers</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.1]">
            Already going there?<br />
            <span className="text-teal-400"> Take someone with you.</span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            If you have an empty seat, Rydeon helps you find a student heading the same way to split fuel costs and share the trip.
          </p>

          <div className="pt-4">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-teal-500 hover:bg-teal-400 px-7 py-3.5 text-sm font-extrabold text-slate-950 shadow-lg shadow-teal-500/20 transition-all active:scale-[0.98]"
            >
              <span>Offer a Ride Now</span>
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4 STEPS FOR HOSTS */}
      <section className="py-20 px-4 max-w-6xl mx-auto space-y-16">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold text-teal-700 uppercase tracking-widest block mb-2">HOST WORKFLOW</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950">How offering a ride works</h2>
          <p className="text-slate-500 text-sm mt-2">Post your route in seconds and stay in complete control of your car.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: "01",
              title: "Post your route",
              desc: "Set your pickup point, destination, date, time, available seats, and split-cost price per seat."
            },
            {
              step: "02",
              title: "Review requests",
              desc: "Receive real-time notifications when fellow students request to join your route."
            },
            {
              step: "03",
              title: "Accept or Reject",
              desc: "Check their verified student profiles and choose who you accept into your vehicle."
            },
            {
              step: "04",
              title: "Coordinate & Go",
              desc: "Unlock in-app ride chat with confirmed riders, pick them up, and split the travel cost."
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-slate-50 border border-slate-200/80 p-6 rounded-2xl space-y-3 relative hover:bg-white hover:shadow-md transition">
              <span className="w-10 h-10 rounded-xl bg-slate-950 text-teal-400 font-extrabold flex items-center justify-center text-sm shadow">
                {item.step}
              </span>
              <h3 className="font-bold text-slate-950 text-base">{item.title}</h3>
              <p className="text-slate-600 text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* REALISTIC DASHBOARD MOCKUP */}
      <section className="py-16 px-4 bg-slate-50 border-t border-b border-slate-200/80">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold text-teal-700 uppercase tracking-widest block mb-2">LIVE DASHBOARD MOCKUP</span>
            <h2 className="text-3xl font-extrabold text-slate-950">Designed for host clarity</h2>
            <p className="text-slate-500 text-sm mt-2">Manage your offered rides, pending passenger requests, and seat availability in one place.</p>
          </div>

          {/* DASHBOARD PREVIEW CARD */}
          <div className="bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden max-w-4xl mx-auto">
            {/* Header tab area */}
            <div className="bg-slate-950 text-white px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800">
              <div>
                <h3 className="font-bold text-sm text-white">Host Dashboard</h3>
                <p className="text-[11px] text-slate-400">Offered Ride: Admin Block → Pune Junction</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-teal-500/20 text-teal-300 text-xs font-bold px-3 py-1 rounded-full border border-teal-500/40">
                  2 Available Seats
                </span>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-slate-50 border-b border-slate-100 text-center text-xs">
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Available Seats</span>
                <span className="text-xl font-extrabold text-teal-700">2</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Pending Requests</span>
                <span className="text-xl font-extrabold text-amber-600">1</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Offered Rides</span>
                <span className="text-xl font-extrabold text-slate-900">4</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Joined Riders</span>
                <span className="text-xl font-extrabold text-slate-900">2</span>
              </div>
            </div>

            {/* Pending Requests List */}
            <div className="p-6 space-y-4">
              <h4 className="font-bold text-slate-950 text-xs uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                New Ride Requests (Action Required)
              </h4>

              {/* Request Item Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-slate-950 text-white font-bold flex items-center justify-center text-sm shrink-0">
                    AP
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h5 className="font-bold text-sm text-slate-950">Aarav Patel</h5>
                      <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded">
                        ✓ Verified Student
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      PCU Campus → Pune Station • Today 4:30 PM
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition">
                    <CheckCircleIcon className="w-4 h-4" />
                    <span>Accept</span>
                  </button>
                  <button className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 bg-slate-200 hover:bg-rose-100 hover:text-rose-700 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold transition">
                    <XCircleIcon className="w-4 h-4" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="mt-16 text-center max-w-3xl mx-auto px-4 space-y-6">
        <h2 className="text-3xl font-extrabold text-slate-950">
          Turn your empty seats into shared fuel savings
        </h2>
        <p className="text-slate-600 text-sm">
          Post your commute in under a minute and start meeting verified peers traveling your way.
        </p>
        <div>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-950 hover:bg-slate-800 px-8 py-3.5 text-sm font-bold text-white shadow-md transition"
          >
            <span>Create an Offered Ride</span>
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>
      </section>

    </div>
  );
}

export default Hosts;
