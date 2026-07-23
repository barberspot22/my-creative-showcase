## Objetivo
Unificar Textos + Links por página em uma aba "Conteúdo", com pré-visualização ao vivo (ao digitar, sem salvar) espelhando também Home cards e Portfólio.

## Mudanças no Admin (`src/routes/admin.tsx`)
1. **Nova aba "Conteúdo"** substituindo `Textos` e `Links`:
   - Seletor de página (chips com rótulo + rota, mesmo padrão atual).
   - Painel esquerdo (≈ 40%): editor da página selecionada
     - Seção **Textos** — grid de campos padrão (hero_title, hero_subtitle, cta_label, etc.) + chaves customizadas.
     - Seção **Links (CTA)** — `cta_label` + `cta_url` da página (de `page_links`).
     - Seção **Home cards** e **Portfólio** aparecem apenas quando fizer sentido para a rota selecionada (Home mostra cards; rotas de produto mostram itens do portfólio filtrados por `page_key`).
   - Painel direito (≈ 60%): iframe de preview.
2. **Abas restantes**: manter "Home", "Portfólio", "Rastreamento" como estão (as edições continuam funcionando; a nova aba é a superfície unificada por página).

## Preview ao vivo (ao digitar, sem salvar)
- Iframe aponta para a rota selecionada com query `?preview=1`.
- Comunicação via `postMessage` (mesmo origin):
  - Admin envia `{ type: 'lovable-preview', pageKey, texts, link, cards, portfolio }` a cada edição (debounce ~150ms).
  - Rotas do site, quando `preview=1`, escutam a mensagem e sobrepõem os valores em memória, sem gravar no banco.
- Ao salvar, persiste via server functions existentes (`cms-admin.functions.ts`) e o iframe é recarregado para refletir o estado real.

### Camada de overlay no site
- Novo hook `useLivePreview(pageKey)` em `src/lib/livePreview.ts` que:
  - Retorna um `overlay` (texts/link/cards/portfolio) quando `?preview=1` está ativo.
  - Escuta `message` do parent e mantém estado local.
- Ajustar `useSiteText`, `usePageLink`, `useHomeCards`, `usePortfolio` (em `src/lib/cms.ts`) para mesclar dados do banco com o overlay quando presente. Sem `?preview=1`, comportamento inalterado.

## Estilos
- Adicionar em `src/imported.css`: layout split `.admX-contentSplit`, painel de preview `.admX-previewFrame` (borda sutil, cabeçalho com rota e botão "recarregar"), responsivo (empilha em telas < 1024px).

## Não muda
- Schema do banco, RLS, políticas.
- Server functions de escrita.
- SEO/rotas públicas para visitantes normais (overlay só ativa com `?preview=1` no iframe).

## Detalhes técnicos
- `postMessage` restrito a `window.location.origin`.
- Overlay não persiste em `localStorage`; vive só na sessão do iframe.
- Debounce da emissão para evitar re-render excessivo.
- Botão "Descartar alterações" volta ao estado do banco.
