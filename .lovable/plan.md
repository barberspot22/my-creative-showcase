## Diagnóstico

Tempos atuais no `Preloader`:
- mínimo visível: 600 ms
- teto de segurança: 4000 ms
- fade de saída: 450 ms

Enquanto está visível, a classe `gb-preloading` aplica `overflow:hidden !important` no html/body e o overlay cobre a tela inteira com z-index máximo.

Ele só some quando as fontes terminam **e** o evento `window.load` dispara. `load` espera TODAS as imagens, iframes (as prévias de sites de referência) e scripts de rastreamento. Se qualquer um demorar, a página fica bloqueada até o teto de 4 s. E como o teto só começa a contar depois que o React hidrata, em conexões lentas o bloqueio pode passar de 4 s.

## O que será feito

1. **Sair na hidratação, não no `load`**: assim que o React monta e o primeiro frame é pintado, o preloader começa a sair. Fontes e `load` deixam de ser condição obrigatória.
2. **Reduzir tempos**: mínimo visível de 600 ms para ~350 ms, teto de segurança de 4000 ms para ~2000 ms, fade de 450 ms para ~300 ms. Total típico: ~0,65 s.
3. **Teto que não depende do React**: um pequeno script inline no HTML remove a classe `gb-preloading` e esconde o overlay após 2,5 s mesmo que o JS do app falhe ou demore, garantindo que a página nunca fique presa.
4. **Nunca bloquear cliques na saída**: `pointer-events: none` e liberação do scroll aplicados no início do fade, não no fim.
5. **Overlay de troca de rota**: aumentar o atraso de 150 ms para ~250 ms para não piscar em navegações rápidas, e nunca travar o scroll nesse modo.

## Detalhes técnicos

- Arquivos: `src/components/Preloader.tsx`, `src/imported.css`, `src/routes/__root.tsx` (script inline de segurança).
- Sem novas dependências; SSR-safe (nada de `window` fora de efeito, exceto o script inline no documento).
- Verificação com Playwright: medir o tempo até o overlay sumir em `/`, `/ecommerce` e `/gb-studio`, e confirmar que o scroll e os cliques voltam a funcionar.
