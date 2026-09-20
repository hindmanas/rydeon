import React, { useEffect, useState, useRef } from 'react';
import { StreamChat } from 'stream-chat';
import {
  Chat,
  ChannelList,
  Channel,
  Window,
  MessageList,
  MessageInput,
  ChannelHeader
} from 'stream-chat-react';
import 'stream-chat-react/dist/css/v2/index.css';
import toast from 'react-hot-toast';
import { useChannelStateContext } from 'stream-chat-react';

const apiKey = import.meta.env.VITE_STREAM_API_KEY;

const toastStyle = {
  background: '#1e293b',
  color: '#f1f5f9',
  border: '1px solid rgba(16,185,129,0.3)',
  borderRadius: '14px',
  fontFamily: "'Outfit', sans-serif",
};

/* ── Custom Channel Header ── */
const CustomHeader = () => {
  const { channel } = useChannelStateContext();
  const pickup = channel?.data?.pickup;
  const dropoff = channel?.data?.dropoff;

  return (
    <div className="rydeon-chat-header">
      <ChannelHeader />
      {pickup && dropoff && (
        <button
          onClick={() => toast('🚧 Directions coming soon!', { icon: '🗺️', style: { ...toastStyle, border: '1px solid rgba(255,255,255,0.08)' } })}
          className="rydeon-dir-btn"
        >
          <svg className="rydeon-dir-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <span>Directions</span>
        </button>
      )}
    </div>
  );
};

