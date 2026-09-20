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

import studentDriver from '../assets/student_driver.jpg';

function Hosts() {
  return (
    <div className="min-h-screen bg-[#F7FAFE] text-[#101D3A] font-sans pb-20">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 px-4 border-b border-[#DCE5F0] bg-gradient-to-b from-[#101D3A] via-[#101D3A] to-[#1683F8]/90 text-white">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1683F8]/20 border border-[#1683F8]/40 text-blue-200 text-xs font-extrabold uppercase tracking-wider">
            <img src="/logo.png" alt="Rydeon Logo" className="h-4 w-4 object-contain" />
            <span>For Student Hosts & Drivers</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.1]">
            Already going there?<br />
            <span className="text-[#168BFF]"> Take someone with you.</span>
          </h1>

          <p className="text-base sm:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed font-normal">
            If you have an empty seat, Rydeon helps you find a verified student heading the same way to split fuel costs and share the trip.
          </p>

          <div className="pt-4">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-[#1683F8] hover:bg-[#168BFF] px-7 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-[#1683F8]/30 transition-all"
            >
              <span>Offer a Ride Now</span>
              <ArrowRightIcon className="w-4 h-4 text-white" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4 STEPS FOR HOSTS WITH GENUINE STUDENT DRIVER PHOTO */}
      <section className="py-20 px-4 max-w-6xl mx-auto space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-[#1683F8] uppercase tracking-widest block">HOST WORKFLOW</span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#101D3A]">How offering a ride works</h2>
          <p className="text-slate-500 text-sm">Post your route in seconds and stay in complete control of your car.</p>
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
              desc: "Receive real-time notifications when fellow verified students request to join your route."
            },
            {
              step: "03",
              title: "Accept or Reject",
              desc: "Check applicant student profiles and choose who you accept into your vehicle."
            },
            {
              step: "04",
              title: "Coordinate & Go",
              desc: "Unlock in-app ride chat with confirmed riders, pick them up, and split the travel cost."
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-white border border-[#DCE5F0] p-6 rounded-2xl space-y-3 relative hover:shadow-md transition">
              <span className="w-10 h-10 rounded-xl bg-[#101D3A] text-[#168BFF] font-black flex items-center justify-center text-sm shadow">
                {item.step}
              </span>
              <h3 className="font-extrabold text-[#101D3A] text-base">{item.title}</h3>
              <p className="text-slate-600 text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* GENUINE STUDENT DRIVER PHOTO BANNER */}
        <div className="relative rounded-3xl overflow-hidden border border-[#DCE5F0] shadow-xl bg-white grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 lg:p-8">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-bold text-[#1683F8] uppercase tracking-widest block">AUTHENTIC STUDENT DRIVER</span>
            <h3 className="text-2xl font-black text-[#101D3A]">Cover fuel costs without commercial taxi hassle</h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              You're already commuting to PCU, Hinjewadi internships, or home for holidays. Rydeon lets you split fuel expenses with peers going your direction while maintaining full host authority.
            </p>
          </div>
          <div className="lg:col-span-6">
            <img src={studentDriver} alt="Student driver" className="w-full h-56 object-cover rounded-2xl shadow" />
          </div>
        </div>
      </section>

      {/* REALISTIC DASHBOARD MOCKUP */}
      <section className="py-16 px-4 bg-white border-t border-b border-[#DCE5F0]">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-[#1683F8] uppercase tracking-widest block">LIVE DASHBOARD MOCKUP</span>
            <h2 className="text-3xl font-extrabold text-[#101D3A]">Designed for host clarity</h2>
            <p className="text-slate-500 text-sm">Manage your offered rides, pending passenger requests, and seat availability in one place.</p>
          </div>

          {/* DASHBOARD PREVIEW CARD */}
          <div className="bg-white border border-[#DCE5F0] rounded-3xl shadow-xl overflow-hidden max-w-4xl mx-auto">
            {/* Header tab area */}
            <div className="bg-[#101D3A] text-white px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-blue-900/60">
              <div className="flex items-center gap-2">
                <img src="/logo.png" alt="Rydeon" className="h-5 w-5 object-contain" />
                <div>
                  <h3 className="font-extrabold text-xs text-white">Host Control Dashboard</h3>
                  <p className="text-[11px] text-blue-100">Offered Ride: Admin Block → Pune Junction</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-[#1683F8]/20 text-[#168BFF] text-xs font-bold px-3 py-1 rounded-full border border-[#1683F8]/40">
                  2 Available Seats
                </span>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-[#F7FAFE] border-b border-[#DCE5F0] text-center text-xs">
              <div className="bg-white p-3.5 rounded-2xl border border-[#DCE5F0] shadow-sm">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Available Seats</span>
                <span className="text-2xl font-black text-[#1683F8]">2</span>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-[#DCE5F0] shadow-sm">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Pending Requests</span>
                <span className="text-2xl font-black text-[#F2A900]">1</span>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-[#DCE5F0] shadow-sm">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Offered Rides</span>
                <span className="text-2xl font-black text-[#101D3A]">4</span>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-[#DCE5F0] shadow-sm">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Joined Riders</span>
                <span className="text-2xl font-black text-[#101D3A]">2</span>
              </div>
            </div>

            {/* Pending Requests List */}
            <div className="p-6 space-y-4">
              <h4 className="font-extrabold text-[#101D3A] text-xs uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#F2A900] animate-pulse"></span>
                New Ride Requests (Action Required)
              </h4>

              {/* Request Item Card */}
              <div className="bg-[#F7FAFE] border border-[#DCE5F0] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-[#EEF7FF] text-[#1683F8] font-black flex items-center justify-center text-sm shrink-0">
                    AP
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h5 className="font-bold text-sm text-[#101D3A]">Aarav Patel</h5>
                      <span className="text-[10px] bg-[#ECFDF3] text-[#18B76A] font-bold px-2 py-0.5 rounded border border-[#D1FADF]">
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
                  <button className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 bg-[#1683F8] hover:bg-[#168BFF] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition">
                    <CheckCircleIcon className="w-4 h-4" />
                    <span>Accept</span>
                  </button>
                  <button className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 bg-[#EEF7FF] hover:bg-[#E5484D] hover:text-white text-[#E5484D] px-4 py-2 rounded-xl text-xs font-bold transition">
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
        <h2 className="text-3xl font-black text-[#101D3A]">
          Turn your empty seats into shared fuel savings
        </h2>
        <p className="text-slate-600 text-sm">
          Post your commute in under a minute and start meeting verified peers traveling your way.
        </p>
        <div>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 rounded-xl bg-[#1683F8] hover:bg-[#168BFF] px-8 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-[#1683F8]/30 transition"
          >
            <span>Create an Offered Ride</span>
            <ArrowRightIcon className="w-4 h-4 text-white" />
          </Link>
        </div>
      </section>

    </div>
  );
}

export default Hosts;
