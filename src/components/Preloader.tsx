import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import gbLogo from "@/assets/gb-ia-logo.png";

const MIN_VISIBLE = 600;
const MAX_VISIBLE = 4000;
const FADE_MS = 450;

function Overlay({ leaving, compact }: { leaving: boolean; compact?: boolean }) {
  return (
    <div
      className={`gbPreloader${leaving ? " gbPreloaderLeaving" : ""}${compact ? " gbPreloaderCompact" : ""}`}
      role="status"
      aria-live="polite"
      aria-label="Carregando"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2147483000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: compact ? "rgba(0,0,0,.82)" : "#000",
        opacity: leaving ? 0 : 1,
        transition: "opacity .45s ease",
        pointerEvents: leaving ? "none" : undefined,
      }}
    >
      <div
        className="gbPreloaderInner"
        style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}
      >
        <div
          className="gbPreloaderMark"
          style={{ position: "relative", width: compact ? 92 : 132, maxWidth: "44vw", overflow: "hidden" }}
        >
          <img src={gbLogo} alt="GB IA" style={{ display: "block", width: "100%", height: "auto" }} />
        </div>
        {!compact && (
          <div className="gbPreloaderBar" aria-hidden="true">
            <span />
          </div>
        )}
      </div>
    </div>
  );
}

/** Initial load overlay: rendered on the server so the first paint is never a broken page. */
function BootPreloader() {
  const [done, setDone] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const start = Date.now();
    let removeTimer: number | undefined;
    let cancelled = false;

    const finish = () => {
      if (cancelled) return;
      cancelled = true;
      const wait = Math.max(0, MIN_VISIBLE - (Date.now() - start));
      window.setTimeout(() => {
        setLeaving(true);
        removeTimer = window.setTimeout(() => {
          setDone(true);
          document.documentElement.classList.remove("gb-preloading");
          window.dispatchEvent(new CustomEvent("gbia:preload-done"));
        }, FADE_MS);
      }, wait);
    };

    document.documentElement.classList.add("gb-preloading");

    const ready = async () => {
      try {
        if (document.fonts?.ready) await document.fonts.ready;
      } catch {
        /* ignore */
      }
      if (document.readyState === "complete") finish();
      else window.addEventListener("load", finish, { once: true });
    };
    void ready();

    const hardStop = window.setTimeout(finish, MAX_VISIBLE);

    return () => {
      window.clearTimeout(hardStop);
      if (removeTimer) window.clearTimeout(removeTimer);
      window.removeEventListener("load", finish);
      document.documentElement.classList.remove("gb-preloading");
    };
  }, []);

  if (done) return null;
  return <Overlay leaving={leaving} />;
}

/** Lightweight overlay for route transitions that take longer than a moment. */
function RoutePreloader() {
  const isLoading = useRouterState({ select: (s) => s.status === "pending" || s.isLoading });
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setShow(false);
      return;
    }
    const t = window.setTimeout(() => setShow(true), 150);
    return () => window.clearTimeout(t);
  }, [isLoading]);

  if (!show) return null;
  return <Overlay leaving={false} compact />;
}

export function Preloader() {
  return (
    <>
      <BootPreloader />
      <RoutePreloader />
    </>
  );
}
