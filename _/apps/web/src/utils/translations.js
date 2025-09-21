const translateToHindi = (text) => {
  const hindiTranslations = {
    "Your scan shows": "आपका स्कैन दिखाता है",
    "kidney stones detected": "किडनी स्टोन का पता लगाया गया",
    "The largest stone is": "सबसे बड़ा पत्थर है",
    centimeters: "सेंटीमीटर",
    "Your risk level is": "आपका जोखिम स्तर है",
    high: "उच्च",
    medium: "मध्यम",
    low: "कम",
  };

  let translated = text;
  Object.entries(hindiTranslations).forEach(([en, hi]) => {
    translated = translated.replace(new RegExp(en, "gi"), hi);
  });
  return translated;
};

const translateToTelugu = (text) => {
  const teluguTranslations = {
    "Your scan shows": "మీ స్కాన్ చూపిస్తుంది",
    "kidney stones detected": "కిడ్నీ రాళ్లు గుర్తించబడ్డాయి",
    "The largest stone is": "అతిపెద్ద రాయి ఉంది",
    centimeters: "సెంటీమీటర్లు",
    "Your risk level is": "మీ ప్రమాద స్థాయి ఉంది",
    high: "అధిక",
    medium: "మధ్యస్థ",
    low: "తక్కువ",
  };

  let translated = text;
  Object.entries(teluguTranslations).forEach(([en, te]) => {
    translated = translated.replace(new RegExp(en, "gi"), te);
  });
  return translated;
};

export const translateText = (text, language) => {
  const translations = {
    en: text,
    hi: translateToHindi(text),
    te: translateToTelugu(text),
  };
  return translations[language] || text;
};

export const languages = {
  en: { name: "English", voice: "en-US" },
  hi: { name: "हिंदी", voice: "hi-IN" },
  te: { name: "తెలుగు", voice: "te-IN" },
};
