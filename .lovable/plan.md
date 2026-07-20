## Objetivo

Ajustar o `CatalogWidget` em `/cardapio-digital` para: (1) ocupar toda a largura do box da seção (sem moldura estreita de celular no desktop), (2) mostrar 4 produtos na grade da home em vez de 2, e (3) alinhar o visual ao restante do site (paleta grafite + dourado metálico, tipografia e sombras já usadas), removendo os tons laranja/roxo do mockup original.

## Alterações

### 1. `src/components/imported/cardapio-digital/CatalogWidget.tsx`
- Adicionar mais 2 produtos ao array `PRODUCTS` da categoria "salgados" (ex.: "Parmegiana Trufada" e "Ravioli de Costela") para que a aba padrão exiba 4 cards. Adicionar também +2 em "doces" para manter simetria ao trocar a aba.
- Manter estrutura da grade (a mudança visual para 4 colunas/2×2 é via CSS).
- Trocar emojis do banner/brand para algo mais neutro alinhado ao site (ex.: sem 🔥; usar um selo metálico).

### 2. `src/imported.css` — reestilizar o bloco `menuCatalog*`
- **Layout/largura**: `.menuCatalogFrame` passa a ter `width: 100%`, `max-width: 100%`, sem rotação/mockup de celular. Remove `menuCatalogNotch` visualmente (display none) para não parecer um iPhone.
- **Grade home**: `.menuCatalogGrid` vira `grid-template-columns: repeat(4, 1fr)` no desktop e `repeat(2, 1fr)` no mobile (≤760px), exibindo os 4 produtos lado a lado no desktop e 2×2 no mobile.
- **Paleta/estética site oficial**:
  - Fundo do widget: `#0b0b0d` com borda `1px solid rgba(255,255,255,.08)`, sombra profunda igual aos cards existentes.
  - Acentos dourados (`#d4b57a` / gradient champagne) já usados no card institucional, substituindo laranja (`PEDIR AGORA`, chip ativo, botão "Adicionar ao carrinho", badge "PROMO").
  - Badge "NOVO" em prata/platinum (mesmo gradient da headline); "PROMO" em dourado com `-20%`.
  - Chips/topbar/tabbar com `background: rgba(255,255,255,.04)`, texto `rgba(255,255,255,.72)`, ativo com borda dourada fina.
  - Tipografia: usar as mesmas famílias do site (herdadas), com `letter-spacing` sutil nos labels em caixa alta.
- **Detalhe do produto**: mesmos tokens (fundo grafite, botão CTA gradient dourado, seletor de tamanho com estado ativo dourado, toast com dot verde neon já usado no site).
- **Mobile**: banner mais compacto, grid 2×2, altura dos cards ajustada para o novo container full-width.

## Fora do escopo
- Não mexer em outras seções da página nem em outras rotas.
- Sem novos assets (mantém emojis grandes como placeholder de imagem).
- Sem alteração de lógica (swipe, carrinho real, backend).