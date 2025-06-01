
"use client";

import { Link, useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Stethoscope, Search, CalendarDays, LayoutDashboard, LogIn, UserPlus, MessageSquareText, Languages, Video, LogOut, UserCircle as UserIcon } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context'; // Import useAuth
import type { Language } from '@/i18n'; 

export function SiteHeader() {
  const t = useTranslations('Global');
  const locale = useLocale() as Language;
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, loading: authLoading } = useAuth(); // Get user and logout from AuthContext

  const toggleLanguage = () => {
    let nextLocale: Language = 'en';
    if (locale === 'en') nextLocale = 'fr';
    else if (locale === 'fr') nextLocale = 'wo';
    else nextLocale = 'en';
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-primary">
          <Stethoscope className="h-7 w-7" />
          <span>MediLingua Connect</span>
        </Link>
        <nav className="hidden md:flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
          <Link href="/" className="font-medium text-muted-foreground transition-colors hover:text-primary">
            {t('home')}
          </Link>
          <Link href="/chat" className="font-medium text-muted-foreground transition-colors hover:text-primary flex items-center gap-1">
            <MessageSquareText className="h-4 w-4" /> {t('chat')}
          </Link>
          <Link href="/find-a-doctor" className="font-medium text-muted-foreground transition-colors hover:text-primary flex items-center gap-1">
            <Search className="h-4 w-4" /> {t('findDoctor')}
          </Link>
          <Link href="/appointments" className="font-medium text-muted-foreground transition-colors hover:text-primary flex items-center gap-1">
            <CalendarDays className="h-4 w-4" /> {t('appointments')}
          </Link>
          <Link href="/video-consultation" className="font-medium text-muted-foreground transition-colors hover:text-primary flex items-center gap-1">
            <Video className="h-4 w-4" /> {t('videoCall')}
          </Link>
          <Link href="/dashboard" className="font-medium text-muted-foreground transition-colors hover:text-primary flex items-center gap-1">
            <LayoutDashboard className="h-4 w-4" /> {t('dashboard')}
          </Link>
          
          <div className="flex items-center gap-x-3">
            {!authLoading && user ? (
              <>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <UserIcon className="h-4 w-4" /> 
                  {user.email}
                </span>
                <Button variant="outline" size="sm" onClick={logout} className="flex items-center gap-1">
                  <LogOut className="h-4 w-4" /> {t('logout')}
                </Button>
              </>
            ) : !authLoading ? (
              <>
                <Link href="/login" className="font-medium text-muted-foreground transition-colors hover:text-primary flex items-center gap-1">
                  <LogIn className="h-4 w-4" /> {t('login')}
                </Link>
                <Link href="/register" className="font-medium text-primary transition-colors hover:text-primary/80 flex items-center gap-1">
                  <UserPlus className="h-4 w-4" /> {t('signUp')}
                </Link>
              </>
            ) : null} {/* Optionally show a loader during authLoading */}

            <Button variant="outline" size="sm" onClick={toggleLanguage} className="flex items-center gap-1">
              <Languages className="h-4 w-4" />
              <span className="uppercase">{locale}</span>
            </Button>
          </div>
        </nav>
        <div className="md:hidden flex items-center gap-2">
          {user && (
             <Button variant="ghost" size="icon" onClick={logout} title={t('logout')}>
                <LogOut className="h-5 w-5 text-primary" />
            </Button>
          )}
          <Button variant="outline" size="icon" onClick={toggleLanguage} title={t('language')}>
            <Languages className="h-5 w-5" />
          </Button>
          {/* Add a mobile menu trigger here if needed, e.g., using Sheet component */}
        </div>
      </div>
    </header>
  );
}
