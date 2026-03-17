"use client";

import Link from "next/link";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";

import { FieldError } from "@/components/shared/field-error";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInSchema, type SignInFormValues } from "@/lib/validations/auth";

export function SignInForm() {
  const searchParams = useSearchParams();
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    setFormError(null);

    const result = await signIn("credentials", {
      ...values,
      callbackUrl: searchParams.get("callbackUrl") ?? "/",
      redirect: false
    });

    if (result?.error) {
      setFormError(
        result.error === "CredentialsSignin"
          ? "Invalid email or password."
          : result.error
      );
      return;
    }

    window.location.assign(result?.url ?? "/");
  });

  return (
    <Card className="w-full max-w-lg">
      <CardHeader className="space-y-3">
        <div className="space-y-1">
          <CardTitle className="text-2xl">Sign in to Artist OS</CardTitle>
          <CardDescription>
            Sign in to your workspace. For local development, the seeded demo account still
            works after running the seed script.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" autoComplete="email" {...form.register("email")} />
            <FieldError message={form.formState.errors.email?.message} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              {...form.register("password")}
            />
            <FieldError message={form.formState.errors.password?.message} />
          </div>
          <div className="rounded-2xl border border-border/70 bg-muted/40 p-3 text-sm text-muted-foreground">
            Demo login: <span className="font-medium text-foreground">demo@artistos.app</span> /{" "}
            <span className="font-medium text-foreground">artistos-demo-password</span>
          </div>
          <FieldError message={formError ?? undefined} />
          <Button className="w-full" type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Signing in..." : "Sign in"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            New to Artist OS?{" "}
            <Link className="font-medium text-foreground underline underline-offset-4" href="/sign-up">
              Create an account
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
