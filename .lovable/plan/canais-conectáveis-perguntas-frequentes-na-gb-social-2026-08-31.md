# Canais conectáveis + Perguntas frequentes na /gb-social

Duas novas seções visíveis na página do GB Social, antes do CTA final.

## 1. Canais que dá para conectar

Grade de cards com os 11 canais exatamente como listados pela Metricool, sem inventar nenhum:

Instagram, Facebook, TikTok, YouTube, LinkedIn, X (Twitter), Threads, Pinterest, Bluesky, Twitch, Google Business Profile.

- Título: "Publique onde seu público está."
- Cada card: ícone/marca do canal + nome + uma linha curta do que o agente faz ali (post, agendamento, métricas).
- Visual alinhado à paleta atual (grafite, platina e bordô), com hover sutil.
- Mesmo comportamento de arrasto/scroll suave já usado nos outros carrosséis, em grade no desktop.
- CTA de seção usando o componente existente `SectionCta`, com mensagem específica de canais para o WhatsApp.

## 2. Perguntas frequentes

Accordion (abre/fecha, começa recolhido) com as perguntas que já existem no JSON-LD da rota, agora visíveis para o usuário, mais algumas sobre conexão de canais (quais posso conectar, preciso de plataforma nova, quem aprova o post, e assim por diante).

- Uma pergunta aberta por vez, animação suave.
- As mesmas perguntas alimentam o schema de FAQ já configurado, evitando divergência entre o que aparece na tela e o que o Google lê.

## Detalhes técnicos

- Novos componentes: `src/components/imported/gb-social/ChannelGrid.tsx` e `src/components/FaqAccordion.tsx`.
- Fonte única das perguntas: um array exportado usado tanto pelo accordion quanto pelo `faq:` em `seoJsonLd` dentro de `src/routes/gb-social.tsx` (hoje duplicado só no SEO).
- Estilos adicionados em `src/imported.css`, seguindo os tokens de cor existentes.
- Seções recebem `data-section` para poderem ser ocultadas pelo painel /admin, como as demais.
- Ícones dos canais: SVGs inline monocromáticos (sem dependência nova, sem logos externas carregadas de terceiros).
