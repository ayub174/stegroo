import { useParams, Link } from "react-router-dom";
import { 
  MapPin, 
  Clock, 
  Building2, 
  Bookmark, 
  Share2, 
  ChevronLeft,
  Users,
  Calendar,
  Globe,
  CheckCircle,
  ArrowRight,
  Star,
  Award,
  Target,
  Heart
} from "lucide-react";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { JobCard } from "@/components/ui/job-card";

const JobDetails = () => {
  const { id } = useParams();

  // Dummy job data - In a real app, this would come from an API
  const jobData = {
    "1": {
      id: "1",
      title: "Senior Frontend Utvecklare",
      company: "TechCorp AB",
      location: "Stockholm",
      salary: "65 000 - 85 000 kr/mån",
      type: "Heltid",
      timePosted: "2 dagar sedan",
      tags: ["React", "TypeScript", "Remote OK"],
      companySize: "500-1000 anställda",
      industry: "Teknik & mjukvara",
      founded: "2015",
      website: "techcorp.se",
      description: "Vi söker en passionerad Senior Frontend Utvecklare som vill vara med och forma framtidens digitala upplevelser. Du kommer att arbeta i ett agilt team med de senaste teknologierna och få möjlighet att påverka både tekniska beslut och produktriktning.",
      responsibilities: [
        "Utveckla och underhålla webbapplikationer med React och TypeScript",
        "Samarbeta med designers för att implementera användarvänliga gränssnitt",
        "Optimera applikationer för prestanda och skalbarhet",
        "Mentora junior utvecklare och dela med dig av din kunskap",
        "Delta i kodgranskningar och tekniska diskussioner",
        "Bidra till arkitektoniska beslut och teknisk riktning"
      ],
      requirements: [
        "Minst 5 års erfarenhet av frontend-utveckling",
        "Expertkunskap inom React och TypeScript",
        "Erfarenhet av moderna utvecklingsverktyg (Webpack, Vite, etc.)",
        "Kunskap om testning (Jest, React Testing Library)",
        "Förståelse för UX/UI-principer",
        "Flyt i engelska, svenska är meriterande"
      ],
      preferred: [
        "Erfarenhet av Next.js eller liknande ramverk",
        "Kunskap om GraphQL och REST API:er",
        "Erfarenhet av CI/CD-pipelines",
        "Bakgrund inom agile/scrum",
        "Open source-bidrag"
      ],
      benefits: [
        "Konkurrenskraftig lön och bonus",
        "Flexibla arbetstider och remote-möjligheter",
        "Omfattande hälso- och friskvårdsförmåner",
        "Utbildningsbudget på 25 000 kr/år",
        "Moderna kontorslokaler i centrala Stockholm",
        "Pensionsavsättning och försäkringar",
        "Team events och afterwork",
        "Senaste tekniken och utrustning"
      ],
      companyDescription: "TechCorp AB är ett snabbväxande tech-företag som utvecklar innovativa SaaS-lösningar för enterprise-kunder. Vi tror på att teknik ska förenkla vardagen och hjälpa företag att nå sina mål. Med över 500 anställda över hela Norden är vi ett etablerat företag med startup-känsla."
    },
    "2": {
      id: "2",
      title: "UX/UI Designer",
      company: "Design Studio",
      location: "Göteborg",
      salary: "55 000 - 70 000 kr/mån",
      type: "Heltid",
      timePosted: "1 dag sedan", 
      tags: ["Figma", "Prototyping", "User Research"],
      companySize: "50-100 anställda",
      industry: "Design & kreativ",
      founded: "2018",
      website: "designstudio.se",
      description: "Vi letar efter en kreativ UX/UI Designer som brinner för att skapa exceptionella användarupplevelser. Du kommer att arbeta med spännande projekt för kända varumärken och få frihet att utforska nya designtrender.",
      responsibilities: [
        "Designa användarvänliga gränssnitt för webb och mobil",
        "Genomföra användarforskning och usability-tester",
        "Skapa wireframes, prototyper och designsystem",
        "Samarbeta med utvecklare för att säkerställa korrekt implementation",
        "Presentera designlösningar för kunder och stakeholders",
        "Hålla dig uppdaterad med senaste designtrender"
      ],
      requirements: [
        "Minst 3 års erfarenhet av UX/UI-design",
        "Expertkunskap i Figma och Adobe Creative Suite",
        "Stark portfolio som visar designprocess",
        "Erfarenhet av användarforskning och testmetoder",
        "Förståelse för frontend-utveckling (HTML/CSS)",
        "Utmärkt kommunikationsförmåga"
      ],
      preferred: [
        "Erfarenhet av motion design och prototyping",
        "Kunskap om tillgänglighet och WCAG",
        "Bakgrund inom service design",
        "Erfarenhet av agila arbetsmetoder",
        "Kunskap om designtokens och systemdesign"
      ],
      benefits: [
        "Kreativ och inspirerande arbetsmiljö",
        "Flexibla arbetstider",
        "Utbildning inom design och teknik",
        "Moderna designverktyg och utrustning",
        "Hälso- och friskvårdsförmåner",
        "Fri tillgång till designböcker och kurser",
        "Regelbundna team-aktiviteter"
      ],
      companyDescription: "Design Studio är en prisbelönt designbyrå som specialiserar sig på digital design och varumärkesbyggande. Vi arbetar med allt från startups till Fortune 500-företag och är stolta över vår människocentrerade designfilosofi."
    }
  };

  const currentJob = jobData[id as keyof typeof jobData];

  // Related jobs for the sidebar
  const relatedJobs = [
    {
      title: "Frontend Utvecklare",
      company: "StartupTech",
      location: "Stockholm",
      type: "Heltid",
      timePosted: "3 dagar sedan",
      tags: ["Vue.js", "JavaScript"]
    },
    {
      title: "Fullstack Utvecklare",
      company: "WebAgency",
      location: "Malmö",
      type: "Heltid", 
      timePosted: "1 vecka sedan",
      tags: ["React", "Node.js"]
    }
  ];

  if (!currentJob) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Jobbet kunde inte hittas</h1>
          <Link to="/">
            <Button variant="outline">Tillbaka till startsidan</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="min-h-screen relative overflow-hidden">
        {/* Blue Background Effects */}
        <div className="fixed inset-0 z-0">
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-100 rounded-full opacity-30 animate-float"></div>
          <div className="absolute top-60 right-20 w-80 h-80 bg-blue-50 rounded-full opacity-25 animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-40 left-1/3 w-72 h-72 bg-blue-200 rounded-full opacity-20 animate-float" style={{animationDelay: '4s'}}></div>
          
          {/* Subtle pattern */}
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: `radial-gradient(circle, rgb(59 130 246) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        <div className="container mx-auto px-4 py-8 relative z-10">
          {/* Back Navigation */}
          <div className="mb-8 animate-fade-in">
            <Link to="/" className="group inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white shadow-lg border border-gray-200 text-gray-600 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-300 hover:shadow-xl transition-all duration-500 hover:scale-105">
              <ChevronLeft className="h-5 w-5 group-hover:translate-x-[-4px] transition-transform duration-300" />
              <span className="font-semibold">Tillbaka till jobb</span>
            </Link>
          </div>

          {/* Main Container */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="xl:col-span-3 space-y-6">
              {/* Hero Job Card */}
              <div className="relative group animate-fade-in" style={{animationDelay: '0.1s'}}>
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-200/30 to-blue-300/30 rounded-3xl blur opacity-20 group-hover:opacity-40 transition-all duration-500"></div>
                
                <div className="relative bg-white shadow-xl border border-gray-200 rounded-3xl p-8 hover:shadow-2xl transition-all duration-500">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    {/* Job Info */}
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-3 mb-4">
                        <Badge variant="secondary" className="bg-blue-50 text-blue-600 border-blue-200 font-medium px-3 py-1">
                          {currentJob.type}
                        </Badge>
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-sm text-green-400 font-medium">Aktivt</span>
                      </div>
                      
                      <h1 className="text-4xl lg:text-5xl font-black text-gray-900 leading-tight">
                        {currentJob.title}
                      </h1>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
                        <div className="flex items-center gap-3 text-gray-600">
                          <div className="p-2 rounded-xl bg-blue-50">
                            <Building2 className="h-4 w-4 text-blue-600" />
                          </div>
                          <span className="font-medium">{currentJob.company}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-600">
                          <div className="p-2 rounded-xl bg-blue-50">
                            <MapPin className="h-4 w-4 text-blue-600" />
                          </div>
                          <span className="font-medium">{currentJob.location}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-600">
                          <div className="p-2 rounded-xl bg-blue-50">
                            <Clock className="h-4 w-4 text-blue-600" />
                          </div>
                          <span className="font-medium">{currentJob.timePosted}</span>
                        </div>
                      </div>
                      
                      <div className="text-3xl font-bold text-blue-600">
                        {currentJob.salary}
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {currentJob.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="bg-gray-50 border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3 lg:min-w-[200px]">
                      <Button variant="hero" size="lg" className="w-full font-semibold px-8 py-4 hover:scale-105 transition-all duration-300 shadow-xl bg-blue-600 hover:bg-blue-700">
                        Ansök nu
                      </Button>
                      <div className="flex gap-2">
                        <Button variant="outline" className="flex-1 bg-white border-gray-200 hover:bg-gray-50">
                          Spara
                        </Button>
                        <Button variant="ghost" size="icon" className="bg-gray-50 hover:bg-gray-100">
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="bg-gray-50 hover:bg-gray-100">
                          <Bookmark className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Compact Info Grid - Glassmorphism */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* About & Responsibilities */}
                <div className="space-y-6">
                  {/* About Role */}
                  <div className="relative group animate-fade-in" style={{animationDelay: '0.2s'}}>
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur opacity-10 group-hover:opacity-30 transition-all duration-500"></div>
                    <div className="relative bg-white/8 backdrop-blur-xl border border-white/15 rounded-2xl p-6 hover:bg-white/12 transition-all duration-500">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-xl bg-primary/20 backdrop-blur-sm">
                          <Target className="h-5 w-5 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground">Om rollen</h3>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        {currentJob.description}
                      </p>
                    </div>
                  </div>

                  {/* Responsibilities */}
                  <div className="relative group animate-fade-in" style={{animationDelay: '0.3s'}}>
                    <div className="absolute -inset-1 bg-gradient-to-r from-accent/20 to-primary/20 rounded-2xl blur opacity-10 group-hover:opacity-30 transition-all duration-500"></div>
                    <div className="relative bg-white/8 backdrop-blur-xl border border-white/15 rounded-2xl p-6 hover:bg-white/12 transition-all duration-500">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-xl bg-accent/20 backdrop-blur-sm">
                          <CheckCircle className="h-5 w-5 text-accent" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground">Arbetsuppgifter</h3>
                      </div>
                      <div className="space-y-3">
                        {currentJob.responsibilities.slice(0, 4).map((responsibility, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 bg-gradient-to-r from-primary to-accent rounded-full mt-2.5 shrink-0"></div>
                            <span className="text-muted-foreground text-sm leading-relaxed">{responsibility}</span>
                          </div>
                        ))}
                        {currentJob.responsibilities.length > 4 && (
                          <div className="text-primary/80 text-sm font-medium mt-2">
                            +{currentJob.responsibilities.length - 4} fler uppgifter
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Requirements & Benefits */}
                <div className="space-y-6">
                  {/* Requirements */}
                  <div className="relative group animate-fade-in" style={{animationDelay: '0.4s'}}>
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur opacity-10 group-hover:opacity-30 transition-all duration-500"></div>
                    <div className="relative bg-white/8 backdrop-blur-xl border border-white/15 rounded-2xl p-6 hover:bg-white/12 transition-all duration-500">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-xl bg-primary/20 backdrop-blur-sm">
                          <Award className="h-5 w-5 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground">Krav</h3>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-foreground mb-2 text-sm">Grundläggande:</h4>
                          <div className="space-y-2">
                            {currentJob.requirements.slice(0, 3).map((requirement, index) => (
                              <div key={index} className="flex items-start gap-2">
                                <CheckCircle className="h-3 w-3 text-green-400 mt-1 shrink-0" />
                                <span className="text-muted-foreground text-xs leading-relaxed">{requirement}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground mb-2 text-sm">Meriterande:</h4>
                          <div className="space-y-2">
                            {currentJob.preferred.slice(0, 2).map((preferred, index) => (
                              <div key={index} className="flex items-start gap-2">
                                <Star className="h-3 w-3 text-yellow-400 mt-1 shrink-0" />
                                <span className="text-muted-foreground text-xs leading-relaxed">{preferred}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="relative group animate-fade-in" style={{animationDelay: '0.5s'}}>
                    <div className="absolute -inset-1 bg-gradient-to-r from-accent/20 to-primary/20 rounded-2xl blur opacity-10 group-hover:opacity-30 transition-all duration-500"></div>
                    <div className="relative bg-white/8 backdrop-blur-xl border border-white/15 rounded-2xl p-6 hover:bg-white/12 transition-all duration-500">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-xl bg-accent/20 backdrop-blur-sm">
                          <Heart className="h-5 w-5 text-accent" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground">Förmåner</h3>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {currentJob.benefits.slice(0, 6).map((benefit, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 rounded-lg bg-white/5 backdrop-blur-sm">
                            <CheckCircle className="h-3 w-3 text-green-400 shrink-0" />
                            <span className="text-muted-foreground text-xs">{benefit}</span>
                          </div>
                        ))}
                        {currentJob.benefits.length > 6 && (
                          <div className="text-primary/80 text-xs font-medium mt-1">
                            +{currentJob.benefits.length - 6} fler förmåner
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Company Info - Compact */}
              <div className="relative group animate-fade-in" style={{animationDelay: '0.6s'}}>
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur opacity-10 group-hover:opacity-30 transition-all duration-500"></div>
                <div className="relative bg-white/8 backdrop-blur-xl border border-white/15 rounded-2xl p-6 hover:bg-white/12 transition-all duration-500">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-xl bg-primary/20 backdrop-blur-sm">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">Om {currentJob.company}</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-4 text-sm">
                    {currentJob.companyDescription}
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: "Anställda", value: currentJob.companySize },
                      { label: "Grundat", value: currentJob.founded },
                      { label: "Bransch", value: currentJob.industry },
                      { label: "Webbplats", value: "Besök", icon: Globe }
                    ].map(({ label, value, icon: Icon }, index) => (
                      <div key={index} className="text-center p-3 rounded-xl bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                        <div className="font-semibold text-foreground text-sm flex items-center justify-center gap-1">
                          {Icon && <Icon className="h-3 w-3" />}
                          {value}
                        </div>
                        <div className="text-xs text-muted-foreground">{label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar - Glassmorphic Redesign */}
            <div className="xl:col-span-1 space-y-6">
              {/* Apply Card - Glassmorphism */}
              <div className="relative group animate-fade-in sticky top-24" style={{animationDelay: '0.7s'}}>
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-accent/30 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-all duration-500"></div>
                
                <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-500">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-xl bg-primary/20 backdrop-blur-sm">
                      <Target className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">Ansök nu</h3>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <Button variant="hero" size="lg" className="w-full font-semibold py-4 hover:scale-105 transition-all duration-300 shadow-2xl">
                      Skicka ansökan
                    </Button>
                    <Button variant="outline" className="w-full bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20">
                      <Bookmark className="h-4 w-4 mr-2" />
                      Spara för senare
                    </Button>
                  </div>
                  
                  <div className="pt-4 border-t border-white/20">
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <div className="p-1.5 rounded-lg bg-primary/10 backdrop-blur-sm">
                          <Users className="h-3 w-3 text-primary" />
                        </div>
                        <span>25 personer har ansökt</span>
                      </div>
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <div className="p-1.5 rounded-lg bg-accent/10 backdrop-blur-sm">
                          <Calendar className="h-3 w-3 text-accent" />
                        </div>
                        <span>Stänger om 30 dagar</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Related Jobs - Glassmorphism */}
              <div className="relative group animate-fade-in" style={{animationDelay: '0.8s'}}>
                <div className="absolute -inset-1 bg-gradient-to-r from-accent/20 to-primary/20 rounded-2xl blur opacity-10 group-hover:opacity-30 transition-all duration-500"></div>
                
                <div className="relative bg-white/8 backdrop-blur-xl border border-white/15 rounded-2xl p-6 hover:bg-white/12 transition-all duration-500">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-xl bg-accent/20 backdrop-blur-sm">
                      <Star className="h-5 w-5 text-accent" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">Liknande jobb</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {relatedJobs.map((job, index) => (
                      <div key={index} className="group cursor-pointer">
                        <div className="relative p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                          <h4 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                            {job.title}
                          </h4>
                          <p className="text-sm text-muted-foreground mb-3">
                            {job.company} • {job.location}
                          </p>
                          <div className="flex flex-wrap gap-1 mb-3">
                            {job.tags.map((tag, tagIndex) => (
                              <Badge key={tagIndex} variant="outline" className="text-xs bg-white/5 backdrop-blur-sm border-white/20">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">{job.timePosted}</span>
                            <ArrowRight className="h-3 w-3 text-primary group-hover:translate-x-1 transition-transform duration-300" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default JobDetails;