import { SignUpForm } from "@/components/auth/sign-up-form";
import { redirectAuthenticatedUser } from "@/lib/route-access";

export default async function SignUpPage() {
  await redirectAuthenticatedUser();

  return <SignUpForm />;
}
