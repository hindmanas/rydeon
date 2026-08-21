import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './services/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CreateRide from './pages/CreateRide';
import Dashboard from './pages/Dashboard';
import GlobalChatWidget from './components/GlobalChatWidget';
import Onboarding from './pages/Onboarding';
import Profile from './pages/Profile';

// Wrapper to enforce onboarding globally on authenticated routes
const RequireOnboarding = ({ user, children }) => {
  const [isOnboarded, setIsOnboarded] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const checkOnboarding = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (isMounted) {
          setIsOnboarded(userDoc.exists() && userDoc.data().onboarded === true);
        }
      } catch (err) {
        console.error("Failed to fetch onboarding status", err);
        if (isMounted) setIsOnboarded(false);
      }
    };
    checkOnboarding();
    return () => { isMounted = false; };
  }, [user]);

  if (isOnboarded === null) {
     return <div className="flex h-screen items-center justify-center text-brand-400 font-medium">Verifying profile...</div>;
  }

  if (!isOnboarded) {
      return <Navigate to="/onboarding" replace />;
  }

  return children;
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="flex h-screen items-center justify-center text-white">Loading...</div>;
  }

  return (
    <>
      <Toaster position="top-right" toastOptions={{
        className: 'bg-white border border-slate-200 text-slate-950 font-medium shadow-xl',
        style: {
          background: '#ffffff',
          color: '#0f172a',
          borderRadius: '16px',
        },
      }} />
      {/* Hide Navbar during explicit onboarding so they don't jump around */}
      {user && <Routes><Route path="/onboarding" element={null} /> <Route path="*" element={<Navbar user={user} />} /></Routes>}
      
      {/* Hide Chat during onboarding */}
      {user && <Routes><Route path="/onboarding" element={null} /> <Route path="*" element={<GlobalChatWidget user={user} />} /></Routes>}

      <Routes>
        <Route path="/" element={user ? (
          <div className="container mx-auto w-full px-4 py-6 relative z-10 sm:py-8">
            <RequireOnboarding user={user}><Home user={user} /></RequireOnboarding>
          </div>
        ) : <Landing />} />
        
        <Route path="/login" element={
          <div className="container mx-auto w-full px-4 py-6 relative z-10 sm:py-8">
            {user ? <Navigate to="/" /> : <Login />}
          </div>
        } />
        <Route path="/signup" element={
          <div className="container mx-auto w-full px-4 py-6 relative z-10 sm:py-8">
            {user ? <Navigate to="/" /> : <Signup />}
          </div>
        } />
        <Route path="/onboarding" element={
          <div className="container mx-auto w-full px-4 py-6 relative z-10 sm:py-8">
            {user ? <Onboarding user={user} /> : <Navigate to="/login" />}
          </div>
        } />
        
        <Route path="/create" element={
          <div className="container mx-auto w-full px-4 py-6 relative z-10 sm:py-8">
            {user ? <RequireOnboarding user={user}><CreateRide user={user} /></RequireOnboarding> : <Navigate to="/login" />}
          </div>
        } />
        <Route path="/dashboard" element={
          <div className="container mx-auto w-full px-4 py-6 relative z-10 sm:py-8">
            {user ? <RequireOnboarding user={user}><Dashboard user={user} /></RequireOnboarding> : <Navigate to="/login" />}
          </div>
        } />
        <Route path="/profile" element={
          <div className="container mx-auto w-full px-4 py-6 relative z-10 sm:py-8">
            {user ? <RequireOnboarding user={user}><Profile user={user} /></RequireOnboarding> : <Navigate to="/login" />}
          </div>
        } />
      </Routes>
    </>
  );
}

export default App;
