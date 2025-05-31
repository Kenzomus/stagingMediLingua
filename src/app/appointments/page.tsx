
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Video, PlusCircle, CheckCircle, Clock, ChevronRight, UserCircle } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from 'next/link';

// Mock Data
const mockUpcomingAppointments = [
  {
    id: "appt1",
    doctorName: "Dr. Amina Fall",
    specialty: "Cardiologist",
    date: "2024-09-15",
    time: "10:00 AM",
    type: "Video Call",
    status: "Confirmed",
    doctorAvatarSeed: "AF",
  },
  {
    id: "appt2",
    doctorName: "Dr. Moussa Diop",
    specialty: "General Practitioner",
    date: "2024-09-22",
    time: "02:30 PM",
    type: "In-Person",
    status: "Confirmed",
    doctorAvatarSeed: "MD",
  },
];

const mockPastAppointments = [
  {
    id: "appt3",
    doctorName: "Dr. Khadija Gaye",
    specialty: "Pediatrician",
    date: "2024-07-10",
    time: "11:00 AM",
    type: "In-Person",
    status: "Completed",
    doctorAvatarSeed: "KG",
  },
  {
    id: "appt4",
    doctorName: "Dr. Amina Fall",
    specialty: "Cardiologist",
    date: "2024-06-01",
    time: "09:30 AM",
    type: "Video Call",
    status: "Completed",
    doctorAvatarSeed: "AF",
  },
];


export default function AppointmentsPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto shadow-xl border-primary/20">
        <CardHeader className="items-center text-center bg-primary/10 p-6 rounded-t-lg">
          <CalendarDays className="h-16 w-16 text-primary mb-3" />
          <CardTitle className="text-3xl font-bold text-primary">My Appointments</CardTitle>
          <CardDescription className="text-lg">
            Manage your upcoming and past medical appointments.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 md:p-8 space-y-10">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <h2 className="text-2xl font-semibold text-foreground">Upcoming Appointments</h2>
            <Button variant="outline" className="shadow-sm hover:shadow-md transition-shadow" disabled>
              <PlusCircle className="mr-2 h-5 w-5" /> Schedule New Appointment
            </Button>
          </div>

          {mockUpcomingAppointments.length > 0 ? (
            <div className="space-y-4">
              {mockUpcomingAppointments.map((appt) => (
                <AppointmentCard key={appt.id} appointment={appt} />
              ))}
            </div>
          ) : (
            <div className="border rounded-lg p-6 bg-card/50 text-center">
              <p className="text-muted-foreground mb-4">You have no upcoming appointments.</p>
              <Video className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Full scheduling features are coming soon!</p>
            </div>
          )}
          
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Past Appointments</h2>
            {mockPastAppointments.length > 0 ? (
                <div className="space-y-4">
                    {mockPastAppointments.map((appt) => (
                        <AppointmentCard key={appt.id} appointment={appt} isPast />
                    ))}
                </div>
            ): (
                <div className="border rounded-lg p-6 bg-card/50 text-center">
                    <p className="text-muted-foreground">No past appointment history found.</p>
                </div>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground">View Calendar</h3>
             <Card className="p-2 shadow-md">
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                    disabled // Keep it disabled for full interaction for now
                />
             </Card>
          </div>

          <div className="text-center pt-4">
            <p className="text-muted-foreground">
              This page is a demonstration. Full appointment management features are under active development.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface AppointmentCardProps {
    appointment: {
        id: string;
        doctorName: string;
        specialty: string;
        date: string; // Expected format "YYYY-MM-DD"
        time: string;
        type: string;
        status: string;
        doctorAvatarSeed: string;
    };
    isPast?: boolean;
}

function AppointmentCard({ appointment, isPast = false }: AppointmentCardProps) {
    const [clientFormattedDate, setClientFormattedDate] = useState<string | null>(null);

    useEffect(() => {
      // Parse the date string "YYYY-MM-DD" into a Date object.
      // This creates a Date object for midnight in the local timezone of the browser.
      const dateParts = appointment.date.split('-').map(str => parseInt(str, 10));
      const year = dateParts[0];
      const month = dateParts[1] - 1; // JavaScript months are 0-indexed
      const day = dateParts[2];
      const appointmentDateObject = new Date(year, month, day);

      setClientFormattedDate(
        appointmentDateObject.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      );
    }, [appointment.date]);

    return (
        <Card className={`shadow-md hover:shadow-lg transition-shadow overflow-hidden ${isPast ? 'opacity-70' : ''}`}>
            <CardContent className="p-4 flex flex-col sm:flex-row items-start gap-4">
                <Avatar className="h-16 w-16 border-2 border-primary/30 mt-1">
                    <AvatarImage src={`https://placehold.co/64x64.png/F0F4F8/${appointment.doctorAvatarSeed}`} alt={appointment.doctorName} data-ai-hint="doctor person" />
                    <AvatarFallback className="text-xl bg-muted">{appointment.doctorAvatarSeed}</AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                    <div className="flex flex-col sm:flex-row justify-between items-start mb-1">
                        <h3 className="text-lg font-semibold text-primary">{appointment.doctorName}</h3>
                        <Badge variant={isPast ? "secondary" : "default"} className="mt-1 sm:mt-0">
                            {isPast ? <CheckCircle className="mr-1.5 h-4 w-4" /> : <Clock className="mr-1.5 h-4 w-4" />}
                            {appointment.status}
                        </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{appointment.specialty}</p>
                    <p className="text-sm text-foreground font-medium">
                      {clientFormattedDate ? clientFormattedDate : "Processing date..."} at {appointment.time}
                    </p>
                    <p className="text-sm text-muted-foreground">Type: {appointment.type}</p>
                </div>
                {!isPast && (
                     <Button variant="outline" size="sm" className="mt-2 sm:mt-0 sm:ml-auto self-start sm:self-center" disabled>
                        Manage <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                )}
                 {isPast && (
                     <Button variant="ghost" size="sm" className="mt-2 sm:mt-0 sm:ml-auto self-start sm:self-center text-primary" disabled>
                        View Details
                    </Button>
                )}
            </CardContent>
            {!isPast && (
                <CardFooter className="bg-muted/50 p-3 text-xs text-muted-foreground">
                   {appointment.type === "Video Call" ? 
                    <Link href="/video-consultation" className="text-primary hover:underline flex items-center">
                        <Video className="h-4 w-4 mr-1"/> Join Video Call (Placeholder)
                    </Link>
                    : <span>Location: Clinic Address (Placeholder)</span> }
                </CardFooter>
            )}
        </Card>
    )
}
