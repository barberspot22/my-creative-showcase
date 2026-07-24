## Plano

1. **Ajustar só o carrossel principal da Home**
   - Refinar a lógica do `CircleGalleryCarousel` em `/` para o gesto vertical da página não ser interpretado como arraste lateral.
   - O código atual decide o gesto com limites muito sensíveis (`dy > 6` e `dx > 12`) e aplica transformações pesadas nos cards durante o movimento.

2. **Deixar o dedo rolar a página com prioridade**
   - No mobile, só ativar o carrossel quando o movimento for claramente horizontal.
   - Se o usuário começar a deslizar com qualquer intenção vertical, liberar imediatamente o scroll normal da página.

3. **Suavizar o movimento lateral**
   - Reduzir trabalho visual durante o drag, especialmente efeitos como `filter/blur/grayscale` que podem causar travadinhas em celular.
   - Manter o snap de 1 card por vez, mas com transição mais natural ao soltar o dedo.

4. **Ajustar CSS de toque**
   - Revisar `touch-action` do carrossel para favorecer `pan-y` sem bloquear a rolagem vertical.
   - Garantir que imagens/cards não capturem gestos indevidamente.

5. **Validar no preview mobile**
   - Simular swipe vertical e horizontal em viewport mobile.
   - Confirmar que: rolar a página fica fluido, arrastar lateral troca card, e clique no card continua entrando na página.