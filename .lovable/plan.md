## Objetivo
Trocar a seção atual "O que fazemos" (Sistemas & Sites / GB Social / etc.) por uma **trilha do processo** no estilo mapa do tesouro, mostrando como a GB IA conduz o cliente do problema até a solução entregue.

## Conceito visual: Mapa do tesouro
Um caminho sinuoso (SVG) atravessa a seção verticalmente, com 4 marcos (pinos luminosos) posicionados alternadamente à esquerda e direita da trilha. O caminho tem traço pontilhado dourado/platinado (herda a paleta metálica do site), com brilho suave. Ao rolar a página, o traço "se desenha" progressivamente e cada marco aparece com fade + leve zoom quando entra na viewport (IntersectionObserver, sem lib externa). O tesouro final (X) é o CTA.

## Etapas da trilha
```text
   ①  Diagnóstico       (ícone: lupa)
        \
         ②  Proposta sob medida   (ícone: pergaminho/blueprint)
        /
   ③  MVP / Prova de valor        (ícone: foguete)
        \
         ④  Entrega & evolução    (ícone: troféu)
              ↓
            [X] CTA — Começar minha trilha
```

Cada marco mostra:
- Número da etapa (01–04) em tipografia display
- Ícone temático (Lucide: `Search`, `ScrollText`, `Rocket`, `Trophy`)
- Título curto
- Mini descrição do que o cliente **recebe** naquela etapa:
  1. **Diagnóstico** — "Sessão de escuta + relatório do gargalo e das oportunidades."
  2. **Proposta sob medida** — "Escopo, stack e cronograma desenhados para o seu caso."
  3. **MVP / Prova de valor** — "Protótipo navegável em dias, para validar antes de escalar."
  4. **Entrega & evolução** — "Sistema em produção, acompanhamento e melhorias contínuas."

## CTA final
Ao fim da trilha, um marco "X" (tesouro) com botão pill futurista: **"Começar minha trilha →"** — usa o mesmo sistema de `adminLinks` (nova chave `trilhaCta`) para o admin poder editar destino e label.

## Implementação técnica
- **Novo componente**: `src/components/imported/ProcessTrail.tsx`
  - SVG path sinuoso responsivo (viewBox flexível, path diferente em mobile — mais vertical/reto — e desktop — zigue-zague).
  - `IntersectionObserver` marca cada etapa como visível → CSS controla animação (fade-up + glow no pino).
  - Progresso do path animado via `stroke-dasharray` + `stroke-dashoffset` interpolado pelo scroll (`window.scrollY` relativo ao offsetTop da seção, sem dependências).
- **CSS**: adicionar bloco `.processTrail` em `src/imported.css` (paleta ouro/platina existente, sem novos tokens). Sem `overflow:hidden` no wrapper para não cortar glows.
- **Rota `src/routes/index.tsx`**:
  - Remover a seção atual "O que fazemos" (grid/carousel de Sistemas & Sites, GB Social, etc.) e o CSS órfão associado (`.whatWeDo*`).
  - Renderizar `<ProcessTrail/>` no mesmo lugar, mantendo a ordem das dobras.
- **AdminLinks**: adicionar chave `trilhaCta` em `src/lib/adminLinks.ts` (default: `/#briefing`, label "Começar minha trilha") e novo campo na aba "Links de botões" em `src/routes/admin.tsx`.

## Fora do escopo
- Não altero hero, carrossel de produtos, site institucional, cardápio, rodapé.
- Não crio nova rota — a trilha vive na home.
- Sem novas libs (animação/scroll feitos com IntersectionObserver + CSS puro).

## Resultado esperado
Seção nova, com identidade GB IA (metálico + dourado), narrando visualmente o método da agência como uma jornada, terminando em CTA acionável e configurável pelo admin.