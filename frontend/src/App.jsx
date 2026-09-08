import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './services/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import HowItWorks from './pages/HowItWorks';
import Safety from './pages/Safety';
import Hosts from './pages/Hosts';
import Campuses from './pages/Campuses';
import Resources from './pages/Resources';
import About from './pages/About';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CreateRide from './pages/CreateRide';
import Dashboard from './pages/Dashboard';
import GlobalChatWidget from './components/GlobalChatWidget';
import Onboarding from './pages/Onboarding';
import Profile from './pages/Profile';

// Wrapper to enforce onboarding globally on authenticated routes
const RequireOnboarding = ({ isOnboarded, children }) => {
  if (isOnboarded === null) {
     return <div className="flex h-screen items-center justify-center text-teal-600 font-medium">Verifying profile...</div>;
  }

  if (!isOnboarded) {
      return <Navigate to="/onboarding" replace />;
  }

  return children;
};

// Helper component to conditionally render Header/Navbar except on onboarding
function MainHeader({ user }) {
  const location = useLocation();
  if (location.pathname === '/onboarding') {
    return null;
  }
  return <Navbar user={user} />;
}

function App() {
  const [user, setUser] = useState(null);
  const [isOnboarded, setIsOnboarded] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const timer = setTimeout(() => {
      if (isMounted) setLoading(false);
    }, 3500);

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!isMounted) return;
      setUser(currentUser);
      if (currentUser) {
        try {
          const userRef = doc(db, 'users', currentUser.uid);
          const userDoc = await getDoc(userRef);
          if (currentUser.uid === 'demo-user-teamrydeon' && !userDoc.exists()) {
            await setDoc(userRef, {
              fullName: 'Team Rydeon',
              email: currentUser.email,
              gender: 'male',
              mobile: '+91 9999999999',
              onboarded: true,
              createdAt: new Date().toISOString()
            });
            if (isMounted) setIsOnboarded(true);
          } else {
            if (isMounted) setIsOnboarded(userDoc.exists() && userDoc.data().onboarded === true);
          }
        } catch (err) {
          console.error("Failed to fetch onboarding status", err);
          if (isMounted) setIsOnboarded(false);
        }
      } else {
        if (isMounted) setIsOnboarded(null);
      }
      if (isMounted) setLoading(false);
      clearTimeout(timer);
    });

    return () => {
      isMounted = false;
      clearTimeout(timer);
      unsubscribe();
    };
  }, []);

  if (loading) {
    return <div className="flex h-screen items-center justify-center text-slate-900 font-bold">Loading Rydeon...</div>;
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

      {/* Global Scroll-Responsive Header for all pages (except onboarding) */}
      <MainHeader user={user} />

      {/* Global Chat Widget for authenticated users */}
      {user && (
        <Routes>
          <Route path="/onboarding" element={null} />
          <Route path="*" element={<GlobalChatWidget user={user} />} />
        </Routes>
      )}

      <Routes>
        {/* PUBLIC MARKETING & PRODUCT PAGES */}
        <Route path="/" element={user ? (
          <div className="container mx-auto w-full px-4 py-6 relative z-10 sm:py-8">
            <RequireOnboarding isOnboarded={isOnboarded}><Home user={user} /></RequireOnboarding>
          </div>
        ) : <Landing />} />
        
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/safety" element={<Safety />} />
        <Route path="/hosts" element={<Hosts />} />
        <Route path="/campuses" element={<Campuses />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/about" element={<About />} />

        {/* ALIAS REDIRECT ROUTES FOR CTAs */}
        <Route path="/find-rides" element={user ? <Navigate to="/" replace /> : <Navigate to="/signup" replace />} />
        <Route path="/offer" element={user ? <Navigate to="/create" replace /> : <Navigate to="/hosts" replace />} />

        {/* AUTHENTICATION & APP ROUTES */}
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
            {user ? <Onboarding user={user} setOnboarded={() => setIsOnboarded(true)} /> : <Navigate to="/login" />}
          </div>
        } />
        
        <Route path="/create" element={
          <div className="container mx-auto w-full px-4 py-6 relative z-10 sm:py-8">
            {user ? <RequireOnboarding isOnboarded={isOnboarded}><CreateRide user={user} /></RequireOnboarding> : <Navigate to="/login" />}
          </div>
        } />
        <Route path="/dashboard" element={
          <div className="container mx-auto w-full px-4 py-6 relative z-10 sm:py-8">
            {user ? <RequireOnboarding isOnboarded={isOnboarded}><Dashboard user={user} /></RequireOnboarding> : <Navigate to="/login" />}
          </div>
        } />
        <Route path="/profile" element={
          <div className="container mx-auto w-full px-4 py-6 relative z-10 sm:py-8">
            {user ? <RequireOnboarding isOnboarded={isOnboarded}><Profile user={user} /></RequireOnboarding> : <Navigate to="/login" />}
          </div>
        } />
      </Routes>
    </>
  );
}

export default App;
