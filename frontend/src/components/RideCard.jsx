import { useState } from 'react';

function RideCard({ ride, currentUserId, isRequested, onRequest, onCancel, onFinish }) {
  const [loading, setLoading] = useState(false);
  const [localRequested, setLocalRequested] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [isSatisfied, setIsSatisfied] = useState(true);
  const isDriver = ride.driverId === currentUserId;
  const hasJoined = ride.riders?.some(r => r.userId === currentUserId);
  const isFull = ride.seats <= 0;
  const dateText = new Date(ride.time).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
  const isPending = isRequested || localRequested;

  const handleRequest = async () => {
    setLoading(true);
    const success = await onRequest(ride);
    if (success) setLocalRequested(true);
    setLoading(false);
  };

  const handleCancelClick = async () => {
    setLoading(true);
    await onCancel(ride.id);
    setLoading(false);
  };

  return (
    <article className="card fade-in flex min-h-[360px] flex-col justify-between">
      <div>
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-slate-100 text-base font-extrabold text-slate-700">
              {ride.driverName.charAt(0)}
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-base font-extrabold text-slate-950">{ride.driverName}</h3>
              <p className="mt-1 inline-flex rounded-full bg-teal-50 px-2.5 py-1 text-xs font-bold uppercase text-teal-700">Driver</p>
            </div>
          </div>
          <div className="rounded-xl bg-slate-950 px-3 py-2 text-right text-white">
            <p className="text-lg font-extrabold">Rs. {ride.price}</p>
            <p className="text-xs font-semibold text-slate-300">per seat</p>
          </div>
        </div>

        <div className="mb-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="relative grid gap-5 pl-7">
            <div className="absolute left-2.5 top-3 h-[calc(100%-24px)] w-px bg-slate-300" />
            <div className="relative">
              <span className="absolute -left-7 top-1 h-5 w-5 rounded-full border-4 border-white bg-teal-600 shadow-sm" />
              <p className="text-xs font-bold uppercase text-slate-500">Pickup</p>
              <p className="mt-1 text-sm font-extrabold text-slate-950">{ride.pickup}</p>
            </div>
            <div className="relative">
              <span className="absolute -left-7 top-1 h-5 w-5 rounded-full border-4 border-white bg-indigo-600 shadow-sm" />
              <p className="text-xs font-bold uppercase text-slate-500">Dropoff</p>
              <p className="mt-1 text-sm font-extrabold text-slate-950">{ride.dropoff}</p>
            </div>
          </div>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl border border-slate-200 bg-white p-3">
            <p className="text-xs font-bold uppercase text-slate-500">Leaving</p>
            <p className="mt-1 font-bold text-slate-950">{dateText}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-3">
            <p className="text-xs font-bold uppercase text-slate-500">Seats</p>
            <p className="mt-1 font-bold text-slate-950">{ride.seats} available</p>
          </div>
        </div>
      </div>

      <div>
        {isDriver ? (
          <div className="space-y-3">
            <div className="flex gap-2">
              <button onClick={handleCancelClick} disabled={loading} className="flex-1 rounded-xl border border-rose-200 bg-rose-50 py-3 text-sm font-bold text-rose-700 transition-colors hover:bg-rose-100">
                {loading ? 'Canceling...' : 'Cancel'}
              </button>
              {ride.riders && ride.riders.length > 0 && onFinish && (
                <button onClick={() => setShowFinishModal(true)} className="flex-1 rounded-xl border border-blue-200 bg-blue-50 py-3 text-sm font-bold text-blue-700 transition-colors hover:bg-blue-100">
                  Finish
                </button>
              )}
            </div>
            {ride.riders && ride.riders.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <h4 className="mb-2 text-xs font-bold uppercase text-slate-500">Confirmed riders</h4>
                <div className="space-y-2">
                  {ride.riders.map(rider => (
                    <div key={rider.userId} className="flex items-center justify-between rounded-xl bg-white p-2.5">
                      <span className="truncate text-sm font-bold text-slate-800">{rider.userName}</span>
                      {rider.channelId && (
                        <button onClick={() => window.dispatchEvent(new CustomEvent('openchat', { detail: { channelId: rider.channelId, otherUser: { id: rider.userId, name: rider.userName } } }))} className="rounded-lg bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-700">
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
          <div className="overflow-hidden rounded-xl border border-teal-200 bg-teal-50">
            <div className="px-4 py-3 text-center text-sm font-bold text-teal-800">Joined successfully</div>
            <div className="flex border-t border-teal-100">
              {(() => {
                const riderInfo = ride.riders?.find(r => r.userId === currentUserId);
                return riderInfo?.channelId ? (
                  <button onClick={() => window.dispatchEvent(new CustomEvent('openchat', { detail: { channelId: riderInfo.channelId, otherUser: { id: ride.driverId, name: ride.driverName } } }))} className="flex-1 px-4 py-2.5 text-sm font-bold text-teal-800 hover:bg-teal-100">
                    Chat
                  </button>
                ) : null;
              })()}
              {onFinish && <button onClick={() => setShowFinishModal(true)} className="flex-1 px-4 py-2.5 text-sm font-bold text-blue-700 hover:bg-blue-50">Finish</button>}
            </div>
          </div>
        ) : isPending ? (
          <button disabled className="w-full rounded-xl border border-indigo-200 bg-indigo-50 py-3 text-sm font-bold text-indigo-700">Request pending</button>
        ) : isFull ? (
          <button disabled className="w-full rounded-xl border border-slate-200 bg-slate-100 py-3 text-sm font-bold text-slate-400">Ride full</button>
        ) : (
          <button onClick={handleRequest} disabled={loading} className="w-full btn-primary">
            {loading ? 'Booking...' : 'Book seat'}
          </button>
        )}
      </div>

      {showFinishModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm" onClick={() => setShowFinishModal(false)}>
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-extrabold text-slate-950">Complete ride</h3>
            {!isDriver && (
              <div className="my-5 rounded-2xl border border-teal-200 bg-teal-50 p-4 text-center">
                <p className="text-sm font-medium text-slate-600">Please pay the driver</p>
                <p className="mt-1 text-4xl font-extrabold text-teal-700">Rs. {ride.price}</p>
              </div>
            )}
            <label className="my-5 flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <input type="checkbox" className="h-5 w-5 accent-teal-700" checked={isSatisfied} onChange={(e) => setIsSatisfied(e.target.checked)} />
              <span className="text-sm font-bold text-slate-800">Overall satisfied with this ride</span>
            </label>
            <div className="flex gap-3">
              <button onClick={() => setShowFinishModal(false)} className="flex-1 btn-secondary">Cancel</button>
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
                className="flex-1 btn-primary"
              >
                {loading ? 'Submitting...' : 'Complete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

export default RideCard;