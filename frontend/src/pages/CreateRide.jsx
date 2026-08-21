import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'https://rydeon-backend-xdbl.onrender.com/api/rides';

function CreateRide({ user }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    pickup: '',
    dropoff: '',
    time: '',
    seats: 3,
    price: 40,
    allowedGender: 'all'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/create-ride`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, driverId: user.uid, driverName: user.displayName || user.email })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create ride');
      }

      navigate('/');
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="fade-in mx-auto grid max-w-5xl gap-6 lg:grid-cols-[0.85fr_1.15fr]">
      <aside className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white shadow-sm sm:p-8">
        <p className="text-sm font-bold uppercase text-teal-300">Offer a route</p>
        <h1 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">Publish a ride that feels trustworthy.</h1>
        <div className="mt-8 space-y-3">
          <div className="rounded-2xl bg-white/10 p-4">
            <p className="font-extrabold">Clear route</p>
            <p className="mt-1 text-sm text-slate-300">Use recognizable pickup and dropoff labels.</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-4">
            <p className="font-extrabold">Fair pricing</p>
            <p className="mt-1 text-sm text-slate-300">Show the per-seat amount before riders request.</p>
          </div>
          <div className="rounded-2xl bg-teal-500 p-4 text-slate-950">
            <p className="font-extrabold">Fast matching</p>
            <p className="mt-1 text-sm font-semibold text-teal-950/70">Requests arrive in your dashboard.</p>
          </div>
        </div>
      </aside>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 border-b border-slate-100 pb-5">
          <h2 className="text-2xl font-extrabold text-slate-950">Ride details</h2>
          <p className="mt-1 text-sm font-medium text-slate-500">Keep it compact and easy to scan.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-bold text-slate-700">Pickup location<input required type="text" placeholder="C block" className="input-field mt-1" value={formData.pickup} onChange={e => setFormData({ ...formData, pickup: e.target.value })} /></label>
            <label className="block text-sm font-bold text-slate-700">Dropoff location<input required type="text" placeholder="Pune junction" className="input-field mt-1" value={formData.dropoff} onChange={e => setFormData({ ...formData, dropoff: e.target.value })} /></label>
          </div>

          <label className="block text-sm font-bold text-slate-700">Date and time<input required type="datetime-local" className="input-field mt-1" value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} /></label>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block text-sm font-bold text-slate-700">Available seats<input required type="number" min="1" max="7" className="input-field mt-1" value={formData.seats} onChange={e => setFormData({ ...formData, seats: e.target.value })} /></label>
            <label className="block text-sm font-bold text-slate-700">Price per seat<input required type="number" min="0" step="1" className="input-field mt-1" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} /></label>
            <label className="block text-sm font-bold text-slate-700">Riders<select className="input-field mt-1" value={formData.allowedGender} onChange={e => setFormData({ ...formData, allowedGender: e.target.value })}><option value="all">All</option><option value="female">Female only</option><option value="male">Male only</option></select></label>
          </div>

          <button type="submit" disabled={loading} className="w-full btn-primary py-3.5 text-base">
            {loading ? 'Publishing ride...' : 'Publish ride'}
          </button>
        </form>
      </section>
    </main>
  );
}

export default CreateRide;