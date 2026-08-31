import { wa } from "@/lib/adminLinks";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 5.834h-.004c-1.586 0-3.134-.425-4.49-1.229l-.322-.191-3.34.876.893-3.253-.209-.332C3.874 14.14 3.32 12.46 3.32 10.724c0-4.032 3.28-7.312 7.313-7.312 1.954 0 3.794.762 5.175 2.143a7.274 7.274 0 0 1 2.138 5.178c-.001 4.032-3.281 7.313-7.313 7.313M20.487 3.512A11.965 11.965 0 0 0 12 0C5.373 0 0 5.373 0 12c0 2.104.551 4.113 1.573 5.9L.054 23.946l6.176-1.62A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12 0-3.205-1.25-6.215-3.513-8.488" />
    </svg>
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
