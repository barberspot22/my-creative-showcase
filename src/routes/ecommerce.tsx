import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { ReferenceGallery, type Reference } from "@/components/imported/shared/ReferenceGallery";
import { ecommerceReferences } from "@/lib/references";
import { fetchReferencesByPage } from "@/lib/cms";
import { usePageLink } from "@/lib/adminLinks";
import { FinalCta } from "@/components/FinalCta";
import { ProductSwitcher } from "@/components/ProductSwitcher";
import tshirtImg from "@/assets/tshirt-oversized-offwhite.jpg";


const deliverables = [
  ["E-commerce que converte", "Loja própria com checkout otimizado e mobile-first. Máquina de conversão, não vitrine."],
  ["Catálogo digital integrado", "Vitrine online conectada ao WhatsApp, sem checkout, pra vender no digital hoje."],
  ["Cadastro por áudio", "Manda um áudio. A IA cria título, descrição SEO e publica em todos os canais."],
  ["Marketplaces integrados", "Mercado Livre, Shopee, Amazon e Instagram sincronizados num painel só."],
  ["IA vendedora 24/7", "Atende, tira dúvida, recupera carrinho e fecha venda sem você online."],
];

const channels = [
  "Site próprio",
  "Mercado Livre",
  "Shopee",
  "Amazon",
  "Instagram Shopping",
  "WhatsApp Catálogo",
];




function EcommercePage() {
  const { ctaUrl: whatsapp } = usePageLink("ecommerce");
  const [refs, setRefs] = useState<Reference[]>(ecommerceReferences);
  useEffect(() => { fetchReferencesByPage("ecommerce").then((r) => { if (r.length) setRefs(r.map((x) => ({ ...x, type: "ecommerce" }))); }).catch(() => {}); }, []);
  return <div className="commercePage">
    <header className="studioNav commerceNav"><BrandLogo /><a href={whatsapp} target="_blank" rel="noreferrer" className="studioNavCta">SOLICITAR ORÇAMENTO<br/><span>↗</span></a></header>
    <ProductSwitcher current="ecommerce" />
    <main>
      <section className="commerceHero">
        <p className="studioEyebrow">GB IA · E-COMMERCE INTELIGENTE</p>
        <div className="metallicTitle" data-text="Seu cliente está online.">
          <h1>Seu cliente está online.<br/><em>Seu produto também?</em></h1>
        </div>
        <p>A gente coloca sua loja, catálogo e IA vendedora nos canais onde o cliente já compra. Você cadastra uma vez e vende em todo lugar.</p>
        <div className="commerceHeroActions"><a className="commerceSecondary" href="#entregamos">Ver o que entregamos <span>↓</span></a></div>
        <small>Loja · Catálogo · Marketplaces · WhatsApp · IA vendedora · Tráfego rastreado</small>
      </section>

      <section className="commerceGallerySection">
        <div><p className="studioEyebrow">REFERÊNCIAS & INSPIRAÇÕES</p><h2>Sites e lojas reais <em>que a gente recria do jeito da sua marca.</em></h2><p>Arraste lateral para trocar de referência · role dentro do card para percorrer o site inteiro, de cima a baixo.</p></div>
        <ReferenceGallery items={refs} ctaUrl={whatsapp} variant="tall" />
      </section>


      <section id="entregamos" className="commerceDeliverables">
        <div className="commerceSectionIntro"><p className="studioEyebrow">O QUE FAZEMOS</p><h2>Não é site.<br/>É sistema <em>de venda.</em></h2></div>
        <ol>{deliverables.map(([title, copy], index) => <li key={title}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{title}</h3><p>{copy}</p></div></li>)}</ol>
      </section>

      <section className="commerceAudio">
        <div className="commerceAudioCopy">
          <p className="studioEyebrow">CADASTRO POR ÁUDIO</p>
          <h2>Manda um áudio. <em>Sobe em 4 canais.</em></h2>
          <p>Grava o áudio no WhatsApp. A IA transcreve, escreve título, descrição SEO e publica na loja e nos marketplaces. Sem planilha, sem dor.</p>
        </div>
        <div className="chatDemo commerceAudioChat">
          <header className="commerceAudioHeader"><span><i/>GB Commerce</span><small>catálogo online</small></header>
          <div className="commerceAudioBody">
            <p className="chatUser commerceAudioMsg"><span className="commerceAudioWave"><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/></span><small>0:22</small></p>
            <p className="chatAgent commerceAudioAgent"><b>GB Commerce</b><span>Entendi. Criando o cadastro agora.</span></p>
            <article className="commerceAudioCard">
              <img className="commerceAudioCardImg" src={tshirtImg} alt="Camiseta oversized off-white" loading="lazy" width={768} height={768} />
              <div className="commerceAudioCardBody">
                <small>PRODUTO GERADO</small>
                <b>Camiseta Oversized Off-White</b>
                <p>Caimento oversized, gola reforçada, 100% algodão Pima.</p>
                <div className="commerceAudioTags"><span>R$ 129,90</span><span>Vestuário</span><span>SEO ✓</span></div>
              </div>
            </article>
            <p className="chatUser commerceAudioUserMsg"><span>Publica no site, Mercado Livre, Shopee e Instagram.</span><small>10:24</small></p>
            <p className="chatAgent commerceAudioAgent commerceAudioTyping"><b>GB Commerce</b><span className="commerceTypingDots"><i/><i/><i/></span></p>
          </div>
        </div>
      </section>


      <section className="commerceOmni">
        <div><p className="studioEyebrow">UMA LOJA · TODOS OS CANAIS</p><h2>Cadastra uma vez. <em>Vende em todo lugar.</em></h2><p>Sua loja no centro. Todos os canais puxando produto, estoque e pedido do mesmo lugar.</p></div>
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


      <FinalCta pageKey="ecommerce" productName="E-commerce" title="Pronto para entrar no mercado que só cresce?" subtitle="Me conta seu produto e onde você quer vender. Devolvo escopo de loja, catálogo, marketplaces e IA vendedora." />

    </main>
    <footer className="studioFooter"><a href="/">GB IA.</a><span>E-commerce · Loja, catálogo, marketplaces e IA vendedora</span></footer>
  </div>;
}

export const Route = createFileRoute("/ecommerce")({
  component: EcommercePage,
  head: () => ({
    meta: [
      { title: "E-commerce com IA vendedora | GB IA" },
      { name: "description", content: "Loja, catálogo digital, marketplaces, WhatsApp e IA vendedora num só sistema. Cadastre por áudio e venda em todos os canais onde seu cliente já está." },
      { property: "og:title", content: "E-commerce Inteligente — Loja + Marketplaces + IA Vendedora | GB IA" },
      { property: "og:description", content: "Loja, catálogo, marketplaces, WhatsApp e IA vendedora num sistema só. Cadastre por áudio, publique em todos os canais, rastreie e otimize a conversão." },
      { property: "og:type", content: "product" },
      { property: "og:url", content: "https://gb-ia.lovable.app/ecommerce" },
    ],
    links: [{ rel: "canonical", href: "https://gb-ia.lovable.app/ecommerce" }],
  }),
});
