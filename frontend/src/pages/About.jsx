import React from 'react';
import { Link } from 'react-router-dom';
import {
  InfoIcon,
  ShieldCheckIcon,
  GraduationCapIcon,
  UsersIcon,
  ArrowRightIcon,
  SparklesIcon
} from '../components/icons';

import studentsRide from '../assets/students_ride.jpg';
import studentCarpoolChat from '../assets/student_carpool_chat.jpg';
import studentDriver from '../assets/student_driver.jpg';

function About() {
  return (
    <div className="min-h-screen bg-[#F7FAFE] text-[#101D3A] font-sans pb-20">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 px-4 border-b border-[#DCE5F0] bg-gradient-to-b from-[#EEF7FF]/80 via-white to-white">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEF7FF] border border-[#DCE5F0] text-[#1683F8] text-xs font-extrabold uppercase tracking-wider">
            <img src="/logo.png" alt="Rydeon Logo" className="h-4 w-4 object-contain" />
            <span>The Rydeon Story & Mission</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-[#101D3A] tracking-tight leading-[1.1]">
            We started with a<br />
            <span className="text-[#1683F8]"> simple problem.</span>
          </h1>

          <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            Students are already travelling the same roads every day. They just don't always know who else is going their way.
          </p>
        </div>
      </section>

      {/* STORY & NARRATIVE SECTION WITH GENUINE CARPOOL PHOTO */}
      <section className="py-20 px-4 max-w-5xl mx-auto space-y-16">
        
        <div className="bg-[#101D3A] text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-blue-900/60 space-y-8">
          <div className="border-b border-blue-900/60 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="Rydeon Logo" className="h-5 w-5 object-contain" />
              <span className="text-xs font-extrabold text-[#168BFF] uppercase tracking-widest">THE COMMUTE REALITY</span>
            </div>
            <span className="text-xs text-blue-200">Campus Travel Paradigm</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4 text-sm sm:text-base leading-relaxed text-blue-100">
              <p className="text-white font-black text-xl">
                One student is heading home.
              </p>
              <p className="text-white font-black text-xl">
                Another is going to the same city.
              </p>
              <p className="text-white font-black text-xl">
                Someone else has an empty seat.
              </p>
              <p className="text-rose-400 font-bold italic">
                But they might never find each other.
              </p>
              <p className="text-[#168BFF] font-black text-2xl pt-2">
                Rydeon is built to change that.
              </p>
            </div>

            <div className="bg-[#101D3A]/80 border border-blue-900/60 p-6 rounded-2xl space-y-3">
              <span className="text-xs font-bold text-blue-200 block uppercase tracking-wider">Before Rydeon</span>
              <ul className="space-y-2.5 text-xs text-blue-100 font-medium">
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">•</span>
                  <span>WhatsApp groups overloaded with unformatted travel spam</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">•</span>
                  <span>Asking friends of friends at the last minute</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">•</span>
                  <span>Solo commuters spending ₹400+ on cabs to railway stations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">•</span>
                  <span>Unclear departure times and zero identity verification</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* NETWORK LAYER STORY WITH GENUINE PHOTO */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-extrabold text-[#1683F8] uppercase tracking-widest block">OUR PERSPECTIVE</span>
            <h2 className="text-3xl font-black text-[#101D3A]">
              Your campus is already a network.
            </h2>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              Every day, hundreds of cars, bikes, and passengers move along identical routes — from student housing clusters in Undri, Nigdi, and Wakad straight to PCU, Hinjewadi, and Pune Junction.
            </p>
            <p className="text-[#101D3A] leading-relaxed text-sm sm:text-base font-extrabold">
              We're building the layer that helps students actually use it.
            </p>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden border border-[#DCE5F0] shadow-xl bg-white">
              <img
                src={studentCarpoolChat}
                alt="Students carpooling together"
                className="w-full h-auto object-cover max-h-[380px]"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-[#101D3A]/90 backdrop-blur text-white p-3.5 rounded-2xl text-xs space-y-1">
                <p className="font-bold text-[#168BFF]">Authentic Student Mobility Layer</p>
                <p className="text-[11px] text-blue-100">Connecting verified peers along identical daily commute corridors</p>
              </div>
            </div>
          </div>
        </div>

        {/* MISSION STATEMENT */}
        <div className="bg-white border border-[#DCE5F0] rounded-3xl p-8 sm:p-12 text-center max-w-4xl mx-auto space-y-4 shadow-sm">
          <div className="flex items-center justify-center gap-2">
            <img src="/logo.png" alt="Rydeon Logo" className="h-6 w-6 object-contain" />
            <span className="text-xs font-bold text-[#1683F8] uppercase tracking-widest block">OUR MISSION</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-[#101D3A] max-w-2xl mx-auto leading-tight">
            Make student travel more affordable, connected and easier to coordinate — one campus at a time.
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
            Not a commercial taxi fleet. Not an anonymous message board. A real, verified student mobility community.
          </p>
        </div>

      </section>

      {/* FINAL BRAND CTA */}
      <section className="mt-12 py-16 px-4 bg-[#101D3A] text-white text-center rounded-3xl max-w-5xl mx-auto shadow-2xl space-y-6 border border-blue-900/60">
        <div className="flex items-center justify-center gap-2">
          <img src="/logo.png" alt="Rydeon Logo" className="h-8 w-8 object-contain" />
          <span className="text-2xl font-black text-white">Rydeon</span>
        </div>
        <h2 className="text-4xl sm:text-5xl font-black tracking-tight">
          Going somewhere?<br />
          <span className="text-[#168BFF]">Go together.</span>
        </h2>

        <p className="text-blue-100 text-sm sm:text-base max-w-md mx-auto">
          Start finding or offering student rides on your campus corridor today.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
          <Link
            to="/signup"
            className="px-7 py-3.5 bg-[#1683F8] hover:bg-[#168BFF] text-white font-extrabold rounded-xl transition text-sm shadow-lg shadow-[#1683F8]/30"
          >
            Find a Ride
          </Link>
          <Link
            to="/hosts"
            className="px-7 py-3.5 bg-[#1683F8]/20 border border-[#1683F8]/40 hover:bg-[#1683F8]/30 text-white font-bold rounded-xl transition text-sm"
          >
            Offer a Ride
          </Link>
        </div>
      </section>

    </div>
  );
}

export default About;
