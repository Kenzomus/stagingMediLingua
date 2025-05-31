
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquareText, Languages, UserCheck, Search as SearchIcon, Video, CalendarCheck } from 'lucide-react'; // Renamed Search to SearchIcon
import Image from 'next/image';
import { useLanguage, type Language } from '@/contexts/language-context';

const landingPageTranslations: Record<Language, Record<string, string>> = {
  en: {
    mainHeading: "Welcome to MediLingua Connect",
    subHeading: "Your AI-powered multilingual telehealth assistant. Get medical information, find doctors, schedule appointments, and more – in Wolof, French, and English.",
    startChatButton: "Start Chat Assistant",
    findDoctorButton: "Find a Doctor",
    coreFeaturesTitle: "Core Features",
    multilingualSupportTitle: "Multilingual Support",
    multilingualSupportDesc: "Communicate in Wolof, French, or English. Our platform is designed for seamless multilingual interaction.",
    aiChatAssistantTitle: "AI Chat Assistant",
    aiChatAssistantDesc: "Get answers to medical questions via text or voice. Our AI transcribes audio and provides spoken responses.",
    portalsTitle: "Patient & Doctor Portals",
    portalsDesc: "Manage appointments, view profiles, and access your health information easily through dedicated dashboards.",
    bridgeTitle: "Bridging Language Gaps in Healthcare",
    bridgeDesc: "Visualizing a healthier, more connected world.",
    bridgePara: "MediLingua Connect aims to make healthcare information accessible to everyone, regardless of language barriers. Our platform is designed with empathy and built with cutting-edge technology to serve diverse communities.",
    upcomingFeaturesTitle: "Upcoming Features",
    advancedSearchTitle: "Advanced Doctor Search",
    advancedSearchDesc: "Find doctors by specialty, location (including 'near me'), and languages spoken.",
    videoConsultationsTitle: "Video Consultations",
    videoConsultationsDesc: "Connect with healthcare professionals through secure video calls directly on the platform.",
    appointmentSchedulingTitle: "Appointment Scheduling",
    appointmentSchedulingDesc: "Easily book, manage, and get reminders for your medical appointments.",
    comingSoon: "(Coming Soon)",
  },
  fr: {
    mainHeading: "Bienvenue sur MediLingua Connect",
    subHeading: "Votre assistant de télésanté multilingue alimenté par l'IA. Obtenez des informations médicales, trouvez des médecins, planifiez des rendez-vous, et plus encore – en Wolof, Français et Anglais.",
    startChatButton: "Démarrer l'Assistant IA",
    findDoctorButton: "Trouver un Médecin",
    coreFeaturesTitle: "Fonctionnalités Principales",
    multilingualSupportTitle: "Support Multilingue",
    multilingualSupportDesc: "Communiquez en Wolof, Français ou Anglais. Notre plateforme est conçue pour une interaction multilingue fluide.",
    aiChatAssistantTitle: "Assistant IA",
    aiChatAssistantDesc: "Obtenez des réponses aux questions médicales par texte ou par voix. Notre IA transcrit l'audio et fournit des réponses vocales.",
    portalsTitle: "Portails Patient & Médecin",
    portalsDesc: "Gérez les rendez-vous, consultez les profils et accédez facilement à vos informations de santé via des tableaux de bord dédiés.",
    bridgeTitle: "Combler les Écarts Linguistiques dans les Soins de Santé",
    bridgeDesc: "Visualiser un monde plus sain et plus connecté.",
    bridgePara: "MediLingua Connect vise à rendre les informations sur les soins de santé accessibles à tous, quelles que soient les barrières linguistiques. Notre plateforme est conçue avec empathie et construite avec une technologie de pointe pour servir diverses communautés.",
    upcomingFeaturesTitle: "Fonctionnalités à Venir",
    advancedSearchTitle: "Recherche Avancée de Médecins",
    advancedSearchDesc: "Trouvez des médecins par spécialité, lieu (y compris 'près de chez moi') et langues parlées.",
    videoConsultationsTitle: "Consultations Vidéo",
    videoConsultationsDesc: "Connectez-vous avec des professionnels de la santé via des appels vidéo sécurisés directement sur la plateforme.",
    appointmentSchedulingTitle: "Planification de Rendez-vous",
    appointmentSchedulingDesc: "Réservez, gérez et recevez facilement des rappels pour vos rendez-vous médicaux.",
    comingSoon: "(Bientôt disponible)",
  },
  wo: {
    mainHeading: "Dalal-jàmm ci MediLingua Connect",
    subHeading: "Sa aparey tele-sañte bu bari-làkk bu AI toppatoo. Am xibaari faj, gis doktoor, jël diggante, ak yeneen – ci Wolof, Faranse, ak Angale.",
    startChatButton: "Dorr Waxtaan ak AI bi",
    findDoctorButton: "Wër Doktor",
    coreFeaturesTitle: "Li Ci Gëna Am Solo",
    multilingualSupportTitle: "Kàttanu Bari-Làkk",
    multilingualSupportDesc: "Waxleen ci Wolof, Faranse, mbaa Angale. Sunu jumtukaay defarees nañ ko ngir nga mën cee waxtaane ci ay làkk yu wuute.",
    aiChatAssistantTitle: "AI buy Waxtaan",
    aiChatAssistantDesc: "Am ay tontu ci laajiy faj jaare ko ci mbind mbaa baat. Sunu AI dafay dégg baat bi, bind ko, teg ca tontu ci baat.",
    portalsTitle: "Xëti Wopp ak Doktoor",
    portalsDesc: "Saytuleen diggante yi, seet profiil yi, te yégg seeni xibaari wérgi-yaram ci anam bu yomb jaare ko ci ay xët yu ñu leen jagleel.",
    bridgeTitle: "Dindi Kàcc-kàcci Làkk ci Wàllu Faj",
    bridgeDesc: "Xool addina bu gëna wér ak bu gëna booloo.",
    bridgePara: "MediLingua Connect am na coobare ngir jagleel képp ku soxla xibaar ci wàllu wérgi-yaram, fu mu mën ti doon ak làkk wu mu mën ti làkk. Sunu jumtukaay, defar nañu ko ci yërmande te jëfandikoo xarala gu yees ngir mën a toppatoo mbooloo yu bari.",
    upcomingFeaturesTitle: "Yu Fiy Ñëw",
    advancedSearchTitle: "Ceftu Doktoor bu Xóot",
    advancedSearchDesc: "Wër ay doktoor jaarale ko ci seen spesiyalite, fu ñu nekk (bokk na ci 'fi ma gëna jege'), ak làkk yi ñu làkk.",
    videoConsultationsTitle: "Seetante ci Widewo",
    videoConsultationsDesc: "Jokkooleen ak borom xam-xam ci wàllu wérgi-yaram jaare ko ci ay woote widewo yu suturaal ci biir jumtukaay bi.",
    appointmentSchedulingTitle: "Jël ay Diggante",
    appointmentSchedulingDesc: "Jël, saytu, te fàttaliku say digganteey faj ci anam bu yomb.",
    comingSoon: "(Fii ak Gannaaw)",
  }
};

