package se.stegroo.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import se.stegroo.backend.dto.JobSearchRequest;
import se.stegroo.backend.dto.JobSearchResponse;
import se.stegroo.backend.model.JobCategory;
import se.stegroo.backend.model.JobListing;
import se.stegroo.backend.model.Skill;
import se.stegroo.backend.service.JobSearchService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/job-search")
@Tag(name = "Job Search", description = "API för avancerad jobbsökning och filtrering")
public class JobSearchController {

    private static final Logger log = LoggerFactory.getLogger(JobSearchController.class);

    private final JobSearchService jobSearchService;

    @Autowired
    public JobSearchController(JobSearchService jobSearchService) {
        this.jobSearchService = jobSearchService;
    }

    @PostMapping("/advanced-search")
    @Operation(summary = "Avancerad jobbsökning", description = "Söker jobb med avancerad filtrering och sortering via dedicated endpoint")
    public ResponseEntity<JobSearchResponse> searchJobs(@RequestBody JobSearchRequest request) {
        try {
            log.info("Söker jobb med kriterier: {}", request);
            JobSearchResponse response = jobSearchService.searchJobs(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Fel vid jobbsökning", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/query-search")
    @Operation(summary = "Enkel jobbsökning", description = "Söker jobb med query-parametrar")
    public ResponseEntity<JobSearchResponse> searchJobsSimple(
            @Parameter(description = "Sökfras") @RequestParam(required = false) String query,
            @Parameter(description = "Plats") @RequestParam(required = false) String location,
            @Parameter(description = "Kategori-ID") @RequestParam(required = false) Long categoryId,
            @Parameter(description = "Sidnummer") @RequestParam(defaultValue = "0") Integer page,
            @Parameter(description = "Antal per sida") @RequestParam(defaultValue = "20") Integer size) {
        
        try {
            JobSearchRequest request = new JobSearchRequest(query, location, categoryId);
            request.setPage(page);
            request.setSize(size);
            
            log.info("Enkel jobbsökning med parametrar: query={}, location={}, categoryId={}, page={}, size={}", 
                    query, location, categoryId, page, size);
            
            JobSearchResponse response = jobSearchService.searchJobs(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Fel vid enkel jobbsökning", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/by-skills")
    @Operation(summary = "Sök jobb baserat på kompetenser", description = "Hittar jobb som kräver specifika kompetenser")
    public ResponseEntity<List<JobListing>> findJobsBySkills(
            @Parameter(description = "Kompetensnamn (kommaseparerade)") @RequestParam String skillNames) {
        
        try {
            Set<String> skills = Set.of(skillNames.split(","));
            log.info("Söker jobb baserat på kompetenser: {}", skills);
            
            List<JobListing> jobs = jobSearchService.findJobsBySkills(skills);
            return ResponseEntity.ok(jobs);
        } catch (Exception e) {
            log.error("Fel vid sökning av jobb baserat på kompetenser", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/by-category/{categoryId}")
    @Operation(summary = "Sök jobb i kategori-hierarki", description = "Hittar jobb inom en kategori och alla dess underkategorier")
    public ResponseEntity<List<JobListing>> findJobsInCategoryHierarchy(
            @Parameter(description = "Kategori-ID") @PathVariable Long categoryId) {
        
        try {
            log.info("Söker jobb i kategori-hierarki: {}", categoryId);
            List<JobListing> jobs = jobSearchService.findJobsInCategoryHierarchy(categoryId);
            return ResponseEntity.ok(jobs);
        } catch (Exception e) {
            log.error("Fel vid sökning av jobb i kategori-hierarki", e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Hämtar alla jobb från databasen (för debugging)
     */
    @GetMapping("/all")
    @Operation(summary = "Hämta alla jobb", description = "Hämta alla jobb från databasen för debugging")
    public ResponseEntity<List<JobListing>> getAllJobs() {
        try {
            log.info("Hämtar alla jobb från databasen");
            List<JobListing> allJobs = jobSearchService.getAllJobs();
            return ResponseEntity.ok(allJobs);
        } catch (Exception e) {
            log.error("Fel vid hämtning av alla jobb", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/find-similar/{jobId}")
    @Operation(summary = "Hitta liknande jobb", description = "Hittar jobb som liknar det angivna jobbet")
    public ResponseEntity<List<JobListing>> findSimilarJobs(
            @Parameter(description = "Jobb-ID") @PathVariable Long jobId,
            @Parameter(description = "Max antal resultat") @RequestParam(defaultValue = "10") Integer limit) {
        
        try {
            log.info("Söker liknande jobb för jobb: {} med limit: {}", jobId, limit);
            List<JobListing> similarJobs = jobSearchService.findSimilarJobs(jobId, limit);
            return ResponseEntity.ok(similarJobs);
        } catch (IllegalArgumentException e) {
            log.warn("Jobb hittades inte: {}", jobId);
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Fel vid sökning av liknande jobb", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/advanced-stats")
    @Operation(summary = "Jobb-statistik (avancerad)", description = "Hämtar detaljerad statistik över jobb i systemet")
    public ResponseEntity<JobSearchResponse.JobStats> getJobStats() {
        try {
            log.info("Hämtar jobb-statistik");
            JobSearchResponse.JobStats stats = jobSearchService.getJobStats();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            log.error("Fel vid hämtning av jobb-statistik", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/categories/popular")
    @Operation(summary = "Populära kategorier", description = "Hämtar populära jobbkategorier baserat på antal jobb")
    public ResponseEntity<List<JobCategory>> getPopularCategories(
            @Parameter(description = "Max antal resultat") @RequestParam(defaultValue = "10") Integer limit) {
        
        try {
            log.info("Hämtar populära kategorier med limit: {}", limit);
            List<JobCategory> categories = jobSearchService.getPopularCategories(limit);
            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            log.error("Fel vid hämtning av populära kategorier", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/skills/popular")
    @Operation(summary = "Populära kompetenser", description = "Hämtar populära kompetenser baserat på antal jobb")
    public ResponseEntity<List<Skill>> getPopularSkills(
            @Parameter(description = "Max antal resultat") @RequestParam(defaultValue = "10") Integer limit) {
        
        try {
            log.info("Hämtar populära kompetenser med limit: {}", limit);
            List<Skill> skills = jobSearchService.getPopularSkills(limit);
            return ResponseEntity.ok(skills);
        } catch (Exception e) {
            log.error("Fel vid hämtning av populära kompetenser", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/filters")
    @Operation(summary = "Tillgängliga filter", description = "Hämtar information om tillgängliga filter för jobbsökning")
    public ResponseEntity<Map<String, Object>> getAvailableFilters() {
        try {
            log.info("Hämtar tillgängliga filter");
            
            Map<String, Object> filters = new HashMap<>();
            
            // Hämta statistik
            JobSearchResponse.JobStats stats = jobSearchService.getJobStats();
            filters.put("stats", stats);
            
            // Hämta populära kategorier
            List<JobCategory> popularCategories = jobSearchService.getPopularCategories(5);
            filters.put("popularCategories", popularCategories);
            
            // Hämta populära kompetenser
            List<Skill> popularSkills = jobSearchService.getPopularSkills(10);
            filters.put("popularSkills", popularSkills);
            
            return ResponseEntity.ok(filters);
        } catch (Exception e) {
            log.error("Fel vid hämtning av tillgängliga filter", e);
            return ResponseEntity.internalServerError().build();
        }
    }
}
