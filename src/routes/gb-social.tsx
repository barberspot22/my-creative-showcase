import { createFileRoute } from "@tanstack/react-router";
import { SectionCta } from "@/components/SectionCta";
import { BrandLogo } from "@/components/BrandLogo";
import { FormEvent, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PerspectiveTicker } from "@/components/imported/gb-social/PerspectiveTicker";
import { HeroChatLoop } from "@/components/imported/gb-social/HeroChatLoop";
import { ChannelGrid } from "@/components/imported/gb-social/ChannelGrid";
import { FaqAccordion } from "@/components/FaqAccordion";
import { usePageLink } from "@/lib/adminLinks";
import { FinalCta } from "@/components/FinalCta";
import { ProductSwitcher } from "@/components/ProductSwitcher";
import { fetchReferencesByPage } from "@/lib/cms";
import { servicePageLd } from "@/lib/seo";
import { siteUrl } from "@/lib/site";


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

// Fonte única: alimenta o accordion visível e o schema de FAQ do Google.
const faqItems = [
  { question: "Quais canais eu consigo conectar?", answer: "Instagram, Facebook, TikTok, YouTube, LinkedIn, X (Twitter), Threads, Pinterest, Bluesky, Twitch e Google Business Profile." },
  { question: "Preciso aprender uma ferramenta nova?", answer: "Não. Tudo acontece por conversa, no WhatsApp que você já usa. Nada de painel novo para aprender." },
  { question: "A IA cria as artes e as legendas?", answer: "Sim, cria arte, legenda com hashtags e sugestão de horário, e você aprova antes de publicar." },
  { question: "Quem aprova o que vai ao ar?", answer: "Você. O agente entrega a arte e a legenda na conversa e só publica ou agenda depois do seu ok." },
  { question: "Dá para publicar em vários canais ao mesmo tempo?", answer: "Sim. Você aprova uma vez e o conteúdo é adaptado e distribuído para os canais conectados." },
  { question: "Consigo usar minhas próprias fotos?", answer: "Sim. Você pode mandar a foto na própria conversa ou conectar seu Drive para o agente buscar as referências." },
  { question: "Serve para restaurantes?", answer: "Sim, o GB Social foi desenhado principalmente para gastronomia e varejo local." },
  { question: "Ele também mostra resultados?", answer: "Sim. Métricas de perfil, desempenho dos posts e comparação com concorrentes chegam na mesma conversa." },
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

          <p>Crie, agende e analise conteúdo conversando. Sem ferramenta nova, no tom da sua marca e com informações do seu cardápio.</p>
        </div>

        <HeroChatLoop />
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

      <section className="socialChannels">
        <div className="socialChannelsHead">
          <p className="studioEyebrow">CANAIS CONECTÁVEIS</p>
          <h2>Publique onde seu público está.</h2>
          <p>Você aprova uma vez na conversa e o agente distribui para os canais que fizerem sentido para o seu negócio.</p>
        </div>
        <ChannelGrid />
        <SectionCta message="Olá! Quero conectar minhas redes ao GB Social e publicar tudo por conversa." label="Quero conectar meus canais" />
      </section>

      <section className="socialFaq">
        <div className="socialFaqHead">
          <p className="studioEyebrow">PERGUNTAS FREQUENTES</p>
          <h2>Ficou alguma dúvida?</h2>
        </div>
        <FaqAccordion items={faqItems} />
        <SectionCta message="Olá! Tenho uma dúvida sobre o GB Social e quero falar com alguém." label="Falar com a equipe" />
      </section>

      <FinalCta pageKey="gb-social" productName="GB Social" title="Crie seu calendário de posts sozinho. Sem contratar ninguém." subtitle="Em poucos minutos, você monta semanas de conteúdo no tom da sua marca. Sem agência, sem freelancer." />
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
    scripts: servicePageLd({
      name: "GB Social: social media com IA",
      breadcrumbName: "GB Social",
      serviceType: "Gestão de redes sociais com IA",
      description: "Criação de posts, calendário editorial, análise de métricas e de concorrentes por conversa no WhatsApp, sem contratar agência ou designer.",
      path: "/gb-social",
      faq: faqItems,
    }),
  }),
});
