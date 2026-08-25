import { wa } from "@/lib/adminLinks";

type Props = {
  /** Mensagem personalizada enviada no WhatsApp para esta seção. */
  message: string;
  label?: string;
  align?: "left" | "center";
  /** Identificador da seção para o rastreamento de Lead. */
  source?: string;
};

/** Botão de WhatsApp inline, com mensagem específica da seção. */
export function SectionCta({ message, label = "Falar no WhatsApp", align = "center", source }: Props) {
  return (
    <div className={`sectionCtaWrap ${align === "left" ? "isLeft" : ""}`}>
      <a
        className="sectionCtaButton"
        href={wa(message)}
        target="_blank"
        rel="noreferrer"
        onClick={() => {
          import("@/lib/tracking").then(({ trackLead }) =>
            trackLead(source || label.toLowerCase().replace(/\s+/g, "_")),
          );
        }}
      >
        <span>{label}</span>
        <i aria-hidden>↗</i>
      </a>
    </div>
  );
}
