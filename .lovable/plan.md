# Corrigir scroll dos carrosséis (horizontal e vertical)

## Problema atual
Vários carrosséis do site implementam drag horizontal manual via `onPointerDown/Move/Up` + `scrollLeft`. Isso causa dois bugs:

1. **Sequestro do scroll vertical no mobile**: como o handler captura o pointer no primeiro toque, o gesto vertical fica preso no carrossel e a página não rola.
2. **Sem snap card-a-card**: o drag solta o scroll em qualquer posição, os cards param "no meio", sem sensação fluida de um-a-um.

Componentes afetados:
- `src/components/imported/ecommerce/BentoMorphGallery.tsx` (e-commerce — templates de site)
- `src/components/imported/shared/ReferenceGallery.tsx` (institucional, e-commerce, cardápio — galeria de referências)
- `src/components/imported/site-institucional/PerspectiveTicker.tsx`
- `src/components/imported/gb-social/PerspectiveTicker.tsx`
- `src/components/imported/gb-studio/LookbookGallery.tsx` (marquee horizontal)
- `src/components/ProductSwitcher.tsx` (sub-header de produtos)
- `src/routes/index.tsx` — CircleGalleryCarousel da home

## Estratégia

Padronizar num único comportamento em todos os carrosséis:

1. **Não sequestrar o gesto vertical**
   - Detectar a direção do gesto nos primeiros ~8px de movimento (`Math.abs(dx) > Math.abs(dy)`).
   - Se o gesto for predominantemente vertical, **não** chamar `preventDefault` nem `setPointerCapture`, e deixar o browser rolar a página normalmente.
   - Só ativar o modo "drag horizontal" quando ficar claro que é horizontal.
   - Usar `touch-action: pan-y` no trilho (permite scroll vertical nativo; o horizontal é feito por nós).

2. **Snap card-a-card fluido**
   - Usar scroll nativo com `scroll-snap-type: x mandatory` no trilho e `scroll-snap-align: center` (ou `start`) em cada card.
   - No fim de um drag/flick, calcular o card mais próximo do centro e chamar `scrollTo({ left, behavior: 'smooth' })` para garantir snap consistente também após um drag longo.
   - Setas ←/→ (quando existirem, ex.: ReferenceGallery) avançam exatamente **1 card** por clique, usando o mesmo cálculo.
   - Suporte a teclado (←/→) na galeria em foco.

3. **Loop infinito**
   - Manter a técnica atual do `BentoMorphGallery` (lista triplicada + reposicionamento silencioso quando cruza 1/3 ou 2/3 da largura) para os que já são infinitos, mas rodando por cima do scroll nativo com snap.

4. **Auto-marquee (BentoMorph, PerspectiveTicker, LookbookGallery)**
   - Continuar rodando via `requestAnimationFrame` incrementando `scrollLeft`.
   - Pausar em `pointerdown`, `focusin`, `mouseenter` e retomar após ~1.5s de inatividade.
   - Nunca chamar durante um drag ativo.

5. **Hook compartilhado**
   - Criar `src/hooks/useSnapCarousel.ts` que encapsula: detecção de direção, drag opcional, snap ao card mais próximo, avançar/retroceder N cards, e integração com auto-marquee.
   - Refatorar cada carrossel para consumir esse hook, mantendo suas classes/markup atuais.

## Alterações por arquivo

- **Novo** `src/hooks/useSnapCarousel.ts` — lógica compartilhada.
- `src/imported.css` — adicionar `scroll-snap-type: x mandatory` + `scroll-snap-align` + `touch-action: pan-y` nos trilhos `.commerceScrollTrack`, `.referenceGallery`, `.siteTickerTrack`, `.socialTickerTrack`, `.lookbookMarquee`, `.productSwitcherTrack`, `.circleProductTrack`.
- Refatorar os 7 componentes listados para usar o hook e remover a lógica manual de `scrollLeft`/`pointercapture` que sequestra o scroll vertical.
- Nas galerias com setas (`ReferenceGallery`), ligar as setas ao "advance by 1".

## Validação
- Rodar Playwright em mobile viewport (393×542) e verificar via script:
  - swipe vertical na área do carrossel rola a página.
  - swipe horizontal move ~1 card por gesto curto e faz snap.
  - clique nas setas avança exatamente 1 card.
- Screenshots antes/depois em Home, /ecommerce, /site-institucional, /cardapio-digital, /gb-studio, /gb-social.

## Fora do escopo
Nenhuma mudança de copy, layout, cores ou conteúdo dos cards — apenas comportamento de scroll/snap.
