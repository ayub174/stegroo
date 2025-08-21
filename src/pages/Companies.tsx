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
        {/* Base blue gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100"></div>
        
        {/* Abstract geometric shapes */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-1/4 right-0 w-80 h-80 bg-indigo-200/40 rounded-full blur-3xl transform translate-x-1/2"></div>
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-blue-300/25 rounded-full blur-2xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-sky-200/30 rounded-full blur-2xl"></div>
        
        {/* Abstract geometric lines/shapes */}
        <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 1200 800" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 400C300 350 600 450 1200 300" stroke="url(#blueGradient1)" strokeWidth="2"/>
          <path d="M0 200C400 150 800 250 1200 100" stroke="url(#blueGradient2)" strokeWidth="1.5"/>
          <path d="M0 600C200 550 800 650 1200 500" stroke="url(#blueGradient3)" strokeWidth="1"/>
          <circle cx="200" cy="150" r="40" fill="url(#blueGradient1)" fillOpacity="0.1"/>
          <circle cx="800" cy="300" r="60" fill="url(#blueGradient2)" fillOpacity="0.1"/>
          <circle cx="1000" cy="600" r="35" fill="url(#blueGradient3)" fillOpacity="0.1"/>
          <polygon points="400,100 450,150 400,200 350,150" fill="url(#blueGradient1)" fillOpacity="0.08"/>
          <polygon points="900,400 950,450 900,500 850,450" fill="url(#blueGradient2)" fillOpacity="0.08"/>
          
          <defs>
            <linearGradient id="blueGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>
            <linearGradient id="blueGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#4f46e5" />
            </linearGradient>
            <linearGradient id="blueGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0ea5e9" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Floating abstract elements */}
        <div className="absolute top-1/3 left-1/4 w-20 h-20 border-2 border-blue-300/40 rounded-lg rotate-45 animate-float"></div>
        <div className="absolute top-2/3 right-1/3 w-16 h-16 border-2 border-indigo-300/40 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-2/3 w-12 h-12 bg-blue-400/20 rotate-12 animate-float" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10">
        <Header />
      
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