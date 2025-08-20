import { TrendingUp, Users, Briefcase, Star, ArrowRight } from "lucide-react";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { SearchBar } from "@/components/ui/search-bar";
import { JobCard } from "@/components/ui/job-card";
import { CategoryCard } from "@/components/ui/category-card";
import { CompanyCard } from "@/components/ui/company-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import heroImage from "@/assets/hero-image.jpg";
import techCategoryImage from "@/assets/tech-category.jpg";
import marketingCategoryImage from "@/assets/marketing-category.jpg";
import healthcareCategoryImage from "@/assets/healthcare-category.jpg";

const Index = () => {
  const featuredJobs = [
    {
      id: "1",
      title: "Senior Frontend Utvecklare",
      company: "TechCorp AB",
      location: "Stockholm",
      salary: "65 000 - 85 000 kr/mån",
      type: "Heltid",
      timePosted: "2 dagar sedan",
      tags: ["React", "TypeScript", "Remote OK"]
    },
    {
      id: "2",
      title: "UX/UI Designer",
      company: "Design Studio",
      location: "Göteborg",
      salary: "55 000 - 70 000 kr/mån",
      type: "Heltid",
      timePosted: "1 dag sedan",
      tags: ["Figma", "Prototyping", "User Research"]
    },
    {
      id: "3",
      title: "Produktägare",
      company: "StartupTech",
      location: "Malmö",
      salary: "70 000 - 90 000 kr/mån",
      type: "Heltid",
      timePosted: "3 dagar sedan",
      tags: ["Agile", "Scrum", "Analytics"]
    }
  ];

  const categories = [
    { title: "Teknik & IT", jobCount: 15240, image: techCategoryImage },
    { title: "Marknadsföring", jobCount: 8932, image: marketingCategoryImage },
    { title: "Hälsovård", jobCount: 12456, image: healthcareCategoryImage },
    { title: "Ekonomi", jobCount: 6789, image: techCategoryImage },
    { title: "Utbildning", jobCount: 4532, image: marketingCategoryImage },
    { title: "Försäljning", jobCount: 9876, image: healthcareCategoryImage }
  ];

  const companies = [
    { name: "Spotify", industry: "Musikstreaming", openPositions: 23 },
    { name: "Klarna", industry: "Fintech", openPositions: 45 },
    { name: "Ericsson", industry: "Telekommunikation", openPositions: 67 },
    { name: "H&M", industry: "Mode & Retail", openPositions: 34 },
    { name: "Volvo Cars", industry: "Automotive", openPositions: 56 },
    { name: "King", industry: "Gaming", openPositions: 28 }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Dynamic Background Elements */}
        <div className="absolute inset-0 z-[1]">
          {/* Floating geometric shapes */}
          <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-primary/10 to-accent/5 rounded-full blur-3xl animate-float"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-bl from-accent/8 to-primary/12 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-tr from-primary/6 to-accent/8 rounded-full blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
          
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: `radial-gradient(circle, hsl(var(--primary)) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        
        {/* Hero Image with Advanced Effects */}
        <div className="absolute inset-0 z-0">
          <div className="relative w-full h-full overflow-hidden">
            <img 
              src={heroImage} 
              alt="Modern collaborative workspace" 
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-[15s] ease-out"
            />
            {/* Multi-layer gradients for depth */}
            <div className="absolute inset-0 bg-gradient-to-br from-background/96 via-background/88 via-primary/8 to-background/75"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/20 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-transparent to-background/60"></div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* Status Badge with Enhanced Design */}
            <div className="flex justify-center lg:justify-start mb-8 animate-fade-in">
              <div className="relative group">
                <Badge variant="secondary" className="relative group font-semibold text-sm hover:scale-105 transition-all duration-500 cursor-pointer bg-gradient-to-r from-primary/20 via-accent/15 to-primary/10 border border-primary/40 hover:border-primary/60 px-6 py-3 overflow-hidden backdrop-blur-sm">
                  {/* Dynamic background effects */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/25 to-accent/25 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur opacity-30 group-hover:opacity-50 transition-all duration-500"></div>
                  
                  {/* Content */}
                  <div className="relative z-10 flex items-center gap-3">
                    <div className="relative">
                      <TrendingUp className="h-4 w-4 text-primary animate-pulse" />
                      <div className="absolute inset-0 animate-ping">
                        <TrendingUp className="h-4 w-4 text-primary/50" />
                      </div>
                    </div>
                    <span className="font-bold text-lg bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                      25,000+
                    </span>
                    <span className="text-foreground/90 font-medium">nya jobb denna vecka</span>
                  </div>
                </Badge>
              </div>
            </div>
            
            {/* Hero Title with Enhanced Typography */}
            <div className="text-center lg:text-left mb-8">
              <h1 className="text-5xl lg:text-7xl font-black text-foreground mb-6 leading-[0.9] animate-fade-in" style={{animationDelay: '0.2s'}}>
                <span className="block mb-2">Hitta ditt</span>
                <span className="relative inline-block">
                  <span className="text-transparent bg-gradient-to-r from-primary via-accent to-primary bg-clip-text hover:scale-105 transition-transform duration-700 cursor-default block">
                    drömjobb
                  </span>
                  {/* Subtle underline effect */}
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 to-accent/50 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                </span>
                <span className="block mt-2 text-foreground/90">idag</span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto lg:mx-0 animate-fade-in leading-relaxed font-light" style={{animationDelay: '0.4s'}}>
                Upptäck tusentals möjligheter från Sveriges ledande företag. 
                <span className="text-primary/80 font-medium"> Vi använder AI för att matcha dig med perfekta roller</span> som passar din profil och ambitioner.
              </p>
            </div>
            
            {/* Enhanced Search Bar */}
            <div className="flex justify-center lg:justify-start mb-12 animate-fade-in" style={{animationDelay: '0.6s'}}>
              <div className="w-full max-w-2xl relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-all duration-500"></div>
                <SearchBar className="relative transform hover:scale-[1.02] transition-all duration-300 shadow-2xl" />
              </div>
            </div>
            
            {/* Enhanced Statistics with Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto lg:mx-0 animate-fade-in" style={{animationDelay: '0.8s'}}>
              {[
                { icon: Users, label: "Jobbsökare", value: "2M+", color: "text-blue-500" },
                { icon: Briefcase, label: "Aktiva jobb", value: "50K+", color: "text-green-500" },
                { icon: Star, label: "Företag", value: "10K+", color: "text-purple-500" }
              ].map(({ icon: Icon, label, value, color }, index) => (
                <div key={index} className="group cursor-pointer">
                  <div className="relative p-6 rounded-2xl bg-gradient-to-br from-card/50 to-card/30 border border-border/50 hover:border-primary/30 backdrop-blur-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="relative z-10 flex items-center gap-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 ${color} group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                          {value}
                        </div>
                        <div className="text-sm text-muted-foreground font-medium">
                          {label}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Additional decorative elements */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Populära jobbkategorier
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Utforska jobb inom de områden som passar dig bäst
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <CategoryCard
                key={index}
                title={category.title}
                jobCount={category.jobCount}
                image={category.image}
                className="animate-fade-in"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Utvalda jobb för dig
              </h2>
              <p className="text-muted-foreground">
                Handplockade möjligheter från våra partners
              </p>
            </div>
            <Button variant="outline" className="hidden md:inline-flex">
              Visa alla jobb
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {featuredJobs.map((job, index) => (
              <JobCard
                key={index}
                {...job}
                className="animate-fade-in"
              />
            ))}
          </div>
          
          <div className="text-center mt-8 md:hidden">
            <Button variant="outline" className="w-full">
              Visa alla jobb
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Companies Section */}
      <section className="py-16 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Företag som rekryterar
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Anslut dig till Sveriges mest innovativa företag
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company, index) => (
              <CompanyCard
                key={index}
                {...company}
                className="animate-fade-in"
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-primary-foreground mb-6">
            Redo att ta nästa steg?
          </h2>
          <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Gå med i miljontals jobbsökare som redan hittat sin drömkarriär genom vår plattform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" className="font-semibold">
              Skapa profil
            </Button>
            <Button variant="outline" size="lg" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
              För företag
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;