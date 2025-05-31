"use client";

import { useState, useEffect, useCallback } from 'react';

interface SpeechSynthesisHook {
  speak: (text: string, lang: string) => void;
  cancel: () => void;
  isSpeaking: boolean;
  isSupported: (lang: string) => boolean;
  supportedVoices: SpeechSynthesisVoice[];
}

export function useSpeechSynthesis(): SpeechSynthesisHook {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [supportedVoices, setSupportedVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setSupportedVoices(voices);
    };

    // Voices might not be loaded immediately.
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
      // Ensure any ongoing speech is cancelled when component unmounts
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);
  
  const isSupported = useCallback((lang: string): boolean => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      return false;
    }
    // A basic check, actual language support might be more nuanced.
    // For Wolof ('wo'), it's highly unlikely to be supported natively.
    if (lang.toLowerCase() === 'wo') return false; 
    
    return supportedVoices.some(voice => voice.lang.startsWith(lang));
  }, [supportedVoices]);


  const speak = useCallback((text: string, lang: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      console.warn('Speech synthesis not supported.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel(); // Cancel current speech before starting new one
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Try to find a voice for the specified language
    const voice = supportedVoices.find(v => v.lang.startsWith(lang));
    if (voice) {
      utterance.voice = voice;
    } else {
      // Fallback if specific language voice not found, browser might pick default
      utterance.lang = lang; 
    }
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
    };
    
    window.speechSynthesis.speak(utterance);
  }, [isSpeaking, supportedVoices]);

  const cancel = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return { speak, cancel, isSpeaking, isSupported, supportedVoices };
}
