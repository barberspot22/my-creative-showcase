import { createFileRoute } from "@tanstack/react-router";
import { BrandLogo } from "@/components/BrandLogo";
import { usePageLink } from "@/lib/adminLinks";
import { RecoverScrollChat } from "@/components/imported/crm/RecoverScrollChat";
import { FinalCta } from "@/components/FinalCta";
import { ProductSwitcher } from "@/components/ProductSwitcher";

const automations = [
  ["01", "Conversa automática com IA", "IA treinada no seu negócio responde no WhatsApp, Instagram e site — qualifica o lead antes do time humano entrar."],
  ["02", "Follow-up automático por estágio", "Cada estágio do funil tem seu ritmo. Follow-up de 30min, 3h, 24h — sem depender de ninguém lembrar."],
  ["03", "Movimentação automática do Kanban", "O card avança sozinho conforme o cliente responde, agenda ou fecha. Ninguém arrasta card manualmente."],
  ["04", "Pós-venda automático", "Depois da compra, o cliente entra num fluxo de acompanhamento, avaliação e recompra — no piloto automático."],
  ["05", "Modo humano automático", "Quando a conversa esquenta, o sistema chama o humano certo no setor certo — sem perder contexto."],
  ["06", "Recuperação de carrinho", "Lead que sumiu volta pra régua: mensagem, condição especial, última chance — tudo cronometrado por card."],
];

const structure = [
  ["Módulo Comercial", "Funil de vendas com qualificação de lead: origem, temperatura, responsável e status do pipeline — só o que importa para saber se aquele contato vira cliente ou não."],
  ["Módulo Produção", "Kanban de entrega separado do comercial: escopo do pedido, prazo e responsável por etapa — para acompanhar o que está sendo feito sem misturar com quem ainda está negociando."],
  ["Responsáveis e setores próprios", "Cada card tem dono e setor definidos — comercial, criação, produção e pós-venda. Nada de card órfão sem ninguém puxando."],
];

const comparison = [
  ["Responsável por lead/card", "Genérico", "Definido por setor e pessoa"],
  ["Comercial × Produção", "Misturado", "Módulos separados"],
  ["Follow-up", "Manual ou plugin", "Régua nativa no CRM"],
  ["Pós-venda", "Fora do sistema", "Fluxo dentro do CRM"],
  ["Manutenção", "Custo de licença", "Time GB junto"],
];

function PipelineDemo() {
  return <div className="crmDemo" aria-label="Demonstração dos módulos Comercial e Produção">
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

function ChatMock() {
  return <div className="crmChatMock" aria-label="Conversa comercial com IA">
    <header><b>Mariana Alves</b><small>IA · ATIVO</small></header>
    <p className="msg lead">Oi, vi o anúncio no Instagram. Tem tamanho M?</p>
    <p className="msg agent">Oi Mariana! Tenho sim — R$ 189, entrega em 3 dias. Quer garantir o seu?</p>
    <p className="msg lead">Consegue parcelar em 3×?</p>
    <p className="msg agent">Claro, 3× sem juros. Te mando o link do checkout já com o cupom aplicado.</p>
    <p className="msg lead">Manda aí, bora fechar</p>
    <p className="msg agent">Feito ✅ pedido gerado #4821. Te acompanho pelo pós-venda.</p>
  </div>;
}

function CRMPage() {
  const { ctaUrl: whatsapp, ctaLabel } = usePageLink("crm");
  return <div className="crmPage">
    <header className="studioNav crmNav"><BrandLogo /><a href={whatsapp} target="_blank" rel="noreferrer" className="studioNavCta">SOLICITAR ORÇAMENTO<br/><span>↗</span></a></header>
    <ProductSwitcher current="crm" />
    <main>
      {/* 1. Hero */}
      <section className="crmHero">
        <p className="studioEyebrow">GB IA — CRM</p>
        <h1>Comercial e produção não podem viver na mesma bagunça.</h1>
        <p>Construímos um CRM próprio, dividido em dois módulos reais — um para o funil de vendas, outro para o fluxo de entrega — porque qualificar lead e entregar projeto são dois jogos completamente diferentes.</p>
        <div className="crmHeroActions"><a className="crmPrimary" href={whatsapp} target="_blank" rel="noreferrer">SOLICITAR ORÇAMENTO<br/><span>↗</span></a><a className="crmSecondary" href="#automacoes">Ver como funciona <span>↓</span></a></div>
        <small>Comercial separado da produção · Responsável por card · Fluxo próprio</small>
      </section>

      {/* 2. O que roda no automático */}
      <section id="automacoes" className="crmAutoBlock">
        <p className="studioEyebrow">AUTOMAÇÕES NATIVAS</p>
        <h2>O que roda no automático.</h2>
        <div className="crmAutoGrid">
          {automations.map(([n, title, copy]) => <article key={n}><small>[{n}]</small><h3>{title}</h3><p>{copy}</p></article>)}
        </div>
      </section>

      {/* 3. Dashboard + módulos */}
      <section className="crmSystemShowcase">
        <div><p className="studioEyebrow">DOIS JOGOS · DOIS FLUXOS</p><h2>O cliente avança.<br/>A bagunça não.</h2></div>
        <PipelineDemo/>
      </section>

      {/* 4. Chat mock */}
      <section className="crmChatBlock">
        <div>
          <p className="studioEyebrow">CRM VENDAS</p>
          <h2>Conversa que fecha, dentro do sistema.</h2>
          <p>Todo atendimento vira card automaticamente — WhatsApp, Instagram e site num inbox só, com histórico, temperatura e próximo passo já sugeridos pela IA.</p>
        </div>
        <ChatMock/>
      </section>

      {/* 5. Estrutura */}
      <section id="estrutura" className="crmStructure">
        <div className="crmSectionIntro"><p className="studioEyebrow">COMO É ESTRUTURADO</p><h2>Dois módulos,<br/>cada um com sua própria lógica.</h2></div>
        <ol>{structure.map(([title, copy], index) => <li key={title}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{title}</h3><p>{copy}</p></div></li>)}</ol>
      </section>

      {/* 6. Recover */}
      <section className="recoverShowcase recoverChatShowcase crmRecoverShowcase">
        <div><p className="studioEyebrow">RECOVER DENTRO DO CRM</p><h2>Automação com trava,<br/>memória e recuperação.</h2></div>
        <RecoverScrollChat whatsapp={whatsapp}/>
      </section>

      {/* 7. Comparação */}
      <section className="crmCompareBlock">
        <p className="studioEyebrow">POR QUE NÃO USAR CRM GENÉRICO</p>
        <h2>CRM tradicional vs GB CRM.</h2>
        <table className="crmCompareTable">
          <thead><tr><th>Ponto</th><th>CRM tradicional</th><th>GB CRM</th></tr></thead>
          <tbody>{comparison.map(([k, a, b]) => <tr key={k}><td>{k}</td><td>{a}</td><td>{b}</td></tr>)}</tbody>
        </table>
      </section>

      {/* 8. Final */}
      <FinalCta pageKey="crm" productName="CRM" />
    </main>
    <footer className="studioFooter"><a href="/">GB IA.</a><span>CRM · Comercial e produção em fluxos próprios</span></footer>
  </div>;
}

export const Route = createFileRoute("/crm")({ component: CRMPage });
