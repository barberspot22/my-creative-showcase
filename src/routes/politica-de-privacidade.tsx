import { createFileRoute, Link } from "@tanstack/react-router";
import { BrandLogo } from "@/components/BrandLogo";

function PrivacyPage() {
  return (
    <div className="legalPage">
      <header className="legalNav">
        <Link to="/"><BrandLogo /></Link>
        <Link to="/" className="legalBack">← Voltar</Link>
      </header>
      <main className="legalContent">
        <p className="legalEyebrow">GB IA · LGPD</p>
        <h1>Política de Privacidade</h1>
        <p className="legalUpdated">Atualizada em 20 de julho de 2026</p>

        <section>
          <h2>1. Quem somos</h2>
          <p>A GB IA é uma empresa de desenvolvimento de sistemas, automação de processos e IA autônoma, com sede em Colatina, ES. Esta política descreve como coletamos, usamos e protegemos seus dados pessoais em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 — LGPD).</p>
        </section>

        <section>
          <h2>2. Dados que coletamos</h2>
          <p>Coletamos apenas as informações estritamente necessárias para responder aos seus contatos e prestar nossos serviços:</p>
          <ul>
            <li>Nome, e-mail e telefone informados nos formulários;</li>
            <li>Mensagens enviadas via formulários de contato ou briefing;</li>
            <li>Dados de navegação anônimos (páginas visitadas, tempo de sessão) para melhoria contínua do site.</li>
          </ul>
        </section>

        <section>
          <h2>3. Finalidade do tratamento</h2>
          <ul>
            <li>Retornar contatos e enviar propostas comerciais;</li>
            <li>Cumprir obrigações contratuais firmadas;</li>
            <li>Melhorar a experiência de uso e a segurança da plataforma;</li>
            <li>Atender obrigações legais e regulatórias.</li>
          </ul>
        </section>

        <section>
          <h2>4. Base legal</h2>
          <p>Tratamos dados pessoais com base no consentimento do titular, na execução de contrato, no cumprimento de obrigação legal e no legítimo interesse, sempre respeitando os limites da LGPD.</p>
        </section>

        <section>
          <h2>5. Compartilhamento</h2>
          <p>A GB IA não vende dados pessoais. Podemos compartilhar informações apenas com prestadores de serviço essenciais (hospedagem, comunicação e analytics), sempre sob contrato de confidencialidade, ou quando exigido por autoridade competente.</p>
        </section>

        <section>
          <h2>6. Seus direitos como titular</h2>
          <p>Você pode, a qualquer momento, solicitar:</p>
          <ul>
            <li>Confirmação da existência de tratamento;</li>
            <li>Acesso, correção ou anonimização dos dados;</li>
            <li>Portabilidade a outro fornecedor;</li>
            <li>Eliminação dos dados tratados com base no consentimento;</li>
            <li>Revogação do consentimento.</li>
          </ul>
        </section>

        <section>
          <h2>7. Segurança</h2>
          <p>Adotamos medidas técnicas e administrativas para proteger os dados contra acessos não autorizados, perda, alteração ou destruição, incluindo criptografia em trânsito, controle de acesso e backups regulares.</p>
        </section>

        <section>
          <h2>8. Retenção</h2>
          <p>Mantemos os dados apenas pelo período necessário às finalidades descritas ou conforme exigido por lei. Após esse prazo, os dados são eliminados ou anonimizados.</p>
        </section>

        <section>
          <h2>9. Cookies</h2>
          <p>Utilizamos cookies essenciais para o funcionamento do site e cookies analíticos para entender o comportamento agregado dos visitantes. Você pode desativá-los no seu navegador.</p>
        </section>

        <section>
          <h2>10. Contato do encarregado (DPO)</h2>
          <p>Para exercer seus direitos ou tirar dúvidas sobre esta política, entre em contato pelo e-mail <a href="mailto:privacidade@gbia.com.br">privacidade@gbia.com.br</a>.</p>
        </section>
      </main>
    </div>
  );
}

export const Route = createFileRoute("/politica-de-privacidade")({
  head: () => ({
    meta: [
      { title: "Política de Privacidade — GB IA" },
      { name: "description", content: "Saiba como a GB IA coleta, usa e protege seus dados pessoais em conformidade com a LGPD." },
      { property: "og:title", content: "Política de Privacidade — GB IA" },
      { property: "og:description", content: "Nossa política de privacidade em conformidade com a LGPD." },
    ],
  }),
  component: PrivacyPage,
});
