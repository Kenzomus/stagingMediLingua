
"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Briefcase, Mail, Lock, Loader2 } from "lucide-react";
import { registerUser } from "@/ai/flows/register-user-flow"; // We'll create this flow

const formSchema = z.object({
  accountType: z.enum(["patient", "doctor"], {
    required_error: "Account type is required.",
  }),
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().min(1, "Last name is required."),
  email: z.string().email("Invalid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof formSchema>;

export default function RegisterPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accountType: "patient",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      // Exclude confirmPassword before sending to the backend/flow
      const { confirmPassword, ...registrationData } = data;
      const result = await registerUser(registrationData);

      if (result.success) {
        toast({
          title: "Registration Successful!",
          description: result.message || "You can now log in.",
        });
        form.reset();
        // Potentially redirect to login or dashboard
        // router.push('/login'); 
      } else {
        toast({
          title: "Registration Failed",
          description: result.message || "Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "An Error Occurred",
        description: error instanceof Error ? error.message : "Could not complete registration.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[calc(100vh-15rem)]">
      <Card className="w-full max-w-lg shadow-xl border-primary/20">
        <CardHeader className="text-center items-center bg-primary/10 p-6 rounded-t-lg">
          <UserPlus className="h-12 w-12 text-primary mb-3" />
          <CardTitle className="text-3xl font-bold text-primary">Create Account</CardTitle>
          <CardDescription className="text-lg">Join MediLingua Connect today.</CardDescription>
        </CardHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <Label>Account Type</Label>
              <RadioGroup
                defaultValue="patient"
                className="flex gap-4"
                onValueChange={(value) => form.setValue("accountType", value as "patient" | "doctor")}
                disabled={isLoading}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="patient" id="patient" />
                  <Label htmlFor="patient" className="font-normal flex items-center gap-1">
                    <UserPlus className="h-4 w-4" /> Patient
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="doctor" id="doctor" />
                  <Label htmlFor="doctor" className="font-normal flex items-center gap-1">
                    <Briefcase className="h-4 w-4" /> Doctor / Healthcare Provider
                  </Label>
                </div>
              </RadioGroup>
              {form.formState.errors.accountType && (
                <p className="text-sm text-destructive">{form.formState.errors.accountType.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="Your First Name"
                  {...form.register("firstName")}
                  disabled={isLoading}
                  className="text-base"
                />
                {form.formState.errors.firstName && (
                  <p className="text-sm text-destructive">{form.formState.errors.firstName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Your Last Name"
                  {...form.register("lastName")}
                  disabled={isLoading}
                  className="text-base"
                />
                {form.formState.errors.lastName && (
                  <p className="text-sm text-destructive">{form.formState.errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  {...form.register("email")}
                  disabled={isLoading}
                  className="text-base pl-10"
                />
              </div>
              {form.formState.errors.email && (
                <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
               <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a strong password"
                  {...form.register("password")}
                  disabled={isLoading}
                  className="text-base pl-10"
                />
              </div>
              {form.formState.errors.password && (
                <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  {...form.register("confirmPassword")}
                  disabled={isLoading}
                  className="text-base pl-10"
                />
              </div>
              {form.formState.errors.confirmPassword && (
                <p className="text-sm text-destructive">{form.formState.errors.confirmPassword.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full text-lg py-3 shadow-md hover:shadow-lg transition-shadow" disabled={isLoading} size="lg">
              {isLoading ? <Loader2 className="animate-spin mr-2" /> : null}
              Register
            </Button>
             {/* <p className="text-center text-sm text-muted-foreground pt-2">
              Full registration with database integration is under construction.
            </p> */}
          </CardContent>
        </form>
        <CardFooter className="flex justify-center p-6 border-t">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Button variant="link" asChild className="p-0 h-auto text-primary">
              <Link href="/login">Login</Link>
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

