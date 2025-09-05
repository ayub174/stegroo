import { Link } from "react-router-dom";
import { BookOpen, Search, Target, TrendingUp, Lightbulb } from "lucide-react";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Guides = () => {
  const guideCategories = [
    {
      title: "Jobbsökning",
      description: "Lär dig att söka jobb effektivt med rätt strategier och verktyg för att hitta din drömtjänst.",
      icon: Search,
      href: "/guider/jobbsokning",
      color: "from-blue-500 to-cyan-500",
      topics: ["CV-skrivning", "Personligt brev", "Jobbsök-strategier", "Nätverkande"]
    },
    {
      title: "Intervjutekniker",
      description: "Mästra konsten att lyckas på jobbintervjuer med professionella tips och tekniker.",
      icon: Target,
      href: "/guider/intervjutekniker",
      color: "from-green-500 to-emerald-500",
      topics: ["Förberedelser", "Vanliga frågor", "Kroppsspråk", "Uppföljning"]
    },
    {
      title: "Karriärutveckling",
      description: "Utveckla din karriär med strategiska råd för långsiktig framgång och tillväxt.",
      icon: TrendingUp,
      href: "/guider/karriarutveckling",
      color: "from-purple-500 to-violet-500",
      topics: ["Karriärplanering", "Kompetensutveckling", "Ledarskap", "Mentorskap"]
    },
    {
      title: "Praktiska tips",
      description: "Få konkreta och användbara råd för att navigera arbetsmarknaden framgångsrikt.",
      icon: Lightbulb,
      href: "/guider/praktiska-tips",
      color: "from-orange-500 to-amber-500",
      topics: ["Tidshantering", "Workplace etiquette", "Balans", "Produktivitet"]
    }
  ];

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
        
        <main className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-primary-hover rounded-2xl mb-6">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
              Karriärguider
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Få expertråd och praktiska tips för att lyckas i din karriär. Våra omfattande guider hjälper dig 
              att navigera arbetsmarknaden och uppnå dina professionella mål.
            </p>
          </div>

          {/* Guide Categories Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {guideCategories.map((category) => {
              const Icon = category.icon;
              return (
                <Card key={category.href} className="group hover:shadow-card-hover transition-all duration-300 overflow-hidden border-border/50">
                  <div className={`h-2 bg-gradient-to-r ${category.color}`}></div>
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} text-white mb-4`}>
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>
                    <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                      {category.title}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {category.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
                        Ämnen som täcks:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {category.topics.map((topic) => (
                          <span 
                            key={topic}
                            className="px-3 py-1 bg-muted text-muted-foreground text-sm rounded-full"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <Link to={category.href}>
                      <Button className="w-full group-hover:bg-primary-hover transition-colors">
                        Utforska guider
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Additional CTA Section */}
          <div className="bg-gradient-to-r from-primary/5 to-primary-hover/5 rounded-2xl p-8 text-center border border-primary/10">
            <h2 className="text-2xl font-bold mb-4">
              Redo att ta nästa steg i din karriär?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Börja med att utforska våra lediga jobb eller skapa en profil för att få personliga jobbförslag.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/jobs">
                <Button size="lg" className="min-w-[200px]">
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
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Guides;