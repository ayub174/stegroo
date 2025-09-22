import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, User, ArrowRight } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/hooks/useAdmin';
import { CreateBlogPostDialog } from '@/components/ui/create-blog-post-dialog';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/ui/header';
import { Footer } from '@/components/ui/footer';
import { useLocation } from 'react-router-dom';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author_name: string;
  category: string;
  image_url: string | null;
  read_time: number;
  published: boolean;
  created_at: string;
}

// Kategorier för filtrering
const categories = ["Alla", "Karriärtips", "Tech & IT", "Marknadsföring", "Vårdpersonal", "Utbildning", "Företagsledning"];

const Blog = () => {
  const { user } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const { toast } = useToast();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("Alla");
  const [email, setEmail] = useState("");
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Check if we're in employer context based on URL params or localStorage
  const searchParams = new URLSearchParams(location.search);
  const isEmployerContext = searchParams.get('context') === 'employer' || 
                           localStorage.getItem('userContext') === 'employer' ||
                           document.referrer.includes('/companies');

  const fetchBlogPosts = async () => {
    try {
      let query = supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      // If user is not admin, only show published posts
      if (!isAdmin) {
        query = query.eq('published', true);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching blog posts:', error);
        toast({
          title: "Fel",
          description: "Kunde inte ladda blogginlägg.",
          variant: "destructive"
        });
        return;
      }

      setBlogPosts(data || []);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      toast({
        title: "Fel",
        description: "Kunde inte ladda blogginlägg.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!adminLoading) {
      fetchBlogPosts();
    }
  }, [isAdmin, adminLoading]);

  // Filtrera blogginlägg baserat på vald kategori
  const filteredPosts = selectedCategory === "Alla" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('sv-SE');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Laddar blogginlägg...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header isEmployerContext={isEmployerContext} />
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-accent/5 to-background border-b border-border/50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Stegroo Blogg
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Karriärtips, branschinsikter och expertråd för att accelerera din professionella utveckling
            </p>
            {isAdmin && (
              <div className="mt-6">
                <CreateBlogPostDialog onPostCreated={fetchBlogPosts} />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Kategorier */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="mb-2"
            >
              {category}
            </Button>
          ))}
        </div>
      </section>

      {/* Blogginlägg */}
      <section className="container mx-auto px-4 pb-16">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              {selectedCategory === "Alla" 
                ? "Inga blogginlägg tillgängliga för tillfället." 
                : `Inga blogginlägg i kategorin "${selectedCategory}".`}
            </p>
            {isAdmin && (
              <div className="mt-6">
                <CreateBlogPostDialog onPostCreated={fetchBlogPosts} />
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="group hover:shadow-card-hover transition-all duration-300 border-border/50 overflow-hidden">
                {post.image_url && (
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={post.image_url} 
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge variant="secondary" className="bg-white/90 text-primary">
                        {post.category}
                      </Badge>
                    </div>
                    {!post.published && isAdmin && (
                      <div className="absolute top-4 right-4">
                        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                          Utkast
                        </Badge>
                      </div>
                    )}
                  </div>
                )}
                <CardContent className="p-6">
                  {!post.image_url && (
                    <div className="mb-3 flex items-center justify-between">
                      <Badge variant="secondary">
                        {post.category}
                      </Badge>
                      {!post.published && isAdmin && (
                        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                          Utkast
                        </Badge>
                      )}
                    </div>
                  )}
                  <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{post.author_name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(post.created_at)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{post.read_time} min läsning</span>
                    </div>
                  </div>
                  <Button variant="ghost" className="group/button p-0 h-auto font-medium text-primary hover:text-primary/80">
                    Läs mer
                    <ArrowRight className="w-4 h-4 ml-1 group-hover/button:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Newsletter Signup */}
      <section className="bg-gradient-to-br from-muted/20 via-background to-muted/30 border-t border-border/50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Håll dig uppdaterad
            </h2>
            <p className="text-muted-foreground mb-8">
              Prenumerera på vårt nyhetsbrev och få de senaste karriärtipsen direkt i din inkorg
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Din e-postadress"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
              />
              <Button>
                Prenumerera
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;