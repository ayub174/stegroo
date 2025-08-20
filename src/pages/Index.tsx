import { TrendingUp, Users, Briefcase, Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
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
      <section className="relative py-20 lg:py-32 overflow-hidden bg-clay-surface">
        {/* Clay-style organic shapes */}
        <div className="absolute inset-0 z-[1]">
          {/* Soft clay-like shapes */}
          <div className="absolute top-20 left-10 w-64 h-64 bg-clay-secondary rounded-[3rem] rotate-12 shadow-clay-soft animate-float opacity-60"></div>
          <div className="absolute top-40 right-20 w-96 h-80 bg-clay-accent rounded-[4rem] -rotate-6 shadow-clay-medium animate-float opacity-40" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-20 left-1/3 w-80 h-72 bg-clay-primary rounded-[3.5rem] rotate-3 shadow-clay-soft animate-float opacity-50" style={{animationDelay: '4s'}}></div>
          
          {/* Subtle clay texture pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `radial-gradient(circle, hsl(var(--clay-text)) 0.5px, transparent 0.5px)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        {/* Hero Image with Clay Effects */}
        <div className="absolute inset-0 z-0">
          <div className="relative w-full h-full overflow-hidden rounded-3xl mx-4">
            <img 
              src={heroImage} 
              alt="Modern collaborative workspace" 
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-[15s] ease-out"
            />
            {/* Clay-style matte overlays */}
            <div className="absolute inset-0 bg-gradient-to-br from-clay-surface/85 via-clay-surface/70 to-clay-surface/60"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-clay-surface via-clay-surface/30 to-transparent"></div>
            <div className="absolute inset-0 shadow-clay-inset"></div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* Status Badge with Clay Design */}
            <div className="flex justify-center lg:justify-start mb-8 animate-fade-in">
              <div className="relative group">
                <Badge variant="secondary" className="relative group font-semibold text-sm hover:scale-105 transition-all duration-500 cursor-pointer bg-clay-surface-dark border-2 border-clay-accent hover:border-clay-primary px-6 py-3 rounded-2xl shadow-clay-soft hover:shadow-clay-medium">
                  {/* Clay button effect */}
                  <div className="absolute inset-0 bg-clay-accent opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-2xl"></div>
                  
                  {/* Content */}
                  <div className="relative z-10 flex items-center gap-3">
                    <div className="p-1.5 bg-clay-primary rounded-lg shadow-clay-inset">
                      <TrendingUp className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-bold text-lg text-clay-primary">
                      25,000+
                    </span>
                    <span className="text-clay-text font-medium">nya jobb denna vecka</span>
                  </div>
                </Badge>
              </div>
            </div>
            
            {/* Hero Title with Clay Typography */}
            <div className="text-center lg:text-left mb-8">
              <h1 className="text-5xl lg:text-7xl font-black text-clay-text mb-6 leading-[0.9] animate-fade-in" style={{animationDelay: '0.2s'}}>
                <span className="block mb-2">Hitta ditt</span>
                <span className="relative inline-block group">
                  <span className="text-clay-primary hover:scale-105 transition-transform duration-700 cursor-default block relative">
                    drömjobb
                    {/* Clay-style highlight */}
                    <div className="absolute inset-0 bg-clay-accent opacity-20 rounded-xl -skew-x-12 transform scale-105 -z-10"></div>
                  </span>
                </span>
                <span className="block mt-2 text-clay-text-light">idag</span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-clay-text-light mb-10 max-w-3xl mx-auto lg:mx-0 animate-fade-in leading-relaxed font-light" style={{animationDelay: '0.4s'}}>
                Upptäck tusentals möjligheter från Sveriges ledande företag. 
                <span className="text-clay-primary font-medium"> Vi använder AI för att matcha dig med perfekta roller</span> som passar din profil och ambitioner.
              </p>
            </div>
            
            {/* Clay-style Search Bar */}
            <div className="flex justify-center lg:justify-start mb-12 animate-fade-in" style={{animationDelay: '0.6s'}}>
              <div className="w-full max-w-2xl relative group">
                <div className="absolute inset-0 bg-clay-surface-dark rounded-2xl shadow-clay-medium group-hover:shadow-clay-strong transition-all duration-500"></div>
                <SearchBar className="relative transform hover:scale-[1.02] transition-all duration-300 bg-transparent shadow-none border-0" />
              </div>
            </div>
            
            {/* Clay-style Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto lg:mx-0 animate-fade-in" style={{animationDelay: '0.8s'}}>
              {[
                { icon: Users, label: "Jobbsökare", value: "2M+", color: "bg-clay-primary" },
                { icon: Briefcase, label: "Aktiva jobb", value: "50K+", color: "bg-clay-accent" },
                { icon: Star, label: "Företag", value: "10K+", color: "bg-clay-secondary" }
              ].map(({ icon: Icon, label, value, color }, index) => (
                <div key={index} className="group cursor-pointer">
                  <div className="relative p-6 rounded-3xl bg-clay-surface-dark border-2 border-clay-surface hover:border-clay-accent shadow-clay-soft hover:shadow-clay-strong transition-all duration-500 hover:-translate-y-2">
                    <div className="absolute inset-0 bg-clay-accent opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-500"></div>
                    
                    <div className="relative z-10 flex items-center gap-4">
                      <div className={`p-3 rounded-2xl ${color} shadow-clay-inset group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-clay-text group-hover:text-clay-primary transition-colors duration-300">
                          {value}
                        </div>
                        <div className="text-sm text-clay-text-light font-medium">
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

      {/* Categories Section - Clay Style */}
      <section className="py-16 bg-clay-surface-dark">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-clay-text mb-4">
              Populära jobbkategorier
            </h2>
            <p className="text-clay-text-light max-w-2xl mx-auto">
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
                className="animate-fade-in shadow-clay-soft hover:shadow-clay-medium transition-all duration-300 bg-clay-surface border-2 border-clay-surface hover:border-clay-accent rounded-3xl"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs Section - Clay Style */}
      <section className="relative py-20 overflow-hidden bg-clay-surface">
        {/* Clay organic shapes */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-20 right-10 w-80 h-80 bg-clay-secondary rounded-[4rem] rotate-6 shadow-clay-soft animate-float opacity-50" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-20 left-20 w-96 h-72 bg-clay-accent rounded-[3rem] -rotate-12 shadow-clay-medium animate-float opacity-40" style={{animationDelay: '3s'}}></div>
          
          {/* Subtle clay texture */}
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: `radial-gradient(circle, hsl(var(--clay-text)) 0.5px, transparent 0.5px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Section Header - Clay Style */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center gap-2 mb-6">
              <Badge variant="secondary" className="font-medium bg-clay-surface-dark border-2 border-clay-accent px-4 py-2 rounded-2xl shadow-clay-soft">
                <Star className="h-3 w-3 mr-1 text-clay-primary" />
                <span className="text-clay-text">Personligt utvalda</span>
              </Badge>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-black text-clay-text mb-6 leading-tight">
              <span className="text-clay-primary">
                Utvalda jobb
              </span>
              <span className="block text-clay-text-light mt-2">för dig</span>
            </h2>
            
            <p className="text-xl text-clay-text-light max-w-2xl mx-auto leading-relaxed">
              Handplockade möjligheter från våra partners som
              <span className="text-clay-primary font-medium"> matchar din profil perfekt</span>
            </p>
          </div>
          
          {/* Jobs Grid with Clay Design */}
          <div className="relative">
            {/* Background clay shape */}
            <div className="absolute -inset-8 bg-clay-surface-dark rounded-[3rem] shadow-clay-soft opacity-30"></div>
            
            <div className="relative grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {featuredJobs.map((job, index) => (
                <div key={index} className="group animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                  <div className="relative">
                    {/* Clay card shadow */}
                    <div className="absolute inset-0 bg-clay-surface-dark rounded-2xl shadow-clay-medium group-hover:shadow-clay-strong transition-all duration-500"></div>
                    
                    <JobCard
                      {...job}
                      className="relative transform hover:-translate-y-2 transition-all duration-500 bg-clay-surface border-2 border-clay-surface-dark hover:border-clay-accent shadow-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Clay-style CTA Button */}
          <div className="text-center mt-16 animate-fade-in" style={{animationDelay: '0.6s'}}>
            <div className="relative inline-block group">
              <div className="absolute inset-0 bg-clay-primary rounded-2xl shadow-clay-medium group-hover:shadow-clay-strong transition-all duration-500"></div>
              <Link to="/jobs">
                <Button 
                  variant="hero" 
                  size="lg" 
                  className="relative px-8 py-4 text-lg font-semibold transform hover:scale-105 transition-all duration-300 bg-clay-primary hover:bg-clay-accent text-white border-0 shadow-clay-inset"
                >
                  <span className="flex items-center gap-3">
                    Utforska alla jobb
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </Button>
              </Link>
            </div>
            
            {/* Clay-styled stats */}
            <div className="flex justify-center items-center gap-8 mt-8 text-sm text-clay-text-light">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-clay-accent rounded-full animate-pulse shadow-clay-soft"></div>
                <span>Nya jobb varje dag</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-clay-primary rounded-full animate-pulse shadow-clay-soft"></div>
                <span>AI-matchade rekommendationer</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom decorative line */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent"></div>
      </section>

      {/* Companies Section - Clay Style */}
      <section className="py-16 bg-clay-surface-dark">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-clay-text mb-4">
              Företag som rekryterar
            </h2>
            <p className="text-clay-text-light max-w-2xl mx-auto">
              Anslut dig till Sveriges mest innovativa företag
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company, index) => (
              <CompanyCard
                key={index}
                {...company}
                className="animate-fade-in shadow-clay-soft hover:shadow-clay-medium transition-all duration-300 bg-clay-surface border-2 border-clay-surface hover:border-clay-accent rounded-3xl"
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Clay Style */}
      <section className="relative py-20 bg-gradient-hero overflow-hidden">
        {/* Clay decorative shapes */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-1/4 w-72 h-72 bg-clay-accent/30 rounded-[4rem] rotate-12 shadow-clay-soft animate-float opacity-40"></div>
          <div className="absolute bottom-10 right-1/4 w-80 h-64 bg-clay-primary/20 rounded-[3rem] -rotate-6 shadow-clay-medium animate-float opacity-50" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6 drop-shadow-lg">
            Redo att ta nästa steg?
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto drop-shadow">
            Gå med i miljontals jobbsökare som redan hittat sin drömkarriär genom vår plattform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="secondary" 
              size="lg" 
              className="font-semibold bg-white text-clay-primary hover:bg-clay-surface shadow-clay-medium hover:shadow-clay-strong border-0 rounded-2xl"
            >
              Skapa profil
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur bg-white/5 rounded-2xl shadow-clay-soft"
            >
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