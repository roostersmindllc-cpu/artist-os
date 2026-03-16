import { SignInForm } from "@/components/auth/sign-in-form";
import { redirectAuthenticatedUser } from "@/lib/route-access";

export default async function SignInPage() {
  await redirectAuthenticatedUser();

  return <SignInForm />;
}
