package se.stegroo.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import se.stegroo.backend.dto.JobListingDTO;
import se.stegroo.backend.dto.JobSearchRequest;
import se.stegroo.backend.dto.JobSearchResponse;
import se.stegroo.backend.model.JobListing;
import se.stegroo.backend.model.JobCategory;
import se.stegroo.backend.model.Skill;
import se.stegroo.backend.repository.JobListingRepository;
import se.stegroo.backend.repository.JobCategoryRepository;
import se.stegroo.backend.repository.SkillRepository;
import se.stegroo.backend.service.JobSearchApiService;
import se.stegroo.backend.service.JobSearchService;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;

/**
 * REST-controller för jobbannonser.
 * Hanterar grundläggande CRUD-operationer för jobb.
 */
@RestController
@RequestMapping("/api/jobs")
@Tag(name = "Jobs", description = "API för hantering av jobbannonser")
public class JobController {

    private static final Logger log = LoggerFactory.getLogger(JobController.class);

    private final JobListingRepository jobListingRepository;
    private final JobCategoryRepository jobCategoryRepository;
    private final SkillRepository skillRepository;
    private final JobSearchApiService jobSearchApiService;
    private final JobSearchService jobSearchService;

    public JobController(
            JobListingRepository jobListingRepository,
            JobCategoryRepository jobCategoryRepository,
            SkillRepository skillRepository,
            JobSearchApiService jobSearchApiService,
            JobSearchService jobSearchService) {
        this.jobListingRepository = jobListingRepository;
        this.jobCategoryRepository = jobCategoryRepository;
        this.skillRepository = skillRepository;
        this.jobSearchApiService = jobSearchApiService;
        this.jobSearchService = jobSearchService;
    }

