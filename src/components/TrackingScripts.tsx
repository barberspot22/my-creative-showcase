import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouterState } from "@tanstack/react-router";
import { fetchTracking } from "@/lib/cms";
import { trackPageView } from "@/lib/tracking";

export function TrackingScripts() {
  const { data: t } = useQuery({ queryKey: ["tracking-settings"], queryFn: fetchTracking, staleTime: 60_000 });
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Expose current settings to trackEvent helpers
  useEffect(() => {
    if (!t || typeof window === "undefined") return;
    window.__gbTracking = {
      meta_pixel_id: t.meta_pixel_id,
      ga4_measurement_id: t.ga4_measurement_id,
      gtm_container_id: t.gtm_container_id,
      google_ads_id: t.google_ads_id,
      google_ads_conversion_label: t.google_ads_conversion_label,
      meta_capi_enabled: t.meta_capi_enabled,
      meta_test_event_code: t.meta_test_event_code,
    };
  }, [t]);

  // Meta Pixel
  useEffect(() => {
    if (!t?.meta_pixel_id) return;
    if (document.getElementById("meta-pixel-script")) return;
    const s = document.createElement("script");
    s.id = "meta-pixel-script";
    s.innerHTML = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init', '${t.meta_pixel_id}');fbq('track', 'PageView');`;
    document.head.appendChild(s);
  }, [t?.meta_pixel_id]);

  // GA4
  useEffect(() => {
    if (!t?.ga4_measurement_id) return;
    if (document.getElementById("ga4-script")) return;
    const s = document.createElement("script");
    s.id = "ga4-script";
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${t.ga4_measurement_id}`;
    document.head.appendChild(s);
    const inline = document.createElement("script");
    inline.innerHTML = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js', new Date());gtag('config', '${t.ga4_measurement_id}');${t.google_ads_id ? `gtag('config','${t.google_ads_id}');` : ""}`;
    document.head.appendChild(inline);
  }, [t?.ga4_measurement_id, t?.google_ads_id]);

  // GTM
  useEffect(() => {
    if (!t?.gtm_container_id) return;
    if (document.getElementById("gtm-script")) return;
    const s = document.createElement("script");
    s.id = "gtm-script";
    s.innerHTML = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${t.gtm_container_id}');`;
    document.head.appendChild(s);
  }, [t?.gtm_container_id]);

  // Fire pageview on route change
  useEffect(() => {
    if (!t) return;
    trackPageView();
  }, [pathname, t]);

  return null;
}
