import React from 'react';
import { Users, Minus, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface ContentCountSectionProps {
  contentCount: number;
  setContentCount: (count: number) => void;
}

export default function ContentCountSection({ contentCount, setContentCount }: ContentCountSectionProps) {
  const increment = () => setContentCount(Math.min(10, contentCount + 1));
  const decrement = () => setContentCount(Math.max(1, contentCount - 1));

  return (
    <motion.div 
      className="bg-white rounded-3xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-400 rounded-2xl flex items-center justify-center shadow-lg">
          <Users className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Kaç Adet UGC İçerik Üretilsin</h3>
          <p className="text-gray-600">Oluşturulacak video sayısını belirleyin</p>
        </div>
      </div>

      <div className="flex items-center justify-center space-x-8">
        <motion.button
          onClick={decrement}
          disabled={contentCount <= 1}
          className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Minus className="w-6 h-6 text-gray-700 font-bold" />
        </motion.button>
        
        <motion.div 
          className="flex-1 max-w-xs text-center"
          key={contentCount}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 border border-green-100 shadow-inner">
            <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-green-600 to-emerald-600 mb-2">
              {contentCount}
            </div>
            <div className="text-gray-700 font-semibold text-lg">Video</div>
            <div className="text-sm text-gray-500 mt-1">
              {contentCount === 1 ? 'Tek video' : `${contentCount} farklı video`}
            </div>
          </div>
        </motion.div>
        
        <motion.button
          onClick={increment}
          disabled={contentCount >= 10}
          className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-6 h-6 font-bold" />
        </motion.button>
      </div>
      
      <div className="mt-6 text-center">
        <div className="inline-flex items-center space-x-2 bg-gray-50 rounded-full px-4 py-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-600">
            Her video benzersiz içerik ve stil ile oluşturulacak
          </span>
        </div>
      </div>
    </motion.div>
  );
}