    /**
     * Hämtar alla jobb med paginering
     */
    @GetMapping
    @Operation(summary = "Hämta alla jobb", description = "Hämtar en paginerad lista med alla jobbannonser")
    public ResponseEntity<Page<JobListingDTO>> getAllJobs(
            @Parameter(description = "Sidnummer") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Antal per sida") @RequestParam(defaultValue = "20") int size,
            @Parameter(description = "Sorteringskolumn") @RequestParam(defaultValue = "createdAt") String sortBy,
            @Parameter(description = "Sorteringsriktning") @RequestParam(defaultValue = "desc") String sortDir) {
        
        try {
            Sort.Direction direction = sortDir.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
            Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
            
            Page<JobListing> jobPage = jobListingRepository.findAll(pageable);
            Page<JobListingDTO> jobDTOPage = jobPage.map(this::convertToDTO);
            
            log.info("Hämtade {} jobb från sida {}", jobDTOPage.getNumberOfElements(), page);
            return ResponseEntity.ok(jobDTOPage);
        } catch (Exception e) {
            log.error("Fel vid hämtning av jobb", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Hämtar ett specifikt jobb baserat på ID
     */
    @GetMapping("/{id}")
    @Operation(summary = "Hämta jobb", description = "Hämtar en specifik jobbannons baserat på ID")
    public ResponseEntity<JobListingDTO> getJobById(
            @Parameter(description = "Jobb-ID") @PathVariable Long id) {
        
        try {
            Optional<JobListing> job = jobListingRepository.findById(id);
            
            if (job.isPresent()) {
                JobListingDTO jobDTO = convertToDTO(job.get());
                log.info("Hämtade jobb med ID: {}", id);
                return ResponseEntity.ok(jobDTO);
            } else {
                log.warn("Jobb med ID {} hittades inte", id);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            log.error("Fel vid hämtning av jobb med ID: {}", id, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Skapar ett nytt jobb
     */
    @PostMapping
    @Operation(summary = "Skapa jobb", description = "Skapar en ny jobbannons")
    @Transactional
    public ResponseEntity<JobListingDTO> createJob(@Valid @RequestBody CreateJobRequest request) {
        try {
            JobListing job = new JobListing();
            job.setTitle(request.getTitle());
            job.setDescription(request.getDescription());
            job.setCompanyName(request.getCompanyName());
            job.setLocation(request.getLocation());
            job.setEmploymentType(request.getEmploymentType());
            job.setWorkingHoursType(request.getWorkingHoursType());
            job.setSource("Direct");
            job.setStatus(JobListing.Status.ACTIVE);
            job.setCreatedAt(LocalDateTime.now());
            job.setUpdatedAt(LocalDateTime.now());

            // Sätt kategori om angiven
            if (request.getCategoryId() != null) {
                Optional<JobCategory> category = jobCategoryRepository.findById(request.getCategoryId());
                category.ifPresent(job::setCategory);
            }

            // Lägg till kompetenser om angivna
            if (request.getSkillIds() != null && !request.getSkillIds().isEmpty()) {
                Set<Skill> skills = skillRepository.findAllById(request.getSkillIds())
                        .stream().collect(Collectors.toSet());
                job.setSkills(skills);
            }

            JobListing savedJob = jobListingRepository.save(job);
            JobListingDTO jobDTO = convertToDTO(savedJob);
            
            log.info("Skapade nytt jobb med ID: {}", savedJob.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(jobDTO);
        } catch (Exception e) {
            log.error("Fel vid skapande av jobb", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Uppdaterar ett befintligt jobb
     */
    @PutMapping("/{id}")
    @Operation(summary = "Uppdatera jobb", description = "Uppdaterar en befintlig jobbannons")
    @Transactional
    public ResponseEntity<JobListingDTO> updateJob(
            @Parameter(description = "Jobb-ID") @PathVariable Long id,
            @Valid @RequestBody UpdateJobRequest request) {
        
        try {
            Optional<JobListing> existingJob = jobListingRepository.findById(id);
            
            if (!existingJob.isPresent()) {
                log.warn("Jobb med ID {} hittades inte för uppdatering", id);
                return ResponseEntity.notFound().build();
            }

            JobListing job = existingJob.get();
            
            // Uppdatera fält om de är angivna
            if (request.getTitle() != null) {
                job.setTitle(request.getTitle());
            }
            if (request.getDescription() != null) {
                job.setDescription(request.getDescription());
            }
            if (request.getCompanyName() != null) {
                job.setCompanyName(request.getCompanyName());
            }
            if (request.getLocation() != null) {
                job.setLocation(request.getLocation());
            }
            if (request.getEmploymentType() != null) {
                job.setEmploymentType(request.getEmploymentType());
            }
            if (request.getWorkingHoursType() != null) {
                job.setWorkingHoursType(request.getWorkingHoursType());
            }
            if (request.getStatus() != null) {
                job.setStatus(request.getStatus());
            }

            job.setUpdatedAt(LocalDateTime.now());

            // Uppdatera kategori om angiven
            if (request.getCategoryId() != null) {
                Optional<JobCategory> category = jobCategoryRepository.findById(request.getCategoryId());
                category.ifPresent(job::setCategory);
            }

            // Uppdatera kompetenser om angivna
            if (request.getSkillIds() != null) {
                Set<Skill> skills = skillRepository.findAllById(request.getSkillIds())
                        .stream().collect(Collectors.toSet());
                job.setSkills(skills);
            }

            JobListing updatedJob = jobListingRepository.save(job);
            JobListingDTO jobDTO = convertToDTO(updatedJob);
            
            log.info("Uppdaterade jobb med ID: {}", id);
            return ResponseEntity.ok(jobDTO);
        } catch (Exception e) {
            log.error("Fel vid uppdatering av jobb med ID: {}", id, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Tar bort ett jobb (soft delete - markerar som REMOVED)
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Ta bort jobb", description = "Tar bort en jobbannons (soft delete)")
    @Transactional
    public ResponseEntity<Void> deleteJob(
            @Parameter(description = "Jobb-ID") @PathVariable Long id) {
        
        try {
            Optional<JobListing> existingJob = jobListingRepository.findById(id);
            
            if (!existingJob.isPresent()) {
                log.warn("Jobb med ID {} hittades inte för borttagning", id);
                return ResponseEntity.notFound().build();
            }

            JobListing job = existingJob.get();
            job.setStatus(JobListing.Status.REMOVED);
            job.setRemovedAt(LocalDateTime.now());
            job.setUpdatedAt(LocalDateTime.now());
            
            jobListingRepository.save(job);
            
            log.info("Markerade jobb med ID {} som borttaget", id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            log.error("Fel vid borttagning av jobb med ID: {}", id, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Hämtar jobb baserat på status
     */
    @GetMapping("/status/{status}")
    @Operation(summary = "Hämta jobb efter status", description = "Hämtar jobb baserat på status")
    public ResponseEntity<List<JobListingDTO>> getJobsByStatus(
            @Parameter(description = "Jobbstatus") @PathVariable JobListing.Status status) {
        
        try {
            List<JobListing> jobs = jobListingRepository.findByStatus(status);
            List<JobListingDTO> jobDTOs = jobs.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
            
            log.info("Hämtade {} jobb med status: {}", jobDTOs.size(), status);
            return ResponseEntity.ok(jobDTOs);
        } catch (Exception e) {
            log.error("Fel vid hämtning av jobb med status: {}", status, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Konverterar JobListing till DTO
     */
    private JobListingDTO convertToDTO(JobListing job) {
        JobListingDTO.CategoryDTO categoryDTO = null;
        if (job.getCategory() != null) {
            categoryDTO = JobListingDTO.CategoryDTO.builder()
                    .id(job.getCategory().getId())
                    .name(job.getCategory().getName())
                    .build();
        }

        Set<JobListingDTO.SkillDTO> skillDTOs = job.getSkills().stream()
                .map(skill -> JobListingDTO.SkillDTO.builder()
                        .id(skill.getId())
                        .name(skill.getName())
                        .build())
                .collect(Collectors.toSet());

        return JobListingDTO.builder()
                .id(job.getId())
                .title(job.getTitle())
                .description(job.getDescription())
                .companyName(job.getCompanyName())
                .location(job.getLocation())
                .externalId(job.getExternalId())
                .externalUrl(job.getExternalUrl())
                .source(job.getSource())
                .employmentType(job.getEmploymentType())
                .publishedAt(job.getPublishedAt())
                .deadline(job.getDeadline())
                .lastModified(job.getLastModified())
                .createdAt(job.getCreatedAt() != null ? job.getCreatedAt() : job.getPublishedAt())
                .category(categoryDTO)
                .skills(skillDTOs)
                .build();
    }

    /**
     * Request DTO för att skapa ett nytt jobb
     */
    public static class CreateJobRequest {
        private String title;
        private String description;
        private String companyName;
        private String location;
        private String employmentType;
        private String workingHoursType;
        private Long categoryId;
        private Set<Long> skillIds;

        // Getters and setters
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        
        public String getCompanyName() { return companyName; }
        public void setCompanyName(String companyName) { this.companyName = companyName; }
        
        public String getLocation() { return location; }
        public void setLocation(String location) { this.location = location; }
        
        public String getEmploymentType() { return employmentType; }
        public void setEmploymentType(String employmentType) { this.employmentType = employmentType; }
        
        public String getWorkingHoursType() { return workingHoursType; }
        public void setWorkingHoursType(String workingHoursType) { this.workingHoursType = workingHoursType; }
        
        public Long getCategoryId() { return categoryId; }
        public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
        
        public Set<Long> getSkillIds() { return skillIds; }
        public void setSkillIds(Set<Long> skillIds) { this.skillIds = skillIds; }
    }

    /**
     * Request DTO för att uppdatera ett jobb
     */
    public static class UpdateJobRequest {
        private String title;
        private String description;
        private String companyName;
        private String location;
        private String employmentType;
        private String workingHoursType;
        private JobListing.Status status;
        private Long categoryId;
        private Set<Long> skillIds;

        // Getters and setters
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        
        public String getCompanyName() { return companyName; }
        public void setCompanyName(String companyName) { this.companyName = companyName; }
        
        public String getLocation() { return location; }
        public void setLocation(String location) { this.location = location; }
        
        public String getEmploymentType() { return employmentType; }
        public void setEmploymentType(String employmentType) { this.employmentType = employmentType; }
        
        public String getWorkingHoursType() { return workingHoursType; }
        public void setWorkingHoursType(String workingHoursType) { this.workingHoursType = workingHoursType; }
        
        public JobListing.Status getStatus() { return status; }
        public void setStatus(JobListing.Status status) { this.status = status; }
        
        public Long getCategoryId() { return categoryId; }
        public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
        
        public Set<Long> getSkillIds() { return skillIds; }
        public void setSkillIds(Set<Long> skillIds) { this.skillIds = skillIds; }
    }

    // ==================== JOBBSYNKRONISERING OCH SÖKNING ====================

    /**
     * Test endpoint för att verifiera att controllern fungerar
     */
    @GetMapping("/test")
    public String testEndpoint() {
        log.info("Test endpoint anropad");
        System.out.println("Test endpoint anropad");
        return "JobController fungerar korrekt!";
    }

    /**
     * Direkt test av job sync funktionalitet med endast 1 jobb
     */
    @GetMapping("/test-sync")
    public String testSyncEndpoint() {
        log.info("Test sync endpoint anropad - hämtar endast 1 jobb");
        System.out.println("Test sync endpoint anropad - hämtar endast 1 jobb");
        
        try {
            // Testa med JobSearch API - hämta 1 jobb
            List<JobListing> jobs = jobSearchApiService.searchJobs(null, null, null, 1, 0);
            int result = jobs.size();
            
            if (!jobs.isEmpty()) {
                JobListing job = jobs.get(0);
                log.info("Jobb detaljer: ID={}, Titel={}, Företag={}", 
                    job.getExternalId(), job.getTitle(), job.getCompanyName());
                System.out.println("Jobb detaljer: ID=" + job.getExternalId() + 
                    ", Titel=" + job.getTitle() + ", Företag=" + job.getCompanyName());
            }
            
            String response = "Test sync slutförd! Processerade " + result + " jobb.";
            log.info(response);
            System.out.println(response);
            return response;
            
        } catch (Exception e) {
            String error = "Test sync misslyckades: " + e.getMessage();
            log.error(error, e);
            System.out.println(error);
            e.printStackTrace();
            return error;
        }
    }

    /**
     * Synkroniserar alla jobb från Arbetsförmedlingens API till databasen
     */
    @PostMapping("/sync")
    @Operation(summary = "Synkronisera jobb", description = "Hämtar och synkroniserar alla jobb från Arbetsförmedlingens API till databasen med chunking för att hantera stora datamängder")
    public ResponseEntity<SyncResponse> syncJobsFromAPI() {
        log.info("DEBUG: /sync endpoint anropad - startar jobbsynkronisering från Arbetsförmedlingens API med chunking-strategi");
        System.out.println("DEBUG: /sync endpoint anropad - startar jobbsynkronisering");
        
        // Skapa en debug-fil för att spåra utförandet
        try (FileWriter fw = new FileWriter("/Users/chappie/_AppProjects/stegroo/logs/job-sync-debug.log", true);
             BufferedWriter bw = new BufferedWriter(fw);
             PrintWriter out = new PrintWriter(bw)) {
            
            out.println("====== JOB SYNC DEBUG " + LocalDateTime.now() + " ======");
            out.println("/sync endpoint anropad - startar jobbsynkronisering");
            
            try {
                // Använd JobSearch API för att synkronisera jobb
                log.info("DEBUG: Försöker anropa jobSearchApiService.syncJobsToDatabase");
                out.println("Försöker anropa jobSearchApiService.syncJobsToDatabase");
                
                int maxJobs = 1000; // Begränsa till 1000 jobb för att undvika timeout
                int syncedCount = jobSearchApiService.syncJobsToDatabase(maxJobs);
                
                log.info("DEBUG: Synkroniserade {} jobb från JobSearch API", syncedCount);
                out.println("Synkroniserade " + syncedCount + " jobb från JobSearch API");
                out.flush();
                
                SyncResponse response = new SyncResponse();
                response.setSuccess(true);
                response.setSyncedCount(syncedCount);
                response.setMessage("Synkronisering slutförd framgångsrikt från JobSearch API");
                response.setTimestamp(LocalDateTime.now());
                
                log.info("DEBUG: ✅ Jobbsynkronisering från JobSearch API slutförd: {} jobb synkroniserade", syncedCount);
                out.println("✅ Jobbsynkronisering från JobSearch API slutförd: " + syncedCount + " jobb synkroniserade");
                out.println("Skapar response: " + response);
                return ResponseEntity.ok(response);
                
            } catch (Exception e) {
                log.error("DEBUG: ❌ Fel vid jobbsynkronisering: {}", e.getMessage(), e);
                out.println("❌ Fel vid jobbsynkronisering: " + e.getMessage());
                e.printStackTrace(out);
                
                SyncResponse response = new SyncResponse();
                response.setSuccess(false);
                response.setSyncedCount(0);
                response.setMessage("Fel vid synkronisering: " + e.getMessage());
                response.setTimestamp(LocalDateTime.now());
                
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
            }
        } catch (IOException e) {
            log.error("Kunde inte skapa debug-fil: {}", e.getMessage());
            e.printStackTrace();
            
            // Fallback om vi inte kan skriva till debug-filen
            try {
                int maxJobs = 1000;
                int syncedCount = jobSearchApiService.syncJobsToDatabase(maxJobs);
                
                SyncResponse response = new SyncResponse();
                response.setSuccess(true);
                response.setSyncedCount(syncedCount);
                response.setMessage("Synkronisering slutförd framgångsrikt från JobSearch API");
                response.setTimestamp(LocalDateTime.now());
                return ResponseEntity.ok(response);
            } catch (Exception ex) {
                log.error("Fel vid jobbsynkronisering: {}", ex.getMessage());
                
                SyncResponse response = new SyncResponse();
                response.setSuccess(false);
                response.setSyncedCount(0);
                response.setMessage("Fel vid synkronisering: " + ex.getMessage());
                response.setTimestamp(LocalDateTime.now());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
            }
        }
    }

    /**
     * Avancerad jobbsökning med filtrering
     */
    @PostMapping("/search")
    @Operation(summary = "Avancerad jobbsökning", description = "Söker jobb med avancerade filter och sorteringsmöjligheter")
    public ResponseEntity<JobSearchResponse> searchJobs(@RequestBody @Valid JobSearchRequest request) {
        log.info("Utför avancerad jobbsökning: {}", request);
        
        try {
            JobSearchResponse response = jobSearchService.searchJobs(request);
            log.info("Sökning slutförd: {} jobb hittades", response.getTotalElements());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Fel vid jobbsökning: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Söker jobb från JobSearch API (live search)
     */
    @GetMapping("/search-live")
    @Operation(summary = "Live jobbsökning", description = "Söker jobb direkt från JobSearch API")
    public ResponseEntity<List<JobListingDTO>> searchJobsLive(
            @Parameter(description = "Sökterm") @RequestParam(required = false) String query,
            @Parameter(description = "Plats") @RequestParam(required = false) String location,
            @Parameter(description = "Kategori") @RequestParam(required = false) String category,
            @Parameter(description = "Antal jobb") @RequestParam(defaultValue = "20") int limit,
            @Parameter(description = "Offset") @RequestParam(defaultValue = "0") int offset) {
        
        log.info("Live jobbsökning från JobSearch API: query={}, location={}, category={}", query, location, category);
        
        try {
            List<JobListing> jobs = jobSearchApiService.searchJobs(query, location, category, limit, offset);
            List<JobListingDTO> jobDTOs = jobs.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
            
            log.info("Hämtade {} jobb från JobSearch API", jobDTOs.size());
            return ResponseEntity.ok(jobDTOs);
            
        } catch (Exception e) {
            log.error("Fel vid live jobbsökning: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Enkel jobbsökning med query parameter (från databas)
     */
    @GetMapping("/search")
    @Operation(summary = "Enkel jobbsökning", description = "Söker jobb baserat på sökterm, plats och kategori från databas")
    public ResponseEntity<Page<JobListingDTO>> simpleSearch(
            @Parameter(description = "Sökterm") @RequestParam(required = false) String query,
            @Parameter(description = "Plats") @RequestParam(required = false) String location,
            @Parameter(description = "Kategori ID") @RequestParam(required = false) Long categoryId,
            @Parameter(description = "Anställningstyp") @RequestParam(required = false) String employmentType,
            @Parameter(description = "Sidnummer") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Antal per sida") @RequestParam(defaultValue = "20") int size,
            @Parameter(description = "Sortera efter") @RequestParam(defaultValue = "createdAt") String sortBy,
            @Parameter(description = "Sorteringsriktning") @RequestParam(defaultValue = "desc") String sortDir) {
        
        log.info("Enkel jobbsökning: query={}, location={}, categoryId={}", query, location, categoryId);
        
        try {
            // Använd repository för enkel sökning
            Sort.Direction direction = sortDir.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
            Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
            
            Page<JobListing> jobPage = jobListingRepository.search(
                query, categoryId, location, null, employmentType, pageable
            );
            
            Page<JobListingDTO> jobDTOPage = jobPage.map(this::convertToDTO);
            return ResponseEntity.ok(jobDTOPage);
            
        } catch (Exception e) {
            log.error("Fel vid enkel jobbsökning: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Hämtar jobbstatistik
     */
    @GetMapping("/stats")
    @Operation(summary = "Jobbstatistik", description = "Hämtar statistik över jobb i systemet")
    public ResponseEntity<JobSearchResponse.JobStats> getJobStats() {
        try {
            JobSearchResponse.JobStats stats = jobSearchService.getJobStats();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            log.error("Fel vid hämtning av jobbstatistik: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Hämtar liknande jobb
     */
    @GetMapping("/{id}/similar")
    @Operation(summary = "Liknande jobb", description = "Hämtar jobb som liknar det angivna jobbet")
    public ResponseEntity<List<JobListingDTO>> getSimilarJobs(
            @Parameter(description = "Jobb ID") @PathVariable Long id,
            @Parameter(description = "Antal jobb att returnera") @RequestParam(defaultValue = "5") int limit) {
        
        try {
            List<JobListing> similarJobs = jobSearchService.findSimilarJobs(id, limit);
            List<JobListingDTO> similarJobDTOs = similarJobs.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
            
            return ResponseEntity.ok(similarJobDTOs);
            
        } catch (Exception e) {
            log.error("Fel vid hämtning av liknande jobb: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ==================== HJÄLPKLASSER ====================

    /**
     * Response för synkroniseringsoperationer
     */
    public static class SyncResponse {
        private boolean success;
        private int syncedCount;
        private String message;
        private LocalDateTime timestamp;

        public boolean isSuccess() { return success; }
        public void setSuccess(boolean success) { this.success = success; }

        public int getSyncedCount() { return syncedCount; }
        public void setSyncedCount(int syncedCount) { this.syncedCount = syncedCount; }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }

        public LocalDateTime getTimestamp() { return timestamp; }
        public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    }
}