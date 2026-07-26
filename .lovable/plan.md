## Objetivo
Substituir as imagens do carrossel "Designs que já saíram daqui" (`/gb-social`) pelas 9 artes enviadas (Perfumaria, Academia x2, Açougue, Moda Jeans, Loja de Celular, Cervejaria, Sorveteria, Peças Automotivas).

## Como funciona hoje
A seção usa `PerspectiveTicker`, que recebe `designs` vindos do CMS (`portfolio_items` com `page_key = "gb-social"`); se vazio, cai em uma lista fixa antiga (`/gb-social-designs/design-XX.png`).

## Passos
1. Subir as 9 imagens como Lovable Assets (CDN), gerando os ponteiros em `src/assets/social/`.
2. Substituir no banco os registros de portfólio de `page_key = "gb-social"` pelas novas 9 imagens (título/segmento por nicho: Perfumaria, Academia, Açougue, Moda Jeans, Loja de Celular, Cervejaria, Sorveteria, Peças Automotivas), mantendo a gestão pelo /admin.
3. Atualizar a lista de fallback em `src/components/imported/gb-social/PerspectiveTicker.tsx` para as novas URLs, para nunca voltar às artes antigas.
4. Validar o carrossel no preview (arraste + lightbox) e checar que as imagens carregam.

Obs.: as artes têm proporção vertical (4:5); o card do ticker já se adapta, mas ajusto o enquadramento se ficar cortado.
