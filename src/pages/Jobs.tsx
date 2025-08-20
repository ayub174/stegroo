import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { JobCard } from "@/components/ui/job-card";
import { SearchBar } from "@/components/ui/search-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Filter, MapPin, Clock, Building2 } from "lucide-react";

// Extensive dummy job data (30 jobs)
const allJobs = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    company: "TechVision AB",
    location: "Stockholm",
    salary: "55 000 - 70 000 kr/mån",
    type: "Heltid",
    timePosted: "2 dagar sedan",
    tags: ["React", "TypeScript", "Next.js", "GraphQL"],
    description: "Vi söker en erfaren frontend-utvecklare för att bygga nästa generations webbapplikationer."
  },
  {
    id: "2",
    title: "UX/UI Designer",
    company: "Creative Studio",
    location: "Göteborg",
    salary: "45 000 - 55 000 kr/mån",
    type: "Heltid",
    timePosted: "1 dag sedan",
    tags: ["Figma", "Adobe XD", "Prototyping", "User Research"],
    description: "Designa användarupplevelser som förändrar hur människor interagerar med teknik."
  },
  {
    id: "3",
    title: "DevOps Engineer",
    company: "CloudFirst Solutions",
    location: "Malmö",
    salary: "60 000 - 75 000 kr/mån",
    type: "Heltid",
    timePosted: "3 dagar sedan",
    tags: ["AWS", "Docker", "Kubernetes", "Terraform"],
    description: "Automatisera och optimera vår molninfrastruktur för skalbarhet och tillförlitlighet."
  },
  {
    id: "4",
    title: "Data Scientist",
    company: "Analytics Pro",
    location: "Stockholm",
    salary: "65 000 - 80 000 kr/mån",
    type: "Heltid",
    timePosted: "1 vecka sedan",
    tags: ["Python", "Machine Learning", "SQL", "Tableau"],
    description: "Utvinna insikter från data för att driva affärsbeslut och innovation."
  },
  {
    id: "5",
    title: "Backend Developer",
    company: "ServerWorks Inc",
    location: "Uppsala",
    salary: "50 000 - 65 000 kr/mån",
    type: "Heltid",
    timePosted: "4 dagar sedan",
    tags: ["Node.js", "MongoDB", "Express", "REST API"],
    description: "Utveckla robusta backend-system som hanterar miljontals användare dagligen."
  },
  {
    id: "6",
    title: "Product Manager",
    company: "InnovateNow",
    location: "Stockholm",
    salary: "70 000 - 90 000 kr/mån",
    type: "Heltid",
    timePosted: "2 dagar sedan",
    tags: ["Agile", "Scrum", "Product Strategy", "Analytics"],
    description: "Leda produktutveckling från ide till lansering för våra digitala plattformar."
  },
  {
    id: "7",
    title: "Cybersecurity Specialist",
    company: "SecureTech AB",
    location: "Göteborg",
    salary: "60 000 - 75 000 kr/mån",
    type: "Heltid",
    timePosted: "5 dagar sedan",
    tags: ["Penetration Testing", "CISSP", "Network Security", "Incident Response"],
    description: "Skydda vår organisation mot cyberhot och säkerställ dataintegritet."
  },
  {
    id: "8",
    title: "Mobile App Developer",
    company: "AppCreators",
    location: "Lund",
    salary: "48 000 - 62 000 kr/mån",
    type: "Heltid",
    timePosted: "1 dag sedan",
    tags: ["React Native", "iOS", "Android", "Flutter"],
    description: "Skapa nästa generations mobilapplikationer för iOS och Android."
  },
  {
    id: "9",
    title: "AI/ML Engineer",
    company: "FutureAI Solutions",
    location: "Stockholm",
    salary: "70 000 - 85 000 kr/mån",
    type: "Heltid",
    timePosted: "3 dagar sedan",
    tags: ["TensorFlow", "PyTorch", "Deep Learning", "Computer Vision"],
    description: "Utveckla AI-lösningar som formar framtiden inom olika industrier."
  },
  {
    id: "10",
    title: "Full Stack Developer",
    company: "WebSolutions Pro",
    location: "Västerås",
    salary: "52 000 - 67 000 kr/mån",
    type: "Heltid",
    timePosted: "6 dagar sedan",
    tags: ["React", "Node.js", "PostgreSQL", "TypeScript"],
    description: "Jobba med hela teknikstacken för att leverera kompletta webblösningar."
  },
  {
    id: "11",
    title: "Marketing Manager",
    company: "GrowthHack Media",
    location: "Stockholm",
    salary: "55 000 - 70 000 kr/mån",
    type: "Heltid",
    timePosted: "2 dagar sedan",
    tags: ["Digital Marketing", "SEO", "Social Media", "Analytics"],
    description: "Utveckla och genomför marknadsföringsstrategier för att driva tillväxt."
  },
  {
    id: "12",
    title: "QA Engineer",
    company: "QualityFirst Tech",
    location: "Linköping",
    salary: "45 000 - 58 000 kr/mån",
    type: "Heltid",
    timePosted: "4 dagar sedan",
    tags: ["Test Automation", "Selenium", "Jest", "CI/CD"],
    description: "Säkerställ kvalitet genom omfattande testning och automatisering."
  },
  {
    id: "13",
    title: "Business Analyst",
    company: "DataDriven Solutions",
    location: "Göteborg",
    salary: "50 000 - 65 000 kr/mån",
    type: "Heltid",
    timePosted: "1 vecka sedan",
    tags: ["Business Intelligence", "SQL", "Power BI", "Process Improvement"],
    description: "Analysera affärsprocesser och föreslå förbättringar baserat på data."
  },
  {
    id: "14",
    title: "Cloud Architect",
    company: "CloudNative AB",
    location: "Stockholm",
    salary: "75 000 - 95 000 kr/mån",
    type: "Heltid",
    timePosted: "3 dagar sedan",
    tags: ["Azure", "AWS", "Microservices", "System Design"],
    description: "Designa och implementera skalbar molnarkitektur för enterprise-lösningar."
  },
  {
    id: "15",
    title: "Content Creator",
    company: "Creative Content Co",
    location: "Malmö",
    salary: "35 000 - 45 000 kr/mån",
    type: "Heltid",
    timePosted: "2 dagar sedan",
    tags: ["Content Writing", "Video Production", "Social Media", "Adobe Creative"],
    description: "Skapa engagerande innehåll för digitala plattformar och sociala medier."
  },
  {
    id: "16",
    title: "Sales Representative",
    company: "SalesPro Nordic",
    location: "Stockholm",
    salary: "40 000 - 60 000 kr/mån + provision",
    type: "Heltid",
    timePosted: "5 dagar sedan",
    tags: ["B2B Sales", "CRM", "Lead Generation", "Negotiation"],
    description: "Driva försäljning och bygga långsiktiga kundrelationer inom B2B-marknaden."
  },
  {
    id: "17",
    title: "HR Manager",
    company: "PeopleFirst AB",
    location: "Göteborg",
    salary: "55 000 - 70 000 kr/mån",
    type: "Heltid",
    timePosted: "1 dag sedan",
    tags: ["Recruitment", "Employee Relations", "Performance Management", "HR Systems"],
    description: "Leda HR-processer och skapa en positiv arbetsmiljö för våra medarbetare."
  },
  {
    id: "18",
    title: "Financial Analyst",
    company: "FinanceFlow Solutions",
    location: "Stockholm",
    salary: "50 000 - 65 000 kr/mån",
    type: "Heltid",
    timePosted: "4 dagar sedan",
    tags: ["Financial Modeling", "Excel", "Budgeting", "Forecasting"],
    description: "Analysera finansiell data och stödja strategiska affärsbeslut."
  },
  {
    id: "19",
    title: "Graphic Designer",
    company: "Visual Impact Studio",
    location: "Lund",
    salary: "38 000 - 48 000 kr/mån",
    type: "Heltid",
    timePosted: "3 dagar sedan",
    tags: ["Adobe Illustrator", "Photoshop", "InDesign", "Brand Design"],
    description: "Skapa visuell identitet och designlösningar för varumärken och kampanjer."
  },
  {
    id: "20",
    title: "Project Manager",
    company: "ProjectPro Consulting",
    location: "Västerås",
    salary: "60 000 - 75 000 kr/mån",
    type: "Heltid",
    timePosted: "6 dagar sedan",
    tags: ["PMP", "Agile", "Risk Management", "Stakeholder Management"],
    description: "Leda komplexa projekt från start till avslut och säkerställ leverans i tid."
  },
  {
    id: "21",
    title: "Systems Administrator",
    company: "IT Infrastructure Ltd",
    location: "Uppsala",
    salary: "48 000 - 62 000 kr/mån",
    type: "Heltid",
    timePosted: "2 dagar sedan",
    tags: ["Linux", "Windows Server", "VMware", "Network Administration"],
    description: "Administrera och underhålla IT-infrastruktur för optimal prestanda och säkerhet."
  },
  {
    id: "22",
    title: "Customer Success Manager",
    company: "ClientCare Solutions",
    location: "Stockholm",
    salary: "50 000 - 65 000 kr/mån",
    type: "Heltid",
    timePosted: "1 vecka sedan",
    tags: ["Customer Relations", "SaaS", "Onboarding", "Account Management"],
    description: "Säkerställ kundnöjdhet och driva retention genom proaktiv kundvård."
  },
  {
    id: "23",
    title: "Network Engineer",
    company: "NetworkPro AB",
    location: "Göteborg",
    salary: "55 000 - 70 000 kr/mån",
    type: "Heltid",
    timePosted: "4 dagar sedan",
    tags: ["Cisco", "CCNA", "Network Design", "Troubleshooting"],
    description: "Designa och underhålla nätverksinfrastruktur för optimal konnektivitet."
  },
  {
    id: "24",
    title: "Technical Writer",
    company: "DocuTech Solutions",
    location: "Linköping",
    salary: "42 000 - 55 000 kr/mån",
    type: "Heltid",
    timePosted: "3 dagar sedan",
    tags: ["Technical Documentation", "API Documentation", "Markdown", "Git"],
    description: "Skapa tydlig och användbar teknisk dokumentation för utvecklare och slutanvändare."
  },
  {
    id: "25",
    title: "Database Administrator",
    company: "DataBase Experts",
    location: "Malmö",
    salary: "58 000 - 72 000 kr/mån",
    type: "Heltid",
    timePosted: "5 dagar sedan",
    tags: ["MySQL", "PostgreSQL", "Oracle", "Database Optimization"],
    description: "Administrera och optimera databaser för maximala prestanda och tillförlitlighet."
  },
  {
    id: "26",
    title: "Scrum Master",
    company: "AgileWorks AB",
    location: "Stockholm",
    salary: "60 000 - 75 000 kr/mån",
    type: "Heltid",
    timePosted: "2 dagar sedan",
    tags: ["Scrum", "Agile Coaching", "Team Leadership", "Sprint Planning"],
    description: "Facilitera agila processer och hjälpa team att leverera värde effektivt."
  },
  {
    id: "27",
    title: "SEO Specialist",
    company: "SearchOptimize Pro",
    location: "Göteborg",
    salary: "40 000 - 52 000 kr/mån",
    type: "Heltid",
    timePosted: "1 dag sedan",
    tags: ["SEO", "Google Analytics", "Keyword Research", "Content Optimization"],
    description: "Optimera webbplatser för sökmotor för att öka organisk trafik och synlighet."
  },
  {
    id: "28",
    title: "Operations Manager",
    company: "OpEx Solutions",
    location: "Uppsala",
    salary: "65 000 - 80 000 kr/mån",
    type: "Heltid",
    timePosted: "6 dagar sedan",
    tags: ["Operations Management", "Process Optimization", "Supply Chain", "Lean"],
    description: "Optimera operativa processer för att förbättra effektivitet och kvalitet."
  },
  {
    id: "29",
    title: "React Developer",
    company: "Frontend Masters",
    location: "Lund",
    salary: "50 000 - 64 000 kr/mån",
    type: "Heltid",
    timePosted: "3 dagar sedan",
    tags: ["React", "Redux", "JavaScript", "CSS"],
    description: "Utveckla moderna webbapplikationer med React och relaterade teknologier."
  },
  {
    id: "30",
    title: "IT Support Specialist",
    company: "TechSupport Nordic",
    location: "Västerås",
    salary: "35 000 - 45 000 kr/mån",
    type: "Heltid",
    timePosted: "4 dagar sedan",
    tags: ["Help Desk", "Windows", "Hardware Support", "ITIL"],
    description: "Tillhandahålla teknisk support och lösningar för användare och system."
  }
];

