// Client-side tracking helpers. Fires events into Meta Pixel, GA4, GTM, Google Ads
// based on tracking_settings loaded from Cloud. Also mirrors "Lead" conversion
// to Meta Conversion API server-side for iOS 14+/AdBlock resilience.

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    __gbTracking?: {
      meta_pixel_id: string;
      ga4_measurement_id: string;
      gtm_container_id: string;
      google_ads_id: string;
      google_ads_conversion_label: string;
      meta_capi_enabled: boolean;
      meta_test_event_code: string;
    };
  }
}

function uuid() {
  return "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

// Eventos padrao do Meta (os demais vao como trackCustom)
const META_STANDARD_EVENTS = new Set([
  "PageView", "Lead", "Contact", "Purchase", "ViewContent", "Search", "AddToCart",
  "InitiateCheckout", "CompleteRegistration", "Schedule", "SubmitApplication",
  "Subscribe", "StartTrial", "AddPaymentInfo", "AddToWishlist", "CustomizeProduct",
  "Donate", "FindLocation",
]);

// GA4 prefere snake_case
function ga4Name(name: string) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/[^a-zA-Z0-9_]/g, "_")
    .toLowerCase()
    .slice(0, 40);
}

export function trackEvent(name: string, params: Record<string, unknown> = {}) {
  const s = typeof window !== "undefined" ? window.__gbTracking : undefined;
  const eventId = uuid();
  const withId = { ...params, eventID: eventId };

  try {
    if (window.fbq && s?.meta_pixel_id) {
      const verb = META_STANDARD_EVENTS.has(name) ? "track" : "trackCustom";
      window.fbq(verb, name, withId, { eventID: eventId });
    }
  } catch { /* noop */ }

  try {
    if (window.gtag && s?.ga4_measurement_id) {
      window.gtag("event", ga4Name(name), params);
    }
  } catch { /* noop */ }

  try {
    if (window.dataLayer) {
      window.dataLayer.push({ event: name, ...params });
    }
  } catch { /* noop */ }

  // Google Ads conversion
  try {
    if (window.gtag && s?.google_ads_id && s?.google_ads_conversion_label && (name === "Lead" || name === "Contact" || name === "Purchase")) {
      window.gtag("event", "conversion", {
        send_to: `${s.google_ads_id}/${s.google_ads_conversion_label}`,
      });
    }
  } catch { /* noop */ }

  // Meta CAPI
  if (s?.meta_capi_enabled) {
    fetch("/api/public/meta-capi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event_name: name,
        event_id: eventId,
        event_source_url: window.location.href,
        custom_data: params,
      }),
      keepalive: true,
    }).catch(() => { /* noop */ });
  }

  return eventId;
}

export function trackLead(source: string, extra: Record<string, unknown> = {}) {
  return trackEvent("Lead", { source, ...extra });
}

export function trackContact(source: string, extra: Record<string, unknown> = {}) {
  return trackEvent("Contact", { source, ...extra });
}

export function trackPageView() {
  const s = typeof window !== "undefined" ? window.__gbTracking : undefined;
  try {
    if (window.fbq && s?.meta_pixel_id) window.fbq("track", "PageView");
  } catch { /* noop */ }
  try {
    if (window.gtag && s?.ga4_measurement_id) {
      window.gtag("event", "page_view", { page_path: window.location.pathname });
    }
  } catch { /* noop */ }
}
