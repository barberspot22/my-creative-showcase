import { useSyncExternalStore } from "react";

export type LinkOverlay = { ctaUrl?: string; ctaLabel?: string };
export type Overlay = {
  texts: Record<string, Record<string, string>>;
  links: Record<string, LinkOverlay>;
};

const EMPTY: Overlay = { texts: {}, links: {} };
let overlay: Overlay = EMPTY;
const listeners = new Set<() => void>();

const MSG_UPDATE = "gbia:preview";
const MSG_READY = "gbia:preview-ready";

export function isPreviewMode(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return new URL(window.location.href).searchParams.get("preview") === "1";
  } catch {
    return false;
  }
}

let installed = false;
function install() {
  if (installed || typeof window === "undefined") return;
  installed = true;
  if (!isPreviewMode()) return;
  window.addEventListener("message", (e: MessageEvent) => {
    if (e.origin !== window.location.origin) return;
    const data: any = e.data;
    if (!data || data.type !== MSG_UPDATE) return;
    overlay = {
      texts: data.texts && typeof data.texts === "object" ? data.texts : {},
      links: data.links && typeof data.links === "object" ? data.links : {},
    };
    listeners.forEach((l) => l());
  });
  try {
    window.parent?.postMessage({ type: MSG_READY }, window.location.origin);
  } catch {}
}

if (typeof window !== "undefined") install();

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function useOverlay(): Overlay {
  return useSyncExternalStore(
    subscribe,
    () => overlay,
    () => EMPTY,
  );
}

export function emitPreview(
  target: Window | null | undefined,
  payload: { texts?: Overlay["texts"]; links?: Overlay["links"] },
) {
  if (!target) return;
  try {
    target.postMessage(
      { type: MSG_UPDATE, texts: payload.texts ?? {}, links: payload.links ?? {} },
      window.location.origin,
    );
  } catch {}
}

export const PREVIEW_READY_MSG = MSG_READY;
