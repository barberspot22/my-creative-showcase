import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import importedCss from "../imported.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { TrackingScripts } from "@/components/TrackingScripts";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "GB IA — Sistemas, automação e IA autônoma" },
      { name: "description", content: "GB IA cria sistemas sob medida, automações e agentes de IA autônoma para negócios que querem escalar com tecnologia de ponta." },
      { name: "keywords", content: "GB IA, inteligência artificial, automação, sistemas sob medida, agentes autônomos, CRM, e-commerce, cardápio digital, site institucional" },
      { name: "author", content: "GB IA" },
      { name: "theme-color", content: "#000000" },
      { property: "og:site_name", content: "GB IA" },
      { property: "og:title", content: "GB IA — Sistemas, automação e IA autônoma" },
      { property: "og:description", content: "Soluções sob medida em sistemas, automação e IA autônoma para transformar o seu negócio." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://gb-ia.lovable.app" },
      { property: "og:image", content: "https://gb-ia.lovable.app/og-gb-ia.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:locale", content: "pt_BR" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "GB IA — Sistemas, automação e IA autônoma" },
      { name: "twitter:description", content: "Soluções sob medida em sistemas, automação e IA autônoma para transformar o seu negócio." },
      { name: "twitter:image", content: "https://gb-ia.lovable.app/og-gb-ia.jpg" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "stylesheet", href: importedCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500;600&family=Manrope:wght@400;500;600;700;800&display=swap" },
      { rel: "icon", type: "image/png", href: "/favicon-gb.png" },
      { rel: "apple-touch-icon", href: "/favicon-gb.png" },
      { rel: "canonical", href: "https://gb-ia.lovable.app" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "GB IA",
          url: "https://gb-ia.lovable.app",
          logo: "https://gb-ia.lovable.app/favicon-gb.png",
          description: "Sistemas sob medida, automação e IA autônoma para negócios.",
        }),
      },
    ],
  }),

  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  useEffect(() => {
    let last = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const goingDown = y > last && y > 80;
        document.body.classList.toggle("nav-hidden", goingDown);
        document.body.classList.toggle("nav-scrolled", y > 20);
        last = y;
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TrackingScripts />
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
