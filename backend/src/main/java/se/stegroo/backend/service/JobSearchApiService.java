package se.stegroo.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;
import se.stegroo.backend.dto.jobsearch.JobSearchResponse;
import se.stegroo.backend.dto.jobsearch.JobSearchHit;
import se.stegroo.backend.model.JobListing;
import se.stegroo.backend.model.JobCategory;
import se.stegroo.backend.repository.JobListingRepository;
import se.stegroo.backend.repository.JobCategoryRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service för att hämta jobb från Arbetsförmedlingens JobSearch API
 * och konvertera dem till våra interna modeller.
 */
@Service
public class JobSearchApiService {
    
    private static final Logger log = LoggerFactory.getLogger(JobSearchApiService.class);
    
    private static final String API_BASE_URL = "https://jobsearch.api.jobtechdev.se";
    
    private final RestClient restClient;
    private final JobCategoryRepository jobCategoryRepository;
    private final JobListingRepository jobListingRepository;
    private final ObjectMapper objectMapper;
    
    public JobSearchApiService(
            RestClient restClient,
            JobCategoryRepository jobCategoryRepository,
            JobListingRepository jobListingRepository,
            ObjectMapper objectMapper) {
        this.restClient = restClient;
        this.jobCategoryRepository = jobCategoryRepository;
        this.jobListingRepository = jobListingRepository;
        this.objectMapper = objectMapper;
    }
    
    /**
     * Söker jobb från JobSearch API baserat på sökparametrar
     */
    public List<JobListing> searchJobs(String query, String location, String category, int limit, int offset) {
        log.info("Söker jobb från JobSearch API: query={}, location={}, category={}, limit={}, offset={}", 
                query, location, category, limit, offset);
        
        try {
            UriComponentsBuilder uriBuilder = UriComponentsBuilder
                    .fromHttpUrl(API_BASE_URL + "/search")
                    .queryParam("limit", Math.min(limit, 100)) // API max är 100
                    .queryParam("offset", Math.min(offset, 2000)); // API max är 2000
            
            // Lägg till sökparametrar
            if (query != null && !query.trim().isEmpty()) {
                uriBuilder.queryParam("q", query.trim());
            }
            
            if (location != null && !location.trim().isEmpty()) {
                uriBuilder.queryParam("municipality", location.trim());
            }
            
            if (category != null && !category.trim().isEmpty()) {
                uriBuilder.queryParam("occupation-field", category.trim());
            }
            
            // Sortera efter relevans som standard
            uriBuilder.queryParam("sort", "relevance");
            
            String url = uriBuilder.toUriString();
            log.info("Anropar JobSearch API: {}", url);
            
            JobSearchResponse response = restClient.get()
                    .uri(url)
                    .header("Accept", "application/json")
                    .header("User-Agent", "Stegroo-JobPlatform/1.0")
                    .retrieve()
                    .body(JobSearchResponse.class);
            
            if (response != null && response.getHits() != null) {
                log.info("✅ Fick {} jobb från JobSearch API", response.getHits().size());
                
                return response.getHits().stream()
                        .map(this::convertJobSearchHitToJobListing)
                        .filter(Optional::isPresent)
                        .map(Optional::get)
                        .collect(Collectors.toList());
            } else {
                log.warn("Tomt svar från JobSearch API");
                return new ArrayList<>();
            }
            
        } catch (org.springframework.web.client.HttpClientErrorException e) {
            log.error("API-fel vid anrop till JobSearch API: {} {}", e.getStatusCode(), e.getResponseBodyAsString(), e);
            return new ArrayList<>();
        } catch (org.springframework.web.client.ResourceAccessException e) {
            log.error("Nätverksfel vid anrop till JobSearch API: {}", e.getMessage(), e);
            return new ArrayList<>();
        } catch (Exception e) {
            log.error("Fel vid anrop till JobSearch API: {}", e.getMessage(), e);
            return new ArrayList<>();
        }
    }
    
