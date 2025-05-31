
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { LayoutDashboard, UserCircle, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto shadow-xl border-primary/20">
        <CardHeader className="items-center text-center bg-primary/10 p-6 rounded-t-lg">
          <LayoutDashboard className="h-16 w-16 text-primary mb-3" />
          <CardTitle className="text-3xl font-bold text-primary">MediLingua Connect Dashboard</CardTitle>
          <CardDescription className="text-lg">
            Access your personalized health or professional hub.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 md:p-8 space-y-6">
          <p className="text-center text-muted-foreground">
            Welcome! Please select your dashboard view. In a real application, this would be determined by your user role after login.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DashboardLinkCard
              icon={<UserCircle className="h-10 w-10 text-accent" />}
              title="Patient Dashboard"
              description="Manage your appointments, medical records, and communication."
              href="/dashboard/patient"
            />
            <DashboardLinkCard
              icon={<Briefcase className="h-10 w-10 text-accent" />}
              title="Doctor Dashboard"
              description="Oversee your schedule, patient interactions, and practice details."
              href="/dashboard/doctor"
            />
          </div>
           <div className="text-center pt-6">
            <p className="text-sm text-muted-foreground">
              User authentication and role-based access are currently under development.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface DashboardLinkCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}

function DashboardLinkCard({ icon, title, description, href }: DashboardLinkCardProps) {
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
        <Button variant="outline" size="sm" className="w-full" asChild>
          <Link href={href}>Go to {title.replace(" Dashboard", "")}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
