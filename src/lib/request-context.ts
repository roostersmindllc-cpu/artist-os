type HeaderBag =
  | Headers
  | Record<string, string | string[] | undefined>
  | undefined
  | null;

function readHeaderValue(headers: HeaderBag, key: string) {
  if (!headers) {
    return undefined;
  }

  if (headers instanceof Headers) {
    return headers.get(key) ?? undefined;
  }

  const value = headers[key] ?? headers[key.toLowerCase()] ?? headers[key.toUpperCase()];

  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

export function getClientIp(headers: HeaderBag) {
  const forwardedFor = readHeaderValue(headers, "x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor
      .split(",")
      .map((value) => value.trim())
      .find(Boolean);
  }

  const fallbackHeaders = [
    "x-real-ip",
    "cf-connecting-ip",
    "fly-client-ip",
    "x-vercel-forwarded-for"
  ];

  for (const header of fallbackHeaders) {
    const value = readHeaderValue(headers, header)?.trim();

    if (value) {
      return value;
    }
  }

  return undefined;
}
