'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, CreditCard, Calendar, Users, Image as ImageIcon,
  Settings, ToggleLeft, ToggleRight, Loader2, Camera, Check
} from 'lucide-react';
import { createEvent } from '@/app/actions';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

const FILTERS = ['None', 'Vintage', 'B&W', 'Vibrant', 'Warm', 'Cool'];
const GALLERY_OPTIONS = [
  { value: 'During', label: 'During Event', desc: 'Visible while the event is happening' },
  { value: 'After', label: 'After Event', desc: 'Gallery unlocks once the event ends' },
  { value: '12h after', label: '12h After', desc: 'Gallery reveals 12 hours after the event' },
  { value: '24h after', label: '24h After', desc: 'Gallery reveals 24 hours after the event' },
];

export default function CreateEvent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    date: '',
    endDate: '',
    galleryViewing: 'During',
    allowGuestGallery: true,
    filters: 'None',
    guestLimit: 10,
    mediaLimitPerGuest: 25,
    plan: searchParams.get('plan') || 'free',
    backgroundPoster: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (step === 1 && (!formData.name || !formData.email)) {
      alert('Please fill in Event Name and Email.');
      return;
    }
    setStep(s => s + 1);
  };

  const guestLimitLabel = () => {
    if (formData.guestLimit <= 10) return { text: 'Freemium (Free)', color: 'text-green-400' };
    if (formData.guestLimit <= 15) return { text: 'Starter Tier — 300 KES', color: 'text-yellow-400' };
    return { text: 'Pro Tier — Custom Pricing', color: 'text-orange-400' };
  };

  const handlePayment = async (method: 'paystack' | 'pesapal' | 'free') => {
    setLoading(true);
    await new Promise(r => setTimeout(r, method === 'free' ? 800 : 2000));

    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('date', formData.date || new Date().toISOString());
    data.append('endDate', formData.endDate);
    data.append('galleryViewing', formData.galleryViewing);
    data.append('allowGuestGallery', formData.allowGuestGallery.toString());
    data.append('filters', formData.filters);
    data.append('guestLimit', formData.guestLimit.toString());
    data.append('mediaLimitPerGuest', formData.mediaLimitPerGuest.toString());
    data.append('plan', formData.plan);
    data.append('paymentMethod', method);
    data.append('backgroundPoster', formData.backgroundPoster);

    const result = await createEvent(null, data);
    if (result.success && result.redirectUrl) {
      router.push(result.redirectUrl);
    } else {
      alert(result.message || 'Something went wrong');
      setLoading(false);
    }
  };

  const isFree = formData.guestLimit <= 10;
  const label = guestLimitLabel();

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">
      {/* Top bar */}
      <header className="glass-dark border-b border-white/5 px-4 h-14 flex items-center">
        <div className="max-w-2xl mx-auto w-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-yellow-400" />
            <span className="font-bold text-sm">Snaparoo<span className="text-yellow-400">.</span></span>
          </div>
          <div className="w-16" />
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-4 py-10">
        <div className="w-full max-w-lg">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-extrabold tracking-tight mb-3">
              {step === 1 ? 'Event Details' : step === 2 ? 'Settings & Customization' : 'Complete Setup'}
            </h1>
            {/* Step indicators */}
            <div className="flex justify-center gap-2 mt-3">
              {[1, 2, 3].map(s => (
                <div key={s} className={`h-1.5 rounded-full transition-all duration-300 ${s <= step ? 'bg-yellow-400 w-10' : 'bg-white/10 w-4'}`} />
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {/* ---- STEP 1: Event Details ---- */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="glass border border-white/8 rounded-2xl p-6 sm:p-8 space-y-5">

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white/40 uppercase tracking-wider">Event Name *</label>
                  <input id="event-name" name="name" value={formData.name} onChange={handleChange}
                    placeholder="e.g. Sarah's Wedding, TechFest 2026..."
                    className="input-dark" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white/40 uppercase tracking-wider">Organizer Email *</label>
                  <input id="event-email" name="email" type="email" value={formData.email} onChange={handleChange}
                    placeholder="your@email.com — for dashboard link"
                    className="input-dark" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-white/40 uppercase tracking-wider flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Start
                    </label>
                    <input id="event-date" name="date" type="datetime-local" value={formData.date} onChange={handleChange}
                      className="input-dark [color-scheme:dark]" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-white/40 uppercase tracking-wider flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> End
                    </label>
                    <input id="event-enddate" name="endDate" type="datetime-local" value={formData.endDate} onChange={handleChange}
                      className="input-dark [color-scheme:dark]" />
                  </div>
                </div>

                {/* Background poster placeholder */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white/40 uppercase tracking-wider flex items-center gap-1">
                    <ImageIcon className="w-3 h-3" /> Background / Poster URL
                  </label>
                  <input id="ev-bg" name="backgroundPoster" value={formData.backgroundPoster} onChange={handleChange}
                    placeholder="https://... (optional)"
                    className="input-dark" />
                  <p className="text-xs text-white/25">Paste an image URL to brand your camera screen.</p>
                </div>

                <button onClick={handleNext}
                  className="btn-primary w-full py-3.5 flex items-center justify-center gap-2">
                  Next — Settings <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {/* ---- STEP 2: Settings ---- */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="glass border border-white/8 rounded-2xl p-6 sm:p-8 space-y-5">

                {/* Gallery Viewing */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white/40 uppercase tracking-wider">When Can Guests View Gallery?</label>
                  <div className="grid grid-cols-2 gap-2">
                    {GALLERY_OPTIONS.map(opt => (
                      <button key={opt.value} onClick={() => setFormData(p => ({ ...p, galleryViewing: opt.value }))}
                        className={`p-3 rounded-xl border text-left transition-all ${formData.galleryViewing === opt.value ? 'border-yellow-400 bg-yellow-400/10' : 'border-white/8 glass hover:border-white/15'}`}>
                        <div className="text-sm font-semibold">{opt.label}</div>
                        <div className="text-xs text-white/30 mt-0.5">{opt.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Allow Guest Gallery toggle */}
                <div className="flex items-center justify-between p-4 glass rounded-xl border border-white/8">
                  <div>
                    <div className="font-semibold text-sm">Guests Can View Gallery</div>
                    <div className="text-xs text-white/30 mt-0.5">Toggle off for a surprise reveal</div>
                  </div>
                  <button onClick={() => setFormData(p => ({ ...p, allowGuestGallery: !p.allowGuestGallery }))}
                    className="transition-colors">
                    {formData.allowGuestGallery
                      ? <ToggleRight className="w-8 h-8 text-yellow-400" />
                      : <ToggleLeft className="w-8 h-8 text-white/30" />}
                  </button>
                </div>

                {/* Filters */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white/40 uppercase tracking-wider">Apply Filter to Guest Photos</label>
                  <div className="flex flex-wrap gap-2">
                    {FILTERS.map(f => (
                      <button key={f} onClick={() => setFormData(p => ({ ...p, filters: f }))}
                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${formData.filters === f ? 'border-yellow-400 bg-yellow-400/10 text-yellow-400' : 'border-white/8 text-white/50 hover:border-white/20 hover:text-white'}`}>
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Guest Limit */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white/40 uppercase tracking-wider flex items-center justify-between">
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" /> Guest Limit</span>
                    <span className={`text-xs font-bold ${label.color}`}>{label.text}</span>
                  </label>
                  <div className="flex items-center gap-4">
                    <input type="range" min={1} max={50} value={formData.guestLimit}
                      onChange={e => setFormData(p => ({ ...p, guestLimit: parseInt(e.target.value) }))}
                      className="flex-1 accent-yellow-400" />
                    <div className="w-12 text-center font-bold text-lg">{formData.guestLimit}</div>
                  </div>
                  <div className="flex justify-between text-xs text-white/25">
                    <span>1</span><span className="text-green-400">Free ≤10</span><span className="text-yellow-400">11–15</span><span className="text-orange-400">16+</span><span>50</span>
                  </div>
                </div>

                {/* Media Limit Per Guest */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white/40 uppercase tracking-wider">
                    Media Limit Per Guest: <span className="text-white">{formData.mediaLimitPerGuest} shots</span>
                  </label>
                  <input type="range" min={5} max={100} step={5} value={formData.mediaLimitPerGuest}
                    onChange={e => setFormData(p => ({ ...p, mediaLimitPerGuest: parseInt(e.target.value) }))}
                    className="w-full accent-yellow-400" />
                </div>

                <div className="flex gap-3 pt-2">
                  <button onClick={() => setStep(1)} className="btn-ghost flex-1 py-3.5 flex items-center justify-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button onClick={handleNext} className="btn-primary flex-1 py-3.5 flex items-center justify-center gap-2">
                    Continue <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* ---- STEP 3: Payment / Finalize ---- */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="space-y-5">

                {/* Summary card */}
                <div className="glass border border-white/8 rounded-2xl p-6">
                  <h3 className="font-bold text-sm text-white/40 uppercase tracking-wider mb-4">Event Summary</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Event', value: formData.name || '—' },
                      { label: 'Organizer', value: formData.email || '—' },
                      { label: 'Guest Limit', value: `${formData.guestLimit} guests` },
                      { label: 'Media Per Guest', value: `${formData.mediaLimitPerGuest} shots` },
                      { label: 'Gallery', value: `${formData.allowGuestGallery ? '✓ Visible' : '✗ Hidden'} · ${formData.galleryViewing}` },
                      { label: 'Filter', value: formData.filters },
                    ].map(r => (
                      <div key={r.label} className="flex justify-between text-sm">
                        <span className="text-white/40">{r.label}</span>
                        <span className="font-medium">{r.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment options */}
                {isFree ? (
                  <div className="glass border border-green-500/30 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                        <Check className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <div className="font-bold">Freemium Tier</div>
                        <div className="text-xs text-white/40">Up to 10 guests — completely free</div>
                      </div>
                    </div>
                    <button onClick={() => handlePayment('free')} disabled={loading}
                      className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 disabled:opacity-50">
                      {loading ? <><Loader2 className="animate-spin w-4 h-4" /> Creating event...</> : <>Create Event — Free <ArrowRight className="w-4 h-4" /></>}
                    </button>
                  </div>
                ) : (
                  <div className="glass border border-white/8 rounded-2xl p-6 space-y-4">
                    <div className="text-center mb-2">
                      <div className="text-xs text-white/40 mb-1">Amount due</div>
                      <div className="text-3xl font-black gradient-text">
                        {formData.guestLimit <= 15 ? '300 KES' : 'Custom'}</div>
                      <div className="text-xs text-white/30 mt-1">{formData.guestLimit} guests · one-time payment</div>
                    </div>
                    <button onClick={() => handlePayment('paystack')} disabled={loading}
                      className="w-full p-4 rounded-xl border border-white/10 glass hover:border-yellow-400/40 transition-all flex items-center gap-3 group">
                      <div className="w-10 h-10 rounded-lg bg-[#00C3F7]/10 flex items-center justify-center font-bold text-[#00C3F7]">P</div>
                      <div className="text-left flex-1">
                        <div className="font-bold">Paystack</div>
                        <div className="text-xs text-white/30">Card, M-Pesa & more</div>
                      </div>
                      {loading ? <Loader2 className="animate-spin w-4 h-4 text-white/40" /> : <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-white transition-colors" />}
                    </button>
                    <button onClick={() => handlePayment('pesapal')} disabled={loading}
                      className="w-full p-4 rounded-xl border border-white/10 glass hover:border-yellow-400/40 transition-all flex items-center gap-3 group">
                      <div className="w-10 h-10 rounded-lg bg-orange-400/10 flex items-center justify-center font-bold text-orange-400">PP</div>
                      <div className="text-left flex-1">
                        <div className="font-bold">PesaPal</div>
                        <div className="text-xs text-white/30">M-Pesa, Airtel, Card</div>
                      </div>
                      {loading ? <Loader2 className="animate-spin w-4 h-4 text-white/40" /> : <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-white transition-colors" />}
                    </button>
                  </div>
                )}

                <button onClick={() => setStep(2)} className="btn-ghost w-full py-3 flex items-center justify-center gap-2 text-sm">
                  <ArrowLeft className="w-4 h-4" /> Edit Settings
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
