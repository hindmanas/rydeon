import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../services/firebase';
import { collection, addDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

const rawBase = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';
const cleanBase = typeof rawBase === 'string' ? rawBase.trim().replace(/^['"]|['"]$/g, '').replace(/\/+$/, '') : rawBase;
const RIDE_API_URL = cleanBase.endsWith('/rides') ? `${cleanBase}/create-ride` : `${cleanBase}/rides/create-ride`;

function CreateRide({ user }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    pickup: '',
    dropoff: '',
    time: '',
    seats: 3,
    price: 50,
    allowedGender: 'all'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const ridePayload = {
      pickup: formData.pickup,
      dropoff: formData.dropoff,
      time: formData.time,
      seats: Number(formData.seats),
      price: Number(formData.price),
      allowedGender: formData.allowedGender || 'all',
      driverId: user.uid,
      driverName: user.displayName || user.email?.split('@')[0] || 'Driver',
      status: 'open',
      riders: [],
      createdAt: new Date().toISOString()
    };

    let created = false;

    try {
      const response = await fetch(RIDE_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ridePayload)
      });

      if (response.ok) {
        created = true;
      } else {
        let errText = 'Failed to create ride';
        try {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            errText = data.error || errText;
          }
        } catch (jsonErr) {
          console.warn('Could not parse backend error JSON:', jsonErr);
        }
        console.warn(`Backend POST ${RIDE_API_URL} returned ${response.status}: ${errText}. Using Firestore client fallback.`);
      }
    } catch (apiErr) {
      console.warn('Backend API fetch error:', apiErr);
    }

    if (!created) {
      try {
        await addDoc(collection(db, 'rides'), ridePayload);
        created = true;
      } catch (firestoreError) {
        console.error('Firestore creation error:', firestoreError);
        toast.error('Failed to create ride: ' + firestoreError.message);
        setLoading(false);
        return;
      }
    }

    if (created) {
      toast.success('Ride published successfully!');
      navigate('/');
    }
    setLoading(false);
  };

  return (
    <main className="fade-in mx-auto grid max-w-5xl gap-6 lg:grid-cols-[0.85fr_1.15fr] pb-16">
      
      {/* LEFT SIDE GUIDE PANEL */}
      <aside className="rounded-3xl border border-[#DCE5F0] bg-white p-6 shadow-sm sm:p-8 flex flex-col justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#1683F8]">Offer a Ride</p>
          <h1 className="mt-2 text-3xl font-black text-[#101D3A] leading-tight sm:text-4xl">Share your route with verified students.</h1>
          <p className="mt-2 text-xs text-[#65728A] font-medium">Split travel costs, reduce campus traffic, and meet fellow classmates.</p>
          
          <div className="mt-8 space-y-3">
            <div className="rounded-2xl border border-[#DCE5F0] bg-[#F7FAFE] p-4">
              <p className="font-extrabold text-xs text-[#101D3A] uppercase tracking-wider">📍 Pickup & Destination</p>
              <p className="mt-1 text-xs text-[#65728A]">Use recognizable campus landmarks, hostel gates, or metro stations.</p>
            </div>
            <div className="rounded-2xl border border-[#DCE5F0] bg-[#F7FAFE] p-4">
              <p className="font-extrabold text-xs text-[#101D3A] uppercase tracking-wider">💰 Fair Pricing</p>
              <p className="mt-1 text-xs text-[#65728A]">Set a fair price per seat before students submit requests.</p>
            </div>
            <div className="rounded-2xl border border-[#1683F8]/30 bg-[#EEF7FF] p-4 text-[#101D3A]">
              <p className="font-extrabold text-xs text-[#1683F8] uppercase tracking-wider">⚡ Instant Matching</p>
              <p className="mt-1 text-xs font-semibold text-[#101D3A]">Requests will appear in your Mobility Dashboard where you choose who joins.</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-[#DCE5F0] text-[11px] text-[#65728A] font-medium">
          🔒 Only verified campus students can view and request your ride.
        </div>
      </aside>

      {/* RIGHT SIDE FORM CONTAINER */}
      <section className="rounded-3xl border border-[#DCE5F0] bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 border-b border-[#DCE5F0] pb-5">
          <h2 className="text-2xl font-black text-[#101D3A]">Route Details</h2>
          <p className="mt-1 text-xs font-medium text-[#65728A]">Fill out your ride details to publish your route.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-xs font-extrabold uppercase text-[#101D3A]">
              Pickup Location
              <input required type="text" placeholder="PCU Campus Gate" className="input-field mt-1.5" value={formData.pickup} onChange={e => setFormData({ ...formData, pickup: e.target.value })} />
            </label>
            <label className="block text-xs font-extrabold uppercase text-[#101D3A]">
              Destination
              <input required type="text" placeholder="Pune International Airport" className="input-field mt-1.5" value={formData.dropoff} onChange={e => setFormData({ ...formData, dropoff: e.target.value })} />
            </label>
          </div>

          <label className="block text-xs font-extrabold uppercase text-[#101D3A]">
            Date and Time
            <input required type="datetime-local" className="input-field mt-1.5" value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} />
          </label>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block text-xs font-extrabold uppercase text-[#101D3A]">
              Available seats
              <input required type="number" min="1" max="7" className="input-field mt-1.5" value={formData.seats} onChange={e => setFormData({ ...formData, seats: e.target.value })} />
            </label>
            <label className="block text-xs font-extrabold uppercase text-[#101D3A]">
              Price per seat (₹)
              <input required type="number" min="0" step="1" className="input-field mt-1.5" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
            </label>
            <label className="block text-xs font-extrabold uppercase text-[#101D3A]">
              Rider Preference
              <select className="input-field mt-1.5" value={formData.allowedGender} onChange={e => setFormData({ ...formData, allowedGender: e.target.value })}>
                <option value="all">All students</option>
                <option value="female">Female only</option>
                <option value="male">Male only</option>
              </select>
            </label>
          </div>

          <button type="submit" disabled={loading} className="w-full btn-primary py-4 text-xs font-extrabold uppercase tracking-wider mt-4">
            {loading ? 'PUBLISHING RIDE...' : 'PUBLISH RIDE'}
          </button>
        </form>
      </section>

    </main>
  );
}

export default CreateRide;