'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, CreditCard, Calendar, Mail, User, CheckCircle, Loader2 } from 'lucide-react';
import { createEvent } from '@/app/actions';
import { useRouter, useSearchParams } from 'next/navigation';

export default function CreateEvent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    date: '',
    plan: searchParams.get('plan') || 'Basic',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (step === 1 && (!formData.name || !formData.email || !formData.date)) {
      alert('Please fill in all fields');
      return;
    }
    setStep(step + 1);
  };

  const handlePayment = async (method: 'mpesa' | 'card') => {
    setLoading(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create FormData for server action
    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('date', formData.date);
    data.append('plan', formData.plan);
    data.append('paymentMethod', method);

    const result = await createEvent(null, data);
    
    if (result.success && result.redirectUrl) {
      router.push(result.redirectUrl);
    } else {
      alert(result.message || 'Something went wrong');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tighter mb-2">Create Your Event</h1>
          <div className="flex justify-center gap-2">
            {[1, 2, 3].map((s) => (
              <div 
                key={s} 
                className={`h-2 rounded-full transition-all duration-300 ${
                  s <= step ? 'bg-yellow-400 w-8' : 'bg-gray-800 w-2'
                }`}
              />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-zinc-900 p-8 rounded-2xl border border-white/10 space-y-6"
            >
              <h2 className="text-xl font-bold mb-4">Event Details</h2>
              
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Event Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-black border border-white/20 rounded p-3 pl-10 focus:border-yellow-400 outline-none transition-colors"
                    placeholder="e.g. Sarah's Birthday Bash"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400">Your Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-black border border-white/20 rounded p-3 pl-10 focus:border-yellow-400 outline-none transition-colors"
                    placeholder="organizer@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400">Event Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full bg-black border border-white/20 rounded p-3 pl-10 focus:border-yellow-400 outline-none transition-colors text-white [color-scheme:dark]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400">Select Plan</label>
                <select
                  name="plan"
                  value={formData.plan}
                  onChange={handleInputChange}
                  className="w-full bg-black border border-white/20 rounded p-3 focus:border-yellow-400 outline-none transition-colors"
                >
                  <option value="Basic">Basic ($29)</option>
                  <option value="Premium">Premium ($49)</option>
                  <option value="Corporate">Corporate (Custom)</option>
                </select>
              </div>

              <button
                onClick={handleNext}
                className="w-full bg-white text-black font-bold py-3 rounded hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
              >
                Next Step <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-zinc-900 p-8 rounded-2xl border border-white/10 space-y-6"
            >
              <button 
                onClick={() => setStep(1)}
                className="text-sm text-gray-400 hover:text-white flex items-center gap-1 mb-4"
              >
                <ArrowLeft className="w-4 h-4" /> Back to details
              </button>

              <h2 className="text-xl font-bold mb-4">Payment Method</h2>
              <p className="text-gray-400 text-sm mb-6">
                Complete your purchase for the <strong>{formData.plan}</strong> plan.
              </p>

              <div className="grid gap-4">
                <button
                  disabled={loading}
                  onClick={() => handlePayment('mpesa')}
                  className="p-4 rounded border border-white/10 bg-black hover:border-green-500 hover:bg-green-900/10 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-600 rounded flex items-center justify-center text-white font-bold">M</div>
                    <div className="text-left">
                      <div className="font-bold">M-Pesa</div>
                      <div className="text-xs text-gray-500 group-hover:text-green-400">Mobile Money</div>
                    </div>
                  </div>
                  {loading ? <Loader2 className="animate-spin w-5 h-5 text-gray-400" /> : <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-green-500" />}
                </button>

                <button
                  disabled={loading}
                  onClick={() => handlePayment('card')}
                  className="p-4 rounded border border-white/10 bg-black hover:border-blue-500 hover:bg-blue-900/10 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center text-white">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <div className="font-bold">Card Payment</div>
                      <div className="text-xs text-gray-500 group-hover:text-blue-400">Visa / Mastercard</div>
                    </div>
                  </div>
                  {loading ? <Loader2 className="animate-spin w-5 h-5 text-gray-400" /> : <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-blue-500" />}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
