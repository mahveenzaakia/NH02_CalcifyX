import { useState } from "react";
import { translateText, languages } from "@/utils/translations";

export function useTextToSpeech(defaultLanguage = "en") {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentUtterance, setCurrentUtterance] = useState(null);

  const handleTextToSpeech = (text, language = defaultLanguage) => {
    if ("speechSynthesis" in window) {
      if (currentUtterance) {
        speechSynthesis.cancel();
        setCurrentUtterance(null);
        setIsPlaying(false);
      }

      const utterance = new SpeechSynthesisUtterance();
      const translatedText = translateText(text, language);
      utterance.text = translatedText;
      utterance.lang = languages[language].voice;
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 1;

      const voices = speechSynthesis.getVoices();
      const voice = voices.find((v) =>
        v.lang.startsWith(
          language === "hi" ? "hi" : language === "te" ? "te" : "en"
        )
      );
      if (voice) utterance.voice = voice;

      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => {
        setIsPlaying(false);
        setCurrentUtterance(null);
      };
      utterance.onerror = () => {
        setIsPlaying(false);
        setCurrentUtterance(null);
      };

      setCurrentUtterance(utterance);
      speechSynthesis.speak(utterance);
    }
  };

  const stopSpeech = () => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
      setIsPlaying(false);
      setCurrentUtterance(null);
    }
  };

  return { isPlaying, handleTextToSpeech, stopSpeech };
}
