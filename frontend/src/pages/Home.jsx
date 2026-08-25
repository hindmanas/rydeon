import { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { collection, addDoc, doc, getDoc, query, where, onSnapshot } from 'firebase/firestore';
import RideCard from '../components/RideCard';
import toast from 'react-hot-toast';

const rawBase = import.meta.env.VITE_API_BASE;
const API_BASE = typeof rawBase === 'string' ? rawBase.trim().replace(/^['"]|['"]$/g, '') : rawBase;

function Home({ user }) {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
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

      // Sort by createdAt desc in memory
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

  if (loading) return <div className="mt-20 text-center text-slate-500">Loading rides...</div>;

  const nextRide = rides[0];

  return (
    <main className="fade-in space-y-8">
      <section className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase text-teal-700">Campus mobility</p>
              <h1 className="mt-2 max-w-2xl text-3xl font-extrabold leading-tight text-slate-950 sm:text-5xl">Find a reliable seat before your next run.</h1>
            </div>
            <button onClick={() => setShowOfferModal(true)} className="btn-primary shrink-0">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14m7-7H5" /></svg>
              Offer ride
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-bold text-slate-500">Open listings</p>
              <p className="mt-2 text-3xl font-extrabold text-slate-950">{rides.length}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-bold text-slate-500">Profile</p>
              <p className="mt-2 truncate text-xl font-extrabold text-slate-950">{userProfile?.name || user.displayName || 'Ready'}</p>
            </div>
            <div className="rounded-2xl bg-teal-50 p-4">
              <p className="text-sm font-bold text-teal-700">Seat matching</p>
              <p className="mt-2 text-xl font-extrabold text-teal-900">Live</p>
            </div>
          </div>
        </div>

        <aside className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white shadow-sm sm:p-8">
          <p className="text-sm font-bold uppercase text-teal-300">Quick actions</p>
          <div className="mt-6 grid gap-3">
            <button onClick={() => document.getElementById('ridesList')?.scrollIntoView({ behavior: 'smooth' })} className="flex items-center justify-between rounded-2xl bg-white/10 p-4 text-left transition-colors hover:bg-white/15">
              <span>
                <span className="block font-extrabold">Browse rides</span>
                <span className="mt-1 block text-sm text-slate-300">Compare timings and seats.</span>
              </span>
              <span className="text-xl">+</span>
            </button>
            <button onClick={() => setShowOfferModal(true)} className="flex items-center justify-between rounded-2xl bg-teal-500 p-4 text-left text-slate-950 transition-colors hover:bg-teal-400">
              <span>
                <span className="block font-extrabold">Post a route</span>
                <span className="mt-1 block text-sm font-semibold text-teal-950/70">Share empty seats.</span>
              </span>
              <span className="text-xl">+</span>
            </button>
          </div>
          {nextRide && <p className="mt-6 text-sm text-slate-300">Next available: <span className="font-bold text-white">{nextRide.pickup}</span> to <span className="font-bold text-white">{nextRide.dropoff}</span></p>}
        </aside>
      </section>

      <section id="ridesList">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-950">Recent ride listings</h2>
            <p className="mt-1 text-sm font-medium text-slate-500">Clean, scannable cards for booking without the heavy neon look.</p>
          </div>
          <span className="rounded-full bg-white px-3 py-1.5 text-sm font-bold text-slate-600 shadow-sm">{rides.length} available</span>
        </div>

        {rides.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
            <h3 className="text-xl font-extrabold text-slate-950">No rides available</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">Offer the first ride and it will appear here as a polished listing card.</p>
            <button onClick={() => setShowOfferModal(true)} className="btn-primary mt-6">Offer a ride</button>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {rides.map(ride => (
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

      {showOfferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 px-4 py-8 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="mb-6 flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-950">Offer a ride</h2>
                <p className="mt-1 text-sm text-slate-500">Add the route, timing, and available seats.</p>
              </div>
              <button onClick={() => setShowOfferModal(false)} className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-500 hover:text-slate-950" aria-label="Close">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form onSubmit={handleOfferSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-bold text-slate-700">From<input type="text" name="from" required value={offerForm.from} onChange={handleChange} placeholder="C block" className="input-field mt-1" /></label>
                <label className="block text-sm font-bold text-slate-700">To<input type="text" name="to" required value={offerForm.to} onChange={handleChange} placeholder="Pune junction" className="input-field mt-1" /></label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-bold text-slate-700">Date<input type="date" name="date" required value={offerForm.date} onChange={handleChange} className="input-field mt-1" /></label>
                <label className="block text-sm font-bold text-slate-700">Time<input type="time" name="time" required value={offerForm.time} onChange={handleChange} className="input-field mt-1" /></label>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <label className="block text-sm font-bold text-slate-700">Seats<input type="number" name="seats" min="1" max="10" required value={offerForm.seats} onChange={handleChange} className="input-field mt-1" /></label>
                <label className="block text-sm font-bold text-slate-700">Price<input type="number" name="price" min="0" required value={offerForm.price} onChange={handleChange} className="input-field mt-1" placeholder="40" /></label>
                <label className="block text-sm font-bold text-slate-700">Riders<select name="allowedGender" value={offerForm.allowedGender} onChange={handleChange} className="input-field mt-1"><option value="all">All</option><option value="female">Female only</option><option value="male">Male only</option></select></label>
              </div>
              <div className="flex gap-3 pt-3">
                <button type="button" onClick={() => setShowOfferModal(false)} className="flex-1 btn-secondary">Cancel</button>
                <button type="submit" disabled={submitting} className="flex-1 btn-primary">{submitting ? 'Posting...' : 'Post ride'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

export default Home;