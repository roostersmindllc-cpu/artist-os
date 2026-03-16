import type { ReactNode } from "react";

export default function AuthLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-6xl gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="hidden rounded-[2rem] border border-border/70 bg-card/70 p-10 shadow-sm backdrop-blur lg:block">
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
              Artist OS
            </p>
            <div className="space-y-3">
              <h1 className="font-heading text-5xl font-semibold leading-tight">
                One operating system for modern independent music teams.
              </h1>
              <p className="max-w-xl text-base text-muted-foreground">
                Releases, campaigns, fans, content, analytics, and tasks all live in one clean
                dashboard so launch week stops feeling chaotic.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-border/70 bg-background/70 p-5">
                <p className="text-sm font-medium text-muted-foreground">MVP focus</p>
                <p className="mt-2 font-heading text-xl font-semibold">
                  Maintainable foundations first
                </p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-background/70 p-5">
                <p className="text-sm font-medium text-muted-foreground">Current scope</p>
                <p className="mt-2 font-heading text-xl font-semibold">
                  Manual analytics, real CRUD, no fake integrations
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="flex items-center justify-center">{children}</section>
      </div>
    </div>
  );
}
