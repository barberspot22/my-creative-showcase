import { createFileRoute } from "@tanstack/react-router";
import { BrandLogo } from "@/components/BrandLogo";
import consumoConscienteAsset from "@/assets/consumo-consciente.png.asset.json";
import { FormEvent, ReactNode, useState } from "react";
import { PerspectiveTicker } from "@/components/imported/gb-social/PerspectiveTicker";
import { usePageLink } from "@/lib/adminLinks";
import { FinalCta } from "@/components/FinalCta";
import { ProductSwitcher } from "@/components/ProductSwitcher";

const features = [
  ["Criação de posts", "Feed, story e carrossel prontos para publicar."],
  ["Agendamento", "Programa tudo: post único, semana ou campanha completa."],
  ["Análise de perfil", "Métricas, engajamento e saúde da conta em uma conversa."],
  ["Análise de concorrentes", "O que os concorrentes estão postando e como performam."],
  ["Pesquisa de mercado", "Tendências, oportunidades e tom de voz do seu nicho."],
  ["Calendário editorial", "7, 15 ou 30 dias de conteúdo organizado de uma vez."],
];

const steps = [
  ["Você pede", "Post, calendário, análise de perfil ou de concorrente — tudo pelo WhatsApp."],
  ["Ele consulta o DNA", "O agente já sabe sua marca, tom de voz e regras."],
  ["Você ajusta", "Recebe opções, pede alterações e aprova na conversa."],
  ["Publica sozinho", "Ele agenda ou publica nos canais configurados."],
];

