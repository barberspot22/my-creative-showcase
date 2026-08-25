import { createFileRoute } from "@tanstack/react-router";
import { SectionCta } from "@/components/SectionCta";
import { BrandLogo } from "@/components/BrandLogo";
import { FormEvent, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PerspectiveTicker } from "@/components/imported/gb-social/PerspectiveTicker";
import { HeroChatLoop } from "@/components/imported/gb-social/HeroChatLoop";
import { usePageLink } from "@/lib/adminLinks";
import { FinalCta } from "@/components/FinalCta";
import { ProductSwitcher } from "@/components/ProductSwitcher";
import { fetchReferencesByPage } from "@/lib/cms";
import { siteUrl } from "@/lib/site";

const SOCIAL_PREVIEW_IMG = "/gb-social-designs/design-17.jpg";

const features = [
  ["Criação de posts", "Prato do dia, combo, promoção e bastidor da cozinha prontos para publicar."],
  ["Agendamento", "Almoço executivo na semana, combo no fim de semana: tudo programado de uma vez."],
  ["Análise de perfil", "Métricas, engajamento e saúde da conta do restaurante em uma conversa."],
  ["Análise de concorrentes", "O que os restaurantes e deliveries da região postam e o que performa."],
  ["Pesquisa de mercado", "Tendências de gastronomia, sazonalidade e tom de voz do seu público."],
  ["Calendário editorial", "7, 15 ou 30 dias de conteúdo do salão e do delivery organizados."],
];

const steps = [
  ["Você pede", "Post do prato do dia, calendário do mês ou análise do perfil, tudo por mensagem."],
  ["Ele consulta o DNA", "O agente já sabe seu cardápio, sua marca, seu tom de voz e suas regras."],
  ["Você ajusta", "Recebe opções, pede alterações e aprova na própria conversa."],
  ["Publica sozinho", "Ele agenda ou publica nos canais configurados, no horário que vende."],
];

