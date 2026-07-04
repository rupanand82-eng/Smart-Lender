import React, { useState, useEffect } from 'react';
import { 
  auth, 
  db, 
  onAuthStateChanged, 
  signOut, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail, 
  updateProfile, 
  signInWithPopup, 
  googleProvider,
  doc, 
  getDoc, 
  setDoc,
  FirebaseUser 
} from './lib/firebase';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage';
import PredictFormView from './components/PredictFormView';
import PredictResultView from './components/PredictResultView';
import DashboardView from './components/DashboardView';
import AdminPanel from './components/AdminPanel';
import FloatingChatbot from './components/FloatingChatbot';
import { 
  Lock, Mail, User, ShieldAlert, Sparkles, LogIn, ChevronRight, Phone, ArrowLeft, Landmark, 
  Brain, ShieldCheck, Cpu, ArrowUpRight, MessageSquareCode, FileDown 
} from 'lucide-react';

export default function App() {
  // Navigation
  const [currentTab, setCurrentTab] = useState('home');
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userRole, setUserRole] = useState<'admin' | 'user'>('user');
  const [loading, setLoading] = useState(true);

  // Selected historic application to view in result
  const [selectedPrediction, setSelectedPrediction] = useState<any | null>(null);

  // Theme
  const [darkMode, setDarkMode] = useState(true);

  // Authentication Modal State
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'login' | 'register' | 'forgot' }>({
    isOpen: false,
    mode: 'login',
  });
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  // Manage body dark class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Firebase Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        setUser(firebaseUser);
        
        // Auto check / set Admin role
        // Instant promotion for evaluating user!
        const evaluatorEmail = "rupanandpalakurthi@gmail.com";
        const isAdminEmail = firebaseUser.email?.toLowerCase() === evaluatorEmail || firebaseUser.email?.toLowerCase().includes('admin');
        const role = isAdminEmail ? 'admin' : 'user';
        setUserRole(role);

        // Sync or create user document in Firestore
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const docSnap = await getDoc(userDocRef);
          if (!docSnap.exists()) {
            await setDoc(userDocRef, {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || 'Borrower Client',
              role: role,
              createdAt: new Date().toISOString(),
            });
          } else {
            // Update role if changed
            await setDoc(userDocRef, { role: role }, { merge: true });
          }
        } catch (err) {
          console.warn('Firestore user metadata sync issue:', err);
        }
      } else {
        setUser(null);
        setUserRole('user');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setCurrentTab('home');
      setSelectedPrediction(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    setAuthSuccess('');

    try {
      if (authModal.mode === 'register') {
        if (!authForm.name.trim()) throw new Error('Please enter your full name.');
        
        // Sign Up
        const userCred = await createUserWithEmailAndPassword(auth, authForm.email, authForm.password);
        
        // Update display name
        await updateProfile(userCred.user, {
          displayName: authForm.name,
        });

        const evaluatorEmail = "rupanandpalakurthi@gmail.com";
        const isAdminEmail = authForm.email.toLowerCase() === evaluatorEmail || authForm.email.toLowerCase().includes('admin');
        const role = isAdminEmail ? 'admin' : 'user';

        // Write to Firestore
        await setDoc(doc(db, 'users', userCred.user.uid), {
          uid: userCred.user.uid,
          email: authForm.email,
          displayName: authForm.name,
          phoneNumber: authForm.phone,
          role: role,
          createdAt: new Date().toISOString(),
        });

        setAuthSuccess('Account registered successfully!');
        setAuthModal({ isOpen: false, mode: 'login' });
      } else if (authModal.mode === 'login') {
        // Sign In
        await signInWithEmailAndPassword(auth, authForm.email, authForm.password);
        setAuthSuccess('Logged in successfully!');
        setAuthModal({ isOpen: false, mode: 'login' });
      } else if (authModal.mode === 'forgot') {
        // Reset Password
        await sendPasswordResetEmail(auth, authForm.email);
        setAuthSuccess('Password reset link sent! Check your inbox.');
      }
    } catch (err: any) {
      console.error(err);
      setAuthError(err.message || 'Authentication error.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthLoading(true);
    setAuthError('');
    try {
      const res = await signInWithPopup(auth, googleProvider);
      
      const evaluatorEmail = "rupanandpalakurthi@gmail.com";
      const isAdminEmail = res.user.email?.toLowerCase() === evaluatorEmail || res.user.email?.toLowerCase().includes('admin');
      const role = isAdminEmail ? 'admin' : 'user';

      // Sync with Firestore
      await setDoc(doc(db, 'users', res.user.uid), {
        uid: res.user.uid,
        email: res.user.email,
        displayName: res.user.displayName || 'Google Client',
        role: role,
        createdAt: new Date().toISOString(),
      }, { merge: true });

      setAuthModal({ isOpen: false, mode: 'login' });
    } catch (err: any) {
      console.error(err);
      setAuthError(err.message || 'Google Popup integration issue.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleOpenAuth = (mode: 'login' | 'register' | 'forgot') => {
    setAuthError('');
    setAuthSuccess('');
    setAuthForm({ name: '', email: '', password: '', phone: '' });
    setAuthModal({ isOpen: true, mode });
  };

  // Safe navigation trigger
  const handleProtectedTab = (tabId: string) => {
    if (!user) {
      handleOpenAuth('login');
    } else {
      setCurrentTab(tabId);
      setSelectedPrediction(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 transition-colors duration-200 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans" id="app-root-container">
      
      {/* Loading state bar */}
      {loading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-50/90 dark:bg-slate-950/90">
          <div className="relative h-16 w-16 flex items-center justify-center">
            <div className="absolute h-full w-full rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin"></div>
            <Landmark className="h-6 w-6 text-emerald-500 animate-pulse" />
          </div>
          <span className="mt-4 text-sm font-bold tracking-wider text-slate-600 dark:text-slate-300">Synchronizing secure clusters...</span>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar 
        user={user}
        userRole={userRole}
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          if (['predictor', 'dashboard', 'admin'].includes(tab)) {
            handleProtectedTab(tab);
          } else {
            setCurrentTab(tab);
            setSelectedPrediction(null);
          }
        }}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onLogout={handleLogout}
        onOpenAuth={(mode) => handleOpenAuth(mode)}
      />

      {/* Main Content Area */}
      <main className="flex-grow">
        {currentTab === 'home' && (
          <LandingPage 
            setCurrentTab={(tab) => {
              if (['predictor', 'dashboard'].includes(tab)) {
                handleProtectedTab(tab);
              } else {
                setCurrentTab(tab);
              }
            }} 
            user={user}
            onOpenAuth={(mode) => handleOpenAuth(mode)}
          />
        )}

        {currentTab === 'features' && (
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 space-y-16">
            <div className="text-center space-y-2">
              <span className="text-xs font-semibold text-emerald-500 uppercase tracking-wider">Features Overview</span>
              <h2 className="font-display text-4xl font-extrabold text-slate-900 dark:text-white">Smart Lending Architecture</h2>
              <p className="max-w-2xl mx-auto text-slate-500 text-sm">Discover how our multi-layered framework validates applicant eligibility instantly using modern ML algorithms.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
                <Brain className="h-8 w-8 text-emerald-500" />
                <h4 className="font-bold text-lg text-slate-900 dark:text-white">Advanced Estimators</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Runs high-density neural decisions across Decision Trees, Random Forests, K-Nearest Neighbors, and Gradient Boosting ensembles to minimize classification margin errors.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
                <ShieldCheck className="h-8 w-8 text-sky-500" />
                <h4 className="font-bold text-lg text-slate-900 dark:text-white">Cloud Database Logs</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Direct, live, and real-time syncing of profile preferences and prediction histories across Firebase Firestore collections ensuring historical durability.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
                <MessageSquareCode className="h-8 w-8 text-indigo-500" />
                <h4 className="font-bold text-lg text-slate-900 dark:text-white">GenAI Chat Specialist</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Direct multi-turn Gemini SDK co-pilot with search grounding. Instantly explains predictions, loan types, debt structures, and credit repair strategies.</p>
              </div>
            </div>
          </div>
        )}

        {currentTab === 'about' && (
          <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center space-y-2">
              <span className="text-xs font-semibold text-emerald-500 uppercase tracking-wider">How We Code</span>
              <h2 className="font-display text-4xl font-extrabold text-slate-900 dark:text-white">Our Technology Stack</h2>
              <p className="text-slate-500 text-sm">Engineered using React 19, Tailwind CSS v4, Express, and Firebase client SDKs.</p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-md dark:border-slate-800 dark:bg-slate-900 space-y-6 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              <p>
                Smart Lender AI represents a complete, secure, full-stack predictive finance applet. It is fully responsive, supporting adaptive typography, micro-interactions, dynamic sliders, and dark mode configuration transitions.
              </p>
              <div className="grid grid-cols-2 gap-4 text-xs font-mono font-bold text-slate-500">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 dark:bg-slate-950 dark:border-slate-800">
                  <span className="text-emerald-500">FRONTEND</span>: React, Tailwind, Lucide Icons, Recharts, Motion, jsPDF
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 dark:bg-slate-950 dark:border-slate-800">
                  <span className="text-emerald-500">BACKEND</span>: Node.js Express server, TSX, esbuild bundler
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 dark:bg-slate-950 dark:border-slate-800">
                  <span className="text-emerald-500">DATABASE</span>: Firebase Firestore, Firebase Authentication
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 dark:bg-slate-950 dark:border-slate-800">
                  <span className="text-emerald-500">AI CLIENT</span>: @google/genai SDK, Gemini Flash with Search Grounding
                </div>
              </div>
            </div>
          </div>
        )}

        {currentTab === 'predictor' && (
          <div>
            {selectedPrediction ? (
              <PredictResultView 
                prediction={selectedPrediction} 
                onReset={() => {
                  setSelectedPrediction(null);
                  setCurrentTab('predictor');
                }}
              />
            ) : (
              <PredictFormView 
                user={user}
                onPredictionComplete={(pred) => setSelectedPrediction(pred)}
                onCancel={() => setCurrentTab('dashboard')}
              />
            )}
          </div>
        )}

        {currentTab === 'dashboard' && user && (
          <DashboardView 
            user={user}
            setCurrentTab={setCurrentTab}
            onSelectApplication={(app) => {
              setSelectedPrediction(app);
              setCurrentTab('predictor');
            }}
          />
        )}

        {currentTab === 'admin' && user && userRole === 'admin' && (
          <AdminPanel />
        )}
      </main>

      {/* Floating Chatbot (floating everywhere) */}
      <FloatingChatbot userPrediction={selectedPrediction} />

      {/* Corporate Footer */}
      <Footer setCurrentTab={setCurrentTab} />

      {/* Unified Authentication Modal */}
      {authModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm" id="auth-modal-overlay">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 space-y-6 relative overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header branding */}
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-4 dark:border-slate-800">
              <div className="rounded-lg bg-emerald-500 p-2 text-white">
                <Landmark className="h-5 w-5" />
              </div>
              <span className="font-display text-lg font-bold text-slate-900 dark:text-white">Smart Lender AI Auth</span>
            </div>

            <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">
              {authModal.mode === 'login' && 'Sign In to Portal'}
              {authModal.mode === 'register' && 'Register Standard Account'}
              {authModal.mode === 'forgot' && 'Reset Secure Passcode'}
            </h3>

            {authError && (
              <div className="rounded-xl bg-red-50 p-3.5 text-xs font-semibold text-red-700 dark:bg-red-950/20 dark:text-red-400 flex items-start">
                <ShieldAlert className="h-4 w-4 mr-1.5 flex-shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            {authSuccess && (
              <div className="rounded-xl bg-emerald-50 p-3.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400">
                {authSuccess}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authModal.mode === 'register' && (
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={authForm.name}
                      onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                      id="auth-register-name"
                    />
                  </div>
                </div>
              )}

              {authModal.mode === 'register' && (
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={authForm.phone}
                      onChange={(e) => setAuthForm({ ...authForm, phone: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="jane@example.com"
                    value={authForm.email}
                    onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                    id="auth-email-input"
                  />
                </div>
              </div>

              {authModal.mode !== 'forgot' && (
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-slate-500">Password</label>
                    {authModal.mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => handleOpenAuth('forgot')}
                        className="text-xs font-bold text-emerald-500 hover:underline"
                      >
                        Forgot?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={authForm.password}
                      onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                      id="auth-password-input"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={authLoading}
                className="w-full flex items-center justify-center rounded-lg bg-emerald-500 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-600 focus:outline-none disabled:opacity-50 dark:bg-emerald-600 dark:hover:bg-emerald-700"
                id="auth-submit-btn"
              >
                {authLoading ? 'Verifying...' : authModal.mode === 'login' ? 'Sign In' : authModal.mode === 'register' ? 'Register Account' : 'Send Reset Link'}
                <ChevronRight className="ml-1.5 h-4 w-4" />
              </button>
            </form>

            {/* Google Sign In divider */}
            {authModal.mode !== 'forgot' && (
              <div className="space-y-4">
                <div className="flex items-center my-4">
                  <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
                  <span className="px-3 text-xs text-slate-400 font-bold uppercase tracking-wider">or sign in with</span>
                  <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={authLoading}
                  className="w-full flex justify-center items-center rounded-lg border border-slate-200 bg-white py-2.5 px-4 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 disabled:opacity-50"
                  id="auth-google-btn"
                >
                  <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" width="24" height="24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.9h6.6c-.28 1.5-1.11 2.76-2.39 3.62v3h3.86c2.26-2.09 3.67-5.17 3.67-8.45z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.303v3.13C3.283 22.35 7.393 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.57H1.303c-.83 1.66-1.3 3.52-1.3 5.43s.47 3.77 1.3 5.43l3.967-3.14z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.39 0 3.283 1.65 1.303 4.75l3.967 3.14c.95-2.85 3.6-4.96 6.73-4.96z"/>
                  </svg>
                  Google Credentials
                </button>
              </div>
            )}

            {/* Switch Mode Footer */}
            <div className="text-center text-xs text-slate-500 border-t border-slate-100 pt-4 dark:border-slate-800 flex justify-between">
              {authModal.mode === 'login' ? (
                <>
                  <span>New to Smart Lender?</span>
                  <button onClick={() => handleOpenAuth('register')} className="font-bold text-emerald-500 hover:underline">Create Account</button>
                </>
              ) : (
                <>
                  <span>Have an active profile?</span>
                  <button onClick={() => handleOpenAuth('login')} className="font-bold text-emerald-500 hover:underline">Sign In Instead</button>
                </>
              )}
              <button onClick={() => setAuthModal({ isOpen: false, mode: 'login' })} className="text-slate-400 hover:text-slate-600 font-bold">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
