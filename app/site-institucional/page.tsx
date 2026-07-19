import { PerspectiveTicker } from "./PerspectiveTicker";

const deliverables = [
  ["Posicionamento claro na primeira dobra", "O que a empresa faz, para quem e por quê, sem rolar a página."],
  ["Prova de capacidade", "Cases e diferenciais reais, sem texto vago."],
  ["Caminho único pro contato", "CTA claro, sem botões competindo."],
  ["Estrutura sob medida", "Nada de template genérico adaptado à força."],
];

const steps = [
  ["Briefing", "Entendemos o que a empresa faz e o que o site precisa provar."],
  ["Arquitetura", "Desenhamos estrutura e mensagem central antes do visual."],
  ["Implementação", "Construção com stack moderna, sem plugin."],
  ["Operação", "Site no ar, testado, caminho de contato funcionando."],
];

const whatsapp = "https://wa.me/?text=Olá%2C%20quero%20conversar%20sobre%20um%20site%20institucional.";

export default function SiteInstitucionalPage() {
  return <div className="siteProductPage">
    <header className="studioNav siteProductNav"><a href="/" className="studioBrand">GB IA.</a><a href={whatsapp} target="_blank" rel="noreferrer" className="studioNavCta">Falar no WhatsApp <span>↗</span></a></header>
    <main>
      <section className="siteProductHero">
        <p className="studioEyebrow">SITE INSTITUCIONAL</p>
        <h1>Site institucional não é enfeite.<br/>É a primeira prova de que sua empresa é séria.</h1>
        <p>Construímos sites institucionais que passam autoridade em segundos e direcionam o visitante pro contato certo — sem página genérica, sem texto de agência que não diz nada.</p>
        <div className="siteProductActions"><a className="siteProductPrimary" href={whatsapp} target="_blank" rel="noreferrer">Falar no WhatsApp <span>↗</span></a><a className="siteProductSecondary" href="#entregamos">Ver o que entregamos <span>↓</span></a></div>
      </section>

      <section className="siteProductProblem"><div><p className="studioEyebrow">POR QUE A MAIORIA FALHA</p><h2>Site bonito que ninguém entende o que a empresa faz em 5 segundos.</h2></div><p>Texto genérico de agência, seção decorativa sem função, contato escondido no rodapé. O visitante entra, não entende a proposta e sai sem falar com ninguém. A gente constrói o site pra provar capacidade rápido e levar direto pro WhatsApp ou formulário.</p></section>

      <section id="entregamos" className="siteProductDeliverables"><div><p className="studioEyebrow">O QUE ENTREGAMOS</p><h2>Clareza antes de decoração.</h2></div><ol>{deliverables.map(([title, copy], index) => <li key={title}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{title}</h3><p>{copy}</p></div></li>)}</ol></section>

      <section className="siteWorkShowcase"><div><p className="studioEyebrow">JÁ ENTREGAMOS</p><h2>Sites que explicam, provam e direcionam.</h2></div><PerspectiveTicker/></section>

      <section className="siteProductProcess"><div><p className="studioEyebrow">COMO FUNCIONA</p><h2>Da mensagem central ao site no ar.</h2></div><ol>{steps.map(([title, copy], index) => <li key={title}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{title}</h3><p>{copy}</p></div></li>)}</ol></section>

      <section className="siteProductFinal"><p className="studioEyebrow">VAMOS CONVERSAR</p><h2>Me conta o que sua empresa faz.<br/>A gente constrói o site que prova isso.</h2><p>Sem proposta engessada — o primeiro papo é pra entender se faz sentido.</p><a className="siteProductPrimary" href={whatsapp} target="_blank" rel="noreferrer">Chamar no WhatsApp <span>↗</span></a></section>
    </main>
    <footer className="studioFooter"><a href="/">GB IA.</a><span>Site Institucional · Autoridade e contato sem desvio</span></footer>
  </div>;
}
