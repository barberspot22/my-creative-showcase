CREATE TABLE public.section_visibility (
  page_key text NOT NULL,
  section_key text NOT NULL,
  visible boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (page_key, section_key)
);

GRANT SELECT ON public.section_visibility TO anon, authenticated;
GRANT ALL ON public.section_visibility TO service_role;

ALTER TABLE public.section_visibility ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read section_visibility"
  ON public.section_visibility FOR SELECT
  TO public USING (true);

CREATE POLICY "service role write section_visibility"
  ON public.section_visibility FOR ALL
  TO service_role USING (true) WITH CHECK (true);