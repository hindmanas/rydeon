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

function Campuses() {
  const [showContactModal, setShowContactModal] = useState(false);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans pb-20">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28 px-4 border-b border-slate-100 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/60 text-teal-800 text-xs font-bold uppercase tracking-wider">
            <GraduationCapIcon className="w-4 h-4 text-teal-600" />
            <span>Campus Mobility Infrastructure</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-950 tracking-tight leading-[1.1]">
            Make campus travel<br />
            <span className="text-teal-700"> more connected.</span>
          </h1>

          <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            Rydeon gives students a structured way to share rides within their campus community instead of relying on scattered WhatsApp groups.
          </p>

          <div className="pt-4">
            <button
              onClick={() => setShowContactModal(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-950 hover:bg-slate-800 px-7 py-3.5 text-sm font-bold text-white shadow-md transition-all"
            >
              <span>Bring Rydeon to Your Campus</span>
              <ArrowRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* PROBLEM SECTION: FRAGMENTED CAMPUS TRAVEL */}
      <section className="py-20 px-4 max-w-6xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold text-rose-600 uppercase tracking-widest block mb-2">THE STATUS QUO</span>
          <h2 className="text-3xl font-extrabold text-slate-950">Campus transportation is fragmented</h2>
          <p className="text-slate-500 text-sm mt-2">
            Most student travel coordination currently happens through chaotic, unverified channels.
          </p>
        </div>

        {/* FRAGMENTED VS STRUCTURED FLOW */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* OLD FRAGMENTED WAY */}
          <div className="bg-rose-50/50 border border-rose-200/60 rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between border-b border-rose-200/60 pb-3">
              <h3 className="font-extrabold text-rose-950 text-base">The Fragmented Way</h3>
              <span className="text-[10px] bg-rose-200 text-rose-900 font-bold px-2.5 py-0.5 rounded-full">Disorganized</span>
            </div>

            <div className="space-y-3 text-xs text-rose-900 font-medium">
              <div className="bg-white p-3 rounded-xl border border-rose-100 shadow-sm flex items-center justify-between">
                <span>💬 15+ Disconnected WhatsApp Groups</span>
                <span className="text-rose-500 font-bold">Spam & Noise</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-rose-100 shadow-sm flex items-center justify-between">
                <span>❓ Asking Friends of Friends</span>
                <span className="text-rose-500 font-bold">Unreliable</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-rose-100 shadow-sm flex items-center justify-between">
                <span>📱 Random Phone Number Sharing</span>
                <span className="text-rose-500 font-bold">Privacy Risks</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-rose-100 shadow-sm flex items-center justify-between">
                <span>🚕 Last-Minute Solo Cabs</span>
                <span className="text-rose-500 font-bold">Expensive</span>
              </div>
            </div>
          </div>

          {/* THE RYDEON SOLUTION FLOW */}
          <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-base">The Rydeon Flow</h3>
              <span className="text-[10px] bg-teal-500/20 text-teal-400 font-bold px-2.5 py-0.5 rounded-full border border-teal-500/40">Structured</span>
            </div>

            <div className="flex flex-col gap-2 text-xs font-semibold">
              <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center justify-between text-teal-300">
                <span>1. Verified Students Only</span>
                <span>✓ Domain & ID Check</span>
              </div>
              <div className="text-center text-slate-600 text-[10px] font-bold">↓</div>
              <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center justify-between text-white">
                <span>2. Live Ride Directory</span>
                <span>PCU to Station / Corridors</span>
              </div>
              <div className="text-center text-slate-600 text-[10px] font-bold">↓</div>
              <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center justify-between text-amber-300">
                <span>3. Double-sided Requests</span>
                <span>Host Approval</span>
              </div>
              <div className="text-center text-slate-600 text-[10px] font-bold">↓</div>
              <div className="bg-teal-950 border border-teal-500 p-3 rounded-xl flex items-center justify-between text-white font-extrabold">
                <span>4. Confirmed Passengers & Chat</span>
                <span>In-app Sandbox</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* LIGHTWEIGHT SVG CAMPUS NETWORK MAP */}
      <section className="py-16 px-4 bg-slate-50 border-t border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold text-teal-700 uppercase tracking-widest block mb-2">CAMPUS NETWORK TOPOLOGY</span>
            <h2 className="text-3xl font-extrabold text-slate-950">Active institutes and key corridors</h2>
            <p className="text-slate-500 text-sm mt-2">
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
          <span className="text-xs font-bold text-teal-700 uppercase tracking-widest block mb-2">COMMUNITY IMPACT</span>
          <h2 className="text-3xl font-extrabold text-slate-950">Why institutes choose Rydeon</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white border border-slate-200/80 p-6 sm:p-8 rounded-2xl shadow-sm hover:shadow transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 font-bold flex items-center justify-center text-sm">
              🎓
            </div>
            <h3 className="font-extrabold text-slate-950 text-lg">For Students</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              "Easier access to affordable rides and people travelling similar routes without commercial markups or solo taxi costs."
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 p-6 sm:p-8 rounded-2xl shadow-sm hover:shadow transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 font-bold flex items-center justify-center text-sm">
              🤝
            </div>
            <h3 className="font-extrabold text-slate-950 text-lg">For Communities</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              "One place for ride coordination instead of dozens of disconnected, unmoderated WhatsApp and Telegram groups."
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 p-6 sm:p-8 rounded-2xl shadow-sm hover:shadow transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 font-bold flex items-center justify-center text-sm">
              🏛️
            </div>
            <h3 className="font-extrabold text-slate-950 text-lg">For Campuses</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              "A structured platform designed around verified student identities, reducing campus parking gridlock and carbon footprint."
            </p>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="mt-12 text-center max-w-4xl mx-auto px-4">
        <div className="bg-slate-950 text-white p-10 sm:p-14 rounded-3xl space-y-6 shadow-xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Bring Rydeon to your campus
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Partner with us to launch structured, verified ride-sharing for your university or college community.
          </p>
          <button
            onClick={() => setShowContactModal(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 px-8 py-3.5 text-sm font-extrabold shadow-md transition"
          >
            <span>Talk to Us</span>
            <ArrowRightIcon className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* CONTACT MODAL */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4" onClick={() => setShowContactModal(false)}>
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-950 text-base">Campus Partnership Inquiry</h3>
              <button onClick={() => setShowContactModal(false)} className="text-slate-400 hover:text-slate-950 text-sm font-bold">✕</button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Reach out to our campus integrations team at <strong className="text-slate-950">teamrydeon@gmail.com</strong> or fill out your institution details below.
            </p>

            <form onSubmit={(e) => { e.preventDefault(); alert('Thank you for reaching out! Our team will contact your campus representative shortly.'); setShowContactModal(false); }} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Campus / University Name</label>
                <input type="text" placeholder="e.g. PCU Pune" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:bg-white focus:outline-none focus:border-slate-950" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Your Name & Role</label>
                <input type="text" placeholder="e.g. Student Council Lead / Dean Office" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:bg-white focus:outline-none focus:border-slate-950" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Contact Email</label>
                <input type="email" placeholder="yourname@college.edu.in" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:bg-white focus:outline-none focus:border-slate-950" />
              </div>
              <button type="submit" className="w-full bg-slate-950 text-white font-bold py-3 rounded-xl text-xs shadow hover:bg-slate-800 transition">
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
