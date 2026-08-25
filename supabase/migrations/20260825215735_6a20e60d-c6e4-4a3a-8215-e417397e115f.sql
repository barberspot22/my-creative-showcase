UPDATE public.portfolio_items
SET title = 'Combo prático',
    description = 'Dois pratos executivos com refrigerante 2L.',
    updated_at = now()
WHERE page_key = 'gb-social' AND position = 15;

UPDATE public.portfolio_items
SET title = 'Jantar em família',
    description = 'Duas parmegianas com Coca-Cola 2L para dividir.',
    updated_at = now()
WHERE page_key = 'gb-social' AND position = 16;
