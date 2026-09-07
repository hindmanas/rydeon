import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logout, db } from '../services/firebase';
import { collection, query, where, onSnapshot, doc, updateDoc, writeBatch } from 'firebase/firestore';
import {
  RouteIcon,
  ShieldCheckIcon,
  CarFrontIcon,
  GraduationCapIcon,
  NewspaperIcon,
  InfoIcon,
  ChevronDownIcon
} from './icons';

function Navbar({ user }) {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();

  // Handle scroll detection for compact nav transformation
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 55) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Firestore notification listeners for authenticated users
  useEffect(() => {
    if (!user) return;

    const q1 = query(
      collection(db, 'ride_requests'),
      where('driverId', '==', user.uid),
      where('status', '==', 'pending')
    );

    const q2 = query(
      collection(db, 'ride_requests'),
      where('requesterId', '==', user.uid)
    );

    let notifs1 = [];
    let notifs2 = [];

    const updateNotifs = () => {
      const incomingNotifs = notifs1.filter(n => !n.seenByDriver);
      const outgoingNotifs = notifs2.filter(
        (n) => (n.status === 'accepted' || n.status === 'rejected') && !n.seenByRequester
      );
      const combined = [...incomingNotifs, ...outgoingNotifs];
      combined.sort((a, b) => {
        const t1 = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
        const t2 = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
        return t2 - t1;
      });
      setNotifications(combined);
    };

    const unsubscribe1 = onSnapshot(q1, (snapshot) => {
      notifs1 = snapshot.docs.map(doc => ({ id: doc.id, type: 'incoming', ...doc.data() }));
      updateNotifs();
    });

    const unsubscribe2 = onSnapshot(q2, (snapshot) => {
      notifs2 = snapshot.docs.map(doc => ({ id: doc.id, type: 'outgoing', ...doc.data() }));
      updateNotifs();
    });

    return () => {
      unsubscribe1();
      unsubscribe2();
    };
  }, [user]);

  useEffect(() => {
    const hasUnreadNotifs = notifications.some(n => 
      (n.type === 'incoming' && !n.seenByDriver) || 
      (n.type === 'outgoing' && !n.seenByRequester)
    );
    if (hasUnreadNotifs) {
      setHasUnread(true);
    }
  }, [notifications]);

  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
    if (!showDropdown) {
      setHasUnread(false);
    }
  };

  const handleClearAll = async () => {
    try {
      const batch = writeBatch(db);
      notifications.forEach(notif => {
        const reqRef = doc(db, 'ride_requests', notif.id);
        if (notif.type === 'outgoing') {
          batch.update(reqRef, { seenByRequester: true });
        } else {
          batch.update(reqRef, { seenByDriver: true });
        }
      });
      await batch.commit();
      setNotifications([]);
    } catch (err) {
      console.error('Failed to clear notifications:', err);
    }
  };

  const handleNotificationClick = async (notif) => {
    setShowDropdown(false);
    setIsMobileMenuOpen(false);

    try {
      const reqRef = doc(db, 'ride_requests', notif.id);
      if (notif.type === 'outgoing') {
        await updateDoc(reqRef, { seenByRequester: true });
      } else {
        await updateDoc(reqRef, { seenByDriver: true });
      }
    } catch (err) {
      console.error('Failed to dismiss notification:', err);
    }

    navigate('/dashboard');
  };

  const mainNavItems = [
    { label: 'How it works', path: '/how-it-works', Icon: RouteIcon },
    { label: 'Safety & Trust', path: '/safety', Icon: ShieldCheckIcon },
    { label: 'For Hosts', path: '/hosts', Icon: CarFrontIcon },
    { label: 'For Campuses', path: '/campuses', Icon: GraduationCapIcon },
    { label: 'Resources', path: '/resources', Icon: NewspaperIcon },
    { label: 'About', path: '/about', Icon: InfoIcon },
  ];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 shadow-sm border-b border-slate-200/80 backdrop-blur-md py-1.5' : 'bg-white/90 border-b border-slate-100 backdrop-blur-md py-3'}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 focus:outline-none group">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-slate-950 text-white shadow-sm transition-transform group-hover:scale-105">
            <span className="text-base font-extrabold tracking-wider">R</span>
          </div>
          <span className="text-lg font-black tracking-tight text-slate-950">Rydeon</span>
        </Link>

        {/* DESKTOP NAVIGATION ITEMS */}
        <nav className={`hidden md:flex items-center gap-1 rounded-2xl bg-slate-100/70 p-1.5 border border-slate-200/60 transition-all duration-300 ${isScrolled ? 'shadow-inner' : ''}`}>
          {mainNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.Icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                title={item.label}
                className={`relative flex items-center justify-center rounded-xl px-3 py-1.5 text-xs sm:text-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? 'bg-slate-950 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-white hover:text-slate-950'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-teal-400' : 'text-slate-500 group-hover:text-slate-900'}`} />
                <span className={`nav-label ${isScrolled ? 'nav-label-collapsed' : ''}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* RIGHT ACTION BUTTONS / USER PROFILE */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-colors ${location.pathname === '/dashboard' ? 'bg-teal-600 text-white' : 'text-slate-700 bg-slate-100 hover:bg-slate-200'}`}
              >
                Dashboard
              </Link>

              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={handleDropdownToggle}
                  className="relative grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:text-slate-950"
                  aria-label="Notifications"
                >
                  <svg className="h-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 00-4-5.7V5a2 2 0 10-4 0v.3A6 6 0 006 11v3.2c0 .5-.2 1-.6 1.4L4 17h5m6 0v1a3 3 0 11-6 0v-1" />
                  </svg>
                  {hasUnread && notifications.length > 0 && (
                    <span className="absolute -right-1 -top-1 h-4 min-w-4 rounded-full bg-rose-500 px-1 text-[10px] font-bold leading-4 text-white">
                      {notifications.length}
                    </span>
                  )}
                </button>

                {showDropdown && (
                  <div className="absolute right-0 top-11 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10 z-50">
                    <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                      <h3 className="font-bold text-slate-950 text-xs">Ride requests</h3>
                      <div className="flex items-center gap-2">
                        {notifications.length > 0 && (
                          <button onClick={handleClearAll} className="text-xs font-bold text-slate-500 hover:text-rose-600 transition-colors">
                            Clear all
                          </button>
                        )}
                        <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-teal-700">{notifications.length} new</span>
                      </div>
                    </div>
                    {notifications.length === 0 ? (
                      <div className="px-4 py-6 text-center text-xs text-slate-500">No new notifications</div>
                    ) : (
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.map(notif => {
                          const isIncoming = notif.type === 'incoming';
                          let title = "New ride request";
                          let line1 = `${notif.requesterName} wants to join your ride.`;
                          let line2 = notif.pickup && notif.dropoff ? `${notif.pickup} → ${notif.dropoff}` : 'Review in dashboard';
                          let badge = "🔴";

                          if (!isIncoming) {
                            if (notif.status === 'accepted') {
                              title = "Seat confirmed! 🎉";
                              line1 = `${notif.driverName} accepted your request.`;
                              badge = "💚";
                            } else {
                              title = "Request declined ❌";
                              line1 = `${notif.driverName} declined your request.`;
                              badge = "🖤";
                            }
                          }

                          return (
                            <button key={notif.id} onClick={() => handleNotificationClick(notif)} className="flex w-full gap-3 border-b border-slate-100 px-4 py-3 text-left transition-colors last:border-0 hover:bg-slate-50">
                              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-slate-50 font-bold text-slate-700 text-xs">{badge}</span>
                              <span className="min-w-0">
                                <span className="block truncate text-xs font-semibold text-slate-950">{title}</span>
                                <span className="block text-[11px] font-semibold text-slate-700 mt-0.5">{line1}</span>
                                <span className="block text-[10px] text-slate-500 mt-0.5">{line2}</span>
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* User Profile */}
              <Link to="/profile" className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white py-1 pl-1 pr-2.5 shadow-sm transition-colors hover:border-slate-300">
                <img
                  src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || 'User'}&background=0f766e&color=fff`}
                  alt="Profile"
                  className="h-7 w-7 rounded-lg object-cover"
                />
                <span className="max-w-24 truncate text-xs font-bold text-slate-700">{user.displayName || 'User'}</span>
              </Link>

              <button onClick={logout} className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-colors">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/signup"
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-800 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-950"
              >
                <span>Find a Ride</span>
              </Link>
              <Link
                to="/hosts"
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-800 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-950"
              >
                <span>Offer a Ride</span>
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-xl bg-slate-950 px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-slate-800"
              >
                Log in
              </Link>
            </>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 md:hidden"
          aria-label="Toggle navigation menu"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {/* MOBILE EXPANDED MENU */}
      {isMobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden shadow-xl animate-in fade-in slide-in-from-top-2">
          {user && (
            <div className="mb-4 flex items-center gap-3 rounded-xl bg-slate-50 p-3">
              <img
                src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || 'User'}&background=0f766e&color=fff`}
                alt="Profile"
                className="h-9 w-9 rounded-lg object-cover"
              />
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-slate-950">{user.displayName || 'Rydeon User'}</p>
                <p className="text-[10px] text-slate-500">{notifications.length} pending updates</p>
              </div>
            </div>
          )}

          <div className="grid gap-1 mb-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-3 py-1">Navigation</p>
            {mainNavItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.Icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold transition-colors ${
                    isActive ? 'bg-slate-950 text-white' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-teal-400' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded-xl bg-teal-600 px-4 py-2.5 text-center text-xs font-bold text-white"
                >
                  Dashboard
                </Link>
                <Link
                  to="/create"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-center text-xs font-bold text-slate-800"
                >
                  Offer a Ride
                </Link>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    logout();
                  }}
                  className="rounded-xl px-4 py-2 text-left text-xs font-bold text-rose-600 hover:bg-rose-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded-xl bg-slate-950 px-4 py-2.5 text-center text-xs font-bold text-white shadow-sm"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-center text-xs font-bold text-slate-800"
                >
                  Sign up / Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;