// Allowed origins for CORS (local development defaults)
export const allowedOrigins: string[] = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:8001",
  "http://localhost:8002",
  // Add common development origins
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
  "http://127.0.0.1:8001",
  "http://127.0.0.1:8002",
  // Local backend preview ports for static test pages
  "http://localhost:5000",
  "http://localhost:5001",
  "http://localhost:8003",
  "http://127.0.0.1:5000",
  "http://127.0.0.1:5001",
  "http://127.0.0.1:8003",
  // Dev server alternate ports
  "http://localhost:5003",
  "http://127.0.0.1:5003",
  "http://localhost:5005",
  "http://127.0.0.1:5005"
];

/**
 * Production origins come from the environment so deployments never need code changes:
 *   - NEXT_PUBLIC_SITE_URL / NEXT_PUBLIC_ADMIN_URL (already defined in the root .env)
 *   - CORS_ORIGINS: optional comma-separated extra origins
 */
const envOrigins = (): string[] =>
  [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.NEXT_PUBLIC_ADMIN_URL,
    ...(process.env.CORS_ORIGINS || "").split(",")
  ]
    .map((origin) => origin?.trim().replace(/\/+$/, ""))
    .filter((origin): origin is string => Boolean(origin));

export const isOriginAllowed = (origin?: string): boolean => {
  if (!origin) return true; // allow non-browser clients (Postman/mobile)
  if (allowedOrigins.includes(origin)) return true;
  if (envOrigins().includes(origin)) return true;

  // Allow local network origins in development (10.x.x.x, 192.168.x.x, 172.x.x.x)
  if (process.env.NODE_ENV === "development") {
    if (
      origin.startsWith("http://10.") ||
      origin.startsWith("https://10.") ||
      origin.startsWith("http://192.168.") ||
      origin.startsWith("https://192.168.") ||
      origin.startsWith("http://172.") ||
      origin.startsWith("https://172.")
    ) {
      return true;
    }
  }

  return false;
};
