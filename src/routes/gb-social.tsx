import { createFileRoute } from "@tanstack/react-router";
import { BrandLogo } from "@/components/BrandLogo";
import consumoConscienteAsset from "@/assets/consumo-consciente.png.asset.json";
import { FormEvent, ReactNode, useState } from "react";
import { PerspectiveTicker } from "@/components/imported/gb-social/PerspectiveTicker";
import { usePageLink } from "@/lib/adminLinks";
import { FinalCta } from "@/components/FinalCta";
import { ProductSwitcher } from "@/components/ProductSwitcher";

const channels = ["Instagram", "Facebook", "Google Business Profile", "Outros canais da empresa"];
const flow = ["Sua mensagem no WhatsApp", "Entendimento do pedido", "Consulta ao DNA da empresa", "Criação e adaptação", "Aprovação e publicação"];

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
      ? <a href={ctaUrl} target="_blank" rel="noreferrer" className="studioNavCta">{ctaLabel} <span>↗</span></a>
      : <a href="#começar" className="studioNavCta">{ctaLabel} <span>↗</span></a>}</header>
    <ProductSwitcher current="gb-social" />
    <main>
      <section className="socialHero">
        <p className="studioEyebrow">GB SOCIAL · SOCIAL MEDIA DE IA</p>
        <h1>Sua empresa ativa em todos os canais.<br/><em>Sem você cuidar de todos eles.</em></h1>
        <p>Um Social Media de IA que trabalha pelo WhatsApp, aprende o DNA da sua empresa, cria conteúdo e mantém sua presença digital funcionando.</p>
        <strong>Você manda uma mensagem. Ele trabalha.</strong>
        <CtaPrimary>{ctaLabel} <span>↗</span></CtaPrimary>
        <small>100% pelo WhatsApp · Sem prompts complicados · Feito para toda a sua equipe</small>
      </section>

      <section className="whatsappBlock">
        <div><p className="studioEyebrow">UMA INTERFACE QUE VOCÊ JÁ CONHECE</p><h2>Você não precisa aprender a usar IA.</h2><p>Você já sabe usar WhatsApp. Nada de plataformas cheias de menus, prompts gigantes ou cinco sistemas para fazer um post.</p></div>
        <div className="chatDemo socialDesignerChat">
          <header><span><i/>GB Social</span><small>designer online</small></header>
          <div className="socialChatBody">
            <p className="chatUser">Preciso de uma arte pro Instagram anunciando agenda aberta.</p>
            <p className="chatAgent"><b>GB Social</b>Perfeito. Vou seguir o DNA da marca e preparar uma peça com chamada direta para WhatsApp.</p>
            <article className="socialDesignPreview socialDesignPreviewImage" aria-label="Preview da arte criada pelo designer">
              <img src={consumoConscienteAsset.url} alt="Design Consumo Consciente criado pelo GB Social" />
            </article>
            <p className="chatAgent"><b>GB Social</b>Criei essa versão. Posso adaptar para story e feed, mantendo o mesmo visual.</p>
            <p className="chatUser">Gostei. Faz uma versão com CTA mais forte.</p>
            <p className="chatAgent"><b>Designer</b>Atualizei: destaquei o botão, aumentei contraste e mantive a identidade da marca.</p>
            <p className="socialApproval">Aprovação recebida · pronto para publicar</p>
          </div>
        </div>
      </section>

      <section className="allChannels">
        <p className="studioEyebrow">UM AGENTE · TODOS OS CANAIS</p><h2>Um único ponto de comando:<br/>seu WhatsApp.</h2>
        <div className="channelMap"><div>VOCÊ</div><i>→</i><div>WHATSAPP</div><i>→</i><div className="agentNode">GB SOCIAL</div><ul>{channels.map(c => <li key={c}>{c}</li>)}</ul></div>
        <p>Você conversa com um agente. O agente trabalha nos canais da sua empresa.</p>
      </section>

      <section className="socialWorkShowcase">
        <div><p className="studioEyebrow">CRIADO PELO GB SOCIAL</p><h2>Uma conversa pode virar uma campanha inteira.</h2><p>Explore alguns dos designs que já estão sendo criados para marcas e campanhas reais.</p></div>
        <PerspectiveTicker />
      </section>

      <section className="autonomyBlock">
        <div><p className="studioEyebrow">NÃO É SÓ MAIS UM GERADOR</p><h2>Uma ferramenta espera ser usada.<br/><em>Um agente trabalha.</em></h2></div>
        <div className="autonomyGrid"><article><span>01</span><h3>Pode trabalhar sozinho</h3><p>Prepara publicações, executa rotinas e mantém a frequência dentro das regras definidas.</p></article><article><span>02</span><h3>Você escolhe o controle</h3><p>Peça, aprove ou configure o nível de autonomia que faz sentido para sua empresa.</p></article><article><span>03</span><h3>O trabalho continua</h3><p>Enquanto você cuida da empresa, o agente continua cuidando da presença digital dela.</p></article></div>
      </section>

      <section className="dnaBlock">
        <div><p className="studioEyebrow">ELE APRENDE SUA EMPRESA UMA VEZ</p><h2>Depois, sua equipe só precisa conversar.</h2></div>
        <div className="dnaCards"><article><span>DNA DA MARCA</span><h3>Identidade preservada.</h3><p>Logo, cores, estilo, tom de voz e regras do que pode ou não pode ser feito.</p></article><article><span>DNA DO NEGÓCIO</span><h3>Contexto que permanece.</h3><p>O que sua empresa faz, vende, para quem vende e como se posiciona.</p></article></div>
        <p className="dnaNote">A IA pode criar ao redor da sua marca. Ela não precisa reinventar sua marca.</p>
      </section>

      <section className="socialFlow"><p className="studioEyebrow">DO WHATSAPP PARA A INTERNET</p><h2>Uma mensagem. Uma operação inteira.</h2><ol>{flow.map((item, i) => <li key={item}><span>{String(i + 1).padStart(2, "0")}</span><b>{item}</b></li>)}</ol></section>

      <FinalCta pageKey="gb-social" productName="GB Social" />
    </main>
    <footer className="studioFooter"><a href="/">GB IA.</a><span>GB Social · Seu Social Media de IA no WhatsApp</span></footer>

    {open && <div className="studioModal" role="dialog" aria-modal="true" onMouseDown={e => e.target === e.currentTarget && setOpen(false)}><div className="studioModalBox"><button className="studioClose" onClick={() => setOpen(false)} aria-label="Fechar">×</button>{sent ? <div className="studioSuccess"><b>✓</b><h2>Mensagem recebida.</h2><p>A equipe vai continuar o contato com você.</p><button onClick={() => {setSent(false);setOpen(false)}}>Fechar</button></div> : <><p className="studioEyebrow">GB SOCIAL</p><h2>Conhecer o GB Social</h2><form onSubmit={submit}><label>Nome<input required placeholder="Seu nome"/></label><label>E-mail<input required type="email" placeholder="voce@empresa.com.br"/></label><label>Empresa<input required placeholder="Nome da empresa"/></label><label>O que você quer delegar?<textarea required placeholder="Conte quais canais e tarefas quer manter ativos"/></label><button type="submit">Quero falar com a equipe <span>↗</span></button></form></>}</div></div>}
  </div>;
}

export const Route = createFileRoute("/gb-social")({ component: GBSocialPage });
