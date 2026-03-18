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
import { redirectTo } from "@/lib/browser-navigation";
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

    redirectTo(result?.url ?? "/");
  });

  return (
    <Card className="w-full max-w-xl rounded-[2.25rem] border-4 border-primary bg-[linear-gradient(180deg,rgba(190,89,255,0.88),rgba(150,55,216,0.94))] text-white shadow-[0_24px_70px_rgba(0,0,0,0.35)]">
      <CardHeader className="space-y-4 px-8 pt-8">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/70">
            Welcome to Artist.OS
          </p>
          <CardTitle className="font-heading text-5xl font-semibold leading-none text-white">
            Sign in
          </CardTitle>
          <CardDescription className="max-w-xl text-base leading-7 text-white/78">
            Enter your workspace and pick up the next release move, campaign action,
            or analytics update waiting for you.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-8 pb-8">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-semibold uppercase tracking-[0.18em] text-white/82">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              className="h-12 rounded-2xl border-black/20 bg-white text-foreground shadow-none placeholder:text-black/35"
              {...form.register("email")}
            />
            <FieldError message={form.formState.errors.email?.message} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-semibold uppercase tracking-[0.18em] text-white/82">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              className="h-12 rounded-2xl border-black/20 bg-white text-foreground shadow-none placeholder:text-black/35"
              {...form.register("password")}
            />
            <FieldError message={form.formState.errors.password?.message} />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-white/76">
            <span>Secure access to your Artist.OS command layer</span>
            <span className="font-semibold text-primary">Live dashboard + actions</span>
          </div>
          <FieldError message={formError ?? undefined} />
          <Button
            className="h-14 w-full rounded-full bg-primary text-lg font-semibold text-primary-foreground shadow-none"
            type="submit"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Signing in..." : "Sign in"}
          </Button>
          <p className="text-center text-sm text-white/76">
            New to Artist OS?{" "}
            <Link className="font-semibold text-primary underline underline-offset-4" href="/sign-up">
              Create an account
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
