
CREATE OR REPLACE FUNCTION public.update_updated_at_column() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Home cards (carrossel da home)
CREATE TABLE public.home_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  title text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  badge text NOT NULL DEFAULT '',
  href text NOT NULL DEFAULT '',
  frames jsonb NOT NULL DEFAULT '[]'::jsonb,
  position int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.home_cards TO anon, authenticated;
GRANT ALL ON public.home_cards TO service_role;
ALTER TABLE public.home_cards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read home_cards" ON public.home_cards FOR SELECT USING (true);
CREATE POLICY "public write home_cards" ON public.home_cards FOR ALL USING (true) WITH CHECK (true);
CREATE TRIGGER trg_home_cards_updated BEFORE UPDATE ON public.home_cards FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Portfolio items (galeria por página)
CREATE TABLE public.portfolio_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key text NOT NULL,
  title text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  link_url text NOT NULL DEFAULT '',
  position int NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX portfolio_items_page_idx ON public.portfolio_items(page_key, position);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.portfolio_items TO anon, authenticated;
GRANT ALL ON public.portfolio_items TO service_role;
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read portfolio" ON public.portfolio_items FOR SELECT USING (true);
CREATE POLICY "public write portfolio" ON public.portfolio_items FOR ALL USING (true) WITH CHECK (true);
CREATE TRIGGER trg_portfolio_items_updated BEFORE UPDATE ON public.portfolio_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Page links (CTAs por página)
CREATE TABLE public.page_links (
  page_key text PRIMARY KEY,
  cta_label text NOT NULL DEFAULT '',
  cta_url text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.page_links TO anon, authenticated;
GRANT ALL ON public.page_links TO service_role;
ALTER TABLE public.page_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read links" ON public.page_links FOR SELECT USING (true);
CREATE POLICY "public write links" ON public.page_links FOR ALL USING (true) WITH CHECK (true);
CREATE TRIGGER trg_page_links_updated BEFORE UPDATE ON public.page_links FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Site texts (copy livre por página, key/value JSON)
CREATE TABLE public.site_texts (
  page_key text PRIMARY KEY,
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_texts TO anon, authenticated;
GRANT ALL ON public.site_texts TO service_role;
ALTER TABLE public.site_texts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read texts" ON public.site_texts FOR SELECT USING (true);
CREATE POLICY "public write texts" ON public.site_texts FOR ALL USING (true) WITH CHECK (true);
CREATE TRIGGER trg_site_texts_updated BEFORE UPDATE ON public.site_texts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Tracking settings (linha única id=1)
CREATE TABLE public.tracking_settings (
  id int PRIMARY KEY DEFAULT 1,
  meta_pixel_id text NOT NULL DEFAULT '',
  meta_capi_enabled boolean NOT NULL DEFAULT false,
  meta_test_event_code text NOT NULL DEFAULT '',
  ga4_measurement_id text NOT NULL DEFAULT '',
  gtm_container_id text NOT NULL DEFAULT '',
  google_ads_id text NOT NULL DEFAULT '',
  google_ads_conversion_label text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT tracking_singleton CHECK (id = 1)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tracking_settings TO anon, authenticated;
GRANT ALL ON public.tracking_settings TO service_role;
ALTER TABLE public.tracking_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read tracking" ON public.tracking_settings FOR SELECT USING (true);
CREATE POLICY "public write tracking" ON public.tracking_settings FOR ALL USING (true) WITH CHECK (true);
CREATE TRIGGER trg_tracking_updated BEFORE UPDATE ON public.tracking_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.tracking_settings (id) VALUES (1) ON CONFLICT DO NOTHING;
