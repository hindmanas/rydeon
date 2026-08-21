import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logout, db } from '../services/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

function Navbar({ user }) {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'ride_requests'),
      where('driverId', '==', user.uid),
      where('status', '==', 'pending')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      notifs.sort((a, b) => {
        const t1 = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
        const t2 = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
        return t2 - t1;
      });
      setNotifications(notifs);
    });

    return () => unsubscribe();
  }, [user]);

  const handleNotificationClick = () => {
    setShowDropdown(false);
    setIsMobileMenuOpen(false);
    navigate('/dashboard');
  };

  const navClass = (path) =>
    `rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${location.pathname === path ? 'bg-slate-950 text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'}`;

  return (
    <nav className="glass-header sticky top-0 z-50">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3 focus:outline-none">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-slate-950 text-white shadow-sm">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 18l6-12m-7 9l-4-4 4-4m8 8l4-4-4-4" />
            </svg>
          </div>
          <span className="text-lg font-extrabold text-slate-950">Rydeon</span>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          <Link to="/" className={navClass('/')}>Find rides</Link>
          <Link to="/create" className={navClass('/create')}>Offer</Link>
          <Link to="/dashboard" className={navClass('/dashboard')}>Dashboard</Link>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="relative grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:text-slate-950"
              aria-label="Notifications"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 00-4-5.7V5a2 2 0 10-4 0v.3A6 6 0 006 11v3.2c0 .5-.2 1-.6 1.4L4 17h5m6 0v1a3 3 0 11-6 0v-1" />
              </svg>
              {notifications.length > 0 && <span className="absolute -right-1 -top-1 h-5 min-w-5 rounded-full bg-rose-500 px-1 text-xs font-bold leading-5 text-white">{notifications.length}</span>}
            </button>

            {showDropdown && (
              <div className="absolute right-0 top-12 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10">
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                  <h3 className="font-bold text-slate-950">Ride requests</h3>
                  <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-bold text-teal-700">{notifications.length} new</span>
                </div>
                {notifications.length === 0 ? (
                  <div className="px-4 py-6 text-center text-sm text-slate-500">No new notifications</div>
                ) : (
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map(notif => (
                      <button key={notif.id} onClick={handleNotificationClick} className="flex w-full gap-3 border-b border-slate-100 px-4 py-3 text-left transition-colors last:border-0 hover:bg-slate-50">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-100 font-bold text-slate-700">{notif.requesterName?.charAt(0) || 'U'}</span>
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-semibold text-slate-950">{notif.requesterName} wants to join</span>
                          <span className="mt-1 block text-xs font-medium text-teal-700">Review in dashboard</span>
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <Link to="/profile" className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white py-1.5 pl-1.5 pr-3 shadow-sm transition-colors hover:border-slate-300">
            <img
              src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || 'User'}&background=0f766e&color=fff`}
              alt="Profile"
              className="h-8 w-8 rounded-lg object-cover"
            />
            <span className="max-w-28 truncate text-sm font-bold text-slate-700">{user.displayName || 'User'}</span>
          </Link>
          <button onClick={logout} className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-500 transition-colors hover:bg-rose-50 hover:text-rose-600">Logout</button>
        </div>

        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 md:hidden" aria-label="Menu">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isMobileMenuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
          <div className="mb-4 flex items-center gap-3 rounded-xl bg-slate-50 p-3">
            <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || 'User'}&background=0f766e&color=fff`} alt="Profile" className="h-10 w-10 rounded-lg object-cover" />
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-slate-950">{user.displayName || 'Rydeon User'}</p>
              <p className="text-xs text-slate-500">{notifications.length} pending requests</p>
            </div>
          </div>
          <div className="grid gap-2">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className={navClass('/')}>Find rides</Link>
            <Link to="/create" onClick={() => setIsMobileMenuOpen(false)} className={navClass('/create')}>Offer</Link>
            <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className={navClass('/dashboard')}>Dashboard</Link>
            <button onClick={logout} className="rounded-lg px-3 py-2 text-left text-sm font-semibold text-rose-600 hover:bg-rose-50">Logout</button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;