function GBSocialPage() {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const { ctaUrl, ctaLabel } = usePageLink("gb-social");
  const submit = (e: FormEvent) => { e.preventDefault(); setSent(true); };
  const CtaPrimary = ({ children, className = "socialPrimary" }: { children: ReactNode; className?: string }) =>
    ctaUrl
      ? <a className={className} href={ctaUrl} target="_blank" rel="noreferrer">{children}</a>
      : <button className={className} onClick={() => setOpen(true)}>{children}</button>;
  return <div className="socialProductPage">
    <header className="studioNav"><BrandLogo />{ctaUrl
      ? <a href={ctaUrl} target="_blank" rel="noreferrer" className="studioNavCta">SOLICITAR ORÇAMENTO<br/><span>↗</span></a>
      : <a href="#começar" className="studioNavCta">SOLICITAR ORÇAMENTO<br/><span>↗</span></a>}</header>
    <ProductSwitcher current="gb-social" />
    <main>
      <section className="socialHero">
        <p className="studioEyebrow">GB SOCIAL · SOCIAL MEDIA DE IA</p>
        <h1>Sua social midia<br/><em>Seu social media agora mora no WhatsApp.</em></h1>
        <p>Um agente de social media que cria posts, agenda conteúdo, analisa métricas, estuda concorrentes e monta calendário editorial — tudo pelo WhatsApp, no tom da sua marca.</p>
        <strong>30 dias de conteúdo em uma conversa.</strong>
        <CtaPrimary>CRIAR MEU CALENDÁRIO DE 30 DIAS<br/><span>↗</span></CtaPrimary>
        <small>100% pelo WhatsApp · Sem plataforma para aprender · Feito para quem vende</small>
      </section>

      <section className="whatsappBlock">
        <div><p className="studioEyebrow">UMA INTERFACE QUE VOCÊ JÁ CONHECE</p><h2>Você não precisa de mais uma ferramenta.</h2><p>Você já sabe usar WhatsApp. Nada de dashboards complexos, prompts gigantes ou cinco sistemas para fazer um post.</p></div>
        <div className="chatDemo socialDesignerChat">
          <header><span><i/>GB Social</span><small>designer online</small></header>
          <div className="socialChatBody">
            <p className="chatUser">Preciso de 15 dias de posts para o Instagram da loja.</p>
            <p className="chatAgent"><b>GB Social</b>Perfeito. Vou montar o calendário com posts de feed, stories e carrossel seguindo o DNA da marca.</p>
            <article className="socialDesignPreview socialDesignPreviewImage" aria-label="Preview da arte criada pelo designer">
              <img src={consumoConscienteAsset.url} alt="Design criado pelo GB Social para campanha de Consumo Consciente" />
            </article>
            <p className="chatAgent"><b>GB Social</b>Primeira peça pronta. Posso também fazer análise de concorrentes e métricas do mês?</p>
            <p className="chatUser">Faz. E agenda tudo para sair às 19h.</p>
            <p className="chatAgent"><b>Designer</b>Agendado. Calendário, análise e publicação configuradas.</p>
            <p className="socialApproval">Aprovação recebida · pronto para publicar</p>
          </div>
        </div>
      </section>

      <section className="socialFeatures">
        <div><p className="studioEyebrow">O QUE ELE FAZ</p><h2>Social media completo, numa conversa.</h2></div>
        <div className="socialFeaturesGrid">{features.map(([title, copy]) => <article key={title}><h3>{title}</h3><p>{copy}</p></article>)}</div>
      </section>

      <section className="socialWorkShowcase">
        <div><p className="studioEyebrow">CRIADO PELO GB SOCIAL</p><h2>Designs que já saíram daqui.</h2><p>Arraste para explorar. Toque para ampliar. Tudo feito por um agente, aprovado por uma conversa.</p></div>
        <PerspectiveTicker />
      </section>

      <section className="socialFlow"><p className="studioEyebrow">DO WHATSAPP PARA O FEED</p><h2>Assim funciona.</h2><ol>{steps.map(([title, copy], i) => <li key={title}><span>{String(i + 1).padStart(2, "0")}</span><div><b>{title}</b><p>{copy}</p></div></li>)}</ol></section>

      <FinalCta pageKey="gb-social" productName="GB Social" title="Quer 30 dias de conteúdo pronto sem abrir uma ferramenta?" subtitle="Me conta sua marca e seus canais. Devolvo calendário, escopo e valor." />
    </main>
    <footer className="studioFooter"><a href="/">GB IA.</a><span>GB Social · Seu Social Media de IA no WhatsApp</span></footer>

    {open && <div className="studioModal" role="dialog" aria-modal="true" onMouseDown={e => e.target === e.currentTarget && setOpen(false)}><div className="studioModalBox"><button className="studioClose" onClick={() => setOpen(false)} aria-label="Fechar">×</button>{sent ? <div className="studioSuccess"><b>✓</b><h2>Mensagem recebida.</h2><p>A equipe vai continuar o contato com você.</p><button onClick={() => {setSent(false);setOpen(false)}}>Fechar</button></div> : <><p className="studioEyebrow">GB SOCIAL</p><h2>Conhecer o GB Social</h2><form onSubmit={submit}><label>Nome<input required placeholder="Seu nome"/></label><label>E-mail<input required type="email" placeholder="voce@empresa.com.br"/></label><label>Empresa<input required placeholder="Nome da empresa"/></label><label>O que você quer delegar?<textarea required placeholder="Conte quais canais e tarefas quer manter ativos"/></label><button type="submit">Quero falar com a equipe <span>↗</span></button></form></>}</div></div>}
  </div>;
}

export const Route = createFileRoute("/gb-social")({
  component: GBSocialPage,
  head: () => ({
    meta: [
      { title: "GB Social — Social Media de IA pelo WhatsApp | GB IA" },
      { name: "description", content: "GB Social cria posts, agenda conteúdo, analisa métricas, concorrentes e monta calendário editorial pelo WhatsApp. Sua marca ativa nas redes sem você cuidar de tudo." },
      { property: "og:title", content: "GB Social — Social Media de IA pelo WhatsApp | GB IA" },
      { property: "og:description", content: "GB Social cria posts, agenda conteúdo, analisa métricas, concorrentes e monta calendário editorial pelo WhatsApp." },
      { property: "og:type", content: "product" },
      { property: "og:url", content: "https://gb-ia.lovable.app/gb-social" },
    ],
    links: [{ rel: "canonical", href: "https://gb-ia.lovable.app/gb-social" }],
  }),
});
