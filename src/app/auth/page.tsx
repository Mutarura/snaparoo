'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Camera, Mail, Lock, User, Eye, EyeOff, ChevronRight } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

const ROLES = [
    { id: 'organizer', label: 'Event Organizer', emoji: '🎉' },
    { id: 'host', label: 'Host', emoji: '🏠' },
    { id: 'photographer', label: 'Photographer', emoji: '📸' },
    { id: 'photobooth', label: 'Photobooth Owner', emoji: '🎠' },
];

const EVENT_TYPES = [
    { id: 'small', label: 'Small Groups', emoji: '👥' },
    { id: 'weddings', label: 'Weddings', emoji: '💍' },
    { id: 'parties', label: 'Parties & Events', emoji: '🥳' },
    { id: 'enterprise', label: 'Enterprise', emoji: '🏢' },
];

export default function Auth() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const defaultMode = searchParams.get('mode') || 'login';

    const [mode, setMode] = useState<'login' | 'signup'>(defaultMode as 'login' | 'signup');
    const [step, setStep] = useState(1); // 1=credentials, 2=profile, 3=role, 4=event types
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        email: '',
        password: '',
        fullName: '',
        username: '',
        role: '',
        eventTypes: [] as string[],
        plan: searchParams.get('plan') || 'free',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const toggleEventType = (id: string) => {
        setForm(prev => ({
            ...prev,
            eventTypes: prev.eventTypes.includes(id)
                ? prev.eventTypes.filter(t => t !== id)
                : [...prev.eventTypes, id],
        }));
    };

    const handleContinue = () => {
        if (step === 1 && (!form.email || !form.password)) return;
        if (step === 2 && (!form.fullName || !form.username)) return;
        if (step === 3 && !form.role) return;
        if (step < 4) {
            setStep(step + 1);
        } else {
            handleFinish();
        }
    };

    const handleFinish = async () => {
        setLoading(true);
        // Simulate auth & profile creation (replace with real auth)
        await new Promise(r => setTimeout(r, 1500));
        // After onboarding, go to create event
        router.push('/create');
    };

    const handleLogin = async () => {
        if (!form.email || !form.password) return;
        setLoading(true);
        await new Promise(r => setTimeout(r, 1200));
        router.push('/create');
    };

    const totalSteps = mode === 'signup' ? 4 : 1;

    return (
        <div className="min-h-screen bg-[#050505] text-white flex">
            {/* Left branding panel — hidden on mobile */}
            <div className="hidden lg:flex lg:w-2/5 relative overflow-hidden flex-col items-center justify-center p-12"
                style={{ background: 'linear-gradient(135deg, #111 0%, #1a1a00 50%, #111 100%)' }}
            >
                <div className="absolute inset-0 bg-yellow-400/5 blur-3xl" />
                <div className="relative z-10 text-center">
                    <div className="w-20 h-20 rounded-2xl bg-yellow-400 flex items-center justify-center mx-auto mb-8">
                        <Camera className="w-10 h-10 text-black" strokeWidth={2.5} />
                    </div>
                    <h2 className="text-3xl font-extrabold tracking-tight mb-4">Snaparoo<span className="text-yellow-400">.</span></h2>
                    <p className="text-white/40 text-lg leading-relaxed max-w-xs mx-auto">
                        The disposable camera app for unforgettable events.
                    </p>
                    <div className="mt-12 space-y-4">
                        {['No app download for guests', 'Full organizer control', 'Cloud-synced memories'].map(t => (
                            <div key={t} className="flex items-center gap-3 text-left">
                                <div className="w-5 h-5 rounded-full bg-yellow-400/20 flex items-center justify-center shrink-0">
                                    <div className="w-2 h-2 rounded-full bg-yellow-400" />
                                </div>
                                <span className="text-white/60 text-sm">{t}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right form panel */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10">
                <div className="w-full max-w-md">

                    {/* Logo for mobile */}
                    <div className="lg:hidden flex items-center gap-2 mb-10">
                        <div className="w-8 h-8 rounded-lg bg-yellow-400 flex items-center justify-center">
                            <Camera className="w-4 h-4 text-black" strokeWidth={2.5} />
                        </div>
                        <span className="font-bold text-lg">Snaparoo<span className="text-yellow-400">.</span></span>
                    </div>

                    {/* Mode toggle */}
                    <div className="flex gap-1 p-1 rounded-xl bg-white/5 border border-white/8 mb-8">
                        <button
                            onClick={() => { setMode('login'); setStep(1); }}
                            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${mode === 'login' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/70'}`}
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => { setMode('signup'); setStep(1); }}
                            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${mode === 'signup' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/70'}`}
                        >
                            Create Account
                        </button>
                    </div>

                    {/* Step progress (signup only) */}
                    {mode === 'signup' && (
                        <div className="flex gap-1.5 mb-8">
                            {[1, 2, 3, 4].map(s => (
                                <div key={s} className={`h-1 rounded-full flex-1 transition-all duration-300 ${s <= step ? 'bg-yellow-400' : 'bg-white/10'}`} />
                            ))}
                        </div>
                    )}

                    <AnimatePresence mode="wait">
                        {/* ---- LOGIN ---- */}
                        {mode === 'login' && (
                            <motion.div key="login" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                                <h1 className="text-2xl font-extrabold tracking-tight mb-1">Welcome back</h1>
                                <p className="text-white/40 text-sm mb-8">Sign in to your Snaparoo account</p>

                                <div className="space-y-4">
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                        <input id="login-email" name="email" type="email" placeholder="Email address" value={form.email} onChange={handleChange}
                                            className="input-dark pl-11" autoComplete="email" />
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                        <input id="login-password" name="password" type={showPassword ? 'text' : 'password'} placeholder="Password" value={form.password} onChange={handleChange}
                                            className="input-dark pl-11 pr-11" autoComplete="current-password" />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                <button onClick={handleLogin} disabled={loading}
                                    className="btn-primary w-full mt-6 py-3.5 flex items-center justify-center gap-2 disabled:opacity-50">
                                    {loading ? 'Signing in...' : 'Sign In'} {!loading && <ArrowRight className="w-4 h-4" />}
                                </button>

                                <div className="mt-6 text-center">
                                    <p className="text-white/30 text-sm">
                                        Don&apos;t have an account?{' '}
                                        <button onClick={() => { setMode('signup'); setStep(1); }} className="text-yellow-400 hover:text-yellow-300 font-semibold transition-colors">
                                            Sign up free
                                        </button>
                                    </p>
                                </div>

                                {/* Social auth */}
                                <div className="mt-8">
                                    <div className="flex items-center gap-3 mb-5">
                                        <div className="flex-1 h-px bg-white/8" />
                                        <span className="text-white/30 text-xs">or continue with</span>
                                        <div className="flex-1 h-px bg-white/8" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button className="btn-ghost py-3 text-sm flex items-center justify-center gap-2">
                                            <svg className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                                            Google
                                        </button>
                                        <button className="btn-ghost py-3 text-sm flex items-center justify-center gap-2">
                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" /></svg>
                                            Apple
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* ---- SIGNUP STEP 1: Credentials ---- */}
                        {mode === 'signup' && step === 1 && (
                            <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                <h1 className="text-2xl font-extrabold tracking-tight mb-1">Create your account</h1>
                                <p className="text-white/40 text-sm mb-8">Join Snaparoo — it&apos;s free to start</p>

                                <div className="space-y-4">
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                        <input id="su-email" name="email" type="email" placeholder="Email address" value={form.email} onChange={handleChange}
                                            className="input-dark pl-11" autoComplete="email" />
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                        <input id="su-password" name="password" type={showPassword ? 'text' : 'password'} placeholder="Create password" value={form.password} onChange={handleChange}
                                            className="input-dark pl-11 pr-11" autoComplete="new-password" />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Social auth */}
                                <div className="my-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="flex-1 h-px bg-white/8" />
                                        <span className="text-white/30 text-xs">or sign up with</span>
                                        <div className="flex-1 h-px bg-white/8" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button className="btn-ghost py-3 text-sm flex items-center justify-center gap-2">
                                            <svg className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                                            Google
                                        </button>
                                        <button className="btn-ghost py-3 text-sm flex items-center justify-center gap-2">
                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" /></svg>
                                            Apple
                                        </button>
                                    </div>
                                </div>

                                <button onClick={handleContinue}
                                    className="btn-primary w-full py-3.5 flex items-center justify-center gap-2">
                                    Continue <ArrowRight className="w-4 h-4" />
                                </button>

                                <p className="text-center text-white/30 text-xs mt-4">
                                    Already have an account?{' '}
                                    <button onClick={() => setMode('login')} className="text-yellow-400 font-semibold">Sign in</button>
                                </p>
                            </motion.div>
                        )}

                        {/* ---- SIGNUP STEP 2: Name & Username ---- */}
                        {mode === 'signup' && step === 2 && (
                            <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                <h1 className="text-2xl font-extrabold tracking-tight mb-1">Tell us about you</h1>
                                <p className="text-white/40 text-sm mb-8">How should we call you?</p>
                                <div className="space-y-4">
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                        <input id="su-fullname" name="fullName" type="text" placeholder="Full Name" value={form.fullName} onChange={handleChange}
                                            className="input-dark pl-11" autoComplete="name" />
                                    </div>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm font-medium">@</span>
                                        <input id="su-username" name="username" type="text" placeholder="Username" value={form.username} onChange={handleChange}
                                            className="input-dark pl-9" autoComplete="username" />
                                    </div>
                                </div>
                                <button onClick={handleContinue}
                                    className="btn-primary w-full mt-6 py-3.5 flex items-center justify-center gap-2">
                                    Continue <ArrowRight className="w-4 h-4" />
                                </button>
                            </motion.div>
                        )}

                        {/* ---- SIGNUP STEP 3: Role ---- */}
                        {mode === 'signup' && step === 3 && (
                            <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                <h1 className="text-2xl font-extrabold tracking-tight mb-1">Your role at events</h1>
                                <p className="text-white/40 text-sm mb-8">This helps us tailor your experience.</p>
                                <div className="grid grid-cols-2 gap-3">
                                    {ROLES.map(r => (
                                        <button key={r.id} onClick={() => setForm({ ...form, role: r.id })}
                                            className={`p-4 rounded-xl border text-left transition-all ${form.role === r.id ? 'border-yellow-400 bg-yellow-400/10' : 'border-white/10 glass hover:border-white/20'}`}>
                                            <div className="text-2xl mb-2">{r.emoji}</div>
                                            <div className="text-sm font-semibold">{r.label}</div>
                                        </button>
                                    ))}
                                </div>
                                <button onClick={handleContinue} disabled={!form.role}
                                    className="btn-primary w-full mt-6 py-3.5 flex items-center justify-center gap-2 disabled:opacity-40">
                                    Continue <ArrowRight className="w-4 h-4" />
                                </button>
                            </motion.div>
                        )}

                        {/* ---- SIGNUP STEP 4: Event Types ---- */}
                        {mode === 'signup' && step === 4 && (
                            <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                <h1 className="text-2xl font-extrabold tracking-tight mb-1">Types of events you organize</h1>
                                <p className="text-white/40 text-sm mb-8">Select all that apply.</p>
                                <div className="grid grid-cols-2 gap-3">
                                    {EVENT_TYPES.map(t => (
                                        <button key={t.id} onClick={() => toggleEventType(t.id)}
                                            className={`p-4 rounded-xl border text-left transition-all ${form.eventTypes.includes(t.id) ? 'border-yellow-400 bg-yellow-400/10' : 'border-white/10 glass hover:border-white/20'}`}>
                                            <div className="text-2xl mb-2">{t.emoji}</div>
                                            <div className="text-sm font-semibold">{t.label}</div>
                                        </button>
                                    ))}
                                </div>
                                <button onClick={handleFinish} disabled={loading}
                                    className="btn-primary w-full mt-6 py-3.5 flex items-center justify-center gap-2 disabled:opacity-50">
                                    {loading ? 'Setting up your account...' : <>Get Started <ChevronRight className="w-4 h-4" /></>}
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
