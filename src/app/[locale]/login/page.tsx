
"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next-intl/client';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, Mail, Lock, Loader2 } from "lucide-react";
import { useAuth } from '@/contexts/auth-context';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Google Icon SVG as a component
const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" {...props}>
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    <path fill="none" d="M0 0h48v48H0z"/>
  </svg>
);

const formSchema = z.object({
  email: z.string().email({ message: "invalidEmail" }), // Use key for translation
  password: z.string().min(1, { message: "passwordRequired" }), // Use key for translation
});

type FormData = z.infer<typeof formSchema>;

export default function LoginPage() {
  const t = useTranslations("LoginPage");
  const tGlobal = useTranslations("Global");
  const locale = useLocale();
  const { signInWithEmail, signInWithGoogle, loading: authLoading, error: authError, setError: setAuthError } = useAuth();
  const router = useRouter();
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setAuthError(null);
    const user = await signInWithEmail(data.email, data.password);
    setIsSubmitting(false);
    if (user) {
      router.push(`/${locale}/dashboard`); // Redirect to dashboard or desired page
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    setAuthError(null);
    const user = await signInWithGoogle();
    setIsSubmitting(false);
    if (user) {
       router.push(`/${locale}/dashboard`); // Redirect to dashboard or desired page
    }
  };
  
  const isLoading = authLoading || isSubmitting;

  return (
    <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[calc(100vh-15rem)]">
      <Card className="w-full max-w-md shadow-xl border-primary/20">
        <CardHeader className="text-center items-center bg-primary/10 p-6 rounded-t-lg">
          <LogIn className="h-12 w-12 text-primary mb-3" />
          <CardTitle className="text-3xl font-bold text-primary">{t('title')}</CardTitle>
          <CardDescription className="text-lg">{t('description')}</CardDescription>
        </CardHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="p-6 space-y-6">
            {authError && (
              <Alert variant="destructive">
                <AlertDescription>{authError}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">{t('emailLabel')}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder={t('emailPlaceholder')}
                  {...form.register("email")}
                  disabled={isLoading}
                  className="text-base pl-10"
                />
              </div>
              {form.formState.errors.email && (
                <p className="text-sm text-destructive">{t(form.formState.errors.email.message as any)}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('passwordLabel')}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder={t('passwordPlaceholder')}
                  {...form.register("password")}
                  disabled={isLoading}
                  className="text-base pl-10"
                />
              </div>
              {form.formState.errors.password && (
                <p className="text-sm text-destructive">{t(form.formState.errors.password.message as any)}</p>
              )}
            </div>
            <Button type="submit" className="w-full text-lg py-3 shadow-md hover:shadow-lg transition-shadow" disabled={isLoading} size="lg">
              {isLoading && !authError ? <Loader2 className="animate-spin mr-2" /> : null}
              {t('loginButton')}
            </Button>
            
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  {t('orContinueWith')}
                </span>
              </div>
            </div>

            <Button variant="outline" type="button" className="w-full text-base py-3 shadow-sm hover:shadow-md transition-shadow" onClick={handleGoogleSignIn} disabled={isLoading} size="lg">
              {isLoading && authError /* show loader only if google sign in was attempted */ ? <Loader2 className="animate-spin mr-2" /> : <GoogleIcon className="mr-2" />}
              {t('signInWithGoogleButton')}
            </Button>

          </CardContent>
        </form>
        <CardFooter className="flex justify-center p-6 border-t">
          <p className="text-sm text-muted-foreground">
            {t('noAccountPrompt')}{" "}
            <Link href="/register" className="font-medium text-primary transition-colors hover:text-primary/80">
              {t('signUpLink')}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
