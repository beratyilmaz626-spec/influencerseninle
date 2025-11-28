import React from 'react';
import { Wand2, Lightbulb, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface PromptSectionProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
}

export default function PromptSection({ prompt, setPrompt }: PromptSectionProps) {
  const suggestions = [
    "Genç bir kadın mutlu bir şekilde ürünü kullanıyor",
    "Modern bir ortamda profesyonel sunum",
    "Günlük hayattan doğal anlar",
    "Ürünün faydalarını gösteren yaratıcı sahneler"
  ];

  const addSuggestion = (suggestion: string) => {
    if (prompt.trim()) {
      setPrompt(prompt + ', ' + suggestion.toLowerCase());
    } else {
      setPrompt(suggestion);
    }
  };

  return (
    <motion.div 
      className="bg-white rounded-3xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-400 rounded-2xl flex items-center justify-center shadow-lg">
          <Wand2 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Prompt</h3>
          <p className="text-gray-600">AI'ya özel talimatlar verin</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Videonun nasıl olmasını istediğinizi detaylı bir şekilde açıklayın... Örnek: 'Güneşli bir parkta, genç bir kadın elinde kahve ile mutlu bir şekilde yürüyor ve gülümsüyor. Doğal ışık, sıcak renkler, pozitif enerji.'"
            rows={6}
            className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none transition-all duration-200 bg-gradient-to-br from-gray-50 to-white shadow-inner text-gray-800 placeholder-gray-400"
          />
          <div className="absolute bottom-4 right-4 flex items-center space-x-2">
            <div className="text-xs text-gray-400">
              {prompt.length}/1000
            </div>
            <Sparkles className="w-4 h-4 text-pink-400" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-6 border border-pink-100">
          <div className="flex items-center space-x-2 mb-4">
            <Lightbulb className="w-5 h-5 text-pink-500" />
            <h4 className="font-semibold text-gray-900">Öneriler</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {suggestions.map((suggestion, index) => (
              <motion.button
                key={index}
                onClick={() => addSuggestion(suggestion)}
                className="text-left p-3 bg-white hover:bg-pink-50 rounded-xl border border-pink-100 hover:border-pink-200 transition-all duration-200 text-sm text-gray-700 hover:text-pink-700 shadow-sm hover:shadow-md"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                  <span>{suggestion}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-4 border border-blue-100">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-900 mb-1">💡 İpucu</p>
              <p className="text-sm text-blue-700 leading-relaxed">
                Detaylı açıklamalar daha iyi sonuçlar verir. Ortam, kişi, ruh hali, renkler ve ışık hakkında bilgi verin.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}