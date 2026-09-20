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
  const [activeTab, setActiveTab] = useState('OFFERED'); // 'OFFERED' | 'REQUESTED' | 'LOOKING'

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

  if (loading) return <div className="mt-20 text-center text-[#1683F8] font-bold">Loading your mobility dashboard...</div>;

  const activeCreated = createdRides.filter(ride => !ride.completedBy?.includes(user.uid));
  const activeJoined = joinedRides.filter(ride => !ride.completedBy?.includes(user.uid));
  const userName = user.displayName || user.email?.split('@')[0] || 'Student';

  return (
    <main className="fade-in space-y-8 pb-16">
      
      {/* MOBILITY CONTROL CENTER HEADER (Requirement 11) */}
      <section className="rounded-3xl border border-[#DCE5F0] bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#1683F8]">Mobility Control Center</p>
            <h1 className="mt-2 text-3xl font-black text-[#101D3A] sm:text-4xl">Good morning, {userName} 👋</h1>
            <p className="mt-1 text-xs font-medium text-[#65728A]">Find your next ride or manage your routes.</p>
          </div>
          <div className="flex gap-3">
            <Link to="/" className="btn-secondary">Find a Ride</Link>
            <Link to="/create" className="btn-primary">Offer a Ride</Link>
          </div>
        </div>

        {/* SMALL CLEAN STAT CARDS */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#DCE5F0] bg-[#F7FAFE] p-4">
            <p className="text-xs font-bold uppercase text-[#65728A]">Pending Requests</p>
            <p className="mt-1.5 text-3xl font-black text-[#1683F8]">{pendingRequests.length}</p>
          </div>
          <div className="rounded-2xl border border-[#DCE5F0] bg-[#F7FAFE] p-4">
            <p className="text-xs font-bold uppercase text-[#65728A]">Rides Offered</p>
            <p className="mt-1.5 text-3xl font-black text-[#101D3A]">{activeCreated.length}</p>
          </div>
          <div className="rounded-2xl border border-[#DCE5F0] bg-[#EEF7FF] p-4">
            <p className="text-xs font-bold uppercase text-[#1683F8]">Upcoming Joined</p>
            <p className="mt-1.5 text-3xl font-black text-[#1683F8]">{activeJoined.length}</p>
          </div>
        </div>
      </section>

      {/* RIDE REQUESTS SECTION */}
      {pendingRequests.length > 0 && (
        <section className="rounded-3xl border border-[#DCE5F0] bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between border-b border-[#DCE5F0] pb-4">
            <div>
              <h2 className="text-xl font-black text-[#101D3A]">Pending Ride Requests</h2>
              <p className="mt-0.5 text-xs text-[#65728A]">Students waiting for your confirmation.</p>
            </div>
            <span className="rounded-full bg-[#F2A900]/10 border border-[#F2A900]/20 px-3 py-1 text-xs font-extrabold text-[#F2A900] uppercase tracking-wider">
              {pendingRequests.length} Pending
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {pendingRequests.map(req => {
              const ride = createdRides.find(r => r.id === req.rideId);
              return (
                <div key={req.id} className="rounded-2xl border border-[#DCE5F0] bg-[#F7FAFE] p-4 shadow-sm">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#EEF7FF] font-black text-[#1683F8] text-sm">
                      {req.requesterName.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-extrabold text-[#101D3A]">{req.requesterName}</h3>
                      <p className="text-[11px] font-semibold text-[#65728A]">Student Request</p>
                    </div>
                  </div>

                  {ride && (
                    <div className="mb-4 rounded-xl border border-[#DCE5F0] bg-white p-3 text-xs">
                      <p className="truncate font-bold text-[#101D3A]">{ride.pickup} → {ride.dropoff}</p>
                      <p className="mt-1 font-semibold text-[#1683F8]">{new Date(ride.time).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdateRequest(req.id, 'accepted')}
                      className="flex-1 rounded-xl bg-[#1683F8] py-2.5 text-xs font-bold text-white hover:bg-[#168BFF] transition-colors shadow-sm"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleUpdateRequest(req.id, 'rejected')}
                      className="flex-1 rounded-xl border border-[#E5484D]/30 bg-[#E5484D]/10 py-2.5 text-xs font-bold text-[#E5484D] hover:bg-[#E5484D]/20 transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* CLEAN TAB STRUCTURE: OFFERED | REQUESTED | LOOKING (Requirement 9) */}
      <section className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#DCE5F0] pb-4">
          <div>
            <h2 className="text-2xl font-black text-[#101D3A]">My Rides</h2>
            <p className="mt-1 text-xs text-[#65728A]">Manage your created, joined, and requested trips.</p>
          </div>

          {/* TAB PILLS */}
          <div className="flex items-center gap-1.5 rounded-2xl bg-[#EEF7FF] p-1.5 border border-[#DCE5F0]">
            {['OFFERED', 'REQUESTED', 'LOOKING'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-xl px-4 py-2 text-xs font-extrabold transition-all ${
                  activeTab === tab
                    ? 'bg-[#1683F8] text-white shadow-sm'
                    : 'text-[#101D3A] hover:bg-white/60'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* TAB CONTENTS */}
        {activeTab === 'OFFERED' && (
          <div>
            {activeCreated.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-[#DCE5F0] bg-white p-12 text-center shadow-sm">
                <h3 className="text-lg font-bold text-[#101D3A]">No rides offered yet</h3>
                <p className="mt-1 text-xs text-[#65728A]">Publish your route to help fellow campus students commute.</p>
                <Link to="/create" className="btn-primary mt-5">Offer a Ride</Link>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {activeCreated.map(ride => (
                  <RideCard key={ride.id} ride={ride} currentUserId={user.uid} onCancel={handleCancelRide} onFinish={handleFinishRide} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'REQUESTED' && (
          <div>
            {activeJoined.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-[#DCE5F0] bg-white p-12 text-center shadow-sm">
                <h3 className="text-lg font-bold text-[#101D3A]">No joined rides</h3>
                <p className="mt-1 text-xs text-[#65728A]">Browse open listings to request a seat.</p>
                <Link to="/" className="btn-primary mt-5">Find Rides</Link>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {activeJoined.map(ride => (
                  <RideCard key={ride.id} ride={ride} currentUserId={user.uid} onFinish={handleFinishRide} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'LOOKING' && (
          <div>
            <div className="rounded-3xl border border-[#DCE5F0] bg-white p-8 text-center shadow-sm">
              <h3 className="text-lg font-bold text-[#101D3A]">Searching for Seats</h3>
              <p className="mt-1 text-xs text-[#65728A]">Check available live rides travelling between PCU and city hubs.</p>
              <Link to="/" className="btn-primary mt-5">Explore All Rides →</Link>
            </div>
          </div>
        )}
      </section>

    </main>
  );
}

export default Dashboard;