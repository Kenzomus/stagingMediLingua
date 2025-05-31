
"use client";

import * as React from "react";
import { format } from "date-fns";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, MapPin, LanguagesIcon, SlidersHorizontal, Calendar as CalendarIcon, MessageSquare, Video, Mail, UserCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface MockDoctor {
  id: string;
  name: string;
  specialty: string;
  languages: string[];
  location: string;
  avatarSeed: string; // For placeholder differentiation
  bio: string;
}

const mockDoctors: MockDoctor[] = [
  { id: "1", name: "Dr. Amina Fall", specialty: "Cardiologist", languages: ["Français", "Wolof"], location: "Dakar, Senegal", avatarSeed: "AF", bio: "Experienced cardiologist focusing on preventative care and patient education." },
  { id: "2", name: "Dr. John Smith", specialty: "Pediatrician", languages: ["English", "Français"], location: "New York, USA", avatarSeed: "JS", bio: "Dedicated pediatrician with a passion for child wellness and development." },
  { id: "3", name: "Dr. Mariama Diallo", specialty: "General Practitioner", languages: ["Wolof", "English"], location: "Thiès, Senegal", avatarSeed: "MD", bio: "Compassionate GP providing comprehensive healthcare services to families." },
  { id: "4", name: "Dr. Chen Wei", specialty: "Neurologist", languages: ["English"], location: "London, UK", avatarSeed: "CW", bio: "Specialist in neurological disorders, committed to advancing patient care through research." },
];


