import { usePageLink, type PageKey } from "@/lib/adminLinks";

type Props = {
  pageKey: PageKey;
  productName: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
};

export function FinalCta({
  pageKey,
  productName,
  eyebrow,
  title = "Uma conversa. Um orçamento sob medida.",
  subtitle = "Conte o contexto do seu projeto. Devolvemos escopo e valor.",
}: Props) {
  const { ctaUrl, ctaLabel } = usePageLink(pageKey);
  const label = ctaLabel || "Solicitar orçamento no WhatsApp";
  const href = ctaUrl || "#";
  return (
    <section className="finalCta" aria-label={`Orçamento — ${productName}`}>
      <div className="finalCtaInner">
        <p className="finalCtaEyebrow">ORÇAMENTO · {productName.toUpperCase()}</p>
        <h2 className="finalCtaTitle">{title}</h2>
        <p className="finalCtaSub">{subtitle}</p>
        <a className="finalCtaButton" href={href} target="_blank" rel="noreferrer">
          <span>{label}</span>
          <i aria-hidden>→</i>
        </a>
      </div>
    </section>
  );
}
