import { createFileRoute } from "@tanstack/react-router";
import { BrandLogo } from "@/components/BrandLogo";
import { FormEvent, useState } from "react";
import { LookbookGallery } from "@/components/imported/gb-studio/LookbookGallery";
import { usePageLink } from "@/lib/adminLinks";

const differences = [
  "Qualidade visual equivalente a um estúdio convencional",
  "Custo bem mais baixo que produção fotográfica tradicional",
  "Entrega muito mais rápida, sem agenda de estúdio, modelo ou locação",
  "Modelos virtuais configuráveis e reaproveitáveis entre campanhas",
  "Rodadas de correção até a aprovação final da peça",
];

const steps = [
  ["Briefing", "Você envia a peça ou roupa e as referências de estilo."],
  ["Geração", "A IA produz as imagens do modelo vestindo a peça."],
  ["Ajustes", "Corrigimos caimento, cor e pose até você aprovar."],
  ["Entrega", "Você recebe o lookbook final pronto para os canais de venda."],
];

function GBStudioPage() {
  const [briefing, setBriefing] = useState(false);
  const [sent, setSent] = useState(false);
  const { ctaUrl, ctaLabel } = usePageLink("gb-studio");
  const submit = (e: FormEvent) => { e.preventDefault(); setSent(true); };
  const navCtaProps = ctaUrl
    ? { href: ctaUrl, target: "_blank" as const, rel: "noreferrer" }
    : { href: "#briefing" };
  const heroCtaProps = ctaUrl
    ? { href: ctaUrl, target: "_blank" as const, rel: "noreferrer" }
    : { href: "#briefing" };

  return <div className="studioPage">
    <header className="studioNav">
      <BrandLogo />
      <a className="studioNavCta" {...navCtaProps}>{ctaLabel} <span>↗</span></a>
    </header>

    <main>
      <section className="studioHero">
        <p className="studioEyebrow">GB STUDIO · FOTOGRAFIA DE MODA COM IA</p>
        <h1>Lookbooks completos.<br/>Sem montar um estúdio.</h1>
        <p>Imagens hiper-realistas de modelos para marcas de varejo e confecção têxtil no Brasil.</p>
        <a className="studioButton" {...heroCtaProps}>{ctaLabel} <span>↗</span></a>
      </section>

      <section className="problemBlock">
        <div>
          <p className="studioEyebrow">O PROBLEMA QUE RESOLVE</p>
          <h2>Produção tradicional exige agenda, equipe, locação e tempo.</h2>
        </div>
        <div className="comparison">
          <article><span>ESTÚDIO TRADICIONAL</span><h3>Caro e lento.</h3><p>Cada campanha depende de uma nova produção física.</p></article>
          <article><span>GB STUDIO</span><h3>Mais direto.</h3><p>Modelos virtuais configuráveis, rapidez e custo bem mais baixo.</p></article>
        </div>
        <ul>{differences.map((item) => <li key={item}>{item}</li>)}</ul>
      </section>

      <section className="galleryBlock">
        <div className="galleryCopy">
          <p className="studioEyebrow">QUALIDADE QUE VOCÊ PODE EXPLORAR</p>
          <h2>Veja o resultado de perto.</h2>
          <p>Cada card mostra um case diferente, com três imagens próprias em loop suave.</p>
        </div>
        <LookbookGallery />
      </section>

      <section className="processBlock">
        <div className="processIntro"><p className="studioEyebrow">COMO FUNCIONA</p><h2>Da peça ao lookbook em quatro etapas.</h2></div>
        <ol>{steps.map(([title, copy], index) => <li key={title}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{title}</h3><p>{copy}</p></div></li>)}</ol>
      </section>

      <section className="audienceBlock">
        <p className="studioEyebrow">PARA QUEM É</p>
        <h2>Marcas que precisam de conteúdo visual constante.</h2>
        <p>Para catálogo, e-commerce e redes sociais — sem o custo e o tempo de um estúdio físico.</p>
      </section>

      <section id="briefing" className="briefingBlock">
        <div><p className="studioEyebrow">PRÓXIMO PASSO</p><h2>Conte o que você precisa fotografar.</h2><p>A equipe prepara o briefing com você.</p></div>
        {ctaUrl
          ? <a className="studioButton" href={ctaUrl} target="_blank" rel="noreferrer">{ctaLabel} <span>↗</span></a>
          : <button className="studioButton" onClick={() => setBriefing(true)}>{ctaLabel} <span>↗</span></button>}
      </section>
    </main>

    <footer className="studioFooter"><a href="/">GB IA.</a><span>GB Studio · Fotografia de moda com IA</span></footer>

    {briefing && <div className="studioModal" role="dialog" aria-modal="true" aria-labelledby="briefingTitle" onMouseDown={(e)=>e.target===e.currentTarget&&setBriefing(false)}><div className="studioModalBox"><button className="studioClose" onClick={()=>setBriefing(false)} aria-label="Fechar">×</button>{sent?<div className="studioSuccess"><b>✓</b><h2>Briefing recebido.</h2><p>A equipe vai continuar o contato com você.</p><button onClick={()=>{setSent(false);setBriefing(false)}}>Fechar</button></div>:<><p className="studioEyebrow">GB STUDIO</p><h2 id="briefingTitle">Solicitar briefing</h2><form onSubmit={submit}><label>Nome<input name="name" required placeholder="Seu nome" /></label><label>E-mail<input name="email" type="email" required placeholder="voce@empresa.com.br" /></label><label>Marca ou empresa<input name="company" required placeholder="Nome da marca" /></label><label>O que você precisa produzir?<textarea name="message" required placeholder="Peças, quantidade e canais de uso" /></label><button type="submit">Enviar briefing <span>↗</span></button></form></>}</div></div>}
  </div>;
}

export const Route = createFileRoute("/gb-studio")({ component: GBStudioPage });