function GBSocialPage() {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const { ctaUrl } = usePageLink("gb-social");
  const { data: refs } = useQuery({
    queryKey: ["references", "gb-social"],
    queryFn: () => fetchReferencesByPage("gb-social"),
  });
  const designs = (refs ?? []).map((r) => r.image).filter(Boolean);
  const submit = (e: FormEvent) => { e.preventDefault(); setSent(true); };
  return <div className="socialProductPage">
    <header className="studioNav"><BrandLogo />{ctaUrl
      ? <a href={ctaUrl} target="_blank" rel="noreferrer" className="studioNavCta">SOLICITAR ORÇAMENTO<br/><span>↗</span></a>
      : <a href="#começar" className="studioNavCta">SOLICITAR ORÇAMENTO<br/><span>↗</span></a>}</header>
    <ProductSwitcher current="gb-social" />
    <main>
      <section className="socialHero">
        <div className="socialHeroCopy">
          <p className="studioEyebrow">GB SOCIAL · SOCIAL MEDIA DE IA</p>

          <div className="metallicTitle" data-text="Seu social media agora vive no seu canal de mensagens.">
            <h1>Seu social media <em>agora vive no seu canal de mensagens.</em></h1>
          </div>

          <p>Crie, agende e analise conteúdo conversando. Sem ferramenta nova, no tom da sua marca e com a cara do seu cardápio.</p>

          <strong>30 dias de posts, stories e carrossel do restaurante prontos numa conversa.</strong>

          <small>Tudo por mensagem · Sem plataforma para aprender · Feito para quem vende comida</small>
        </div>

        <HeroChatLoop />
      </section>


      <section className="whatsappBlock">
        <div><p className="studioEyebrow">UMA INTERFACE QUE VOCÊ JÁ CONHECE</p><h2>Você não precisa de mais uma ferramenta.</h2><p>Você já sabe conversar por mensagem. Nada de dashboards complexos, prompts gigantes ou cinco sistemas para publicar o prato do dia.</p></div>
        <div className="chatDemo socialDesignerChat">
          <header><span><i/>GB Social</span><small>designer online</small></header>
          <div className="socialChatBody">
            <p className="chatUser">Preciso de 15 dias de posts para o Instagram do restaurante.</p>
            <p className="chatAgent"><b>GB Social</b>Perfeito. Monto o calendário com prato do dia, combo de fim de semana, bastidor da cozinha e carrossel do cardápio, tudo no DNA da marca.</p>
            <article className="socialDesignPreview socialDesignPreviewImage" aria-label="Preview da arte criada pelo designer">
              <img src={SOCIAL_PREVIEW_IMG} alt="Arte de combo de restaurante criada pelo GB Social" />
            </article>
            <p className="chatAgent"><b>GB Social</b>Primeira peça pronta: combo de sábado. Posso também analisar os deliveries concorrentes e as métricas do mês?</p>
            <p className="chatUser">Faz. E agenda tudo para sair às 19h.</p>
            <p className="chatAgent"><b>Designer</b>Agendado. Calendário, análise e publicação configuradas.</p>
            <p className="socialApproval">Aprovação recebida · pronto para publicar</p>
          </div>
        </div>
      </section>

      <section className="socialWorkShowcase">
        <div><p className="studioEyebrow">CRIADO PELO GB SOCIAL</p><h2>Designs que já saíram daqui.</h2><p>Arraste para explorar. Toque para ampliar. Tudo feito por um agente, aprovado por uma conversa.</p></div>
        <PerspectiveTicker designs={designs} />
        <div className="socialWorkShowcaseCta">
          <SectionCta message="Olá! Vi os designs do GB Social e quero conteúdo assim para as redes do meu restaurante." label="Quero designs assim" />
        </div>
      </section>

      <section className="socialFeatures">
        <div><p className="studioEyebrow">O QUE ELE FAZ</p><h2>Social media completo, numa conversa.</h2></div>
        <div className="socialFeaturesGrid">{features.map(([title, copy]) => <article key={title}><h3>{title}</h3><p>{copy}</p></article>)}</div>
        <SectionCta message="Olá! Quero o GB Social cuidando das redes do meu restaurante." label="Quero meu social no automático" />
      </section>

      <section className="socialFlow"><p className="studioEyebrow">DA CONVERSA PARA O FEED</p><h2>Assim funciona.</h2><ol>{steps.map(([title, copy], i) => <li key={title}><span>{String(i + 1).padStart(2, "0")}</span><div><b>{title}</b><p>{copy}</p></div></li>)}</ol></section>

      <FinalCta pageKey="gb-social" productName="GB Social" title="Posts para semanas. Sem ficar sem postar." subtitle="Me conta seu cardápio e canais. Devolvo posts prontos para você aprovar." />
    </main>
    <footer className="studioFooter"><a href="/">GB IA.</a><span>GB Social · Seu Social Media de IA por mensagem</span></footer>

    {open && <div className="studioModal" role="dialog" aria-modal="true" onMouseDown={e => e.target === e.currentTarget && setOpen(false)}><div className="studioModalBox"><button className="studioClose" onClick={() => setOpen(false)} aria-label="Fechar">×</button>{sent ? <div className="studioSuccess"><b>✓</b><h2>Mensagem recebida.</h2><p>A equipe vai continuar o contato com você.</p><button onClick={() => {setSent(false);setOpen(false)}}>Fechar</button></div> : <><p className="studioEyebrow">GB SOCIAL</p><h2>Conhecer o GB Social</h2><form onSubmit={submit}><label>Nome<input required placeholder="Seu nome"/></label><label>E-mail<input required type="email" placeholder="voce@empresa.com.br"/></label><label>Empresa<input required placeholder="Nome do restaurante"/></label><label>O que você quer delegar?<textarea required placeholder="Conte quais canais e tarefas quer manter ativos"/></label><button type="submit">Quero falar com a equipe <span>↗</span></button></form></>}</div></div>}
  </div>;
}

export const Route = createFileRoute("/gb-social")({
  component: GBSocialPage,
  head: () => ({
    meta: [
      { title: "GB Social — Social Media de IA para restaurantes | GB IA" },
      { name: "description", content: "GB Social cria posts, agenda conteúdo, analisa métricas e concorrentes e monta o calendário editorial do seu restaurante por conversa. Sem contratar designer." },
      { property: "og:title", content: "GB Social — Social Media de IA para restaurantes | GB IA" },
      { property: "og:description", content: "Posts, agendamento, análise de perfil e calendário editorial do seu restaurante numa conversa. Sem ferramenta nova, sem contratar designer." },
      { property: "og:type", content: "product" },
      { property: "og:url", content: siteUrl("/gb-social") },
    ],
    links: [{ rel: "canonical", href: siteUrl("/gb-social") }],
  }),
});
