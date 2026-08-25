CREATE TABLE IF NOT EXISTS public.secure_settings (
  key text PRIMARY KEY,
  value text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.secure_settings TO service_role;
ALTER TABLE public.secure_settings ENABLE ROW LEVEL SECURITY;