import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db, updateUserPassword } from '../services/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import toast from 'react-hot-toast';

function Profile({ user }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    gender: '', // Read-only once fetched
    photoURL: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
           const data = userDoc.data();
           setFormData({
              fullName: data.fullName || user.displayName || '',
              mobile: data.mobile || '',
              gender: data.gender || 'male',
              photoURL: user.photoURL || ''
           });
        }
      } catch (err) {
        console.error("Error fetching profile", err);
        toast.error("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (formData.newPassword) {
      if (formData.newPassword.length < 6) {
        toast.error('New password must be at least 6 characters.');
        return;
      }
      if (formData.newPassword !== formData.confirmNewPassword) {
        toast.error('New passwords do not match.');
        return;
      }
    }

    setSaving(true);
    try {
      // Update Firebase Auth Profile
      await updateProfile(user, {
         displayName: formData.fullName,
         photoURL: formData.photoURL
      });

      if (formData.newPassword) {
        try {
          await updateUserPassword(auth.currentUser, formData.newPassword);
          toast.success("Password updated successfully!");
          setFormData(prev => ({...prev, newPassword: '', confirmNewPassword: ''}));
        } catch (pwErr) {
           console.error(pwErr);
           if (pwErr.code === 'auth/requires-recent-login') {
             toast.error('Please log out and log back in to change your password.');
           } else {
             toast.error('Failed to update password.');
           }
        }
      }

      // Update Firestore (Do not update email or gender intentionally to lock them)
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        fullName: formData.fullName,
        mobile: formData.mobile
      }, { merge: true });

      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error('Failed to update profile.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-brand-400">Loading your settings...</div>;

  return (
    <div className="flex flex-col items-center min-h-[80vh] py-8 px-4 md:px-8">
      <div className="w-full max-w-2xl fade-in">
        
        {/* Header Section */}
        <div className="mb-8 flex items-center justify-between border-b border-white/5 pb-4">
           <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Your Profile</h1>
              <p className="text-slate-400 text-sm mt-1">Manage your public information and account settings.</p>
           </div>
           <button 
             onClick={() => navigate('/dashboard')}
             className="p-2.5 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all hover:scale-105 active:scale-95 border border-white/10"
           >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
           </button>
        </div>

        {/* Profile Card */}
        <div className="card w-full relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-brand-400 to-teal-500"></div>
          
          <div className="flex flex-col sm:flex-row gap-8 mb-8 items-center sm:items-start border-b border-white/5 pb-8">
             <div className="relative group">
               <img 
                 src={formData.photoURL || `https://ui-avatars.com/api/?name=${formData.fullName || 'User'}&background=10b981&color=fff&size=150`} 
                 alt="Profile" 
                 className="w-32 h-32 rounded-full border-4 border-black shadow-[0_0_20px_rgba(16,185,129,0.3)] object-cover bg-neutral-900"
               />
             </div>
             <div className="flex-1 w-full text-center sm:text-left">
               <label className="block text-sm font-medium text-slate-300 mb-1.5">Profile Picture URL</label>
               <input 
                 type="url" 
                 name="photoURL"
                 value={formData.photoURL} 
                 onChange={handleChange}
                 placeholder="https://example.com/my-photo.jpg"
                 className="input-field py-2.5" 
               />
               <p className="text-xs text-slate-500 mt-2">Provide a direct link to your image.</p>
             </div>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
                  <input 
                    type="text" 
                    name="fullName"
                    value={formData.fullName} 
                    onChange={handleChange}
                    className="input-field py-2.5" 
                    required
                  />
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">College Email</label>
                  <input 
                    type="text" 
                    value={user?.email || ''} 
                    disabled 
                    className="input-field py-2.5 bg-white/5 opacity-70 cursor-not-allowed" 
                  />
               </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Mobile Number</label>
                  <input 
                    type="tel" 
                    name="mobile"
                    value={formData.mobile} 
                    onChange={handleChange}
                    placeholder="+91 9876543210"
                    className="input-field py-2.5" 
                    required
                  />
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5 flex items-center justify-between">
                    Gender 
                    <span className="text-[10px] text-brand-400 font-bold uppercase tracking-wider bg-brand-500/10 px-2 py-0.5 rounded-full">Locked</span>
                  </label>
                  <input 
                    type="text" 
                    value={formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1)} 
                    disabled 
                    className="input-field py-2.5 bg-white/5 opacity-70 cursor-not-allowed font-medium text-slate-300" 
                  />
               </div>
            </div>

             <div className="pt-4 border-t border-white/5">
                <h3 className="text-sm font-semibold text-slate-300 mb-4">Security Settings</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                   <div className="relative">
                      <label className="block text-sm font-medium text-slate-300 mb-1.5">New Password</label>
                      <div className="relative">
                        <input 
                          type={showPassword ? "text" : "password"} 
                          name="newPassword"
                          value={formData.newPassword} 
                          onChange={handleChange}
                          placeholder="Leave blank to keep current"
                          className="input-field py-2.5 pl-4 pr-10" 
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
                   <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1.5">Confirm New Password</label>
                      <input 
                        type="password" 
                        name="confirmNewPassword"
                        value={formData.confirmNewPassword} 
                        onChange={handleChange}
                        placeholder="Confirm new password"
                        className="input-field py-2.5" 
                      />
                   </div>
                </div>
             </div>
             
            <div className="pt-4">
               <button 
                 type="submit" 
                 disabled={saving}
                 className="w-full sm:w-auto px-10 btn-primary"
               >
                 {saving ? 'Saving Changes...' : 'Save Profile Settings'}
               </button>
            </div>
          </form>
          
        </div>
      </div>
    </div>
  );
}

export default Profile;
