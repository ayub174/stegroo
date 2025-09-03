package se.stegroo.backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import se.stegroo.backend.model.JobListing;

import java.util.List;
import java.util.Objects;

@Schema(description = "Response för jobbsökning med paginering och statistik")
public class JobSearchResponse {

    @Schema(description = "Lista med jobb")
    private List<JobListing> jobs;

    @Schema(description = "Totalt antal jobb som matchar sökningen")
    private Long totalElements;

    @Schema(description = "Totalt antal sidor")
    private Integer totalPages;

    @Schema(description = "Aktuell sida (0-baserat)")
    private Integer currentPage;

    @Schema(description = "Antal resultat per sida")
    private Integer size;

    @Schema(description = "Finns det fler sidor framåt")
    private Boolean hasNext;

    @Schema(description = "Finns det fler sidor bakåt")
    private Boolean hasPrevious;

    @Schema(description = "Statistik över jobb")
    private JobStats jobStats;

    // Konstruktorer
    public JobSearchResponse() {}

    public JobSearchResponse(List<JobListing> jobs, Long totalElements, Integer totalPages, 
                           Integer currentPage, Integer size, Boolean hasNext, Boolean hasPrevious) {
        this.jobs = jobs;
        this.totalElements = totalElements;
        this.totalPages = totalPages;
        this.currentPage = currentPage;
        this.size = size;
        this.hasNext = hasNext;
        this.hasPrevious = hasPrevious;
    }

    // Getters och Setters
    public List<JobListing> getJobs() {
        return jobs;
    }

    public void setJobs(List<JobListing> jobs) {
        this.jobs = jobs;
    }

    public Long getTotalElements() {
        return totalElements;
    }

    public void setTotalElements(Long totalElements) {
        this.totalElements = totalElements;
    }

    public Integer getTotalPages() {
        return totalPages;
    }

    public void setTotalPages(Integer totalPages) {
        this.totalPages = totalPages;
    }

    public Integer getCurrentPage() {
        return currentPage;
    }

    public void setCurrentPage(Integer currentPage) {
        this.currentPage = currentPage;
    }

    public Integer getSize() {
        return size;
    }

    public void setSize(Integer size) {
        this.size = size;
    }

    public Boolean getHasNext() {
        return hasNext;
    }

    public void setHasNext(Boolean hasNext) {
        this.hasNext = hasNext;
    }

    public Boolean getHasPrevious() {
        return hasPrevious;
    }

    public void setHasPrevious(Boolean hasPrevious) {
        this.hasPrevious = hasPrevious;
    }

    public JobStats getJobStats() {
        return jobStats;
    }

    public void setJobStats(JobStats jobStats) {
        this.jobStats = jobStats;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        JobSearchResponse that = (JobSearchResponse) o;
        return Objects.equals(jobs, that.jobs) &&
                Objects.equals(totalElements, that.totalElements) &&
                Objects.equals(totalPages, that.totalPages) &&
                Objects.equals(currentPage, that.currentPage) &&
                Objects.equals(size, that.size) &&
                Objects.equals(hasNext, that.hasNext) &&
                Objects.equals(hasPrevious, that.hasPrevious) &&
                Objects.equals(jobStats, that.jobStats);
    }

    @Override
    public int hashCode() {
        return Objects.hash(jobs, totalElements, totalPages, currentPage, size, hasNext, hasPrevious, jobStats);
    }

    @Override
    public String toString() {
        return "JobSearchResponse{" +
                "jobs=" + jobs +
                ", totalElements=" + totalElements +
                ", totalPages=" + totalPages +
                ", currentPage=" + currentPage +
                ", size=" + size +
                ", hasNext=" + hasNext +
                ", hasPrevious=" + hasPrevious +
                ", jobStats=" + jobStats +
                '}';
    }

    // Builder
    public static JobSearchResponseBuilder builder() {
        return new JobSearchResponseBuilder();
    }

    public static class JobSearchResponseBuilder {
        private List<JobListing> jobs;
        private Long totalElements;
        private Integer totalPages;
        private Integer currentPage;
        private Integer size;
        private Boolean hasNext;
        private Boolean hasPrevious;
        private JobStats jobStats;

        public JobSearchResponseBuilder jobs(List<JobListing> jobs) {
            this.jobs = jobs;
            return this;
        }

