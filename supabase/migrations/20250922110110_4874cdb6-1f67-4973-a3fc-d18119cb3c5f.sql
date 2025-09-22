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

-- Policy for reading published posts (everyone can read)
CREATE POLICY "Anyone can view published blog posts" 
ON public.blog_posts 
FOR SELECT 
USING (published = true);

-- Policy for admins to view all posts (including drafts)
CREATE POLICY "Admins can view all blog posts" 
ON public.blog_posts 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.account_type = 'admin'
  )
);

-- Policy for admins to create posts
CREATE POLICY "Admins can create blog posts" 
ON public.blog_posts 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.account_type = 'admin'
  )
);

-- Policy for admins to update posts
CREATE POLICY "Admins can update blog posts" 
ON public.blog_posts 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.account_type = 'admin'
  )
);

-- Policy for admins to delete posts
CREATE POLICY "Admins can delete blog posts" 
ON public.blog_posts 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.account_type = 'admin'
  )
);

-- Add 'admin' to account_type enum if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'admin' AND enumtypid = 'public.account_type'::regtype) THEN
    ALTER TYPE public.account_type ADD VALUE 'admin';
  END IF;
END
$$;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample blog posts
INSERT INTO public.blog_posts (title, content, excerpt, author_name, author_id, category, image_url, published) VALUES
('5 Tips för en Framgångsrik Jobbansökan', 
'Att söka jobb kan vara en utmanande process, men med rätt strategi kan du öka dina chanser avsevärt. Här är våra bästa tips:

1. **Anpassa ditt CV**: Varje jobbansökan bör ha ett skräddarsytt CV som matchar företagets behov och krav.

2. **Skriv ett övertygande personligt brev**: Berätta varför just du är rätt person för jobbet och vad du kan bidra med.

3. **Förbered dig för intervjun**: Researcha företaget, öva på vanliga intervjufrågor och ha egna frågor redo.

4. **Nätverka aktivt**: Många jobb fylls genom kontakter. Delta i branschträffar och håll kontakt med kollegor.

5. **Följ upp din ansökan**: Ett artigt uppföljningsmail kan visa ditt intresse och få dig att sticka ut.',
'Upptäck de fem viktigaste strategierna för att lyckas med din nästa jobbansökan och öka dina chanser att få drömjobbet.',
'Anna Svensson',
(SELECT id FROM auth.users LIMIT 1),
'Karriärtips',
'/src/assets/career-education-hero.jpg',
true),

('Framtidens Mest Efterfrågade Kompetenser inom Tech', 
'Teknikbranschen utvecklas snabbt och med den förändras också vilka kompetenser som är mest värdefulla på arbetsmarknaden.

**Artificiell intelligens och maskininlärning** kommer att vara avgörande inom de flesta teknikområden. Företag söker personer som kan utveckla, implementera och förvalta AI-lösningar.

**Cloud computing** fortsätter att växa. Kunskaper inom AWS, Azure och Google Cloud Platform är högt värderade.

**Cybersäkerhet** blir allt viktigare när fler verksamheter digitaliseras. Specialister inom informationssäkerhet och ethical hacking är mycket efterfrågade.

**UX/UI Design** är kritiskt för att skapa användarvänliga digitala produkter. Förmågan att förstå användarnas behov och skapa intuitiva gränssnitt är ovärderlig.',
'En djupdykning i vilka tekniska färdigheter som kommer att vara mest värdefulla i framtiden och hur du kan utveckla dem.',
'Erik Johansson',
(SELECT id FROM auth.users LIMIT 1),
'Tech & IT',
'/src/assets/tech-category.jpg',
true),

('Så Bygger du ett Starkt Professionellt Nätverk', 
'Nätverkande är en av de mest effektiva metoderna för karriärutveckling. Men hur bygger man verkligen ett värdefullt nätverk?

**Var autentisk**: Fokusera på att bygga äkta relationer snarare än att bara "samla kontakter". Människor kan känna av när någon bara är ute efter egen vinning.

**Ge innan du tar**: Erbjud din hjälp, dela kunskap och stötta andra i deras mål. Detta skapar goodwill och gör att människor vill hjälpa dig tillbaka.

**Använd sociala medier strategiskt**: LinkedIn är ovärderligt för professionellt nätverkande. Dela relevant innehåll och engagera dig i diskussioner.

**Delta i branschträffar**: Konferenser, meetups och andra evenemang är perfekta tillfällen att träffa likasinnade personer.

**Håll kontakten**: Ett nätverk kräver underhåll. Skicka regelbundna uppdateringar och gratulationer till viktiga kontakter.',
'Lär dig konsten att bygga och underhålla professionella relationer som kan accelerera din karriär.',
'Maria Andersson',
(SELECT id FROM auth.users LIMIT 1),
'Karriärtips',
null,
true);