import { createFileRoute } from "@tanstack/react-router";
import { BrandLogo } from "@/components/BrandLogo";
import { usePageLink } from "@/lib/adminLinks";
import { PerspectiveTicker } from "@/components/imported/site-institucional/PerspectiveTicker";
import { FinalCta } from "@/components/FinalCta";
import { ProductSwitcher } from "@/components/ProductSwitcher";

const deliverables = [
  ["Proposta clara na primeira dobra", "O que você faz, para quem e por quê — sem rolar a página."],
  ["Prova de capacidade", "Cases, números e depoimentos que tiram a dúvida na hora."],
  ["Caminho único pro contato", "CTA claro, sem botões competindo pela atenção."],
  ["Estrutura sob medida", "Nada de template genérico adaptado à força."],
];

const steps = [
  ["Briefing", "Entendemos o que você vende e o que precisa provar."],
  ["Arquitetura", "Mensagem central, estrutura e tom definidos antes do visual."],
  ["Implementação", "Site construído com stack moderna, sem plugin."],
  ["Operação", "No ar, testado e com caminho de contato funcionando."],
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
        <p>Um site institucional não é cartão de visita. É um funil 24h que apresenta o que você faz, prova que pode confiar e direciona o visitante para o contato — sem depender de algoritmo.</p>
        <div className="siteProductActions"><a className="siteProductPrimary" href={whatsapp} target="_blank" rel="noreferrer">QUERO UM SITE QUE VENDE<br/><span>↗</span></a><a className="siteProductSecondary" href="#entregamos">Ver como funciona <span>↓</span></a></div>
      </section>

      <section className="siteProductProblem"><div><p className="studioEyebrow">POR QUE A MAIORIA FALHA</p><h2>Sem site profissional, você perde antes de conversar.</h2></div><p>O cliente pesquisa no Google, vê a concorrência e não te encontra. Ou encontra um site lento, genérico e sem rosto. Em 5 segundos ele decide: “não parece confiável”. E some.<br/><a className="siteProductPrimary siteProblemCta" href={whatsapp} target="_blank" rel="noreferrer">NÃO DEIXAR ISSO ACONTECER<br/><span>↗</span></a></p></section>

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

      <section id="entregamos" className="siteProductDeliverables"><div><p className="studioEyebrow">O QUE ENTREGAMOS</p><h2>Do que você precisa para vender sozinho.</h2></div><ol>{deliverables.map(([title, copy], index) => <li key={title}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{title}</h3><p>{copy}</p></div></li>)}</ol></section>

      <section className="siteWorkShowcase"><div><p className="studioEyebrow">JÁ ENTREGAMOS</p><h2>Sites que viraram cartão de visita e viraram porta de entrada.</h2></div><PerspectiveTicker/></section>

      <section className="siteProductProcess"><div><p className="studioEyebrow">COMO FUNCIONA</p><h2>Do briefing ao ar em 4 passos.</h2></div><ol>{steps.map(([title, copy], index) => <li key={title}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{title}</h3><p>{copy}</p></div></li>)}</ol></section>

      <FinalCta pageKey="site-institucional" productName="Site Institucional" title="Seu site pode ser sua melhor peça de vendas." subtitle="Me conta o que você vende. Devolvo uma estrutura e um valor." />
    </main>
    <footer className="studioFooter"><a href="/">GB IA.</a><span>Site Institucional · Autoridade e contato sem desvio</span></footer>
  </div>;
}

export const Route = createFileRoute("/site-institucional")({ component: SiteInstitucionalPage });
