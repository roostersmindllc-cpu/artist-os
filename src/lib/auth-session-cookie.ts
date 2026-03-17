const AUTH_SESSION_COOKIE_NAMES = [
  "__Secure-next-auth.session-token",
  "next-auth.session-token"
] as const;

function matchesCookieName(name: string, expectedName: string) {
  return name === expectedName || name.startsWith(`${expectedName}.`);
}

export function hasAuthSessionCookie(cookieNames: Iterable<string>) {
  const normalizedCookieNames = Array.from(cookieNames);

  return AUTH_SESSION_COOKIE_NAMES.some((expectedName) =>
    normalizedCookieNames.some((name) => matchesCookieName(name, expectedName))
  );
}