    /**
     * Hämtar ett specifikt jobb från JobSearch API
     */
    public Optional<JobListing> getJobById(String jobId) {
        log.info("Hämtar jobb med ID: {}", jobId);
        
        try {
            String url = API_BASE_URL + "/ad/" + jobId;
            log.info("Anropar JobSearch API: {}", url);
            
            JobSearchHit jobHit = restClient.get()
                    .uri(url)
                    .header("Accept", "application/json")
                    .header("User-Agent", "Stegroo-JobPlatform/1.0")
                    .retrieve()
                    .body(JobSearchHit.class);
            
            if (jobHit != null) {
                log.info("✅ Hämtade jobb: {}", jobHit.getHeadline());
                return convertJobSearchHitToJobListing(jobHit);
            } else {
                log.warn("Jobb med ID {} hittades inte", jobId);
                return Optional.empty();
            }
            
        } catch (org.springframework.web.client.HttpClientErrorException e) {
            log.error("API-fel vid hämtning av jobb {}: {} {}", jobId, e.getStatusCode(), e.getResponseBodyAsString(), e);
            return Optional.empty();
        } catch (org.springframework.web.client.ResourceAccessException e) {
            log.error("Nätverksfel vid hämtning av jobb {}: {}", jobId, e.getMessage(), e);
            return Optional.empty();
        } catch (Exception e) {
            log.error("Fel vid hämtning av jobb {}: {}", jobId, e.getMessage(), e);
            return Optional.empty();
        }
    }
    
    /**
     * Hämtar alla tillgängliga jobb från JobSearch API (med paginering)
     */
    public List<JobListing> fetchAllJobs(int maxJobs) {
        log.info("Hämtar upp till {} jobb från JobSearch API", maxJobs);
        
        List<JobListing> allJobs = new ArrayList<>();
        int limit = 100; // API max per request
        int offset = 0;
        
        while (allJobs.size() < maxJobs && offset < 2000) { // API max offset
            int remainingJobs = maxJobs - allJobs.size();
            int currentLimit = Math.min(limit, remainingJobs);
            
            List<JobListing> batch = searchJobs(null, null, null, currentLimit, offset);
            
            if (batch.isEmpty()) {
                log.info("Inga fler jobb att hämta efter offset {}", offset);
                break;
            }
            
            allJobs.addAll(batch);
            offset += currentLimit;
            
            log.info("Hämtade {} jobb, totalt: {}", batch.size(), allJobs.size());
            
            // Kort paus för att vara snäll mot API:t
            try {
                Thread.sleep(500);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                break;
            }
        }
        
        log.info("✅ Totalt {} jobb hämtade från JobSearch API", allJobs.size());
        return allJobs;
    }
    
    /**
     * Synkroniserar jobb från JobSearch API till databasen
     */
    @Transactional
    public int syncJobsToDatabase(int maxJobs) {
        log.info("Startar synkronisering av {} jobb från JobSearch API till databasen", maxJobs);
        
        List<JobListing> jobs = fetchAllJobs(maxJobs);
        
        if (jobs.isEmpty()) {
            log.warn("Inga jobb att synkronisera");
            return 0;
        }
        
        return saveJobsToDatabase(jobs);
    }
    
    /**
     * Sparar en lista med jobb till databasen
     */
    @Transactional
    public int saveJobsToDatabase(List<JobListing> jobs) {
        int savedCount = 0;
        int updatedCount = 0;
        
        for (JobListing job : jobs) {
            try {
                // Kontrollera om jobbet redan finns baserat på externalId
                if (job.getExternalId() != null && !job.getExternalId().trim().isEmpty()) {
                    Optional<JobListing> existingJob = jobListingRepository.findByExternalId(job.getExternalId());
                    
                    if (existingJob.isPresent()) {
                        // Uppdatera befintligt jobb
                        JobListing existing = existingJob.get();
                        updateExistingJob(existing, job);
                        jobListingRepository.save(existing);
                        updatedCount++;
                        log.debug("Uppdaterade befintligt jobb: {}", job.getTitle());
                    } else {
                        // Spara nytt jobb
                        job.setSource("jobsearch_api");
                        job.setStatus(JobListing.Status.ACTIVE);
                        if (job.getCreatedAt() == null) {
                            job.setCreatedAt(LocalDateTime.now());
                        }
                        if (job.getUpdatedAt() == null) {
                            job.setUpdatedAt(LocalDateTime.now());
                        }
                        jobListingRepository.save(job);
                        savedCount++;
                        log.debug("Sparade nytt jobb: {}", job.getTitle());
                    }
                } else {
                    log.warn("Hoppade över jobb utan externalId: {}", job.getTitle());
                }
                
            } catch (Exception e) {
                log.error("Fel vid sparande av jobb '{}': {}", job.getTitle(), e.getMessage(), e);
                // Continue with next job instead of failing the entire transaction
            }
        }
        
        log.info("✅ Synkronisering slutförd! {} nya jobb sparade, {} jobb uppdaterade", 
                savedCount, updatedCount);
        return savedCount + updatedCount;
    }
    
