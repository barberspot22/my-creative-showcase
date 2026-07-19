import { createFileRoute } from "@tanstack/react-router";
import { BrandLogo } from "@/components/BrandLogo";
import { usePageLink } from "@/lib/adminLinks";
import { RecoverScrollChat } from "@/components/imported/crm/RecoverScrollChat";

const structure = [
  ["Módulo Comercial", "Funil de vendas com qualificação de lead: origem, temperatura, responsável e status do pipeline — só o que importa para saber se aquele contato vira cliente ou não."],
  ["Módulo Produção", "Kanban de entrega separado do comercial: escopo do pedido, prazo e responsável por etapa — para acompanhar o que está sendo feito sem misturar com quem ainda está negociando."],
  ["Responsáveis e setores próprios", "Cada card tem dono e setor definidos — comercial, criação, produção e pós-venda. Nada de card órfão sem ninguém puxando."],
];

const steps = [
  ["Briefing", "Mapeamos seu funil real: onde o lead qualifica e onde o pedido vira entrega."],
  ["Arquitetura", "Desenhamos os dois módulos e o fluxo de card entre eles, sem misturar responsabilidades."],
  ["Implementação", "Construímos com stack moderna, componentes próprios e sem depender de planilha."],
  ["Operação", "O sistema entra em uso com os dados reais da sua operação e continua acompanhado por nós."],
];

const proof = [
  "CRM interno próprio da GB, com Comercial e Produção separados",
  "Responsáveis e setores por card: comercial, criação, produção e pós-venda",
  "Qualificação de lead isolada do escopo de entrega",
  "Kanban de produção com status próprio e sem ferramenta genérica de terceiro",
];


function PipelineDemo() {
  return <div className="crmDemo" aria-label="Demonstração dos módulos Comercial e Produção">
    <section className="crmMetricsPanel" aria-label="Painel de métricas do CRM">
      <header><b>Dashboard da operação</b><small>Visão em tempo real</small></header>
      <div className="crmMetricGrid">
        <article><small>Leads ativos</small><strong>128</strong><span>+18% na semana</span></article>
        <article><small>Conversão</small><strong>32%</strong><span>pipeline comercial</span></article>
        <article><small>Entregas no prazo</small><strong>91%</strong><span>produção</span></article>
        <article><small>Tempo resposta</small><strong>4m</strong><span>WhatsApp + IA</span></article>
      </div>
      <div className="crmMetricChart"><i/><i/><i/><i/><i/><i/></div>
    </section>
    <article className="crmModule commercialModule">
      <header><span>01</span><div><b>Comercial</b><small>Qualificação & pipeline</small></div></header>
      <div className="crmColumns"><div><small>NOVOS LEADS</small><p><i className="hot"/> Loja Aurora <b>Hoje</b></p><p><i className="warm"/> Forma Casa <b>Ontem</b></p></div><div><small>PROPOSTA</small><p><i className="hot"/> Studio Norte <b>R$ 18k</b></p></div><div><small>FECHADO</small><p><i className="cold"/> Nativa <b>Ganho</b></p></div></div>
    </article>
    <div className="crmHandoff"><span>Cliente fechado</span><b>→</b><span>Pedido criado</span></div>
    <article className="crmModule productionModule">
      <header><span>02</span><div><b>Produção</b><small>Escopo & entrega</small></div></header>
      <div className="crmColumns"><div><small>BRIEFING</small><p>Nativa — Catálogo <b>EM</b></p></div><div><small>EM PRODUÇÃO</small><p>Studio Norte — Site <b>FK</b></p><p>Forma Casa — Automação <b>GB</b></p></div><div><small>REVISÃO</small><p>Loja Aurora — CRM <b>EM</b></p></div></div>
    </article>
  </div>;
}

function CRMPage() {
  const { ctaUrl: whatsapp, ctaLabel } = usePageLink("crm");
  return <div className="crmPage">
    <header className="studioNav crmNav"><BrandLogo /><a href={whatsapp} target="_blank" rel="noreferrer" className="studioNavCta">{ctaLabel} <span>↗</span></a></header>
    <main>
      <section className="crmHero">
        <p className="studioEyebrow">GB IA — CRM</p>
        <h1>Comercial e produção não podem viver na mesma bagunça.</h1>
        <p>Construímos um CRM próprio, dividido em dois módulos reais — um para o funil de vendas, outro para o fluxo de entrega — porque qualificar lead e entregar projeto são dois jogos completamente diferentes.</p>
        <div className="crmHeroActions"><a className="crmPrimary" href={whatsapp} target="_blank" rel="noreferrer">{ctaLabel} <span>↗</span></a><a className="crmSecondary" href="#estrutura">Ver como funciona <span>↓</span></a></div>
        <small>Comercial separado da produção · Responsável por card · Fluxo próprio</small>
      </section>

      <section className="crmProblem">
        <div><p className="studioEyebrow">POR QUE CRM GENÉRICO NÃO RESOLVE</p><h2>A maioria dos sistemas mistura tudo numa coluna só.</h2></div>
        <p>Planilha ou CRM pronto tenta encaixar qualificação de lead, escopo de pedido e status de produção na mesma bagunça de campos. Resultado: ninguém sabe se aquele card é um lead esfriando ou uma entrega atrasando. A gente separou isso em dois módulos com fluxo próprio.</p>
      </section>

      <section className="crmSystemShowcase"><div><p className="studioEyebrow">DOIS JOGOS · DOIS FLUXOS</p><h2>O cliente avança.<br/>A bagunça não.</h2></div><PipelineDemo/></section>

      <section className="recoverShowcase recoverChatShowcase crmRecoverShowcase"><div><p className="studioEyebrow">RECOVER DENTRO DO CRM</p><h2>Lead frio tambem entra no fluxo.</h2></div><RecoverScrollChat whatsapp={whatsapp}/></section>

      <section id="estrutura" className="crmStructure">
        <div className="crmSectionIntro"><p className="studioEyebrow">COMO É ESTRUTURADO</p><h2>Dois módulos, cada um com sua própria lógica.</h2></div>
        <ol>{structure.map(([title, copy], index) => <li key={title}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{title}</h3><p>{copy}</p></div></li>)}</ol>
      </section>

      <section className="crmProcess">
        <div><p className="studioEyebrow">COMO FUNCIONA</p><h2>Do briefing à operação, sem ficar te devendo satisfação.</h2></div>
        <ol>{steps.map(([title, copy], index) => <li key={title}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{title}</h3><p>{copy}</p></div></li>)}</ol>
      </section>

      <section className="crmProof">
        <div><p className="studioEyebrow">JÁ ENTREGAMOS</p><h2>Sistema em uso real, não protótipo de apresentação.</h2></div>
        <ul>{proof.map(item => <li key={item}>{item}</li>)}</ul>
      </section>

      <section className="crmFinal"><p className="studioEyebrow">VAMOS CONVERSAR</p><h2>Me conta como seu comercial e sua entrega funcionam hoje.<br/>A gente desenha o CRM certo.</h2><p>Sem proposta engessada — o primeiro papo é para entender se faz sentido.</p><a className="crmPrimary" href={whatsapp} target="_blank" rel="noreferrer">{ctaLabel} <span>↗</span></a></section>
    </main>
    <footer className="studioFooter"><a href="/">GB IA.</a><span>CRM · Comercial e produção em fluxos próprios</span></footer>
  </div>;
}

export const Route = createFileRoute("/crm")({ component: CRMPage });
