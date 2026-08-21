import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Import local image assets
import studentsRide from '../assets/students_ride.jpg';
import studentsBook from '../assets/students_book.jpg';
import phoneMock from '../assets/phone_mock.jpg';
import ThreeDModel from '../components/ThreeDModel';

function Landing() {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState(null);
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
      {/* Fixed Topbar / Navbar */}
      <nav className="border-b border-neutral-100 bg-white/90 backdrop-blur-md fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-4 py-4 sm:px-8 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-black text-white shadow-sm font-black">
            R
          </div>
          <span className="text-xl font-bold tracking-tight text-black">Rydeon</span>
        </div>
        <div>
          <Link to="/login" className="inline-flex items-center justify-center rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-bold text-neutral-700 shadow-sm transition-all duration-200 hover:border-neutral-300 hover:text-black">
            Log in
          </Link>
        </div>
      </nav>

      {/* Hero Section - Two Column Layout */}
      <section className="relative bg-transparent pt-24 pb-12 md:pt-32 md:pb-20 px-4 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
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
            Rydeon connects verified students already travelling your corridor — PCU to Hinjewadi, Wakad to Hadapsar — so no seat, and no rupee, goes to waste.
          </p>

          <div className="grid grid-cols-3 gap-4 pt-8 border-t border-neutral-100 max-w-xl">
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

      {/* Our Identity Section */}
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
              We noticed that hundreds of students commute daily along identical corridors — from housing clusters like <span className="font-semibold text-black">Undri and Hadapsar</span> straight to campus, and back. Rydeon pools this collective travel footprint.
            </p>
            <p className="text-neutral-600 leading-relaxed text-sm sm:text-base">
              It is not a commercial service. There are no professional drivers or surging dynamic prices. It's simply verified peers split-billing standard trips. Safe, predictable, and authentic.
            </p>

            {/* Stats row */}
            <div className="flex gap-10 pt-4 border-t border-neutral-100">
              <div>
                <p className="text-3xl font-extrabold text-teal-700">100%</p>
                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mt-1">Verified Students</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-teal-700">₹0</p>
                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mt-1">Hidden Agent Fees</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Campus Connectivity Section (Map 2) */}
      <section className="py-16 sm:py-24 px-4 bg-neutral-50 border-t border-b border-neutral-200/60">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold text-teal-700 uppercase tracking-widest block mb-2">CAMPUS CONNECTIVITY</span>
            <h2 className="text-3xl font-extrabold text-black tracking-tight mb-4">Your route. Your people.</h2>
            <p className="text-neutral-500 text-sm sm:text-base">
              A real-time network of student riders linking prominent institutes and transit hubs across Pune.
            </p>
          </div>

          {/* 3D Campus Connectivity Model */}
          <div className="w-full rounded-2xl border border-neutral-200 shadow-md overflow-hidden relative bg-white p-2">
            <ThreeDModel />
          </div>
        </div>
      </section>

      {/* Showcase Section: AI Generated Images explaining core workflow */}
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
                  className="w-full h-auto object-cover max-h-[400px] hover:scale-102 transition-transform duration-500"
                />
              </div>
            </div>
            <div className="lg:col-span-6 order-1 lg:order-2 space-y-4">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest block">PASSENGER SERVICE</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-black leading-tight">Request a ride in seconds</h3>
              <p className="text-neutral-600 leading-relaxed text-sm sm:text-base">
                No more overpaying for single cabs or waiting under the sun for public buses. Simply input your destination and find verified students already driving your route. See exactly who you're riding with, check pricing details, and secure your seat instantly.
              </p>
              <div className="pt-2">
                <Link to="/signup" className="inline-flex items-center text-sm font-bold text-black border-b border-black pb-1 hover:text-neutral-600 hover:border-neutral-600 transition">
                  Find a student ride &rarr;
                </Link>
              </div>
            </div>
          </div>

          {/* Feature 2: Driver / Offering */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest block">DRIVER SAVINGS</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-black leading-tight">Share empty seats and save fuel</h3>
              <p className="text-neutral-600 leading-relaxed text-sm sm:text-base">
                Driving to college, internships, or heading home for the holidays? List your empty seats on Rydeon. You split fuel costs with fellow students traveling the same way, reduce parking demand, and build a stronger campus community.
              </p>
              <div className="pt-2">
                <Link to="/signup" className="inline-flex items-center text-sm font-bold text-black border-b border-black pb-1 hover:text-neutral-600 hover:border-neutral-600 transition">
                  Offer a student ride &rarr;
                </Link>
              </div>
            </div>
            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden border border-neutral-200 shadow-md bg-neutral-50">
                <img
                  src={studentsRide}
                  alt="Students sharing a ride inside a car"
                  className="w-full h-auto object-cover max-h-[400px] hover:scale-102 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust First Section */}
      <section className="py-16 sm:py-24 px-4 bg-neutral-50 border-b border-neutral-200/60">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold text-teal-700 uppercase tracking-widest block mb-2">TRUST FIRST</span>
            <h2 className="text-3xl font-extrabold text-black tracking-tight mb-4">Your safety is our absolute priority</h2>
            <p className="text-neutral-500 text-sm sm:text-base">
              Rydeon is built for peace of mind. Strict identity guardrails protect every campus trip.
            </p>
          </div>

          {/* 2x2 Grid of Safety Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
            <div className="bg-white border border-neutral-200 p-6 sm:p-8 rounded-xl shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center text-teal-700">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-black">College ID Verification</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                Access is limited strictly to active college domain addresses and verified digital student IDs.
              </p>
            </div>

            <div className="bg-white border border-neutral-200 p-6 sm:p-8 rounded-xl shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center text-teal-700">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-black">Verified Profiles & Ratings</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                No anonymous profiles. Review ratings from actual campus colleagues before booking.
              </p>
            </div>

            <div className="bg-white border border-neutral-200 p-6 sm:p-8 rounded-xl shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center text-teal-700">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-black">Real-time Ride Tracking</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                Live location-sharing ensures your trusted contacts always know your commute coordinates.
              </p>
            </div>

            <div className="bg-white border border-neutral-200 p-6 sm:p-8 rounded-xl shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center text-teal-700">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-black">In-app Ride Chat</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                Message riders directly within the app's protected sandbox. No personal phone numbers shared.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-24 px-4 bg-white border-b border-neutral-200/60">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-black mb-3">How it works</h2>
            <p className="text-neutral-500 max-w-xl mx-auto text-sm sm:text-base">Three easy steps to get you where you need to be.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              { step: '1', title: 'Verify Email', desc: 'Sign up securely using your university .edu.in email address to verify status.' },
              { step: '2', title: 'Match Ride', desc: 'Search active rides matching your route or post your car route to invite riders.' },
              { step: '3', title: 'Travel & Share', desc: 'Hop in, save fuel, split the cost, and make friends safely around campus.' }
            ].map((item, idx) => (
              <div key={idx} className="bg-white border border-neutral-200 p-6 sm:p-8 rounded-xl shadow-sm transition hover:shadow-md">
                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-base font-bold mb-6">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-black mb-2">{item.title}</h3>
                <p className="text-neutral-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Rides Section */}
      <section className="py-16 sm:py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-black mb-2">Recent Rides Preview</h2>
            <p className="text-neutral-500 text-sm sm:text-base">See the latest rides happening on campus.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {demoRides.map((ride) => (
              <div key={ride.id} className="border border-neutral-200 bg-white p-5 rounded-xl shadow-sm hover:border-neutral-300 hover:shadow transition">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-800 font-bold text-sm">
                      {ride.driver.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-black">{ride.driver}</h3>
                      <p className="text-xs text-neutral-500">{ride.time}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-black text-black">₹{ride.price}</span>
                  </div>
                </div>

                <div className="space-y-2 border-t border-b border-neutral-100 py-3 my-3 text-xs text-neutral-700">
                  <div className="flex gap-2">
                    <span className="text-neutral-400 font-bold shrink-0">From</span>
                    <span className="font-semibold text-black truncate">{ride.origin}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-neutral-400 font-bold shrink-0">To</span>
                    <span className="font-semibold text-black truncate">{ride.destination}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-500 font-medium">Safe ride verified</span>
                  <span className="font-bold text-neutral-900 bg-neutral-100 px-2.5 py-1 rounded">
                    {ride.seats} seats left
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 sm:py-24 bg-neutral-50 border-t border-neutral-100 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-black mb-3">Trusted by Students</h2>
            <p className="text-neutral-500 text-sm sm:text-base">Read about other students' ride sharing experiences.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
            {testimonials.map((t) => (
              <div key={t.id} className="bg-white border border-neutral-200 p-6 sm:p-8 rounded-xl shadow-sm">
                <p className="text-sm sm:text-base text-neutral-700 italic mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center font-bold text-xs text-neutral-800">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-black">{t.name}</h4>
                    <p className="text-[10px] text-neutral-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg font-bold text-black">Rydeon</span>
            </div>
            <p className="text-neutral-400 text-xs">© 2026 Campus RideShare. All rights reserved.</p>
          </div>

          {/* Support */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-black font-bold mb-4 text-sm">Support</h3>
            <ul className="space-y-2 text-xs text-neutral-500">
              <li><button onClick={() => setActiveModal('help')} className="hover:text-black transition-colors text-left font-semibold">Help Center</button></li>
              <li><button onClick={() => setActiveModal('safety')} className="hover:text-black transition-colors text-left font-semibold">Safety Guidelines</button></li>
              <li><button onClick={() => setActiveModal('privacy')} className="hover:text-black transition-colors text-left font-semibold">Privacy Policy</button></li>
            </ul>
          </div>

          {/* Contact Us */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-black font-bold mb-4 text-sm">Contact Us</h3>
            <ul className="space-y-2 text-xs text-neutral-500">
              <li><a href="mailto:teamrydeon@gmail.com" className="hover:text-black transition-colors font-semibold">teamrydeon@gmail.com</a></li>
              <li><a href="tel:+919876543210" className="hover:text-black transition-colors font-semibold">+91 9460994039</a></li>
              <li className="font-semibold text-neutral-400">Pune, Maharashtra</li>
            </ul>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {activeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setActiveModal(null)}>
          <div
            className="bg-white border border-neutral-200 rounded-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white/95 backdrop-blur pb-3 pt-6 px-6 border-b border-neutral-100 flex justify-between items-center z-10">
              <h2 className="text-base sm:text-lg font-bold text-black">
                {activeModal === 'safety' && '🚦 Rydeon – Safety Guidelines'}
                {activeModal === 'help' && '🆘 Rydeon Help Centre'}
                {activeModal === 'privacy' && '🔒 Rydeon Privacy Policy'}
              </h2>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded-full transition"
                aria-label="Close modal"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 text-neutral-700 space-y-6 text-xs sm:text-sm">
              {activeModal === 'safety' && (
                <>
                  <div>
                    <h3 className="font-bold text-black mb-2 flex items-center gap-2 border-l-2 border-black pl-2">🔐 Account Safety</h3>
                    <ul className="list-disc pl-5 space-y-1.5 text-neutral-600">
                      <li>Always use your own account — don’t share login details.</li>
                      <li>Keep your password strong and private.</li>
                      <li>Verify your phone/email before using the platform.</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-black mb-2 flex items-center gap-2 border-l-2 border-black pl-2">🚗 Ride Safety</h3>
                    <ul className="list-disc pl-5 space-y-1.5 text-neutral-600">
                      <li>Always check driver/rider details before starting the ride.</li>
                      <li>Match vehicle number and name shown in the app.</li>
                      <li>Avoid accepting rides from unknown/unverified users.</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-black mb-2 flex items-center gap-2 border-l-2 border-black pl-2">📍 During the Ride</h3>
                    <ul className="list-disc pl-5 space-y-1.5 text-neutral-600">
                      <li>Share your ride details with friends or family.</li>
                      <li>Sit in a comfortable and safe position.</li>
                      <li>If something feels wrong, cancel the ride immediately.</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-black mb-2 flex items-center gap-2 border-l-2 border-black pl-2">🚫 Do’s & Don’ts</h3>
                    <ul className="list-disc pl-5 space-y-1.5 text-neutral-600">
                      <li>Do not carry illegal items.</li>
                      <li>Do not misbehave with drivers or riders.</li>
                      <li>Follow traffic rules and respect others.</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-red-600 mb-2 flex items-center gap-2 border-l-2 border-red-600 pl-2">🆘 Emergency</h3>
                    <ul className="list-disc pl-5 space-y-1.5 text-neutral-600">
                      <li>Contact local authorities if needed.</li>
                      <li>Report issues through the app immediately.</li>
                    </ul>
                  </div>
                </>
              )}

              {activeModal === 'help' && (
                <>
                  <h3 className="font-bold text-black mb-4 flex items-center gap-2">📌 Common Issues</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-black mb-1">1. Unable to book a ride</h4>
                      <ul className="list-disc pl-5 space-y-1.5 text-neutral-600">
                        <li>Check your internet connection.</li>
                        <li>Try refreshing the app.</li>
                        <li>Make sure your location is enabled.</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-black mb-1">2. Payment issues</h4>
                      <ul className="list-disc pl-5 space-y-1.5 text-neutral-600">
                        <li>Check if your payment method is valid.</li>
                        <li>Retry after some time.</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-black mb-1">3. Driver/Rider not responding</h4>
                      <ul className="list-disc pl-5 space-y-1.5 text-neutral-600">
                        <li>Try calling through the app.</li>
                        <li>Cancel and book another ride if needed.</li>
                      </ul>
                    </div>
                  </div>
                </>
              )}

              {activeModal === 'privacy' && (
                <>
                  <div>
                    <h3 className="font-bold text-black mb-2 flex items-center gap-2">📊 What Data We Collect</h3>
                    <ul className="list-disc pl-5 space-y-1.5 text-neutral-600">
                      <li>Name, phone number, email</li>
                      <li>Location (for ride tracking)</li>
                      <li>Payment details (secured)</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-black mb-2 flex items-center gap-2">🎯 Why We Collect It</h3>
                    <ul className="list-disc pl-5 space-y-1.5 text-neutral-600">
                      <li>To connect riders and drivers</li>
                      <li>To improve user experience</li>
                      <li>To ensure safety and security</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-black mb-2 flex items-center gap-2">🔐 Data Protection</h3>
                    <ul className="list-disc pl-5 space-y-1.5 text-neutral-600">
                      <li>Your data is safe and encrypted. We do not sell your personal data.</li>
                      <li>Only required information is shared between users.</li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Landing;
