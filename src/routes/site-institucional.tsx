import { createFileRoute } from "@tanstack/react-router";
import { BrandLogo } from "@/components/BrandLogo";
import { usePageLink } from "@/lib/adminLinks";
import { ReferenceGallery } from "@/components/imported/shared/ReferenceGallery";
import { institucionalReferences } from "@/lib/references";
import { FinalCta } from "@/components/FinalCta";
import { ProductSwitcher } from "@/components/ProductSwitcher";

const deliverables = [
  ["Proposta clara na primeira dobra", "O que você faz, para quem e por quê — sem rolar a página."],
  ["Prova de capacidade", "Cases, números e depoimentos que tiram a dúvida na hora."],
  ["Caminho único pro contato", "CTA claro, sem botões competindo pela atenção."],
  ["Estrutura sob medida", "Nada de template genérico personalizamos para sua empresa\u00a0"],
];

const steps = [
  ["Briefing", "Entendemos o que você vende, o que oferece e qual é a proposta da marca."],
  ["Estrutura", "Definimos a organização das páginas, mensagens e caminhos que o visitante vai percorrer."],
  ["Protótipo", "Apresentamos o layout do site para você ver como vai ficar antes de produzir."],
  ["Validação", "Ajustamos com base no seu feedback e só então partimos para a versão final."],
  ["Entrega", "Site no ar, testado, e acompanhado para ver se está gerando resultado."],
];



function SiteInstitucionalPage() {
  const { ctaUrl: whatsapp, ctaLabel } = usePageLink("site-institucional");
  return <div className="siteProductPage">
    <header className="studioNav siteProductNav"><BrandLogo /><a href={whatsapp} target="_blank" rel="noreferrer" className="studioNavCta">SOLICITAR ORÇAMENTO<br/><span>↗</span></a></header>
    <ProductSwitcher current="site-institucional" />
    <main>
      <section className="siteProductHero">
        <p className="studioEyebrow">SITE INSTITUCIONAL</p>
        <h1>Só existir<br/>não basta.</h1>
        <p>Seu cartão de visita digital, aberto 24h. Apresenta, prova autoridade e leva ao contato.</p>
        <div className="siteProductActions"><a className="siteProductPrimary" href={whatsapp} target="_blank" rel="noreferrer">QUERO UM SITE QUE VENDE<br/><span>↗</span></a><a className="siteProductSecondary" href="#entregamos">Ver como funciona <span>↓</span></a></div>
      </section>

      <section className="siteWorkShowcase"><div><p className="studioEyebrow">PORTFÓLIO</p><h2>Referências que a gente transforma no seu site.</h2></div><ReferenceGallery items={institucionalReferences} ctaUrl={whatsapp} /></section>


      <section className="siteProductValue">
        <div><p className="studioEyebrow">O QUE ELE FAZ</p><h2>Site institucional é vendedor que não dorme.</h2></div>
        <div>
          <ul>
            <li><strong>Apresenta a marca</strong> em segundos.</li>
            <li><strong>Organiza serviços e produtos</strong> de um jeito que o cliente entende.</li>
            <li><strong>Converte visita</strong> em WhatsApp, ligação ou formulário.</li>
          </ul>
          <a className="siteProductPrimary" href={whatsapp} target="_blank" rel="noreferrer">QUANTO CUSTA NÃO TER ISSO<br/><span>↗</span></a>
        </div>
      </section>

      <section className="siteProductProcess"><div><p className="studioEyebrow">COMO FUNCIONA</p><h2>Do briefing ao ar em 4 passos.</h2></div><ol>{steps.map(([title, copy], index) => <li key={title}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{title}</h3><p>{copy}</p></div></li>)}</ol></section>

      <FinalCta pageKey="site-institucional" productName="Site Institucional" title="Seu site pode ser sua melhor peça de vendas." subtitle="Me conta o que você vende. Devolvo uma estrutura e um valor." />
    </main>
    <footer className="studioFooter"><a href="/">GB IA.</a><span>Site Institucional · Autoridade e contato sem desvio</span></footer>
  </div>;
}

export const Route = createFileRoute("/site-institucional")({ component: SiteInstitucionalPage });
