import { createFileRoute } from "@tanstack/react-router";
import { BrandLogo } from "@/components/BrandLogo";
import { BentoMorphGallery } from "@/components/imported/ecommerce/BentoMorphGallery";
import { usePageLink } from "@/lib/adminLinks";
import { FinalCta } from "@/components/FinalCta";
import { ProductSwitcher } from "@/components/ProductSwitcher";

const marketStats = [
  ["+R$ 234 bi", "Movimentados em e-commerce no Brasil em 2024. E não para de crescer."],
  ["9 em 10", "Brasileiros conectados já compraram online pelo menos uma vez."],
  ["73%", "Das jornadas de compra começam numa busca no digital, não na loja física."],
];

const deliverables = [
  ["E-commerce que converte", "Loja própria com checkout otimizado, UX pensado para venda e performance mobile-first. Não é vitrine bonita — é máquina de conversão."],
  ["Catálogo digital integrado", "Modalidade enxuta: sua vitrine online conectada ao WhatsApp para negócios que ainda não querem checkout, mas precisam vender pelo digital hoje."],
  ["Cadastro por WhatsApp — texto, foto e áudio", "Manda um áudio descrevendo o produto. A IA cria título, descrição SEO, categoriza e sobe pronto para venda em todos os canais."],
  ["Integração com marketplaces", "Mesma loja publicando em Mercado Livre, Shopee, Amazon e Instagram Shopping. Cadastro único, estoque sincronizado, pedidos num painel só."],
  ["IA vendedora 24/7", "Atende, tira dúvida, recupera carrinho abandonado e fecha venda no WhatsApp e Instagram sem você estar online."],
  ["Rastreamento de comportamento", "Heatmap, replay de sessão e eventos configurados. A gente enxerga onde o cliente trava e ajusta até parar de perder venda."],
];

const channels = [
  "Site próprio",
  "Mercado Livre",
  "Shopee",
  "Amazon",
  "Instagram Shopping",
  "WhatsApp Catálogo",
];

const steps = [
  ["Briefing", "Entendemos seu produto, seu público, seus canais e onde as vendas estão travando hoje."],
  ["Arquitetura", "Desenhamos loja, catálogo, marketplaces, automação e IA como um sistema único — não peças soltas."],
  ["Implementação", "Construímos, integramos os canais, treinamos a IA no seu produto e testamos ponta a ponta."],
  ["Operação", "Sistema entra no ar vendendo. A gente acompanha, mede, ajusta e escala junto."],
];