        public JobSearchResponseBuilder totalElements(Long totalElements) {
            this.totalElements = totalElements;
            return this;
        }

        public JobSearchResponseBuilder totalPages(Integer totalPages) {
            this.totalPages = totalPages;
            return this;
        }

        public JobSearchResponseBuilder currentPage(Integer currentPage) {
            this.currentPage = currentPage;
            return this;
        }

        public JobSearchResponseBuilder size(Integer size) {
            this.size = size;
            return this;
        }

        public JobSearchResponseBuilder hasNext(Boolean hasNext) {
            this.hasNext = hasNext;
            return this;
        }

        public JobSearchResponseBuilder hasPrevious(Boolean hasPrevious) {
            this.hasPrevious = hasPrevious;
            return this;
        }

        public JobSearchResponseBuilder jobStats(JobStats jobStats) {
            this.jobStats = jobStats;
            return this;
        }

        public JobSearchResponse build() {
            JobSearchResponse response = new JobSearchResponse(jobs, totalElements, totalPages, 
                                                            currentPage, size, hasNext, hasPrevious);
            response.setJobStats(jobStats);
            return response;
        }
    }

    @Schema(description = "Statistik över jobb i systemet")
    public static class JobStats {
        @Schema(description = "Totalt antal jobb")
        private Long totalJobs;

        @Schema(description = "Antal aktiva jobb")
        private Long activeJobs;

        @Schema(description = "Antal utgångna jobb")
        private Long expiredJobs;

        @Schema(description = "Antal borttagna jobb")
        private Long removedJobs;

        // Konstruktorer
        public JobStats() {}

        public JobStats(Long totalJobs, Long activeJobs, Long expiredJobs, Long removedJobs) {
            this.totalJobs = totalJobs;
            this.activeJobs = activeJobs;
            this.expiredJobs = expiredJobs;
            this.removedJobs = removedJobs;
        }

        // Getters och Setters
        public Long getTotalJobs() {
            return totalJobs;
        }

        public void setTotalJobs(Long totalJobs) {
            this.totalJobs = totalJobs;
        }

        public Long getActiveJobs() {
            return activeJobs;
        }

        public void setActiveJobs(Long activeJobs) {
            this.activeJobs = activeJobs;
        }

        public Long getExpiredJobs() {
            return expiredJobs;
        }

        public void setExpiredJobs(Long expiredJobs) {
            this.expiredJobs = expiredJobs;
        }

        public Long getRemovedJobs() {
            return removedJobs;
        }

        public void setRemovedJobs(Long removedJobs) {
            this.removedJobs = removedJobs;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            JobStats that = (JobStats) o;
            return Objects.equals(totalJobs, that.totalJobs) &&
                    Objects.equals(activeJobs, that.activeJobs) &&
                    Objects.equals(expiredJobs, that.expiredJobs) &&
                    Objects.equals(removedJobs, that.removedJobs);
        }

        @Override
        public int hashCode() {
            return Objects.hash(totalJobs, activeJobs, expiredJobs, removedJobs);
        }

        @Override
        public String toString() {
            return "JobStats{" +
                    "totalJobs=" + totalJobs +
                    ", activeJobs=" + activeJobs +
                    ", expiredJobs=" + expiredJobs +
                    ", removedJobs=" + removedJobs +
                    '}';
        }

        // Builder
        public static JobStatsBuilder builder() {
            return new JobStatsBuilder();
        }

        public static class JobStatsBuilder {
            private Long totalJobs;
            private Long activeJobs;
            private Long expiredJobs;
            private Long removedJobs;

            public JobStatsBuilder totalJobs(Long totalJobs) {
                this.totalJobs = totalJobs;
                return this;
            }

            public JobStatsBuilder activeJobs(Long activeJobs) {
                this.activeJobs = activeJobs;
                return this;
            }

            public JobStatsBuilder expiredJobs(Long expiredJobs) {
                this.expiredJobs = expiredJobs;
                return this;
            }

            public JobStatsBuilder removedJobs(Long removedJobs) {
                this.removedJobs = removedJobs;
                return this;
            }

            public JobStats build() {
                return new JobStats(totalJobs, activeJobs, expiredJobs, removedJobs);
            }
        }
    }
}