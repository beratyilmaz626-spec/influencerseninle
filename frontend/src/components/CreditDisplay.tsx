import { useState } from 'react';
import { Coins, Plus, History, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { useCredits } from '../hooks/useCredits';

interface CreditDisplayProps {
  onBuyCredits: () => void;
}
export default function CreditDisplay({ onBuyCredits }: CreditDisplayProps) {
  const { userProfile, loading: authLoading } = useAuth();
  const { credits, transactions, loading: creditsLoading } = useCredits();
  const [showHistory, setShowHistory] = useState(false);

  // Check both authLoading and creditsLoading
  if (authLoading || creditsLoading) {
    return (
      <div className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg">
        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm text-gray-600">Yükleniyor...</span>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center space-x-4">
        {/* Credit Display */}
        <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-cyan-50 px-4 py-2 rounded-lg border border-blue-200">
          <Coins className="w-5 h-5 text-blue-600" />
          <span className="font-semibold text-blue-900">{credits}</span>
          <span className="text-sm text-blue-700">Kredi</span>
        </div>

        {/* History Button */}
        <button
          onClick={() => setShowHistory(true)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Kredi Geçmişi"
        >
          <History className="w-5 h-5 text-gray-600" />
        </button>

        {/* Buy Credits Button */}
        <button
          onClick={onBuyCredits}
          className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium">Kredi Al</span>
        </button>
      </div>

      {/* Credit History Modal */}
      <AnimatePresence>
        {showHistory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900">Kredi Geçmişi</h3>
                <button
                  onClick={() => setShowHistory(false)}
                  className="p-2 hover:bg-red-100 rounded-lg transition-colors group"
                  title="Kapat"
                  aria-label="Kapat"
                >
                  <X className="w-6 h-6 text-gray-500 group-hover:text-red-600" />
                </button>
              </div>

              <div className="p-6 max-h-96 overflow-y-auto">
                {transactions.length === 0 ? (
                  <div className="text-center py-8">
                    <Coins className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Henüz kredi işlemi yok</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {transactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {transaction.description}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(transaction.created_at).toLocaleDateString('tr-TR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`font-bold ${
                              transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                            }`}
                          >
                            {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                          </span>
                          <span className="text-sm text-gray-500">kredi</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}