-- Fix security issue: Update function to have immutable search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, account_type, company_name, display_name)
  VALUES (
    NEW.id,
    COALESCE((NEW.raw_user_meta_data ->> 'account_type')::public.account_type, 'private'::public.account_type),
    NEW.raw_user_meta_data ->> 'company_name',
    NEW.raw_user_meta_data ->> 'display_name'
  );
  RETURN NEW;
END;
$$;