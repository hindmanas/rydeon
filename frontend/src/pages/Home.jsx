import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../services/firebase';
import { collection, addDoc, doc, getDoc, query, where, onSnapshot } from 'firebase/firestore';
import RideCard from '../components/RideCard';
import CampusNetwork from '../components/CampusNetwork';
import toast from 'react-hot-toast';

const rawBase = import.meta.env.VITE_API_BASE;
const API_BASE = typeof rawBase === 'string' ? rawBase.trim().replace(/^['"]|['"]$/g, '') : rawBase;

function Home({ user }) {
  const navigate = useNavigate();
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  // Search filter state
  const [activeMode, setActiveMode] = useState('find'); // 'find' | 'offer'
  const [fromLocation, setFromLocation] = useState('Pimpri Chinchwad University');
  const [toLocation, setToLocation] = useState('Pune International Airport');
  const [searchDate, setSearchDate] = useState('Thu, 24 Apr • 10:30 AM');
  const [selectedQuickTag, setSelectedQuickTag] = useState('COLLEGE');

  const [offerForm, setOfferForm] = useState({
    from: '',
    to: '',
    date: '',
    time: '',
    seats: 4,
    price: 0,
    allowedGender: 'all'
  });
  const [submitting, setSubmitting] = useState(false);
  const [requestedRideIds, setRequestedRideIds] = useState(new Set());

  useEffect(() => {
    if (!user?.uid) return;
    const q = query(
      collection(db, 'ride_requests'),
      where('requesterId', '==', user.uid),
      where('status', '==', 'pending')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ids = new Set();
      snapshot.docs.forEach(doc => {
        ids.add(doc.data().rideId);
      });
      setRequestedRideIds(ids);
    });
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) setUserProfile(userDoc.data());
      } catch (err) {
        console.error('Error fetching profile', err);
      }
    };
    if (user?.uid) fetchUser();
  }, [user]);

  useEffect(() => {
    const q = query(collection(db, 'rides'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let ridesList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      ridesList.sort((a, b) => {
        const t1 = a.createdAt?.toMillis ? a.createdAt.toMillis() : new Date(a.createdAt || 0).getTime();
        const t2 = b.createdAt?.toMillis ? b.createdAt.toMillis() : new Date(b.createdAt || 0).getTime();
        return t2 - t1;
      });

      setRides(ridesList);
      setLoading(false);
    }, (error) => {
      console.error("Error listening to rides:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleRequestRide = async (ride) => {
    try {
      const response = await fetch(`${API_BASE}/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rideId: ride.id,
          requesterId: user.uid,
          requesterName: user.displayName || user.email.split('@')[0],
          driverId: ride.driverId,
          driverName: ride.driverName,
          pickup: ride.pickup,
          dropoff: ride.dropoff,
          time: ride.time
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      toast.success(data.message || 'Request sent successfully!');
      return true;
    } catch (error) {
      toast.error('Error: ' + error.message);
      return false;
    }
  };

  const handleOfferSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const newRide = {
        pickup: offerForm.from,
        dropoff: offerForm.to,
        time: `${offerForm.date}T${offerForm.time}`,
        seats: Number(offerForm.seats),
        price: Number(offerForm.price),
        driverId: user.uid,
        driverName: user.displayName || user.email.split('@')[0],
        allowedGender: offerForm.allowedGender,
        status: 'open',
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'rides'), newRide);
      toast.success('Successfully added ride!');
      setShowOfferModal(false);
      setOfferForm({ from: '', to: '', date: '', time: '', seats: 4, price: 0, allowedGender: 'all' });
    } catch (error) {
      console.error(error);
      toast.error('Failed to offer ride. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => setOfferForm({ ...offerForm, [e.target.name]: e.target.value });

  // Filter rides based on search query
  const filteredRides = rides.filter(r => {
    if (!fromLocation && !toLocation) return true;
    const matchesFrom = fromLocation ? r.pickup?.toLowerCase().includes(fromLocation.toLowerCase()) || r.pickup?.toLowerCase().includes('pcu') || r.pickup?.toLowerCase().includes('university') : true;
    const matchesTo = toLocation ? r.dropoff?.toLowerCase().includes(toLocation.toLowerCase()) || r.dropoff?.toLowerCase().includes('airport') || r.dropoff?.toLowerCase().includes('pune') : true;
    return matchesFrom || matchesTo;
  });

  const displayRides = filteredRides.length > 0 ? filteredRides : rides;

  if (loading) {
    return <div className="mt-20 text-center text-[#1683F8] font-bold">Loading available rides...</div>;
  }

  return (
    <main className="fade-in space-y-8 pb-16">

      {/* ============================================================ */}
      {/* VISUAL CENTERPIECE: CAMPUS NETWORK & SEARCH PANEL */}
      {/* ============================================================ */}
      <section className="overflow-hidden rounded-3xl border border-[#DCE5F0] bg-white shadow-sm">

        {/* CAMPUS NETWORK MAP CANVAS */}
        <div className="relative h-80 sm:h-[400px] lg:h-[450px] w-full bg-[#F5FAFF] border-b border-[#DCE5F0] overflow-hidden">

          {/* Animated Campus Network Graphic Background */}
          <CampusNetwork mode="background" />

          {/* OVERLAY MAP MARKERS & HUD */}
          <div className="absolute inset-0 p-4 sm:p-6 flex flex-col justify-between pointer-events-none z-10">

            {/* Top Stats Bar */}
            <div className="flex items-center justify-between pointer-events-auto">
              <div className="flex items-center gap-2 rounded-2xl bg-white/95 px-3 sm:px-3.5 py-1.5 sm:py-2 border border-[#DCE5F0] shadow-sm backdrop-blur-md">
                <span className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-[#18B76A] animate-pulse" />
                <span className="text-[11px] sm:text-xs font-bold text-[#101D3A]">Campus Live Match</span>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <div className="hidden sm:flex items-center gap-2 rounded-2xl bg-white/95 px-3.5 py-2 border border-[#DCE5F0] shadow-sm backdrop-blur-md text-xs font-bold text-[#101D3A]">
                  <span>⏱️ 35 mins</span>
                  <span className="text-[#DCE5F0]">|</span>
                  <span>📍 18.4 km</span>
                </div>
                <button
                  onClick={() => setShowOfferModal(true)}
                  className="pointer-events-auto btn-primary py-1.5 sm:py-2 px-3 sm:px-4 text-[11px] sm:text-xs shadow-md"
                >
                  + Offer Ride
                </button>
              </div>
            </div>

            {/* ROUTE PINS OVERLAY */}
            <div className="relative w-full max-w-4xl mx-auto flex items-center justify-between px-2 sm:px-12 my-auto">

              {/* Pickup Marker (PCU Campus) */}


              {/* Vehicle Ride Indicator Pill in Center */}
              <div className="pointer-events-auto hidden sm:flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 border border-[#DCE5F0] shadow-md text-xs font-bold text-[#101D3A] backdrop-blur-md">
                <span className="text-[#1683F8]">🚘</span>
                <span>Active Route</span>
                <span className="rounded-full bg-[#EEF7FF] px-2 py-0.5 text-[10px] text-[#1683F8]">4 Seats Available</span>
              </div>

              {/* Destination Marker (Pune Airport) */}


            </div>

            {/* Bottom Legend */}
            <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-[#65728A] font-semibold">
              <span className="bg-white/95 px-2.5 sm:px-3 py-1 rounded-xl border border-[#DCE5F0] shadow-xs backdrop-blur-md">Rydeon Campus Network Map</span>
              <span className="bg-white/95 px-3 py-1 rounded-xl border border-[#DCE5F0] shadow-xs backdrop-blur-md hidden sm:inline">Tap markers to view route details</span>
            </div>

          </div>
        </div>

        {/* CLEAN WHITE RIDE-SEARCH PANEL (Requirement 6) */}
        <div className="p-6 sm:p-8 bg-white">

          {/* TAB PILLS: [FIND RIDE] [OFFER RIDE] */}
          <div className="mb-6 flex items-center gap-2">
            <button
              onClick={() => setActiveMode('find')}
              className={`rounded-full px-5 py-2.5 text-xs font-extrabold transition-all ${activeMode === 'find'
                ? 'bg-[#1683F8] text-white shadow-md'
                : 'bg-white text-[#101D3A] border border-[#DCE5F0] hover:bg-[#F5FAFF]'
                }`}
            >
              FIND RIDE
            </button>
            <button
              onClick={() => {
                setActiveMode('offer');
                setShowOfferModal(true);
              }}
              className={`rounded-full px-5 py-2.5 text-xs font-extrabold transition-all ${activeMode === 'offer'
                ? 'bg-[#1683F8] text-white shadow-md'
                : 'bg-white text-[#101D3A] border border-[#DCE5F0] hover:bg-[#F5FAFF]'
                }`}
            >
              OFFER RIDE
            </button>
          </div>

          {/* SEARCH INPUTS FORM */}
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4 items-end">
            <div>
              <label className="block text-xs font-extrabold uppercase text-[#65728A] mb-1.5">From</label>
              <div className="relative">
                <input
                  type="text"
                  value={fromLocation}
                  onChange={(e) => setFromLocation(e.target.value)}
                  placeholder="Pimpri Chinchwad University"
                  className="input-field pl-9 text-xs font-bold text-[#101D3A]"
                />
                <span className="absolute left-3 top-3.5 text-xs text-[#1683F8]">📍</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase text-[#65728A] mb-1.5">To</label>
              <div className="relative">
                <input
                  type="text"
                  value={toLocation}
                  onChange={(e) => setToLocation(e.target.value)}
                  placeholder="Pune International Airport"
                  className="input-field pl-9 text-xs font-bold text-[#101D3A]"
                />
                <span className="absolute left-3 top-3.5 text-xs text-[#E5484D]">🎯</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase text-[#65728A] mb-1.5">Date • Time</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                  placeholder="Thu, 24 Apr • 10:30 AM"
                  className="input-field pl-9 text-xs font-bold text-[#101D3A]"
                />
                <span className="absolute left-3 top-3.5 text-xs text-[#1683F8]">📅</span>
              </div>
            </div>

            {/* PRIMARY SEARCH BUTTON */}
            <div>
              <button
                onClick={() => {
                  toast.success('Filtered available campus routes');
                  document.getElementById('ridesList')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full btn-primary py-3.5 text-xs font-extrabold uppercase tracking-wider"
              >
                SEARCH RIDES →
              </button>
            </div>
          </div>

          {/* QUICK LOCATION PILLS BELOW */}
          <div className="mt-5 flex items-center gap-2 pt-4 border-t border-[#DCE5F0]/60 overflow-x-auto">
            <span className="text-[11px] font-bold text-[#65728A] mr-1 uppercase">Quick Destinations:</span>
            {['HOME', 'COLLEGE', 'RECENT'].map(tag => (
              <button
                key={tag}
                onClick={() => {
                  setSelectedQuickTag(tag);
                  if (tag === 'HOME') {
                    setFromLocation('PCU Campus');
                    setToLocation('Akurdi / Chinchwad');
                  } else if (tag === 'COLLEGE') {
                    setFromLocation('Wakad Junction');
                    setToLocation('Pimpri Chinchwad University');
                  } else {
                    setFromLocation('PCU Campus');
                    setToLocation('Pune Airport');
                  }
                }}
                className={`rounded-full px-3.5 py-1 text-xs font-bold transition-all ${selectedQuickTag === tag
                  ? 'bg-[#EEF7FF] text-[#1683F8] border border-[#1683F8]/30'
                  : 'bg-[#F7FAFE] text-[#65728A] border border-[#DCE5F0] hover:bg-[#EEF7FF] hover:text-[#1683F8]'
                  }`}
              >
                {tag}
              </button>
            ))}
          </div>

        </div>

      </section>

      {/* ============================================================ */}
      {/* RIDE LISTINGS SECTION */}
      {/* ============================================================ */}
      <section id="ridesList" className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#DCE5F0] pb-4">
          <div>
            <h2 className="text-2xl font-black text-[#101D3A]">Available Student Rides</h2>
            <p className="mt-1 text-xs font-medium text-[#65728A]">Verified student carpools with upfront pricing and seat confirmation.</p>
          </div>
          <span className="rounded-full bg-white px-3.5 py-1.5 text-xs font-extrabold text-[#1683F8] border border-[#DCE5F0] shadow-sm">
            {displayRides.length} rides found
          </span>
        </div>

        {displayRides.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#DCE5F0] bg-white p-12 text-center shadow-sm">
            <h3 className="text-xl font-black text-[#101D3A]">No rides matching filter</h3>
            <p className="mx-auto mt-2 max-w-md text-xs font-medium text-[#65728A]">Be the first to publish a ride for this route!</p>
            <button onClick={() => setShowOfferModal(true)} className="btn-primary mt-6">
              Publish a Ride
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {displayRides.map(ride => (
              <RideCard
                key={ride.id}
                ride={ride}
                currentUserId={user.uid}
                isRequested={requestedRideIds.has(ride.id)}
                onRequest={handleRequestRide}
              />
            ))}
          </div>
        )}
      </section>

      {/* OFFER RIDE MODAL (Requirement 8) */}
      {showOfferModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center overflow-y-auto bg-[#101D3A]/40 px-4 py-8 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-3xl bg-white border border-[#DCE5F0] p-6 shadow-2xl sm:p-8">
            <div className="mb-6 flex items-start justify-between gap-4 border-b border-[#DCE5F0] pb-5">
              <div>
                <h2 className="text-2xl font-black text-[#101D3A]">Offer a Ride</h2>
                <p className="mt-1 text-xs font-medium text-[#65728A]">Share your route with verified students.</p>
              </div>
              <button onClick={() => setShowOfferModal(false)} className="grid h-10 w-10 place-items-center rounded-xl border border-[#DCE5F0] text-[#65728A] hover:text-[#101D3A]" aria-label="Close">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form onSubmit={handleOfferSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-xs font-extrabold uppercase text-[#101D3A]">
                  Pickup location
                  <input type="text" name="from" required value={offerForm.from} onChange={handleChange} placeholder="PCU Campus" className="input-field mt-1" />
                </label>
                <label className="block text-xs font-extrabold uppercase text-[#101D3A]">
                  Destination
                  <input type="text" name="to" required value={offerForm.to} onChange={handleChange} placeholder="Pune Airport" className="input-field mt-1" />
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-xs font-extrabold uppercase text-[#101D3A]">
                  Date
                  <input type="date" name="date" required value={offerForm.date} onChange={handleChange} className="input-field mt-1" />
                </label>
                <label className="block text-xs font-extrabold uppercase text-[#101D3A]">
                  Time
                  <input type="time" name="time" required value={offerForm.time} onChange={handleChange} className="input-field mt-1" />
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <label className="block text-xs font-extrabold uppercase text-[#101D3A]">
                  Available seats
                  <input type="number" name="seats" min="1" max="10" required value={offerForm.seats} onChange={handleChange} className="input-field mt-1" />
                </label>
                <label className="block text-xs font-extrabold uppercase text-[#101D3A]">
                  Price per seat (₹)
                  <input type="number" name="price" min="0" required value={offerForm.price} onChange={handleChange} className="input-field mt-1" placeholder="50" />
                </label>
                <label className="block text-xs font-extrabold uppercase text-[#101D3A]">
                  Rider Preference
                  <select name="allowedGender" value={offerForm.allowedGender} onChange={handleChange} className="input-field mt-1">
                    <option value="all">All students</option>
                    <option value="female">Female only</option>
                    <option value="male">Male only</option>
                  </select>
                </label>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowOfferModal(false)} className="flex-1 btn-secondary">Cancel</button>
                <button type="submit" disabled={submitting} className="flex-1 btn-primary">
                  {submitting ? 'Publishing...' : 'PUBLISH RIDE'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </main>
  );
}

export default Home;