import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './dialog';
import { Button } from './button';
import { Input } from './input';
import { Textarea } from './textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Label } from './label';
import { Switch } from './switch';
import { PlusCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface CreateBlogPostDialogProps {
  onPostCreated: () => void;
}

const categories = [
  'Karriärtips',
  'Tech & IT',
  'Marknadsföring',
  'Vårdpersonal',
  'Utbildning',
  'Företagsledning'
];

export const CreateBlogPostDialog = ({ onPostCreated }: CreateBlogPostDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    imageUrl: '',
    published: true
  });

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      // Get user's profile for display name
      const { data: profile } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('user_id', user.id)
        .single();

      const authorName = profile?.display_name || user.email || 'Admin';
      const readTime = calculateReadTime(formData.content);

      const { error } = await supabase
        .from('blog_posts')
        .insert({
          title: formData.title,
          content: formData.content,
          excerpt: formData.excerpt,
          author_name: authorName,
          author_id: user.id,
          category: formData.category,
          image_url: formData.imageUrl || null,
          read_time: readTime,
          published: formData.published
        });

      if (error) throw error;

      toast({
        title: "Bloggpost skapad!",
        description: "Din bloggpost har skapats framgångsrikt."
      });

      setFormData({
        title: '',
        content: '',
        excerpt: '',
        category: '',
        imageUrl: '',
        published: true
      });
      setOpen(false);
      onPostCreated();
    } catch (error) {
      console.error('Error creating blog post:', error);
      toast({
        title: "Fel",
        description: "Det gick inte att skapa bloggposten. Försök igen.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 text-white">
          <PlusCircle className="w-4 h-4 mr-2" />
          Skriv nytt inlägg
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Skapa ny bloggpost</DialogTitle>
          <DialogDescription>
            Fyll i informationen för din nya bloggpost
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Titel</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ange bloggtitel..."
              required
            />
          </div>

          <div>
            <Label htmlFor="excerpt">Utdrag</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="Ange en kort beskrivning av inlägget..."
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="category">Kategori</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Välj kategori" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="imageUrl">Bild-URL (valfritt)</Label>
            <Input
              id="imageUrl"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <Label htmlFor="content">Innehåll</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Skriv ditt blogginlägg här... Du kan använda **fetstil** och andra markdown-funktioner."
              rows={10}
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="published"
              checked={formData.published}
              onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
            />
            <Label htmlFor="published">Publicera direkt</Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Avbryt
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Skapar...' : 'Skapa inlägg'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};