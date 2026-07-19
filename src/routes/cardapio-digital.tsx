import { createFileRoute } from "@tanstack/react-router";
import { BrandLogo } from "@/components/BrandLogo";
import { usePageLink } from "@/lib/adminLinks";
import { FanGallery } from "@/components/imported/cardapio-digital/FanGallery";
import { CatalogWidget } from "@/components/imported/cardapio-digital/CatalogWidget";

const deliverables = [
  ["Cardápio digital via WhatsApp", "O cliente pede e recebe na hora, com formato definido caso a caso — arquivo direto ou navegação interativa por categoria."],
  ["Atendimento integrado", "O mesmo agente já responde dúvida, direciona pra reserva ou pedido."],
  ["Social media autônomo (GB Social)", "Agente que cria e publica conteúdo, com aprovação sua antes de qualquer post."],
  ["Painel único", "Cardápio, conversas e postagens agendadas num só lugar."],
];

const steps = [
  ["Briefing", "Entendemos o cardápio atual, o volume de pedido e como as redes estão hoje."],
  ["Arquitetura", "Definimos o formato do cardápio e o fluxo de conteúdo social."],
  ["Implementação", "Configuramos o agente de WhatsApp e o GB Social com aprovação humana antes de publicar."],
  ["Operação", "Cardápio respondendo sozinho, redes postando com aval do cliente."],
];

const proof = [
  "Proposta de agente de atendimento com cardápio integrado — Fontana di Trevi Colatina, restaurante e boliche",
  "GB Social configurado como assistente de marketing autônomo — Instagram, Facebook, TikTok, LinkedIn e Google Meu Negócio",
  "Arquitetura reaproveitada e testada em mais de um cliente do setor de alimentação",
];


function CardapioDigitalPage() {
  const { ctaUrl: whatsapp, ctaLabel } = usePageLink("cardapio-digital");
  return <div className="menuProductPage">
    <header className="studioNav menuProductNav"><BrandLogo /><a href={whatsapp} target="_blank" rel="noreferrer" className="studioNavCta">{ctaLabel} <span>↗</span></a></header>
    <main>
      <section className="menuProductHero">
        <p className="studioEyebrow">CARDÁPIO DIGITAL + SOCIAL MEDIA</p>
        <h1>Seu cardápio parado no PDF.<br/>Suas redes sociais paradas também.<br/>A gente resolve os dois juntos.</h1>
        <p>Cardápio digital integrado ao WhatsApp e redes sociais rodando sozinhas — pro cliente decidir o que pedir e pro seu Instagram não ficar semanas sem postar.</p>
        <div className="menuProductActions"><a className="menuProductPrimary" href={whatsapp} target="_blank" rel="noreferrer">{ctaLabel} <span>↗</span></a><a className="menuProductSecondary" href="#entregamos">Ver o que entregamos <span>↓</span></a></div>
      </section>

      <section className="menuProductProblem"><div><p className="studioEyebrow">POR QUE OS DOIS PROBLEMAS SÃO O MESMO PROBLEMA</p><h2>Cardápio desatualizado e rede social parada afastam cliente do mesmo jeito.</h2></div><p>PDF de cardápio que ninguém atualiza, foto de prato antiga no Instagram, cliente perguntando preço no WhatsApp e esperando resposta. A gente integra cardápio e social media num sistema só, rodando de forma autônoma.</p></section>

      <section id="entregamos" className="menuProductDeliverables"><div><p className="studioEyebrow">O QUE ENTREGAMOS</p><h2>Pedido e presença digital no mesmo fluxo.</h2></div><ol>{deliverables.map(([title, copy], index) => <li key={title}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{title}</h3><p>{copy}</p></div></li>)}</ol></section>

      <section className="menuVisualShowcase"><div><p className="studioEyebrow">VITRINE DE PRATOS E CONTEÚDO</p><h2>O que o cliente vê.<br/>O que faz ele pedir.</h2></div><FanGallery/></section>

      <section className="menuProductProcess"><div><p className="studioEyebrow">COMO FUNCIONA</p><h2>Do cardápio atual ao sistema rodando.</h2></div><ol>{steps.map(([title, copy], index) => <li key={title}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{title}</h3><p>{copy}</p></div></li>)}</ol></section>

      <section className="menuProductProof"><div><p className="studioEyebrow">JÁ ENTREGAMOS</p><h2>Arquitetura pensada para operação real.</h2></div><ul>{proof.map(item => <li key={item}>{item}</li>)}</ul></section>

      <section className="menuProductFinal"><p className="studioEyebrow">VAMOS CONVERSAR</p><h2>Me conta como seu cardápio e suas redes funcionam hoje.<br/>A gente monta o sistema.</h2><p>Sem proposta engessada — o primeiro papo é pra entender se faz sentido.</p><a className="menuProductPrimary" href={whatsapp} target="_blank" rel="noreferrer">{ctaLabel} <span>↗</span></a></section>
    </main>
    <footer className="studioFooter"><a href="/">GB IA.</a><span>Cardápio Digital + Social Media · Atendimento e conteúdo juntos</span></footer>
  </div>;
}

export const Route = createFileRoute("/cardapio-digital")({ component: CardapioDigitalPage });
