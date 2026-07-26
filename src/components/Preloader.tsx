import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import gbLogo from "@/assets/gb-ia-logo.png";

const MIN_VISIBLE = 350;
const MAX_VISIBLE = 2000;
const FADE_MS = 300;

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
        transition: `opacity ${FADE_MS}ms ease`,
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
          <div
            className="gbPreloaderBar"
            aria-hidden="true"
            style={{
              position: "relative",
              width: 150,
              maxWidth: "46vw",
              height: 2,
              borderRadius: 999,
              background: "rgba(255,255,255,.1)",
              overflow: "hidden",
            }}
          >
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
    // If the inline safety script already released the page, never show it again.
    if (typeof window !== "undefined" && (window as unknown as { __gbPreloadDone?: boolean }).__gbPreloadDone) {
      document.documentElement.classList.remove("gb-preloading");
      setDone(true);
      return;
    }

    const start = Date.now();
    let waitTimer: number | undefined;
    let removeTimer: number | undefined;
    let finished = false;

    const release = () => {
      document.documentElement.classList.remove("gb-preloading");
      (window as unknown as { __gbPreloadDone?: boolean }).__gbPreloadDone = true;
      window.dispatchEvent(new CustomEvent("gbia:preload-done"));
    };

    const finish = () => {
      if (finished) return;
      finished = true;
      const wait = Math.max(0, MIN_VISIBLE - (Date.now() - start));
      waitTimer = window.setTimeout(() => {
        // Unlock scroll and pointer events as the fade starts, not after it.
        setLeaving(true);
        release();
        removeTimer = window.setTimeout(() => setDone(true), FADE_MS);
      }, wait);
    };

    document.documentElement.classList.add("gb-preloading");

    // Leave as soon as React has hydrated and painted the first frame.
    const raf1 = requestAnimationFrame(() => requestAnimationFrame(finish));
    const hardStop = window.setTimeout(finish, MAX_VISIBLE);

    return () => {
      cancelAnimationFrame(raf1);
      window.clearTimeout(hardStop);
      if (waitTimer) window.clearTimeout(waitTimer);
      if (removeTimer) window.clearTimeout(removeTimer);
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
    const t = window.setTimeout(() => setShow(true), 250);
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
