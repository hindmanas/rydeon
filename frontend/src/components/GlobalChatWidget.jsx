import React, { useEffect, useState } from 'react';
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

const apiKey = import.meta.env.VITE_STREAM_API_KEY;

import MapModal from './MapModal';
import { useChannelStateContext } from 'stream-chat-react';

const CustomHeader = () => {
    const { channel } = useChannelStateContext();
    const [showMap, setShowMap] = useState(false);
    const pickup = channel?.data?.pickup;
    const dropoff = channel?.data?.dropoff;

    return (
        <div className="relative">
            <ChannelHeader />
            {pickup && dropoff && (
                <button 
                  onClick={() => setShowMap(true)}
                  className="absolute right-[4.5rem] top-1/2 -translate-y-1/2 text-xs bg-brand-500 hover:bg-brand-400 text-white px-2 py-1 md:text-sm md:px-3 md:py-1.5 rounded-full flex items-center gap-1 transition"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    <span className="hidden md:inline">Directions</span>
                </button>
            )}
            {showMap && <MapModal pickup={pickup} dropoff={dropoff} onClose={() => setShowMap(false)} />}
        </div>
    );
};

export default function GlobalChatWidget({ user }) {
  const [chatClient, setChatClient] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [activeChannel, setActiveChannel] = useState(null);
  
  // Use ref for real-time listener access
  const isOpenRef = React.useRef(isOpen);
  useEffect(() => {
     isOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    const handleOpen = async (e) => {
      setIsOpen(true);
      if (e.detail?.channelId && chatClient) {
          try {
              // Exclusively provide type and channelId to securely fetch existing channels without overwriting permissions locally
              const c = chatClient.channel('messaging', e.detail.channelId);
              await c.watch();
              setActiveChannel(c);
          } catch(err) {
              console.error("Failed to watch explicit channel", err);
          }
      }
    };
    window.addEventListener('openchat', handleOpen);
    return () => window.removeEventListener('openchat', handleOpen);
  }, [chatClient, user]);

  useEffect(() => {
    if (!user || !apiKey) return;
    let client = null;
    let mounted = true;

    const initChat = async () => {
      try {
        client = StreamChat.getInstance(apiKey);
        
        // Fetch token securely from our backend
        const res = await fetch(`https://rydeon-backend-xdbl.onrender.com/api/chat/token/${user.uid}`);
        if (!res.ok) {
           throw new Error('Failed to fetch chat token');
        }
        const data = await res.json();

        // Connect user
        await client.connectUser(
          {
            id: user.uid,
            name: user.displayName || user.email?.split('@')[0] || 'User',
            image: `https://ui-avatars.com/api/?name=${user.displayName || 'User'}`
          },
          data.token
        );
        
        if (mounted) {
            setChatClient(client);
        }

        // Setup real-time listeners for toasts and badges
        client.on('message.new', (e) => {
            if (e.message.user.id !== user.uid) {
                setHasUnread(true);
                if (!isOpenRef.current) {  // Only toast if window isn't currently open
                    toast.success(`New message from ${e.message.user.name}`);
                }
            }
        });

        client.on('notification.added_to_channel', (e) => {
             setHasUnread(true);
             toast('A new Ride Chat was started!', { icon: '💬' });
        });

      } catch (err) {
        console.error('Error connecting to chat:', err);
      }
    };

    initChat();

    return () => {
      mounted = false;
      if (client) {
         client.disconnectUser();
      }
    };
  }, [user]);

  // If chat is not explicitly ready, don't mount the DOM
  if (!chatClient) return null;

  // Filter for channels where this user is explicitly a member
  const filters = { members: { $in: [user.uid] } };
  const sort = { last_message_at: -1 };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
        {/* Chat Window */}
        {isOpen && (
            <div className="mb-4 bg-slate-900 border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl w-[90vw] md:w-[600px] h-[75vh] md:h-[600px] flex flex-row str-chat__theme-dark animate-fade-in-up origin-bottom-right">
                <Chat client={chatClient}>
                    <div className="w-1/3 border-r border-slate-800 bg-slate-900 overflow-y-auto">
                        <ChannelList 
                            filters={filters} 
                            sort={sort} 
                            onSelect={(c) => setActiveChannel(c)}
                        />
                    </div>
                    <div className="w-2/3 bg-slate-900 flex flex-col relative z-0">
                        {activeChannel ? (
                            <Channel channel={activeChannel}>
                                <Window>
                                    <CustomHeader />
                                    <MessageList />
                                    <MessageInput focus />
                                </Window>
                            </Channel>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
                                <svg className="w-16 h-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                <span>Select a ride chat to start messaging!</span>
                            </div>
                        )}
                    </div>
                </Chat>
            </div>
        )}
        
        {/* Floating Bubble */}
        <button 
           onClick={() => { setIsOpen(!isOpen); setHasUnread(false); }}
           className={`p-4 rounded-full shadow-lg transition-all hover:scale-105 active:scale-95 text-white ${isOpen ? 'bg-slate-700' : 'bg-brand-500'} relative`}
        >
           {isOpen ? (
               <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
               </svg>
           ) : (
               <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
               </svg>
           )}
           {hasUnread && !isOpen && (
               <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 border-2 border-slate-900 rounded-full animate-pulse"></span>
           )}
        </button>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
           /* Minimal CSS overrides to blend Stream's dark theme perfectly with Rydeon's slate tones */
           .str-chat__theme-dark {
               --str-chat__background-color: transparent !important;
               --str-chat__surface-color: #0f172a !important; /* Slightly darker than 800 */
               --str-chat__primary-color: #14b8a6 !important;
               --str-chat__secondary-color: #4f46e5 !important;
               --str-chat__secondary-surface-color: #1e293b !important;
           }
           .str-chat__channel { background: transparent; }
           .str-chat__channel-list { background-color: transparent !important; }
           .str-chat__header-livestream { background-color: #0f172a !important; border-bottom: 1px solid #1e293b; }
           /* Tick indicator overrides */
           .str-chat__message-simple-status-delivery { color: var(--str-chat__primary-color) !important; }
      `}} />
    </>
  );
}
