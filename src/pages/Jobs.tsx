import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { CompactJobCard } from "@/components/ui/compact-job-card";
import { JobFiltersSidebar } from "@/components/ui/job-filters-sidebar";
import { JobDetailPanel } from "@/components/ui/job-detail-panel";
import { CreateJobAlertDialog } from "@/components/ui/create-job-alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, Bell } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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
  const initialSearchQuery = searchParams.get('q') || '';
  const initialLocationQuery = searchParams.get('location') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [locationQuery, setLocationQuery] = useState(initialLocationQuery);
  const [selectedCities, setSelectedCities] = useState<string[]>(initialLocationQuery ? [initialLocationQuery] : []);
  const [sortBy, setSortBy] = useState('relevance');
  const [filterByType, setFilterByType] = useState('all');
  const [selectedJob, setSelectedJob] = useState<typeof allJobs[0] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterCollapsed, setIsFilterCollapsed] = useState(false);
  
  const ITEMS_PER_PAGE = 20;

  // Filter jobs based on search parameters
  const filteredJobs = allJobs.filter(job => {
    const matchesSearch = searchQuery === '' || 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesLocation = selectedCities.length === 0 || 
      selectedCities.some(city => job.location.toLowerCase().includes(city.toLowerCase()));
    
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

  // Calculate pagination
  const totalPages = Math.ceil(sortedJobs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedJobs = sortedJobs.slice(startIndex, endIndex);
  
  // Reset to first page when filters change
  const resetPagination = () => {
    setCurrentPage(1);
  };

  const handleJobSelect = (job: typeof allJobs[0]) => {
    setSelectedJob(job);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Main Content - 3 Column Layout */}
      <section className="pt-6 pb-4 bg-gray-50 min-h-screen flex flex-col">
        <div className="max-w-[1800px] mx-auto px-16 flex-1 flex flex-col">
          <div className={`grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 transition-all duration-300`}>
            {/* Left Sidebar - Filters */}
            <div className={`transition-all duration-300 ${
              isFilterCollapsed ? 'lg:col-span-1' : 'lg:col-span-2'
            }`}>
              <div className="sticky top-6">
                <JobFiltersSidebar
                  searchQuery={searchQuery}
                  locationQuery={locationQuery}
                  selectedCities={selectedCities}
                  sortBy={sortBy}
                  filterByType={filterByType}
                  onSearchChange={(query) => {
                    setSearchQuery(query);
                    resetPagination();
                  }}
                  onLocationChange={(location) => {
                    setLocationQuery(location);
                    resetPagination();
                  }}
                  onSelectedCitiesChange={(cities) => {
                    setSelectedCities(cities);
                    resetPagination();
                  }}
                  onSortChange={(sort) => {
                    setSortBy(sort);
                    resetPagination();
                  }}
                  onTypeFilterChange={(type) => {
                    setFilterByType(type);
                    resetPagination();
                  }}
                  jobCount={filteredJobs.length}
                  isCollapsed={isFilterCollapsed}
                  onToggleCollapse={() => setIsFilterCollapsed(!isFilterCollapsed)}
                />
              </div>
            </div>

            {/* Middle - Job List */}
            <div className={`flex flex-col h-[calc(100vh-8rem)] transition-all duration-300 ${
              isFilterCollapsed ? 'lg:col-span-5' : 'lg:col-span-7'
            }`}>
              {/* Selected Cities Header */}
              {selectedCities.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-black">
                    Lediga jobb i {selectedCities.join(', ')}
                  </h3>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 rounded-lg border border-primary/10">
                    <span className="text-sm font-semibold text-primary">{filteredJobs.length}</span>
                    <span className="text-xs text-muted-foreground">jobb hittades</span>
                  </div>
                </div>
              )}
              
              {/* Job Alert and Sorting Controls */}
              <div className="mb-6 p-4 bg-gradient-to-br from-background/90 to-background/70 backdrop-blur-xl border border-border/50 rounded-2xl space-y-4">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                  {/* Job Alert Creation */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Bell className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-foreground">Jobbbevakning</span>
                    </div>
                    <CreateJobAlertDialog 
                      defaultValues={{
                        searchQuery: searchQuery,
                        location: locationQuery,
                        jobType: filterByType !== 'all' ? filterByType : undefined
                      }}
                      trigger={
                        <Button 
                          size="sm" 
                          className="gap-2 bg-primary text-white hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
                        >
                          <Bell className="h-4 w-4" />
                          Skapa bevakning
                        </Button>
                      }
                    />
                  </div>
                  
                  {/* Sorting Options */}
                  <div className="flex-shrink-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-foreground">Sortera efter:</span>
                    </div>
                    <Select value={sortBy} onValueChange={(sort) => {
                      setSortBy(sort);
                      resetPagination();
                    }}>
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="relevance">Relevans</SelectItem>
                        <SelectItem value="newest">Nyast först</SelectItem>
                        <SelectItem value="salary">Sista ansökningsdag</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 space-y-4 overflow-y-auto pr-2">
                {sortedJobs.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">Inga jobb hittades med dina filter.</p>
                  </div>
                ) : (
                  paginatedJobs.map((job) => (
                    <CompactJobCard
                      key={job.id}
                      {...job}
                      isSelected={selectedJob?.id === job.id}
                      onClick={() => handleJobSelect(job)}
                      description={job.description}
                    />
                  ))
                )}
              </div>
              
              {/* Pagination */}
              {sortedJobs.length > ITEMS_PER_PAGE && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 1) setCurrentPage(currentPage - 1);
                          }}
                          className={currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <PaginationItem key={page}>
                              <PaginationLink
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setCurrentPage(page);
                                }}
                                isActive={currentPage === page}
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        } else if (
                          page === currentPage - 2 ||
                          page === currentPage + 2
                        ) {
                          return (
                            <PaginationItem key={page}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          );
                        }
                        return null;
                      })}
                      
                      <PaginationItem>
                        <PaginationNext 
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                          }}
                          className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </div>

            {/* Right - Job Detail Panel */}
            <div className={`transition-all duration-300 ${
              isFilterCollapsed ? 'lg:col-span-6' : 'lg:col-span-3'
            }`}>
              <div className="sticky top-6">
                <div className="h-[calc(100vh-12rem)]">
                  <JobDetailPanel 
                    job={selectedJob} 
                    onClose={() => setSelectedJob(null)}
                    hasJobs={sortedJobs.length > 0}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Jobs;
