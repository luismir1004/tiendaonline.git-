import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Briefcase, Plane, Gamepad2, Check } from 'lucide-react';
import useCompareStore from '../stores/compareStore';

const options = [
  { id: 'Work', label: 'Trabajo / Productividad', icon: Briefcase, color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 'Travel', label: 'Viajes / Movilidad', icon: Plane, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { id: 'Gaming', label: 'Gaming / Ocio', icon: Gamepad2, color: 'text-purple-500', bg: 'bg-purple-50' },
];

const TechAdvisorQuiz = ({ onComplete }) => {
  const { compareItems } = useCompareStore();
  const [selectedGoal, setSelectedGoal] = useState(null);

  const handleSelect = (goalId) => {
    setSelectedGoal(goalId);
    
    // Find best match based on tags
    const bestMatch = compareItems.find(item => item.tags?.includes(goalId));
    
    // Slight delay for effect
    setTimeout(() => {
      onComplete(bestMatch ? bestMatch.id : null, goalId);
    }, 600);
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="text-indigo-600" size={20} />
        <h3 className="text-lg font-bold text-slate-900">Tech Advisor</h3>
      </div>
      
      <p className="text-slate-500 text-sm mb-6">
        ¿Cuál será el uso principal de tu nuevo equipo?
        <br/>Nuestra IA te recomendará la mejor opción técnica.
      </p>

      <div className="space-y-3">
        {options.map((opt) => (
          <motion.button
            key={opt.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelect(opt.id)}
            className={`w-full flex items-center p-4 rounded-xl border transition-all ${
              selectedGoal === opt.id 
                ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600' 
                : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            <div className={`p-2 rounded-lg ${opt.bg} ${opt.color} mr-4`}>
              <opt.icon size={20} />
            </div>
            <span className="font-semibold text-slate-700 text-sm">{opt.label}</span>
            {selectedGoal === opt.id && <Check size={18} className="ml-auto text-indigo-600" />}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default TechAdvisorQuiz;