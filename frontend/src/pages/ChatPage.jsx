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

        const res = await fetch(`https://rydeon-backend-xdbl.onrender.com/api/chat/token/${user.uid}`);
        if (!res.ok) {
          throw new Error('Failed to fetch chat token');
        }
        const data = await res.json();

        await client.connectUser(
          {
            id: user.uid,
            name: user.displayName || user.email?.split('@')[0] || 'User',
            image: `https://ui-avatars.com/api/?name=${user.displayName || 'User'}&background=1683F8&color=fff`
          },
          data.token
        );

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
        client.disconnectUser();
      }
    };
  }, [user, channelId, otherUser]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center text-[#101D3A] min-h-[60vh] fade-in">
        <div className="w-16 h-16 rounded-full bg-[#E5484D]/10 text-[#E5484D] flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-2">Notice</h2>
        <p className="text-[#65728A] mb-6">{error}</p>
        <button onClick={() => navigate(-1)} className="btn-primary">Go Back</button>
      </div>
    );
  }

  if (!chatClient || !channel) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] fade-in">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1683F8] mb-4"></div>
        <p className="text-[#65728A] font-semibold text-xs">Connecting to secure Ride Chat...</p>
      </div>
    );
  }

  const [showMap, setShowMap] = useState(false);
  const pickup = channel?.data?.pickup;
  const dropoff = channel?.data?.dropoff;

  return (
    <div className="fade-in bg-white border border-[#DCE5F0] rounded-3xl overflow-hidden shadow-sm h-[75vh] flex flex-col my-6 relative">
      <div className="p-4 border-b border-[#DCE5F0] flex items-center justify-between bg-white backdrop-blur-md relative z-[100]">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 bg-[#F7FAFE] hover:bg-[#EEF7FF] rounded-xl text-[#101D3A] transition-all border border-[#DCE5F0]">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h2 className="text-lg font-black text-[#101D3A]">
              {otherUser ? `← Chat with ${otherUser.name}` : '← Ride Chat'}
            </h2>
            <p className="text-xs text-[#1683F8] font-bold">Secured Student Chat</p>
          </div>
        </div>
        {pickup && dropoff && (
          <button
            onClick={() => setShowMap(true)}
            className="btn-primary py-2 px-3 text-xs"
          >
            Get Directions
          </button>
        )}
      </div>

      <div className="flex-1 overflow-hidden relative z-[1] chat-container-override bg-[#F7FAFE]">
        <Chat client={chatClient} theme="str-chat__theme-light">
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
           /* CSS overrides for Rydeon Blue & White theme */
           .str-chat__theme-light {
               --str-chat__background-color: transparent !important;
               --str-chat__surface-color: #ffffff !important;
               --str-chat__primary-color: #1683F8 !important;
               --str-chat__secondary-color: #101D3A !important;
               --str-chat__text-color: #101D3A !important;
               --str-chat__text-low-emphasis-color: #65728A !important;
               --str-chat__border-color: #DCE5F0 !important;
               font-family: 'Inter', sans-serif !important;
           }
           .str-chat__message--me .str-chat__message-bubble {
               background-color: #1683F8 !important;
               color: #ffffff !important;
               border-radius: 16px !important;
           }
           .str-chat__message--other .str-chat__message-bubble {
               background-color: #EEF7FF !important;
               color: #101D3A !important;
               border: 1px solid #DCE5F0 !important;
               border-radius: 16px !important;
           }
           .str-chat__message-list {
               background-color: #F7FAFE !important;
           }
           .chat-container-override .str-chat {
               height: 100%;
               background: #F7FAFE;
           }
       `}} />
    </div>
  );
}

