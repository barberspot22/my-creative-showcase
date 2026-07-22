## Ajustes na galeria de referências + aviso legal

### 1. Corrigir o arrastar lateral no mobile
Arquivo: `src/components/imported/shared/ReferenceGallery.tsx` + `src/imported.css`

O track hoje usa `touch-action: pan-y`, que devolve o gesto horizontal para o navegador e faz o carrossel travar em iOS/Android quando o dedo se move na diagonal. Além disso, o `<button.referenceCardFrame>` interno recebe o pointerdown antes do track, sequestrando o gesto.

- Trocar `touch-action` do `.referenceScrollTrack` para `pan-y pinch-zoom` → na prática usar `touch-action: pan-y` no wrapper e `touch-action: none` no track (ou `pan-x`), garantindo que só o drag horizontal seja controlado pelo JS.
- Adicionar `touch-action: inherit` nos filhos (`.referenceCard`, `.referenceCardFrame`, `img`) e `user-select:none` + `-webkit-user-drag:none` nas imagens.
- No handler de pointer: ignorar `pointerType === "mouse"` já funciona, mas incluir `e.preventDefault()` no `onPointerMove` quando `moved` for true, e liberar o clique só se `!moved`.
- Manter o auto-scroll pausado enquanto o dedo estiver na tela (já existe pausedUntil).

### 2. Limpar a UI de cada card
Arquivo: `src/components/imported/shared/ReferenceGallery.tsx` + `src/imported.css`

- Remover o botão "Falar no WhatsApp" da meta do card (`referenceCardMeta a`) — a CTA global no fim da página já cumpre esse papel.
- Remover a tag verde/dourada `.referenceCardType` do card (tanto do JSX quanto do CSS). Manter apenas o `<small>` do segmento, centralizado.
- Como o `ctaUrl` deixa de aparecer no card, manter a prop apenas para compatibilidade (sem uso visual) — sem alterar as rotas que ainda o passam.

### 3. Aviso legal sobre as referências
Arquivo: `src/routes/politica-de-privacidade.tsx` (e mesmo bloco em `src/routes/termos.tsx`)

Adicionar uma nova seção curta ao final ("11. Sites de referência exibidos"):

> As imagens e sites exibidos nas seções de referência do portfólio têm caráter exclusivamente ilustrativo. Parte deles é de autoria da GB IA e parte pertence a marcas de terceiros, exibidos apenas como inspiração ou para contextualizar o segmento. Não reivindicamos autoria, titularidade ou qualquer direito de propriedade intelectual sobre trabalhos de terceiros. Marcas, logotipos e conteúdos pertencem aos seus respectivos donos. Caso você seja titular de algum material aqui exibido e deseje sua remoção, basta escrever para privacidade@gbia.com.br.

O mesmo texto (ou uma referência a essa seção) entra em `termos.tsx` como cláusula de propriedade intelectual de terceiros.

### Fora de escopo
- Não altero o conteúdo das referências, o lightbox nem o layout das rotas que usam a galeria.
- Não mexo no CTA final (`FinalCta`).
