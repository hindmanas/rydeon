import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { StreamChat } from 'stream-chat';
import {
  Chat,
  Channel,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from 'stream-chat-react';
import 'stream-chat-react/dist/css/v2/index.css';
import MapModal from '../components/MapModal';

const apiKey = import.meta.env.VITE_STREAM_API_KEY;

export default function ChatPage({ user }) {
  const { channelId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [error, setError] = useState('');

  // Other user's details passed from RideCard link state
  const otherUser = location.state?.otherUser;

  useEffect(() => {
    if (!user) return;

    if (!apiKey) {
      setError('Stream API key is missing. Please add VITE_STREAM_API_KEY to your .env file.');
      return;
    }

    let client = null;

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

        // Define channel members if available to allow auto-creation by stream backend
        const streamOptions = {
          name: otherUser ? `Chat with ${otherUser.name}` : `Ride Chat`,
        };

        if (otherUser?.id) {
          streamOptions.members = [user.uid, otherUser.id];
        }

        const activeChannel = client.channel('messaging', channelId, streamOptions);

        await activeChannel.watch();

        setChannel(activeChannel);
        setChatClient(client);
      } catch (err) {
        console.error('Error connecting to chat:', err);
        setError('Failed to securely connect. Please check credentials or try again later.');
      }
    };

    initChat();

    return () => {
      if (client) {
        // Disconnect to gracefully handle memory and connections
        client.disconnectUser();
      }
    };
  }, [user, channelId, otherUser]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center text-white min-h-[60vh] fade-in">
        <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-2">Notice</h2>
        <p className="text-slate-400 mb-6">{error}</p>
        <button onClick={() => navigate(-1)} className="btn-primary">Go Back</button>
      </div>
    );
  }

  if (!chatClient || !channel) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] fade-in">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mb-4 shadow-[0_0_15px_rgba(20,184,166,0.3)]"></div>
        <p className="text-slate-400">Connecting to secure chat...</p>
      </div>
    );
  }

  const [showMap, setShowMap] = useState(false);
  const pickup = channel?.data?.pickup;
  const dropoff = channel?.data?.dropoff;

  return (
    <div className="fade-in bg-slate-900 border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl h-[70vh] flex flex-col mt-6 relative">
      <div className="p-4 border-b border-slate-700/50 flex items-center justify-between bg-slate-800/80 backdrop-blur-md relative z-[100]">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2.5 bg-slate-700/50 hover:bg-slate-700 rounded-full text-white transition-all hover:scale-105 active:scale-95 border border-slate-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h2 className="text-xl font-bold text-white">
              {otherUser ? `Chat with ${otherUser.name}` : 'Ride Chat'}
            </h2>
            <p className="text-xs text-brand-400 font-medium">Secured by Stream Chat</p>
          </div>
        </div>
        {pickup && dropoff && (
          <button
            onClick={() => setShowMap(true)}
            className="bg-brand-500 hover:bg-brand-400 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition font-medium"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            Get Directions
          </button>
        )}
      </div>

      <div className="flex-1 overflow-hidden relative z-[1] chat-container-override">
        <Chat client={chatClient} theme="str-chat__theme-dark">
          <Channel channel={channel}>
            <Window>
              <MessageList />
              <MessageInput focus />
            </Window>
            <Thread />
          </Channel>
        </Chat>
      </div>

      {showMap && <MapModal pickup={pickup} dropoff={dropoff} onClose={() => setShowMap(false)} />}

      <style dangerouslySetInnerHTML={{
        __html: `
           /* Minimal CSS overrides to blend Stream's dark theme perfectly with Rydeon's slate tones */
           .str-chat__theme-dark {
               --str-chat__background-color: transparent !important;
               --str-chat__surface-color: #1e293b !important;
               --str-chat__primary-color: #14b8a6 !important;
               --str-chat__secondary-color: #4f46e5 !important;
           }
           .str-chat__message-list {
               background-color: transparent !important;
           }
           .chat-container-override .str-chat {
               height: 100%;
               background: transparent;
           }
       `}} />
    </div>
  );
}
