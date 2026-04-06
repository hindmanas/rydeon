import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Landing() {
  const [activeModal, setActiveModal] = useState(null);
  const demoRides = [
    {
      id: 1,
      driver: "Rakshan Parashar",
      origin: "Admin Block",
      destination: "Pune Railway Station",
      time: "12:30 PM, 15th February",
      seats: 2,
      price: "20"
    },
    {
      id: 2,
      driver: "Jatin Khatri",
      origin: "Exit Gate 1",
      destination: "Akurdi Bus Stop",
      time: "4:30 PM, 23rd march",
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
    <div className="font-sans text-slate-100 min-h-screen bg-slate-900 overflow-x-hidden">
      {/* Navbar for Landing */}
      <nav className="bg-slate-900/40 backdrop-blur-md sticky top-0 z-50 border-b border-white/10 flex justify-between items-center px-8 py-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-brand-500/20 ring-1 ring-white/10 group-hover:scale-110 transition-transform duration-300">
            <svg className="w-6 h-6 text-white drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-2xl font-black text-white tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">RYDEON</span>
        </div>
        <div>
          <Link to="/login" className="px-5 py-2.5 rounded-full bg-slate-800 text-white font-medium hover:bg-slate-700 transition-colors border border-white/10 shadow-lg hover:-translate-y-0.5 transform duration-200">
            Sign In
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="fade-in relative overflow-hidden pt-32 pb-40 flex flex-col items-center justify-center text-center px-4">
        <span className="px-4 py-1.5 rounded-full bg-brand-500/10 text-brand-400 font-semibold text-sm mb-6 border border-brand-500/20 inline-block shadow-[0_0_15px_rgba(20,184,166,0.2)]">
          Exclusive for University Students 🎓
        </span>
        <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight max-w-4xl mb-6 leading-tight drop-shadow-2xl">
          Find a ride. <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-indigo-400 drop-shadow-lg">Split the cost.</span> Make a friend.
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mb-10">
          The safest, easiest, and most affordable way to travel around campus and the city with verified student peers.
        </p>
        <Link to="/signup" className="group relative inline-flex items-center justify-center px-10 py-5 font-black text-white transition-all duration-300 bg-brand-600 rounded-2xl hover:bg-brand-500 hover:shadow-[0_20px_40px_rgba(20,184,166,0.4)] hover:-translate-y-2 active:scale-95 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-600 bg-[length:200%_100%] animate-gradient-x opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <span className="relative z-10 flex items-center">
            Get Started
            <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </span>
        </Link>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 bg-slate-800/20 border-y border-white/5 backdrop-blur-md fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">How it works</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Getting where you need to go has never been easier. Just three simple steps.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-slate-800 -z-10" style={{ width: '66%', transform: 'translateX(25%)' }}></div>
            
            {[
              { step: '1', title: 'Sign Up', desc: 'Use your .edu.in email to instantly verify your student status.' },
              { step: '2', title: 'Find or Offer', desc: 'Browse available rides or post your own schedule to find passengers.' },
              { step: '3', title: 'Ride & Save', desc: 'Split costs effortlessly and enjoy a safe trip with fellow peers.' }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center text-center p-8 rounded-3xl bg-slate-800/40 hover:bg-slate-800/80 hover:shadow-2xl transition-all duration-300 border border-white/5 hover:border-white/10 transform hover:-translate-y-2 backdrop-blur-sm">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-500/20 to-indigo-500/20 flex items-center justify-center text-2xl font-bold text-brand-400 mb-6 border border-brand-500/20 shadow-[0_0_20px_rgba(20,184,166,0.2)]">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Rides Section */}
      <section className="py-24 px-4 fade-in" style={{ animationDelay: '0.2s' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Recent Rides Preview</h2>
              <p className="text-slate-400">See what's happening right now on campus.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {demoRides.map((ride) => (
              <div key={ride.id} className="card group hover:border-brand-500/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(20,184,166,0.15)] bg-slate-800/20 backdrop-blur-xl border-slate-700/30">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-slate-800 group-hover:bg-brand-500/10 flex items-center justify-center text-slate-300 group-hover:text-brand-400 font-bold uppercase overflow-hidden ring-1 ring-slate-700/50 transition-colors duration-300">
                    {ride.driver.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-white group-hover:text-brand-400 transition-colors">{ride.driver}</h3>
                    <p className="text-sm text-brand-400 font-medium">₹{ride.price.replace('$','')}</p>
                  </div>
                </div>
                
                <div className="relative pl-6 mb-6">
                  <div className="absolute top-2 left-1.5 w-0.5 h-10 bg-slate-700 group-hover:bg-brand-500/30 transition-colors"></div>
                  
                  <div className="mb-4 relative z-10">
                    <div className="absolute top-1.5 -left-6 w-3 h-3 bg-brand-500 rounded-full border-2 border-slate-900 ring-4 ring-brand-500/10"></div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-0.5">Pickup</p>
                    <p className="font-bold text-slate-200">{ride.origin}</p>
                  </div>
                  
                  <div className="relative z-10">
                    <div className="absolute top-1.5 -left-6 w-3 h-3 bg-indigo-500 rounded-full border-2 border-slate-900 ring-4 ring-indigo-500/10"></div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-0.5">Dropoff</p>
                    <p className="font-bold text-slate-200">{ride.destination}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-6 border-t border-slate-700/50">
                  <div className="flex items-center text-xs font-bold text-slate-400 bg-slate-900/50 px-3 py-2 rounded-xl border border-slate-700/50 group-hover:border-brand-500/20 transition-colors">
                    <svg className="w-4 h-4 mr-1.5 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {ride.time}
                  </div>
                  <div className="text-[10px] font-black px-3 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-tighter">
                    {ride.seats} seats
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-slate-800/30 border-t border-white/5 px-4 backdrop-blur-md fade-in" style={{ animationDelay: '0.3s' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Trusted by Students</h2>
            <p className="text-slate-400">Join hundreds of students already saving money on rides.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((t) => (
              <div key={t.id} className="p-8 rounded-3xl bg-slate-800/40 border border-white/5 backdrop-blur-sm">
                <div className="flex text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  ))}
                </div>
                <p className="text-lg text-slate-300 italic mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-slate-300">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{t.name}</h4>
                    <p className="text-sm text-slate-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-950 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded flex items-center justify-center">
                <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-slate-400">Rydeon</span>
            </div>
            <p className="text-slate-600 text-sm">© 2026 Campus RideShare.<br className="hidden md:block" />All rights reserved.</p>
          </div>

          {/* Support */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><button onClick={() => setActiveModal('help')} className="hover:text-brand-400 transition-colors text-left">Help Center</button></li>
              <li><button onClick={() => setActiveModal('safety')} className="hover:text-brand-400 transition-colors text-left">Safety Guidelines</button></li>
              <li><button onClick={() => setActiveModal('privacy')} className="hover:text-brand-400 transition-colors text-left">Privacy Policy</button></li>
            </ul>
          </div>

          {/* Contact Us */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="mailto:teamrydeon@gmail.com" className="hover:text-brand-400 transition-colors">teamrydeon@gmail.com</a></li>
              <li><a href="tel:+919876543210" className="hover:text-brand-400 transition-colors">+91 9460994039</a></li>
              <li>Pune, Maharashtra</li>
            </ul>
          </div>
        </div>
      </footer>
      {/* Modals */}
      {activeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setActiveModal(null)}>
          <div 
            className="bg-slate-900 border border-slate-700/50 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-slate-900/90 backdrop-blur pb-2 pt-6 px-6 border-b border-slate-800 flex justify-between items-center z-10">
              <h2 className="text-xl font-bold text-white">
                {activeModal === 'safety' && '🚦 Rydeon – Safety Guidelines'}
                {activeModal === 'help' && '🆘 Rydeon Help Centre'}
                {activeModal === 'privacy' && '🔒 Rydeon Privacy Policy (Simple Version)'}
              </h2>
              <button 
                onClick={() => setActiveModal(null)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
                aria-label="Close modal"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 text-slate-300 space-y-6">
              {activeModal === 'safety' && (
                <>
                  <div>
                    <h3 className="font-bold text-brand-400 mb-2 flex items-center gap-2">🔐 Account Safety</h3>
                    <ul className="list-disc pl-5 space-y-1 text-slate-400">
                      <li>Always use your own account — don’t share login details.</li>
                      <li>Keep your password strong and private.</li>
                      <li>Verify your phone/email before using the platform.</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-brand-400 mb-2 flex items-center gap-2">🚗 Ride Safety</h3>
                    <ul className="list-disc pl-5 space-y-1 text-slate-400">
                      <li>Always check driver/rider details before starting the ride.</li>
                      <li>Match vehicle number and name shown in the app.</li>
                      <li>Avoid accepting rides from unknown/unverified users.</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-brand-400 mb-2 flex items-center gap-2">📍 During the Ride</h3>
                    <ul className="list-disc pl-5 space-y-1 text-slate-400">
                      <li>Share your ride details with friends or family.</li>
                      <li>Sit in a comfortable and safe position.</li>
                      <li>If something feels wrong, cancel the ride immediately.</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-brand-400 mb-2 flex items-center gap-2">🚫 Do’s & Don’ts</h3>
                    <ul className="list-disc pl-5 space-y-1 text-slate-400">
                      <li>Do not carry illegal items.</li>
                      <li>Do not misbehave with drivers or riders.</li>
                      <li>Follow traffic rules and respect others.</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-red-400 mb-2 flex items-center gap-2">🆘 Emergency</h3>
                    <ul className="list-disc pl-5 space-y-1 text-slate-400">
                      <li>Use the emergency button (if available).</li>
                      <li>Contact local authorities if needed.</li>
                      <li>Report issues through the app immediately.</li>
                    </ul>
                  </div>
                </>
              )}

              {activeModal === 'help' && (
                <>
                  <h3 className="font-bold text-amber-400 mb-4 flex items-center gap-2">📌 Common Issues</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-white mb-1">1. Unable to book a ride</h4>
                      <ul className="list-disc pl-5 space-y-1 text-slate-400">
                        <li>Check your internet connection.</li>
                        <li>Try refreshing the app.</li>
                        <li>Make sure your location is enabled.</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">2. Payment issues</h4>
                      <ul className="list-disc pl-5 space-y-1 text-slate-400">
                        <li>Check if your payment method is valid.</li>
                        <li>Retry after some time.</li>
                        <li>Contact support if amount is deducted but ride failed.</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">3. Driver/Rider not responding</h4>
                      <ul className="list-disc pl-5 space-y-1 text-slate-400">
                        <li>Try calling through the app.</li>
                        <li>Cancel and book another ride if needed.</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">4. Ride cancellation</h4>
                      <ul className="list-disc pl-5 space-y-1 text-slate-400">
                        <li>You can cancel anytime before the ride starts.</li>
                        <li>Avoid frequent cancellations to maintain good rating.</li>
                      </ul>
                    </div>
                  </div>
                </>
              )}

              {activeModal === 'privacy' && (
                <>
                  <div>
                    <h3 className="font-bold text-indigo-400 mb-2 flex items-center gap-2">📊 What Data We Collect</h3>
                    <ul className="list-disc pl-5 space-y-1 text-slate-400">
                      <li>Name, phone number, email</li>
                      <li>Location (for ride tracking)</li>
                      <li>Payment details (secured)</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-indigo-400 mb-2 flex items-center gap-2">🎯 Why We Collect It</h3>
                    <ul className="list-disc pl-5 space-y-1 text-slate-400">
                      <li>To connect riders and drivers</li>
                      <li>To improve user experience</li>
                      <li>To ensure safety and security</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-indigo-400 mb-2 flex items-center gap-2">🔐 Data Protection</h3>
                    <ul className="list-disc pl-5 space-y-1 text-slate-400">
                      <li>Your data is सुरक्षित (safe) and encrypted</li>
                      <li>We do not sell your personal data</li>
                      <li>Only required information is shared between users</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-indigo-400 mb-2 flex items-center gap-2">🤝 Sharing of Data</h3>
                    <ul className="list-disc pl-5 space-y-1 text-slate-400">
                      <li>Rider sees driver basic details (name, vehicle)</li>
                      <li>Driver sees rider basic details</li>
                      <li>No sensitive data is shared</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-indigo-400 mb-2 flex items-center gap-2">🧾 User Control</h3>
                    <ul className="list-disc pl-5 space-y-1 text-slate-400">
                      <li>You can update or delete your account anytime</li>
                      <li>You can control what information you share</li>
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
