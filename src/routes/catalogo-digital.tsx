import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { usePageLink } from "@/lib/adminLinks";
import { ReferenceGallery, type Reference } from "@/components/imported/shared/ReferenceGallery";
import { catalogoReferences } from "@/lib/references";
import { fetchReferencesByPage } from "@/lib/cms";
import { CatalogoWidget } from "@/components/imported/catalogo-digital/CatalogoWidget";
import { FinalCta } from "@/components/FinalCta";
import { ProductSwitcher } from "@/components/ProductSwitcher";
import { siteUrl } from "@/lib/site";

const deliverables = [
  ["Catálogo organizado por categoria", "Produtos, serviços ou imóveis separados em grupos claros, com filtros e busca."],
  ["Fotos, preços e descrições", "Cada item com galeria, variações, valores e texto persuasivo."],
  ["Orçamento direto no WhatsApp", "O cliente seleciona o que quer e manda o pedido pronto para você responder."],
  ["Link único para compartilhar", "Um endereço só para bio, redes sociais, cartão e apresentações comerciais."],
];

const steps = [
  ["Levantamento do acervo", "Organizamos fotos, preços, descrições e categorias do que você vende."],
  ["Estrutura do catálogo", "Montamos navegação, filtros, busca e páginas de detalhe de cada item."],
  ["Teste com você", "Ajustamos textos, preços e fluxo de orçamento antes de publicar."],
  ["No ar", "Seu cliente navega, escolhe e pede orçamento sozinho, do celular ou desktop."],
];

function CatalogoDigitalPage() {
  const { ctaUrl: whatsapp, ctaLabel } = usePageLink("catalogo-digital");
  const [refs, setRefs] = useState<Reference[]>(catalogoReferences);
  useEffect(() => {
    fetchReferencesByPage("catalogo-digital")
      .then((r) => { if (r.length) setRefs(r.map((x) => ({ ...x, type: "catalogo" }))); })
      .catch(() => {});
  }, []);

  return (
    <div className="menuProductPage">
      <header className="studioNav menuProductNav">
        <BrandLogo />
        <a href={whatsapp} target="_blank" rel="noreferrer" className="studioNavCta">
          SOLICITAR ORÇAMENTO<br/><span>↗</span>
        </a>
      </header>
      <ProductSwitcher current="catalogo-digital" />
      <main>
        <section className="menuProductHero">
          <p className="studioEyebrow">CATÁLOGO DIGITAL</p>
          <h1>Tudo o que você vende, organizado para vender</h1>
          <p>
            Produtos, serviços, imóveis ou eventos: seu cliente navega, filtra e pede orçamento sozinho.
            Você recebe a lista pronta no WhatsApp.
          </p>
          <div className="menuProductActions">
            <a className="menuProductPrimary" href={whatsapp} target="_blank" rel="noreferrer">
              SOLICITAR ORÇAMENTO<br/><span>↗</span>
            </a>
            <a className="menuProductSecondary" href="#entregamos">
              Ver como funciona <span>↓</span>
            </a>
          </div>
        </section>

        <section id="entregamos" className="menuValueDeliverables">
          <div>
            <h2>Um catálogo que trabalha por você.</h2>
          </div>
          <ol>
            {deliverables.map(([title, copy], index) => (
              <li key={title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div><h3>{title}</h3><p>{copy}</p></div>
              </li>
            ))}
          </ol>
        </section>

        <section className="menuReferenceSection">
          <div>
            <p className="studioEyebrow">REFERÊNCIAS</p>
            <h2>Catálogos digitais de nichos reais <em>e interfaces que a gente replica.</em></h2>
            <p>Mobiliária, moda, serviços, construção, imobiliária e eventos. Clique para ampliar e imagine o seu catálogo nesse visual.</p>
          </div>
          <ReferenceGallery items={refs} ctaUrl={whatsapp} />
        </section>

        <section className="menuCatalogWidgetSection">
          <div className="menuCatalogIntro">
            <p className="studioEyebrow">EXPERIMENTE AGORA</p>
            <h2>Assim seu cliente navega, escolhe e pede orçamento.</h2>
            <p>
              Toque em qualquer item. Veja fotos, preço, categoria e o botão de adicionar —
              o mesmo fluxo que entregamos, no celular ou desktop do seu cliente.
            </p>
          </div>
          <CatalogoWidget />
        </section>

        <section className="menuProductProcess">
          <div>
            <p className="studioEyebrow">COMO FUNCIONA</p>
            <h2>Autonomia para o cliente e tempo de volta para você!</h2>
          </div>
          <ol>
            {steps.map(([title, copy], index) => (
              <li key={title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div><h3>{title}</h3><p>{copy}</p></div>
              </li>
            ))}
          </ol>
        </section>

        <FinalCta
          pageKey="catalogo-digital"
          productName="Catálogo Digital"
          title="Quer seu catálogo vendendo por você?"
          subtitle="Me conta o que você vende hoje — produtos, serviços, imóveis ou eventos. Devolvo escopo, prazo e valor."
        />
      </main>
      <footer className="studioFooter">
        <a href="/">GB IA.</a>
        <span>Catálogo Digital · Produtos, serviços e imóveis</span>
      </footer>
    </div>
  );
}

export const Route = createFileRoute("/catalogo-digital")({
  component: CatalogoDigitalPage,
  head: () => ({
    meta: [
      { title: "Catálogo Digital — Produtos, serviços e imóveis | GB IA" },
      { name: "description", content: "Catálogo digital sob medida para mobiliária, moda, serviços, construção, imobiliária e eventos. Seu cliente navega e pede orçamento no WhatsApp." },
      { property: "og:title", content: "Catálogo Digital — Produtos, serviços e imóveis | GB IA" },
      { property: "og:description", content: "Catálogo digital sob medida para mobiliária, moda, serviços, construção, imobiliária e eventos. Seu cliente navega e pede orçamento no WhatsApp." },
      { property: "og:type", content: "product" },
      { property: "og:url", content: siteUrl("/catalogo-digital") },
    ],
    links: [{ rel: "canonical", href: siteUrl("/catalogo-digital") }],
  }),
});
