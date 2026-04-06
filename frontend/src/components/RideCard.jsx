import { useState } from 'react';

function RideCard({ ride, currentUserId, onRequest, onCancel, onFinish }) {
  const [loading, setLoading] = useState(false);
  const [localRequested, setLocalRequested] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [isSatisfied, setIsSatisfied] = useState(true);
  const isDriver = ride.driverId === currentUserId;
  const hasJoined = ride.riders?.some(r => r.userId === currentUserId);
  const isFull = ride.seats <= 0;

  const handleRequest = async () => {
    setLoading(true);
    const success = await onRequest(ride);
    if (success) {
      setLocalRequested(true);
    }
    setLoading(false);
  };
  
  const handleCancelClick = async () => {
    setLoading(true);
    await onCancel(ride.id);
    setLoading(false);
  };

  return (
    <div className="card fade-in flex flex-col justify-between hover:-translate-y-1 bg-slate-800/20 backdrop-blur-xl border-slate-700/30">
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-bold border border-slate-700 shadow-sm">
              {ride.driverName.charAt(0)}
            </div>
            <div>
              <h3 className="font-semibold text-white">{ride.driverName}</h3>
              <p className="text-[10px] text-brand-400 font-semibold uppercase tracking-wider bg-brand-500/10 border border-brand-500/20 inline-block px-2 py-0.5 rounded-full mt-1">Driver</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-white">₹{ride.price}</p>
            <p className="text-xs text-brand-400 font-medium">per person</p>
          </div>
        </div>

        <div className="space-y-4 mb-6 relative pl-2">
          <div className="absolute left-4 top-3 bottom-3 w-0.5 bg-slate-700/50"></div>
          
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-5 h-5 rounded-full bg-slate-900 border-4 border-brand-500 shadow-[0_0_10px_rgba(20,184,166,0.3)]"></div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Pickup</p>
              <p className="font-medium text-white">{ride.pickup}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 relative z-10">
             <div className="w-5 h-5 rounded-full bg-indigo-500 border-4 border-slate-900 shadow-[0_0_10px_rgba(79,70,229,0.3)]"></div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Dropoff</p>
              <p className="font-medium text-white">{ride.dropoff}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center text-sm text-slate-300 bg-slate-800/50 p-3 rounded-xl mb-4 border border-slate-700/50 backdrop-blur-sm">
          <div className="flex items-center gap-1.5 focus:outline-none">
            <svg className="w-4 h-4 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">{new Date(ride.time).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>{ride.seats} seats</span>
          </div>
        </div>
      </div>

      <div className="mt-2">
        {isDriver ? (
           <div className="space-y-3">
             <div className="flex gap-2">
                 <button 
                   onClick={handleCancelClick} 
                   disabled={loading}
                   className="flex-1 py-2.5 rounded-xl border border-red-500/20 text-red-400 font-semibold bg-red-500/10 hover:bg-red-500/20 transition-all shadow-sm"
                 >
                   {loading ? 'Canceling...' : 'Cancel'}
                 </button>
                 {ride.riders && ride.riders.length > 0 && onFinish && (
                     <button 
                       onClick={() => setShowFinishModal(true)}
                       className="flex-1 py-2.5 rounded-xl border border-blue-500/20 text-blue-400 font-semibold bg-blue-500/10 hover:bg-blue-500/20 transition-all shadow-sm"
                     >
                       Finish Ride
                     </button>
                 )}
             </div>
             {ride.riders && ride.riders.length > 0 && (
               <div className="mt-4 border-t border-slate-700/50 pt-4">
                 <h4 className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-3">Confirmed Riders</h4>
                 <div className="space-y-2">
                   {ride.riders.map(rider => (
                     <div key={rider.userId} className="flex justify-between items-center bg-slate-900/50 p-2.5 rounded-lg border border-slate-700/30 backdrop-blur-sm">
                        <div className="flex items-center gap-2">
                           <div className="w-7 h-7 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
                             {rider.userName.charAt(0)}
                           </div>
                           <span className="text-sm font-medium text-slate-200">{rider.userName}</span>
                        </div>
                        {rider.channelId && (
                           <button
                             title="Open Chat widget to see messages"
                             onClick={() => window.dispatchEvent(new CustomEvent('openchat', { detail: { channelId: rider.channelId, otherUser: { id: rider.userId, name: rider.userName } } }))}
                             className="text-xs py-1 px-3 bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 border border-brand-500/20 rounded-md transition-colors"
                           >
                             Chat
                           </button>
                        )}
                     </div>
                   ))}
                 </div>
               </div>
             )}
           </div>
        ) : hasJoined ? (
      <div className="mt-2 text-center rounded-xl overflow-hidden border border-emerald-500/20 bg-emerald-500/10 flex flex-col">
           <div className="py-2.5 text-emerald-400 font-semibold cursor-default border-b border-emerald-500/10">
             Joined successfully 🎉
           </div>
           <div className="flex w-full">
           {(() => {
             const riderInfo = ride.riders?.find(r => r.userId === currentUserId);
             return riderInfo?.channelId ? (
                <button 
                   onClick={() => window.dispatchEvent(new CustomEvent('openchat', { detail: { channelId: riderInfo.channelId, otherUser: { id: ride.driverId, name: ride.driverName } } }))}
                   className="flex-1 py-2 bg-emerald-600/20 text-emerald-300 font-medium z-10 hover:bg-emerald-600/40 transition-colors text-center border-r border-emerald-600/20"
                >
                   Chat 💬
                </button>
             ) : null;
           })()}
             {onFinish && (
                <button 
                   onClick={() => setShowFinishModal(true)}
                   className="flex-1 py-2 bg-blue-600/20 text-blue-300 font-medium z-10 hover:bg-blue-600/40 transition-colors text-center"
                >
                   Finish Ride ✨
                </button>
             )}
           </div>
      </div>
        ) : localRequested ? (
           <button disabled className="w-full py-2.5 rounded-xl border border-indigo-500/20 text-indigo-400 font-semibold bg-indigo-500/10 cursor-not-allowed">
             Request Pending ⏳
           </button>
        ) : isFull ? (
           <button disabled className="w-full py-2.5 rounded-xl border border-slate-700 text-slate-500 font-semibold bg-slate-800/50 cursor-not-allowed">
             Ride Full
           </button>
        ) : (
           <button 
             onClick={handleRequest}
             disabled={loading}
             className="w-full btn-primary"
           >
             {loading ? 'Booking...' : 'Book Now'}
           </button>
        )}
      </div>

      {/* Finish Ride Modal */}
      {showFinishModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowFinishModal(false)}>
          <div 
            className="bg-slate-900 border border-slate-700/50 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl fade-in"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">Complete Ride</h3>
              
              {!isDriver && (
                <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center">
                  <p className="text-sm text-slate-300 mb-1">Please pay the driver</p>
                  <p className="text-4xl font-black text-emerald-400 mb-1">₹{ride.price}</p>
                  <p className="text-xs text-brand-400">(Hand over cash or UPI)</p>
                </div>
              )}

              <div className="mb-6">
                <p className="text-slate-300 mb-3 text-sm">
                  {isDriver ? "Are you satisfied with the passengers?" : "Are you satisfied with the driver?"}
                </p>
                <label className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl cursor-pointer hover:bg-slate-800 transition-colors border border-slate-700">
                  <div className="relative flex items-center">
                    <input 
                      type="checkbox" 
                      className="peer w-5 h-5 opacity-0 absolute"
                      checked={isSatisfied}
                      onChange={(e) => setIsSatisfied(e.target.checked)}
                    />
                    <div className="w-5 h-5 rounded flex items-center justify-center bg-slate-700 peer-checked:bg-brand-500 border border-slate-600 peer-checked:border-brand-500 transition-colors">
                      <svg className="w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <span className="text-white font-medium select-none text-sm">Yes, overall satisfied.</span>
                </label>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setShowFinishModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-600 text-slate-300 font-semibold hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={async () => {
                    if (onFinish) {
                      setLoading(true);
                      await onFinish(ride, { satisfied: isSatisfied });
                      setShowFinishModal(false);
                      setLoading(false);
                    }
                  }}
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-black hover:shadow-lg hover:shadow-brand-500/20 transition-all active:scale-95 text-center"
                >
                  {loading ? 'Submitting...' : 'Complete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RideCard;
