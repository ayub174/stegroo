import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { CompactJobCard } from "@/components/ui/compact-job-card";
import { JobDetailPanel } from "@/components/ui/job-detail-panel";
import { CreateJobAlertDialog } from "@/components/ui/create-job-alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Filter, Bell } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// Job data - will be replaced with real API data
const allJobs: Array<{
  id: string;
  title: string;
  company: string;
  location: string;
  deadline: string;
  type: string;
  timePosted: string;
  tags: string[];
  logo: string;
  description: string;
}> = [];

const Jobs = () => {
  const [searchParams] = useSearchParams();
  const initialSearchQuery = searchParams.get('q') || '';
  const initialLocationQuery = searchParams.get('location') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [locationQuery, setLocationQuery] = useState(initialLocationQuery);
  const [sortBy, setSortBy] = useState('relevance');
  const [filterByType, setFilterByType] = useState('all');
  const [selectedJob, setSelectedJob] = useState<typeof allJobs[0] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  const ITEMS_PER_PAGE = 20;

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
      const timeOrder = ['1 dag sedan', '2 dagar sedan', '3 dagar sedan', '4 dagar sedan', '5 dagar sedan', '6 dagar sedan', '1 vecka sedan'];
      const aIndex = timeOrder.indexOf(a.timePosted);
      const bIndex = timeOrder.indexOf(b.timePosted);
      return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
    }
    if (sortBy === 'salary') {
      const getDeadlineDays = (deadline: string) => parseInt(deadline.split(' ')[0]);
      const aDays = getDeadlineDays(a.deadline || '999 dagar kvar');
      const bDays = getDeadlineDays(b.deadline || '999 dagar kvar');
      return aDays - bDays;
    }
    return 0;
  });

  // Calculate pagination
  const totalPages = Math.ceil(sortedJobs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedJobs = sortedJobs.slice(startIndex, endIndex);
  
  const resetPagination = () => {
    setCurrentPage(1);
  };

  const handleJobSelect = (job: typeof allJobs[0]) => {
    setSelectedJob(job);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header 
        searchQuery={searchQuery}
        locationQuery={locationQuery}
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
        onSortChange={(sort) => {
          setSortBy(sort);
          resetPagination();
        }}
        onTypeFilterChange={(type) => {
          setFilterByType(type);
          resetPagination();
        }}
        jobCount={filteredJobs.length}
      />
      
      <section className="pt-4 md:pt-6 pb-4 bg-gray-50 min-h-screen flex flex-col">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-16 flex-1 flex flex-col">
          
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col">
            
            {/* Mobile Job List */}
            <div className="lg:hidden">

              {/* Job Count for Mobile */}
              {filteredJobs.length > 0 && (
                <div className="mb-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 rounded-lg border border-primary/10">
                    <span className="text-sm font-semibold text-primary">{filteredJobs.length}</span>
                    <span className="text-xs text-muted-foreground">jobb hittades</span>
                  </div>
                </div>
              )}

              {/* Mobile Job List */}
              <div className="space-y-3 mb-6">
                {sortedJobs.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-xl">
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

              {/* Mobile Pagination */}
              {sortedJobs.length > ITEMS_PER_PAGE && (
                <div className="mt-6 pt-4">
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
                      
                      {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => {
                        const page = currentPage <= 2 ? i + 1 : currentPage - 1 + i;
                        if (page > totalPages) return null;
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

            {/* Desktop Layout */}
            <div className="hidden lg:flex gap-6 flex-1 h-[calc(100vh-8rem)]">
              {/* Desktop Job List */}
              <div className="flex-[0_0_50%] flex flex-col h-full">
                {/* Job Count Header */}
                {filteredJobs.length > 0 && (
                  <div className="mb-4 flex-shrink-0">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 rounded-lg border border-primary/10">
                      <span className="text-sm font-semibold text-primary">{filteredJobs.length}</span>
                      <span className="text-xs text-muted-foreground">jobb hittades</span>
                    </div>
                  </div>
                )}
                
                {/* Job Alert and Sorting Controls */}
                <div className="mb-6 p-4 bg-gradient-to-br from-background/90 to-background/70 backdrop-blur-xl border border-border/50 rounded-2xl space-y-4 flex-shrink-0">
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
                
                <div className="flex-1 overflow-y-auto pr-2 space-y-4 min-h-0">
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
                  <div className="mt-6 pt-4 border-t border-gray-200 flex-shrink-0">
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

              {/* Desktop Job Detail Panel */}
              <div className="flex-[0_0_50%] h-full">
                <div className="h-full bg-white rounded-lg border border-gray-200 overflow-hidden">
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

      {/* Mobile Job Detail Modal */}
      {selectedJob && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50 flex items-end animate-fade-in">
          <div className="w-full h-[90vh] bg-white rounded-t-2xl overflow-hidden touch-pan-y">
            {/* Drag Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
            </div>
            <JobDetailPanel 
              job={selectedJob} 
              onClose={() => setSelectedJob(null)}
              hasJobs={sortedJobs.length > 0}
            />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Jobs;