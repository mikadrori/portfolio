/**
 * Analytics wiring for the portfolio.
 *
 * Two providers, both cookie-light enough that no consent banner is used:
 * - Vercel Web Analytics (cookieless) — visitors, referrers, per-route pageviews.
 *   Mounted as a component in `main.tsx`; nothing to configure here.
 * - Microsoft Clarity — scroll maps, click maps, session recordings, custom events.
 *   Loaded only when `VITE_CLARITY_ID` is set, and only in production builds so
 *   local development never pollutes the recordings.
 *
 * `trackEvent` is deliberately provider-agnostic: if Clarity is ever swapped for
 * PostHog/Plausible, this file is the only one that changes.
 */

const CLARITY_ID = import.meta.env.VITE_CLARITY_ID as string | undefined;

type ClarityFn = (...args: unknown[]) => void;

declare global {
  interface Window {
    clarity?: ClarityFn;
  }
}

let initialized = false;

/** Inject the Clarity tag. No-op without an ID, outside production, or if already loaded. */
export function initAnalytics(): void {
  if (initialized) return;
  initialized = true;

  if (!CLARITY_ID || !import.meta.env.PROD) return;

  // Official Clarity snippet, transcribed into module scope.
  window.clarity =
    window.clarity ||
    function (...args: unknown[]) {
      (window.clarity as ClarityFn & { q?: unknown[] }).q =
        (window.clarity as ClarityFn & { q?: unknown[] }).q || [];
      (window.clarity as ClarityFn & { q?: unknown[] }).q!.push(args);
    };

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.clarity.ms/tag/${CLARITY_ID}`;
  document.head.appendChild(script);
}

/**
 * Record a custom event.
 *
 * Clarity models this as one event name plus flat string tags, so `props` are
 * sent as tags rather than a nested payload. In development the event is logged
 * instead, which keeps the section/scroll instrumentation debuggable offline.
 */
export function trackEvent(
  name: string,
  props: Record<string, string | number> = {},
): void {
  if (import.meta.env.DEV) {
    console.debug("[analytics]", name, props);
    return;
  }

  const clarity = window.clarity;
  if (!clarity) return;

  for (const [key, value] of Object.entries(props)) {
    clarity("set", key, String(value));
  }
  clarity("event", name);
}
