
# Painel Admin completo + Tracking

Reformar o `/admin` em um painel real, com edições persistidas no Lovable Cloud (aparecem para todos os visitantes) e uma central de rastreamento (Meta Pixel, Meta Conversion API, GA4, GTM).

> Observação de segurança: você escolheu deixar `/admin` público (sem login). Isso significa que qualquer pessoa que descobrir a URL poderá editar textos, imagens e IDs de tracking. Recomendo trocar para login com papel admin depois — deixo pronto pra plugar quando quiser.

## 1. Backend (Lovable Cloud)

Ativar Lovable Cloud e criar as tabelas:

- `site_content` — textos por página/seção (key/value JSON). Uma linha por `page_key` (ex.: `home`, `gb-social`, `site-institucional`, `ecommerce`, `cardapio-digital`, `gb-studio`, `crm`) contendo `{ hero, sections, ctas, meta }`.
- `portfolio_items` — galerias/portfólio por página. Colunas: `id`, `page_key`, `title`, `description`, `image_url`, `link_url`, `position`, `visible`.
- `home_cards` — cards do carrossel da home (migra o que hoje está no localStorage `gbia.caseCards.v4`): `id`, `key`, `title`, `description`, `badge`, `href`, `frames` (array), `position`.
- `page_links` — CTAs por página (migra `gbia.pageLinks.v1`): `page_key`, `cta_label`, `cta_url`.
- `tracking_settings` — linha única com: `meta_pixel_id`, `meta_capi_enabled`, `meta_test_event_code`, `ga4_measurement_id`, `gtm_container_id`, `google_ads_id`, `google_ads_conversion_label`.

Bucket público de Storage `portfolio` para upload de imagens (substitui os base64 pesados de hoje).

RLS: `SELECT` público em todas as tabelas de conteúdo; `INSERT/UPDATE/DELETE` liberado (por escolha sua de não usar auth) — deixo comentário na migration marcando o que trocar quando ligar login.

Secret backend: `META_CAPI_ACCESS_TOKEN` (para Conversion API server-side).

## 2. Painel `/admin` — nova estrutura

Sidebar com abas:

1. **Home** — edita cards do carrossel (o que já existe, agora persistido no Cloud). Upload de imagem vai para Storage, não base64.
2. **Portfólio** — sub-abas por página (Social, Site Institucional, E-commerce, Cardápio, Studio, CRM). Em cada uma:
   - Lista drag-to-reorder de itens do portfólio (thumb, título, descrição, link, visível on/off).
   - Botões: adicionar item, upload de imagem, remover.
3. **Textos** — sub-abas por página. Formulário estruturado (hero title, hero subtitle, bullets, seções, CTA). Prévia lado a lado.
4. **Links dos botões** — o que já existe hoje, migrado.
5. **Tracking** — formulário único com:
   - Meta Pixel ID + toggle "ativar"
   - Meta CAPI: toggle + Test Event Code + botão "Configurar Access Token" (abre fluxo do `add_secret`)
   - GA4 Measurement ID
   - GTM Container ID
   - Google Ads ID + Conversion Label
   - Botão "Enviar evento de teste" para cada integração ativa.
6. **SEO** (bônus leve) — título/descrição por página, já que estamos mexendo em conteúdo.

Topbar com Status + Salvar/Restaurar; toast quando salvar.

## 3. Como o site consome tudo

- Um `SiteContentProvider` no `__root.tsx` carrega `site_content`, `home_cards`, `page_links` e `tracking_settings` via server function (SSR-friendly, cacheado no TanStack Query).
- Cada página lê os campos do provider e cai no default hardcoded se o Cloud estiver vazio (nada quebra durante a migração).
- Componentes de galeria (`PerspectiveTicker` do gb-social, `LookbookGallery` do studio, `BentoMorphGallery` do ecommerce, `FanGallery` do cardápio, ticker do site-institucional) passam a receber os itens de `portfolio_items` — mantêm os defaults atuais como fallback.

## 4. Tracking — implementação

Em `__root.tsx`, um `<TrackingScripts />` client-side lê `tracking_settings` e injeta:

- **Meta Pixel**: script fbq com `init(pixelId)` + `track('PageView')`. Hook `useMetaPixel().track(event, params)` disponibiliza `Lead`, `Contact`, `ViewContent`.
- **GA4**: `gtag.js` com o measurement ID + `gtag('config', id)` + `gtag('event', name, params)`.
- **GTM**: snippet padrão head + noscript no body.
- **Google Ads**: reusa gtag; conversão via `gtag('event', 'conversion', { send_to: 'AW-.../label' })`.

CTAs principais (Home "Falar com a equipe", WhatsApp de cada página, botões do portfólio) chamam um helper `trackConversion('lead', { source })` que dispara em todas as ferramentas ativas de uma vez.

**Meta CAPI (server-side)**: server route `POST /api/public/meta-capi` com HMAC de proteção mínima (secret compartilhado no client via env pública + hash do evento, para não ser aberto totalmente). Envia para `graph.facebook.com/v19.0/{pixelId}/events` com hash SHA-256 de email/telefone quando disponível, `event_id` compartilhado com o pixel client (dedup), `test_event_code` quando configurado.

## 5. Migração dos dados atuais

Ao abrir `/admin` pela primeira vez após o deploy, um botão "Importar edições antigas do navegador" lê `localStorage` (`gbia.caseCards.v4`, `gbia.pageLinks.v1`) e faz upsert no Cloud. Uma vez importado, o localStorage vira apenas cache.

## Detalhes técnicos

- Tabelas com `updated_at` trigger; `home_cards`/`portfolio_items` com `position int` para ordenação.
- Server functions em `src/lib/admin.functions.ts`: `getSiteContent`, `saveSiteContent`, `listPortfolioItems`, `upsertPortfolioItem`, `deletePortfolioItem`, `reorderPortfolioItems`, `saveHomeCards`, `savePageLinks`, `getTrackingSettings`, `saveTrackingSettings`, `sendCapiTestEvent`.
- Upload: server function assina URL de upload no bucket `portfolio` (evita expor service role no client).
- Provider client-side com TanStack Query (`staleTime: 60_000`) + `router.invalidate()` após salvar no admin.
- SSR: `site_content` e `tracking_settings` no loader do `__root` para não haver flash sem pixel/GA no PageView inicial.
- `og:image` e meta continuam nos `head()` das rotas, mas title/description passam a puxar do Cloud com fallback ao valor atual.

## Estrutura de arquivos (novos/alterados)

```text
supabase/migrations/xxxx_admin_cms.sql
src/lib/admin.functions.ts
src/lib/tracking.ts                 (helpers trackConversion, useTracking)
src/components/TrackingScripts.tsx
src/components/SiteContentProvider.tsx
src/routes/admin.tsx                (reescrito, com abas)
src/routes/admin/-components/*      (HomeCardsPanel, PortfolioPanel, TextsPanel, LinksPanel, TrackingPanel)
src/routes/api/public/meta-capi.ts
src/routes/__root.tsx               (monta provider + TrackingScripts)
```

## Fora do escopo desta rodada

- Login/proteção do `/admin` (você optou por público agora; deixo TODO comentado).
- Editor visual WYSIWYG das seções — usaremos formulário estruturado.
- Multi-idioma.

Confirmando isso, sigo para build: ativo o Lovable Cloud, crio as tabelas, migro os dados do localStorage e entrego o painel + tracking numa única rodada.
