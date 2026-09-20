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
    <article className="card fade-in flex min-h-[360px] flex-col justify-between border border-[#DCE5F0] bg-white rounded-2xl p-5 shadow-sm hover:border-[#1683F8]/40 transition-all">
      <div>
        {/* DRIVER HEADER & PRICE */}
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#EEF7FF] text-base font-black text-[#1683F8] border border-[#DCE5F0]">
              {ride.driverName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-base font-extrabold text-[#101D3A]">{ride.driverName}</h3>
              <p className="mt-1 inline-flex rounded-full bg-[#EEF7FF] px-2.5 py-0.5 text-xs font-bold uppercase text-[#1683F8]">Driver</p>
            </div>
          </div>
          <div className="rounded-xl bg-[#F5FAFF] border border-[#DCE5F0] px-3.5 py-2 text-right">
            <p className="text-lg font-black text-[#1683F8]">₹{ride.price}</p>
            <p className="text-[11px] font-semibold text-[#65728A]">per seat</p>
          </div>
        </div>

        {/* ROUTE DISPLAY */}
        <div className="mb-5 rounded-2xl border border-[#DCE5F0] bg-[#F7FAFE] p-4">
          <div className="relative grid gap-5 pl-7">
            <div className="absolute left-2.5 top-3 h-[calc(100%-24px)] w-px bg-[#DCE5F0]" />
            <div className="relative">
              <span className="absolute -left-7 top-1 h-5 w-5 rounded-full border-4 border-white bg-[#1683F8] shadow-sm" />
              <p className="text-[11px] font-bold uppercase text-[#65728A]">Pickup</p>
              <p className="mt-0.5 text-sm font-bold text-[#101D3A]">{ride.pickup}</p>
            </div>
            <div className="relative">
              <span className="absolute -left-7 top-1 h-5 w-5 rounded-full border-4 border-white bg-[#101D3A] shadow-sm" />
              <p className="text-[11px] font-bold uppercase text-[#65728A]">Dropoff</p>
              <p className="mt-0.5 text-sm font-bold text-[#101D3A]">{ride.dropoff}</p>
            </div>
          </div>
        </div>

        {/* METADATA GRID */}
        <div className="mb-5 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl border border-[#DCE5F0] bg-white p-3">
            <p className="text-[11px] font-bold uppercase text-[#65728A]">Leaving</p>
            <p className="mt-1 text-xs font-bold text-[#101D3A]">{dateText}</p>
          </div>
          <div className="rounded-xl border border-[#DCE5F0] bg-white p-3">
            <p className="text-[11px] font-bold uppercase text-[#65728A]">Seats</p>
            <p className="mt-1 text-xs font-bold text-[#101D3A]">{ride.seats} available</p>
          </div>
        </div>
      </div>

      {/* ACTIONS */}
      <div>
        {isDriver ? (
          <div className="space-y-3">
            <div className="flex gap-2">
              <button onClick={handleCancelClick} disabled={loading} className="flex-1 rounded-xl border border-[#E5484D]/30 bg-[#E5484D]/10 py-3 text-sm font-bold text-[#E5484D] transition-colors hover:bg-[#E5484D]/20">
                {loading ? 'Canceling...' : 'Cancel Ride'}
              </button>
              {ride.riders && ride.riders.length > 0 && onFinish && (
                <button onClick={() => setShowFinishModal(true)} className="flex-1 rounded-xl border border-[#1683F8]/30 bg-[#EEF7FF] py-3 text-sm font-bold text-[#1683F8] transition-colors hover:bg-[#1683F8]/20">
                  Finish Ride
                </button>
              )}
            </div>
            {ride.riders && ride.riders.length > 0 && (
              <div className="rounded-2xl border border-[#DCE5F0] bg-[#F7FAFE] p-3">
                <h4 className="mb-2 text-[11px] font-bold uppercase text-[#65728A]">Confirmed riders</h4>
                <div className="space-y-2">
                  {ride.riders.map(rider => (
                    <div key={rider.userId} className="flex items-center justify-between rounded-xl bg-white border border-[#DCE5F0] p-2.5">
                      <span className="truncate text-xs font-bold text-[#101D3A]">{rider.userName}</span>
                      {rider.channelId && (
                        <button onClick={() => window.dispatchEvent(new CustomEvent('openchat', { detail: { channelId: rider.channelId, otherUser: { id: rider.userId, name: rider.userName } } }))} className="rounded-lg bg-[#EEF7FF] px-3 py-1.5 text-xs font-bold text-[#1683F8] hover:bg-[#1683F8] hover:text-white transition-colors">
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
          <div className="overflow-hidden rounded-xl border border-[#18B76A]/30 bg-[#18B76A]/10">
            <div className="px-4 py-3 text-center text-xs font-bold text-[#18B76A] uppercase tracking-wider">Confirmed • Seat Booked</div>
            <div className="flex border-t border-[#18B76A]/20 bg-white">
              {(() => {
                const riderInfo = ride.riders?.find(r => r.userId === currentUserId);
                return riderInfo?.channelId ? (
                  <button onClick={() => window.dispatchEvent(new CustomEvent('openchat', { detail: { channelId: riderInfo.channelId, otherUser: { id: ride.driverId, name: ride.driverName } } }))} className="flex-1 px-4 py-2.5 text-xs font-bold text-[#1683F8] hover:bg-[#EEF7FF]">
                    Chat with Host
                  </button>
                ) : null;
              })()}
              {onFinish && <button onClick={() => setShowFinishModal(true)} className="flex-1 px-4 py-2.5 text-xs font-bold text-[#101D3A] hover:bg-[#F5FAFF]">Complete</button>}
            </div>
          </div>
        ) : isPending ? (
          <button disabled className="w-full rounded-xl border border-[#F2A900]/30 bg-[#F2A900]/10 py-3 text-xs font-bold text-[#F2A900] uppercase tracking-wider">
            Pending • Waiting for Host
          </button>
        ) : isFull ? (
          <button disabled className="w-full rounded-xl border border-[#DCE5F0] bg-[#F7FAFE] py-3 text-xs font-bold text-[#65728A]">
            Ride Full
          </button>
        ) : (
          <button onClick={handleRequest} disabled={loading} className="w-full btn-primary">
            {loading ? 'Booking...' : 'Book seat'}
          </button>
        )}
      </div>

      {showFinishModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#101D3A]/40 p-4 backdrop-blur-sm" onClick={() => setShowFinishModal(false)}>
          <div className="w-full max-w-sm rounded-2xl bg-white border border-[#DCE5F0] p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-extrabold text-[#101D3A]">Complete ride</h3>
            {!isDriver && (
              <div className="my-5 rounded-2xl border border-[#DCE5F0] bg-[#EEF7FF] p-4 text-center">
                <p className="text-xs font-medium text-[#65728A]">Please pay the driver</p>
                <p className="mt-1 text-3xl font-black text-[#1683F8]">₹{ride.price}</p>
              </div>
            )}
            <label className="my-5 flex cursor-pointer items-center gap-3 rounded-xl border border-[#DCE5F0] bg-[#F7FAFE] p-3">
              <input type="checkbox" className="h-5 w-5 accent-[#1683F8]" checked={isSatisfied} onChange={(e) => setIsSatisfied(e.target.checked)} />
              <span className="text-xs font-bold text-[#101D3A]">Overall satisfied with this ride</span>
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