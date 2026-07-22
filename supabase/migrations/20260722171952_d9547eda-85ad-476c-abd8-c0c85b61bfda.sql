
-- home_cards
DROP POLICY IF EXISTS "public write home_cards" ON public.home_cards;
CREATE POLICY "service role write home_cards" ON public.home_cards
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- page_links
DROP POLICY IF EXISTS "public write links" ON public.page_links;
CREATE POLICY "service role write links" ON public.page_links
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- portfolio_items
DROP POLICY IF EXISTS "public write portfolio" ON public.portfolio_items;
CREATE POLICY "service role write portfolio" ON public.portfolio_items
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- site_texts
DROP POLICY IF EXISTS "public write texts" ON public.site_texts;
CREATE POLICY "service role write texts" ON public.site_texts
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- tracking_settings
DROP POLICY IF EXISTS "public write tracking" ON public.tracking_settings;
CREATE POLICY "service role write tracking" ON public.tracking_settings
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Revoke anon/authenticated write grants (leave SELECT alone)
REVOKE INSERT, UPDATE, DELETE ON public.home_cards FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.page_links FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.portfolio_items FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.site_texts FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.tracking_settings FROM anon, authenticated;
