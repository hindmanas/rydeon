import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Import local image assets
import studentsRide from '../assets/students_ride.jpg';
import studentsBook from '../assets/students_book.jpg';
import phoneMock from '../assets/phone_mock.jpg';
import CampusNetwork from '../components/CampusNetwork';
import { ArrowRightIcon } from '../components/icons';

function Landing() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('ride'); // 'ride' or 'offer'
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');

  // Safe rides ticker
  const [safeRidesCount, setSafeRidesCount] = useState(15482);

  useEffect(() => {
    // Dynamic ticker for safe rides
    const interval = setInterval(() => {
      setSafeRidesCount(prev => prev + Math.floor(Math.random() * 2) + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!pickup || !destination) return;
    // Redirect to signup page passing inputs to auto-fill search
    navigate('/signup', { state: { pickup, destination, mode: activeTab } });
  };

  const demoRides = [
    {
      id: 1,
      driver: "Rakshan Parashar",
      origin: "Admin Block",
      destination: "Pune Railway Station",
      time: "12:30 PM, 15th Feb",
      seats: 2,
      price: "20"
    },
    {
      id: 2,
      driver: "Jatin Khatri",
      origin: "Exit Gate 1",
      destination: "Akurdi Bus Stop",
      time: "4:30 PM, 23rd March",
      seats: 3,
      price: "45"
    },
    {
      id: 3,
      driver: "Arjun Tomar",
      origin: "Baner",
      destination: "Main Gate",
      time: "9:15 PM, 30th March",
      seats: 1,
      price: "30"
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: "Priyanshi S",
      role: "3rd year student",
      text: "Campus RideShare saved me so much money on Ubers to the grocery store!"
    },
    {
      id: 2,
      name: "Mohit Shrivas",
      role: "2nd year student",
      text: "I love offering rides when I head to my internship. Met some great peers and covered gas costs."
    }
  ];

  return (
    <div className="font-sans text-neutral-900 min-h-screen bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] overflow-x-hidden relative">

      {/* Hero Section - Two Column Layout */}
      <section className="relative bg-transparent pt-12 pb-12 md:pt-16 md:pb-20 px-4 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Uber-style booking widget */}
        <div className="lg:col-span-5 flex flex-col justify-center z-10">
          {/* Ticker Banner */}
          <div className="inline-flex items-center gap-2 self-start mb-6 px-3 py-1 bg-white border border-neutral-200 text-neutral-800 rounded-full text-xs font-semibold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>🛡️ {safeRidesCount.toLocaleString()} campus rides safely completed</span>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-200 shadow-xl overflow-hidden">
            {/* Widget Tabs */}
            <div className="flex border-b border-neutral-100 bg-neutral-50">
              <button
                type="button"
                onClick={() => setActiveTab('ride')}
                className={`flex-1 py-4 text-sm font-bold transition-colors flex items-center justify-center gap-2 ${activeTab === 'ride' ? 'bg-white border-b-2 border-black text-black' : 'text-neutral-500 hover:text-black'}`}
              >
                🚗 Find Ride
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('offer')}
                className={`flex-1 py-4 text-sm font-bold transition-colors flex items-center justify-center gap-2 ${activeTab === 'offer' ? 'bg-white border-b-2 border-black text-black' : 'text-neutral-500 hover:text-black'}`}
              >
                ⚡ Offer Ride
              </button>
            </div>

            {/* Widget Form */}
            <form onSubmit={handleBookingSubmit} className="p-6 space-y-5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-black leading-tight">
                {activeTab === 'ride' ? 'Go anywhere with peers' : 'Share your ride and save'}
              </h1>
              <p className="text-sm text-neutral-500">
                {activeTab === 'ride' ? 'Enter your route to find verified student drivers heading your way.' : 'Post your empty seats and split travel expenses with peers.'}
              </p>

              {/* Connecting line layout for locations */}
              <div className="relative flex gap-4 mt-2">
                {/* Visual Line connector */}
                <div className="flex flex-col items-center py-3.5">
                  <div className="w-2.5 h-2.5 rounded-full border-2 border-black bg-white shrink-0"></div>
                  <div className="w-0.5 h-12 bg-neutral-200 my-1"></div>
                  <div className="w-2.5 h-2.5 bg-black shrink-0"></div>
                </div>

                {/* Inputs */}
                <div className="flex-1 space-y-3">
                  <div>
                    <input
                      type="text"
                      placeholder="Enter pickup location..."
                      value={pickup}
                      onChange={(e) => setPickup(e.target.value)}
                      className="w-full bg-neutral-50 border border-neutral-200/80 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-black focus:bg-white transition"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Enter destination..."
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="w-full bg-neutral-50 border border-neutral-200/80 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-black focus:bg-white transition"
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white hover:bg-neutral-800 py-3.5 px-6 rounded-lg text-sm font-bold transition duration-200 active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <span>{activeTab === 'ride' ? 'Search rides' : 'Offer a ride'}</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Text & Network Stats */}
        <div className="lg:col-span-7 flex flex-col justify-center lg:pl-12 z-10 space-y-6">
          <div className="flex items-center gap-2 text-teal-700 font-bold uppercase tracking-wider text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-700"></span>
            THE RYDEON NETWORK
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-neutral-900 leading-[1.1] tracking-tight">
            Same campus.<br />
            Same route.<br />
            One ride.
          </h2>

          <p className="text-neutral-500 text-sm sm:text-base leading-relaxed max-w-xl">
            Rydeon connects verified students already travelling your corridor — PCU to Hinjewadi, PCU to Baner — so no seat, and no rupee, goes to waste.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link to="/how-it-works" className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-950 text-white rounded-xl text-xs font-bold shadow hover:bg-slate-800 transition">
              <span>Learn How It Works</span>
              <ArrowRightIcon className="w-3.5 h-3.5 text-teal-400" />
            </Link>
            <Link to="/about" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-800 rounded-xl text-xs font-bold hover:bg-slate-50 transition">
              <span>Read Our Mission</span>
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-neutral-100 max-w-xl">
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-teal-700">7</p>
              <p className="text-[10px] sm:text-xs font-bold text-neutral-400 uppercase tracking-wider mt-1">CAMPUS HUBS LIVE</p>
            </div>
            <div className="border-l border-neutral-200 pl-4">
              <p className="text-3xl sm:text-4xl font-extrabold text-teal-700">3</p>
              <p className="text-[10px] sm:text-xs font-bold text-neutral-400 uppercase tracking-wider mt-1">ACTIVE RIDE NETWORKS</p>
            </div>
            <div className="border-l border-neutral-200 pl-4">
              <p className="text-3xl sm:text-4xl font-extrabold text-teal-700">24/7</p>
              <p className="text-[10px] sm:text-xs font-bold text-neutral-400 uppercase tracking-wider mt-1">VERIFIED DRIVERS</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Identity Section -> Connected to /about */}
      <section className="py-16 sm:py-24 px-4 bg-white border-t border-neutral-200/60 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Phone mockup with ride sharing UI */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative rounded-2xl overflow-hidden border border-neutral-200 shadow-xl max-w-[360px] bg-neutral-50">
              <img
                src={phoneMock}
                alt="Smartphone showing ride mapping app route screen"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Right: Text Content */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs font-bold text-teal-700 uppercase tracking-widest block">OUR IDENTITY</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-black tracking-tight leading-tight">
              Not another ride-sharing app
            </h2>
            <p className="text-neutral-600 leading-relaxed text-sm sm:text-base">
              Commercial taxis aren't designed with student budgets or safety in mind. Rydeon is built from the ground up for our community.
            </p>
            <p className="text-neutral-600 leading-relaxed text-sm sm:text-base">
              We noticed that hundreds of students commute daily along identical corridors — straight to campus, and back. Rydeon pools this collective travel footprint.
            </p>

            <div className="pt-2">
              <Link to="/about" className="inline-flex items-center gap-2 font-bold text-xs text-slate-950 bg-slate-100 hover:bg-slate-200 px-4 py-2.5 rounded-xl transition">
                <span>Explore product story & mission</span>
                <ArrowRightIcon className="w-4 h-4 text-teal-700" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Campus Connectivity Section -> Connected to /campuses */}
      <section className="py-16 sm:py-24 px-4 bg-neutral-50 border-t border-b border-neutral-200/60">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-7xl mx-auto">
            <div>
              <span className="text-xs font-bold text-teal-700 uppercase tracking-widest block mb-1">CAMPUS CONNECTIVITY</span>
              <h2 className="text-3xl font-extrabold text-black tracking-tight">Your route. Your people.</h2>
            </div>
            <Link to="/campuses" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-950 text-white text-xs font-bold hover:bg-slate-800 transition">
              <span>For Campuses Overview</span>
              <ArrowRightIcon className="w-3.5 h-3.5 text-teal-400" />
            </Link>
          </div>

          {/* Campus Connectivity Map */}
          <div className="w-full rounded-2xl overflow-hidden relative shadow-xl">
            <CampusNetwork />
          </div>
        </div>
      </section>

      {/* Showcase Section: Workflow -> Connected to /how-it-works and /hosts */}
      <section className="py-16 sm:py-24 px-4 bg-white border-b border-neutral-200/60 relative">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold text-black tracking-tight mb-4">Built specifically for student life</h2>
            <p className="text-neutral-500">A reliable, peer-to-peer ride network tailored to your campus commute, station transfers, and weekend travel.</p>
          </div>

          {/* Feature 1: Passenger / Booking */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            <div className="lg:col-span-6 order-2 lg:order-1">
              <div className="relative rounded-2xl overflow-hidden border border-neutral-200 shadow-md bg-neutral-50">
                <img
                  src={studentsBook}
                  alt="Student booking a ride on campus pathway"
                  className="w-full h-auto object-cover max-h-[400px]"
                />
              </div>
            </div>
            <div className="lg:col-span-6 order-1 lg:order-2 space-y-4">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest block">PASSENGER SERVICE</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-black leading-tight">Request a ride in seconds</h3>
              <p className="text-neutral-600 leading-relaxed text-sm sm:text-base">
                No more overpaying for single cabs or waiting under the sun for public buses. Simply input your destination and find verified students already driving your route.
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <Link to="/signup" className="inline-flex items-center gap-2 px-4 py-2 bg-slate-950 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition">
                  Find a student ride
                </Link>
                <Link to="/how-it-works" className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl transition">
                  Learn how it works &rarr;
                </Link>
              </div>
            </div>
          </div>

          {/* Feature 2: Driver / Hosting */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest block">DRIVER SAVINGS</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-black leading-tight">Share empty seats and save fuel</h3>
              <p className="text-neutral-600 leading-relaxed text-sm sm:text-base">
                Driving to college, internships, or heading home for the holidays? List your empty seats on Rydeon. You split fuel costs with fellow students traveling the same way.
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <Link to="/hosts" className="inline-flex items-center gap-2 px-4 py-2 bg-slate-950 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition">
                  Become a host &rarr;
                </Link>
                <Link to="/signup" className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl transition">
                  Offer a ride
                </Link>
              </div>
            </div>
            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden border border-neutral-200 shadow-md bg-neutral-50">
                <img
                  src={studentsRide}
                  alt="Students sharing a ride inside a car"
                  className="w-full h-auto object-cover max-h-[400px]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust First Section -> Connected to /safety */}
      <section className="py-16 sm:py-24 px-4 bg-neutral-50 border-b border-neutral-200/60">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-teal-700 uppercase tracking-widest block mb-2">TRUST FIRST</span>
            <h2 className="text-3xl font-extrabold text-black tracking-tight">Your safety is our absolute priority</h2>
            <p className="text-neutral-500 text-sm sm:text-base">
              Rydeon is built for peace of mind. Strict identity guardrails protect every campus trip.
            </p>
            <div className="pt-2">
              <Link to="/safety" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-950 text-white text-xs font-bold hover:bg-slate-800 transition">
                <span>See our safety approach & standards</span>
                <ArrowRightIcon className="w-3.5 h-3.5 text-teal-400" />
              </Link>
            </div>
          </div>

          {/* 2x2 Grid of Safety Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
            <div className="bg-white border border-neutral-200 p-6 sm:p-8 rounded-xl shadow-sm space-y-3">
              <h3 className="text-lg font-bold text-black">College ID Verification</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                Access is limited strictly to active college domain addresses and verified digital student IDs.
              </p>
            </div>

            <div className="bg-white border border-neutral-200 p-6 sm:p-8 rounded-xl shadow-sm space-y-3">
              <h3 className="text-lg font-bold text-black">Request-based Confirmation</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                PENDING → ACCEPTED → CONFIRMED lifecycle ensures hosts choose who enters their vehicle.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Teaser -> Connected to /how-it-works */}
      <section className="py-16 sm:py-24 px-4 bg-white border-b border-neutral-200/60">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-black mb-3">How it works</h2>
            <p className="text-neutral-500 max-w-xl mx-auto text-sm sm:text-base">Four easy steps to get you where you need to be.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Find a Ride', desc: 'Enter pickup, destination, and travel timing.' },
              { step: '2', title: 'Request a Seat', desc: 'Ask to join and wait for host review.' },
              { step: '3', title: 'Get Confirmed', desc: 'Driver accepts, locking your seat.' },
              { step: '4', title: 'Chat & Go', desc: 'Coordinate safely in-app and split expenses.' }
            ].map((item, idx) => (
              <div key={idx} className="bg-white border border-neutral-200 p-6 rounded-xl shadow-sm">
                <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="text-base font-bold text-black mb-1">{item.title}</h3>
                <p className="text-neutral-600 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center pt-10">
            <Link to="/how-it-works" className="inline-flex items-center gap-2 px-6 py-3 bg-slate-950 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition">
              <span>View full step-by-step workflow</span>
              <ArrowRightIcon className="w-3.5 h-3.5 text-teal-400" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer -> Connected to /resources, /safety, /about */}
      <footer className="py-12 bg-white border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start space-y-2">
            <span className="text-lg font-bold text-black">Rydeon</span>
            <p className="text-neutral-500 text-xs">Student-to-student mobility network.</p>
            <p className="text-neutral-400 text-[11px]">© 2026 Rydeon. All rights reserved.</p>
          </div>

          {/* Dedicated Pages */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-black font-bold mb-3 text-xs uppercase tracking-wider">Explore Pages</h3>
            <ul className="space-y-2 text-xs text-neutral-600 font-semibold">
              <li><Link to="/how-it-works" className="hover:text-black transition">How It Works</Link></li>
              <li><Link to="/safety" className="hover:text-black transition">Safety & Trust</Link></li>
              <li><Link to="/hosts" className="hover:text-black transition">For Hosts</Link></li>
              <li><Link to="/campuses" className="hover:text-black transition">For Campuses</Link></li>
            </ul>
          </div>

          {/* Support & Resources */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-black font-bold mb-3 text-xs uppercase tracking-wider">Resources</h3>
            <ul className="space-y-2 text-xs text-neutral-600 font-semibold">
              <li><Link to="/resources" className="hover:text-black transition">Help & FAQ Center</Link></li>
              <li><Link to="/safety" className="hover:text-black transition">Safety Checklist</Link></li>
              <li><Link to="/about" className="hover:text-black transition">About Rydeon</Link></li>
            </ul>
          </div>

          {/* Contact Us */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-black font-bold mb-3 text-xs uppercase tracking-wider">Contact Us</h3>
            <ul className="space-y-2 text-xs text-neutral-600 font-semibold">
              <li><a href="mailto:teamrydeon@gmail.com" className="hover:text-black transition">teamrydeon@gmail.com</a></li>
              <li className="text-neutral-400 font-normal">Pune, Maharashtra</li>
            </ul>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default Landing;
