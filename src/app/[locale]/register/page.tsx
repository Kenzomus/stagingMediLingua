
"use client";

import * as React from "react";
import Link from "next-intl/client"; // Use next-intl Link
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
// import { registerUser } from "@/ai/flows/register-user-flow"; // No longer calling Genkit flow for user creation
import { useAuth } from "@/contexts/auth-context"; // Import useAuth
import { useTranslations, useLocale } from 'next-intl'; // Import next-intl hooks
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';


// Helper function to get translated error messages
const getTranslatedFormSchema = (t: (key: string) => string) => {
  return z.object({
    accountType: z.enum(["patient", "doctor"], {
      required_error: t("accountTypeRequired"),
    }),
    firstName: z.string().min(1, t("firstNameRequired")),
    lastName: z.string().min(1, t("lastNameRequired")),
    email: z.string().email(t("invalidEmail")),
    password: z.string().min(8, t("passwordMinLength")),
    confirmPassword: z.string(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: t("passwordsDoNotMatch"),
    path: ["confirmPassword"],
  });
};


type FormData = z.infer<ReturnType<typeof getTranslatedFormSchema>>;

export default function RegisterPage() {
  const t = useTranslations("RegisterPage");
  const tGlobal = useTranslations("Global");
  const { toast } = useToast();
  const { signUpWithEmail, loading: authLoading, error: authError, setError: setAuthError } = useAuth(); // Use signUpWithEmail from AuthContext
  const router = useRouter();
  const locale = useLocale();
  
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const formSchema = getTranslatedFormSchema(t);

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
    setIsSubmitting(true);
    setAuthError(null); // Clear previous auth errors
    
    // Call Firebase Auth sign up
    const user = await signUpWithEmail(data.email, data.password);
    
    if (user) {
      // Optionally, here you could call a Genkit flow or another service 
      // to save additional profile information like firstName, lastName, accountType
      // For example:
      // try {
      //   await registerUser({ 
      //     firebaseUid: user.uid, // Pass Firebase UID
      //     firstName: data.firstName, 
      //     lastName: data.lastName, 
      //     email: data.email, 
      //     accountType: data.accountType 
      //   });
      // } catch (profileError) {
      //   // Handle profile saving error, maybe inform user or log
      //   console.error("Error saving additional profile info:", profileError);
      // }

      toast({
        title: t("registrationSuccessTitle"),
        description: t("registrationSuccessMessage"),
      });
      form.reset();
      router.push(`/${locale}/dashboard`); // Redirect to dashboard or login
    }
    // If user is null, authError will be set by signUpWithEmail in AuthContext
    // and displayed via the Alert component.
    setIsSubmitting(false);
  };
  
  const isLoading = authLoading || isSubmitting;

  return (
    <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[calc(100vh-15rem)]">
      <Card className="w-full max-w-lg shadow-xl border-primary/20">
        <CardHeader className="text-center items-center bg-primary/10 p-6 rounded-t-lg">
          <UserPlus className="h-12 w-12 text-primary mb-3" />
          <CardTitle className="text-3xl font-bold text-primary">{t("title")}</CardTitle>
          <CardDescription className="text-lg">{t("description")}</CardDescription>
        </CardHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="p-6 space-y-6">
            {authError && (
              <Alert variant="destructive">
                <AlertDescription>{authError}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label>{t("accountTypeLabel")}</Label>
              <RadioGroup
                defaultValue="patient"
                className="flex gap-4"
                onValueChange={(value) => form.setValue("accountType", value as "patient" | "doctor")}
                disabled={isLoading}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="patient" id="patient" />
                  <Label htmlFor="patient" className="font-normal flex items-center gap-1">
                    <UserPlus className="h-4 w-4" /> {t("accountTypePatient")}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="doctor" id="doctor" />
                  <Label htmlFor="doctor" className="font-normal flex items-center gap-1">
                    <Briefcase className="h-4 w-4" /> {t("accountTypeDoctor")}
                  </Label>
                </div>
              </RadioGroup>
              {form.formState.errors.accountType && (
                <p className="text-sm text-destructive">{form.formState.errors.accountType.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">{t("firstNameLabel")}</Label>
                <Input
                  id="firstName"
                  placeholder={t("firstNamePlaceholder")}
                  {...form.register("firstName")}
                  disabled={isLoading}
                  className="text-base"
                />
                {form.formState.errors.firstName && (
                  <p className="text-sm text-destructive">{form.formState.errors.firstName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">{t("lastNameLabel")}</Label>
                <Input
                  id="lastName"
                  placeholder={t("lastNamePlaceholder")}
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
              <Label htmlFor="email">{t("emailLabel")}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder={t("emailPlaceholder")}
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
              <Label htmlFor="password">{t("passwordLabel")}</Label>
               <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder={t("passwordPlaceholder")}
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
              <Label htmlFor="confirmPassword">{t("confirmPasswordLabel")}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder={t("confirmPasswordPlaceholder")}
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
              {t("registerButton")}
            </Button>
          </CardContent>
        </form>
        <CardFooter className="flex justify-center p-6 border-t">
          <p className="text-sm text-muted-foreground">
            {t("alreadyHaveAccountPrompt")}{" "}
            <Link href="/login" className="font-medium text-primary transition-colors hover:text-primary/80">
              {tGlobal("login")}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
