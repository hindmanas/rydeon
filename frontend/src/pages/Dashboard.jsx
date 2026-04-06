import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import RideCard from '../components/RideCard';
import { db } from '../services/firebase';
import { collection, query, where, onSnapshot, doc, updateDoc, arrayUnion, addDoc } from 'firebase/firestore';

const API_BASE = 'https://rydeon-backend-xdbl.onrender.com/api/rides';

function Dashboard({ user }) {
  const [createdRides, setCreatedRides] = useState([]);
  const [joinedRides, setJoinedRides] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      // Fetch rides
      const response = await fetch(`${API_BASE}/user-rides/${user.uid}`);
      if (!response.ok) throw new Error('Failed to fetch rides');
      const data = await response.json();
      setCreatedRides(data.createdRides);
      setJoinedRides(data.joinedRides);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user.uid]);

  // Real-time listener for pending requests
  useEffect(() => {
    if (!user?.uid) return;
    const q = query(
      collection(db, 'ride_requests'), 
      where('driverId', '==', user.uid),
      where('status', '==', 'pending')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const requests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      requests.sort((a, b) => {
         const t1 = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
         const t2 = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
         return t2 - t1;
      });
      setPendingRequests(requests);
    });
    return () => unsubscribe();
  }, [user.uid]);

  const handleUpdateRequest = async (requestId, status) => {
    try {
      const response = await fetch(`https://rydeon-backend.onrender.com/api/requests/${requestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, driverId: user.uid })
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to update request');
      }
      fetchData(); // refresh
    } catch (error) {
      alert(error.message);
    }
  };

  const handleCancelRide = async (rideId) => {
    if (!window.confirm("Are you sure you want to cancel this ride?")) return;
    
    try {
      const response = await fetch(`${API_BASE}/${rideId}`, {
         method: 'DELETE',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ userId: user.uid })
      });
      if (!response.ok) throw new Error('Failed to cancel ride');
      
      fetchData();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleFinishRide = async (ride, options) => {
    try {
      const response = await fetch(`${API_BASE}/finish-ride`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          rideId: ride.id, 
          userId: user.uid,
          satisfied: options.satisfied
        })
      });
      if (!response.ok) throw new Error('Failed to finish ride');
      fetchData();
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) return <div className="text-center mt-20 text-slate-400">Loading your dashboard...</div>;

  return (
    <div className="fade-in space-y-16">
      
      {/* Primary Actions Hero */}
      <div className="grid md:grid-cols-2 gap-8 mt-6">
        <Link to="/" className="card group flex flex-col items-center justify-center p-12 text-center hover:bg-brand-500/10 cursor-pointer">
          <div className="w-20 h-20 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
             <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
             </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-white mb-2 group-hover:text-brand-400 transition-colors">Find a Ride</h2>
          <p className="text-slate-400 max-w-xs">Search available rides and join your peers heading to campus.</p>
        </Link>

        <Link to="/create" className="card group flex flex-col items-center justify-center p-12 text-center hover:bg-indigo-500/10 cursor-pointer">
          <div className="w-20 h-20 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
             <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
             </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-white mb-2 group-hover:text-indigo-400 transition-colors">Offer a Ride</h2>
          <p className="text-slate-400 max-w-xs">Driving somewhere? Share seats, split costs, and meet new friends.</p>
        </Link>
      </div>

      <div className="border-t border-slate-800 pt-16 space-y-12">
        {/* Pending Requests Section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Pending Requests</h2>
          <p className="text-slate-400 mb-6">Students asking to join your rides.</p>
          
          {pendingRequests.length === 0 ? (
             <p className="text-slate-500 bg-slate-800/30 p-6 rounded-2xl border border-slate-700/50 italic text-center">No pending requests at the moment.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingRequests.map(req => {
                 const ride = createdRides.find(r => r.id === req.rideId);
                 return (
                  <div key={req.id} className="card bg-slate-800/20 backdrop-blur-xl border-brand-500/30">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold">
                          {req.requesterName.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{req.requesterName}</h3>
                          <p className="text-xs text-slate-400">wants to join</p>
                        </div>
                      </div>
                    </div>
                    {ride && (
                      <div className="mb-4 text-sm text-slate-300 bg-slate-900/50 p-3 rounded-lg">
                         <span className="block truncate font-medium">{ride.pickup} → {ride.dropoff}</span>
                         <span className="text-emerald-400 font-medium text-xs mt-1 block">
                           {new Date(ride.time).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                         </span>
                      </div>
                    )}
                    <div className="flex gap-2 mt-4">
                      <button 
                        onClick={() => handleUpdateRequest(req.id, 'accepted')}
                        className="flex-1 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 font-semibold transition-colors"
                      >
                        Confirm
                      </button>
                      <button 
                        onClick={() => handleUpdateRequest(req.id, 'rejected')}
                        className="flex-1 py-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 font-semibold transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                 );
              })}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-2">My Offered Rides</h2>
          <p className="text-slate-400 mb-6">Rides you are currently driving.</p>
          
          {createdRides.length === 0 ? (
             <p className="text-slate-500 bg-slate-800/30 p-6 rounded-2xl border border-slate-700/50 italic text-center">You haven't offered any rides yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {createdRides.filter(ride => !ride.completedBy?.includes(user.uid)).map(ride => (
                <RideCard 
                  key={ride.id} 
                  ride={ride} 
                  currentUserId={user.uid}
                  onCancel={handleCancelRide}
                  onFinish={handleFinishRide}
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-2">My Joined Rides</h2>
          <p className="text-slate-400 mb-6">Upcoming trips you've booked.</p>
          
          {joinedRides.length === 0 ? (
             <p className="text-slate-500 bg-slate-800/30 p-6 rounded-2xl border border-slate-700/50 italic text-center">You haven't joined any rides yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {joinedRides.filter(ride => !ride.completedBy?.includes(user.uid)).map(ride => (
                <RideCard 
                  key={ride.id} 
                  ride={ride} 
                  currentUserId={user.uid}
                  onFinish={handleFinishRide}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
