import { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
import RideCard from '../components/RideCard';
import toast from 'react-hot-toast';

const API_BASE = 'https://rydeon-backend.onrender.com/api/rides';

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

  useEffect(() => {
    // Fetch user profile for local state
    const fetchUser = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserProfile(userDoc.data());
        }
      } catch (err) {
        console.error("Error fetching profile", err);
      }
    };
    if (user?.uid) fetchUser();

    // Fetch rides via backend (which handles secure gender filtering)
    const fetchRides = async () => {
      try {
        const url = user?.uid ? `${API_BASE}?uid=${user.uid}` : API_BASE;
        const response = await fetch(url);
        const data = await response.json();
        if (response.ok) {
          setRides(data);
        }
      } catch (err) {
        console.error("Failed to fetch rides via API", err);
      } finally {
        setLoading(false);
      }
    };
    
    // Polling or fetch once
    fetchRides();

  }, [user]);

  const handleRequestRide = async (ride) => {
    try {
      const response = await fetch(`https://rydeon-backend.onrender.com/api/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rideId: ride.id,
          requesterId: user.uid,
          requesterName: user.displayName || user.email.split('@')[0],
          driverId: ride.driverId,
          driverName: ride.driverName
        })
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      
      toast.success(data.message || "Request sent successfully!");
      return true; // Indicate success to the child component
    } catch (error) {
      toast.error("Error: " + error.message);
      return false; // Indicate failure
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
      toast.success("Successfully added ride!");
      setShowOfferModal(false);
      setOfferForm({ from: '', to: '', date: '', time: '', seats: 4, price: 0, allowedGender: 'all' });
    } catch (error) {
      console.error(error);
      toast.error("Failed to offer ride. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setOfferForm({ ...offerForm, [e.target.name]: e.target.value });
  };

  if (loading) return <div className="text-center mt-20 text-slate-400">Loading dashboard...</div>;

  return (
    <div className="fade-in animate-in slide-in-from-bottom-4 duration-500">
      
      {/* 1. Dashboard Action Cards */}
      <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Find a Ride Option */}
        <div 
          onClick={() => {
             document.getElementById('ridesList').scrollIntoView({ behavior: 'smooth' });
             toast.success("Scroll down to find a ride!");
          }}
          className="card cursor-pointer group flex items-center p-8 gap-6 border-transparent hover:border-brand-500/50 bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-brand-500/20"></div>
          <div className="w-16 h-16 rounded-2xl bg-brand-500/20 flex items-center justify-center border border-brand-500/30 flex-shrink-0">
            <svg className="w-8 h-8 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Find a Ride</h2>
            <p className="text-slate-400 text-sm">Browse available trips and join fellow students heading your way.</p>
          </div>
        </div>

        {/* Offer a Ride Option */}
        <div 
          onClick={() => setShowOfferModal(true)}
          className="card cursor-pointer group flex items-center p-8 gap-6 border-transparent hover:border-indigo-500/50 bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden relative"
        >
          <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -ml-10 -mt-10 transition-all group-hover:bg-indigo-500/20"></div>
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 flex-shrink-0">
            <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Offer a Ride</h2>
            <p className="text-slate-400 text-sm">Driving somewhere? Share your empty seats and split the travel costs.</p>
          </div>
        </div>
      </div>

      {/* 2. Rides List */}
      <div id="ridesList" className="mb-8">
        <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-4 mb-6">Recent Ride Listings</h2>
      </div>

      {rides.length === 0 ? (
        <div className="text-center py-20 bg-slate-800/30 rounded-3xl border border-slate-700/50 backdrop-blur-sm">
          <div className="w-16 h-16 bg-brand-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-brand-500/20 shadow-[0_0_15px_rgba(20,184,166,0.2)]">
             <svg className="w-8 h-8 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
             </svg>
          </div>
          <h3 className="text-lg font-medium text-white">No rides available</h3>
          <p className="text-slate-400 mt-1">Be the first to offer a ride today!</p>
        </div>
      ) : (
        <div className="flex flex-col max-w-2xl mx-auto gap-5 pb-12">
          {rides.map(ride => (
              <RideCard 
                key={ride.id} 
                ride={ride} 
                currentUserId={user.uid}
                onRequest={handleRequestRide}
              />
          ))}
        </div>
      )}

      {/* 3. Offer a Ride Modal Content */}
      {showOfferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 overflow-y-auto bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg card relative shadow-2xl animate-in zoom-in-95 duration-200 my-8">
            <button 
              onClick={() => setShowOfferModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h2 className="text-2xl font-bold text-white mb-2">Offer a Ride</h2>
            <p className="text-slate-400 text-sm mb-6 pb-4 border-b border-slate-700">Fill out the details to share your journey.</p>
            
            <form onSubmit={handleOfferSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">From (Start)</label>
                  <input type="text" name="from" required value={offerForm.from} onChange={handleChange} placeholder="Hostel Block A" className="input-field py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">To (Destination)</label>
                  <input type="text" name="to" required value={offerForm.to} onChange={handleChange} placeholder="City Center" className="input-field py-2" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Date</label>
                  <input type="date" name="date" required value={offerForm.date} onChange={handleChange} className="input-field py-2 dark:[color-scheme:dark]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Time</label>
                  <input type="time" name="time" required value={offerForm.time} onChange={handleChange} className="input-field py-2 dark:[color-scheme:dark]" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Seats Available</label>
                  <input type="number" name="seats" min="1" max="10" required value={offerForm.seats} onChange={handleChange} className="input-field py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Price (₹)</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 font-medium">₹</span>
                    <input type="number" name="price" min="0" required value={offerForm.price} onChange={handleChange} className="input-field py-2 pl-8" placeholder="150" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Allowed Gender</label>
                <select 
                  name="allowedGender" 
                  value={offerForm.allowedGender} 
                  onChange={handleChange} 
                  className="input-field py-2 text-slate-300"
                >
                  <option value="all">All Genders</option>
                  <option value="female">Only Females</option>
                  <option value="male">Only Males</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowOfferModal(false)} className="flex-1 btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="flex-1 btn-primary">
                  {submitting ? 'Posting...' : 'Post Ride'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
