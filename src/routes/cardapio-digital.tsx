import { createFileRoute } from "@tanstack/react-router";
import { BrandLogo } from "@/components/BrandLogo";
import { usePageLink } from "@/lib/adminLinks";
import { FanGallery } from "@/components/imported/cardapio-digital/FanGallery";
import { CatalogWidget } from "@/components/imported/cardapio-digital/CatalogWidget";
import { FinalCta } from "@/components/FinalCta";
import { ProductSwitcher } from "@/components/ProductSwitcher";

const audiences = [
  ["Restaurantes e bares", "QR na mesa, pedido direto na cozinha, conta paga sem chamar o garçom."],
  ["Delivery próprio e dark kitchen", "Link único que substitui o print de cardápio no WhatsApp."],
  ["Autônomos de comida", "Confeitaria, marmita, hamburgueria caseira — cardápio profissional sem depender de app de terceiros."],
  ["Marcas de alimentos", "Portfólio de produtos apresentado com fotos, preços e onde comprar."],
];

const deliverables = [
  ["Cardápio visual por categoria", "Fotos, preços, adicionais e variações — o cliente vê tudo antes de pedir."],
  ["QR na mesa e link único", "Um QR por mesa para o presencial. Um link para bio, WhatsApp e delivery."],
  ["Pedido em tempo real", "Vai direto para a cozinha, o WhatsApp ou o KDS — sem comanda escrita à mão."],
  ["Pagamento integrado", "Pix e cartão na mesa ou online. Dividir conta e fechar sem levantar."],
];

const steps = [
  ["Cardápio e categorias", "Montamos seu cardápio com fotos, preços, adicionais e variações."],
  ["Canais de venda", "Configuramos QR de mesa, link de bio e integração com WhatsApp/delivery."],
  ["Teste com a equipe", "Simulamos pedidos reais para ajustar fluxo, cozinha e pagamento."],
  ["No ar", "Cliente vê, escolhe e pede sozinho. Você recebe pronto para preparar."],
];



function CardapioDigitalPage() {
  const { ctaUrl: whatsapp, ctaLabel } = usePageLink("cardapio-digital");
  return <div className="menuProductPage">
    <header className="studioNav menuProductNav"><BrandLogo /><a href={whatsapp} target="_blank" rel="noreferrer" className="studioNavCta">SOLICITAR ORÇAMENTO<br/><span>↗</span></a></header>
    <ProductSwitcher current="cardapio-digital" />
    <main>
      <section className="menuProductHero">
        <p className="studioEyebrow">CARDÁPIO DIGITAL</p>
        <h1>Um cardápio que atende e vende sozinho</h1>
        <p>O cliente vê as fotos, escolhe e envia o pedido sozinho — presencial ou de casa. Você recebe pronto para preparar.</p>
        <div className="menuProductActions"><a className="menuProductPrimary" href={whatsapp} target="_blank" rel="noreferrer">SOLICITAR ORÇAMENTO<br/><span>↗</span></a><a className="menuProductSecondary" href="#entregamos">Ver como funciona <span>↓</span></a></div>
      </section>

      <section className="menuCatalogWidgetSection">
        <div className="menuCatalogIntro">
          <p className="studioEyebrow">EXPERIMENTE AGORA</p>
          <h2>Assim seu cliente pede sozinho.</h2>
          <p>Toque em qualquer prato. Veja fotos, tamanhos, preço e o botão de pedir — o mesmo fluxo que entregamos, aberto na mesa ou no celular do cliente.</p>
        </div>
        <CatalogWidget />
      </section>

      <section className="menuProductProblem"><div><p className="studioEyebrow">O CUSTO DE ESCONDER O CARDÁPIO</p><h2>Cardápio escondido custa venda.</h2></div><p>Cliente pergunta preço no WhatsApp e espera. Não sabe o que tem hoje. Não entende o combo. Desiste. Quando o cardápio é visual, atualizado e fácil de pedir, a venda acontece sem atrito — na mesa ou no delivery.</p></section>

      <section className="menuProductProof"><div><p className="studioEyebrow">PARA QUEM É</p><h2>Serve para quem vende comida.</h2></div><ul>{audiences.map(([title, copy]) => <li key={title}><b>{title}.</b> {copy}</li>)}</ul></section>

      <section id="entregamos" className="menuProductDeliverables"><div><p className="studioEyebrow">O QUE VOCÊ RECEBE</p><h2>Um cardápio que atende e vende sozinho.</h2></div><ol>{deliverables.map(([title, copy], index) => <li key={title}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{title}</h3><p>{copy}</p></div></li>)}</ol></section>

      <section className="menuVisualShowcase"><div><p className="studioEyebrow">VEJA NA PRÁTICA</p><h2>O cliente toca e pede. Simples assim.</h2></div><FanGallery/></section>

      <section className="menuProductProcess"><div><p className="studioEyebrow">COMO FUNCIONA</p><h2>Autonomia para o cliente, tempo de volta para você.</h2></div><ol>{steps.map(([title, copy], index) => <li key={title}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{title}</h3><p>{copy}</p></div></li>)}</ol></section>

      

      <FinalCta pageKey="cardapio-digital" productName="Cardápio Digital" title="Quer seu cardápio pedindo por você?" subtitle="Me conta como você vende hoje — mesa, delivery ou os dois. Devolvo escopo, prazo e valor." />
    </main>
    <footer className="studioFooter"><a href="/">GB IA.</a><span>Cardápio Digital · Mesa, delivery e WhatsApp</span></footer>
  </div>;
}

export const Route = createFileRoute("/cardapio-digital")({
  component: CardapioDigitalPage,
  head: () => ({
    meta: [
      { title: "Cardápio Digital — Mesa, delivery e WhatsApp | GB IA" },
      { name: "description", content: "Cardápio digital com fotos, pedido no WhatsApp/mesa e pagamento integrado. Para restaurantes, delivery, autônomos e marcas de comida." },
      { property: "og:title", content: "Cardápio Digital — Mesa, delivery e WhatsApp | GB IA" },
      { property: "og:description", content: "Cardápio digital com fotos, pedido no WhatsApp/mesa e pagamento integrado. Para restaurantes, delivery, autônomos e marcas de comida." },
      { property: "og:type", content: "product" },
      { property: "og:url", content: "https://gb-ia.lovable.app/cardapio-digital" },
    ],
    links: [{ rel: "canonical", href: "https://gb-ia.lovable.app/cardapio-digital" }],
  }),
});
