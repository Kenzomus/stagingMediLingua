
import type { Metadata } from 'next';
import { NextIntlClientProvider, useMessages } from 'next-intl';
import { Geist, Geist_Mono } from 'next/font/google';
import { Toaster } from "@/components/ui/toaster";
import React from 'react';
import '../globals.css'; // Assuming globals.css is in src/app
import { SiteHeader } from '@/components/site-header';
import { AuthProvider } from '@/contexts/auth-context'; // Import AuthProvider

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// Note: This metadata is for the generic layout. 
// More specific metadata can be added in page.tsx files.
export const metadata: Metadata = {
  title: 'MediLingua Connect',
  description: 'AI-powered multilingual telehealth assistant',
};

interface RootLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default function RootLayout({
  children,
  params: { locale },
}: Readonly<RootLayoutProps>) {
  const messages = useMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen bg-background text-foreground`}>
        <NextIntlClientProvider locale={locale} messages={messages} key={locale}>
          <AuthProvider> {/* Wrap with AuthProvider */}
            <SiteHeader />
            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>
            <Toaster />
            <footer className="py-6 md:px-8 md:py-0 border-t">
              <div className="container flex flex-col items-center justify-center gap-4 md:h-20 md:flex-row">
                <p className="text-balance text-center text-sm leading-loose text-muted-foreground">
                  &copy; {new Date().getFullYear()} MediLingua Connect. {/* TODO: Translate "All rights reserved." */}
                </p>
              </div>
            </footer>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
