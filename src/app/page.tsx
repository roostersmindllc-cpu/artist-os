import { redirect } from "next/navigation";

import { getServerAuthSession } from "@/lib/auth";
import { getPostAuthRedirectPath } from "@/services/auth-service";

export default async function HomePage() {
  const session = await getServerAuthSession();

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  redirect(await getPostAuthRedirectPath(session.user.id));
}