    /**
     * Uppdaterar ett befintligt jobb med ny data
     */
    private void updateExistingJob(JobListing existing, JobListing newJob) {
        existing.setTitle(newJob.getTitle());
        existing.setDescription(newJob.getDescription());
        existing.setCompanyName(newJob.getCompanyName());
        existing.setLocation(newJob.getLocation());
        existing.setEmploymentType(newJob.getEmploymentType());
        existing.setWorkingHoursType(newJob.getWorkingHoursType());
        existing.setPublishedAt(newJob.getPublishedAt());
        existing.setDeadline(newJob.getDeadline());
        existing.setExternalUrl(newJob.getExternalUrl());
        existing.setLastModified(LocalDateTime.now());
        existing.setRaw(newJob.getRaw());
        
        // Uppdatera kategori om den har ändrats
        if (newJob.getCategory() != null) {
            existing.setCategory(newJob.getCategory());
        }
    }
    
    /**
     * Konverterar JobSearchHit från API:t till intern JobListing
     */
    private Optional<JobListing> convertJobSearchHitToJobListing(JobSearchHit hit) {
        try {
            JobListing jobListing = new JobListing();
            
            // Grundläggande information
            jobListing.setExternalId(hit.getId());
            jobListing.setTitle(hit.getHeadline());
            jobListing.setDeadline(hit.getApplicationDeadline());
            jobListing.setPublishedAt(hit.getPublicationDate());
            jobListing.setSource("jobsearch_api");
            
            // Beskrivning - använd formatted text om tillgänglig
            if (hit.getDescription() != null) {
                String description = hit.getDescription().getTextFormatted() != null 
                    ? hit.getDescription().getTextFormatted()
                    : hit.getDescription().getText();
                jobListing.setDescription(description);
            }
            
            // Arbetsgivare
            if (hit.getEmployer() != null) {
                jobListing.setCompanyName(hit.getEmployer().getName());
                if (hit.getEmployer().getUrl() != null) {
                    jobListing.setExternalUrl(hit.getEmployer().getUrl());
                }
            }
            
            // Plats
            if (hit.getWorkplaceAddress() != null) {
                String location = hit.getWorkplaceAddress().getMunicipality();
                if (hit.getWorkplaceAddress().getRegion() != null) {
                    location += ", " + hit.getWorkplaceAddress().getRegion();
                }
                jobListing.setLocation(location);
            }
            
            // Ansökan - använd application URL om tillgänglig
            if (hit.getApplicationDetails() != null && hit.getApplicationDetails().getUrl() != null) {
                jobListing.setExternalUrl(hit.getApplicationDetails().getUrl());
            }
            
            // Kategori - använd occupation_field som kategori
            if (hit.getOccupationField() != null) {
                JobCategory category = resolveOrCreateCategory(hit.getOccupationField().getLabel());
                jobListing.setCategory(category);
            }
            
            // Anställningstyp
            if (hit.getEmploymentType() != null) {
                jobListing.setEmploymentType(hit.getEmploymentType().getLabel());
            }
            
            // Arbetstid
            if (hit.getWorkingHoursType() != null) {
                jobListing.setWorkingHoursType(hit.getWorkingHoursType().getLabel());
            }
            
            // Spara rådata för debugging
            try {
                jobListing.setRaw(objectMapper.writeValueAsString(hit));
            } catch (Exception e) {
                log.warn("Kunde inte serialisera rådata för jobb {}: {}", hit.getId(), e.getMessage());
            }
            
            log.debug("Konverterade jobb: {} - {}", hit.getId(), hit.getHeadline());
            return Optional.of(jobListing);
            
        } catch (Exception e) {
            log.warn("Kunde inte konvertera jobb {}: {}", hit.getId(), e.getMessage());
            return Optional.empty();
        }
    }
    
    /**
     * Löser eller skapar en jobbkategori baserat på kategorinamn
     */
    private JobCategory resolveOrCreateCategory(String categoryName) {
        if (categoryName == null || categoryName.trim().isEmpty()) {
            return null;
        }
        
        // Försök hitta befintlig kategori
        Optional<JobCategory> existingCategory = jobCategoryRepository.findByNameAndTaxonomyType(
                categoryName, JobCategory.TaxonomyType.OCCUPATION);
        if (existingCategory.isPresent()) {
            return existingCategory.get();
        }
        
        // Skapa ny kategori
        JobCategory newCategory = new JobCategory();
        newCategory.setName(categoryName);
        newCategory.setDescription("Kategori från JobSearch API: " + categoryName);
        newCategory.setTaxonomyType(JobCategory.TaxonomyType.OCCUPATION);
        newCategory.setHierarchyLevel(0);
        newCategory.setHierarchyPath(categoryName);
        newCategory.setIsActive(true);
        newCategory.setCreatedAt(LocalDateTime.now());
        newCategory.updateSyncInfo();
        
        return jobCategoryRepository.save(newCategory);
    }
}
