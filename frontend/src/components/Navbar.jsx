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
  UsersIcon,
  MessageSquareIcon,
  UserCheckIcon
} from './icons';

const landingNavItems = [
  { label: 'How It Works', path: '/how-it-works', Icon: RouteIcon, keepLabel: true },
  { label: 'Safety & Trust', path: '/safety', Icon: ShieldCheckIcon, keepLabel: true },
  { label: 'For Students', path: '/how-it-works', Icon: CarFrontIcon, keepLabel: true },
  { label: 'Resources', path: '/resources', Icon: NewspaperIcon, keepLabel: true },
  { label: 'About', path: '/about', Icon: InfoIcon, keepLabel: true },
];

function LandingNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [collapseProgress, setCollapseProgress] = useState(0);

  useEffect(() => {
    let frame;
    const updateProgress = () => {
      frame = undefined;
      setCollapseProgress(Math.min(window.scrollY / 180, 1));
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <header
      className="landing-header"
      style={{
        '--landing-nav-gap': `${0.5 - (0.18 * collapseProgress)}rem`,
        '--landing-nav-height': `${4 - (0.75 * collapseProgress)}rem`,
        '--landing-nav-padding': `${0.4 - (0.1 * collapseProgress)}rem`,
        '--landing-brand-gap': `${0.55 * (1 - collapseProgress)}rem`,
        '--landing-brand-width': `${5 * (1 - collapseProgress)}rem`,
        '--landing-label-width': `${7.8 * (1 - collapseProgress)}rem`,
        '--landing-link-padding': `${0.65 - (0.13 * collapseProgress)}rem`,
        '--landing-cta-width': `${2.5 + (6.3 * (1 - collapseProgress))}rem`,
        '--landing-cta-padding': `${0.75 - (0.12 * collapseProgress)}rem`,
        '--landing-cta-label-width': `${5 * (1 - collapseProgress)}rem`,
        '--landing-label-opacity': 1 - collapseProgress,
      }}
    >
      <nav className="landing-nav-pill" aria-label="Primary navigation">
        <Link to="/" className="landing-brand" aria-label="Rydeon home">
          <span className="landing-brand-mark">
            <img src="/logo.png" alt="" className="h-7 w-7 object-contain" />
          </span>
          <span className="landing-brand-name">Rydeon</span>
        </Link>

        <div className="landing-nav-links">
          {landingNavItems.map((item) => {
            const NavIcon = item.Icon;
            return (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => window.scrollTo(0, 0)}
                className={`landing-nav-link ${item.keepLabel ? 'landing-nav-link--persistent' : ''}`}
                aria-label={item.label}
                title={item.label}
              >
                <NavIcon className="h-4 w-4 shrink-0" />
                <span className="landing-nav-label">{item.label}</span>
              </Link>
            );
          })}
        </div>

        <Link to="/signup" className="landing-nav-cta" aria-label="Get started" title="Get started">
          <span className="landing-nav-cta-label">Get Started</span>
          <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.25" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0 0 4-4m-4 4-4-4M5 20h14" />
          </svg>
        </Link>

        <button
          type="button"
          className="landing-menu-toggle"
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="m6 6 12 12M18 6 6 18" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </nav>

      <div className={`landing-mobile-menu ${menuOpen ? 'is-open' : ''}`} aria-hidden={!menuOpen}>
        {landingNavItems.map((item) => {
          const NavIcon = item.Icon;
          return (
            <Link key={item.label} to={item.path} onClick={() => setMenuOpen(false)} className="landing-mobile-link">
              <NavIcon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
        <Link to="/signup" onClick={() => setMenuOpen(false)} className="landing-mobile-cta">Get Started</Link>
      </div>
    </header>
  );
}

function Navbar({ user }) {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();

  // Handle scroll detection for compact nav transformation
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 60) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
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
    setHasUnread(hasUnreadNotifs);
  }, [notifications]);

  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
    setShowProfileDropdown(false);
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

  const authNavItems = [
    { label: 'Find Rides', path: '/', Icon: RouteIcon },
    { label: 'Offer Ride', path: '/create', Icon: CarFrontIcon },
    { label: 'My Rides', path: '/dashboard', Icon: ShieldCheckIcon },
    { label: 'Dashboard', path: '/dashboard', Icon: GraduationCapIcon },
  ];

  const mainNavItems = user ? authNavItems : [
    { label: 'How it works', path: '/how-it-works', Icon: RouteIcon },
    { label: 'Safety & Trust', path: '/safety', Icon: ShieldCheckIcon },
    { label: 'For Hosts', path: '/hosts', Icon: CarFrontIcon },
    { label: 'For Campuses', path: '/campuses', Icon: GraduationCapIcon },
    { label: 'Resources', path: '/resources', Icon: NewspaperIcon },
    { label: 'About', path: '/about', Icon: InfoIcon },
  ];

  // Mobile Bottom Navigation Bar Items (for authenticated users)
  const mobileBottomItems = [
    { label: 'Rides', path: '/', Icon: RouteIcon },
    { label: 'Community', path: '/campuses', Icon: UsersIcon },
    { label: 'Messages', path: '/dashboard', Icon: MessageSquareIcon },
    { label: 'Profile', path: '/profile', Icon: UserCheckIcon },
  ];

  if (!user && location.pathname === '/') {
    return <LandingNavbar />;
  }

  return (
    <>
      <header className={`rydeon-header ${isScrolled ? 'compact' : 'expanded'} flex items-center bg-white border-b border-[#DCE5F0]`}>
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* LOGO WITH RYDEON BLUE BRANDING */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 focus:outline-none group">
            <div className="relative overflow-hidden rounded-xl bg-[#1683F8] p-1.5 shadow-sm transition-transform group-hover:scale-105">
              <img
                src="/logo.png"
                alt="Rydeon Logo"
                className="h-7 w-7 object-contain brightness-0 invert"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="hidden h-7 w-7 items-center justify-center rounded-lg text-white font-black text-sm">
                R
              </div>
            </div>
            <span className="text-xl font-black tracking-tight text-[#101D3A]">Rydeon</span>
          </Link>

          {/* DESKTOP NAVIGATION ITEMS */}
          <nav className="hidden md:flex rydeon-nav-container">
            {mainNavItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.Icon;
              return (
                <div key={item.label} className="relative nav-item-group flex items-center">
                  <Link
                    to={item.path}
                    className={`relative flex items-center justify-center rounded-xl px-3.5 py-1.5 text-xs sm:text-sm font-bold transition-all duration-200 ${
                      isActive
                        ? 'bg-[#EEF7FF] text-[#1683F8]'
                        : 'text-[#65728A] hover:bg-[#F5FAFF] hover:text-[#101D3A]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-[#1683F8]' : 'text-[#65728A]'}`} />
                    <span className="nav-label font-bold ml-1.5">
                      {item.label}
                    </span>
                  </Link>
                </div>
              );
            })}
          </nav>

          {/* RIGHT ACTION BUTTONS / NOTIFICATIONS / USER PROFILE */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            {user ? (
              <>
                {/* Notification Bell */}
                <div className="relative">
                  <button
                    onClick={handleDropdownToggle}
                    className="relative grid h-10 w-10 place-items-center rounded-xl border border-[#DCE5F0] bg-white text-[#101D3A] shadow-sm transition-colors hover:border-[#1683F8] hover:text-[#1683F8]"
                    aria-label="Notifications"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 00-4-5.7V5a2 2 0 10-4 0v.3A6 6 0 006 11v3.2c0 .5-.2 1-.6 1.4L4 17h5m6 0v1a3 3 0 11-6 0v-1" />
                    </svg>
                    {hasUnread && notifications.length > 0 && (
                      <span className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full bg-[#E5484D] ring-2 ring-white" />
                    )}
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 top-12 w-80 overflow-hidden rounded-2xl border border-[#DCE5F0] bg-white shadow-xl shadow-blue-900/10 z-50 animate-in fade-in duration-150">
                      <div className="flex items-center justify-between border-b border-[#DCE5F0] px-4 py-3 bg-[#F7FAFE]">
                        <h3 className="font-bold text-[#101D3A] text-xs uppercase tracking-wider">Ride notifications</h3>
                        <div className="flex items-center gap-2">
                          {notifications.length > 0 && (
                            <button onClick={handleClearAll} className="text-xs font-bold text-[#65728A] hover:text-[#E5484D] transition-colors">
                              Clear all
                            </button>
                          )}
                          <span className="rounded-full bg-[#EEF7FF] px-2 py-0.5 text-[10px] font-bold text-[#1683F8]">{notifications.length} new</span>
                        </div>
                      </div>
                      {notifications.length === 0 ? (
                        <div className="px-4 py-6 text-center text-xs text-[#65728A]">No unread notifications</div>
                      ) : (
                        <div className="max-h-80 overflow-y-auto">
                          {notifications.map(notif => {
                            const isIncoming = notif.type === 'incoming';
                            let title = "New ride request";
                            let line1 = `${notif.requesterName} wants to join your ride.`;
                            let line2 = notif.pickup && notif.dropoff ? `${notif.pickup} → ${notif.dropoff}` : 'Review in dashboard';

                            if (!isIncoming) {
                              if (notif.status === 'accepted') {
                                title = "Seat confirmed!";
                                line1 = `${notif.driverName} accepted your request.`;
                              } else {
                                title = "Request declined";
                                line1 = `${notif.driverName} declined your request.`;
                              }
                            }

                            return (
                              <button key={notif.id} onClick={() => handleNotificationClick(notif)} className="flex w-full gap-3 border-b border-[#DCE5F0]/60 px-4 py-3 text-left transition-colors last:border-0 hover:bg-[#F5FAFF]">
                                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[#EEF7FF] font-bold text-[#1683F8] text-xs">🚗</span>
                                <span className="min-w-0">
                                  <span className="block truncate text-xs font-bold text-[#101D3A]">{title}</span>
                                  <span className="block text-[11px] font-semibold text-[#65728A] mt-0.5">{line1}</span>
                                  <span className="block text-[10px] text-[#65728A] mt-0.5">{line2}</span>
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* User Profile Dropdown Toggle */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowProfileDropdown(!showProfileDropdown);
                      setShowDropdown(false);
                    }}
                    className="flex items-center gap-2 rounded-xl border border-[#DCE5F0] bg-white py-1 pl-1 pr-2.5 shadow-sm transition-colors hover:border-[#1683F8]"
                  >
                    <img
                      src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || 'User'}&background=1683F8&color=fff`}
                      alt="Profile"
                      className="h-7 w-7 rounded-lg object-cover"
                    />
                    <span className="max-w-24 truncate text-xs font-bold text-[#101D3A]">{user.displayName || 'Profile'}</span>
                    <svg className="h-3.5 w-3.5 text-[#65728A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {showProfileDropdown && (
                    <div className="absolute right-0 top-12 w-48 overflow-hidden rounded-2xl border border-[#DCE5F0] bg-white shadow-xl shadow-blue-900/10 z-50 py-1.5 animate-in fade-in duration-150">
                      <Link
                        to="/profile"
                        onClick={() => setShowProfileDropdown(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-[#101D3A] hover:bg-[#F5FAFF] hover:text-[#1683F8]"
                      >
                        <UserCheckIcon className="h-4 w-4" />
                        <span>My Profile</span>
                      </Link>
                      <Link
                        to="/dashboard"
                        onClick={() => setShowProfileDropdown(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-[#101D3A] hover:bg-[#F5FAFF] hover:text-[#1683F8]"
                      >
                        <GraduationCapIcon className="h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                      <div className="my-1 border-t border-[#DCE5F0]" />
                      <button
                        onClick={() => {
                          setShowProfileDropdown(false);
                          logout();
                        }}
                        className="flex w-full items-center gap-2.5 px-4 py-2 text-left text-xs font-bold text-[#E5484D] hover:bg-[#E5484D]/10"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Log out</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/find-rides"
                  className={`inline-flex items-center justify-center rounded-xl border border-[#DCE5F0] bg-white font-bold text-[#101D3A] shadow-sm transition-all hover:bg-[#F5FAFF] hover:text-[#1683F8] ${
                    isScrolled ? 'px-3 py-1.5 text-xs' : 'px-3.5 py-2 text-xs'
                  }`}
                >
                  <span>Find a Ride</span>
                </Link>
                <Link
                  to="/offer"
                  className={`inline-flex items-center justify-center rounded-xl border border-[#DCE5F0] bg-white font-bold text-[#101D3A] shadow-sm transition-all hover:bg-[#F5FAFF] hover:text-[#1683F8] ${
                    isScrolled ? 'px-3 py-1.5 text-xs' : 'px-3.5 py-2 text-xs'
                  }`}
                >
                  <span>Offer a Ride</span>
                </Link>
                <Link
                  to="/login"
                  className={`inline-flex items-center justify-center rounded-xl bg-[#1683F8] font-bold text-white shadow-sm transition-all hover:bg-[#168BFF] ${
                    isScrolled ? 'px-3.5 py-1.5 text-xs' : 'px-4 py-2 text-xs'
                  }`}
                >
                  Log in
                </Link>
              </>
            )}
          </div>

          {/* MOBILE TOP BURGER BUTTON */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="grid h-9 w-9 place-items-center rounded-xl border border-[#DCE5F0] bg-white text-[#101D3A] md:hidden"
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

        {/* MOBILE TOP EXPANDED MENU */}
        {isMobileMenuOpen && (
          <div className="border-t border-[#DCE5F0] bg-white px-4 py-4 md:hidden shadow-xl animate-in fade-in slide-in-from-top-2">
            {user && (
              <div className="mb-4 flex items-center gap-3 rounded-xl bg-[#F7FAFE] p-3 border border-[#DCE5F0]">
                <img
                  src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || 'User'}&background=1683F8&color=fff`}
                  alt="Profile"
                  className="h-9 w-9 rounded-lg object-cover"
                />
                <div className="min-w-0">
                  <p className="truncate text-xs font-bold text-[#101D3A]">{user.displayName || 'Rydeon Student'}</p>
                  <p className="text-[10px] text-[#65728A]">{notifications.length} unread updates</p>
                </div>
              </div>
            )}

            <div className="grid gap-1 mb-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#65728A] px-3 py-1">Navigation</p>
              {mainNavItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.Icon;
                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold transition-colors ${
                      isActive ? 'bg-[#EEF7FF] text-[#1683F8]' : 'text-[#101D3A] hover:bg-[#F5FAFF]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#1683F8]' : 'text-[#65728A]'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            <div className="pt-3 border-t border-[#DCE5F0] flex flex-col gap-2">
              {user ? (
                <>
                  <Link
                    to="/create"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="rounded-xl bg-[#1683F8] px-4 py-2.5 text-center text-xs font-bold text-white shadow-sm"
                  >
                    Offer a Ride
                  </Link>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      logout();
                    }}
                    className="rounded-xl px-4 py-2 text-left text-xs font-bold text-[#E5484D] hover:bg-[#E5484D]/10"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="rounded-xl bg-[#1683F8] px-4 py-2.5 text-center text-xs font-bold text-white shadow-sm"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="rounded-xl border border-[#DCE5F0] px-4 py-2.5 text-center text-xs font-bold text-[#101D3A]"
                  >
                    Sign up / Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* MOBILE BOTTOM NAVIGATION BAR (Requirement 5) */}
      {user && (
        <div className="fixed bottom-0 left-0 right-0 z-[990] bg-white border-t border-[#DCE5F0] py-2 px-4 md:hidden shadow-[0_-4px_20px_rgba(16,131,248,0.08)]">
          <div className="flex items-center justify-around max-w-md mx-auto">
            {mobileBottomItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.Icon;
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-xl transition-colors relative ${
                    isActive ? 'text-[#1683F8]' : 'text-[#65728A]'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-[10px] font-bold">{item.label}</span>
                  {isActive && (
                    <span className="absolute -bottom-1 h-1 w-4 rounded-full bg-[#1683F8]" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;

