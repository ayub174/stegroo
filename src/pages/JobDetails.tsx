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
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link to="/" className="group inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-card/50 border border-border/30 text-muted-foreground hover:text-primary hover:bg-card/80 hover:border-primary/20 hover:shadow-card transition-all duration-300 hover:scale-105">
            <ChevronLeft className="h-4 w-4 group-hover:translate-x-[-2px] transition-transform duration-300" />
            <span className="font-medium">Tillbaka till jobb</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Job Header */}
            <Card className="border-border/50">
              <CardContent className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-foreground mb-4">
                      {currentJob.title}
                    </h1>
                    <div className="flex items-center gap-6 text-muted-foreground mb-4">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        <span className="font-medium text-lg">{currentJob.company}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        <span>{currentJob.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        <span>{currentJob.timePosted}</span>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-primary mb-4">
                      {currentJob.salary}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="font-medium">
                        {currentJob.type}
                      </Badge>
                      {currentJob.tags.map((tag, index) => (
                        <Badge key={index} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button variant="ghost" size="icon">
                      <Share2 className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Bookmark className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <Button variant="hero" size="lg" className="px-8">
                    Ansök nu
                  </Button>
                  <Button variant="outline" size="lg">
                    Spara jobb
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Job Description */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Om rollen
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {currentJob.description}
                </p>
              </CardContent>
            </Card>

            {/* Responsibilities */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  Arbetsuppgifter
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {currentJob.responsibilities.map((responsibility, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0"></div>
                      <span className="text-muted-foreground">{responsibility}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Krav
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Grundläggande krav:</h4>
                  <ul className="space-y-2">
                    {currentJob.requirements.map((requirement, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-4 w-4 text-success mt-0.5 shrink-0" />
                        <span className="text-muted-foreground">{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Meriterande:</h4>
                  <ul className="space-y-2">
                    {currentJob.preferred.map((preferred, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Star className="h-4 w-4 text-warning mt-0.5 shrink-0" />
                        <span className="text-muted-foreground">{preferred}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  Vad vi erbjuder
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {currentJob.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-gradient-subtle">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 shrink-0" />
                      <span className="text-muted-foreground text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Company Description */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  Om {currentJob.company}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {currentJob.companyDescription}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gradient-subtle rounded-lg">
                  <div className="text-center">
                    <div className="font-semibold text-foreground">{currentJob.companySize}</div>
                    <div className="text-sm text-muted-foreground">Anställda</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-foreground">{currentJob.founded}</div>
                    <div className="text-sm text-muted-foreground">Grundat</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-foreground">{currentJob.industry}</div>
                    <div className="text-sm text-muted-foreground">Bransch</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-foreground">
                      <Globe className="h-4 w-4 mx-auto" />
                    </div>
                    <div className="text-sm text-muted-foreground">Webbplats</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Card */}
            <Card className="border-border/50 sticky top-24">
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-4">Ansök om tjänsten</h3>
                <div className="space-y-4">
                  <Button variant="hero" className="w-full" size="lg">
                    Ansök nu
                  </Button>
                  <Button variant="outline" className="w-full">
                    Spara för senare
                  </Button>
                </div>
                <Separator className="my-4" />
                <div className="text-sm text-muted-foreground space-y-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>25 personer har ansökt</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Ansökan stänger: 30 dagar</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Related Jobs */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Liknande jobb</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {relatedJobs.map((job, index) => (
                  <div key={index} className="p-4 rounded-lg border border-border/50 hover:shadow-card transition-shadow">
                    <h4 className="font-medium text-foreground mb-1">{job.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{job.company} • {job.location}</p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {job.tags.map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{job.timePosted}</span>
                      <Button variant="ghost" size="sm">
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default JobDetails;