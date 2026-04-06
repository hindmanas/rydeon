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
    price: 15,
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
        body: JSON.stringify({
          ...formData,
          driverId: user.uid,
          driverName: user.displayName || user.email
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create ride');
      }

      navigate('/');
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Offer a Ride</h1>
        <p className="text-slate-400 mt-2">Help peers commute and share the travel costs.</p>
      </div>

      <div className="card p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Pickup Location</label>
              <input 
                required
                type="text" 
                placeholder="e.g. North Campus Dorms"
                className="input-field"
                value={formData.pickup}
                onChange={e => setFormData({...formData, pickup: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Dropoff Location</label>
              <input 
                required
                type="text" 
                placeholder="e.g. Main Library / Station"
                className="input-field"
                value={formData.dropoff}
                onChange={e => setFormData({...formData, dropoff: e.target.value})}
              />
            </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-slate-300 mb-1">Date & Time</label>
             <input 
               required
               type="datetime-local" 
               className="input-field"
               value={formData.time}
               onChange={e => setFormData({...formData, time: e.target.value})}
             />
          </div>

          <div className="flex gap-4">
             <div className="flex-1">
               <label className="block text-sm font-medium text-slate-300 mb-1">Available Seats</label>
               <input 
                 required
                 type="number" 
                 min="1" max="7"
                 className="input-field"
                 value={formData.seats}
                 onChange={e => setFormData({...formData, seats: e.target.value})}
               />
             </div>
             <div className="flex-1">
               <label className="block text-sm font-medium text-slate-300 mb-1">Price per Seat ($)</label>
               <input 
                 required
                 type="number" 
                 min="0" step="0.5"
                 className="input-field"
                 value={formData.price}
                 onChange={e => setFormData({...formData, price: e.target.value})}
               />
             </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-slate-300 mb-1">Allowed Gender</label>
             <select 
               className="input-field text-slate-300"
               value={formData.allowedGender}
               onChange={e => setFormData({...formData, allowedGender: e.target.value})}
             >
               <option value="all">All Genders</option>
               <option value="female">Only Females</option>
               <option value="male">Only Males</option>
             </select>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full btn-primary py-3.5 text-lg shadow-[0_4px_20px_0_rgba(20,184,166,0.3)]"
          >
            {loading ? 'Publishing Ride...' : 'Publish Ride'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateRide;
