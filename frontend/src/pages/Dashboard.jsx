import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import RideCard from '../components/RideCard';
import { db } from '../services/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

const rawBase = import.meta.env.VITE_API_BASE;
const API_BASE = typeof rawBase === 'string' ? rawBase.trim().replace(/^['"]|['"]$/g, '') : rawBase;

function Dashboard({ user }) {
  const [createdRides, setCreatedRides] = useState([]);
  const [joinedRides, setJoinedRides] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;

    // Listener for created rides (driverId == user.uid)
    const qCreated = query(
      collection(db, 'rides'),
      where('driverId', '==', user.uid)
    );

    const unsubscribeCreated = onSnapshot(qCreated, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      list.sort((a, b) => {
        const t1 = a.createdAt?.toMillis ? a.createdAt.toMillis() : new Date(a.createdAt || 0).getTime();
        const t2 = b.createdAt?.toMillis ? b.createdAt.toMillis() : new Date(b.createdAt || 0).getTime();
        return t2 - t1;
      });
      setCreatedRides(list);
      setLoading(false);
    }, (err) => {
      console.error(err);
      setLoading(false);
    });

    // Listener for joined rides (riderIds contains user.uid)
    const qJoined = query(
      collection(db, 'rides'),
      where('riderIds', 'array-contains', user.uid)
    );

    const unsubscribeJoined = onSnapshot(qJoined, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      list.sort((a, b) => {
        const t1 = a.createdAt?.toMillis ? a.createdAt.toMillis() : new Date(a.createdAt || 0).getTime();
        const t2 = b.createdAt?.toMillis ? b.createdAt.toMillis() : new Date(b.createdAt || 0).getTime();
        return t2 - t1;
      });
      setJoinedRides(list);
      setLoading(false);
    }, (err) => {
      console.error(err);
      setLoading(false);
    });

    return () => {
      unsubscribeCreated();
      unsubscribeJoined();
    };
  }, [user.uid]);

  useEffect(() => {
    if (!user?.uid) return;
    const q = query(collection(db, 'ride_requests'), where('driverId', '==', user.uid), where('status', '==', 'pending'));
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
      const response = await fetch(`${API_BASE}/requests/${requestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, driverId: user.uid })
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to update request');
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleCancelRide = async (rideId) => {
    if (!window.confirm('Are you sure you want to cancel this ride?')) return;

    try {
      const response = await fetch(`${API_BASE}/rides/${rideId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.uid })
      });
      if (!response.ok) throw new Error('Failed to cancel ride');
    } catch (error) {
      alert(error.message);
    }
  };

  const handleFinishRide = async (ride, options) => {
    try {
      const response = await fetch(`${API_BASE}/rides/finish-ride`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rideId: ride.id, userId: user.uid, satisfied: options.satisfied })
      });
      if (!response.ok) throw new Error('Failed to finish ride');
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) return <div className="mt-20 text-center text-slate-500">Loading your dashboard...</div>;

  const activeCreated = createdRides.filter(ride => !ride.completedBy?.includes(user.uid));
  const activeJoined = joinedRides.filter(ride => !ride.completedBy?.includes(user.uid));

  return (
    <main className="fade-in space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <p className="text-sm font-bold uppercase text-teal-700">Driver console</p>
            <h1 className="mt-2 text-3xl font-extrabold text-slate-950 sm:text-4xl">Manage rides and requests</h1>
            <p className="mt-2 max-w-2xl text-sm font-medium text-slate-500">A cleaner reference dashboard with strong hierarchy, useful counts, and fewer decorative effects.</p>
          </div>
          <div className="flex gap-3">
            <Link to="/" className="btn-secondary">Find rides</Link>
            <Link to="/create" className="btn-primary">Offer ride</Link>
          </div>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm font-bold text-slate-500">Pending requests</p>
            <p className="mt-2 text-3xl font-extrabold text-slate-950">{pendingRequests.length}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm font-bold text-slate-500">Offered rides</p>
            <p className="mt-2 text-3xl font-extrabold text-slate-950">{activeCreated.length}</p>
          </div>
          <div className="rounded-2xl bg-teal-50 p-4">
            <p className="text-sm font-bold text-teal-700">Joined rides</p>
            <p className="mt-2 text-3xl font-extrabold text-teal-900">{activeJoined.length}</p>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-950">Pending requests</h2>
            <p className="mt-1 text-sm font-medium text-slate-500">Students asking to join your rides.</p>
          </div>
        </div>
        {pendingRequests.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm font-semibold text-slate-500">No pending requests at the moment.</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {pendingRequests.map(req => {
              const ride = createdRides.find(r => r.id === req.rideId);
              return (
                <div key={req.id} className="card">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="grid h-11 w-11 place-items-center rounded-xl bg-teal-50 font-extrabold text-teal-700">{req.requesterName.charAt(0)}</div>
                    <div className="min-w-0">
                      <h3 className="truncate font-extrabold text-slate-950">{req.requesterName}</h3>
                      <p className="text-sm font-medium text-slate-500">wants to join</p>
                    </div>
                  </div>
                  {ride && (
                    <div className="mb-4 rounded-2xl bg-slate-50 p-4 text-sm">
                      <p className="truncate font-extrabold text-slate-950">{ride.pickup} to {ride.dropoff}</p>
                      <p className="mt-1 font-semibold text-teal-700">{new Date(ride.time).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</p>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <button onClick={() => handleUpdateRequest(req.id, 'accepted')} className="flex-1 rounded-xl bg-teal-700 py-3 text-sm font-bold text-white hover:bg-teal-800">Confirm</button>
                    <button onClick={() => handleUpdateRequest(req.id, 'rejected')} className="flex-1 rounded-xl border border-slate-200 bg-white py-3 text-sm font-bold text-slate-700 hover:bg-slate-50">Reject</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section>
        <div className="mb-4 border-b border-slate-200 pb-4">
          <h2 className="text-2xl font-extrabold text-slate-950">My offered rides</h2>
          <p className="mt-1 text-sm font-medium text-slate-500">Rides you are currently driving.</p>
        </div>
        {activeCreated.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm font-semibold text-slate-500">You have not offered any rides yet.</div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {activeCreated.map(ride => <RideCard key={ride.id} ride={ride} currentUserId={user.uid} onCancel={handleCancelRide} onFinish={handleFinishRide} />)}
          </div>
        )}
      </section>

      <section>
        <div className="mb-4 border-b border-slate-200 pb-4">
          <h2 className="text-2xl font-extrabold text-slate-950">My joined rides</h2>
          <p className="mt-1 text-sm font-medium text-slate-500">Upcoming trips you have booked.</p>
        </div>
        {activeJoined.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm font-semibold text-slate-500">You have not joined any rides yet.</div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {activeJoined.map(ride => <RideCard key={ride.id} ride={ride} currentUserId={user.uid} onFinish={handleFinishRide} />)}
          </div>
        )}
      </section>
    </main>
  );
}

export default Dashboard;