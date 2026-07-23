import { createFileRoute, Link } from "@tanstack/react-router";
import { BrandLogo } from "@/components/BrandLogo";

function TermsPage() {
  return (
    <div className="legalPage">
      <header className="legalNav">
        <Link to="/"><BrandLogo /></Link>
        <Link to="/" className="legalBack">← Voltar</Link>
      </header>
      <main className="legalContent">
        <p className="legalEyebrow">GB IA · Termos</p>
        <h1>Termos de Uso</h1>
        <p className="legalUpdated">Atualizados em 20 de julho de 2026</p>

        <section>
          <h2>1. Aceitação</h2>
          <p>Ao acessar e utilizar o site e os serviços da GB IA, você declara ter lido, entendido e concordado com estes Termos de Uso e com nossa Política de Privacidade.</p>
        </section>

        <section>
          <h2>2. Serviços oferecidos</h2>
          <p>A GB IA desenvolve sistemas sob medida, automações de processo, agentes de IA autônoma, sites institucionais, e-commerce, CRM, cardápios digitais e conteúdo criativo (GB Studio e GB Social). O escopo específico de cada projeto é definido em proposta comercial dedicada.</p>
        </section>

        <section>
          <h2>3. Uso permitido</h2>
          <ul>
            <li>Você se compromete a utilizar o site de forma lícita e ética;</li>
            <li>É proibido tentar burlar mecanismos de segurança, realizar engenharia reversa ou copiar conteúdo sem autorização;</li>
            <li>É proibido enviar dados falsos nos formulários de contato.</li>
          </ul>
        </section>

        <section>
          <h2>4. Propriedade intelectual</h2>
          <p>Todo o conteúdo do site — textos, imagens, marcas, layout, código e materiais — é de propriedade da GB IA ou licenciado a ela, protegido pela legislação de direitos autorais e propriedade industrial.</p>
        </section>

        <section>
          <h2>5. Limitação de responsabilidade</h2>
          <p>A GB IA se empenha em manter as informações atualizadas, mas não garante disponibilidade ininterrupta do site. Não nos responsabilizamos por danos indiretos decorrentes do uso ou impossibilidade de uso da plataforma.</p>
        </section>

        <section>
          <h2>6. Links externos</h2>
          <p>O site pode conter links para páginas de terceiros. A GB IA não se responsabiliza pelo conteúdo, políticas ou práticas desses sites externos.</p>
        </section>

        <section>
          <h2>7. Alterações</h2>
          <p>Estes termos podem ser atualizados a qualquer momento. Recomendamos consulta periódica. O uso continuado do site após alterações significa aceitação das novas condições.</p>
        </section>

        <section>
          <h2>8. Legislação e foro</h2>
          <p>Estes Termos são regidos pelas leis brasileiras. Fica eleito o foro da comarca de Colatina, ES, para dirimir quaisquer controvérsias.</p>
        </section>

        <section>
          <h2>9. Sites e marcas de terceiros exibidos como referência</h2>
          <p>As imagens e sites mostrados nas seções de referência/portfólio deste site têm finalidade meramente ilustrativa e inspiracional. Parte desses trabalhos é de autoria da GB IA e parte pertence a marcas de terceiros, exibidos apenas para contextualizar o segmento apresentado. A GB IA não reivindica autoria, titularidade ou qualquer direito de propriedade intelectual sobre criações de terceiros. Todas as marcas, logotipos, layouts e conteúdos permanecem de propriedade de seus respectivos titulares. Caso você seja titular de algum material exibido e deseje sua remoção, escreva para <a href="mailto:contato@gbia.com.br">contato@gbia.com.br</a> e providenciaremos a retirada.</p>
        </section>

        <section>
          <h2>10. Contato</h2>
          <p>Dúvidas sobre estes termos podem ser enviadas para <a href="mailto:contato@gbia.com.br">contato@gbia.com.br</a>.</p>
        </section>
      </main>
    </div>
  );
}

export const Route = createFileRoute("/termos-de-uso")({
  head: () => ({
    meta: [
      { title: "Termos de Uso — GB IA" },
      { name: "description", content: "Termos de Uso do site e serviços GB IA: condições de acesso, responsabilidades, propriedade intelectual e uso aceitável da plataforma." },
      { property: "og:title", content: "Termos de Uso — GB IA" },
      { property: "og:description", content: "Condições de uso da plataforma e serviços GB IA." },
    ],
  }),
  component: TermsPage,
});
