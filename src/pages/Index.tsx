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
        {/* Floating Background Elements */}
        <div className="absolute inset-0 z-[1]">
          <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-primary/8 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>
        
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="Professional workspace" 
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-[10s] ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/85 via-primary/5 to-background/70 animate-gradient-shift"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 mb-6 animate-fade-in">
              <Badge variant="secondary" className="font-medium hover:scale-105 transition-transform duration-300 cursor-pointer bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
                <TrendingUp className="h-3 w-3 mr-1 animate-pulse" />
                25,000+ nya jobb denna vecka
              </Badge>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 leading-tight animate-fade-in" style={{animationDelay: '0.2s'}}>
              Hitta ditt
              <span className="text-transparent bg-gradient-primary bg-clip-text block hover:scale-105 transition-transform duration-500 cursor-default">drömjobb</span>
              idag
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl animate-fade-in leading-relaxed" style={{animationDelay: '0.4s'}}>
              Upptäck tusentals möjligheter från Sveriges ledande företag. 
              Vi hjälper dig att ta nästa steg i din karriär med AI-driven matchning.
            </p>
            
            <div className="animate-fade-in" style={{animationDelay: '0.6s'}}>
              <SearchBar className="mb-8 transform hover:scale-[1.02] transition-transform duration-300" />
            </div>
            
            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground animate-fade-in" style={{animationDelay: '0.8s'}}>
              <div className="flex items-center gap-1 group hover:text-primary transition-colors duration-300 cursor-pointer">
                <Users className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                <span className="font-medium">2M+ jobbsökare</span>
              </div>
              <div className="flex items-center gap-1 group hover:text-primary transition-colors duration-300 cursor-pointer">
                <Briefcase className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                <span className="font-medium">50K+ jobb</span>
              </div>
              <div className="flex items-center gap-1 group hover:text-primary transition-colors duration-300 cursor-pointer">
                <Star className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                <span className="font-medium">10K+ företag</span>
              </div>
            </div>
          </div>
        </div>
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