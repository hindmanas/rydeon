import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  NewspaperIcon,
  ChevronDownIcon,
  ShieldCheckIcon,
  RouteIcon,
  CarFrontIcon,
  CheckCircleIcon,
  ArrowRightIcon
} from '../components/icons';

function Resources() {
  // Accordion open states
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      id: 1,
      question: "What is Rydeon?",
      answer: "Rydeon is a student-focused ride-sharing platform designed specifically for college commuters. Verified students heading in the same direction can connect, split travel expenses, and commute safely between campus, railway stations, housing clusters, and home."
    },
    {
      id: 2,
      question: "Does requesting a ride confirm my seat?",
      answer: "No. Requesting a ride sends an interest notification to the host driver. Your seat status remains PENDING until the driver explicitly reviews and accepts your request. Only after ACCEPTANCE does your seat become CONFIRMED and reserved."
    },
    {
      id: 3,
      question: "When can I chat with the driver?",
      answer: "In-app ride chat unlocks ONLY after the driver accepts your request. This protects privacy, prevents spam, and ensures that conversations are strictly kept within confirmed, legitimate trips."
    },
    {
      id: 4,
      question: "Can I offer a ride?",
      answer: "Yes! If you commute with an empty car or bike seat, you can post an offered ride by selecting pickup, destination, timing, available seats, and split price per seat."
    },
    {
      id: 5,
      question: "Can I reject a request?",
      answer: "Absolutely. As a host driver, you maintain full authority over who joins your vehicle. You can review applicant student profiles and accept or decline any request based on your comfort."
    }
  ];

  const categories = [
    {
      title: "Getting Started",
      icon: "🚀",
      items: [
        { name: "How to find your first ride", desc: "Step-by-step guide to searching corridors, filtering departure times, and sending seat requests." },
        { name: "How to offer your first ride", desc: "Learn how to list empty vehicle seats and set fair, split-cost pricing per seat." },
        { name: "How ride requests work", desc: "Understanding the PENDING → ACCEPTED → CONFIRMED booking lifecycle." }
      ]
    },
    {
      title: "Safety & Verification",
      icon: "🛡️",
      items: [
        { name: "Student ride-sharing safety checklist", desc: "Crucial precautions to review before getting in any shared vehicle." },
        { name: "What to check before joining a ride", desc: "Verifying driver credentials, vehicle details, and meeting at official campus pickup points." },
        { name: "How to report a problem", desc: "Direct reporting protocols for community safety or policy violations." }
      ]
    },
    {
      title: "Campus Travel & Costs",
      icon: "🗺️",
      items: [
        { name: "How to plan intercity trips", desc: "Coordinating travel during weekend home runs, holidays, or festival breaks." },
        { name: "How to split travel costs fairly", desc: "Understanding split-fuel calculations vs commercial taxi pricing." },
        { name: "How to coordinate pickup points", desc: "Best practices for meeting near campus security gates and transit hubs." }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans pb-20">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28 px-4 border-b border-slate-100 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950 text-white text-xs font-bold uppercase tracking-wider">
            <NewspaperIcon className="w-4 h-4 text-teal-400" />
            <span>Student Travel Resources</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-950 tracking-tight leading-[1.1]">
            Useful things for getting<br />
            <span className="text-teal-700"> around smarter.</span>
          </h1>

          <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            Guides, answers and practical tips for students who travel between campus, home and everything in between.
          </p>
        </div>
      </section>

      {/* RESOURCE CATEGORIES */}
      <section className="py-20 px-4 max-w-6xl mx-auto space-y-16">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold text-teal-700 uppercase tracking-widest block mb-2">GUIDES & ARTICLES</span>
          <h2 className="text-3xl font-extrabold text-slate-950">Everything you need to know</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat, idx) => (
            <div key={idx} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-200/80 pb-4">
                <span className="text-2xl">{cat.icon}</span>
                <h3 className="font-extrabold text-slate-950 text-base">{cat.title}</h3>
              </div>

              <div className="space-y-4">
                {cat.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm space-y-1 hover:border-slate-300 transition">
                    <h4 className="font-bold text-xs text-slate-950 flex items-center justify-between">
                      <span>{item.name}</span>
                      <ArrowRightIcon className="w-3 h-3 text-slate-400 shrink-0" />
                    </h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* EXPANDABLE FAQ ACCORDION SECTION */}
      <section className="py-16 px-4 bg-slate-50 border-t border-b border-slate-200/80">
        <div className="max-w-3xl mx-auto space-y-10">
          <div className="text-center">
            <span className="text-xs font-bold text-teal-700 uppercase tracking-widest block mb-2">FREQUENTLY ASKED QUESTIONS</span>
            <h2 className="text-3xl font-extrabold text-slate-950">Got questions? We've got answers.</h2>
          </div>

          {/* ACCORDION ITEMS */}
          <div className="space-y-3">
            {faqs.map((faq) => {
              const isOpen = openFaq === faq.id;
              return (
                <div
                  key={faq.id}
                  className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-sm transition"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                    className="w-full px-6 py-4 text-left font-bold text-slate-950 text-sm flex items-center justify-between gap-4 hover:bg-slate-50 transition"
                  >
                    <span>{faq.question}</span>
                    <ChevronDownIcon className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-teal-700' : ''}`} />
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-xs text-slate-600 border-t border-slate-100 leading-relaxed bg-slate-50/50">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* BOTTOM HELP CTA */}
      <section className="mt-16 text-center max-w-xl mx-auto px-4 space-y-4">
        <h3 className="font-extrabold text-slate-950 text-lg">Still have questions?</h3>
        <p className="text-xs text-slate-500">
          Contact our campus support team anytime at <a href="mailto:teamrydeon@gmail.com" className="font-bold text-teal-700 underline">teamrydeon@gmail.com</a>.
        </p>
        <div className="pt-2">
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-6 py-3 text-xs font-bold text-white shadow"
          >
            <span>Get Started with Rydeon</span>
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>
      </section>

    </div>
  );
}

export default Resources;
