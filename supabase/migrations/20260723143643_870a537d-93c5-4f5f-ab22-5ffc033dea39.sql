
-- Move has_role out of the exposed public schema so signed-in users can no longer execute it via the Data API.
-- Recreate the admin RLS policy on user_roles inline (no function call), then drop the function.

DROP POLICY IF EXISTS "admins manage roles" ON public.user_roles;

CREATE POLICY "admins manage roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
  )
);

DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);
