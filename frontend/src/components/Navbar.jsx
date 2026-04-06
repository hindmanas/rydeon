import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout, db } from '../services/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

function Navbar({ user }) {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    
    // Listen for requests where the current user is the driver and status is pending
    const q = query(
      collection(db, 'ride_requests'), 
      where('driverId', '==', user.uid),
      where('status', '==', 'pending')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Sort client-side to avoid needing a composite index for createdAt
      notifs.sort((a, b) => {
         const t1 = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
         const t2 = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
         return t2 - t1;
      });
      setNotifications(notifs);
    });

    return () => unsubscribe();
  }, [user]);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const handleNotificationClick = () => {
    setShowDropdown(false);
    setIsMobileMenuOpen(false); // Close mobile menu if open
    navigate('/dashboard');
  };

  return (
    <nav className="bg-slate-900/40 backdrop-blur-md sticky top-0 z-50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group focus:outline-none">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-brand-500/30">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-white tracking-wide">
                Rydeon
              </span>
            </Link>
          </div>
          
          {/* Desktop Right Nav Elements */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/create" className="text-slate-300 hover:text-white font-medium transition-colors">
              Offer a Ride
            </Link>
            <Link to="/dashboard" className="text-slate-300 hover:text-white font-medium transition-colors">
              Dashboard
            </Link>
            
            <div className="border-l border-white/10 h-6 mx-2"></div>
            
            {/* Notification Bell */}
            <div className="relative flex items-center" ref={dropdownRef}>
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="relative p-2 text-slate-400 hover:text-white transition-colors focus:outline-none rounded-full hover:bg-slate-800/50"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {notifications.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-slate-900"></span>
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showDropdown && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="p-3 border-b border-slate-700/50 bg-slate-800/80 backdrop-blur-md flex justify-between items-center">
                    <h3 className="font-semibold text-white">Notifications</h3>
                    <span className="text-xs font-medium bg-brand-500/10 text-brand-400 px-2 py-0.5 rounded-full">
                      {notifications.length} New
                    </span>
                  </div>
                  <div className="max-h-80 overflow-y-auto w-full">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-slate-400 text-sm">
                        No new notifications
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        {notifications.map(notif => (
                          <button 
                            key={notif.id}
                            onClick={handleNotificationClick}
                            className="text-left w-full p-4 hover:bg-slate-700/50 transition-colors border-b border-slate-700/50 last:border-0 flex gap-3 group focus:outline-none"
                          >
                            <div className="w-10 h-10 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold flex-shrink-0">
                              {notif.requesterName?.charAt(0) || 'U'}
                            </div>
                            <div className="flex-1 overflow-hidden">
                              <p className="text-sm text-white truncate">
                                <span className="font-semibold">{notif.requesterName}</span> wants to join.
                              </p>
                              <p className="text-xs text-brand-400 mt-1 font-medium group-hover:underline">Click to review</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {notifications.length > 0 && (
                    <div className="p-2 border-t border-slate-700/50 bg-slate-800/80">
                      <button 
                        onClick={handleNotificationClick}
                        className="w-full text-center text-xs font-medium text-slate-400 hover:text-white transition-colors p-2 focus:outline-none"
                      >
                        View all in Dashboard
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-3 ml-2 pl-4 border-l border-white/10">
              <Link to="/profile" className="focus:outline-none hover:scale-105 active:scale-95 transition-transform" title="My Profile">
                <img 
                  src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || 'User'}&background=10b981&color=fff`} 
                  alt="Profile" 
                  className="w-9 h-9 rounded-full border border-brand-500/50 shadow-[0_0_10px_rgba(16,185,129,0.2)] object-cover bg-neutral-900"
                />
              </Link>
              <button onClick={logout} className="text-sm font-medium text-slate-400 hover:text-red-400 transition-colors focus:outline-none">
                Logout
              </button>
            </div>
          </div>

          {/* Mobile Actions: Notifications & Menu Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Mobile Notification Bell */}
            <button 
              onClick={() => {
                setShowDropdown(!showDropdown);
                setIsMobileMenuOpen(false);
              }}
              className="relative p-2 text-slate-400 hover:text-white transition-colors focus:outline-none rounded-full"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {notifications.length > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-500 border-2 border-black"></span>
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => {
                setIsMobileMenuOpen(!isMobileMenuOpen);
                setShowDropdown(false);
              }}
              className="p-2 text-slate-400 hover:text-white focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Notification Dropdown */}
      {showDropdown && notifications.length > 0 && (
        <div className="md:hidden absolute top-16 left-4 right-4 bg-neutral-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in slide-in-from-top-2">
          <div className="p-3 border-b border-white/5 bg-black/40 flex justify-between items-center">
            <h3 className="font-semibold text-white text-sm">Notifications</h3>
            <span className="text-[10px] font-medium bg-brand-500/10 text-brand-400 px-2 py-0.5 rounded-full">
              {notifications.length} New
            </span>
          </div>
          <div className="max-h-60 overflow-y-auto w-full">
            <div className="flex flex-col">
              {notifications.map(notif => (
                <button 
                  key={notif.id}
                  onClick={handleNotificationClick}
                  className="text-left w-full p-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 flex gap-3 group focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {notif.requesterName?.charAt(0) || 'U'}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm text-white truncate">
                       <span className="font-semibold">{notif.requesterName}</span> wants to join.
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Expanded */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#0a0a0a] border-b border-white/10 animate-in slide-in-from-top-2 shadow-2xl">
          <div className="px-4 py-4 space-y-3">
            <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 mb-6 p-3 bg-neutral-900/50 rounded-xl hover:bg-neutral-900 transition-colors border border-transparent hover:border-white/5 group">
              <img 
                src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || 'User'}&background=10b981&color=fff`} 
                alt="Profile" 
                className="w-12 h-12 rounded-full border border-brand-500/30 object-cover shadow-[0_0_15px_rgba(16,185,129,0.15)] group-hover:border-brand-500 transition-colors"
              />
              <div>
                <p className="text-white font-semibold text-sm group-hover:text-brand-400 transition-colors">{user.displayName || 'Rydeon User'}</p>
                <p className="text-slate-400 text-xs mt-0.5 font-medium">View Profile Info &rarr;</p>
              </div>
            </Link>
            
            <Link 
              to="/create" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium"
            >
              Offer a Ride
            </Link>
            <Link 
              to="/dashboard" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-sm font-medium"
            >
              Dashboard
            </Link>
            <button 
              onClick={() => {
                setIsMobileMenuOpen(false);
                logout();
              }}
              className="w-full text-left px-3 py-2 mt-4 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-sm font-medium focus:outline-none"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