const Jobs = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const locationQuery = searchParams.get('location') || '';
  
  const [sortBy, setSortBy] = useState('relevance');
  const [filterByType, setFilterByType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 12;

  // Filter jobs based on search parameters
  const filteredJobs = allJobs.filter(job => {
    const matchesSearch = searchQuery === '' || 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesLocation = locationQuery === '' || 
      job.location.toLowerCase().includes(locationQuery.toLowerCase());
    
    const matchesType = filterByType === 'all' || job.type === filterByType;
    
    return matchesSearch && matchesLocation && matchesType;
  });

  // Sort jobs
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (sortBy === 'newest') {
      // Sort by time posted (newer first)
      const timeOrder = ['1 dag sedan', '2 dagar sedan', '3 dagar sedan', '4 dagar sedan', '5 dagar sedan', '6 dagar sedan', '1 vecka sedan'];
      const aIndex = timeOrder.indexOf(a.timePosted);
      const bIndex = timeOrder.indexOf(b.timePosted);
      return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
    }
    if (sortBy === 'salary') {
      const aSalary = parseInt(a.salary?.replace(/\D/g, '') || '0');
      const bSalary = parseInt(b.salary?.replace(/\D/g, '') || '0');
      return bSalary - aSalary;
    }
    return 0; // relevance (default order)
  });

  // Pagination
  const totalPages = Math.ceil(sortedJobs.length / jobsPerPage);
  const startIndex = (currentPage - 1) * jobsPerPage;
  const currentJobs = sortedJobs.slice(startIndex, startIndex + jobsPerPage);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section with Search */}
      <section className="relative py-16 bg-gradient-hero overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-24 h-24 bg-secondary/10 rounded-full blur-xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-accent/10 rounded-full blur-xl animate-pulse delay-500"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-primary-foreground mb-4">
              {searchQuery || locationQuery ? 'Sökresultat' : 'Alla jobb'}
            </h1>
            {(searchQuery || locationQuery) && (
              <p className="text-lg text-primary-foreground/90 mb-2">
                {filteredJobs.length} jobb hittade
                {searchQuery && ` för "${searchQuery}"`}
                {locationQuery && ` i ${locationQuery}`}
              </p>
            )}
          </div>
          
          <div className="flex justify-center">
            <SearchBar className="max-w-4xl" />
          </div>
        </div>
      </section>

      {/* Filters and Results */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Filters Bar */}
          <div className="backdrop-blur-xl bg-card/40 border border-border/50 rounded-2xl p-6 mb-8 shadow-glass">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Filter className="h-4 w-4" />
                  <span className="font-medium">Filtrera resultat:</span>
                </div>
                
                <Select value={filterByType} onValueChange={setFilterByType}>
                  <SelectTrigger className="w-48 bg-background/50 border-border/50">
                    <SelectValue placeholder="Anställningstyp" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alla typer</SelectItem>
                    <SelectItem value="Heltid">Heltid</SelectItem>
                    <SelectItem value="Deltid">Deltid</SelectItem>
                    <SelectItem value="Konsult">Konsult</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="text-muted-foreground text-sm">
                  Visar {startIndex + 1}-{Math.min(startIndex + jobsPerPage, sortedJobs.length)} av {sortedJobs.length} jobb
                </span>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48 bg-background/50 border-border/50">
                    <SelectValue placeholder="Sortera efter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevans</SelectItem>
                    <SelectItem value="newest">Senaste</SelectItem>
                    <SelectItem value="salary">Lön</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Jobs Grid */}
          {currentJobs.length > 0 ? (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
                {currentJobs.map((job, index) => (
                  <JobCard
                    key={job.id}
                    {...job}
                    className={`animate-fade-in`}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="bg-background/50 border-border/50"
                  >
                    Föregående
                  </Button>
                  
                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <Button
                        key={page}
                        variant={page === currentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className={page === currentPage ? "" : "bg-background/50 border-border/50"}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="bg-background/50 border-border/50"
                  >
                    Nästa
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <div className="backdrop-blur-xl bg-card/40 border border-border/50 rounded-2xl p-12 shadow-glass max-w-md mx-auto">
                <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Inga jobb hittade
                </h3>
                <p className="text-muted-foreground mb-6">
                  Försök med andra sökord eller filtrera mindre specifikt.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setFilterByType('all');
                    window.location.href = '/jobs';
                  }}
                  className="bg-background/50 border-border/50"
                >
                  Visa alla jobb
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Jobs;