export function LandingPageContent() {
  const { currentLanguage } = useLanguage();
  const t = landingPageTranslations[currentLanguage];

  return (
    <div className="flex flex-col items-center justify-center space-y-12">
      <section className="text-center space-y-6 pt-8">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl md:text-6xl">
          {t.mainHeading}
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-muted-foreground sm:text-xl">
          {t.subHeading}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="shadow-lg hover:shadow-xl transition-shadow">
            <Link href="/chat">
              <MessageSquareText className="mr-2 h-5 w-5" /> {t.startChatButton}
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="shadow-lg hover:shadow-xl transition-shadow">
            <Link href="/find-a-doctor">
               <SearchIcon className="mr-2 h-5 w-5" /> {t.findDoctorButton}
            </Link>
          </Button>
        </div>
      </section>

      <section id="features" className="w-full max-w-5xl py-12">
        <h2 className="text-3xl font-bold text-center mb-10 text-primary">{t.coreFeaturesTitle}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Languages className="h-10 w-10 text-accent" />}
            title={t.multilingualSupportTitle}
            description={t.multilingualSupportDesc}
          />
          <FeatureCard
            icon={<MessageSquareText className="h-10 w-10 text-accent" />}
            title={t.aiChatAssistantTitle}
            description={t.aiChatAssistantDesc}
          />
          <FeatureCard
            icon={<UserCheck className="h-10 w-10 text-accent" />} 
            title={t.portalsTitle}
            description={t.portalsDesc}
            comingSoonText={t.comingSoon}
            isComingSoon // Assuming this feature is still under development as per previous context
          />
        </div>
      </section>
      
      <section className="w-full max-w-4xl py-12 text-center">
         <Card className="overflow-hidden shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">{t.bridgeTitle}</CardTitle>
            <CardDescription>{t.bridgeDesc}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-video w-full">
              <Image 
                src="https://placehold.co/800x450/F0F4F8/64B5F6" 
                alt="Diverse group of people and medical professionals" 
                layout="fill"
                objectFit="cover"
                className="rounded-md"
                data-ai-hint="healthcare diversity"
              />
            </div>
            <p className="mt-6 text-muted-foreground">
             {t.bridgePara}
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="w-full max-w-5xl py-12">
        <h2 className="text-3xl font-bold text-center mb-10 text-primary">{t.upcomingFeaturesTitle}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<SearchIcon className="h-10 w-10 text-gray-400" />}
            title={t.advancedSearchTitle}
            description={t.advancedSearchDesc}
            comingSoonText={t.comingSoon}
            isComingSoon
          />
          <FeatureCard
            icon={<Video className="h-10 w-10 text-gray-400" />}
            title={t.videoConsultationsTitle}
            description={t.videoConsultationsDesc}
            comingSoonText={t.comingSoon}
            isComingSoon
          />
          <FeatureCard
            icon={<CalendarCheck className="h-10 w-10 text-gray-400" />}
            title={t.appointmentSchedulingTitle}
            description={t.appointmentSchedulingDesc}
            comingSoonText={t.comingSoon}
            isComingSoon
          />
        </div>
      </section>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  isComingSoon?: boolean;
  comingSoonText?: string;
}

function FeatureCard({ icon, title, description, isComingSoon, comingSoonText }: FeatureCardProps) {
  return (
    <Card className={`shadow-lg hover:shadow-xl transition-shadow h-full flex flex-col ${isComingSoon ? 'opacity-70' : ''}`}>
      <CardHeader className="items-center pt-6">
        {icon}
      </CardHeader>
      <CardContent className="text-center flex-grow flex flex-col justify-center">
        <CardTitle className="mb-2 text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        {isComingSoon && <p className="mt-2 text-xs font-semibold text-primary/80">{comingSoonText}</p>}
      </CardContent>
    </Card>
  );
}
