
"use client";

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LayoutDashboard, UserCircle, CalendarDays, FileText, MessageSquare, ArrowRight, PlusCircle } from "lucide-react";
import Image from 'next/image';

// Mock data - replace with actual data fetching later
const mockAppointments = [
  { id: '1', doctorName: 'Dr. Amina Fall', specialty: 'Cardiologist', date: '2024-08-15', time: '10:00 AM', type: 'Video Call' },
  { id: '2', doctorName: 'Dr. Moussa Diop', specialty: 'General Practitioner', date: '2024-08-22', time: '02:30 PM', type: 'In-Person' },
];

const mockLabResults = [
  { id: 'lab1', testName: 'Full Blood Count', date: '2024-08-01', status: 'View Details' },
  { id: 'lab2', testName: 'Lipid Panel', date: '2024-07-20', status: 'View Details' },
];

const mockMessages = [
    { id: 'msg1', sender: 'Dr. Fall', snippet: 'Just a reminder about your upcoming appointment...', unread: true, timestamp: '2h ago' },
    { id: 'msg2', sender: 'Support Team', snippet: 'Your account details have been updated.', unread: false, timestamp: '1d ago'},
]

export default function PatientDashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <Card className="shadow-xl border-primary/20 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/80 to-primary/60 p-6 text-primary-foreground">
          <div className="flex items-center gap-4">
            <LayoutDashboard className="h-12 w-12" />
            <div>
              <CardTitle className="text-3xl font-bold">Patient Dashboard</CardTitle>
              <CardDescription className="text-lg text-primary-foreground/80">
                Welcome! Manage your health journey here.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Profile Section */}
          <DashboardActionCard
            icon={<UserCircle className="h-10 w-10 text-accent" />}
            title="My Profile"
            description="View and update your personal and medical information."
            actionText="Go to Profile"
            actionHref="/profile" // Placeholder link
            disabled
          />

          {/* Upcoming Appointments */}
          <Card className="shadow-md hover:shadow-lg transition-shadow col-span-1 md:col-span-2 lg:col-span-1">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl flex items-center gap-2"><CalendarDays className="text-primary"/>Upcoming Appointments</CardTitle>
                <Button variant="outline" size="sm" asChild disabled>
                  <Link href="/appointments/new"><PlusCircle size={16} className="mr-1"/>Schedule</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {mockAppointments.length > 0 ? (
                <ul className="space-y-3">
                  {mockAppointments.map(appt => (
                    <li key={appt.id} className="p-3 bg-card/50 rounded-md border flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-foreground">{appt.doctorName}</p>
                        <p className="text-sm text-muted-foreground">{appt.specialty}</p>
                        <p className="text-xs text-muted-foreground">{appt.date} at {appt.time} ({appt.type})</p>
                      </div>
                       <Button variant="ghost" size="sm" disabled><ArrowRight size={16}/></Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground text-center py-4">No upcoming appointments.</p>
              )}
            </CardContent>
            <CardFooter>
                <Button variant="link" asChild className="text-primary mx-auto" disabled>
                    <Link href="/appointments">View All Appointments</Link>
                </Button>
            </CardFooter>
          </Card>

          {/* Recent Lab Results */}
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2"><FileText className="text-primary"/>Recent Lab Results</CardTitle>
            </CardHeader>
            <CardContent>
              {mockLabResults.length > 0 ? (
                <ul className="space-y-3">
                  {mockLabResults.map(result => (
                    <li key={result.id} className="p-3 bg-card/50 rounded-md border flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-foreground">{result.testName}</p>
                        <p className="text-xs text-muted-foreground">Date: {result.date}</p>
                      </div>
                      <Button variant="outline" size="sm" disabled>{result.status}</Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground text-center py-4">No recent lab results.</p>
              )}
            </CardContent>
             <CardFooter>
                <Button variant="link" asChild className="text-primary mx-auto" disabled>
                    <Link href="/medical-records/lab-results">View All Lab Results</Link>
                </Button>
            </CardFooter>
          </Card>

          {/* Messages */}
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2"><MessageSquare className="text-primary"/>Messages</CardTitle>
            </CardHeader>
            <CardContent>
                {mockMessages.length > 0 ? (
                     <ul className="space-y-3">
                        {mockMessages.map(msg => (
                            <li key={msg.id} className={`p-3 rounded-md border flex items-start gap-3 ${msg.unread ? 'bg-primary/5 border-primary/20' : 'bg-card/50'}`}>
                                <Avatar className="h-8 w-8 mt-1">
                                    <AvatarImage src={`https://placehold.co/40x40.png?text=${msg.sender.substring(0,1)}`} alt={msg.sender} data-ai-hint="avatar person"/>
                                    <AvatarFallback>{msg.sender.substring(0,1)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="flex justify-between items-baseline">
                                        <p className="font-semibold text-foreground">{msg.sender}</p>
                                        <p className="text-xs text-muted-foreground">{msg.timestamp}</p>
                                    </div>
                                    <p className={`text-sm ${msg.unread ? 'text-foreground' : 'text-muted-foreground'}`}>{msg.snippet}</p>
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
                    <Link href="/chat">Go to Chat Assistant</Link>
                </Button>
            </CardFooter>
          </Card>

          {/* Placeholder for other quick actions or health summaries */}
           <Card className="shadow-md hover:shadow-lg transition-shadow md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle className="text-xl">Health Overview</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <Image src="https://placehold.co/600x200.png/F0F4F8/64B5F6" alt="Health Chart Placeholder" width={600} height={200} className="rounded-md mx-auto" data-ai-hint="health chart"/>
              <p className="text-muted-foreground mt-4">Detailed health analytics are coming soon.</p>
            </CardContent>
          </Card>

        </CardContent>
      </Card>
    </div>
  );
}

interface DashboardActionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionText: string;
  actionHref: string;
  disabled?: boolean;
}

function DashboardActionCard({ icon, title, description, actionText, actionHref, disabled }: DashboardActionCardProps) {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow flex flex-col">
      <CardHeader className="items-center pb-3">
        {icon}
        <CardTitle className="text-xl mt-2">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-3 flex-grow">
        <p className="text-sm text-muted-foreground h-12">{description}</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full" asChild disabled={disabled}>
          {disabled ? <span>{actionText}</span> : <Link href={actionHref}>{actionText}</Link>}
        </Button>
      </CardFooter>
    </Card>
  );
}
