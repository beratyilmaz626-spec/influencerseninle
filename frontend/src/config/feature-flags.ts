// Feature Flags Configuration
// Bu dosya, yeni özelliklerin açılıp kapatılmasını kontrol eder
// Mevcut yapıyı bozmadan yeni özellikler eklemek için kullanılır

export const FEATURE_FLAGS = {
  // Ses seçimi özelliği - Video oluşturmada ses/seslendirme seçimi
  VOICE_SELECTION: true, // TEST: Temporarily enabled for testing
  
  // Video oluşturma sihirbazı - Çok adımlı wizard UI
  VIDEO_CREATION_WIZARD: false,
  
  // Gelecekteki özellikler için placeholder
  // ADVANCED_ANALYTICS: false,
  // TEAM_COLLABORATION: false,
} as const;

// Feature flag helper fonksiyonları
export function isFeatureEnabled(feature: keyof typeof FEATURE_FLAGS): boolean {
  return FEATURE_FLAGS[feature] === true;
}

// Tüm aktif özellikleri listele
export function getActiveFeatures(): string[] {
  return Object.entries(FEATURE_FLAGS)
    .filter(([_, enabled]) => enabled)
    .map(([name]) => name);
}
