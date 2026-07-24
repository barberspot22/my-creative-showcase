## Problema

Na seção "Uma loja · Todos os canais" (`/ecommerce`), os balões (Site próprio, Mercado Livre, etc.) são posicionados via CSS em pixels absolutos (raio 170px desktop / 100px mobile), mas as linhas pontilhadas são desenhadas num SVG com `viewBox="0 0 400 400"` e raio fixo 170. Como o SVG escala junto com o container (até 520px), as linhas ficam mais longas que os balões — passando por dentro deles ou saindo pra fora. Também começam no centro exato (atrás da esfera "GB IA") em vez de tangenciar a borda.

## Solução

Trocar o SVG por linhas pontilhadas em CSS puro, usando os mesmos raios px dos balões. Cada linha vira um `<span>` absoluto, girado no ângulo do balão, com comprimento = `raioBalão − raioCore`, ancorado na borda do core.

### Passos

1. Em `src/routes/ecommerce.tsx` (`section.commerceOmni`):
   - Remover o `<svg className="commerceOmniLines">`.
   - Renderizar, antes dos nodes, um `<span className="commerceOmniLine">` por canal com `style={{ ["--i"]: i, ["--total"]: channels.length }}`.

2. Em `src/imported.css`:
   - Adicionar `.commerceOmniLine` posicionada em `top/left: 50%`, `transform-origin: 0 50%`, altura `1px`, `background: repeating-linear-gradient(to right, #4a5a52 0 3px, transparent 3px 7px)`.
   - Desktop: `width: calc(170px - 70px)` e `transform: rotate(calc((var(--i) / var(--total)) * 1turn - 0.25turn)) translateX(70px)` (70px = raio do core 140/2).
   - Mobile: sobrescrever com `width: calc(100px - 48px)` e `translateX(48px)`.
   - Remover regras órfãs de `.commerceOmniLines` se houver.

### Resultado

As pontas das linhas encostam exatamente na borda de cada balão e saem da borda do core, em qualquer tamanho de tela.
