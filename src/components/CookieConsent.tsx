import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";

const STORAGE_KEY = "gbia:cookie-consent";

type Choice = "accepted" | "rejected";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        const t = window.setTimeout(() => setVisible(true), 600);
        return () => window.clearTimeout(t);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  const decide = (choice: Choice) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ choice, at: Date.now() }));
    } catch {
      /* ignore */
    }
    setVisible(false);
    window.dispatchEvent(new CustomEvent("gbia:cookie-consent", { detail: choice }));
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Aviso de cookies"
      className="cookieConsent"
    >
      <div className="cookieConsentInner">
        <div className="cookieConsentCopy">
          <p className="cookieConsentTitle">Usamos cookies</p>
          <p className="cookieConsentText">
            Utilizamos cookies para melhorar sua experiência, analisar o uso do site
            e personalizar conteúdo. Ao continuar, você concorda com nossa{" "}
            <Link to="/politica-de-privacidade" className="cookieConsentLink">
              Política de Privacidade
            </Link>
            .
          </p>
        </div>
        <div className="cookieConsentActions">
          <button
            type="button"
            onClick={() => decide("rejected")}
            className="cookieConsentBtn cookieConsentBtnGhost"
          >
            Recusar
          </button>
          <button
            type="button"
            onClick={() => decide("accepted")}
            className="cookieConsentBtn cookieConsentBtnPrimary"
          >
            Aceitar todos
          </button>
        </div>
      </div>
    </div>
  );
}
