import { wa } from "@/lib/adminLinks";

type Props = {
  /** Mensagem personalizada enviada no WhatsApp para esta seção. */
  message: string;
  label?: string;
  align?: "left" | "center";
};

/** Botão de WhatsApp inline, com mensagem específica da seção. */
export function SectionCta({ message, label = "Falar no WhatsApp", align = "center" }: Props) {
  return (
    <div className={`sectionCtaWrap ${align === "left" ? "isLeft" : ""}`}>
      <a className="sectionCtaButton" href={wa(message)} target="_blank" rel="noreferrer">
        <span>{label}</span>
        <i aria-hidden>↗</i>
      </a>
    </div>
  );
}
