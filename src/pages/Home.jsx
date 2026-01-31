import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const QUOTES = [
  "心无挂碍，无挂碍故，无有恐怖。",
  "应无所住，而生其心。",
  "本来无一物，何处惹尘埃。",
  "一花一世界，一叶一菩提。",
  "凡所有相，皆是虚妄。",
];

export default function Home() {
  const [quote, setQuote] = useState("");

  useEffect(() => {
    // Pick a quote based on the day of the year to be consistent for the whole day
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    setQuote(QUOTES[dayOfYear % QUOTES.length]);
  }, []);

  return (
    <div className="min-h-full p-8 flex flex-col items-center justify-center text-center bg-zen-bg">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="max-w-md"
      >
        <div className="w-16 h-16 bg-zen-red rounded-full flex items-center justify-center text-white text-2xl font-bold mb-8 mx-auto shadow-lg">
          禅
        </div>
        
        <h1 className="text-3xl font-bold text-zen-ink mb-2">今日禅语</h1>
        <div className="w-12 h-1 bg-zen-red mx-auto mb-8 rounded-full opacity-50"></div>
        
        <p className="text-xl text-gray-600 leading-loose font-serif italic">
          “{quote}”
        </p>

        <div className="mt-12 grid grid-cols-2 gap-4">
           {/* Quick Actions (Visual Only for now) */}
           <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 opacity-80">
              <span className="block text-2xl mb-1">🔥</span>
              <span className="text-sm text-gray-500">已坚持 1 天</span>
           </div>
           <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 opacity-80">
              <span className="block text-2xl mb-1">📿</span>
              <span className="text-sm text-gray-500">今日功课</span>
           </div>
        </div>
      </motion.div>
    </div>
  );
}
