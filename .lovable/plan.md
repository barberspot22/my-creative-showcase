## Ajustes na página Site Institucional

**1. Hero (primeira dobra)**
- Reduzir espaçamento superior (padding-top) para o conteúdo subir.
- Reescrever subtítulo mais curto, aceitando o enquadramento de "cartão de visita":
  - De: *"Um site institucional não é cartão de visita. É um funil 24h que apresenta o que você faz, prova que pode confiar e direciona o visitante para o contato — sem depender de algoritmo."*
  - Para: *"Seu cartão de visita digital, aberto 24h. Apresenta, prova autoridade e leva ao contato."*

**2. Segunda dobra (Showcase de sites)**
- Encurtar o título atual para algo direto, ex.: *"Sites que já entregamos."* (eyebrow: "PORTFÓLIO")
- Remover subtítulo longo se houver.

**3. Remover seção "Problema"**
- Apagar completamente o bloco *"Sem site profissional, você perde gente boa"* e seus itens.

**Arquivos afetados**
- `src/routes/site-institucional.tsx` — textos e remoção da seção problema.
- `src/imported.css` — reduzir `padding-top` do hero desta rota (mobile e desktop).

Sem mudanças em lógica ou outras páginas.