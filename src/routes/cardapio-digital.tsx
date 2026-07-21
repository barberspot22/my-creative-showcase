import { createFileRoute } from "@tanstack/react-router";
import { BrandLogo } from "@/components/BrandLogo";
import { usePageLink } from "@/lib/adminLinks";
import { FanGallery } from "@/components/imported/cardapio-digital/FanGallery";
import { CatalogWidget } from "@/components/imported/cardapio-digital/CatalogWidget";
import { FinalCta } from "@/components/FinalCta";
import { ProductSwitcher } from "@/components/ProductSwitcher";

const deliverables = [
  ["Cardápio digital visual", "Fotos, preços, descrições e variações organizadas por categoria — o cliente vê tudo antes de pedir."],
  ["Pedido integrado ao WhatsApp", "Cliente escolhe, monta o pedido e envia pronto para você confirmar."],
  ["Atendimento apenas quando importa", "O agente responde dúvidas, direciona reservas e finaliza pedidos — sem segurar quem já quer comprar."],
  ["Painel único", "Cardápio, pedidos, conversas e postagens agendadas num só lugar."],
];

const steps = [
  ["Briefing", "Entendemos seu cardápio, preços e as dúvidas mais frequentes dos clientes."],
  ["Arquitetura", "Montamos a navegação por categorias, variações e o fluxo de pedido."],
  ["Implementação", "Subimos o cardápio digital e conectamos ao seu WhatsApp."],
  ["Operação", "Cliente vê, escolhe e pede. Você só confirma e prepara."],
];

const proof = [
  "Proposta de agente de atendimento com cardápio integrado — Fontana di Trevi Colatina, restaurante e boliche",
  "GB Social configurado como assistente de marketing autônomo — Instagram, Facebook, TikTok, LinkedIn e Google Meu Negócio",
  "Arquitetura reaproveitada e testada em mais de um cliente do setor de alimentação",
];


function CardapioDigitalPage() {
  const { ctaUrl: whatsapp, ctaLabel } = usePageLink("cardapio-digital");
  return <div className="menuProductPage">
    <header className="studioNav menuProductNav"><BrandLogo /><a href={whatsapp} target="_blank" rel="noreferrer" className="studioNavCta">SOLICITAR ORÇAMENTO<br/><span>↗</span></a></header>
    <ProductSwitcher current="cardapio-digital" />
    <main>
      <section className="menuProductHero">
        <p className="studioEyebrow">CARDÁPIO DIGITAL + SOCIAL MEDIA</p>
        <h1>Seu cardápio parado no PDF.<br/>Suas redes sociais paradas também.<br/>A gente resolve os dois juntos.</h1>
        <p>Cardápio digital integrado ao WhatsApp e redes sociais rodando sozinhas — pro cliente decidir o que pedir e pro seu Instagram não ficar semanas sem postar.</p>
        <div className="menuProductActions"><a className="menuProductPrimary" href={whatsapp} target="_blank" rel="noreferrer">SOLICITAR ORÇAMENTO<br/><span>↗</span></a><a className="menuProductSecondary" href="#entregamos">Ver o que entregamos <span>↓</span></a></div>
      </section>

      <section className="menuCatalogWidgetSection">
        <div className="menuCatalogIntro">
          <p className="studioEyebrow">EXPERIMENTE</p>
          <h2>Sinta como seria ter <em>seu próprio catálogo</em>.</h2>
          <p>Toque em qualquer produto para abrir os detalhes — imagens, tamanhos e valores, exatamente como o seu cliente veria.</p>
        </div>
        <CatalogWidget />
      </section>

      <section className="menuProductProblem"><div><p className="studioEyebrow">POR QUE OS DOIS PROBLEMAS SÃO O MESMO PROBLEMA</p><h2>Cardápio desatualizado e rede social parada afastam cliente do mesmo jeito.</h2></div><p>PDF de cardápio que ninguém atualiza, foto de prato antiga no Instagram, cliente perguntando preço no WhatsApp e esperando resposta. A gente integra cardápio e social media num sistema só, rodando de forma autônoma.</p></section>

      <section id="entregamos" className="menuProductDeliverables"><div><p className="studioEyebrow">O QUE ENTREGAMOS</p><h2>Pedido e presença digital no mesmo fluxo.</h2></div><ol>{deliverables.map(([title, copy], index) => <li key={title}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{title}</h3><p>{copy}</p></div></li>)}</ol></section>

      <section className="menuVisualShowcase"><div><p className="studioEyebrow">VITRINE DE PRATOS E CONTEÚDO</p><h2>O que o cliente vê.<br/>O que faz ele pedir.</h2></div><FanGallery/></section>

      <section className="menuProductProcess"><div><p className="studioEyebrow">COMO FUNCIONA</p><h2>Do cardápio atual ao sistema rodando.</h2></div><ol>{steps.map(([title, copy], index) => <li key={title}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{title}</h3><p>{copy}</p></div></li>)}</ol></section>

      <section className="menuProductProof"><div><p className="studioEyebrow">JÁ ENTREGAMOS</p><h2>Arquitetura pensada para operação real.</h2></div><ul>{proof.map(item => <li key={item}>{item}</li>)}</ul></section>

      <FinalCta pageKey="cardapio-digital" productName="Cardápio Digital + Social" />
    </main>
    <footer className="studioFooter"><a href="/">GB IA.</a><span>Cardápio Digital + Social Media · Atendimento e conteúdo juntos</span></footer>
  </div>;
}

export const Route = createFileRoute("/cardapio-digital")({ component: CardapioDigitalPage });
