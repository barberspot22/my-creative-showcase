# Referências reais e mockups IA nos carrosséis de produtos

Substituir os cards genéricos por galerias de referências que parecem portfólio de web designer: **3 screenshots reais de pequenos negócios brasileiros + 2 mockups de UI gerados por IA** em cada uma das 3 páginas. Isso evita associar a GB IA a marcas gigantes, mantém credibilidade e traz design diferenciado.

## Escopo

Três páginas, três carrosséis, mesmo padrão visual de card tipo "browser frame":

- `/ecommerce`
- `/cardapio-digital`
- `/site-institucional`

## Mix por página (5 cards cada)

### E-commerce (3 reais + 2 IA)

Reais:
- **maduu.com.br** — Bolsas e acessórios autorais (moda)
- **mandacaru.design** — Bolsas, papelaria e ecofriendly (design)
- **biasouzabrand.com.br** — Moda autoral feminina

IA (2 mockups premium):
- Loja de calçados/esportiva dark com fotografia de produto
- Loja de cosméticos/beleza clean com editorial de produto

Meta de cada card: só o segmento (ex.: "Moda autoral", "Design e lifestyle", "Beleza e skincare").

### Cardápio Digital (3 reais + 2 IA)

Reais:
- **nossahamburgueria.com.br** — Hamburgueria com cardápio online
- **olipizza.com.br** — Pizzaria autoral
- **domrufs.com.br** — Pizzaria artesanal

IA (2 mockups premium):
- Cardápio digital de hamburgueria dark com fotos de lanches
- Cardápio digital de café/restaurante clean com destaques

Meta de cada card: só o segmento (ex.: "Hamburgueria", "Pizzaria artesanal", "Café & restaurante").

### Site Institucional (3 reais + 2 IA)

Reais:
- **dignodesign.com.br** — Agência de sites e neurodesign
- **agenciaventura.com.br** — Agência de sites para PME
- **agaia.com.br** — Estúdio de design e comunicação

IA (2 mockups premium):
- Site institucional de consultoria/tech com hero tipográfico
- Site institucional de serviço criativo com fotografia e espaço em branco

Meta de cada card: só o segmento (ex.: "Agência de sites", "Consultoria", "Estúdio criativo").

## Captura dos sites reais

Script Playwright único: viewport 1440x900, `wait_until="networkidle"`, 2s extra para lazy images, tentativa de fechar banners de cookie comuns por seletores CSS (ex.: `#onetrust-consent-sdk`, `.cookie-banner`, `.lgpd`). Screenshot da viewport salvo em `public/references/{categoria}/{slug}.jpg`, JPEG qualidade 85.

Se algum site falhar captura ou estiver fora do ar, substituo por um mockup IA extra.

## Geração dos mockups IA

Usar `imagegen--generate_image` no modelo `premium` (3 ou 4 refs), formato 1440x900 ou similar, salvando em `public/references/{categoria}/mockup-{n}.jpg`. Prompts focados em UI de alta qualidade, estilo editorial, sem texto ilegível — imagens de interface genéricas, profissionais, que pareçam portfólio de Dribbble/Behance.

## Cards (refatoração dos carrosséis)

Criar componente único `ReferenceGallery` reutilizável em `src/components/imported/shared/`.

Layout de cada card:

```
┌─ frame graphite ─────────┐
│ ● ● ●  example.com.br    │  ← barra de endereço mostra domínio real
│ ┌──────────────────────┐ │
│ │                      │ │
│ │   screenshot real    │ │  ← object-fit: cover, object-position: top
│ │   ou mockup IA       │ │
│ │                      │ │
│ └──────────────────────┘ │
└──────────────────────────┘
  Moda autoral              ← meta = só o segmento
```

- Frame escuro `#111`, cantos arredondados, sombra suave.
- Topo estilo browser: 3 dots + barra de endereço com domínio real.
- Imagem ocupa o corpo do card, `object-position: top` para mostrar o hero.
- Meta embaixo: apenas segmento, sem nome de marca, sem "inspirado em".
- Clique em qualquer card abre lightbox borderless com a imagem ampliada (reaproveitar padrão já existente em `PerspectiveTicker`).
- Mantém: loop infinito, drag por dedo/mouse, auto-marquee, snap, clique amortecido durante drag.
- CTA WhatsApp permanece no `FinalCta` ao final de cada página — não dentro do card.

## Arquivos afetados

- **Novo:** `scripts/capture-references.py` — Playwright para capturar sites reais.
- **Novo:** `public/references/ecommerce/*.jpg`, `public/references/cardapio/*.jpg`, `public/references/institucional/*.jpg`.
- **Novo:** `src/components/imported/shared/ReferenceGallery.tsx` — carrossel único reutilizável.
- **Editar:**
  - `src/routes/ecommerce.tsx` — troca `BentoMorphGallery` por `ReferenceGallery` com array de e-commerce.
  - `src/routes/cardapio-digital.tsx` — adiciona `ReferenceGallery` em nova seção depois do hero (antes do `CatalogWidget`).
  - `src/routes/site-institucional.tsx` — troca `PerspectiveTicker` por `ReferenceGallery` com array institucional.
  - `src/imported.css` — adiciona classes do card novo (`refCard`, `refFrame`, `refShot`, `refMeta`, `refAddress`) e remove blocos `commerceSite*` / `perspective*` órfãos.
- **Remover:** `src/components/imported/ecommerce/BentoMorphGallery.tsx` e `src/components/imported/site-institucional/PerspectiveTicker.tsx`.

## Validação

- Playwright: abrir cada rota em 375px e 1280px, screenshot do carrossel, conferir que imagens carregam, drag funciona e clique abre lightbox.
- Build check.

## Ajuste de quantidade

5 cards por página (3 reais + 2 IA). Se quiser variar (4 a 6), é só ajustar o array antes da implementação.
