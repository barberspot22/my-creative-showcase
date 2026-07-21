## Ajuste na hero do /site-institucional

**1. Headline nova (benefício):**
- De: "Só existir não basta."
- Para: "Presença digital que **transforma visita em cliente.**"
  (a segunda linha em destaque metálico, mantendo o quebra-linha no mobile)

**2. Texto de apoio:**
- Mantém: "Seu cartão de visita digital, aberto 24h. Apresenta, prova autoridade e leva ao contato."
- Ajuste visual: limitar largura ao mesmo `max-width` da headline (não pode mais esticar até 760px isolado). Vou alinhar ambos em `max-width: 780px` no desktop para o parágrafo acompanhar a caixa da headline, mantendo respiro no mobile.

### Arquivos
- `src/routes/site-institucional.tsx` — trocar o `<h1>` e manter o `<p>` de apoio.
- `src/imported.css` — ajustar `.siteProductHero h1` (max-width) e `.siteProductHero > p:not(.studioEyebrow)` (max-width igual à headline).

Sem mexer em outras seções.