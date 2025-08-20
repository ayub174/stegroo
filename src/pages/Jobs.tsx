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
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden bg-white">
        {/* Blue decorative shapes */}
        <div className="absolute inset-0 z-[1]">
          <div className="absolute top-20 left-10 w-64 h-64 bg-blue-100 rounded-3xl rotate-12 opacity-60 animate-float"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-blue-50 rounded-3xl -rotate-6 opacity-40 animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-blue-200 rounded-3xl rotate-3 opacity-50 animate-float" style={{animationDelay: '4s'}}></div>
          
          {/* Subtle pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `radial-gradient(circle, rgb(59 130 246) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}></div>
          
          {/* Animated lines */}
          <div className="absolute inset-0 opacity-[0.05]">
            <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent animate-pulse"></div>
            <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400/20 to-transparent animate-pulse delay-1000"></div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* Status Badge */}
            <div className="flex justify-center mb-8 animate-fade-in">
              <div className="relative group">
                <Badge variant="secondary" className="relative group font-semibold text-sm hover:scale-105 transition-all duration-500 cursor-pointer bg-blue-50 border-2 border-blue-200 hover:border-blue-500 px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl">
                  <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-2xl"></div>
                  
                  <div className="relative z-10 flex items-center gap-3">
                    <div className="p-1.5 bg-blue-500 rounded-lg shadow-inner">
                      <TrendingUp className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-bold text-lg text-blue-600">
                      {filteredJobs.length}
                    </span>
                    <span className="text-gray-700 font-medium">tillgängliga jobb</span>
                  </div>
                </Badge>
              </div>
            </div>
            
            {/* Title */}
            <div className="text-center mb-8">
              <h1 className="text-5xl lg:text-7xl font-black text-gray-900 mb-6 leading-[0.9] animate-fade-in" style={{animationDelay: '0.2s'}}>
                <span className="block mb-2">Hitta ditt</span>
                <span className="text-blue-600">drömjobb</span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto animate-fade-in leading-relaxed font-light" style={{animationDelay: '0.4s'}}>
                Bläddra bland alla tillgängliga jobb och hitta den perfekta rollen för dig
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="flex justify-center mb-12 animate-fade-in" style={{animationDelay: '0.6s'}}>
              <div className="w-full max-w-2xl relative group">
                <div className="absolute inset-0 bg-white rounded-2xl shadow-xl group-hover:shadow-2xl transition-all duration-500 border border-gray-200"></div>
                <SearchBar className="relative transform hover:scale-[1.02] transition-all duration-300 bg-transparent shadow-none border-0" />
              </div>
            </div>
            
            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto animate-fade-in" style={{animationDelay: '0.8s'}}>
              {[
                { icon: Users, label: "Jobbsökare", value: "2M+", color: "bg-blue-500" },
                { icon: Briefcase, label: "Aktiva jobb", value: filteredJobs.length + "+", color: "bg-blue-600" },
                { icon: Star, label: "Företag", value: "10K+", color: "bg-blue-700" }
              ].map(({ icon: Icon, label, value, color }, index) => (
                <div key={index} className="group cursor-pointer">
                  <div className="relative p-6 rounded-3xl bg-white border-2 border-gray-100 hover:border-blue-300 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                    <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-500"></div>
                    
                    <div className="relative z-10 flex items-center gap-4">
                      <div className={`p-3 rounded-2xl ${color} shadow-inner group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                          {value}
                        </div>
                        <div className="text-sm text-gray-500 font-medium">
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
      </section>

      {/* Jobs List Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Filters and Sorting */}
          <div className="mb-8 bg-white rounded-3xl p-6 shadow-lg border border-gray-200">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-4">
                <Filter className="h-5 w-5 text-blue-600" />
                <span className="font-semibold text-gray-900">Filtrera och sortera</span>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-[180px] bg-white border-gray-200 rounded-2xl">
                    <SelectValue placeholder="Sortera efter" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 rounded-2xl">
                    <SelectItem value="relevance">Relevans</SelectItem>
                    <SelectItem value="newest">Nyast först</SelectItem>
                    <SelectItem value="salary">Ansökningsdatum</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={filterByType} onValueChange={setFilterByType}>
                  <SelectTrigger className="w-full sm:w-[140px] bg-white border-gray-200 rounded-2xl">
                    <SelectValue placeholder="Typ" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 rounded-2xl">
                    <SelectItem value="all">Alla</SelectItem>
                    <SelectItem value="Heltid">Heltid</SelectItem>
                    <SelectItem value="Deltid">Deltid</SelectItem>
                    <SelectItem value="Konsult">Konsult</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Results Info */}
          <div className="mb-6">
            <p className="text-gray-600">
              Visar <span className="font-semibold text-blue-600">{startIndex + 1}-{Math.min(startIndex + jobsPerPage, sortedJobs.length)}</span> av <span className="font-semibold text-blue-600">{sortedJobs.length}</span> jobb
            </p>
          </div>

          {/* Jobs List */}
          <div className="space-y-4 mb-8">
            {currentJobs.map((job, index) => (
              <div key={job.id} className="animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                <JobListItem {...job} className="bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 shadow-lg hover:shadow-xl transition-all duration-300" />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="bg-white border-gray-200 hover:bg-blue-50 hover:border-blue-300"
              >
                Föregående
              </Button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  onClick={() => setCurrentPage(page)}
                  className={currentPage === page 
                    ? "bg-blue-600 hover:bg-blue-700 text-white" 
                    : "bg-white border-gray-200 hover:bg-blue-50 hover:border-blue-300"
                  }
                >
                  {page}
                </Button>
              ))}
              
              <Button
                variant="outline"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="bg-white border-gray-200 hover:bg-blue-50 hover:border-blue-300"
              >
                Nästa
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Jobs;