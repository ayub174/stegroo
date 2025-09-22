import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/ui/header";
import { Calendar, User, Clock } from "lucide-react";

const blogPosts = [
  {
    id: 1,
    title: "Så skriver du ett vinnande CV 2024",
    excerpt: "Lär dig skriva ett CV som sticker ut från mängden och får arbetsgivare att vilja träffa dig. Vi går igenom de senaste trenderna och vad som verkligen räknas.",
    author: "Maria Andersson",
    date: "2024-01-15",
    readTime: "5 min läsning",
    category: "CV & Ansökningar",
    image: "/api/placeholder/400/200"
  },
  {
    id: 2,
    title: "Intervjutips för nervösa kandidater",
    excerpt: "Känner du dig nervös inför jobbintervjuer? Här får du konkreta tips för att hantera nervositet och framstå som självsäker och kompetent.",
    author: "Johan Eriksson",
    date: "2024-01-12",
    readTime: "7 min läsning",
    category: "Intervjuer",
    image: "/api/placeholder/400/200"
  },
  {
    id: 3,
    title: "Branschguide: Tech-jobb i Sverige",
    excerpt: "En omfattande guide till tech-branschen i Sverige. Vilka roller är mest efterfrågade, vilka kompetenser behövs och vilka löner kan du förvänta dig?",
    author: "Anna Lindberg",
    date: "2024-01-10",
    readTime: "12 min läsning",
    category: "Branschguider",
    image: "/api/placeholder/400/200"
  },
  {
    id: 4,
    title: "LinkedIn-profil som lockar rekryterare",
    excerpt: "Optimera din LinkedIn-profil för att synas bättre i sökningar och attrahera rätt typ av jobbmöjligheter. Konkreta exempel och mallar inkluderade.",
    author: "David Svensson",
    date: "2024-01-08",
    readTime: "8 min läsning",
    category: "Närvaro på nätet",
    image: "/api/placeholder/400/200"
  },
  {
    id: 5,
    title: "Löneförhandling - Så får du det du förtjänar",
    excerpt: "Lär dig att förhandla om lön på ett professionellt sätt. Vi täcker förberedelser, timing, argument och hur du hantera motargument från arbetsgivaren.",
    author: "Lisa Karlsson",
    date: "2024-01-05",
    readTime: "10 min läsning",
    category: "Karriärutveckling",
    image: "/api/placeholder/400/200"
  },
  {
    id: 6,
    title: "Distansarbete - Så lyckas du som remote worker",
    excerpt: "Allt fler jobb erbjuder möjlighet till distansarbete. Här får du tips på hur du kan vara produktiv, hålla kontakten med kollegor och skapa balans hemma.",
    author: "Peter Olsson",
    date: "2024-01-03",
    readTime: "6 min läsning",
    category: "Arbetsliv",
    image: "/api/placeholder/400/200"
  }
];

const categories = [
  "Alla kategorier",
  "CV & Ansökningar", 
  "Intervjuer",
  "Branschguider",
  "Närvaro på nätet",
  "Karriärutveckling",
  "Arbetsliv"
];

export default function Blog() {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Karriärblogg
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Få de senaste tipsen och råden för att utveckla din karriär. Allt från CV-skrivning till intervjuteknik och branschinsikter.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {categories.map((category) => (
            <Badge 
              key={category}
              variant={category === "Alla kategorier" ? "default" : "secondary"}
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <Card key={post.id} className="group hover:shadow-card-hover transition-all duration-300 cursor-pointer">
              <div className="relative h-48 overflow-hidden">
                <div className="w-full h-full bg-gradient-subtle flex items-center justify-center">
                  <span className="text-muted-foreground text-sm">Bloggbild</span>
                </div>
                <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                  {post.category}
                </Badge>
              </div>
              
              <CardHeader>
                <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                  {post.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(post.date).toLocaleDateString('sv-SE')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
                
                <Button variant="outline" size="sm" className="w-full">
                  Läs mer
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Ladda fler artiklar
          </Button>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 bg-card rounded-lg p-8 text-center border border-border/50">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Få karriärtips direkt i din inkorg
          </h2>
          <p className="text-muted-foreground mb-6">
            Prenumerera på vårt nyhetsbrev och få de senaste artiklarna och jobbtipsen levererade varje vecka.
          </p>
          <div className="flex gap-2 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Din e-postadress"
              className="flex-1 px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button>
              Prenumerera
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}