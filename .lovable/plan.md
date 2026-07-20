## Objetivo

Dois ajustes na primeira dobra da home (`/`):

1. **Parar de cortar o topo do "GB IA" 3D** enquanto o texto/robô giram.
2. **Fazer a segunda dobra (carrossel de produtos) entrar por cima do robô** conforme o scroll — como se o robô fosse "engolido" pela seção seguinte, em vez de simplesmente sumir.

Nenhuma mudança fora dessas duas seções.

---

## Diagnóstico (o que causa o corte hoje)

- `.hero` está com `height:620px; overflow:hidden`.
- Dentro dele, `.gbRobotHero` posiciona o canvas com `top:49%` e `height:620px`, que estoura pra cima do container.
- Como `.hero` tem `overflow:hidden`, o topo do "GB IA" é cortado sempre que a animação empurra a geometria pra cima.

## O que vou mudar

### 1. Corte do "GB IA" (em `src/imported.css`)
- Trocar `.hero { overflow:hidden }` por `overflow:visible` e aumentar levemente a `height` do hero (desktop ~720px, mobile ~640px) pra dar folga vertical ao texto 3D.
- Ajustar `.gbRobotHero .lumusTitleCanvas` reduzindo `top` (ex: `top:42%` desktop / `38%` mobile) e mantendo `height` — assim o baseline do texto sobe alguns px e o topo deixa de encostar no header/nav.
- Garantir que `.lumusReplicaEffect` também fique com `overflow:visible` e sem clip.

### 2. Segunda dobra cobrindo o robô no scroll (em `src/imported.css`)
- Aplicar na `.circleProductSection`:
  - `margin-top: -180px` (mobile `-110px`) pra ela subir e sobrepor a base do hero.
  - `position:relative; z-index:6` pra ficar acima do canvas 3D do hero.
  - Um `::before` no topo com gradiente vertical `linear-gradient(180deg, transparent 0%, rgba(0,0,0,.55) 35%, #050505 100%)`, altura ~220px, `filter: blur(28px)`, posicionado em `top:-140px` — funciona como sombra/tampa que "come" o robô e amarra visualmente as duas dobras.
  - Ajustar o `padding-top` da seção pra compensar a subida (o headline "O futuro molda seu negócio" não pode ficar coberto pelo overlay).
- No `.hero` acrescentar `z-index:1` explícito pra ordem de empilhamento ficar previsível.

### 3. Sem mudanças em JS/TSX
- Nenhuma alteração em `LumusReplicaEffect.tsx`, `index.tsx` ou no carrossel — o efeito é puramente CSS (margem negativa + gradiente + z-index).

## Verificação

- Playwright em `http://localhost:8080/` em viewport mobile (390×844) e desktop (1280×1800):
  - Screenshot da dobra hero → confirmar que o topo do "GB IA" aparece inteiro.
  - Screenshot rolando ~500px → confirmar que o carrossel de produtos aparece sobrepondo a base do robô com sombra suave.
- Comparar com o print enviado pra garantir que o corte no topo sumiu.
