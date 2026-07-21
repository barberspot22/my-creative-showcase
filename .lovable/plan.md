# Ajuste de headline da página E-commerce

## Contexto
A headline atual ("O varejo não morreu. Ele só mudou de endereço.") não soou natural pro usuário. Foi escolhida a opção **"Seu cliente está online. Seu produto também?"** — mais curta, centrada no cliente, e que funciona como a abertura de um vendedor apresentando o produto.

## O que será feito
1. Atualizar o H1 do hero em `src/routes/ecommerce.tsx` para:
   - Linha 1: "Seu cliente está online."
   - Linha 2: "Seu produto também?" (em itálico, mantendo a classe `metallicTitle`)
2. Atualizar o atributo `data-text` para refletir o novo texto.
3. Ajustar o parágrafo seguinte para apoiar a nova abertura, mantendo o tom de vendedor apresentando o serviço.
4. Revisar se meta title/description precisam ser alinhados (provavelmente sim, trocar "Loja, Catálogo, Marketplaces..." por algo mais direto).
5. Rodar build para validar.

## Escopo
- Apenas a página `/ecommerce` (arquivo `src/routes/ecommerce.tsx`).
- Nenhuma mudança estrutural, visual ou de componente. Só copy.

## Resultado esperado
Hero com uma frase que o cliente leia e pense "Opa, é verdade", sem soar como interesse do fornecedor.