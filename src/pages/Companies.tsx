import { useState } from "react";
import { Check, Star, Sparkles, Zap, Building2, Users, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";

const Companies = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const plans = [
    {
      id: "starter",
      name: "Starter",
      price: "Gratis",
      subtitle: "Perfekt för mindre företag",
      icon: Building2,
      features: [
        "1 aktiv jobbannonse",
        "Basic företagsprofil",
        "Email support",
        "30 dagars annonsvisning",
        "Basic kandidatfilter"
      ],
      color: "from-slate-100 to-slate-200",
      borderColor: "border-slate-200",
      popular: false
    },
    {
      id: "medium",
      name: "Medium",
      price: "499 kr/mån",
      subtitle: "För växande företag",
      icon: Users,
      features: [
        "5 aktiva jobbannonser",
        "Utökad företagsprofil",
        "Prioriterad support",
        "60 dagars annonsvisning",
        "Avancerade kandidatfilter",
        "Kandidat CV-databas",
        "Företagsanalys"
      ],
      color: "from-blue-100 to-indigo-200",
      borderColor: "border-blue-200",
      popular: true
    },
    {
      id: "pro",
      name: "Pro",
      price: "999 kr/mån",
      subtitle: "För stora organisationer",
      icon: TrendingUp,
      features: [
        "Obegränsade jobbannonser",
        "Premium företagsprofil",
        "Dedikerad account manager",
        "90 dagars annonsvisning",
        "AI-matchning av kandidater",
        "Full CV-databas åtkomst",
        "Avancerad analys & rapporter",
        "API-integration",
        "Rekryteringsverktyg"
      ],
      color: "from-amber-100 to-orange-200",
      borderColor: "border-amber-200",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-companies-background relative overflow-hidden">
      {/* Abstract Background Patterns */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Enhanced blue gradient base */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-blue-200 to-indigo-300"></div>
        
        {/* Large flowing abstract shapes */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-300/40 to-indigo-400/30 rounded-full blur-3xl transform -translate-x-1/3 -translate-y-1/3 animate-float"></div>
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-indigo-300/50 to-blue-400/40 rounded-full blur-3xl transform translate-x-1/3 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-gradient-to-tr from-blue-400/35 to-sky-300/45 rounded-full blur-2xl animate-float" style={{ animationDelay: '4s' }}></div>
        <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-gradient-to-tl from-sky-300/40 to-indigo-200/50 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-gradient-to-r from-blue-200/30 to-indigo-300/35 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2 animate-float" style={{ animationDelay: '3s' }}></div>
        
        {/* Enhanced abstract geometric patterns */}
        <svg className="absolute inset-0 w-full h-full opacity-15" viewBox="0 0 1200 800" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Flowing curves */}
          <path d="M0 400C150 350 300 450 600 300C900 150 1050 250 1200 200" stroke="url(#blueGradient1)" strokeWidth="3"/>
          <path d="M0 200C200 100 400 300 800 150C1000 50 1100 200 1200 100" stroke="url(#blueGradient2)" strokeWidth="2"/>
          <path d="M0 600C300 500 600 700 900 550C1050 450 1150 600 1200 500" stroke="url(#blueGradient3)" strokeWidth="2.5"/>
          <path d="M0 100C400 50 600 200 1200 50" stroke="url(#blueGradient4)" strokeWidth="1.5"/>
          <path d="M0 700C200 650 800 750 1200 650" stroke="url(#blueGradient1)" strokeWidth="2"/>
          
          {/* Abstract circles with varying sizes */}
          <circle cx="150" cy="120" r="60" fill="url(#blueGradient1)" fillOpacity="0.12"/>
          <circle cx="350" cy="400" r="80" fill="url(#blueGradient2)" fillOpacity="0.08"/>
          <circle cx="750" cy="200" r="45" fill="url(#blueGradient3)" fillOpacity="0.15"/>
          <circle cx="950" cy="500" r="70" fill="url(#blueGradient4)" fillOpacity="0.1"/>
          <circle cx="550" cy="650" r="55" fill="url(#blueGradient1)" fillOpacity="0.12"/>
          <circle cx="1100" cy="300" r="40" fill="url(#blueGradient2)" fillOpacity="0.14"/>
          
          {/* Geometric shapes */}
          <polygon points="300,80 360,140 300,200 240,140" fill="url(#blueGradient1)" fillOpacity="0.1"/>
          <polygon points="800,350 870,420 800,490 730,420" fill="url(#blueGradient2)" fillOpacity="0.09"/>
          <polygon points="500,500 570,570 500,640 430,570" fill="url(#blueGradient3)" fillOpacity="0.11"/>
          
          {/* Abstract triangular shapes */}
          <polygon points="100,300 150,250 200,300 150,350" fill="url(#blueGradient4)" fillOpacity="0.08"/>
          <polygon points="600,100 650,50 700,100 650,150" fill="url(#blueGradient1)" fillOpacity="0.1"/>
          <polygon points="1000,600 1050,550 1100,600 1050,650" fill="url(#blueGradient3)" fillOpacity="0.09"/>
          
          {/* Hexagonal patterns */}
          <polygon points="450,250 480,230 510,250 510,290 480,310 450,290" fill="url(#blueGradient2)" fillOpacity="0.07"/>
          <polygon points="850,150 880,130 910,150 910,190 880,210 850,190" fill="url(#blueGradient4)" fillOpacity="0.08"/>
          
          <defs>
            <linearGradient id="blueGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>
            <linearGradient id="blueGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="50%" stopColor="#5b21b6" />
              <stop offset="100%" stopColor="#4f46e5" />
            </linearGradient>
            <linearGradient id="blueGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0ea5e9" />
              <stop offset="50%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>
            <linearGradient id="blueGradient4" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e40af" />
              <stop offset="50%" stopColor="#1e3a8a" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Enhanced floating abstract elements */}
        <div className="absolute top-1/4 left-1/5 w-24 h-24 border-3 border-blue-400/50 rounded-2xl rotate-45 animate-float backdrop-blur-sm"></div>
        <div className="absolute top-3/4 right-1/4 w-20 h-20 border-2 border-indigo-400/60 rounded-full animate-float backdrop-blur-sm" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-3/4 w-16 h-16 bg-blue-500/20 rotate-12 animate-float backdrop-blur-sm" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/6 right-1/6 w-28 h-28 border-2 border-sky-400/45 rounded-3xl rotate-12 animate-float backdrop-blur-sm" style={{ animationDelay: '3s' }}></div>
        <div className="absolute bottom-1/3 left-1/3 w-18 h-18 bg-indigo-400/25 rounded-full animate-float backdrop-blur-sm" style={{ animationDelay: '4s' }}></div>
        
        {/* Additional decorative elements */}
        <div className="absolute top-2/3 left-1/6 w-32 h-2 bg-gradient-to-r from-transparent via-blue-400/40 to-transparent rotate-45 animate-float" style={{ animationDelay: '2.5s' }}></div>
        <div className="absolute top-1/3 right-2/3 w-2 h-32 bg-gradient-to-b from-transparent via-indigo-400/35 to-transparent rotate-12 animate-float" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="relative z-10">
        <Header isEmployerContext={true} />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16">
        <div className="absolute inset-0 bg-gradient-subtle opacity-30"></div>
        <div className="absolute top-10 left-1/4 w-40 h-40 bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-32 right-1/3 w-32 h-32 bg-accent/15 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }}></div>
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-gradient-subtle text-primary border-primary/20 shadow-clay-md animate-fade-in">
              <Sparkles className="w-4 h-4 mr-2" />
              Rekrytera de bästa talangerna
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 animate-fade-in">
              Hitta nästa
              <span className="block bg-gradient-hero bg-clip-text text-transparent">
                stjärnmedarbetare
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Publicera jobbannonser och nå tusentals kvalificerade kandidater. 
              Välj det paket som passar ditt företags behov.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Button size="lg" variant="hero" className="hover:shadow-clay-lg transition-all duration-300">
                Registrera företag
                <Zap className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="hover:shadow-clay-md transition-all duration-300">
                Se demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Välj ditt rekryteringspaket
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Från startup till stor organisation - vi har en lösning som passar dig
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {plans.map((plan, index) => {
              const IconComponent = plan.icon;
              return (
                <Card 
                  key={plan.id}
                  className={`
                    relative group cursor-pointer transition-all duration-300 
                    hover:shadow-clay-lg hover:-translate-y-2 
                    ${selectedPlan === plan.id ? 'ring-2 ring-primary shadow-clay-lg' : ''}
                    ${plan.popular ? 'ring-2 ring-primary/50 shadow-clay-md' : ''}
                    bg-gradient-to-br ${plan.color} ${plan.borderColor}
                    backdrop-blur-sm border-2
                  `}
                  onClick={() => setSelectedPlan(plan.id)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-hero text-primary-foreground shadow-clay-md">
                        <Star className="w-3 h-3 mr-1" />
                        Populärast
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 mx-auto mb-4 bg-white/50 rounded-2xl flex items-center justify-center shadow-clay-sm">
                      <IconComponent className="w-8 h-8 text-primary" />
                    </div>
                    
                    <CardTitle className="text-2xl font-bold text-foreground mb-2">
                      {plan.name}
                    </CardTitle>
                    
                    <div className="text-3xl font-bold text-primary mb-1">
                      {plan.price}
                    </div>
                    
                    <CardDescription className="text-muted-foreground">
                      {plan.subtitle}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-3">
                          <div className="w-5 h-5 bg-success/20 rounded-full flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 text-success" />
                          </div>
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      className="w-full mt-6 shadow-clay-sm hover:shadow-clay-md transition-all duration-300"
                      variant={plan.popular ? "hero" : "outline"}
                    >
                      {plan.price === "Gratis" ? "Kom igång gratis" : "Välj plan"}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-subtle/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-8">
              Varför välja vår plattform?
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="group">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-subtle rounded-2xl flex items-center justify-center shadow-clay-md group-hover:shadow-clay-lg transition-all duration-300">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Stor kandidatpool</h3>
                <p className="text-muted-foreground">Tillgång till tusentals kvalificerade kandidater</p>
              </div>
              
              <div className="group">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-subtle rounded-2xl flex items-center justify-center shadow-clay-md group-hover:shadow-clay-lg transition-all duration-300">
                  <Zap className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Snabb process</h3>
                <p className="text-muted-foreground">Publicera annonser på minuter, inte timmar</p>
              </div>
              
              <div className="group">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-subtle rounded-2xl flex items-center justify-center shadow-clay-md group-hover:shadow-clay-lg transition-all duration-300">
                  <TrendingUp className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Smart matchning</h3>
                <p className="text-muted-foreground">AI hjälper dig hitta rätt kandidater</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      </div>
    </div>
  );
};

export default Companies;