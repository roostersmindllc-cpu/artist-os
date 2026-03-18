"use client";

import Link from "next/link";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { signUpAction } from "@/app/actions/auth-actions";
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
import { signUpSchema, type SignUpFormValues } from "@/lib/validations/auth";

export function SignUpForm() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    }
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    setFormError(null);

    const result = await signUpAction(values);

    if (!result.success) {
      setFormError(result.error);
      return;
    }

    const signInResult = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false
    });

    if (signInResult?.error) {
      setFormError("Account created, but automatic sign in failed. Please sign in manually.");
      return;
    }

    router.push("/onboarding");
    router.refresh();
  });

  return (
    <Card className="w-full max-w-xl rounded-[2.25rem] border-4 border-primary bg-[linear-gradient(180deg,rgba(190,89,255,0.88),rgba(150,55,216,0.94))] text-white shadow-[0_24px_70px_rgba(0,0,0,0.35)]">
      <CardHeader className="space-y-4 px-8 pt-8">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/70">
            Create your Artist.OS profile
          </p>
          <CardTitle className="font-heading text-5xl font-semibold leading-none text-white">
            Start here
          </CardTitle>
          <CardDescription className="max-w-xl text-base leading-7 text-white/78">
            Set up the account first, then move straight into the richer artist profile
            and workspace build-out.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-8 pb-8">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-semibold uppercase tracking-[0.18em] text-white/82">
              Name
            </Label>
            <Input
              id="name"
              autoComplete="name"
              className="h-12 rounded-2xl border-black/20 bg-white text-foreground shadow-none placeholder:text-black/35"
              {...form.register("name")}
            />
            <FieldError message={form.formState.errors.name?.message} />
          </div>
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
              autoComplete="new-password"
              className="h-12 rounded-2xl border-black/20 bg-white text-foreground shadow-none placeholder:text-black/35"
              {...form.register("password")}
            />
            <FieldError message={form.formState.errors.password?.message} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-semibold uppercase tracking-[0.18em] text-white/82">
              Confirm password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              className="h-12 rounded-2xl border-black/20 bg-white text-foreground shadow-none placeholder:text-black/35"
              {...form.register("confirmPassword")}
            />
            <FieldError message={form.formState.errors.confirmPassword?.message} />
          </div>
          <div className="rounded-[1.6rem] border border-white/18 bg-white/10 px-4 py-3 text-sm leading-6 text-white/76">
            Account creation still uses the same secure flow. The redesign just makes the
            entry point feel closer to an artist workspace than a default SaaS form.
          </div>
          <FieldError message={formError ?? undefined} />
          <Button
            className="h-14 w-full rounded-full bg-primary text-lg font-semibold text-primary-foreground shadow-none"
            type="submit"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Creating account..." : "Create account"}
          </Button>
          <p className="text-center text-sm text-white/76">
            Already have an account?{" "}
            <Link className="font-semibold text-primary underline underline-offset-4" href="/sign-in">
              Sign in
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
