import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[calc(100vh-15rem)]">
      <Card className="w-full max-w-md shadow-xl border-primary/20">
        <CardHeader className="text-center items-center bg-primary/10 p-6 rounded-t-lg">
          <LogIn className="h-12 w-12 text-primary mb-3" />
          <CardTitle className="text-3xl font-bold text-primary">Login</CardTitle>
          <CardDescription className="text-lg">Access your MediLingua Connect account.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" disabled className="text-base"/>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="••••••••" disabled className="text-base"/>
          </div>
          <Button className="w-full text-lg py-3 shadow-md hover:shadow-lg transition-shadow" disabled size="lg">
            Login
          </Button>
          <p className="text-center text-sm text-muted-foreground pt-2">
            Login functionality is under construction.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center p-6 border-t">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Button variant="link" asChild className="p-0 h-auto text-primary">
              <Link href="/register">Sign Up</Link>
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
