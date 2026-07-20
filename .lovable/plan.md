## Redesign do painel `/admin` — Papel & Tinta

Trocar totalmente a linguagem visual e a arquitetura de navegação do admin, mantendo 100% da funcionalidade atual (Home Cards, Portfólios, Links, Textos, Rastreamento).

### 1. Nova linguagem visual (paleta clara)

Tokens novos em `src/imported.css`, escopados em `.adminShell` para não vazar no site público:

- `--adm-bg: #f5f3ee` (papel)
- `--adm-surface: #ffffff`
- `--adm-surface-2: #ebe7df` (blocos secundários / hover)
- `--adm-ink: #1a1a1a` (tipografia principal)
- `--adm-ink-soft: #5a564f` (labels, meta)
- `--adm-line: #d9d3c6` (bordas)
- `--adm-gold: #c9a84c` (ação primária / estado ativo)
- `--adm-gold-soft: #f0e4bd` (chips / hover suave)
- `--adm-danger: #a3341f`
- Tipografia: manter Manrope para corpo, adotar **Instrument Serif** só em títulos de página para dar tom editorial coerente com a marca GB IA.
- Sombras suaves em vez de "vidro escuro" (`0 1px 2px rgba(0,0,0,.04), 0 8px 24px -12px rgba(0,0,0,.12)`).

### 2. Nova arquitetura de navegação

Estrutura adaptativa em `src/routes/admin.tsx`:

```text
┌──────────────────────────────────────────────────────┐
│ TopBar: [← Site]  GB IA · Admin        [Salvar] [👁] │
├──────────────┬───────────────────────────────────────┤
│  Sidebar     │  Área do editor                       │
│  (desktop)   │  ┌── breadcrumb ────────────────────┐│
│  ▸ Home      │  │ Home · Cards / Studio            ││
│  ▸ Portfólio │  ├──────────────────────────────────┤│
│  ▸ Links     │  │ Cabeçalho da seção + ajuda curta ││
│  ▸ Textos    │  │                                  ││
│  ▸ Pixel     │  │ Split: [Form 60%] [Preview 40%]  ││
│              │  └──────────────────────────────────┘│
└──────────────┴───────────────────────────────────────┘
```

- **Desktop (≥1024px):** sidebar fixa 260px + topbar com salvar/preview persistentes; split editor+preview lado a lado.
- **Tablet (768–1023px):** sidebar vira barra horizontal de tabs sticky no topo; preview colapsa para baixo do form.
- **Mobile (<768px):** bottom nav fixa com 5 ícones (Home, Portfólio, Links, Textos, Pixel) + botão flutuante "Salvar" à direita. Preview vira aba interna (toggle "Editar / Ver") em cada seção.

### 3. Melhorias de UX por aba

Sem mudar o modelo de dados nem o backend — só a forma de editar:

- **Home · Cards:** lista de cards à esquerda com drag-handle e miniatura; ao selecionar, form à direita. Cada card mostra badge de status ("publicado", "sem imagem"). Botão "Duplicar" e "Ocultar da home".
- **Portfólios:** filtro por página (chips no topo em vez de select), grid de itens em cards com thumb, título, link. Ação "Novo item" fixa como botão CTA dourado. Edição em drawer lateral (desktop) ou modal fullscreen (mobile) — evita perder scroll.
- **Links / CTAs:** agrupados por página com accordion; cada linha tem preview do botão renderizado com o texto atual, ao lado do input. Ícone de link externo abre a página real em nova aba para testar.
- **Textos:** editor chave/valor vira uma tabela com busca no topo (filtra por chave ou conteúdo) + edição inline. Adicionar textareas auto-resize.
- **Rastreamento:** cada provedor (Meta, GA4, GTM, Google Ads) em um card independente com toggle liga/desliga, campo do ID e status "conectado / não configurado". Botão "Testar evento Lead" que dispara um evento fake e mostra ✔/✘ na hora.

### 4. Feedback e estados

- Toast discreto no canto superior direito para "Salvo" / "Erro" — substitui o `useStatus` textual atual.
- Estado "não salvo" (dot dourado) aparece no botão Salvar assim que qualquer campo muda; Cmd/Ctrl+S atalho global dentro do admin.
- Skeleton loaders em vez de "Carregando…" em texto.
- Confirmação inline (não `window.confirm`) ao excluir item de portfólio.

### 5. Detalhes técnicos

- Todo o CSS novo entra em `src/imported.css` sob classes `adm*` novas; classes antigas `admin*` são substituídas na mesma edição. Nada muda em outras rotas.
- `src/routes/admin.tsx` é reescrito mantendo os mesmos imports de `@/lib/cms` e `@/lib/adminLinks` — assinaturas de `fetchHomeCards`, `upsertHomeCards`, etc. não mudam.
- Bottom nav mobile usa `position: fixed` com `env(safe-area-inset-bottom)`.
- Sem novas dependências.

### O que **não** muda

- Modelo de dados no Cloud (tabelas `home_cards`, `portfolio_items`, `page_links`, `site_texts`, `tracking_settings`).
- Comportamento de upload (segue base64 / URL como hoje).
- Integração de tracking (`TrackingScripts`, rota `/api/public/meta-capi`).
- Nada no site público.