export default function FindDoctorPage() {
  const { toast } = useToast();
  const [specialty, setSpecialty] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [language, setLanguage] = React.useState<string | undefined>(undefined);
  const [distance, setDistance] = React.useState<string | undefined>(undefined);
  const [availabilityDate, setAvailabilityDate] = React.useState<Date | undefined>(undefined);
  const [searchResults, setSearchResults] = React.useState<MockDoctor[]>([]);
  const [hasSearched, setHasSearched] = React.useState(false);

  const handleSearch = () => {
    // Simulate search - in a real app, this would be an API call
    setHasSearched(true);
    setSearchResults(mockDoctors.filter(doc => 
      (specialty ? doc.specialty.toLowerCase().includes(specialty.toLowerCase()) || doc.name.toLowerCase().includes(specialty.toLowerCase()) : true) &&
      (location ? doc.location.toLowerCase().includes(location.toLowerCase()) : true) &&
      (language && language !== "any" ? doc.languages.map(l=>l.toLowerCase()).includes(language.toLowerCase()) : true)
      // Distance and availability filtering would be more complex
    ));
    toast({
      title: "Search Complete",
      description: `Found ${searchResults.length} doctors. (Mock search)`,
    });
  };

  const handleSendRequest = (doctorName: string, requestType: 'Text' | 'Video' | 'Email') => {
    // In a real app, this would open a modal or initiate a process
    // The language of the request itself could be managed here or taken from user's current language preference
    toast({
        title: `${requestType} Request (Placeholder)`,
        description: `Sending ${requestType.toLowerCase()} request to ${doctorName}. This feature is under development.`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-5xl mx-auto shadow-xl border-primary/20">
        <CardHeader className="items-center text-center bg-primary/10 p-6 rounded-t-lg">
          <Search className="h-16 w-16 text-primary mb-3" />
          <CardTitle className="text-3xl font-bold text-primary">Find a Doctor</CardTitle>
          <CardDescription className="text-lg">
            Search for healthcare professionals tailored to your needs.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 md:p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-end">
            <div className="space-y-2">
              <Label htmlFor="specialty" className="font-semibold">Specialty / Name</Label>
              <Input 
                id="specialty" 
                placeholder="e.g., Cardiologist, Dr. Smith" 
                className="text-base" 
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location" className="font-semibold flex items-center">
                <MapPin className="h-4 w-4 mr-1 text-muted-foreground" /> Location
              </Label>
              <Input 
                id="location" 
                placeholder="e.g., City, Zip, or 'near me'" 
                className="text-base"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="language" className="font-semibold flex items-center">
                <LanguagesIcon className="h-4 w-4 mr-1 text-muted-foreground" /> Language
              </Label>
              <Select value={language} onValueChange={(val) => setLanguage(val === "any" ? undefined : val)}>
                <SelectTrigger className="text-base">
                  <SelectValue placeholder="Any Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Language</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="wo">Wolof</SelectItem>
                  {/* Add other languages as needed */}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="distance" className="font-semibold flex items-center">
                <SlidersHorizontal className="h-4 w-4 mr-1 text-muted-foreground" /> Distance
              </Label>
              <Select value={distance} onValueChange={(val) => setDistance(val === "any" ? undefined : val)} disabled>
                <SelectTrigger className="text-base">
                  <SelectValue placeholder="Any Distance (Soon)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Distance</SelectItem>
                  <SelectItem value="5">Within 5 km</SelectItem>
                  <SelectItem value="10">Within 10 km</SelectItem>
                  <SelectItem value="25">Within 25 km</SelectItem>
                  <SelectItem value="50">Within 50 km</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2 lg:col-span-1">
              <Label htmlFor="availability" className="font-semibold flex items-center">
                <CalendarIcon className="h-4 w-4 mr-1 text-muted-foreground" /> Availability
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
                    {availabilityDate ? format(availabilityDate, "PPP") : <span>Pick a date (Soon)</span>}
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
            >
              <Search className="mr-2 h-5 w-5" /> Search Doctors
            </Button>
          </div>
          
          <div className="pt-6 space-y-6">
            {hasSearched && searchResults.length === 0 && (
                 <div className="border rounded-lg p-6 bg-card/50 text-center min-h-[200px] flex flex-col justify-center items-center">
                    <UserCircle className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                    No doctors found matching your criteria. Try broadening your search.
                    </p>
                </div>
            )}
            {searchResults.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {searchResults.map((doctor) => (
                  <Card key={doctor.id} className="shadow-lg hover:shadow-xl transition-shadow flex flex-col">
                    <CardHeader className="flex flex-row items-start gap-4 p-4">
                      <Avatar className="h-20 w-20 border-2 border-primary/50">
                        <AvatarImage src={`https://placehold.co/80x80.png/F0F4F8/${doctor.avatarSeed}`} alt={doctor.name} data-ai-hint="doctor person" />
                        <AvatarFallback className="text-2xl bg-muted">{doctor.avatarSeed}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="text-xl text-primary">{doctor.name}</CardTitle>
                        <p className="text-md font-medium text-accent">{doctor.specialty}</p>
                        <p className="text-sm text-muted-foreground"><MapPin size={14} className="inline mr-1" />{doctor.location}</p>
                        <p className="text-sm text-muted-foreground"><LanguagesIcon size={14} className="inline mr-1" />{doctor.languages.join(', ')}</p>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 flex-grow">
                      <p className="text-sm text-muted-foreground mb-4">{doctor.bio}</p>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 border-t mt-auto">
                      <div className="flex flex-col sm:flex-row gap-2 w-full">
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => handleSendRequest(doctor.name, 'Text')}>
                          <MessageSquare className="mr-2 h-4 w-4" /> Text Request
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => handleSendRequest(doctor.name, 'Video')}>
                          <Video className="mr-2 h-4 w-4" /> Video Request
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => handleSendRequest(doctor.name, 'Email')}>
                          <Mail className="mr-2 h-4 w-4" /> Email Request
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
            {!hasSearched && (
                 <div className="border rounded-lg p-6 bg-card/50 text-center min-h-[200px] flex flex-col justify-center items-center">
                    <Search className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                    Use the filters above to find doctors. Results will appear here. <br/> Full search functionality is under development.
                    </p>
                </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

    