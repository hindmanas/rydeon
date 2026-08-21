import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginWithGoogle, loginWithEmail, logout } from '../services/firebase';
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
      <div className="card w-full max-w-sm p-8 md:p-10 text-center relative overflow-hidden">
        {/* Neon accent top border */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-brand-400 via-emerald-500 to-teal-500"></div>

        <div className="w-16 h-16 bg-brand-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-brand-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)] text-brand-400">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
          </svg>
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-2 tracking-tight">Welcome Back</h1>
        <p className="text-slate-400 mb-6 text-sm">Sign in to Rydeon using your university credentials.</p>

        <form onSubmit={handleEmailLogin} className="space-y-4 mb-6">
          <div className="text-left">
            <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">University Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="id@pcu.edu.in"
              className="input-field py-3 px-4 w-full bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-brand-500 outline-none transition"
              required
            />
          </div>

          <div className="text-left relative">
            <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field py-3 pl-4 pr-10 w-full bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-brand-500 outline-none transition"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3.5 mt-2"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <div className="relative flex items-center py-2 mb-4">
          <div className="flex-grow border-t border-white/10"></div>
          <span className="flex-shrink-0 mx-4 text-slate-500 text-sm">or continue with</span>
          <div className="flex-grow border-t border-white/10"></div>
        </div>

        <button
          onClick={handleGoogleAuth}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-white/5 border border-white/10 text-slate-200 font-semibold rounded-2xl hover:bg-white/10 focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-brand-500 active:scale-[0.98] transition-all duration-200 shadow-sm hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-[20px] h-[20px]" alt="Google logo" />
          {loading ? 'Authenticating...' : 'Sign in with Google'}
        </button>

        <div className="mt-8 pt-6 border-t border-white/5">
          <p className="text-sm text-slate-400 transition flex items-center justify-center gap-2">
            New here? <Link to="/signup" className="text-brand-400 font-semibold hover:text-brand-300 transition-colors">Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
