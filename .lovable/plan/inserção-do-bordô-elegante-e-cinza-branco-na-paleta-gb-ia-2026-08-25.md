# Inserção do bordô elegante e cinza/branco na paleta GB IA

## Objetivo
Compor a identidade visual do site com um vermelho bordô sofisticado e um tom cinza que vai para branco, mantendo a elegância atual, sem tornar o vermelho dominante (força 3/10).

## O que será feito

### 1. Tokens de cor
- Adicionar no `src/styles.css` as variáveis semânticas:
  - `--bordeaux` (bordô base) e `--bordeaux-light` (acento claro) em `:root` e `.dark`.
  - `--platinum-gray` como tom cinza que evolui para branco, para bordas, fundos sutis e degradês.
- Mapear os tokens no `@theme inline` para uso via Tailwind (`bg-bordeaux`, `text-bordeaux`, etc.).

### 2. CTAs e botões principais
- Atualizar `.sectionCtaButton`, `.contact button` e botões primários das páginas de serviço para usarem bordô como cor de destaque discreta.
- Manter controle de força: fundo semitransparente ou borda bordô, com hover mais intenso.
- Garantir que o texto continue com alto contraste sobre fundos escuros.

### 3. Detalhes e acentos
- Substituir o acento verde-limão (`#c8ff00`) atual dos ícones de serviço (`.lineIcon .iconAccent`) por bordô claro.
- Adicionar bordô em pequenos elementos: badges, indicadores ativos, bordas de cards em hover, ponto do orb do hero.
- Manter o tom sutil para não competir com o preto/cream/platinum principal.

### 4. Hover e interações
- Hover dos botões primários: leve preenchimento bordô e borda brilhante.
- Hover de cards e links: borda ou glow discreto no tom bordô.
- Focus rings e estados ativos migrados para o novo acento.

### 5. Cinza para branco
- Criar variáveis `--platinum-gray` / `--platinum-white` para uso em:
  - textos secundários suaves,
  - bordas de botões e inputs,
  - degradês de fundo em seções de destaque.

### 6. Verificação
- Revisar todas as páginas de serviço e a home para garantir consistência do novo tom.
- Validar contraste e responsividade no preview.