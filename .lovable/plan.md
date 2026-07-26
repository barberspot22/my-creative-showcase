## Objetivo

Evitar que o site pareça "quebrado" enquanto carrega, mostrando uma tela de carregamento preta com a logo GB em brilho platinum.

## O que será feito

**1. Novo componente `src/components/Preloader.tsx`**
- Overlay em tela cheia (fundo preto sólido, `position: fixed`, z-index acima de tudo, inclusive do pop-up de cookies).
- Centro: a logo 3D GB (mesma usada em `BrandLogo`), com animação de pulsação suave e um brilho metálico platinum passando por cima (varredura de shimmer em loop).
- Abaixo, uma barra fina de progresso com o mesmo gradiente platinum.
- Saída com fade-out suave (~450ms) e remoção do DOM depois.

**2. Comportamento no carregamento inicial (F5 / acesso direto)**
- Aparece imediatamente na primeira pintura (marcação já presente no HTML raiz para não haver "flash" de página quebrada).
- Some quando: fontes carregadas + imagens da primeira dobra prontas + `window.load`, com tempo mínimo de exibição (~600ms) para não piscar e teto máximo (~4s) para nunca travar a página.

**3. Comportamento na troca de página (Home → E-commerce → GB Studio etc.)**
- Versão mais leve e rápida: overlay entra apenas se a navegação demorar mais que ~150ms, com a logo pulsando, e sai assim que a nova rota renderiza.
- Usa o estado de navegação do roteador para saber quando começa e termina.

**4. Integração**
- Montado em `src/routes/__root.tsx`, antes do `<Outlet />`, junto do `CookieConsent`.
- Estilos adicionados em `src/imported.css` seguindo o padrão platinum já usado no site.
- Respeita `prefers-reduced-motion` (sem shimmer/pulsação, apenas fade).

## Detalhes técnicos

- Sem dependências novas; CSS puro + React.
- SSR-safe: nada de acesso a `window` fora de `useEffect`; o overlay inicial é renderizado no servidor e escondido pelo cliente, evitando hydration mismatch.
- Cookie banner continua com o delay atual, mas só será exibido após o preloader sair.
- Verificação final com Playwright: screenshot do preloader em `/` e checagem de que ele desaparece e não bloqueia cliques.
