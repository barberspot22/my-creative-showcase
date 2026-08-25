# GB Social: tirar o WhatsApp do centro e virar a página para gastronomia

## O que muda

**1. Sem "WhatsApp" como canal**
Trocar todas as menções de WhatsApp por "canal de mensagens" / "no chat" / "numa conversa". Isso afeta o título do hero, o subtítulo, a linha de destaque, o bloco "Você não precisa de mais uma ferramenta", o passo a passo, o rodapé e os textos de SEO da página.

Novo hero: "Seu social media agora vive no seu canal de mensagens." com apoio "Crie, agende e analise conteúdo conversando. Sem ferramenta nova, no tom da sua marca."

**2. Primeira conversa começa pedindo post (e depois análise)**
Hoje o celular do hero abre com análise de perfil. A ordem inverte: o cliente pede posts primeiro, o agente responde com o plano/arte, agenda e só então comenta o desempenho do perfil como bônus ("de bônus, seu perfil este mês...").

**3. Animação da conversa**
As mensagens do celular do hero passam a entrar em sequência (uma a uma, com indicador de "digitando" entre elas) e reiniciam em loop, mostrando o ciclo: pedir post → arte pronta → agendar → publicar → resultado. Respeita `prefers-reduced-motion` (mostra tudo estático).

**4. Direcionamento para gastronomia
Mensagens e exemplos passam a ser de restaurante: perfil `@cantinadobairro`, posts de prato do dia, combo de fim de semana, story de bastidor da cozinha, carrossel de cardápio com preço. Os cards de funcionalidades ganham exemplos do segmento (ex.: calendário de almoço executivo, análise de concorrentes de delivery).

**5. Botão do portfólio dentro da própria seção**
O CTA "Quero designs assim" hoje está solto entre seções. Ele passa a ficar dentro da seção "Designs que já saíram daqui", logo abaixo do carrossel, com espaçamento próprio.

**6. Chamada final**
Trocar "Quer 30 dias de conteúdo pronto sem abrir uma ferramenta?" por algo na linha de "Conteúdo saindo toda semana, sem precisar contratar um designer." com subtítulo focado em restaurante.

## Detalhes técnicos

- `src/routes/gb-social.tsx`: reescrita dos textos, nova ordem/roteiro das bolhas do hero, movimentação do `SectionCta` para dentro de `.socialWorkShowcase`, novo `FinalCta`, atualização do `head()` (title/description/og).
- Animação: componente local com `useEffect` + timers revelando as bolhas em sequência e reiniciando; sem biblioteca nova.
- `src/imported.css`: keyframes de entrada das bolhas, classe de estado da animação e espaçamento do CTA dentro da seção de portfólio.
- Sem mudanças de backend, dados ou admin.
