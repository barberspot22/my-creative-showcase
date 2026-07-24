## Problema

No desktop, os carrosséis estão "arrastando" apenas ao passar o mouse por cima (hover), sem clicar. O comportamento correto é: só arrastar quando o usuário **clicar e segurar** o botão do mouse (equivalente ao dedo pressionado no mobile).

Causa provável: nos handlers de `onPointerMove`, a checagem que decide iniciar o arraste está reagindo a movimento de ponteiro mesmo sem `pointerdown` confirmado, ou o estado `dragging`/`pending` não está sendo resetado corretamente entre interações. Também é possível que o auto-scroll dos carrosséis esteja sendo interpretado como "arraste ao passar o mouse".

## Escopo

Corrigir em todos os carrosséis com arraste por mouse:
- `src/components/imported/shared/ReferenceGallery.tsx` (institucional, e-commerce, cardápio)
- `src/routes/index.tsx` — `CircleGalleryCarousel` (Home)
- `src/components/imported/ecommerce/BentoMorphGallery.tsx`
- `src/components/imported/gb-social/PerspectiveTicker.tsx`
- `src/components/imported/site-institucional/PerspectiveTicker.tsx`
- `src/components/imported/gb-studio/LookbookGallery.tsx`
- `src/components/ProductSwitcher.tsx`

## Correções

1. **Exigir botão pressionado no `onPointerMove`**: checar `e.buttons === 1` (mouse) antes de mover o scroll. Se o botão não estiver segurado, ignorar o movimento e resetar `dragging`/`pending`.
2. **Só iniciar tracking no `onPointerDown`**: garantir que `startX`/`startScroll` só sejam gravados no down, nunca no move.
3. **Reset defensivo no `pointerleave`/`pointerup`**: zerar `dragging`, `pending`, `moved` para não vazar estado entre interações.
4. **Separar hover de drag**: `onMouseEnter` pode pausar o auto-scroll, mas **não** deve alterar posição. Confirmar que nenhum handler de hover chama `scrollTo`/`scrollLeft`.
5. **Manter comportamento mobile intacto**: touch continua usando scroll nativo com snap; a checagem `e.buttons` só se aplica a mouse/pen.

## Validação

- Playwright desktop: mover o mouse sobre cada carrossel sem clicar → posição do scroll não muda.
- Clicar, segurar e arrastar → carrossel move junto; soltar → snap no card mais próximo.
- Mobile (touch): swipe lateral continua trocando card por card; swipe vertical continua rolando a página.
