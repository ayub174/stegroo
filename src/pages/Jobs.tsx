import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { JobListItem } from "@/components/ui/job-list-item";
import { SearchBar } from "@/components/ui/search-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Filter, MapPin, Clock, Building2, TrendingUp, Users, Briefcase, Star } from "lucide-react";

// Extensive dummy job data (30 jobs)
const allJobs = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    company: "TechVision AB",
    location: "Stockholm",
    deadline: "5 dagar kvar",
    type: "Heltid",
    timePosted: "2 dagar sedan",
    tags: ["React", "TypeScript", "Next.js", "GraphQL"],
    logo: "/placeholder.svg",
    description: "Vi söker en erfaren frontend-utvecklare för att bygga nästa generations webbapplikationer."
  },
  {
    id: "2",
    title: "UX/UI Designer",
    company: "Creative Studio",
    location: "Göteborg",
    deadline: "2 dagar kvar",
    type: "Heltid",
    timePosted: "1 dag sedan",
    tags: ["Figma", "Adobe XD", "Prototyping", "User Research"],
    logo: "/placeholder.svg",
    description: "Designa användarupplevelser som förändrar hur människor interagerar med teknik."
  },
  {
    id: "3",
    title: "DevOps Engineer",
    company: "CloudFirst Solutions",
    location: "Malmö",
    deadline: "8 dagar kvar",
    type: "Heltid",
    timePosted: "3 dagar sedan",
    tags: ["AWS", "Docker", "Kubernetes", "Terraform"],
    logo: "/placeholder.svg",
    description: "Automatisera och optimera vår molninfrastruktur för skalbarhet och tillförlitlighet."
  },
  {
    id: "4",
    title: "Data Scientist",
    company: "Analytics Pro",
    location: "Stockholm",
    deadline: "1 dag kvar",
    type: "Heltid",
    timePosted: "1 vecka sedan",
    tags: ["Python", "Machine Learning", "SQL", "Tableau"],
    logo: "/placeholder.svg",
    description: "Utvinna insikter från data för att driva affärsbeslut och innovation."
  },
  {
    id: "5",
    title: "Backend Developer",
    company: "ServerWorks Inc",
    location: "Uppsala",
    deadline: "6 dagar kvar",
    type: "Heltid",
    timePosted: "4 dagar sedan",
    tags: ["Node.js", "MongoDB", "Express", "REST API"],
    logo: "/placeholder.svg",
    description: "Utveckla robusta backend-system som hanterar miljontals användare dagligen."
  },
  {
    id: "6",
    title: "Product Manager",
    company: "InnovateNow",
    location: "Stockholm",
    deadline: "10 dagar kvar",
    type: "Heltid",
    timePosted: "2 dagar sedan",
    tags: ["Agile", "Scrum", "Product Strategy", "Analytics"],
    logo: "/placeholder.svg",
    description: "Leda produktutveckling från ide till lansering för våra digitala plattformar."
  },
  {
    id: "7",
    title: "Cybersecurity Specialist",
    company: "SecureTech AB",
    location: "Göteborg",
    deadline: "3 dagar kvar",
    type: "Heltid",
    timePosted: "5 dagar sedan",
    tags: ["Penetration Testing", "CISSP", "Network Security", "Incident Response"],
    logo: "/placeholder.svg",
    description: "Skydda vår organisation mot cyberhot och säkerställ dataintegritet."
  },
  {
    id: "8",
    title: "Mobile App Developer",
    company: "AppCreators",
    location: "Lund",
    deadline: "7 dagar kvar",
    type: "Heltid",
    timePosted: "1 dag sedan",
    tags: ["React Native", "iOS", "Android", "Flutter"],
    logo: "/placeholder.svg",
    description: "Skapa nästa generations mobilapplikationer för iOS och Android."
  },
  {
    id: "9",
    title: "AI/ML Engineer",
    company: "FutureAI Solutions",
    location: "Stockholm",
    deadline: "12 dagar kvar",
    type: "Heltid",
    timePosted: "3 dagar sedan",
    tags: ["TensorFlow", "PyTorch", "Deep Learning", "Computer Vision"],
    logo: "/placeholder.svg",
    description: "Utveckla AI-lösningar som formar framtiden inom olika industrier."
  },
  {
    id: "10",
    title: "Full Stack Developer",
    company: "WebSolutions Pro",
    location: "Västerås",
    deadline: "4 dagar kvar",
    type: "Heltid",
    timePosted: "6 dagar sedan",
    tags: ["React", "Node.js", "PostgreSQL", "TypeScript"],
    logo: "/placeholder.svg",
    description: "Jobba med hela teknikstacken för att leverera kompletta webblösningar."
  },
  {
    id: "11",
    title: "Marketing Manager",
    company: "GrowthHack Media",
    location: "Stockholm",
    deadline: "9 dagar kvar",
    type: "Heltid",
    timePosted: "2 dagar sedan",
    tags: ["Digital Marketing", "SEO", "Social Media", "Analytics"],
    logo: "/placeholder.svg",
    description: "Utveckla och genomför marknadsföringsstrategier för att driva tillväxt."
  },
  {
    id: "12",
    title: "QA Engineer",
    company: "QualityFirst Tech",
    location: "Linköping",
    deadline: "15 dagar kvar",
    type: "Heltid",
    timePosted: "4 dagar sedan",
    tags: ["Test Automation", "Selenium", "Jest", "CI/CD"],
    logo: "/placeholder.svg",
    description: "Säkerställ kvalitet genom omfattande testning och automatisering."
  },
  {
    id: "13",
    title: "Business Analyst",
    company: "DataDriven Solutions",
    location: "Göteborg",
    deadline: "11 dagar kvar",
    type: "Heltid",
    timePosted: "1 vecka sedan",
    tags: ["Business Intelligence", "SQL", "Power BI", "Process Improvement"],
    logo: "/placeholder.svg",
    description: "Analysera affärsprocesser och föreslå förbättringar baserat på data."
  },
  {
    id: "14",
    title: "Cloud Architect",
    company: "CloudNative AB",
    location: "Stockholm",
    deadline: "20 dagar kvar",
    type: "Heltid",
    timePosted: "3 dagar sedan",
    tags: ["Azure", "AWS", "Microservices", "System Design"],
    logo: "/placeholder.svg",
    description: "Designa och implementera skalbar molnarkitektur för enterprise-lösningar."
  },
  {
    id: "15",
    title: "Content Creator",
    company: "Creative Content Co",
    location: "Malmö",
    deadline: "3 dagar kvar",
    type: "Heltid",
    timePosted: "2 dagar sedan",
    tags: ["Content Writing", "Video Production", "Social Media", "Adobe Creative"],
    logo: "/placeholder.svg",
    description: "Skapa engagerande innehåll för digitala plattformar och sociala medier."
  },
  {
    id: "16",
    title: "Sales Representative",
    company: "SalesPro Nordic",
    location: "Stockholm",
    deadline: "14 dagar kvar",
    type: "Heltid",
    timePosted: "5 dagar sedan",
    tags: ["B2B Sales", "CRM", "Lead Generation", "Negotiation"],
    logo: "/placeholder.svg",
    description: "Driva försäljning och bygga långsiktiga kundrelationer inom B2B-marknaden."
  },
  {
    id: "17",
    title: "HR Manager",
    company: "PeopleFirst AB",
    location: "Göteborg",
    deadline: "7 dagar kvar",
    type: "Heltid",
    timePosted: "1 dag sedan",
    tags: ["Recruitment", "Employee Relations", "Performance Management", "HR Systems"],
    logo: "/placeholder.svg",
    description: "Leda HR-processer och skapa en positiv arbetsmiljö för våra medarbetare."
  },
  {
    id: "18",
    title: "Financial Analyst",
    company: "FinanceFlow Solutions",
    location: "Stockholm",
    deadline: "18 dagar kvar",
    type: "Heltid",
    timePosted: "4 dagar sedan",
    tags: ["Financial Modeling", "Excel", "Budgeting", "Forecasting"],
    logo: "/placeholder.svg",
    description: "Analysera finansiell data och stödja strategiska affärsbeslut."
  },
  {
    id: "19",
    title: "Graphic Designer",
    company: "Visual Impact Studio",
    location: "Lund",
    deadline: "2 dagar kvar",
    type: "Heltid",
    timePosted: "3 dagar sedan",
    tags: ["Adobe Illustrator", "Photoshop", "InDesign", "Brand Design"],
    logo: "/placeholder.svg",
    description: "Skapa visuell identitet och designlösningar för varumärken och kampanjer."
  },
  {
    id: "20",
    title: "Project Manager",
    company: "ProjectPro Consulting",
    location: "Västerås",
    deadline: "22 dagar kvar",
    type: "Heltid",
    timePosted: "6 dagar sedan",
    tags: ["PMP", "Agile", "Risk Management", "Stakeholder Management"],
    logo: "/placeholder.svg",
    description: "Leda komplexa projekt från start till avslut och säkerställ leverans i tid."
  },
  {
    id: "21",
    title: "Systems Administrator",
    company: "IT Infrastructure Ltd",
    location: "Uppsala",
    deadline: "13 dagar kvar",
    type: "Heltid",
    timePosted: "2 dagar sedan",
    tags: ["Linux", "Windows Server", "VMware", "Network Administration"],
    logo: "/placeholder.svg",
    description: "Administrera och underhålla IT-infrastruktur för optimal prestanda och säkerhet."
  },
  {
    id: "22",
    title: "Customer Success Manager",
    company: "ClientCare Solutions",
    location: "Stockholm",
    deadline: "16 dagar kvar",
    type: "Heltid",
    timePosted: "1 vecka sedan",
    tags: ["Customer Relations", "SaaS", "Onboarding", "Account Management"],
    logo: "/placeholder.svg",
    description: "Säkerställ kundnöjdhet och driva retention genom proaktiv kundvård."
  },
  {
    id: "23",
    title: "Network Engineer",
    company: "NetworkPro AB",
    location: "Göteborg",
    deadline: "25 dagar kvar",
    type: "Heltid",
    timePosted: "4 dagar sedan",
    tags: ["Cisco", "CCNA", "Network Design", "Troubleshooting"],
    logo: "/placeholder.svg",
    description: "Designa och underhålla nätverksinfrastruktur för optimal konnektivitet."
  },
  {
    id: "24",
    title: "Technical Writer",
    company: "DocuTech Solutions",
    location: "Linköping",
    deadline: "8 dagar kvar",
    type: "Heltid",
    timePosted: "3 dagar sedan",
    tags: ["Technical Documentation", "API Documentation", "Markdown", "Git"],
    logo: "/placeholder.svg",
    description: "Skapa tydlig och användbar teknisk dokumentation för utvecklare och slutanvändare."
  },
  {
    id: "25",
    title: "Database Administrator",
    company: "DataBase Experts",
    location: "Malmö",
    deadline: "30 dagar kvar",
    type: "Heltid",
    timePosted: "5 dagar sedan",
    tags: ["MySQL", "PostgreSQL", "Oracle", "Database Optimization"],
    logo: "/placeholder.svg",
    description: "Administrera och optimera databaser för maximala prestanda och tillförlitlighet."
  },
  {
    id: "26",
    title: "Scrum Master",
    company: "AgileWorks AB",
    location: "Stockholm",
    deadline: "6 dagar kvar",
    type: "Heltid",
    timePosted: "2 dagar sedan",
    tags: ["Scrum", "Agile Coaching", "Team Leadership", "Sprint Planning"],
    logo: "/placeholder.svg",
    description: "Facilitera agila processer och hjälpa team att leverera värde effektivt."
  },
  {
    id: "27",
    title: "SEO Specialist",
    company: "SearchOptimize Pro",
    location: "Göteborg",
    deadline: "5 dagar kvar",
    type: "Heltid",
    timePosted: "1 dag sedan",
    tags: ["SEO", "Google Analytics", "Keyword Research", "Content Optimization"],
    logo: "/placeholder.svg",
    description: "Optimera webbplatser för sökmotor för att öka organisk trafik och synlighet."
  },
  {
    id: "28",
    title: "Operations Manager",
    company: "OpEx Solutions",
    location: "Uppsala",
    deadline: "21 dagar kvar",
    type: "Heltid",
    timePosted: "6 dagar sedan",
    tags: ["Operations Management", "Process Optimization", "Supply Chain", "Lean"],
    logo: "/placeholder.svg",
    description: "Optimera operativa processer för att förbättra effektivitet och kvalitet."
  },
  {
    id: "29",
    title: "React Developer",
    company: "Frontend Masters",
    location: "Lund",
    deadline: "17 dagar kvar",
    type: "Heltid",
    timePosted: "3 dagar sedan",
    tags: ["React", "Redux", "JavaScript", "CSS"],
    logo: "/placeholder.svg",
    description: "Utveckla moderna webbapplikationer med React och relaterade teknologier."
  },
  {
    id: "30",
    title: "IT Support Specialist",
    company: "TechSupport Nordic",
    location: "Västerås",
    deadline: "12 dagar kvar",
    type: "Heltid",
    timePosted: "4 dagar sedan",
    tags: ["Help Desk", "Windows", "Hardware Support", "ITIL"],
    logo: "/placeholder.svg",
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
      // For deadline sorting, convert to days and sort by urgency (fewer days first)
      const getDeadlineDays = (deadline: string) => parseInt(deadline.split(' ')[0]);
      const aDays = getDeadlineDays(a.deadline || '999 dagar kvar');
      const bDays = getDeadlineDays(b.deadline || '999 dagar kvar');
      return aDays - bDays;
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
      
      {/* Enhanced Hero Section with Advanced Glassmorphism */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Complex Dynamic Background Elements */}
        <div className="absolute inset-0 z-[1]">
          {/* Multiple floating geometric shapes with different animations */}
          <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-primary/12 to-accent/8 rounded-full blur-3xl animate-float"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-bl from-accent/10 to-primary/15 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-tr from-primary/8 to-accent/12 rounded-full blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
          <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-gradient-to-tl from-secondary/10 to-primary/8 rounded-full blur-2xl animate-float" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-40 right-10 w-32 h-32 bg-gradient-to-br from-accent/15 to-secondary/10 rounded-full blur-xl animate-float" style={{animationDelay: '3s'}}></div>
          
          {/* Advanced grid pattern with depth */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `radial-gradient(circle, hsl(var(--primary)) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}></div>
          
          {/* Subtle animated lines */}
          <div className="absolute inset-0 opacity-[0.05]">
            <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent animate-pulse"></div>
            <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent animate-pulse delay-1000"></div>
          </div>
        </div>
        
        {/* Multi-layer Background Gradients */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-background/98 via-background/90 via-primary/5 to-background/85"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/30 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-transparent to-background/70"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* Enhanced Status Badge */}
            <div className="flex justify-center mb-8 animate-fade-in">
              <div className="relative group">
                <Badge variant="secondary" className="relative group font-semibold text-sm hover:scale-105 transition-all duration-500 cursor-pointer bg-gradient-to-r from-primary/20 via-accent/15 to-primary/10 border border-primary/40 hover:border-primary/60 px-6 py-3 overflow-hidden backdrop-blur-sm">
                  {/* Dynamic background effects */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/25 to-accent/25 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur opacity-30 group-hover:opacity-50 transition-all duration-500"></div>
                  
                  {/* Content */}
                  <div className="relative z-10 flex items-center gap-3">
                    <div className="relative">
                      <Briefcase className="h-4 w-4 text-primary animate-pulse" />
                      <div className="absolute inset-0 animate-ping delay-500">
                        <Briefcase className="h-4 w-4 text-primary/30" />
                      </div>
                    </div>
                    <span className="font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      Jobbsökning
                    </span>
                    <div className="flex gap-1">
                      <div className="w-1 h-1 bg-primary rounded-full animate-bounce"></div>
                      <div className="w-1 h-1 bg-accent rounded-full animate-bounce delay-100"></div>
                      <div className="w-1 h-1 bg-primary rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </Badge>
              </div>
            </div>
            
            {/* Enhanced Title Section */}
            <div className="text-center mb-12 animate-fade-in" style={{animationDelay: '0.2s'}}>
              <h1 className="text-4xl lg:text-6xl font-black text-foreground mb-6 leading-tight">
                <span className="text-transparent bg-gradient-to-r from-primary via-accent to-primary bg-clip-text">
                  {searchQuery || locationQuery ? 'Sökresultat' : 'Alla jobb'}
                </span>
                {(searchQuery || locationQuery) && (
                  <span className="block text-foreground/90 mt-2 text-2xl lg:text-3xl">
                    {filteredJobs.length} träffar hittade
                  </span>
                )}
              </h1>
              
              {(searchQuery || locationQuery) && (
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                  {searchQuery && (
                    <div className="backdrop-blur-xl bg-card/40 border border-primary/30 rounded-full px-6 py-2 shadow-glass">
                      <span className="text-sm text-muted-foreground">Sökord: </span>
                      <span className="font-semibold text-primary">"{searchQuery}"</span>
                    </div>
                  )}
                  {locationQuery && (
                    <div className="backdrop-blur-xl bg-card/40 border border-accent/30 rounded-full px-6 py-2 shadow-glass">
                      <span className="text-sm text-muted-foreground">Plats: </span>
                      <span className="font-semibold text-accent">"{locationQuery}"</span>
                    </div>
                  )}
                </div>
              )}
              
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-fade-in" style={{animationDelay: '0.4s'}}>
                Upptäck din nästa karriärmöjlighet bland
                <span className="text-primary/80 font-medium"> {allJobs.length} handplockade jobb</span>
                <span className="text-muted-foreground/80"> från Sveriges främsta arbetsgivare</span>
              </p>
            </div>
            
            {/* Advanced Search Bar Container */}
            <div className="animate-fade-in" style={{animationDelay: '0.6s'}}>
              <div className="relative group">
                {/* Glow effect behind search bar */}
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 rounded-3xl blur-2xl opacity-50 group-hover:opacity-80 transition-all duration-700"></div>
                
                <div className="relative backdrop-blur-2xl bg-card/60 border border-border/50 rounded-3xl p-8 shadow-glass hover:shadow-glass-hover transition-all duration-500">
                  <SearchBar className="max-w-4xl mx-auto" />
                </div>
              </div>
            </div>

            {/* Enhanced Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 animate-fade-in" style={{animationDelay: '0.8s'}}>
              {[
                { icon: Building2, label: "Aktiva företag", value: "150+", color: "primary" },
                { icon: Users, label: "Nya jobb/vecka", value: "50+", color: "accent" },
                { icon: TrendingUp, label: "Matchningsgrad", value: "94%", color: "primary" },
                { icon: Star, label: "Nöjda användare", value: "4.8★", color: "accent" }
              ].map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="relative">
                    <div className="absolute -inset-2 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                    <div className="relative backdrop-blur-xl bg-card/30 border border-border/30 rounded-2xl p-6 hover:bg-card/50 transition-all duration-500">
                      <stat.icon className={`h-8 w-8 mx-auto mb-3 text-${stat.color} animate-pulse`} />
                      <div className={`text-2xl font-bold text-${stat.color} mb-2`}>{stat.value}</div>
                      <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Bottom decorative gradient line */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent"></div>
      </section>

      {/* Enhanced Filters and Results Section */}
      <section className="py-16 relative">
        {/* Background decoration */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-20 right-20 w-40 h-40 bg-primary/5 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-40 left-20 w-60 h-60 bg-accent/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Advanced Filters Bar */}
          <div className="relative group mb-12 animate-fade-in">
            {/* Glow effect */}
            <div className="absolute -inset-2 bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 rounded-3xl blur-xl opacity-50 group-hover:opacity-80 transition-all duration-700"></div>
            
            <div className="relative backdrop-blur-2xl bg-card/50 border border-border/40 rounded-3xl p-8 shadow-glass hover:shadow-glass-hover transition-all duration-500">
              <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Filter className="h-5 w-5 text-primary" />
                      <div className="absolute -inset-1 bg-primary/20 rounded-full blur opacity-50"></div>
                    </div>
                    <span className="font-semibold text-foreground text-lg">Filtrera resultat</span>
                  </div>
                  
                  <div className="relative group/select">
                    <Select value={filterByType} onValueChange={setFilterByType}>
                      <SelectTrigger className="w-56 h-12 bg-background/60 border-border/60 backdrop-blur-sm hover:bg-background/80 hover:border-primary/40 transition-all duration-300 rounded-xl">
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
                </div>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  <div className="backdrop-blur-xl bg-card/40 border border-border/30 rounded-xl px-4 py-2">
                    <span className="text-sm text-muted-foreground">
                      Visar <span className="font-semibold text-primary">{startIndex + 1}-{Math.min(startIndex + jobsPerPage, sortedJobs.length)}</span> av <span className="font-semibold text-accent">{sortedJobs.length}</span> jobb
                    </span>
                  </div>
                  
                  <div className="relative group/sort">
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-48 h-12 bg-background/60 border-border/60 backdrop-blur-sm hover:bg-background/80 hover:border-accent/40 transition-all duration-300 rounded-xl">
                        <SelectValue placeholder="Sortera efter" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="relevance">Relevans</SelectItem>
                        <SelectItem value="newest">Senaste</SelectItem>
                        <SelectItem value="salary">Sista ansökningsdatum</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Jobs Grid */}
          {currentJobs.length > 0 ? (
            <>
              {/* Jobs Container with Background Effects */}
              <div className="relative animate-fade-in" style={{animationDelay: '0.2s'}}>
                {/* Background decoration for grid */}
                <div className="absolute -inset-6 bg-gradient-to-br from-primary/3 via-transparent to-accent/3 rounded-3xl blur-3xl opacity-60"></div>
                
                <div className="relative space-y-6 mb-16">
                  {currentJobs.map((job, index) => (
                    <div key={job.id} className="group animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                      <div className="relative">
                        {/* Individual item glow effect */}
                        <div className="absolute -inset-2 bg-gradient-to-r from-primary/15 to-accent/15 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                        
                        <JobListItem
                          {...job}
                          className="relative transform hover:-translate-y-1 hover:scale-[1.01] transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Enhanced Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-3 animate-fade-in" style={{animationDelay: '0.4s'}}>
                  <div className="relative group">
                    <div className="absolute -inset-2 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                    <div className="relative backdrop-blur-xl bg-card/40 border border-border/40 rounded-2xl p-2 shadow-glass">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className="bg-background/60 border-border/50 hover:bg-background/80 hover:border-primary/40 transition-all duration-300 disabled:opacity-40"
                        >
                          Föregående
                        </Button>
                        
                        <div className="flex gap-1 px-2">
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <Button
                              key={page}
                              variant={page === currentPage ? "default" : "outline"}
                              size="sm"
                              onClick={() => setCurrentPage(page)}
                              className={page === currentPage 
                                ? "bg-gradient-to-r from-primary to-primary-hover text-primary-foreground shadow-button" 
                                : "bg-background/60 border-border/50 hover:bg-background/80 hover:border-accent/40 transition-all duration-300"
                              }
                            >
                              {page}
                            </Button>
                          ))}
                        </div>
                        
                        <Button
                          variant="outline"
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className="bg-background/60 border-border/50 hover:bg-background/80 hover:border-accent/40 transition-all duration-300 disabled:opacity-40"
                        >
                          Nästa
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 animate-fade-in">
              <div className="relative group max-w-lg mx-auto">
                {/* Glow effect */}
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 rounded-3xl blur-2xl opacity-50 group-hover:opacity-80 transition-all duration-700"></div>
                
                <div className="relative backdrop-blur-2xl bg-card/50 border border-border/40 rounded-3xl p-16 shadow-glass hover:shadow-glass-hover transition-all duration-500">
                  <div className="relative mb-8">
                    <Building2 className="h-20 w-20 text-muted-foreground mx-auto animate-pulse" />
                    <div className="absolute -inset-2 bg-primary/10 rounded-full blur opacity-30"></div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-foreground mb-4">
                    Inga jobb hittade
                  </h3>
                  <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                    Försök med andra sökord eller filtrera mindre specifikt för att hitta fler möjligheter.
                  </p>
                  
                  <div className="relative group/button">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-accent/30 rounded-xl blur opacity-30 group-hover/button:opacity-60 transition-all duration-500"></div>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setFilterByType('all');
                        window.location.href = '/jobs';
                      }}
                      className="relative bg-background/60 border-border/50 hover:bg-background/80 hover:border-primary/40 transition-all duration-300 px-8 py-3"
                    >
                      Visa alla jobb
                    </Button>
                  </div>
                </div>
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