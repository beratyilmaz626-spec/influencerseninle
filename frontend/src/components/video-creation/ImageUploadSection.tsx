import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageUploadSectionProps {
  uploadedImage: File | null;
  setUploadedImage: (file: File | null) => void;
}

export default function ImageUploadSection({ uploadedImage, setUploadedImage }: ImageUploadSectionProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (file: File) => {
    setUploadError(null);
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Lütfen geçerli bir resim dosyası seçin');
      return;
    }
    
    setUploadedImage(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const removeImage = () => {
    setUploadedImage(null);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <motion.div 
      className="bg-white rounded-3xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center shadow-lg">
          <ImageIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Fotoğraf Yükle</h3>
          <p className="text-gray-600">Video için kullanılacak görseli seçin</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!uploadedImage ? (
          <motion.div
            key="upload-area"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
              isDragOver 
                ? 'border-blue-400 bg-blue-50 scale-105' 
                : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="image-upload"
            />
            
            <label htmlFor="image-upload" className="cursor-pointer block">
              <motion.div
                animate={{ 
                  scale: isDragOver ? 1.1 : 1,
                  rotate: isDragOver ? 5 : 0 
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <Upload className="w-10 h-10 text-gray-400" />
                </div>
              </motion.div>
              
              <div className="space-y-2">
                <p className="text-xl font-semibold text-gray-900">
                  {isDragOver ? 'Dosyayı buraya bırakın' : 'Fotoğraf yüklemek için tıklayın'}
                </p>
                <p className="text-gray-500">veya dosyayı sürükleyip bırakın</p>
                <p className="text-sm text-gray-400">PNG, JPG, WebP</p>
              </div>
            </label>

            {isDragOver && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-blue-100 bg-opacity-50 rounded-2xl flex items-center justify-center"
              >
                <div className="text-blue-600 font-semibold text-lg">Dosyayı bırakın</div>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="uploaded-image"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-lg">
              <img 
                src={URL.createObjectURL(uploadedImage)} 
                alt="Uploaded" 
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              
              <button
                onClick={removeImage}
                className="absolute top-4 right-4 w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors shadow-lg"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                    <div>
                      <p className="font-semibold text-gray-900">{uploadedImage.name}</p>
                      <p className="text-sm text-gray-600">
                        {(uploadedImage.size / (1024 * 1024)).toFixed(1)} MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {uploadError && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4"
        >
          <p className="text-red-600 text-sm font-medium">{uploadError}</p>
        </motion.div>
      )}
    </motion.div>
  );
}