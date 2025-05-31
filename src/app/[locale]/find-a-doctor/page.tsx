
"use client";

import * as React from "react";
import { useLocale, useTranslations } from "next-intl";
import { format } from "date-fns";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, MapPin, LanguagesIcon, SlidersHorizontal, Calendar as CalendarIcon, MessageSquare, Video, Mail, UserCircle, Loader2, Send, Building, LocateFixed, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { searchExternalDoctors, type SearchExternalDoctorsFlowInput, type ExternalDoctorProfile } from "@/ai/flows/search-external-doctors-flow";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface MockDoctor {
  id: string;
  name: string;
  specialty: string;
  languages: string[];
  location: string; // For internal search, this is a string. Geolocation would require coordinates.
  avatarSeed: string; 
  bio: string;
  source: 'internal';
}

const mockDoctors: MockDoctor[] = [
  { id: "1", name: "Dr. Amina Fall", specialty: "Cardiologist", languages: ["Français", "Wolof"], location: "Dakar, Senegal", avatarSeed: "AF", bio: "Experienced cardiologist focusing on preventative care and patient education.", source: "internal" },
  { id: "2", name: "Dr. John Smith", specialty: "Pediatrician", languages: ["English", "Français"], location: "New York, USA", avatarSeed: "JS", bio: "Dedicated pediatrician with a passion for child wellness and development.", source: "internal" },
  { id: "3", name: "Dr. Mariama Diallo", specialty: "General Practitioner", languages: ["Wolof", "English"], location: "Thiès, Senegal", avatarSeed: "MD", bio: "Compassionate GP providing comprehensive healthcare services to families.", source: "internal"},
  { id: "4", name: "Dr. Chen Wei", specialty: "Neurologist", languages: ["English"], location: "London, UK", avatarSeed: "CW", bio: "Specialist in neurological disorders, committed to advancing patient care through research.", source: "internal" },
];

type CombinedDoctorProfile = MockDoctor | ExternalDoctorProfile;

