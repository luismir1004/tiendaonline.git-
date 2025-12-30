import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Check, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const WaitlistForm = ({ product, variant }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');

    // Mock API call
    setTimeout(() => {
      setStatus('success');
      toast.success('¡Te avisaremos cuando esté disponible!');
      setEmail('');
    }, 1500);
  };

  if (status === 'success') {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex flex-col items-center justify-center text-center h-[52px]" // Height matches button
      >
        <p className="text-emerald-700 font-medium flex items-center gap-2 text-sm">
          <Check size={18} /> ¡Suscrito correctamente!
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col sm:flex-row gap-2">
      <div className="relative flex-1">
        <input
          type="email"
          placeholder="Tu email para avisarte"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === 'loading'}
          required
          className="w-full pl-4 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all text-sm"
        />
        <Bell className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
      </div>
      <button
        type="submit"
        disabled={status === 'loading'}
        className="px-6 py-3.5 bg-slate-200 text-slate-600 font-semibold rounded-full hover:bg-slate-300 transition-colors disabled:opacity-70 flex items-center justify-center whitespace-nowrap min-w-[120px]"
      >
        {status === 'loading' ? <Loader2 className="animate-spin" size={20} /> : 'Avisadme'}
      </button>
    </form>
  );
};

export default WaitlistForm;
