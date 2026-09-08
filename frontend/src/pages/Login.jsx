import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginWithGoogle, loginWithEmail, logout, loginWithCustomToken } from '../services/firebase';
import { db } from '../services/firebase';
import { doc, getDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
        // Send them to onboarding
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

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email.endsWith('@pcu.edu.in') && email !== 'teamrydeon@gmail.com') {
      toast.error("Only @pcu.edu.in emails are permitted.");
      return;
    }

    setLoading(true);
    try {
      if (email === 'teamrydeon@gmail.com' && password === '12345678') {
        const rawBase = import.meta.env.VITE_API_BASE || 'https://rydeon-backend-xdbl.onrender.com/api';
        const API_BASE = typeof rawBase === 'string' ? rawBase.trim().replace(/^['"]|['"]$/g, '') : rawBase;
        
        try {
          const response = await fetch(`${API_BASE}/rides/demo-login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          });
          if (response.ok) {
            const { token } = await response.json();
            await loginWithCustomToken(token);
            toast.success("Login successful!");
            navigate('/');
            return;
          } else {
            // Try fallback without /rides subpath in case routing changes
            const fallbackRes = await fetch(`${API_BASE}/demo-login`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, password })
            });
            if (fallbackRes.ok) {
              const { token } = await fallbackRes.json();
              await loginWithCustomToken(token);
              toast.success("Login successful!");
              navigate('/');
              return;
            } else {
              const errData = await fallbackRes.json();
              throw new Error(errData.error || 'Failed to authenticate');
            }
          }
        } catch (fetchErr) {
          console.warn("Custom token login fetch failed. Trying direct email login fallback...", fetchErr);
        }
      }

      const result = await loginWithEmail(email, password);
      const user = result.user;

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

      toast.success("Login successful!");
    } catch (error) {
      console.error("Email login failed:", error);
      let errorMessage = "Failed to sign in. Please check your credentials.";
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') errorMessage = "Account not found. Please sign up with Google first.";
      if (error.code === 'auth/wrong-password') errorMessage = "Incorrect password.";
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

        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-950 mb-2 tracking-tight">Welcome Back</h1>
        <p className="text-slate-500 mb-6 text-xs">Sign in to Rydeon using your university credentials.</p>

        <form onSubmit={handleEmailLogin} className="space-y-4 mb-6">
          <div className="text-left">
            <label className="block text-xs font-bold text-slate-700 mb-1 ml-1">University Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="id@pcu.edu.in"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:bg-white focus:outline-none focus:border-slate-950 transition"
              required
            />
          </div>

          <div className="text-left relative">
            <label className="block text-xs font-bold text-slate-700 mb-1 ml-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:bg-white focus:outline-none focus:border-slate-950 transition pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-950"
              >
                {showPassword ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-950 hover:bg-slate-800 text-white font-bold py-3 rounded-xl text-xs shadow transition mt-2"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <div className="relative flex items-center py-2 mb-4">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink-0 mx-4 text-slate-400 text-xs font-semibold">or continue with</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        <button
          onClick={handleGoogleAuth}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white border border-slate-200 text-slate-800 font-bold rounded-xl hover:bg-slate-50 transition text-xs shadow-sm"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-[18px] h-[18px]" alt="Google logo" />
          {loading ? 'Authenticating...' : 'Sign in with Google'}
        </button>

        <div className="mt-6 pt-4 border-t border-slate-100">
          <p className="text-xs text-slate-500 font-semibold flex items-center justify-center gap-1">
            New here? <Link to="/signup" className="text-teal-700 font-bold hover:underline">Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
