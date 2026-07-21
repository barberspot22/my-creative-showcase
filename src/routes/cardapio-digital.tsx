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
        <p className="studioEyebrow">CARDÁPIO DIGITAL + VENDA AUTÔNOMA</p>
        <h1>Seu cliente vê o cardápio. Escolhe. E pede sozinho.</h1>
        <p>O cliente não precisa esperar resposta no WhatsApp. Navega pelos produtos, vê fotos, preços e variações, e finaliza o pedido no próprio ritmo — enquanto você atende quem realmente precisa de ajuda.</p>
        <div className="menuProductActions"><a className="menuProductPrimary" href={whatsapp} target="_blank" rel="noreferrer">SOLICITAR ORÇAMENTO<br/><span>↗</span></a><a className="menuProductSecondary" href="#entregamos">Ver como funciona <span>↓</span></a></div>
      </section>

      <section className="menuCatalogWidgetSection">
        <div className="menuCatalogIntro">
          <p className="studioEyebrow">EXPERIMENTE AGORA</p>
          <h2>Sinta como seria o site do seu negócio.</h2>
          <p>Toque em qualquer produto. Veja fotos, tamanhos, preços e o botão de pedir — exatamente como seu cliente veria. Essa prévia é o mesmo fluxo que entregamos.</p>
        </div>
        <CatalogWidget />
      </section>

      <section className="menuProductProblem"><div><p className="studioEyebrow">O CUSTO DE ESCONDER O CARDÁPIO</p><h2>Cardápio escondido é cliente perdido.</h2></div><p>Cliente pergunta preço no WhatsApp e espera. Quer ver opções e não encontra. Desiste e pede no concorrente. Quando o cardápio é claro, visual e fácil de comprar, a venda acontece sem atrito.</p></section>

      <section id="entregamos" className="menuProductDeliverables"><div><p className="studioEyebrow">O QUE VOCÊ RECEBE</p><h2>Uma vitrine que vende sozinha.</h2></div><ol>{deliverables.map(([title, copy], index) => <li key={title}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{title}</h3><p>{copy}</p></div></li>)}</ol></section>

      <section className="menuVisualShowcase"><div><p className="studioEyebrow">VEJA NA PRÁTICA</p><h2>O cliente toca e pede. Simples assim.</h2></div><FanGallery/></section>

      <section className="menuProductProcess"><div><p className="studioEyebrow">COMO FUNCIONA</p><h2>Do cardápio atual ao cliente pedindo sozinho.</h2></div><ol>{steps.map(([title, copy], index) => <li key={title}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{title}</h3><p>{copy}</p></div></li>)}</ol></section>

      <section className="menuProductProof"><div><p className="studioEyebrow">JÁ ENTREGAMOS</p><h2>Autonomia para o cliente, tempo de volta para você.</h2></div><ul>{proof.map(item => <li key={item}>{item}</li>)}</ul></section>

      <FinalCta pageKey="cardapio-digital" productName="Cardápio Digital" title="Quer que seus clientes vejam tudo e peçam sozinhos?" subtitle="Me conta como funciona seu cardápio hoje. Devolvemos escopo, prazo e valor." />
    </main>
    <footer className="studioFooter"><a href="/">GB IA.</a><span>Cardápio Digital + Social Media · Atendimento e conteúdo juntos</span></footer>
  </div>;
}

export const Route = createFileRoute("/cardapio-digital")({ component: CardapioDigitalPage });
