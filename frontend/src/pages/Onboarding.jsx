import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db, updateUserPassword } from '../services/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

function Onboarding({ user }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: user?.displayName || '',
    mobile: '',
    gender: 'male',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  // If somehow they arrive here but already have the correct properties, navigate away
  useEffect(() => {
    const verifyNeed = async () => {
      if (!user) {
         navigate('/login');
         return;
      }
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
           const data = userDoc.data();
           if (data.onboarded) {
              navigate('/dashboard');
              return;
           }
           // Pre-fill if partial data exists
           setFormData(prev => ({
              ...prev,
              fullName: data.fullName || prev.fullName,
              mobile: data.mobile || prev.mobile,
              gender: data.gender || prev.gender
           }));
        }
      } catch (err) {
        console.error("Error checking onboarding status", err);
      } finally {
        setChecking(false);
      }
    };
    verifyNeed();
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.mobile) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    if (formData.password) {
      if (formData.password.length < 6) {
        toast.error('Password should be at least 6 characters.');
        setLoading(false);
        return;
      }
      try {
        await updateUserPassword(auth.currentUser, formData.password);
      } catch (err) {
        console.error("Error setting password", err);
        toast.error('Failed to set password: ' + (err.message || 'unknown error'));
        setLoading(false);
        return;
      }
    }

    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        fullName: formData.fullName,
        email: user.email,
        mobile: formData.mobile,
        gender: formData.gender,
        onboarded: true,
        createdAt: new Date()
      }, { merge: true });

      toast.success('Welcome to Rydeon!');
      navigate('/dashboard');
    } catch (err) {
      toast.error('Failed to save profile details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (checking) return <div className="text-center py-20 text-brand-400">Loading your profile...</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] py-8 px-4 md:px-8">
      <div className="card w-full max-w-md relative overflow-hidden">
        {/* Neon accent top border */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-brand-400 via-emerald-500 to-teal-500"></div>
        
        <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-2 mt-2 text-center tracking-tight">Complete Profile</h1>
        <p className="text-slate-400 mb-8 text-sm text-center">Just a few more details to get you riding.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">College Email</label>
            <input 
              type="text" 
              value={user?.email || ''} 
              disabled 
              className="input-field py-2.5 md:py-3 bg-white/5 opacity-70 cursor-not-allowed" 
            />
            <p className="text-xs text-brand-500/80 mt-1.5 font-medium ml-1">Synced with Google. Cannot be changed.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
            <input 
              type="text" 
              name="fullName"
              value={formData.fullName} 
              onChange={handleChange}
              placeholder="e.g. Alex Johnson"
              className="input-field py-2.5 md:py-3" 
              required
            />
          </div>

          <div>
             <label className="block text-sm font-medium text-slate-300 mb-1.5">Mobile Number</label>
             <input 
               type="tel" 
               name="mobile"
               value={formData.mobile} 
               onChange={handleChange}
               placeholder="+91 9876543210"
               className="input-field py-2.5 md:py-3" 
               required
             />
          </div>

          <div>
             <label className="block text-sm font-medium text-slate-300 mb-1.5">Gender <span className="text-xs text-slate-500 font-normal ml-1">(Cannot be changed later)</span></label>
             <select 
               name="gender"
               value={formData.gender} 
               onChange={handleChange}
               className="input-field py-2.5 md:py-3"
               required
             >
               <option value="male">Male</option>
               <option value="female">Female</option>
               <option value="other">Other</option>
             </select>
          </div>

          <div className="pt-2 border-t border-white/5">
            <h3 className="text-sm font-semibold text-slate-300 mb-3">Optional: Set Password</h3>
            <p className="text-xs text-slate-400 mb-4">Set a password to login with your email if you can't use Google Auth on another device.</p>
            
            <div className="space-y-4">
              <div className="relative">
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    name="password"
                    value={formData.password} 
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="input-field py-2.5 md:py-3 pl-4 pr-10" 
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
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full btn-primary mt-4"
          >
            {loading ? 'Saving...' : 'Finish Onboarding'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Onboarding;
