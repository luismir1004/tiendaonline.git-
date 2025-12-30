import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useUIStore from '../stores/uiStore';

const TopProgressBar = () => {
  const { isNavigating } = useUIStore();

  return (
    <AnimatePresence>
      {isNavigating && (
        <div className="fixed top-0 left-0 right-0 z-[100] h-0.5 bg-slate-100 overflow-hidden">
            <motion.div
                className="h-full bg-indigo-600 shadow-[0_0_10px_#4f46e5]"
                initial={{ width: "0%" }}
                animate={{ width: "80%" }}
                exit={{ width: "100%", opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
            />
        </div>
      )}
    </AnimatePresence>
  );
};

export default TopProgressBar;