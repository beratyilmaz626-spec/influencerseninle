import React from 'react';
import { Monitor, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';

interface FormatSelectionSectionProps {
  selectedFormat: string;
  setSelectedFormat: (format: string) => void;
}

export default function FormatSelectionSection({ selectedFormat, setSelectedFormat }: FormatSelectionSectionProps) {
  const formats = [
    { 
      id: '16:9', 
      label: 'Yatay', 
      desc: '16:9 - YouTube, Web', 
      icon: Monitor,
      preview: 'w-12 h-7'
    },
    { 
      id: '9:16', 
      label: 'Dikey', 
      desc: '9:16 - TikTok, Instagram', 
      icon: Smartphone,
      preview: 'w-7 h-12'
    },
  ];

  return (
    <motion.div 
      className="bg-white rounded-3xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-400 rounded-2xl flex items-center justify-center shadow-lg">
          <Monitor className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Format</h3>
          <p className="text-gray-600">Video boyut oranını seçin</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {formats.map((format) => {
          const IconComponent = format.icon;
          const isSelected = selectedFormat === format.id;
          
          return (
            <motion.button
              key={format.id}
              onClick={() => setSelectedFormat(format.id)}
              className={`relative p-6 rounded-2xl border-2 text-left transition-all duration-300 ${
                isSelected
                  ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg scale-105'
                  : 'border-gray-200 hover:border-purple-300 bg-white hover:shadow-md hover:scale-102'
              }`}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isSelected ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">{format.label}</h4>
                    <p className="text-sm text-gray-600">{format.desc}</p>
                  </div>
                </div>
                
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center"
                  >
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </motion.div>
                )}
              </div>
              
              <div className="flex justify-center">
                <div className={`${format.preview} bg-gradient-to-br from-gray-300 to-gray-400 rounded-lg shadow-inner flex items-center justify-center`}>
                  <div className="text-xs text-gray-600 font-medium">{format.id}</div>
                </div>
              </div>
              
              {isSelected && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 pointer-events-none"
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}