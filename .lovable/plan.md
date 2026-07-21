Repaginação da página **GB Social** para posicioná-lo como o pacote completo de social media via WhatsApp: criação de posts, agendamento, métricas, análise de perfil, concorrência, pesquisa de mercado e calendário editorial. A página deve ser curta, direta, criativa e persuasiva, usando os designs já existentes como principal prova social.

### Diretrizes adotadas (Revenue-Centric Design)

- **Lead com a dor, não com a feature** — abrir no problema de quem precisa estar presente nas redes mas não tem tempo/criatividade para produzir conteúdo todo dia.
- **Especificidade vence decoração** — trocar frases genéricas por resultados concretos (ex: "30 dias de conteúdo pronto em uma conversa").
- **Valor antes do pedido** — mostrar os designs reais antes de pedir o orçamento.
- **Prova do tamanho da promessa** — o carrossel de designs existentes vira a prova central.
- **CTA com microcopy claro** — o botão responde o que acontece, quanto tempo leva e o que custa/engaja.

### Estrutura da nova página

1. **Hero (primeira dobra)**
  - Headline curta, criativa e energética: fala da dor da invisibilidade social e da solução imediata.
  - Subtítulo específico: transforma a ideia de "postar todo dia" em algo que o agente faz pelo WhatsApp.
  - CTA primário: microcopy claro com click-trigger (ex: "Criar 30 dias de postagens").
  - Nota de baixo risco: "100% pelo WhatsApp · sem aprender plataforma".
2. **WhatsApp como central de comando (segunda dobra)**
  - Mantém o bloco claro/escuro com chat demo.
  - Novos exemplos de mensagens refletindo as novas capacidades: pedir post, pedir calendário editorial, pedir análise de métricas, pedir análise de concorrente.
  - Preview de arte real já gerada pelo GB Social.
3. **O que o GB Social faz (terceira dobra)**
  - Grid compacto de 6–7 capacidades:
    - Criação de posts (feed, story, carrossel)
    - Agendamento e publicação
    - Análise de métricas e perfil
    - Análise de concorrentes
    - Pesquisa de mercado
    - Calendário editorial (7, 15 ou 30 dias)
  - Ícones visuais simples, sem textos longos.
4. **Prova social: designs criados (quarta dobra)**
  - Mantém o carrossel `PerspectiveTicker` com os designs existentes.
  - Título curto e persuasivo: "Designs que já saíram do GB Social".
  - Instrução de interação: "arraste para ver · toque para ampliar".
5. **Como funciona (quinta dobra)**
  - Passo a passo enxuto de 4 etapas pelo WhatsApp:
  1. Você pede (post, calendário, análise)
  2. O agente consulta o DNA da marca
  3. Recebe opções e ajusta na conversa
  4. Aprova e publica
6. **CTA final**
  - Reutilizar `FinalCta` com copy específica para GB Social e mensagem de WhatsApp sobre orçamento de social media.

### Ajustes técnicos

- Adicionar `head()` em `src/routes/gb-social.tsx` com title, description, og tags e canonical (hoje a rota não tem metadados próprios).
- Garantir que `usePageLink("gb-social")` continue funcionando com o link de WhatsApp configurado no admin.
- Revisar classes CSS para manter consistência com o restante do site institucional/cardápio.
- Ajustar responsivo: hero, grid de recursos e carrossel devem funcionar bem em mobile.

### Validação

- Build local passando.
- Preview aberto para conferir o fluxo, o carrossel e a responsividade.
- Nenhuma alteração em outras páginas, salvo consistência no `FinalCta` se necessário.