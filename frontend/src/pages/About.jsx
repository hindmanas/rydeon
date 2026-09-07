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

function About() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans pb-20">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28 px-4 border-b border-slate-100 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/60 text-teal-800 text-xs font-bold uppercase tracking-wider">
            <InfoIcon className="w-4 h-4 text-teal-600" />
            <span>The Rydeon Story</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-950 tracking-tight leading-[1.1]">
            We started with a<br />
            <span className="text-teal-700"> simple problem.</span>
          </h1>

          <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            Students are already travelling the same roads every day. They just don't always know who else is going their way.
          </p>
        </div>
      </section>

      {/* STORY & NARRATIVE SECTION */}
      <section className="py-20 px-4 max-w-5xl mx-auto space-y-16">
        
        <div className="bg-slate-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-800 space-y-8">
          <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
            <span className="text-xs font-extrabold text-teal-400 uppercase tracking-widest">THE COMMUTE REALITY</span>
            <span className="text-xs text-slate-400">Campus Travel Paradigm</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4 text-sm sm:text-base leading-relaxed text-slate-300">
              <p className="text-white font-bold text-lg">
                One student is heading home.
              </p>
              <p className="text-white font-bold text-lg">
                Another is going to the same city.
              </p>
              <p className="text-white font-bold text-lg">
                Someone else has an empty seat.
              </p>
              <p className="text-rose-400 font-semibold italic">
                But they might never find each other.
              </p>
              <p className="text-teal-400 font-extrabold text-xl pt-2">
                Rydeon is built to change that.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
              <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">Common Scenarios</span>
              <ul className="space-y-2.5 text-xs text-slate-300">
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

        {/* NETWORK LAYER STORY */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-bold text-teal-700 uppercase tracking-widest block">OUR PERSPECTIVE</span>
            <h2 className="text-3xl font-extrabold text-slate-950">
              Your campus is already a network.
            </h2>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              Every day, hundreds of cars, bikes, and passengers move along identical routes — from student housing clusters in Undri and Nigdi straight to PCU, Hinjewadi, and Pune Junction.
            </p>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base font-medium">
              We're building the layer that helps students actually use it.
            </p>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-lg bg-slate-50">
              <img
                src={studentsRide}
                alt="Students carpooling together"
                className="w-full h-auto object-cover max-h-[360px]"
              />
            </div>
          </div>
        </div>

        {/* MISSION STATEMENT */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-8 sm:p-12 text-center max-w-4xl mx-auto space-y-4">
          <span className="text-xs font-bold text-teal-700 uppercase tracking-widest block">OUR MISSION</span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-950 max-w-2xl mx-auto leading-tight">
            Make student travel more affordable, connected and easier to coordinate — one campus at a time.
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
            Not a commercial taxi fleet. Not an anonymous message board. A real, verified student mobility community.
          </p>
        </div>

      </section>

      {/* FINAL BRAND CTA */}
      <section className="mt-12 py-16 px-4 bg-slate-950 text-white text-center rounded-3xl max-w-5xl mx-auto shadow-2xl space-y-6">
        <h2 className="text-4xl sm:text-5xl font-black tracking-tight">
          Going somewhere?<br />
          <span className="text-teal-400">Go together.</span>
        </h2>

        <p className="text-slate-400 text-sm sm:text-base max-w-md mx-auto">
          Start finding or offering student rides on your campus corridor today.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
          <Link
            to="/signup"
            className="px-7 py-3.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold rounded-xl transition text-sm shadow-md"
          >
            Find a Ride
          </Link>
          <Link
            to="/hosts"
            className="px-7 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition text-sm"
          >
            Offer a Ride
          </Link>
        </div>
      </section>

    </div>
  );
}

export default About;
