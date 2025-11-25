import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { CompactJobCard } from "@/components/ui/compact-job-card";
import { JobDetailPanel } from "@/components/ui/job-detail-panel";
import { CreateJobAlertDialog } from "@/components/ui/create-job-alert-dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Loader2 } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { fetchJobs, type Job, formatDate, daysUntilDeadline } from "@/lib/jobsApi";
import { useToast } from "@/hooks/use-toast";

const Jobs = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const initialSearchQuery = searchParams.get('q') || '';
  const initialLocationQuery = searchParams.get('location') || '';

  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [locationQuery, setLocationQuery] = useState(initialLocationQuery);
  const [sortBy, setSortBy] = useState('relevance');
  const [filterByType, setFilterByType] = useState('all');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  // API state
  const [jobs, setJobs] = useState<Job[]>([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const ITEMS_PER_PAGE = 20;

  // Fetch jobs from API
  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true);
      setError(null);

      try {
        const sortMapping: Record<string, { sortBy: string; sortDir: string }> = {
          'relevance': { sortBy: 'createdAt', sortDir: 'desc' },
          'newest': { sortBy: 'publishedAt', sortDir: 'desc' },
          'salary': { sortBy: 'deadline', sortDir: 'asc' },
        };

        const sortConfig = sortMapping[sortBy] || sortMapping['relevance'];

        const data = await fetchJobs({
          page: currentPage,
          size: ITEMS_PER_PAGE,
          sortBy: sortConfig.sortBy,
          sortDir: sortConfig.sortDir,
          query: searchQuery,
          location: locationQuery,
          employmentType: filterByType === 'all' ? '' : filterByType,
        });

        setJobs(data.content);
        setTotalJobs(data.totalElements);
        setTotalPages(data.totalPages);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Ett fel uppstod vid hämtning av jobb';
        setError(errorMessage);
        toast({
          title: "Fel",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, [currentPage, searchQuery, locationQuery, sortBy, filterByType, toast]);

  const resetPagination = () => {
    setCurrentPage(0);
  };

  const handleJobSelect = (job: Job) => {
    setSelectedJob(job);
  };

  // Convert API job to display format
  const convertJobToDisplayFormat = (job: Job) => {
    return {
      id: job.id.toString(),
      title: job.title,
      company: job.companyName || 'Okänt företag',
      location: job.location || 'Okänd plats',
      deadline: daysUntilDeadline(job.deadline),
      type: job.employmentType || 'Heltid',
      timePosted: formatDate(job.publishedAt || job.createdAt),
      tags: job.skills?.map(s => s.name) || [],
      logo: "/placeholder.svg",
      description: job.description || 'Ingen beskrivning tillgänglig',
      externalUrl: job.externalUrl,
    };
  };

  const displayJobs = jobs.map(convertJobToDisplayFormat);

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
        jobCount={totalJobs}
      />

      <section className="pt-4 md:pt-6 pb-4 bg-gray-50 min-h-screen flex flex-col">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-16 flex-1 flex flex-col">

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col">

            {/* Mobile Job List */}
            <div className="lg:hidden">

              {/* Job Count for Mobile */}
              {totalJobs > 0 && !loading && (
                <div className="mb-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 rounded-lg border border-primary/10">
                    <span className="text-sm font-semibold text-primary">{totalJobs}</span>
                    <span className="text-xs text-muted-foreground">jobb hittades</span>
                  </div>
                </div>
              )}

              {/* Loading State */}
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2 text-gray-600">Laddar jobb...</span>
                </div>
              )}

              {/* Error State */}
              {error && !loading && (
                <div className="text-center py-12 bg-white rounded-xl">
                  <p className="text-red-500 text-lg mb-4">{error}</p>
                  <Button onClick={() => window.location.reload()}>
                    Försök igen
                  </Button>
                </div>
              )}

              {/* Mobile Job List */}
              {!loading && !error && (
                <div className="space-y-3 mb-6">
                  {displayJobs.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl">
                      <p className="text-gray-500 text-lg">Inga jobb hittades med dina filter.</p>
                      <p className="text-gray-400 text-sm mt-2">Prova att ändra dina sökkriterier</p>
                    </div>
                  ) : (
                    displayJobs.map((job) => (
                      <CompactJobCard
                        key={job.id}
                        {...job}
                        isSelected={selectedJob?.id.toString() === job.id}
                        onClick={() => {
                          const originalJob = jobs.find(j => j.id.toString() === job.id);
                          if (originalJob) handleJobSelect(originalJob);
                        }}
                        description={job.description}
                      />
                    ))
                  )}
                </div>
              )}

              {/* Mobile Pagination */}
              {!loading && displayJobs.length > 0 && totalPages > 1 && (
                <div className="mt-6 pt-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 0) setCurrentPage(currentPage - 1);
                          }}
                          className={currentPage <= 0 ? 'pointer-events-none opacity-50' : ''}
                        />
                      </PaginationItem>

                      {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => {
                        const page = currentPage <= 1 ? i : currentPage - 1 + i;
                        if (page >= totalPages) return null;
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
                              {page + 1}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}

                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
                          }}
                          className={currentPage >= totalPages - 1 ? 'pointer-events-none opacity-50' : ''}
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
                {totalJobs > 0 && !loading && (
                  <div className="mb-4 flex-shrink-0">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 rounded-lg border border-primary/10">
                      <span className="text-sm font-semibold text-primary">{totalJobs}</span>
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

                {/* Loading State */}
                {loading && (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-2 text-gray-600">Laddar jobb...</span>
                  </div>
                )}

                {/* Error State */}
                {error && !loading && (
                  <div className="text-center py-12 bg-white rounded-xl">
                    <p className="text-red-500 text-lg mb-4">{error}</p>
                    <Button onClick={() => window.location.reload()}>
                      Försök igen
                    </Button>
                  </div>
                )}

                {/* Job List */}
                {!loading && !error && (
                  <div className="flex-1 overflow-y-auto pr-2 space-y-4 min-h-0">
                    {displayJobs.length === 0 ? (
                      <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">Inga jobb hittades med dina filter.</p>
                        <p className="text-gray-400 text-sm mt-2">Prova att ändra dina sökkriterier</p>
                      </div>
                    ) : (
                      displayJobs.map((job) => (
                        <CompactJobCard
                          key={job.id}
                          {...job}
                          isSelected={selectedJob?.id.toString() === job.id}
                          onClick={() => {
                            const originalJob = jobs.find(j => j.id.toString() === job.id);
                            if (originalJob) handleJobSelect(originalJob);
                          }}
                          description={job.description}
                        />
                      ))
                    )}
                  </div>
                )}

                {/* Pagination */}
                {!loading && displayJobs.length > 0 && totalPages > 1 && (
                  <div className="mt-6 pt-4 border-t border-gray-200 flex-shrink-0">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              if (currentPage > 0) setCurrentPage(currentPage - 1);
                            }}
                            className={currentPage <= 0 ? 'pointer-events-none opacity-50' : ''}
                          />
                        </PaginationItem>

                        {Array.from({ length: totalPages }, (_, i) => i).map((page) => {
                          if (
                            page === 0 ||
                            page === totalPages - 1 ||
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
                                  {page + 1}
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
                              if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
                            }}
                            className={currentPage >= totalPages - 1 ? 'pointer-events-none opacity-50' : ''}
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
                    job={selectedJob ? convertJobToDisplayFormat(selectedJob) : null}
                    onClose={() => setSelectedJob(null)}
                    hasJobs={displayJobs.length > 0}
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
              job={convertJobToDisplayFormat(selectedJob)}
              onClose={() => setSelectedJob(null)}
              hasJobs={displayJobs.length > 0}
            />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Jobs;
