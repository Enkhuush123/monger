/**
 * API configuration and helpers
 */
export const BACKEND_URL = 
  process.env.BACKEND_URL || 
  process.env.NEXT_PUBLIC_API_URL || 
  "http://127.0.0.1:8000";

export function getApiUrl(path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  
  // In the browser, use relative paths so Next.js proxies via rewrites (avoids CORS and mixed-content)
  // or use NEXT_PUBLIC_API_URL if explicitly provided
  if (typeof window !== "undefined") {
    if (process.env.NEXT_PUBLIC_API_URL) {
      return `${process.env.NEXT_PUBLIC_API_URL}${cleanPath}`;
    }
    return cleanPath;
  }
  
  // In server-side rendering (SSR), use absolute backend URL
  return `${BACKEND_URL}${cleanPath}`;
}
