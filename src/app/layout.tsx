
"use client"; 

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Link from 'next/link';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Stethoscope, Search, CalendarDays, LayoutDashboard, LogIn, UserPlus, MessageSquareText, Languages, Video } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';
import { LanguageProvider, useLanguage, type Language } from '@/contexts/language-context';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// Note: Metadata export is for Server Components. For Client Components,
// you might need to handle title/description differently (e.g., using `document.title` in useEffect or a Head component)
// For this example, we'll leave it, but be aware for full client-side rendering.
// REMOVED metadata export

// Inner layout component that uses the language context
function AppLayout({ children }: { children: React.ReactNode }) {
  const { currentLanguage, setCurrentLanguage, translations } = useLanguage();

  const toggleLanguage = () => {
    setCurrentLanguage(prev => {
      if (prev === 'en') return 'fr';
      if (prev === 'fr') return 'wo';
      return 'en';
    });
  };

  const t = translations[currentLanguage];

  return (
    <html lang={currentLanguage}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}>
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-primary">
              <Stethoscope className="h-7 w-7" />
              <span>MediLingua Connect</span>
            </Link>
            <nav className="hidden md:flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
              <Link href="/" className="font-medium text-muted-foreground transition-colors hover:text-primary">
                {t.home}
              </Link>
              <Link href="/chat" className="font-medium text-muted-foreground transition-colors hover:text-primary flex items-center gap-1">
                 <MessageSquareText className="h-4 w-4" /> {t.chat}
              </Link>
              <Link href="/find-a-doctor" className="font-medium text-muted-foreground transition-colors hover:text-primary flex items-center gap-1">
                <Search className="h-4 w-4" /> {t.findDoctor}
              </Link>
              <Link href="/appointments" className="font-medium text-muted-foreground transition-colors hover:text-primary flex items-center gap-1">
                <CalendarDays className="h-4 w-4" /> {t.appointments}
              </Link>
               <Link href="/video-consultation" className="font-medium text-muted-foreground transition-colors hover:text-primary flex items-center gap-1">
                <Video className="h-4 w-4" /> {t.videoCall}
              </Link>
              <Link href="/dashboard/patient" className="font-medium text-muted-foreground transition-colors hover:text-primary flex items-center gap-1">
                <LayoutDashboard className="h-4 w-4" /> {t.dashboard}
              </Link>
              <div className="flex items-center gap-x-3">
                <Link href="/login" className="font-medium text-muted-foreground transition-colors hover:text-primary flex items-center gap-1">
                  <LogIn className="h-4 w-4" /> {t.login}
                </Link>
                <Link href="/register" className="font-medium text-primary transition-colors hover:text-primary/80 flex items-center gap-1">
                  <UserPlus className="h-4 w-4" /> {t.signUp}
                </Link>
                <Button variant="outline" size="sm" onClick={toggleLanguage} className="flex items-center gap-1">
                  <Languages className="h-4 w-4" /> 
                  <span className="uppercase">{currentLanguage}</span>
                </Button>
              </div>
            </nav>
            <div className="md:hidden">
              <Button variant="outline" size="icon" onClick={toggleLanguage} title={t.language}>
                  <Languages className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>
        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>
        <Toaster />
        <footer className="py-6 md:px-8 md:py-0 border-t">
          <div className="container flex flex-col items-center justify-center gap-4 md:h-20 md:flex-row">
            <p className="text-balance text-center text-sm leading-loose text-muted-foreground">
              &copy; {new Date().getFullYear()} MediLingua Connect. All rights reserved.
              {/* This footer text would also need translation in a full i18n setup */}
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}

// RootLayout now wraps AppLayout with LanguageProvider
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LanguageProvider>
      <AppLayout>{children}</AppLayout>
    </LanguageProvider>
  );
}
