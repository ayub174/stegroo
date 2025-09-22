-- Create blog_posts table
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  author_name TEXT NOT NULL,
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  read_time INTEGER DEFAULT 5,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check admin status
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.account_type = 'admin'
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

-- Policy for reading published posts (everyone can read)
CREATE POLICY "Anyone can view published blog posts" 
ON public.blog_posts 
FOR SELECT 
USING (published = true);

-- Policy for admins to view all posts (including drafts)
CREATE POLICY "Admins can view all blog posts" 
ON public.blog_posts 
FOR SELECT 
USING (public.is_admin());

-- Policy for admins to create posts
CREATE POLICY "Admins can create blog posts" 
ON public.blog_posts 
FOR INSERT 
WITH CHECK (public.is_admin());

-- Policy for admins to update posts
CREATE POLICY "Admins can update blog posts" 
ON public.blog_posts 
FOR UPDATE 
USING (public.is_admin());

-- Policy for admins to delete posts
CREATE POLICY "Admins can delete blog posts" 
ON public.blog_posts 
FOR DELETE 
USING (public.is_admin());

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();