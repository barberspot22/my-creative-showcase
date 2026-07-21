## Objetivo
Facilitar a navegação entre as páginas de produto adicionando um **menu horizontal deslizável** (rola lateralmente com dedo/mouse) presente em todas as páginas internas, mostrando todos os produtos em pílulas — o produto atual fica destacado.

## Onde aparece
Em todas as páginas de produto:
- `/site-institucional`
- `/cardapio-digital`
- `/ecommerce`
- `/crm`
- `/gb-social`
- `/gb-studio`

Posição: **logo abaixo do cabeçalho**, antes do hero. Grudado no topo (sticky) ao rolar, para o usuário poder pular pra outro produto a qualquer momento.

## Visual
Estética coerente com o resto do site (minimal, platinum, tech):

```text
┌────────────────────────────────────────────────────────────────────┐
│  NOSSOS PRODUTOS →                                                 │
│  ● Site Institucional   ○ Cardápio   ○ E-commerce   ○ CRM   ○ …   │  ← rola lateral
└────────────────────────────────────────────────────────────────────┘
```

- Barra fina (~56px altura), fundo `#08080a` com borda 1px `#ffffff10` embaixo.
- Cada item é uma **pílula** com nome do produto, borda 1px platinum sutil.
- Item ativo: borda dourada `#c9a84c`, texto branco.
- Itens inativos: cinza `#9a9a9a`, hover ilumina.
- Scroll horizontal nativo, com `scroll-snap`, esconde scrollbar, `mask` fade nas laterais para indicar continuação.
- Arrasta com o dedo (mobile) e com o mouse (drag-to-scroll) no desktop.

## Componente
Criar `src/components/ProductSwitcher.tsx`:
- Lista fixa dos 6 produtos com `{ key, label, href }`.
- Prop `current: PageKey` para destacar o ativo.
- Auto-scroll para centralizar o item ativo ao montar.
- Drag-to-scroll (pointer events) no desktop; touch nativo no mobile.
- Link do item ativo é não-clicável (só visual).

## CSS
Adicionar em `src/imported.css` classes `.productSwitcher`, `.productSwitcherTrack`, `.productSwitcherItem`, `.productSwitcherItem.active`, com mask-gradient nas bordas e `scrollbar-width: none`.

## Integração
Em cada uma das 6 páginas, inserir `<ProductSwitcher current="..." />` logo após o `<header className="studioNav …">` e antes do primeiro `<section>` do hero. Nada mais muda — heróis, seções e CTA final ficam intactos.

## Fora do escopo
- Não mexer no cabeçalho principal (hamburger continua igual).
- Não adicionar na home (`/`) — lá os cards do carrossel já cumprem esse papel.
- Sem alteração no admin.