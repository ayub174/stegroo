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
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="Professional workspace" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 mb-6">
              <Badge variant="secondary" className="font-medium">
                <TrendingUp className="h-3 w-3 mr-1" />
                25,000+ nya jobb denna vecka
              </Badge>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Hitta ditt
              <span className="text-primary block">drömjobb</span>
              idag
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
              Upptäck tusentals möjligheter från Sveriges ledande företag. 
              Vi hjälper dig att ta nästa steg i din karriär.
            </p>
            
            <SearchBar className="mb-8" />
            
            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>2M+ jobbsökare</span>
              </div>
              <div className="flex items-center gap-1">
                <Briefcase className="h-4 w-4" />
                <span>50K+ jobb</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4" />
                <span>10K+ företag</span>
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