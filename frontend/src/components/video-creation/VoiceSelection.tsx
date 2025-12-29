import { useState } from 'react';
import { Mic, Play, Pause, Volume2 } from 'lucide-react';
import { motion } from 'framer-motion';

export interface VoiceOption {
  id: string;
  name: string;
  gender: 'Kadın' | 'Erkek';
  accent: string;
  tone: string;
  description: string;
  previewUrl?: string;
}

// Varsayılan ses seçenekleri
export const DEFAULT_VOICE_OPTIONS: VoiceOption[] = [
  {
    id: 'ayse',
    name: 'Ayşe',
    gender: 'Kadın',
    accent: 'Türkçe - İstanbul',
    tone: 'Samimi',
    description: 'Sıcak ve samimi bir kadın sesi, günlük konuşma tarzı'
  },
  {
    id: 'mehmet',
    name: 'Mehmet',
    gender: 'Erkek',
    accent: 'Türkçe - İstanbul',
    tone: 'Profesyonel',
    description: 'Güven veren profesyonel erkek sesi'
  },
  {
    id: 'elif',
    name: 'Elif',
    gender: 'Kadın',
    accent: 'Türkçe - Ankara',
    tone: 'Enerjik',
    description: 'Dinamik ve enerjik genç kadın sesi'
  },
  {
    id: 'can',
    name: 'Can',
    gender: 'Erkek',
    accent: 'Türkçe - İzmir',
    tone: 'Rahat',
    description: 'Rahat ve doğal erkek sesi, arkadaş canlısı'
  },
  {
    id: 'zeynep',
    name: 'Zeynep',
    gender: 'Kadın',
    accent: 'Türkçe - Antalya',
    tone: 'Soft',
    description: 'Yumuşak ve sakin kadın sesi, huzur verici'
  },
  {
    id: 'ali',
    name: 'Ali',
    gender: 'Erkek',
    accent: 'Türkçe - İstanbul',
    tone: 'Canlı',
    description: 'Canlı ve heyecanlı erkek sesi, motivasyon verici'
  },
];

interface VoiceSelectionProps {
  selectedVoice: string | null;
  onSelectVoice: (voiceId: string) => void;
  voices?: VoiceOption[];
  disabled?: boolean;
}

export default function VoiceSelection({
  selectedVoice,
  onSelectVoice,
  voices = DEFAULT_VOICE_OPTIONS,
  disabled = false
}: VoiceSelectionProps) {
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);
  const [filterGender, setFilterGender] = useState<'all' | 'Kadın' | 'Erkek'>('all');

  const filteredVoices = filterGender === 'all' 
    ? voices 
    : voices.filter(v => v.gender === filterGender);

  const handlePlayPreview = (voiceId: string) => {
    if (playingVoice === voiceId) {
      setPlayingVoice(null);
    } else {
      setPlayingVoice(voiceId);
      // Simüle edilmiş önizleme - gerçek implementasyonda ses dosyası çalınır
      setTimeout(() => setPlayingVoice(null), 3000);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Volume2 className="w-5 h-5 text-accent-primary" />
          <h3 className="text-sm font-semibold text-text-primary">🎙️ Ses Seçimi</h3>
        </div>
        
        {/* Gender Filter */}
        <div className="flex gap-1 bg-surface/50 rounded-lg p-1">
          {(['all', 'Kadın', 'Erkek'] as const).map((gender) => (
            <button
              key={gender}
              onClick={() => setFilterGender(gender)}
              disabled={disabled}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                filterGender === gender
                  ? 'bg-accent-primary text-white'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-elevated'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {gender === 'all' ? 'Tümü' : gender}
            </button>
          ))}
        </div>
      </div>

      {/* Voice Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-2">
        {filteredVoices.map((voice) => {
          const isSelected = selectedVoice === voice.id;
          const isPlaying = playingVoice === voice.id;

          return (
            <motion.div
              key={voice.id}
              whileHover={{ scale: disabled ? 1 : 1.02 }}
              whileTap={{ scale: disabled ? 1 : 0.98 }}
              onClick={() => !disabled && onSelectVoice(voice.id)}
              className={`relative p-3 rounded-xl cursor-pointer transition-all border-2 ${
                isSelected
                  ? 'border-accent-primary bg-accent-primary/10 shadow-lg shadow-accent-primary/20'
                  : 'border-white/10 bg-surface-elevated/50 hover:border-white/20'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-text-primary text-sm">{voice.name}</span>
                    <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                      voice.gender === 'Kadın' 
                        ? 'bg-pink-500/20 text-pink-400' 
                        : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {voice.gender}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary mb-1">{voice.accent}</p>
                  <p className="text-xs text-text-muted line-clamp-2">{voice.description}</p>
                </div>

                {/* Preview Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!disabled) handlePlayPreview(voice.id);
                  }}
                  disabled={disabled}
                  className={`p-2 rounded-lg transition-all ${
                    isPlaying
                      ? 'bg-accent-primary text-white'
                      : 'bg-surface hover:bg-surface-elevated text-text-secondary hover:text-text-primary'
                  } ${disabled ? 'cursor-not-allowed' : ''}`}
                  title="Önizle"
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Selection Indicator */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-5 h-5 bg-accent-primary rounded-full flex items-center justify-center"
                >
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </motion.div>
              )}

              {/* Playing Indicator */}
              {isPlaying && (
                <div className="absolute bottom-2 left-2 flex gap-0.5">
                  {[1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      animate={{
                        height: [4, 12, 4],
                      }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        delay: i * 0.1,
                      }}
                      className="w-1 bg-accent-primary rounded-full"
                    />
                  ))}
                </div>
              )}

              {/* Tone Badge */}
              <div className="absolute bottom-2 right-2">
                <span className="px-2 py-0.5 text-xs bg-surface/80 backdrop-blur-sm rounded-full text-text-secondary">
                  {voice.tone}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Selected Voice Info */}
      {selectedVoice && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-xl bg-accent-primary/10 border border-accent-primary/30"
        >
          <div className="flex items-center gap-2">
            <Mic className="w-4 h-4 text-accent-primary" />
            <span className="text-sm text-text-primary">
              Seçilen Ses: <strong>{voices.find(v => v.id === selectedVoice)?.name}</strong>
            </span>
          </div>
        </motion.div>
      )}

      {/* No Voice Option */}
      <button
        onClick={() => !disabled && onSelectVoice('')}
        disabled={disabled}
        className={`w-full p-3 rounded-xl border-2 border-dashed transition-all text-center ${
          selectedVoice === ''
            ? 'border-accent-primary bg-accent-primary/10 text-accent-primary'
            : 'border-white/10 text-text-secondary hover:border-white/20 hover:text-text-primary'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <span className="text-sm">🔇 Seslendirme Olmasın</span>
      </button>
    </div>
  );
}
