
"use client";

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LayoutGrid, Users, CalendarClock, MessageCircle, ChevronRight, Settings, UserPlus } from "lucide-react";
import Image from 'next/image';

// Mock data - replace with actual data fetching later
const mockDoctorStats = {
  totalPatients: 128,
  upcomingAppointments: 5,
  unreadMessages: 3,
};

const mockDoctorAppointments = [
  { id: 'da1', patientName: 'Aisha Diallo', time: '09:00 AM', type: 'Video Call', reason: 'Follow-up Consultation', patientAvatarSeed: 'AD' },
  { id: 'da2', patientName: 'Moussa Faye', time: '11:30 AM', type: 'In-Person', reason: 'New Patient Check-up', patientAvatarSeed: 'MF' },
  { id: 'da3', patientName: 'Fatou Sow', time: '02:00 PM', type: 'Video Call', reason: 'Medication Review', patientAvatarSeed: 'FS' },
];

const mockDoctorMessages = [
    { id: 'dm1', patientName: 'Aisha Diallo', snippet: 'Quick question about my prescription...', timestamp: '1h ago', unread: true },
    { id: 'dm2', patientName: 'Bakary Traoré', snippet: 'Feeling much better, thank you!', timestamp: '5h ago', unread: false },
    { id: 'dm3', patientName: 'Coumba Ndiaye', snippet: 'Requesting a refill for...', timestamp: '1d ago', unread: true },
];


export default function DoctorDashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <Card className="shadow-xl border-accent/20 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-accent/80 to-accent/60 p-6 text-accent-foreground">
          <div className="flex items-center gap-4">
            <LayoutGrid className="h-12 w-12" />
            <div>
              <CardTitle className="text-3xl font-bold">Doctor Dashboard</CardTitle>
              <CardDescription className="text-lg text-accent-foreground/80">
                Welcome Dr. [DoctorName]! Manage your patients and schedule.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Stats Cards */}
          <StatCard title="Total Patients" value={mockDoctorStats.totalPatients.toString()} icon={<Users className="text-primary" />} />
          <StatCard title="Upcoming Today" value={mockDoctorStats.upcomingAppointments.toString()} icon={<CalendarClock className="text-primary" />} />
          <StatCard title="Unread Messages" value={mockDoctorStats.unreadMessages.toString()} icon={<MessageCircle className="text-primary" />} />

          {/* Upcoming Appointments */}
          <Card className="shadow-md hover:shadow-lg transition-shadow md:col-span-2">
            <CardHeader>
              <CardTitle className="text-xl flex items-center justify-between">
                <span>Today's Appointments</span>
                <Button variant="outline" size="sm" asChild disabled>
                    <Link href="/doctor/schedule"><CalendarClock size={16} className="mr-1"/>View Full Schedule</Link>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {mockDoctorAppointments.length > 0 ? (
                <ul className="space-y-4">
                  {mockDoctorAppointments.map(appt => (
                    <li key={appt.id} className="p-3 bg-card/50 rounded-md border flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                         <AvatarImage src={`https://placehold.co/40x40.png/F0F4F8/${appt.patientAvatarSeed}`} alt={appt.patientName} data-ai-hint="avatar person"/>
                         <AvatarFallback>{appt.patientAvatarSeed}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">{appt.patientName}</p>
                        <p className="text-sm text-muted-foreground">{appt.time} - {appt.type}</p>
                        <p className="text-xs text-muted-foreground">{appt.reason}</p>
                      </div>
                      <Button variant="ghost" size="icon" disabled><ChevronRight size={20}/></Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground text-center py-4">No appointments scheduled for today.</p>
              )}
            </CardContent>
          </Card>
          
          {/* Recent Messages */}
           <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl">Recent Messages</CardTitle>
            </CardHeader>
            <CardContent>
                {mockDoctorMessages.length > 0 ? (
                     <ul className="space-y-3">
                        {mockDoctorMessages.map(msg => (
                            <li key={msg.id} className={`p-3 rounded-md border flex items-start gap-3 ${msg.unread ? 'bg-primary/5 border-primary/20' : 'bg-card/50'}`}>
                                <Avatar className="h-8 w-8 mt-1">
                                    <AvatarImage src={`https://placehold.co/40x40.png?text=${msg.patientName.substring(0,1)}`} alt={msg.patientName} data-ai-hint="avatar person"/>
                                    <AvatarFallback>{msg.patientName.substring(0,1)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="flex justify-between items-baseline">
                                        <p className="font-semibold text-foreground">{msg.patientName}</p>
                                        <p className="text-xs text-muted-foreground">{msg.timestamp}</p>
                                    </div>
                                    <p className={`text-sm ${msg.unread ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>{msg.snippet}</p>
                                </div>
                            </li>
                        ))}
                     </ul>
                ) : (
                     <p className="text-muted-foreground text-center py-4">No new messages.</p>
                )}
            </CardContent>
             <CardFooter>
                <Button variant="link" asChild className="text-primary mx-auto">
                    <Link href="/chat">Go to Secure Messaging</Link>
                </Button>
            </CardFooter>
          </Card>

          {/* Quick Actions / Analytics Placeholder */}
          <Card className="shadow-md hover:shadow-lg transition-shadow md:col-span-3">
            <CardHeader>
              <CardTitle className="text-xl">Practice Analytics & Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="text-center">
                    <Image src="https://placehold.co/600x300.png/F0F4F8/4DB6AC" alt="Analytics Chart Placeholder" width={600} height={300} className="rounded-md mx-auto" data-ai-hint="analytics chart"/>
                    <p className="text-muted-foreground mt-2">Patient engagement chart (coming soon).</p>
                </div>
                <div className="space-y-3 flex flex-col justify-center">
                    <Button variant="outline" className="w-full justify-start" disabled><UserPlus className="mr-2"/> Add New Patient</Button>
                    <Button variant="outline" className="w-full justify-start" disabled><Settings className="mr-2"/> Account Settings</Button>
                     <Button variant="outline" className="w-full justify-start" disabled><MessageCircle className="mr-2"/> Broadcast Message</Button>
                    <p className="text-sm text-muted-foreground pt-2">More tools and integrations are planned.</p>
                </div>
            </CardContent>
          </Card>

        </CardContent>
      </Card>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardContent className="pt-6 flex items-center gap-4">
        <div className="p-3 bg-primary/10 rounded-lg text-primary">
          {React.cloneElement(icon as React.ReactElement, { size: 28 })}
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