/* ── Main Widget ── */
export default function GlobalChatWidget({ user }) {
  const [chatClient, setChatClient] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [activeChannel, setActiveChannel] = useState(null);
  const [showList, setShowList] = useState(true);
  const isOpenRef = useRef(isOpen);

  useEffect(() => { isOpenRef.current = isOpen; }, [isOpen]);

  /* Open to a specific channel from RideCard */
  useEffect(() => {
    const handleOpen = async (e) => {
      setIsOpen(true);
      if (e.detail?.channelId && chatClient) {
        try {
          const c = chatClient.channel('messaging', e.detail.channelId);
          await c.watch();
          setActiveChannel(c);
          setShowList(false);
        } catch (err) {
          console.error('Failed to watch channel', err);
        }
      }
    };
    window.addEventListener('openchat', handleOpen);
    return () => window.removeEventListener('openchat', handleOpen);
  }, [chatClient]);

  /* Init Stream */
  useEffect(() => {
    if (!user || !apiKey) return;
    let client = null;
    let mounted = true;

    const init = async () => {
      try {
        client = StreamChat.getInstance(apiKey);
        const res = await fetch(`https://rydeon-backend-xdbl.onrender.com/api/chat/token/${user.uid}`);
        if (!res.ok) throw new Error('Token fetch failed');
        const { token } = await res.json();

        await client.connectUser(
          {
            id: user.uid,
            name: user.displayName || user.email?.split('@')[0] || 'User',
            image: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'User')}&background=10b981&color=fff`,
          },
          token
        );

        if (mounted) setChatClient(client);

        client.on('message.new', (e) => {
          if (e.message.user.id !== user.uid) {
            setHasUnread(true);
            if (!isOpenRef.current)
              toast.success(`💬 ${e.message.user.name}: ${e.message.text?.slice(0, 40)}…`, { style: toastStyle });
          }
        });

        client.on('notification.added_to_channel', () => {
          setHasUnread(true);
          toast('A new Ride Chat was started! 🚗', { style: toastStyle });
        });
      } catch (err) {
        console.error('Chat init error:', err);
      }
    };

    init();
    return () => { mounted = false; client?.disconnectUser(); };
  }, [user]);

  if (!chatClient) return null;

  const filters = { members: { $in: [user.uid] } };
  const sort = { last_message_at: -1 };

  return (
    <>
      {/* Panel — positioned above FAB */}
      {isOpen && (
        <div className="rydeon-panel">
          <div className="rydeon-panel-header">
            <div className="rydeon-panel-header-left">
              {!showList && (
                <button className="rydeon-back-btn" onClick={() => setShowList(true)}>
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: 14, height: 14 }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
              )}
              <div className="rydeon-brand-dot" />
              <span className="rydeon-panel-title">Messages</span>
            </div>
            <button className="rydeon-close-btn" onClick={() => setIsOpen(false)}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: 18, height: 18 }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="rydeon-panel-body">
            <Chat client={chatClient} theme="str-chat__theme-dark">
              <div className={`rydeon-sidebar ${!showList ? 'rydeon-sidebar--hidden' : ''}`}>
                <div className="rydeon-sidebar-label">Your Chats</div>
                <div className="rydeon-channel-list-wrap">
                  <ChannelList
                    filters={filters}
                    sort={sort}
                    onSelect={(c) => { setActiveChannel(c); setShowList(false); }}
                  />
                </div>
              </div>

              <div className={`rydeon-chat-area ${showList ? 'rydeon-chat-area--hidden' : ''}`}>
                {activeChannel ? (
                  <Channel channel={activeChannel}>
                    <Window>
                      <CustomHeader />
                      <MessageList />
                      <MessageInput focus />
                    </Window>
                  </Channel>
                ) : (
                  <div className="rydeon-empty-state">
                    <div className="rydeon-empty-icon">
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: 26, height: 26, opacity: 0.8 }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <p className="rydeon-empty-title">Select a chat</p>
                    <p className="rydeon-empty-sub">Pick a ride chat from the left to start messaging</p>
                  </div>
                )}
              </div>
            </Chat>
          </div>
        </div>
      )}

      {/* FAB — always fixed bottom-right, never moves */}
      <button
        className={`rydeon-fab ${isOpen ? 'rydeon-fab--open' : ''}`}
        onClick={() => { setIsOpen(o => !o); setHasUnread(false); if (!isOpen) setShowList(true); }}
        aria-label="Toggle chat"
      >
        {isOpen ? (
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: 22, height: 22 }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: 22, height: 22 }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
        {hasUnread && !isOpen && <span className="rydeon-unread-dot" />}
      </button>

      <style>{`
        /* Panel */
        .rydeon-panel {
          position: fixed;
          bottom: 90px;
          right: 24px;
          width: min(640px, calc(100vw - 48px));
          height: min(600px, calc(100vh - 120px));
          display: flex;
          flex-direction: column;
          border-radius: 24px;
          overflow: hidden;
          background: #ffffff;
          border: 1px solid #DCE5F0;
          box-shadow: 0 16px 48px rgba(16, 131, 248, 0.15);
          animation: rydeon-slide-up 0.28s cubic-bezier(0.16,1,0.3,1) forwards;
          z-index: 9998;
          font-family: 'Inter', sans-serif;
        }
        /* Mobile: stretch panel left-right, stop above FAB */
        @media (max-width: 640px) {
          .rydeon-panel {
            right: 16px;
            left: 16px;
            width: auto;
            bottom: 90px;
            height: calc(100vh - 120px);
            border-radius: 20px;
          }
        }
        @keyframes rydeon-slide-up {
          from { opacity: 0; transform: translateY(14px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }

        /* Panel Header */
        .rydeon-panel-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 13px 16px;
          background: #ffffff;
          border-bottom: 1px solid #DCE5F0;
          flex-shrink: 0;
        }
        .rydeon-panel-header-left { display: flex; align-items: center; gap: 10px; }
        .rydeon-brand-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: #1683F8; box-shadow: 0 0 8px rgba(22,131,248,0.8); flex-shrink: 0;
        }
        .rydeon-panel-title { font-size: 15px; font-weight: 800; color: #101D3A; }
        .rydeon-close-btn {
          width: 30px; height: 30px; border-radius: 9px;
          background: #F7FAFE; border: 1px solid #DCE5F0;
          color: #65728A; display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.2s;
        }
        .rydeon-close-btn:hover { background: #EEF7FF; color: #101D3A; }
        .rydeon-back-btn {
          width: 26px; height: 26px; border-radius: 8px;
          background: #EEF7FF; border: 1px solid #DCE5F0;
          color: #1683F8; display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: background 0.2s;
        }
        .rydeon-back-btn:hover { background: #1683F8; color: #fff; }

        /* Panel Body */
        .rydeon-panel-body { flex: 1; display: flex; overflow: hidden; min-height: 0; background: #F7FAFE; }
        .rydeon-panel-body .str-chat { width: 100%; height: 100%; display: flex; background: transparent !important; }

        /* Sidebar */
        .rydeon-sidebar {
          width: 210px; flex-shrink: 0; display: flex; flex-direction: column;
          background: #ffffff; border-right: 1px solid #DCE5F0; overflow: hidden;
        }
        .rydeon-sidebar-label {
          padding: 11px 14px 8px; font-size: 10px; font-weight: 800;
          letter-spacing: 0.12em; text-transform: uppercase; color: #1683F8;
          border-bottom: 1px solid #DCE5F0; flex-shrink: 0;
        }
        .rydeon-channel-list-wrap { flex: 1; overflow-y: auto; overflow-x: hidden; }

        /* Chat Area */
        .rydeon-chat-area { flex: 1; display: flex; flex-direction: column; overflow: hidden; min-width: 0; background: #F7FAFE; }

        /* Mobile: single pane */
        @media (max-width: 640px) {
          .rydeon-sidebar { width: 100%; border-right: none; }
          .rydeon-sidebar--hidden   { display: none !important; }
          .rydeon-chat-area--hidden { display: none !important; }
          .rydeon-chat-area { width: 100%; }
        }

        /* Empty State */
        .rydeon-empty-state {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; justify-content: center; padding: 32px; text-align: center;
        }
        .rydeon-empty-icon {
          width: 52px; height: 52px; border-radius: 16px;
          background: #EEF7FF; border: 1px solid #DCE5F0;
          display: flex; align-items: center; justify-content: center;
          color: #1683F8; margin-bottom: 12px;
        }
        .rydeon-empty-title { font-size: 14px; font-weight: 800; color: #101D3A; margin-bottom: 4px; }
        .rydeon-empty-sub   { font-size: 11px; color: #65728A; max-width: 180px; line-height: 1.5; }

        /* FAB — always bottom-right, never affected by panel */
        .rydeon-fab {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 9999;
          width: 54px; height: 54px; border-radius: 17px;
          background: #1683F8;
          box-shadow: 0 6px 20px rgba(22,131,248,0.35);
          color: #fff; display: flex; align-items: center; justify-content: center;
          cursor: pointer; border: none;
          transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), background-color 0.25s;
        }
        .rydeon-fab:hover {
          transform: scale(1.06);
          background: #168BFF;
          box-shadow: 0 8px 24px rgba(22,131,248,0.45);
        }
        .rydeon-fab:active { transform: scale(0.94); }
        .rydeon-fab--open {
          background: #101D3A;
          box-shadow: 0 4px 16px rgba(16,29,58,0.3);
        }
        .rydeon-unread-dot {
          position: absolute; top: -3px; right: -3px;
          width: 13px; height: 13px; background: #E5484D;
          border-radius: 50%; border: 2px solid #ffffff;
          animation: rydeon-ping 1.5s ease-in-out infinite;
        }
        @keyframes rydeon-ping {
          0%,100% { box-shadow: 0 0 0 0 rgba(229,72,77,0.5); }
          50%      { box-shadow: 0 0 0 6px rgba(229,72,77,0); }
        }

        /* Stream Theme */
        .str-chat__theme-dark {
          --str-chat__background-color:        transparent !important;
          --str-chat__surface-color:           #ffffff     !important;
          --str-chat__primary-color:           #1683F8     !important;
          --str-chat__secondary-color:         #101D3A     !important;
          --str-chat__secondary-surface-color: #F7FAFE     !important;
          --str-chat__text-color:              #101D3A     !important;
          --str-chat__text-low-emphasis-color: #65728A     !important;
          --str-chat__border-color:            #DCE5F0     !important;
          font-family: 'Inter', sans-serif    !important;
        }
        .str-chat__channel-list { background: transparent !important; }
        .str-chat__channel-list-messenger__main { padding: 4px 0 !important; }
        .str-chat__channel-preview-messenger {
          background: transparent !important; border-radius: 0 !important;
          border-bottom: 1px solid #DCE5F0 !important;
          padding: 10px 14px !important; margin: 0 !important;
          transition: background 0.15s !important; gap: 10px !important;
        }
        .str-chat__channel-preview-messenger:hover { background: #F5FAFF !important; }
        .str-chat__channel-preview-messenger--active {
          background: #EEF7FF !important; border-left: 3px solid #1683F8 !important;
        }
        .str-chat__channel-preview-messenger--name,
        .str-chat__channel-preview-title,
        [class*="channelPreview__name"],
        [class*="channel-preview__name"],
        .str-chat__channel-preview-end-first-row span {
          color: #101D3A !important; font-weight: 700 !important;
          font-size: 13px !important; font-family: 'Inter', sans-serif !important;
        }
        .str-chat__channel-preview-messenger--last-message,
        [class*="channelPreview__message"],
        [class*="channel-preview__message"],
        .str-chat__channel-preview-end-second-row {
          color: #65728A !important; font-size: 11px !important; font-family: 'Inter', sans-serif !important;
        }
        .str-chat__avatar-fallback {
          background: #1683F8 !important;
          color: #fff !important; font-weight: 700 !important;
          font-family: 'Inter', sans-serif !important; border-radius: 10px !important;
        }
        .str-chat__avatar { border-radius: 10px !important; }
        .str-chat__message-list { background: #F7FAFE !important; padding: 12px 0 !important; }
        .str-chat__message-list-scroll { padding: 0 12px !important; }
        .str-chat__message-text,
        .str-chat__message-simple__content--text,
        .str-chat__message-text-inner p {
          font-size: 13px !important;
          line-height: 1.55 !important; font-family: 'Inter', sans-serif !important;
        }
        .str-chat__message-bubble { border-radius: 16px !important; }
        .str-chat__message--me    .str-chat__message-bubble { background: #1683F8 !important; color: #ffffff !important; }
        .str-chat__message--other .str-chat__message-bubble { background: #EEF7FF !important; color: #101D3A !important; border: 1px solid #DCE5F0 !important; }
        .str-chat__message-data,
        .str-chat__message-timestamp { color: #65728A !important; font-size: 10px !important; }
        .str-chat__message-input {
          background: #ffffff !important;
          border-top: 1px solid #DCE5F0 !important; padding: 10px 12px !important;
        }
        .str-chat__message-input .str-chat__message-input-inner { gap: 8px !important; }
        .str-chat__message-input textarea,
        .str-chat__message-input [contenteditable] {
          background: #F7FAFE !important;
          border: 1px solid #DCE5F0 !important;
          border-radius: 12px !important; color: #101D3A !important;
          font-family: 'Inter', sans-serif !important; font-size: 13px !important; padding: 10px 14px !important;
        }
        .str-chat__message-input textarea::placeholder { color: #65728A !important; }
        .str-chat__send-button {
          background: #1683F8 !important;
          border-radius: 10px !important; border: none !important; color: #fff !important;
          width: 36px !important; height: 36px !important;
          display: flex !important; align-items: center !important; justify-content: center !important;
        }
        .str-chat__channel-header,
        .str-chat__header-livestream {
          background: #ffffff !important;
          border-bottom: 1px solid #DCE5F0 !important;
          padding: 10px 14px !important; min-height: unset !important;
        }
        .str-chat__channel-header-title,
        .str-chat__header-livestream-left--title {
          color: #101D3A !important; font-weight: 800 !important;
          font-size: 14px !important; font-family: 'Inter', sans-serif !important;
        }
        .str-chat__channel-header-info,
        .str-chat__header-livestream-left--members { color: #65728A !important; font-size: 11px !important; }
        .rydeon-chat-header { position: relative; display: flex; align-items: center; width: 100%; }
        .rydeon-dir-btn {
          position: absolute; right: 52px; top: 50%; transform: translateY(-50%);
          display: flex; align-items: center; gap: 4px; padding: 5px 10px;
          background: #EEF7FF; border: 1px solid #1683F8/30;
          border-radius: 20px; color: #1683F8; font-size: 11px; font-weight: 700;
          cursor: pointer; transition: background 0.2s;
          font-family: 'Inter', sans-serif; white-space: nowrap; z-index: 10;
        }
        .rydeon-dir-btn:hover { background: #1683F8; color: #fff; }
        .rydeon-dir-icon { width: 13px; height: 13px; }
        .str-chat__channel-list-messenger__main > button,
        .str-chat__load-more-button {
          background: #EEF7FF !important; color: #1683F8 !important;
          border: 1px solid #DCE5F0 !important; border-radius: 10px !important;
          font-family: 'Inter', sans-serif !important; font-size: 12px !important;
          font-weight: 700 !important; margin: 8px 12px !important;
          width: calc(100% - 24px) !important; padding: 8px !important; transition: background 0.2s !important;
        }
        .str-chat__load-more-button:hover { background: #1683F8 !important; color: #fff !important; }
        .rydeon-channel-list-wrap::-webkit-scrollbar,
        .str-chat__message-list::-webkit-scrollbar { width: 4px; }
        .rydeon-channel-list-wrap::-webkit-scrollbar-track,
        .str-chat__message-list::-webkit-scrollbar-track { background: transparent; }
        .rydeon-channel-list-wrap::-webkit-scrollbar-thumb,
        .str-chat__message-list::-webkit-scrollbar-thumb { background: #DCE5F0; border-radius: 4px; }
      `}</style>
    </>
  );
}