import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginWithGoogle, logout } from '../services/firebase';
import { db } from '../services/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

function Signup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      const result = await loginWithGoogle();
      const user = result.user;

      if (!user.email.endsWith('@pcu.edu.in') && user.email !== 'teamrydeon@gmail.com') {
        await logout();
        toast.error("Please sign in with your college email account (@pcu.edu.in).");
        return;
      }

      // Check if firestore doc exists
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (!userDocSnap.exists()) {
        // Send them to onboarding without pushing empty strings here
        navigate('/onboarding');
      } else {
        const data = userDocSnap.data();
        if (data.onboarded) {
          navigate('/dashboard');
        } else {
          navigate('/onboarding');
        }
      }

      toast.success("Authentication successful!");
    } catch (error) {
      console.error("Auth failed:", error);
      let errorMessage = "Failed to sign in. Please try again.";
      if (error.code === 'auth/popup-closed-by-user') errorMessage = "Auth popup was closed before completion.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] py-8 px-4 md:px-8">
      <div className="card w-full max-w-sm p-8 md:p-10 text-center relative overflow-hidden">
        {/* Neon accent top border */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-brand-400 via-emerald-500 to-teal-500"></div>

        <div className="w-16 h-16 bg-brand-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-brand-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)] text-brand-400">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-2 tracking-tight">Join Rydeon</h1>
        <p className="text-slate-400 mb-8 text-sm">Sign up securely using your university credentials.</p>

        <button
          onClick={handleGoogleAuth}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white/5 border border-white/10 text-slate-200 font-semibold rounded-2xl hover:bg-white/10 focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-brand-500 active:scale-[0.98] transition-all duration-200 shadow-sm hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-[22px] h-[22px]" alt="Google logo" />
          {loading ? 'Authenticating...' : 'Sign up with Google'}
        </button>

        <p className="text-sm text-brand-500/70 mt-5 mb-1 font-medium italic">Only @pcu.edu.in emails are permitted.</p>

        <div className="mt-8 pt-6 border-t border-white/5">
          <p className="text-sm text-slate-400 transition flex items-center justify-center gap-2">
            Already a member? <Link to="/login" className="text-brand-400 font-semibold hover:text-brand-300 transition-colors">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