function EcommercePage() {
  const { ctaUrl: whatsapp } = usePageLink("ecommerce");
  return <div className="commercePage">
    <header className="studioNav commerceNav"><BrandLogo /><a href={whatsapp} target="_blank" rel="noreferrer" className="studioNavCta">SOLICITAR ORÇAMENTO<br/><span>↗</span></a></header>
    <ProductSwitcher current="ecommerce" />
    <main>
      <section className="commerceHero">
        <p className="studioEyebrow">GB IA · E-COMMERCE INTELIGENTE</p>
        <h1>O varejo migrou.<br/><em>Sua marca <span className="commerceAccent">já está lá?</span></em></h1>
        <p>Enquanto o físico estagna, o digital cresce em dois dígitos por ano. Grandes marcas já migraram — o mercado que sobra é online, rastreável e 24/7. A gente entrega o sistema completo para você entrar dentro dessa curva.</p>
        <div className="commerceHeroActions"><a className="commercePrimary" href={whatsapp} target="_blank" rel="noreferrer">QUERO MINHA LOJA VENDENDO<br/><span>↗</span></a><a className="commerceSecondary" href="#entregamos">Ver o que entregamos <span>↓</span></a></div>
        <small>Loja · Catálogo · Marketplaces · WhatsApp · IA vendedora · Tráfego rastreado</small>
      </section>

      <section className="commerceMarket">
        <p className="studioEyebrow">POR QUE AGORA</p>
        <h2>O futuro do varejo <em>já começou.</em></h2>
        <div className="commerceMarketGrid">
          {marketStats.map(([n, copy]) => <article key={n}><b>{n}</b><p>{copy}</p></article>)}
        </div>
        <p className="commerceMarketNote">Todo mundo que enxergou primeiro está capturando o cliente antes de você. Estar no digital deixou de ser diferencial — virou ponto de partida.</p>
      </section>

      <section id="entregamos" className="commerceDeliverables">
        <div className="commerceSectionIntro"><p className="studioEyebrow">O QUE FAZEMOS</p><h2>Não é site.<br/>É sistema completo <em>de venda.</em></h2></div>
        <ol>{deliverables.map(([title, copy], index) => <li key={title}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{title}</h3><p>{copy}</p></div></li>)}</ol>
      </section>

      <section className="commerceAudio">
        <div className="commerceAudioCopy">
          <p className="studioEyebrow">CADASTRO POR ÁUDIO</p>
          <h2>Manda um áudio. <em>Sobe em 4 canais.</em></h2>
          <p>Grava um áudio no WhatsApp descrevendo o produto. A IA transcreve, escreve título e descrição otimizados para SEO, categoriza, sugere preço e publica na sua loja e nos marketplaces integrados. Sem planilha, sem cadastro manual, sem dor.</p>
        </div>
        <div className="chatDemo commerceAudioChat">
          <header><span><i/>GB Commerce</span><small>catálogo online</small></header>
          <div className="commerceAudioBody">
            <p className="chatUser commerceAudioMsg"><span className="commerceAudioWave"><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/></span><small>0:22</small></p>
            <p className="chatAgent"><b>GB Commerce</b>Entendi. Vou criar o cadastro do produto agora.</p>
            <article className="commerceAudioCard">
              <div className="commerceAudioCardImg"/>
              <div>
                <small>PRODUTO GERADO</small>
                <b>Camiseta Oversized Off-White · Algodão Pima</b>
                <p>Caimento oversized, gola reforçada, 100% algodão Pima. Peça leve, ideal para o verão e para looks casuais com camadas.</p>
                <div className="commerceAudioTags"><span>R$ 129,90</span><span>Vestuário</span><span>SEO ✓</span></div>
              </div>
            </article>
            <p className="chatAgent"><b>GB Commerce</b>Publicar em quais canais?</p>
            <div className="commerceAudioChannels">
              <span>✓ Site</span><span>✓ Mercado Livre</span><span>✓ Shopee</span><span>✓ Instagram</span>
            </div>
            <p className="commerceAudioApproved">Publicado em 4 canais · estoque sincronizado</p>
          </div>
        </div>
      </section>

      <section className="commerceOmni">
        <div><p className="studioEyebrow">UMA LOJA · TODOS OS CANAIS</p><h2>Cadastra uma vez. <em>Vende em todo lugar.</em></h2><p>Sua loja GB IA no centro. Cada canal puxando produto, estoque e pedido do mesmo lugar. Sem duplicar cadastro, sem estoque furado, sem pedido perdido.</p></div>
        <div className="commerceOmniDiagram">
          <div className="commerceOmniCore"><b>GB IA</b><small>Loja + Painel</small></div>
          {channels.map((c, i) => <span key={c} className="commerceOmniNode" style={{ ["--i" as string]: i, ["--total" as string]: channels.length } as React.CSSProperties}>{c}</span>)}
          <svg className="commerceOmniLines" viewBox="0 0 400 400" aria-hidden="true">
            {channels.map((_, i) => {
              const angle = (i / channels.length) * Math.PI * 2 - Math.PI / 2;
              const x = 200 + Math.cos(angle) * 170;
              const y = 200 + Math.sin(angle) * 170;
              return <line key={i} x1="200" y1="200" x2={x} y2={y} stroke="#4a5a52" strokeWidth="1" strokeDasharray="3 4"/>;
            })}
          </svg>
        </div>
      </section>

      <section className="commerceTracking">
        <div className="commerceTrackingCopy">
          <p className="studioEyebrow">CONVERSÃO É ENGENHARIA</p>
          <h2>A gente vê onde <em>o cliente desiste.</em></h2>
          <p>Heatmap, replay de sessão, funil de checkout e eventos de conversão instalados desde o primeiro dia. Cada abandono vira dado, cada dado vira ajuste, cada ajuste vira venda a mais no fim do mês.</p>
          <ul>
            <li><b>Heatmap</b> — onde o cliente clica, onde ele para de rolar.</li>
            <li><b>Replay</b> — assiste sessões reais de quem não comprou.</li>
            <li><b>Funil</b> — do anúncio ao pagamento, etapa por etapa.</li>
            <li><b>Pixel</b> — Meta, Google e TikTok configurados corretamente.</li>
          </ul>
        </div>
        <div className="commerceHeatmap" aria-hidden="true">
          <div className="commerceHeatmapChrome"><i/><i/><i/></div>
          <div className="commerceHeatmapPage">
            <div className="commerceHeatmapImg"/>
            <div className="commerceHeatmapText"><i/><i/><i style={{ width: "60%" }}/></div>
            <div className="commerceHeatmapCta"/>
            <span className="commerceHeatSpot" style={{ top: "22%", left: "30%" }}/>
            <span className="commerceHeatSpot commerceHeatSpotHot" style={{ top: "72%", left: "58%" }}/>
            <span className="commerceHeatSpot commerceHeatSpotWarm" style={{ top: "48%", left: "20%" }}/>
            <span className="commerceHeatSpot commerceHeatSpotWarm" style={{ top: "38%", left: "70%" }}/>
          </div>
        </div>
      </section>

      <section className="commerceGallerySection">
        <div><p className="studioEyebrow">MODELOS & TEMPLATES</p><h2>Modelos que já <em>viraram loja no ar.</em></h2><p>Direções visuais que adaptamos à identidade, ao catálogo e à operação da sua marca.</p></div>
        <BentoMorphGallery />
      </section>

      <section className="commerceProcess">
        <div><p className="studioEyebrow">COMO FUNCIONA</p><h2>Do briefing ao ar, <em>sem enrolação.</em></h2></div>
        <ol>{steps.map(([title, copy], index) => <li key={title}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{title}</h3><p>{copy}</p></div></li>)}</ol>
      </section>

      <FinalCta pageKey="ecommerce" productName="E-commerce" title="Pronto para entrar no mercado que só cresce?" subtitle="Me conta seu produto e onde você quer vender. Devolvo escopo de loja, catálogo, marketplaces e IA vendedora." />
    </main>
    <footer className="studioFooter"><a href="/">GB IA.</a><span>E-commerce · Loja, catálogo, marketplaces e IA vendedora</span></footer>
  </div>;
}

export const Route = createFileRoute("/ecommerce")({
  component: EcommercePage,
  head: () => ({
    meta: [
      { title: "E-commerce Inteligente — Loja, Catálogo, Marketplaces e IA Vendedora | GB IA" },
      { name: "description", content: "E-commerce e catálogo digital com cadastro por áudio no WhatsApp, integração com Mercado Livre, Shopee, Amazon e Instagram, IA vendedora 24/7 e rastreamento de comportamento. O sistema completo para vender no digital." },
      { property: "og:title", content: "E-commerce Inteligente — Loja + Marketplaces + IA Vendedora | GB IA" },
      { property: "og:description", content: "Loja, catálogo, marketplaces, WhatsApp e IA vendedora num sistema só. Cadastre por áudio, publique em todos os canais, rastreie e otimize a conversão." },
      { property: "og:type", content: "product" },
      { property: "og:url", content: "https://gb-ia.lovable.app/ecommerce" },
    ],
    links: [{ rel: "canonical", href: "https://gb-ia.lovable.app/ecommerce" }],
  }),
});
