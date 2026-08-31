import { wa } from "@/lib/adminLinks";
import whatsappLogo from "@/assets/whatsapp-logo.png.asset.json";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <img
      className={className}
      src={whatsappLogo.url}
      alt=""
      aria-hidden="true"
      width={56}
      height={56}
    />
  );
}

export type FloatingWhatsAppProps = {
  /** Mensagem pré-preenchida no WhatsApp. */
  message: string;
  /** Rótulo acessível / tooltip. */
  label?: string;
  /** Identificador para rastreamento. */
  source?: string;
};

/** Botão flutuante de WhatsApp presente em todas as páginas. */
export function FloatingWhatsApp({
  message,
  label = "Falar no WhatsApp",
  source = "floating_whatsapp",
}: FloatingWhatsAppProps) {
  return (
    <a
      className="floatingWhatsApp"
      href={wa(message)}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      title={label}
      onClick={() => {
        import("@/lib/tracking").then(({ trackLead }) =>
          trackLead(source),
        );
      }}
    >
      <WhatsAppIcon className="floatingWhatsAppIcon" />
      <span className="floatingWhatsAppLabel">{label}</span>
    </a>
  );
}

/** Mensagem padrão usada quando nenhuma página específica é informada. */
export const DEFAULT_FLOATING_MESSAGE =
  "Olá! Vim pelo site da GB IA e quero conversar sobre uma solução para o meu negócio.";
