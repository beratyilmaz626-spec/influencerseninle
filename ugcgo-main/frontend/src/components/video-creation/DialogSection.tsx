import React from 'react';
import { MessageSquare, Wand2, CreditCard as Edit3 } from 'lucide-react';
import { motion } from 'framer-motion';

interface DialogSectionProps {
  dialogType: string;
  setDialogType: (type: string) => void;
  customDialog: string;
  setCustomDialog: (dialog: string) => void;
}

export default function DialogSection({ dialogType, setDialogType, customDialog, setCustomDialog }: DialogSectionProps) {
  const dialogTypes = [
    { 
      id: 'auto', 
      label: 'Otomatik Diyalog', 
      desc: 'AI tarafından oluşturulan profesyonel metin',
      icon: Wand2,
      color: 'from-orange-500 to-red-400'
    },
    { 
      id: 'custom', 
      label: 'Özel Diyalog', 
      desc: 'Kendi metninizi yazın ve kontrol edin',
      icon: Edit3,
      color: 'from-blue-500 to-cyan-400'
    },
  ];

  return (
    <motion.div 
      className="bg-white rounded-3xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-400 rounded-2xl flex items-center justify-center shadow-lg">
          <MessageSquare className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Diyalog</h3>
          <p className="text-gray-600">Video için konuşma metnini belirleyin</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {dialogTypes.map((type) => {
          const IconComponent = type.icon;
          const isSelected = dialogType === type.id;
          
          return (
            <motion.button
              key={type.id}
              onClick={() => setDialogType(type.id)}
              className={`relative p-6 rounded-2xl border-2 text-left transition-all duration-300 ${
                isSelected
                  ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-red-50 shadow-lg scale-105'
                  : 'border-gray-200 hover:border-orange-300 bg-white hover:shadow-md hover:scale-102'
              }`}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${type.color}`}>
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{type.label}</h4>
                  </div>
                </div>
                
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center"
                  >
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </motion.div>
                )}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{type.desc}</p>
              
              {isSelected && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500/10 to-red-500/10 pointer-events-none"
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {dialogType === 'custom' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Özelleştirilebilir Diyalog
          </label>
          <div className="relative">
            <textarea
              value={customDialog}
              onChange={(e) => setCustomDialog(e.target.value)}
              placeholder="Video için konuşma metnini yazın... Örnek: 'Bu harika ürün hayatımı değiştirdi! Artık günlük işlerimi çok daha kolay halledebiliyorum.'"
              rows={4}
              className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none transition-all duration-200 bg-gradient-to-br from-gray-50 to-white shadow-inner"
            />
            <div className="absolute bottom-3 right-3 text-xs text-gray-400">
              {customDialog.length}/500
            </div>
          </div>
          <div className="mt-3 flex items-center space-x-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span>Doğal ve samimi bir ton kullanın</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}