import { useEffect, useState } from 'react';
import { CheckCircle2, ArrowRight, Home, CreditCard } from 'lucide-react';
import { useSubscription } from '../hooks/useSubscription';
import { motion } from 'framer-motion';

export default function SuccessPage() {
  const [showConfetti, setShowConfetti] = useState(false);
  const { subscription, loading, getActiveProduct, refetch } = useSubscription();

  useEffect(() => {
    // Trigger confetti animation
    setShowConfetti(true);
    
    // Refetch subscription data to get the latest info
    const timer = setTimeout(() => {
      refetch();
    }, 2000);

    return () => clearTimeout(timer);
  }, [refetch]);

  const activeProduct = getActiveProduct();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none">
          {/* Confetti animation can be added here */}
        </div>
      )}
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-2xl w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8"
        >
          <CheckCircle2 className="w-12 h-12 text-white" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
        >
          Ödeme Başarılı! 🎉
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-xl text-gray-600 mb-8"
        >
          Aboneliğiniz başarıyla oluşturuldu ve artık tüm özelliklere erişebilirsiniz.
        </motion.p>

        {loading ? (
          <div className="bg-gray-50 rounded-2xl p-6 mb-8">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        ) : activeProduct ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 mb-8 border border-blue-100"
          >
            <div className="flex items-center justify-center space-x-3 mb-4">
              <CreditCard className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-bold text-gray-900">Seçilen Plan</h3>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-blue-600">{activeProduct.name}</p>
              <p className="text-gray-700">{activeProduct.description}</p>
              <p className="text-lg font-semibold text-gray-900">
                ${activeProduct.price}/ay
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-yellow-50 rounded-2xl p-6 mb-8 border border-yellow-200"
          >
            <p className="text-yellow-800">
              Abonelik bilgileri yükleniyor... Birkaç dakika içinde hesabınızda görünecektir.
            </p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-4"
        >
          <div className="bg-gray-50 rounded-2xl p-6">
            <h4 className="font-semibold text-gray-900 mb-3">Sırada Ne Var?</h4>
            <ul className="space-y-2 text-left">
              <li className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">Video oluşturmaya hemen başlayabilirsiniz</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">Tüm premium özelliklere erişim kazandınız</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">Öncelikli müşteri desteği aktif</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => window.location.href = '/'}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold transition-colors flex items-center justify-center space-x-2"
            >
              <Home className="w-5 h-5" />
              <span>Ana Sayfaya Dön</span>
            </button>
            
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3 px-6 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2"
            >
              <span>Video Oluşturmaya Başla</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-sm text-gray-500 mt-8"
        >
          Herhangi bir sorunuz varsa, destek ekibimizle iletişime geçebilirsiniz.
        </motion.p>
      </motion.div>
    </div>
  );
}