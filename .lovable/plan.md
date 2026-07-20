## Plano

1. **Separar rolagem vertical de arraste horizontal**
   - Manter o carrossel sem reagir ao scroll/rolagem vertical.
   - Só ativar o movimento quando o gesto for claramente lateral.
   - No mobile, deixar a página rolar normalmente quando o dedo subir/descer.

2. **Trocar a lógica atual por snap de 1 card por gesto**
   - Durante o arraste, os cards acompanham o dedo/mouse de forma fluida.
   - Ao soltar, avança ou volta no máximo **1 card**.
   - Se o arraste for pequeno, volta para o card atual sem trocar.

3. **Garantir giro infinito nos dois sentidos**
   - As setas e o arraste lateral vão circular pelos cards sem travar no começo/fim.
   - Remover a troca múltipla enquanto o dedo ainda está arrastando, que é o que causa sensação de pulo/travamento.

4. **Ajustar desktop, tablet e mobile com a mesma regra**
   - Usar limites de swipe proporcionais ao tamanho da tela/card.
   - Manter as setas funcionando independente do gesto.
   - Preservar o visual 3D atual, sem mudar a estética da seção.

5. **Validar no preview**
   - Testar arraste para esquerda e direita.
   - Testar setas.
   - Testar rolagem vertical passando pela seção para confirmar que ela não gira sozinha.