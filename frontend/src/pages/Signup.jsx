import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginWithGoogle, logout } from '../services/firebase';
import { db } from '../services/firebase';
import { doc, getDoc } from 'firebase/firestore';
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
      <div className="card w-full max-w-sm p-8 md:p-10 text-center relative overflow-hidden bg-white border border-slate-200 shadow-xl">
        <div className="flex justify-center mb-4">
          <img src="/logo.png" alt="Rydeon Logo" className="h-12 w-12 object-contain" />
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-950 mb-2 tracking-tight">Join Rydeon</h1>
        <p className="text-slate-500 mb-6 text-xs">Sign up securely using your university credentials.</p>

        <button
          onClick={handleGoogleAuth}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-slate-950 text-white font-bold rounded-xl hover:bg-slate-800 transition text-xs shadow-md"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-[18px] h-[18px]" alt="Google logo" />
          {loading ? 'Authenticating...' : 'Sign up with Google'}
        </button>

        <p className="text-[11px] text-teal-700 mt-4 mb-1 font-bold">Only @pcu.edu.in emails are permitted.</p>

        <div className="mt-8 pt-6 border-t border-slate-100">
          <p className="text-xs text-slate-500 font-semibold flex items-center justify-center gap-1">
            Already a member? <Link to="/login" className="text-teal-700 font-bold hover:underline">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
