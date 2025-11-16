-- Create table profiles
CREATE TABLE public.profiles (
                                 id          UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
                                 name        TEXT,
                                 role        TEXT,
                                 avatar_url  TEXT,
                                 created_at  TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
                                 updated_at  TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
                                 PRIMARY KEY (id)
);

ALTER TABLE public.profiles
    ENABLE ROW LEVEL SECURITY;

-- Insert a row into public.profiles when user is created
CREATE FUNCTION public.handle_new_user()
    RETURNS trigger
    LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
INSERT INTO public.profiles (id, name, role, avatar_url)
VALUES (
           NEW.id,
           NEW.raw_user_meta_data ->> 'name',
           NEW.raw_user_meta_data ->> 'role',
           NEW.raw_user_meta_data ->> 'avatar_url'
       );

RETURN NEW;
END;
$$;

-- Trigger the function every time a user is created
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_new_user();

-- Delete a row from public.profiles when user is deleted
CREATE FUNCTION public.handle_delete_user()
    RETURNS trigger
    LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
DELETE FROM public.profiles
WHERE id = OLD.id;

RETURN OLD;
END;
$$;

-- Trigger the function every time a user is deleted
CREATE TRIGGER on_auth_user_deleted
    AFTER DELETE ON auth.users
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_delete_user();
