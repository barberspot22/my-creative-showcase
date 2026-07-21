## Ajustes na página Site Institucional

### 1. Headline mais curta e impactante (1ª dobra)

Trocar a headline atual:

> "Seu negócio existe. Só falta ser encontrado com autoridade."

Por uma versão mais curta e direta. Sugestões (escolho a 1ª se não houver preferência):

- **"Só Existir não basta. Precisa ser encontrado." - > quero essa**
- "Seu negócio merece ser visto."
- "Invisível no Google é invisível no mercado."

O subtítulo abaixo mantém o contexto de funil 24h, então a headline pode ficar bem enxuta.

### 2. Reordenar dobras

Mover a seção `**siteWorkShowcase**` (cards em scroll com sites já feitos — `PerspectiveTicker`) para logo depois do hero, virando a **2ª dobra**.

Nova ordem da página:

1. Hero (headline curta)
2. **Showcase — "Já entregamos" (cards em scroll)** ← subiu
3. Problema — "Sem site profissional, você perde antes de conversar"
4. Valor — "Site institucional é vendedor que não dorme"
5. Entregáveis — "O que entregamos"
6. Processo — "Como funciona"
7. FinalCta
8. Footer

### Detalhes técnicos

- Editar `src/routes/site-institucional.tsx`: trocar texto do `<h1>` e reordenar as `<section>`.
- Nenhum CSS novo necessário — `.siteWorkShowcase` já tem estilo próprio e funciona em qualquer posição.
- O eyebrow "JÁ ENTREGAMOS" pode virar "NOSSO PORTFÓLIO" ou permanecer — mantenho "JÁ ENTREGAMOS" salvo indicação contrária.