export default function FindDoctorPage() {
  const t = useTranslations("FindDoctorPage");
  const tGlobal = useTranslations("Global");
  const locale = useLocale();
  const { toast } = useToast();

  const [specialty, setSpecialty] = React.useState("");
  const [locationInput, setLocationInput] = React.useState(""); // User typed input
  const [language, setLanguage] = React.useState<string | undefined>(undefined);
  const [distance, setDistance] = React.useState<string | undefined>(undefined); // e.g. "5", "10" for km
  const [availabilityDate, setAvailabilityDate] = React.useState<Date | undefined>(undefined);
  
  const [userCoordinates, setUserCoordinates] = React.useState<{latitude: number, longitude: number} | null>(null);
  const [isFetchingLocation, setIsFetchingLocation] = React.useState(false);

  const [internalSearchResults, setInternalSearchResults] = React.useState<MockDoctor[]>([]);
  const [externalSearchResults, setExternalSearchResults] = React.useState<ExternalDoctorProfile[]>([]);
  
  const [isSearchingInternal, setIsSearchingInternal] = React.useState(false);
  const [isSearchingExternal, setIsSearchingExternal] = React.useState(false);
  const [hasSearched, setHasSearched] = React.useState(false);
  const [externalSearchError, setExternalSearchError] = React.useState<string | null>(null);

  const handleUseCurrentLocation = () => {
    setIsFetchingLocation(true);
    setUserCoordinates(null); // Reset previous coordinates
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserCoordinates({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLocationInput(t('currentLocationUsed')); // Update input field
          setIsFetchingLocation(false);
          toast({ title: t('locationSuccessTitle'), description: t('locationSuccessDesc') });
        },
        (error) => {
          console.error("Geolocation error:", error);
          setIsFetchingLocation(false);
          toast({
            title: t('locationErrorTitle'),
            description: `${t('locationErrorDesc')} ${error.message}`,
            variant: "destructive",
          });
        }
      );
    } else {
      setIsFetchingLocation(false);
      toast({
        title: t('locationErrorTitle'),
        description: t('geolocationNotSupported'),
        variant: "destructive",
      });
    }
  };

  const handleSearch = async () => {
    setHasSearched(true);
    setIsSearchingInternal(true);
    setInternalSearchResults([]);
    setExternalSearchResults([]);
    setExternalSearchError(null);

    // Simulate internal search
    await new Promise(resolve => setTimeout(resolve, 500));
    let internalResults = mockDoctors.filter(doc => 
      (specialty ? doc.specialty.toLowerCase().includes(specialty.toLowerCase()) || doc.name.toLowerCase().includes(specialty.toLowerCase()) : true) &&
      // For internal search, location is string-based. "near me" or distance selection would apply more to external search with coordinates.
      (locationInput && locationInput !== t('currentLocationUsed') ? doc.location.toLowerCase().includes(locationInput.toLowerCase()) : true) &&
      (language && language !== "any" ? doc.languages.map(l=>l.toLowerCase()).includes(language.toLowerCase()) : true)
    );
    
    // Conceptual distance filtering for internal results (if coordinates were available)
    // if (userCoordinates && distance) { /* filter internalResults by distance */ }

    setInternalSearchResults(internalResults);
    setIsSearchingInternal(false);

    toast({
      title: t('searchInitiatedTitle'),
      description: t('searchingInNetwork'),
    });

    if (internalResults.length === 0) {
      toast({
        title: t('noInternalResultsTitle'),
        description: t('searchingExternally'),
      });
      setIsSearchingExternal(true);
      try {
        const searchInput: SearchExternalDoctorsFlowInput = {
          specialty: specialty || undefined,
          language: language && language !== "any" ? language : undefined,
        };

        if (userCoordinates) {
          searchInput.latitude = userCoordinates.latitude;
          searchInput.longitude = userCoordinates.longitude;
          if (distance && distance !== "any") {
            searchInput.radiusKm = parseInt(distance, 10);
          }
        } else if (locationInput && locationInput !== t('currentLocationUsed')) {
          searchInput.location = locationInput;
        }
        // If distance is selected but no specific userCoordinates, the flow might interpret `location` with `radiusKm`
        // This part of logic depends on how the external search API (real or mocked) handles it
        if (!userCoordinates && distance && distance !== "any" && locationInput) {
           searchInput.radiusKm = parseInt(distance, 10);
        }


        const externalResults = await searchExternalDoctors(searchInput);
        setExternalSearchResults(externalResults);
        if (externalResults.length === 0) {
            toast({
                title: t('noExternalResultsTitle'),
                description: t('tryBroadeningSearch'),
            });
        } else {
             toast({
                title: t('externalResultsFoundTitle'),
                description: t('externalResultsDisplayed'),
            });
        }
      } catch (error) {
        console.error("External search error:", error);
        const errorMessage = error instanceof Error ? error.message : tGlobal('unknownError');
        setExternalSearchError(t('externalSearchFailed', { error: errorMessage }));
        toast({
          title: tGlobal('errorText'),
          description: t('externalSearchFailed', { error: errorMessage }),
          variant: "destructive",
        });
      } finally {
        setIsSearchingExternal(false);
      }
    } else {
       toast({
          title: t('internalResultsFoundTitle'),
          description: t('internalResultsDisplayed', {count: internalResults.length}),
      });
    }
  };

  const handleSendRequest = (doctorName: string, requestType: 'Text' | 'Video' | 'Email') => {
    toast({
        title: t('requestModalTitle', { type: t(requestType.toLowerCase()+'RequestButtonShort') }), // Using a shorter translatable key
        description: t('requestModalDescription', { type: t(requestType.toLowerCase()+'RequestButtonShort').toLowerCase(), doctorName }),
    });
  };

  const handleInviteDoctor = (doctorName: string) => {
    toast({
        title: t('invitationSentTitle'),
        description: t('invitationSentDescription', { doctorName }),
    });
    setExternalSearchResults(prev => prev.map(doc => doc.name === doctorName ? {...doc, inviteStatus: 'invited'} : doc));
  };
  
  const langMap: Record<string, string> = {
    en: tGlobal('english'),
    fr: tGlobal('french'),
    wo: tGlobal('wolof'),
    any: tGlobal('anyLanguage')
  };


  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-5xl mx-auto shadow-xl border-primary/20">
        <CardHeader className="items-center text-center bg-primary/10 p-6 rounded-t-lg">
          <Search className="h-16 w-16 text-primary mb-3" />
          <CardTitle className="text-3xl font-bold text-primary">{t('title')}</CardTitle>
          <CardDescription className="text-lg">
            {t('description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 md:p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-end">
            <div className="space-y-2">
              <Label htmlFor="specialty" className="font-semibold">{t('specialtyLabel')}</Label>
              <Input 
                id="specialty" 
                placeholder={t('specialtyPlaceholder')}
                className="text-base" 
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
              />
            </div>
            <div className="space-y-2 md:col-span-2 lg:col-span-1">
              <Label htmlFor="location" className="font-semibold flex items-center">
                <MapPin className="h-4 w-4 mr-1 text-muted-foreground" /> {t('locationLabel')}
              </Label>
              <div className="flex gap-2 items-center">
                <Input 
                  id="location" 
                  placeholder={t('locationPlaceholder')}
                  className="text-base flex-grow"
                  value={locationInput}
                  onChange={(e) => {
                    setLocationInput(e.target.value);
                    if (userCoordinates && e.target.value !== t('currentLocationUsed')) {
                        setUserCoordinates(null); // Clear coordinates if user types a new location
                    }
                  }}
                  // For actual autocomplete: onFocus, onBlur, and value change would interact with suggestion list
                />
                 <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={handleUseCurrentLocation} 
                    disabled={isFetchingLocation}
                    title={t('useCurrentLocationButton')} 
                    className="shrink-0"
                >
                    {isFetchingLocation ? <Loader2 className="h-4 w-4 animate-spin" /> : <LocateFixed className="h-4 w-4" />}
                </Button>
              </div>
              {/* Placeholder for Autocomplete Suggestions - requires external API integration
                <div className="autocomplete-suggestions bg-background border rounded-md shadow-lg mt-1">
                   {suggestions.map(s => <div key={s.id} className="p-2 hover:bg-muted cursor-pointer">{s.text}</div>)}
                </div> 
              */}
               {userCoordinates && locationInput === t('currentLocationUsed') && (
                <p className="text-xs text-muted-foreground mt-1">
                  {t('usingCoordinates', { lat: userCoordinates.latitude.toFixed(4), lon: userCoordinates.longitude.toFixed(4) })}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="language" className="font-semibold flex items-center">
                <LanguagesIcon className="h-4 w-4 mr-1 text-muted-foreground" /> {t('languageLabel')}
              </Label>
              <Select value={language} onValueChange={(val) => setLanguage(val === "any" ? undefined : val)}>
                <SelectTrigger className="text-base">
                  <SelectValue placeholder={t('languagePlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">{langMap['any']}</SelectItem>
                  <SelectItem value="en">{langMap['en']}</SelectItem>
                  <SelectItem value="fr">{langMap['fr']}</SelectItem>
                  <SelectItem value="wo">{langMap['wo']}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="distance" className="font-semibold flex items-center">
                <SlidersHorizontal className="h-4 w-4 mr-1 text-muted-foreground" /> {t('distanceLabel')}
              </Label>
              <Select value={distance} onValueChange={(val) => setDistance(val === "any" ? undefined : val)}>
                <SelectTrigger className="text-base">
                  <SelectValue placeholder={t('distancePlaceholderActive')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">{t('anyDistance')}</SelectItem>
                  <SelectItem value="5">{t('within5km')}</SelectItem>
                  <SelectItem value="10">{t('within10km')}</SelectItem>
                  <SelectItem value="25">{t('within25km')}</SelectItem>
                  <SelectItem value="50">{t('within50km')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2 lg:col-span-1">
              <Label htmlFor="availability" className="font-semibold flex items-center">
                <CalendarIcon className="h-4 w-4 mr-1 text-muted-foreground" /> {t('availabilityLabel')}
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal text-base",
                      !availabilityDate && "text-muted-foreground"
                    )}
                    disabled // Availability filter is conceptual for now
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {availabilityDate ? format(availabilityDate, "PPP", { locale: locale === "fr" ? require("date-fns/locale/fr") : locale === "en" ? require("date-fns/locale/en-US") : undefined }) : <span>{t('availabilityPlaceholder')}</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={availabilityDate}
                    onSelect={setAvailabilityDate}
                    initialFocus
                    disabled
                  />
                </PopoverContent>
              </Popover>
            </div>
          
            <Button 
              className="w-full md:col-span-3 lg:col-span-1 text-lg py-3 px-8 shadow-md hover:shadow-lg transition-shadow" 
              size="lg" 
              onClick={handleSearch}
              disabled={isSearchingInternal || isSearchingExternal || isFetchingLocation}
            >
              {isSearchingInternal || isSearchingExternal ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Search className="mr-2 h-5 w-5" />}
              {isSearchingInternal ? t('searchingButtonText') : isSearchingExternal ? t('searchingExternallyButtonText') : t('searchButtonText')}
            </Button>
          </div>
          
          <div className="pt-6 space-y-10">
            {/* Internal Network Results */}
            {hasSearched && internalSearchResults.length > 0 && (
              <div>
                <h3 className="text-2xl font-semibold text-foreground mb-4">{t('ourNetworkDoctorsTitle')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {internalSearchResults.map((doctor) => (
                    <DoctorCard key={doctor.id} doctor={doctor} onSendRequest={handleSendRequest} t={t} tGlobal={tGlobal} />
                  ))}
                </div>
              </div>
            )}

            {/* External Search Results */}
            {isSearchingExternal && (
                <div className="text-center py-10">
                    <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">{t('searchingExternally')}</p>
                </div>
            )}
            {externalSearchError && (
                <Alert variant="destructive" className="min-h-[150px] flex flex-col justify-center items-center text-center">
                    <AlertTriangle className="h-10 w-10 mb-3" />
                    <AlertTitle>{tGlobal('errorText')}</AlertTitle>
                    <AlertDescription>{externalSearchError}</AlertDescription>
                </Alert>
            )}
            {hasSearched && !isSearchingExternal && externalSearchResults.length > 0 && (
              <div>
                <h3 className="text-2xl font-semibold text-foreground mb-4">{t('externalDoctorsTitle')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {externalSearchResults.map((doctor) => (
                    <DoctorCard key={doctor.id} doctor={doctor} onInviteDoctor={handleInviteDoctor} t={t} tGlobal={tGlobal}/>
                  ))}
                </div>
              </div>
            )}

            {/* No Results Messages */}
            {hasSearched && !isSearchingInternal && !isSearchingExternal && internalSearchResults.length === 0 && externalSearchResults.length === 0 && !externalSearchError && (
                 <Alert className="min-h-[200px] flex flex-col justify-center items-center text-center">
                    <UserCircle className="h-12 w-12 text-muted-foreground mb-4" />
                    <AlertTitle>{t('noResultsFoundTitle') || 'No Results'}</AlertTitle>
                    <AlertDescription>
                     {t('noResultsFound')}
                    </AlertDescription>
                </Alert>
            )}
            {!hasSearched && (
                 <Alert className="min-h-[200px] flex flex-col justify-center items-center text-center">
                    <Search className="h-12 w-12 text-muted-foreground mb-4" />
                     <AlertTitle>{t('initialSearchPromptTitle') || 'Start Your Search'}</AlertTitle>
                    <AlertDescription>
                     {t('initialSearchPrompt')}
                    </AlertDescription>
                </Alert>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface DoctorCardProps {
    doctor: CombinedDoctorProfile;
    onSendRequest?: (doctorName: string, requestType: 'Text' | 'Video' | 'Email') => void;
    onInviteDoctor?: (doctorName: string) => void;
    t: (key: string, values?: Record<string, any>) => string; // FindDoctorPage translations
    tGlobal: (key: string, values?: Record<string, any>) => string; // Global translations
}

function DoctorCard({ doctor, onSendRequest, onInviteDoctor, t, tGlobal }: DoctorCardProps) {
    const languages = Array.isArray(doctor.languages) ? doctor.languages.join(', ') : 'N/A';
    const avatarSeed = 'avatarSeed' in doctor ? doctor.avatarSeed : doctor.name.substring(0,2).toUpperCase();
    
    return (
        <Card className="shadow-lg hover:shadow-xl transition-shadow flex flex-col">
            <CardHeader className="flex flex-row items-start gap-4 p-4">
                <Avatar className="h-20 w-20 border-2 border-primary/50">
                    <AvatarImage src={`https://placehold.co/80x80.png/F0F4F8/${avatarSeed}`} alt={doctor.name} data-ai-hint="doctor person" />
                    <AvatarFallback className="text-2xl bg-muted">{avatarSeed}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <CardTitle className="text-xl text-primary">{doctor.name}</CardTitle>
                    <p className="text-md font-medium text-accent">{doctor.specialty}</p>
                    <p className="text-sm text-muted-foreground"><MapPin size={14} className="inline mr-1" />{doctor.location}</p>
                    <p className="text-sm text-muted-foreground"><LanguagesIcon size={14} className="inline mr-1" />{languages}</p>
                </div>
            </CardHeader>
            <CardContent className="p-4 pt-0 flex-grow">
                {'bio' in doctor && <p className="text-sm text-muted-foreground mb-4">{doctor.bio}</p>}
                {doctor.source === "external" && 'externalProfileUrl' in doctor && doctor.externalProfileUrl && (
                    <Button variant="link" size="sm" asChild className="p-0 h-auto text-xs">
                        <a href={doctor.externalProfileUrl} target="_blank" rel="noopener noreferrer">{t('viewExternalProfile')}</a>
                    </Button>
                )}
            </CardContent>
            <CardFooter className="p-4 pt-0 border-t mt-auto">
                {doctor.source === 'internal' && onSendRequest && (
                    <div className="flex flex-col sm:flex-row gap-2 w-full">
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => onSendRequest(doctor.name, 'Text')}>
                            <MessageSquare className="mr-2 h-4 w-4" /> {t('textRequestButton')}
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => onSendRequest(doctor.name, 'Video')}>
                            <Video className="mr-2 h-4 w-4" /> {t('videoRequestButton')}
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => onSendRequest(doctor.name, 'Email')}>
                            <Mail className="mr-2 h-4 w-4" /> {t('emailRequestButton')}
                        </Button>
                    </div>
                )}
                {doctor.source === 'external' && onInviteDoctor && (
                    <Button 
                        variant="default" 
                        size="sm" 
                        className="w-full" 
                        onClick={() => onInviteDoctor(doctor.name)}
                        disabled={doctor.inviteStatus === 'invited'}
                    >
                        <Send className="mr-2 h-4 w-4" /> 
                        {doctor.inviteStatus === 'invited' ? t('invitationSentButton') : t('inviteButton')}
                    </Button>
                )}
            </CardFooter>
        </Card>
    )
}

// Helper to get date-fns locale dynamically (conceptual, adjust paths as needed)
// const getDateFnsLocale = async (locale: string) => {
//   switch (locale) {
//     case 'fr':
//       return (await import('date-fns/locale/fr')).fr;
//     case 'en':
//       return (await import('date-fns/locale/en-US')).enUS;
//     // Add other locales as needed
//     default:
//       return (await import('date-fns/locale/en-US')).enUS; // Default to English
//   }
// };
// In Client Components, direct dynamic imports for date-fns locales like this might be tricky due to bundling.
// It's often simpler to require them if the set of languages is small and known, as done in the Popover.
// For many languages, a more sophisticated solution might be needed.

```