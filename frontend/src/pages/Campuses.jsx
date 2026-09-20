import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CampusNetwork from '../components/CampusNetwork';
import {
  GraduationCapIcon,
  CheckCircleIcon,
  UsersIcon,
  MessageSquareIcon,
  ArrowRightIcon,
  ShieldCheckIcon
} from '../components/icons';

import campusStudentsWaiting from '../assets/campus_students_waiting.jpg';

function Campuses() {
  const [showContactModal, setShowContactModal] = useState(false);

  return (
    <div className="min-h-screen bg-[#F7FAFE] text-[#101D3A] font-sans pb-20">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 px-4 border-b border-[#DCE5F0] bg-gradient-to-b from-[#EEF7FF]/80 via-white to-white">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEF7FF] border border-[#DCE5F0] text-[#1683F8] text-xs font-extrabold uppercase tracking-wider">
            <img src="/logo.png" alt="Rydeon Logo" className="h-4 w-4 object-contain" />
            <span>Campus Mobility Infrastructure</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-[#101D3A] tracking-tight leading-[1.1]">
            Make campus travel<br />
            <span className="text-[#1683F8]"> more connected.</span>
          </h1>

          <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            Rydeon gives students a structured way to share rides within their campus community instead of relying on scattered WhatsApp groups.
          </p>

          <div className="pt-4">
            <button
              onClick={() => setShowContactModal(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-[#1683F8] hover:bg-[#168BFF] px-7 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-[#1683F8]/30 transition-all"
            >
              <span>Bring Rydeon to Your Campus</span>
              <ArrowRightIcon className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </section>

      {/* PROBLEM SECTION WITH GENUINE CAMPUS PHOTO */}
      <section className="py-20 px-4 max-w-6xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-rose-600 uppercase tracking-widest block">THE STATUS QUO</span>
          <h2 className="text-3xl font-black text-[#101D3A]">Campus transportation is fragmented</h2>
          <p className="text-slate-500 text-sm">
            Most student travel coordination currently happens through chaotic, unverified channels.
          </p>
        </div>

        {/* PHOTO BANNER */}
        <div className="relative rounded-3xl overflow-hidden border border-[#DCE5F0] shadow-xl bg-white max-w-5xl mx-auto">
          <img src={campusStudentsWaiting} alt="Students at campus entrance gate" className="w-full h-64 object-cover" />
          <div className="absolute bottom-4 left-4 right-4 bg-[#101D3A]/90 backdrop-blur text-white p-4 rounded-2xl text-xs space-y-1">
            <p className="font-bold text-[#168BFF]">🎓 Connecting University Campuses & Transit Hubs</p>
            <p className="text-[11px] text-blue-100">Replacing disconnected WhatsApp groups with verified peer matching</p>
          </div>
        </div>

        {/* FRAGMENTED VS STRUCTURED FLOW */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          
          {/* OLD FRAGMENTED WAY */}
          <div className="bg-rose-50/50 border border-rose-200/60 rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between border-b border-rose-200/60 pb-3">
              <h3 className="font-extrabold text-rose-950 text-base">The Fragmented Way</h3>
              <span className="text-[10px] bg-rose-200 text-rose-900 font-bold px-2.5 py-0.5 rounded-full">Disorganized</span>
            </div>

            <div className="space-y-3 text-xs text-rose-900 font-medium">
              <div className="bg-white p-3.5 rounded-xl border border-rose-100 shadow-sm flex items-center justify-between">
                <span>💬 15+ Disconnected WhatsApp Groups</span>
                <span className="text-rose-600 font-bold">Spam & Noise</span>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-rose-100 shadow-sm flex items-center justify-between">
                <span>❓ Asking Friends of Friends</span>
                <span className="text-rose-600 font-bold">Unreliable</span>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-rose-100 shadow-sm flex items-center justify-between">
                <span>📱 Random Phone Number Sharing</span>
                <span className="text-rose-600 font-bold">Privacy Risks</span>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-rose-100 shadow-sm flex items-center justify-between">
                <span>🚕 Last-Minute Solo Cabs</span>
                <span className="text-rose-600 font-bold">Expensive</span>
              </div>
            </div>
          </div>

          {/* THE RYDEON SOLUTION FLOW */}
          <div className="bg-[#101D3A] text-white rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl border border-blue-900/60">
            <div className="flex items-center justify-between border-b border-blue-900/60 pb-3">
              <h3 className="font-extrabold text-white text-base">The Rydeon Flow</h3>
              <span className="text-[10px] bg-[#1683F8]/20 text-[#168BFF] font-bold px-2.5 py-0.5 rounded-full border border-[#1683F8]/40">Structured</span>
            </div>

            <div className="flex flex-col gap-2.5 text-xs font-semibold">
              <div className="bg-[#101D3A]/80 border border-blue-900/60 p-3 rounded-xl flex items-center justify-between text-[#168BFF]">
                <span>1. Verified Students Only</span>
                <span>✓ Domain & ID Check</span>
              </div>
              <div className="bg-[#101D3A]/80 border border-blue-900/60 p-3 rounded-xl flex items-center justify-between text-white">
                <span>2. Live Ride Directory</span>
                <span>PCU to Station / Corridors</span>
              </div>
              <div className="bg-[#101D3A]/80 border border-blue-900/60 p-3 rounded-xl flex items-center justify-between text-amber-300">
                <span>3. Double-sided Requests</span>
                <span>Host Approval</span>
              </div>
              <div className="bg-[#1683F8]/30 border border-[#1683F8] p-3 rounded-xl flex items-center justify-between text-white font-extrabold">
                <span>4. Confirmed Passengers & Chat</span>
                <span>In-app Sandbox</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* LIGHTWEIGHT SVG CAMPUS NETWORK MAP */}
      <section className="py-16 px-4 bg-white border-t border-b border-[#DCE5F0]">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-[#1683F8] uppercase tracking-widest block">CAMPUS NETWORK TOPOLOGY</span>
            <h2 className="text-3xl font-black text-[#101D3A]">Active institutes and key corridors</h2>
            <p className="text-slate-500 text-sm">
              High-frequency commute paths connecting campus hubs, railway junctions, and airport nodes across Pune.
            </p>
          </div>

          {/* SVG NETWORK ANIMATED MAP */}
          <CampusNetwork />
        </div>
      </section>

      {/* THREE BENEFIT PILLARS */}
      <section className="py-20 px-4 max-w-6xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold text-[#1683F8] uppercase tracking-widest block mb-2">COMMUNITY IMPACT</span>
          <h2 className="text-3xl font-black text-[#101D3A]">Why institutes choose Rydeon</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white border border-[#DCE5F0] p-6 sm:p-8 rounded-2xl shadow-sm hover:shadow transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#EEF7FF] text-[#1683F8] font-bold flex items-center justify-center text-sm">
              🎓
            </div>
            <h3 className="font-extrabold text-[#101D3A] text-lg">For Students</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              "Easier access to affordable rides and people travelling similar routes without commercial markups or solo taxi costs."
            </p>
          </div>

          <div className="bg-white border border-[#DCE5F0] p-6 sm:p-8 rounded-2xl shadow-sm hover:shadow transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#EEF7FF] text-[#1683F8] font-bold flex items-center justify-center text-sm">
              🤝
            </div>
            <h3 className="font-extrabold text-[#101D3A] text-lg">For Communities</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              "One place for ride coordination instead of dozens of disconnected, unmoderated WhatsApp and Telegram groups."
            </p>
          </div>

          <div className="bg-white border border-[#DCE5F0] p-6 sm:p-8 rounded-2xl shadow-sm hover:shadow transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#EEF7FF] text-[#1683F8] font-bold flex items-center justify-center text-sm">
              🏛️
            </div>
            <h3 className="font-extrabold text-[#101D3A] text-lg">For Campuses</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              "A structured platform designed around verified student identities, reducing campus parking gridlock and carbon footprint."
            </p>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="mt-12 text-center max-w-4xl mx-auto px-4">
        <div className="bg-[#101D3A] text-white p-10 sm:p-14 rounded-3xl space-y-6 shadow-xl border border-blue-900/60">
          <div className="flex items-center justify-center gap-2">
            <img src="/logo.png" alt="Rydeon" className="h-6 w-6 object-contain" />
            <span className="text-lg font-black text-white">Rydeon Campus Partner Program</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Bring Rydeon to your campus
          </h2>
          <p className="text-blue-100 text-sm sm:text-base max-w-xl mx-auto">
            Partner with us to launch structured, verified ride-sharing for your university or college community.
          </p>
          <button
            onClick={() => setShowContactModal(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#1683F8] hover:bg-[#168BFF] text-white px-8 py-3.5 text-sm font-extrabold shadow-lg shadow-[#1683F8]/30 transition"
          >
            <span>Talk to Us</span>
            <ArrowRightIcon className="w-4 h-4 text-white" />
          </button>
        </div>
      </section>

      {/* CONTACT MODAL */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4" onClick={() => setShowContactModal(false)}>
          <div className="bg-white border border-[#DCE5F0] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[#EEF7FF] pb-3">
              <div className="flex items-center gap-2">
                <img src="/logo.png" alt="Rydeon Logo" className="h-6 w-6 object-contain" />
                <h3 className="font-extrabold text-[#101D3A] text-base">Campus Partnership</h3>
              </div>
              <button onClick={() => setShowContactModal(false)} className="text-slate-400 hover:text-[#101D3A] text-sm font-bold">✕</button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Reach out to our campus integrations team at <strong className="text-[#101D3A]">teamrydeon@gmail.com</strong> or fill out your institution details below.
            </p>

            <form onSubmit={(e) => { e.preventDefault(); alert('Thank you for reaching out! Our team will contact your campus representative shortly.'); setShowContactModal(false); }} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-[#101D3A] mb-1">Campus / University Name</label>
                <input type="text" placeholder="e.g. PCU Pune" required className="w-full bg-[#F7FAFE] border border-[#DCE5F0] rounded-xl px-3.5 py-2.5 text-xs font-medium focus:bg-white focus:outline-none focus:border-[#1683F8]" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#101D3A] mb-1">Your Name & Role</label>
                <input type="text" placeholder="e.g. Student Council Lead / Dean Office" required className="w-full bg-[#F7FAFE] border border-[#DCE5F0] rounded-xl px-3.5 py-2.5 text-xs font-medium focus:bg-white focus:outline-none focus:border-[#1683F8]" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#101D3A] mb-1">Contact Email</label>
                <input type="email" placeholder="yourname@college.edu.in" required className="w-full bg-[#F7FAFE] border border-[#DCE5F0] rounded-xl px-3.5 py-2.5 text-xs font-medium focus:bg-white focus:outline-none focus:border-[#1683F8]" />
              </div>
              <button type="submit" className="w-full bg-[#1683F8] hover:bg-[#168BFF] text-white font-bold py-3 rounded-xl text-xs shadow-lg shadow-[#1683F8]/20 transition">
                Send Campus Inquiry
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default Campuses;
