import { useState } from 'react';
import { ArrowLeft, Link2, Upload, Image as ImageIcon, Type, Sparkles, Mic, Eye, Download, Share2, CreditCard as Edit, Play } from 'lucide-react';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { useVideos } from '../hooks/useVideos';
import { useAuth } from '../hooks/useAuth';
import { uploadVideoFile, uploadThumbnailFile } from '../lib/supabase';

interface VideoCreationWizardProps {
  onBack: () => void;
}

type Step = 1 | 2 | 3 | 4 | 5;

export default function VideoCreationWizard({ onBack }: VideoCreationWizardProps) {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [productUrl, setProductUrl] = useState('');
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { createVideo } = useVideos();
  const { user } = useAuth();

  const handleGenerate = async () => {
    setIsGenerating(true);
    setUploadProgress(0);
    
    try {
      let videoUrl = null;
      let thumbnailUrl = null;

      // Upload video file if provided
      if (videoFile && user) {
        setUploadProgress(25);
        videoUrl = await uploadVideoFile(videoFile, user.id);
      }

      // Upload thumbnail if provided
      if (thumbnailFile && user) {
        setUploadProgress(50);
        thumbnailUrl = await uploadThumbnailFile(thumbnailFile, user.id);
      }

      setUploadProgress(75);

      // Create video record in database
      await createVideo({
        name: productName || 'New Video Ad',
        description: productDescription,
        product_url: productUrl,
        product_name: productName,
        selected_style: selectedStyle,
        selected_voice: selectedVoice,
        script_content: 'Introducing the ultimate solution for your everyday needs...',
        video_url: videoUrl,
        thumbnail_url: thumbnailUrl,
        status: videoFile ? 'completed' : 'processing',
      });

      setUploadProgress(100);
      
      setTimeout(() => {
        setIsGenerating(false);
        setCurrentStep(5);
      }, 1000);
    } catch (error) {
      setIsGenerating(false);
      console.error('Failed to create video:', error);
      alert('Failed to upload video. Please try again.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Kontrol Paneline Dön</span>
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Yeni Video Reklam Oluştur</h1>

          <div className="flex items-center justify-between">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div className="flex items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                      step <= currentStep
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {step}
                  </div>
                  <div className="ml-3 hidden md:block">
                    <p
                      className={`text-sm font-medium ${
                        step <= currentStep ? 'text-gray-900' : 'text-gray-500'
                      }`}
                    >
                      {step === 1 && 'Ürün Girişi'}
                      {step === 2 && 'Stil ve Konsept'}
                      {step === 3 && 'Ses ve Metin'}
                      {step === 4 && 'İnceleme'}
                      {step === 5 && 'Sonuç'}
                    </p>
                  </div>
                </div>
                {step < 5 && (
                  <div
                    className={`h-0.5 flex-1 mx-2 ${
                      step < currentStep ? 'bg-blue-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-8">
          {currentStep === 1 && (
            <Step1Content
              productUrl={productUrl}
              setProductUrl={setProductUrl}
              productName={productName}
              setProductName={setProductName}
              productDescription={productDescription}
              setProductDescription={setProductDescription}
              videoFile={videoFile}
              setVideoFile={setVideoFile}
              thumbnailFile={thumbnailFile}
              setThumbnailFile={setThumbnailFile}
              onNext={() => setCurrentStep(2)}
            />
          )}

          {currentStep === 2 && (
            <Step2Content
              selectedStyle={selectedStyle}
              setSelectedStyle={setSelectedStyle}
              onNext={() => setCurrentStep(3)}
              onBack={() => setCurrentStep(1)}
            />
          )}

          {currentStep === 3 && (
            <Step3Content
              selectedVoice={selectedVoice}
              setSelectedVoice={setSelectedVoice}
              onNext={() => setCurrentStep(4)}
              onBack={() => setCurrentStep(2)}
            />
          )}

          {currentStep === 4 && (
            <Step4Content
              productName={productName}
              selectedStyle={selectedStyle}
              selectedVoice={selectedVoice}
              isGenerating={isGenerating}
              uploadProgress={uploadProgress}
              onGenerate={handleGenerate}
              onBack={() => setCurrentStep(3)}
            />
          )}

          {currentStep === 5 && (
            <Step5Content onCreateNew={onBack} />
          )}
        </div>
      </div>
    </div>
  );
}

function Step1Content({
  productUrl,
  setProductUrl,
  productName,
  setProductName,
  productDescription,
  setProductDescription,
  videoFile,
  setVideoFile,
  thumbnailFile,
  setThumbnailFile,
  onNext,
}: {
  productUrl: string;
  setProductUrl: (value: string) => void;
  productName: string;
  setProductName: (value: string) => void;
  productDescription: string;
  setProductDescription: (value: string) => void;
  videoFile: File | null;
  setVideoFile: (file: File | null) => void;
  thumbnailFile: File | null;
  setThumbnailFile: (file: File | null) => void;
  onNext: () => void;
}) {
  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 100MB)
      if (file.size > 100 * 1024 * 1024) {
        alert('Video file size must be less than 100MB');
        return;
      }
      // Check file type
      if (!file.type.startsWith('video/')) {
        alert('Please select a valid video file');
        return;
      }
      setVideoFile(file);
    }
  };

  const handleThumbnailFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Thumbnail file size must be less than 5MB');
        return;
      }
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }
      setThumbnailFile(file);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Ürününüzü Ekleyin</h2>
        <p className="text-gray-600">Ürün bilgilerini sağlayarak başlayın</p>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Örnek Görsel</h3>
        <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Göldeki yansıması ile dağ manzarası"
            className="w-full h-full object-cover"
          />
        </div>
        <p className="text-sm text-gray-600 mt-3">
          Bu, oluşturulan videolarınızın ulaşabileceği görsel kaliteye bir örnektir. Başlamak için aşağıdan kendi içeriğinizi yükleyin.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ürün URL'si
          </label>
          <div className="relative">
            <Link2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="url"
              value={productUrl}
              onChange={(e) => setProductUrl(e.target.value)}
              placeholder="https://ornek.com/urun"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Amazon, Shopify veya herhangi bir e-ticaret sitesinden ürün bağlantısı yapıştırın
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="text-gray-500 text-sm">VEYA</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ürün Adı
          </label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Ürün adını girin"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ürün Açıklaması
          </label>
          <textarea
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            placeholder="Ürününüzün temel özelliklerini ve faydalarını açıklayın..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Video Dosyası Yükle (İsteğe Bağlı)
          </label>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoFileChange}
                className="hidden"
                id="video-upload"
              />
              <label htmlFor="video-upload" className="cursor-pointer">
                <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-1">
                  {videoFile ? videoFile.name : 'Video dosyası yüklemek için tıklayın'}
                </p>
                <p className="text-sm text-gray-500">MP4, MOV, AVI (maks. 100MB)</p>
              </label>
            </div>
            
            {videoFile && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-green-700 text-sm">
                  ✓ Video yüklendi: {videoFile.name} ({(videoFile.size / (1024 * 1024)).toFixed(1)} MB)
                </p>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Küçük Resim Yükle (İsteğe Bağlı)
          </label>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailFileChange}
                className="hidden"
                id="thumbnail-upload"
              />
              <label htmlFor="thumbnail-upload" className="cursor-pointer">
                <ImageIcon className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-1">
                  {thumbnailFile ? thumbnailFile.name : 'Küçük resim yüklemek için tıklayın'}
                </p>
                <p className="text-sm text-gray-500">PNG, JPG, WebP (maks. 5MB)</p>
              </label>
            </div>
            
            {thumbnailFile && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-green-700 text-sm">
                  ✓ Küçük resim yüklendi: {thumbnailFile.name} ({(thumbnailFile.size / (1024 * 1024)).toFixed(1)} MB)
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={onNext}
          disabled={!productUrl && !productName}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Devam Et
        </button>
      </div>
    </div>
  );
}

function Step2Content({
  selectedStyle,
  setSelectedStyle,
  onNext,
  onBack,
}: {
  selectedStyle: string;
  setSelectedStyle: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const styles = [
    { 
      id: 'sokak', 
      name: 'Sokak Stili', 
      description: 'Urban ve otantik sokak kültürü',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3'
    },
    { 
      id: 'spor', 
      name: 'Spor', 
      description: 'Dinamik ve enerjik spor teması',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3'
    },
    { 
      id: 'moda', 
      name: 'Moda', 
      description: 'Şık ve trend moda içerikleri',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3'
    },
    { 
      id: 'doga', 
      name: 'Doğa', 
      description: 'Doğal ve huzurlu ortamlar',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3'
    },
    { 
      id: 'yemek', 
      name: 'Yemek', 
      description: 'Lezzetli yemek sunumları',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?q=80&w=2081&auto=format&fit=crop&ixlib=rb-4.0.3'
    },
    { 
      id: 'yasam', 
      name: 'Yaşam Tarzı', 
      description: 'Modern yaşam ve lifestyle',
      image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3'
    },
    { 
      id: 'is', 
      name: 'İş Dünyası', 
      description: 'Profesyonel iş ortamları',
      image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3'
    },
    { 
      id: 'seyahat', 
      name: 'Seyahat', 
      description: 'Macera ve keşif teması',
      image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=2035&auto=format&fit=crop&ixlib=rb-4.0.3'
    },
    { 
      id: 'teknoloji', 
      name: 'Teknoloji', 
      description: 'Modern teknoloji ve dijital',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?q=80&w=2125&auto=format&fit=crop&ixlib=rb-4.0.3'
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Video Stilini Seçin</h2>
        <p className="text-gray-600">Videonuz için uygun bir stil kategorisi seçin</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {styles.map((style) => {
          const isSelected = selectedStyle === style.id;
          
          return (
            <BackgroundGradient
              key={style.id}
              containerClassName="rounded-2xl h-full w-full"
              className={`p-0 rounded-2xl h-full w-full ${
                isSelected ? 'bg-blue-50 shadow-lg' : 'bg-white'
              }`}
              animate={isSelected}
            >
              <button
                onClick={() => setSelectedStyle(style.id)}
                className="text-left transition-all duration-300 w-full h-full p-0 rounded-2xl overflow-hidden"
              >
                <div className="relative h-48 w-full">
                  <img
                    src={style.image}
                    alt={style.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  
                  {/* Content overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-bold text-white text-lg mb-1">{style.name}</h3>
                    <p className="text-white/90 text-sm leading-tight">{style.description}</p>
                  </div>
                  
                  {/* Selection indicator */}
                  {isSelected && (
                    <div className="absolute top-3 right-3 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </button>
            </BackgroundGradient>
          );
        })}
      </div>

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Geri
        </button>
        <button
          onClick={onNext}
          disabled={!selectedStyle}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Devam Et
        </button>
      </div>
    </div>
  );
}

function Step3Content({
  selectedVoice,
  setSelectedVoice,
  onNext,
  onBack,
}: {
  selectedVoice: string;
  setSelectedVoice: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const voices = [
    { id: 'sarah', name: 'Sarah', accent: 'Amerikan İngilizcesi', gender: 'Kadın', tone: 'Samimi' },
    { id: 'james', name: 'James', accent: 'İngiliz İngilizcesi', gender: 'Erkek', tone: 'Profesyonel' },
    { id: 'maria', name: 'Maria', accent: 'İspanyolca', gender: 'Kadın', tone: 'Sıcak' },
    { id: 'alex', name: 'Alex', accent: 'Amerikan İngilizcesi', gender: 'Erkek', tone: 'Enerjik' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Ses ve Senaryo</h2>
        <p className="text-gray-600">Bir ses seçin ve senaryonuzu özelleştirin</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Ses Seç
        </label>
        <div className="grid md:grid-cols-2 gap-4">
          {voices.map((voice) => {
            const isSelected = selectedVoice === voice.id;
            
            return (
              <BackgroundGradient
                key={voice.id}
                containerClassName="rounded-2xl h-full w-full"
                className={`p-6 rounded-2xl h-full w-full flex flex-col justify-between ${
                  isSelected ? 'bg-blue-50 shadow-lg' : 'bg-white'
                }`}
                animate={isSelected}
              >
                <button
                  onClick={() => setSelectedVoice(voice.id)}
                  className="text-left transition-all duration-300 w-full h-full"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{voice.name}</h3>
                      <p className="text-sm text-gray-600">{voice.accent}</p>
                    </div>
                    <Mic className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="flex space-x-2 text-xs">
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded">{voice.gender}</span>
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded">{voice.tone}</span>
                  </div>
                  
                  {isSelected && (
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mt-2">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>
              </BackgroundGradient>
            );
          })}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Video Senaryosu
          </label>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1">
            <Sparkles className="w-4 h-4" />
            <span>AI ile Oluştur</span>
          </button>
        </div>
        <textarea
          placeholder="Senaryonuzu girin veya AI'nın sizin için bir tane oluşturmasına izin verin..."
          rows={6}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          defaultValue="Günlük ihtiyaçlarınız için nihai çözümü tanıtıyoruz. Bu yenilikçi ürün, eşsiz bir deneyim sunmak için son teknoloji ile zarif tasarımı birleştiriyor. Bu oyun değiştiren teklifi kaçırmayın!"
        />
      </div>

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Geri
        </button>
        <button
          onClick={onNext}
          disabled={!selectedVoice}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Devam Et
        </button>
      </div>
    </div>
  );
}

function Step4Content({
  productName,
  selectedStyle,
  selectedVoice,
  isGenerating,
  uploadProgress,
  onGenerate,
  onBack,
}: {
  productName: string;
  selectedStyle: string;
  selectedVoice: string;
  isGenerating: boolean;
  uploadProgress: number;
  onGenerate: () => void;
  onBack: () => void;
}) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">İncele ve Oluştur</h2>
        <p className="text-gray-600">Videoyu oluşturmadan önce seçimlerinizi kontrol edin</p>
      </div>

      <div className="bg-gray-50 rounded-xl p-6 space-y-4">
        <ReviewItem label="Ürün" value={productName || 'Premium Ürün'} />
        <ReviewItem label="Stil" value={selectedStyle || 'modern'} />
        <ReviewItem label="Ses" value={selectedVoice || 'sarah'} />
        <ReviewItem label="Süre" value="15-30 saniye" />
        <ReviewItem label="Format" value="16:9 (1080p)" />
      </div>

      <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center border border-gray-200">
        <div className="text-center">
          <Eye className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Video önizlemesi burada görünecek</p>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onBack}
          disabled={isGenerating}
          className="border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Geri
        </button>
        <button
          onClick={onGenerate}
          disabled={isGenerating}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white px-8 py-3 rounded-lg font-medium transition-colors inline-flex items-center space-x-2"
        >
          {isGenerating ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>
                {uploadProgress > 0 ? `Yükleniyor... ${uploadProgress}%` : 'Oluşturuluyor...'}
              </span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Video Oluştur</span>
            </>
          )}
        </button>
      </div>
      
      {isGenerating && uploadProgress > 0 && (
        <div className="mt-4">
          <div className="bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2 text-center">
            Dosyalar yükleniyor... {uploadProgress}%
          </p>
        </div>
      )}
    </div>
  );
}

function Step5Content({ onCreateNew }: { onCreateNew: () => void }) {
  return (
    <div className="space-y-8 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Video Başarıyla Oluşturuldu!</h2>
        <p className="text-gray-600">Video reklamınız kullanıma hazır</p>
      </div>

      <div className="aspect-video bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center border border-blue-200 max-w-3xl mx-auto">
        <div className="text-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Play className="w-10 h-10 text-blue-500" fill="currentColor" />
          </div>
          <p className="text-gray-700 font-medium">Oluşturulan Videonuz</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center justify-center space-x-2">
          <Download className="w-5 h-5" />
          <span>İndir</span>
        </button>
        <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center justify-center space-x-2">
          <Share2 className="w-5 h-5" />
          <span>Paylaş</span>
        </button>
        <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center justify-center space-x-2">
          <Edit className="w-5 h-5" />
          <span>Düzenle</span>
        </button>
      </div>

      <button
        onClick={onCreateNew}
        className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium transition-colors"
      >
        Başka Bir Video Oluştur
      </button>
    </div>
  );
}

function ReviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-600 font-medium">{label}</span>
      <span className="text-gray-900 font-semibold capitalize">{value}</span>
    </div>
  );
}
