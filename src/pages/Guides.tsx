import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Search, Target, TrendingUp, Lightbulb, Sparkles, Star, Clock, Users } from "lucide-react";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { SearchBarSticky } from "@/components/ui/search-bar-sticky";
import { EnhancedCategoryCard } from "@/components/ui/enhanced-category-card";
import { PopularGuideCard } from "@/components/ui/popular-guide-card";
import { FeaturedSection } from "@/components/ui/featured-section";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

const Guides = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const guideCategories = [
    {
      title: "Jobbsökning",
      description: "Lär dig att söka jobb effektivt med rätt strategier och verktyg för att hitta din drömtjänst.",
      icon: Search,
      href: "/guider/jobbsokning",
      gradient: "from-blue-500 to-cyan-500",
      topics: ["CV-skrivning", "Personligt brev", "Jobbsök-strategier", "Nätverkande"],
      guideCount: 12,
      featured: true
    },
    {
      title: "Intervjutekniker",
      description: "Mästra konsten att lyckas på jobbintervjuer med professionella tips och tekniker.",
      icon: Target,
      href: "/guider/intervjutekniker",
      gradient: "from-green-500 to-emerald-500",
      topics: ["Förberedelser", "Vanliga frågor", "Kroppsspråk", "Uppföljning"],
      guideCount: 8
    },
    {
      title: "Karriärutveckling",
      description: "Utveckla din karriär med strategiska råd för långsiktig framgång och tillväxt.",
      icon: TrendingUp,
      href: "/guider/karriarutveckling",
      gradient: "from-purple-500 to-violet-500",
      topics: ["Karriärplanering", "Kompetensutveckling", "Ledarskap", "Mentorskap"],
      guideCount: 15
    },
    {
      title: "Praktiska tips",
      description: "Få konkreta och användbara råd för att navigera arbetsmarknaden framgångsrikt.",
      icon: Lightbulb,
      href: "/guider/praktiska-tips",
      gradient: "from-orange-500 to-amber-500",
      topics: ["Tidshantering", "Workplace etiquette", "Balans", "Produktivitet"],
      guideCount: 10
    }
  ];

  const popularGuides = [
    {
      title: "Så skriver du ett vinnande CV som får arbetsgivare att reagera",
      excerpt: "Lär dig hemligheterna bakom ett CV som sticker ut från mängden och öppnar dörrar till drömjobbet.",
      category: "Jobbsökning",
      readTime: "8 min",
      views: 15420,
      href: "/guider/jobbsokning/cv-skrivtips",
      isNew: false
    },
    {
      title: "10 intervjufrågor du måste kunna svara på",
      excerpt: "Förbered dig för de vanligaste intervjufrågorna och lär dig att svara på ett sätt som imponerar.",
      category: "Intervjutekniker",
      readTime: "12 min",
      views: 12300,
      href: "/guider/intervjutekniker/vanliga-fragor",
      isNew: true
    },
    {
      title: "Karriärplanering: Hur du sätter upp mål som verkligen fungerar",
      excerpt: "Skapa en tydlig väg framåt med smarta mål och strategier för din karriärutveckling.",
      category: "Karriärutveckling",
      readTime: "15 min",
      views: 9800,
      href: "/guider/karriarutveckling/karriarplanering",
      isNew: false
    },
    {
      title: "Nätverkande för introverta: Praktiska tips som faktiskt fungerar",
      excerpt: "Även om du är introvert kan du bygga värdefulla professionella relationer.",
      category: "Praktiska tips",
      readTime: "10 min",
      views: 8500,
      href: "/guider/praktiska-tips/natverkande-introverta",
      isNew: true
    }
  ];

  const featuredItems = [
    {
      title: "Löneförhandling: Så får du den lön du förtjänar",
      description: "En komplett guide till att förhandla om lön på ett professionellt och effektivt sätt.",
      type: "editorial" as const,
      href: "/guider/karriarutveckling/loneforhandling",
      category: "Karriärutveckling"
    },
    {
      title: "Remote work: Så lyckas du med distansarbete",
      description: "Tips och strategier för att vara produktiv och framgångsrik när du arbetar hemifrån.",
      type: "trending" as const,
      href: "/guider/praktiska-tips/remote-work",
      category: "Praktiska tips"
    },
    {
      title: "AI och framtidens jobb: Vad du behöver veta",
      description: "Hur artificiell intelligens påverkar arbetsmarknaden och vad du kan göra för att hänga med.",
      type: "new" as const,
      href: "/guider/karriarutveckling/ai-framtiden",
      category: "Karriärutveckling"
    }
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Here you would implement search functionality
    console.log("Searching for:", query);
  };

  return (
    <>
      {/* SEO Meta Tags */}
      <title>Karriärguider - Expert råd för jobbsökning & karriärutveckling | Stegroo</title>
      <meta 
        name="description" 
        content="Upptäck våra omfattande karriärguider med expertråd inom jobbsökning, intervjutekniker, karriärutveckling och praktiska tips för din professionella framgång." 
      />
      <meta name="keywords" content="karriärguider, jobbsökning, intervjutekniker, karriärutveckling, CV-tips, personligt brev, jobbtips" />
      <meta property="og:title" content="Karriärguider - Expert råd för jobbsökning & karriärutveckling" />
      <meta property="og:description" content="Upptäck våra omfattande karriärguider med expertråd inom jobbsökning, intervjutekniker, karriärutveckling och praktiska tips." />
      <meta property="og:type" content="website" />
      <link rel="canonical" href="/guider" />

      <div className="min-h-screen bg-gradient-subtle">
        <Header />
        
        {/* Breadcrumbs */}
        <div className="container mx-auto px-4 py-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Hem</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Guider</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <main className="container mx-auto px-4 pb-16">
          {/* Hero Section */}
          <section className="text-center mb-12 animate-fade-in relative">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-xl animate-pulse"></div>
              <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-hero rounded-2xl shadow-elegant animate-float">
                <BookOpen className="w-10 h-10 text-white drop-shadow-sm" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-primary-hover to-primary bg-clip-text text-transparent animate-fade-in">
              Utforska våra guider
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8">
              Expertråd och praktiska tips för din karriärsuccé
            </p>
            
            {/* Compact stats with personality */}
            <div className="inline-flex items-center gap-6 px-6 py-3 bg-gradient-to-r from-background/80 to-muted/30 backdrop-blur-sm rounded-full border border-border/50 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-primary">45+ Guider</span>
              </div>
              <div className="w-px h-4 bg-border"></div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                <span className="text-sm font-semibold text-primary">50k+ Läsningar</span>
              </div>
              <div className="w-px h-4 bg-border"></div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                <span className="text-sm font-semibold text-primary">4.8★ Betyg</span>
              </div>
            </div>
          </section>

          {/* Sticky Search Bar */}
          <SearchBarSticky onSearch={handleSearch} className="mb-16" />

          {/* Guide Categories Grid */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Välj din kategori</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Utforska våra specialiserade områden och hitta guider som passar dina behov
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {guideCategories.map((category) => (
                <EnhancedCategoryCard
                  key={category.href}
                  title={category.title}
                  description={category.description}
                  icon={category.icon}
                  href={category.href}
                  topics={category.topics}
                  guideCount={category.guideCount}
                  gradient={category.gradient}
                  featured={category.featured}
                />
              ))}
            </div>
          </section>

          {/* Popular Guides Section */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-warning to-orange-500 rounded-2xl mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Populära guider</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                De mest lästa och uppskattade guiderna från vårt community
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularGuides.map((guide, index) => (
                <PopularGuideCard
                  key={index}
                  title={guide.title}
                  excerpt={guide.excerpt}
                  category={guide.category}
                  readTime={guide.readTime}
                  views={guide.views}
                  href={guide.href}
                  isNew={guide.isNew}
                />
              ))}
            </div>
          </section>

          {/* Featured Section */}
          <FeaturedSection
            title="Redaktörens val"
            items={featuredItems}
            icon={<Sparkles className="w-8 h-8 text-white" />}
          />

          {/* CTA Section */}
          <section className="mt-20">
            <div className="bg-gradient-to-r from-primary/5 to-primary-hover/5 rounded-3xl p-12 text-center border border-primary/10 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-shift opacity-30 animate-gradient-shift"></div>
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-hero rounded-2xl mb-6">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-4">
                  Redo att ta nästa steg i din karriär?
                </h2>
                <p className="text-muted-foreground mb-8 max-w-2xl mx-auto text-lg">
                  Börja med att utforska våra lediga jobb eller skapa en profil för att få personliga jobbförslag.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/jobs">
                    <Button size="lg" className="min-w-[200px] shadow-button">
                      Sök lediga jobb
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="outline" size="lg" className="min-w-[200px]">
                      Skapa profil
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Guides;