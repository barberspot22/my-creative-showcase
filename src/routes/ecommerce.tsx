import { createFileRoute } from "@tanstack/react-router";
import { BentoMorphGallery } from "@/components/imported/ecommerce/BentoMorphGallery";
import { usePageLink } from "@/lib/adminLinks";

const deliverables = [
  ["Loja funcional", "E-commerce estruturado com catálogo, carrinho e checkout, já com a identidade visual da sua marca — pronto para escalar, não só para existir."],
  ["Automação de atendimento", "Instagram e WhatsApp conectados: comentário vira DM, DM vira conversa automática e conversa vira venda."],
  ["IA vendedora", "Um agente que atende, tira dúvidas e conduz ao fechamento 24 horas por dia, treinado no seu produto."],
  ["Painel administrativo", "Crie produtos, acompanhe pedidos e controle a automação em um só lugar, sem depender de cinco sistemas."],
  ["Estrutura de tráfego", "Pixel instalado e eventos de conversão configurados para mostrar exatamente o que está gerando vendas."],
];

const steps = [
  ["Briefing", "Entendemos seu produto, seu público e onde as vendas estão travando."],
  ["Arquitetura", "Desenhamos loja, automação e IA como um sistema só, não como peças soltas."],
  ["Implementação", "Construímos e testamos o fluxo completo: do anúncio até o cliente comprando."],
  ["Operação", "O sistema entra no ar vendendo e continua acompanhado por nós depois do lançamento."],
];

const proof = [
  "Loja funcional com catálogo, carrinho e checkout",
  "Marketplace ativo e integrado a canais adicionais de venda",
  "Automação de Instagram e WhatsApp conectada de ponta a ponta",
  "IA vendedora treinada para o produto do cliente",
  "Painel administrativo próprio para produtos e automações",
  "Pixel e eventos de conversão configurados",
];

function EcommercePage() {
  const { ctaUrl: whatsapp, ctaLabel } = usePageLink("ecommerce");
  return <div className="commercePage">
    <header className="studioNav commerceNav"><a href="/" className="studioBrand">GB IA.</a><a href={whatsapp} target="_blank" rel="noreferrer" className="studioNavCta">{ctaLabel} <span>↗</span></a></header>
    <main>
      <section className="commerceHero">
        <p className="studioEyebrow">GB IA — E-COMMERCE</p>
        <h1>Loja pronta pra vender não é loja pronta.<br/><em>É a loja + o sistema que roda em volta dela.</em></h1>
        <p>Construímos e-commerces completos — não só a vitrine, mas a automação de atendimento, IA vendedora e painel administrativo que fazem a loja vender sem você precisar estar o tempo todo em cima.</p>
        <div className="commerceHeroActions"><a className="commercePrimary" href={whatsapp} target="_blank" rel="noreferrer">Falar no WhatsApp <span>↗</span></a><a className="commerceSecondary" href="#entregamos">Ver o que entregamos <span>↓</span></a></div>
        <small>Loja · Automação · IA vendedora · Tráfego rastreado</small>
      </section>

      <section className="commerceProblem">
        <p className="studioEyebrow">POR QUE “SÓ A LOJA” NÃO BASTA</p>
        <h2>Loja sem automação em volta é loja que depende 100% de você pra vender.</h2>
        <p>Cliente manda mensagem e não tem resposta rápida, carrinho é abandonado e ninguém recupera, anúncio roda mas ninguém sabe se converteu. A gente entrega a loja já conectada com atendimento automático, tráfego rastreado e um vendedor de IA que não dorme.</p>
      </section>

      <section id="entregamos" className="commerceDeliverables">
        <div className="commerceSectionIntro"><p className="studioEyebrow">O QUE FAZEMOS</p><h2>Não é site.<br/>É sistema completo de vendas.</h2></div>
        <ol>{deliverables.map(([title, copy], index) => <li key={title}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{title}</h3><p>{copy}</p></div></li>)}</ol>
      </section>

      <section className="commerceGallerySection">
        <div><p className="studioEyebrow">MODELOS & TEMPLATES</p><h2>Uma base visual forte.<br/><em>Um sistema feito para o seu negócio.</em></h2><p>Explore direções de loja que adaptamos à identidade, ao catálogo e à operação da sua marca.</p></div>
        <BentoMorphGallery />
      </section>

      <section className="commerceProcess">
        <div><p className="studioEyebrow">COMO FUNCIONA</p><h2>Do briefing ao ar, sem ficar te devendo satisfação.</h2></div>
        <ol>{steps.map(([title, copy], index) => <li key={title}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{title}</h3><p>{copy}</p></div></li>)}</ol>
      </section>

      <section className="commerceProof">
        <div><p className="studioEyebrow">JÁ ENTREGAMOS</p><h2>Sistema testado ponta a ponta antes de qualquer entrega.</h2></div>
        <ul>{proof.map(item => <li key={item}>{item}</li>)}</ul>
        <blockquote>Critério de pronto: se o cliente consegue ver o produto, ser atendido pela IA, comprar e ainda ser impactado por anúncio depois — o sistema tá pronto.</blockquote>
      </section>

      <section className="commerceFinal"><p className="studioEyebrow">VAMOS CONVERSAR</p><h2>Me conta o que você vende.<br/>A gente desenha o sistema que vende por você.</h2><p>Sem proposta engessada — o primeiro papo é para entender se faz sentido.</p><a className="commercePrimary" href={whatsapp} target="_blank" rel="noreferrer">Chamar no WhatsApp <span>↗</span></a></section>
    </main>
    <footer className="studioFooter"><a href="/">GB IA.</a><span>E-commerce · Loja, automação e IA vendedora</span></footer>
  </div>;
}

export const Route = createFileRoute("/ecommerce")({ component: EcommercePage });
