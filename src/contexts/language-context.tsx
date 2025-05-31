
"use client";

import type { Dispatch, ReactNode, SetStateAction } from 'react';
import React, { createContext, useContext, useState } from 'react';

export type Language = 'en' | 'fr' | 'wo';

interface LanguageContextType {
  currentLanguage: Language;
  setCurrentLanguage: Dispatch<SetStateAction<Language>>;
  translations: Record<Language, Record<string, string>>; // General translations for common terms
}

const defaultTranslations: Record<Language, Record<string, string>> = {
  en: {
    home: 'Home',
    chat: 'Chat Assistant',
    findDoctor: 'Find a Doctor',
    appointments: 'Appointments',
    videoCall: 'Video Call',
    dashboard: 'Dashboard',
    login: 'Login',
    signUp: 'Sign Up',
    language: 'Language',
    // Add more common terms if needed
  },
  fr: {
    home: 'Accueil',
    chat: 'Assistant IA',
    findDoctor: 'Trouver un Médecin',
    appointments: 'Rendez-vous',
    videoCall: 'Appel Vidéo',
    dashboard: 'Tableau de Bord',
    login: 'Connexion',
    signUp: 'Inscription',
    language: 'Langue',
  },
  wo: {
    home: 'Kër Gi',
    chat: 'Waxtaan ak AI bi',
    findDoctor: 'Wër Doktor',
    appointments: 'Diggante Yi',
    videoCall: 'Woote Widewo',
    dashboard: 'Xëttali',
    login: 'Dugg',
    signUp: 'Bindu',
    language: 'Làkk',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');

  const value = {
    currentLanguage,
    setCurrentLanguage,
    translations: defaultTranslations, // Provide general translations
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
