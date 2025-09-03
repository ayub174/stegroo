package se.stegroo.backend.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import se.stegroo.backend.model.JobListing;
import se.stegroo.backend.model.JobCategory;
import se.stegroo.backend.model.Skill;
import se.stegroo.backend.service.JobSyncService;
import se.stegroo.backend.service.TaxonomiService;
import se.stegroo.backend.repository.JobCategoryRepository;
import se.stegroo.backend.repository.SkillRepository;

/**
 * Admin-kontroller för administrativa uppgifter och debugging
 */
@RestController
@RequestMapping("/api/admin")
@Tag(name = "Admin", description = "Administrativa endpoints")
public class AdminController {
    
    private static final Logger log = LoggerFactory.getLogger(AdminController.class);
    
    private final JobSyncService jobSyncService;
    private final TaxonomiService taxonomiService;
    private final JobCategoryRepository jobCategoryRepository;
    private final SkillRepository skillRepository;
    
    @Autowired
    public AdminController(JobSyncService jobSyncService, TaxonomiService taxonomiService, JobCategoryRepository jobCategoryRepository, SkillRepository skillRepository) {
        this.jobSyncService = jobSyncService;
        this.taxonomiService = taxonomiService;
        this.jobCategoryRepository = jobCategoryRepository;
        this.skillRepository = skillRepository;
    }
    
    /**
     * Debug-endpoint för att testa Arbetsförmedlingens API
     */
    @PostMapping("/debug-af-api")
    @Operation(summary = "Testa Arbetsförmedlingens API", description = "Hämtar jobb från Arbetsförmedlingens Jobstream API")
    public ResponseEntity<Map<String, Object>> debugAfApi() {
        try {
            log.info("Admin anropar debug-af-api endpoint");
            
            // Starta manuell synkronisering
            jobSyncService.syncJobsManually();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Synkronisering startad");
            response.put("timestamp", java.time.LocalDateTime.now().toString());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Fel vid debug-af-api", e);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Fel: " + e.getMessage());
            response.put("error", e.getClass().getSimpleName());
            
            return ResponseEntity.status(500).body(response);
        }
    }
    
    /**
     * Test-endpoint för batch-hämtning av jobb
     */
    @PostMapping("/test-batch-fetch")
    @Operation(summary = "Testa batch-hämtning", description = "Hämtar jobb i mindre batchar för att testa prestanda")
    public ResponseEntity<Map<String, Object>> testBatchFetch(
            @RequestParam(defaultValue = "100") int batchSize) {
        try {
            log.info("Admin anropar test-batch-fetch endpoint med batch-storlek: {}", batchSize);
            
            var arbetsformedlingenService = jobSyncService.getArbetsformedlingenService();
            var jobs = arbetsformedlingenService.fetchJobsBatch(batchSize);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Batch-hämtning slutförd");
            response.put("batchSize", batchSize);
            response.put("jobsFetched", jobs.size());
            response.put("jobs", jobs.stream()
                    .limit(10) // Begränsa antalet jobb i svaret
                    .map(this::convertToJobDto)
                    .collect(Collectors.toList()));
            response.put("timestamp", java.time.LocalDateTime.now().toString());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Fel vid test-batch-fetch", e);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Fel: " + e.getMessage());
            response.put("error", e.getClass().getSimpleName());
            
            return ResponseEntity.status(500).body(response);
        }
    }
    
    /**
     * Sök jobb med parametrar
     */
    @GetMapping("/search-jobs")
    @Operation(summary = "Sök jobb", description = "Söker jobb från Arbetsförmedlingens Jobstream API")
    public ResponseEntity<Map<String, Object>> searchJobs(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String category) {
        try {
            var arbetsformedlingenService = jobSyncService.getArbetsformedlingenService();
            var jobs = arbetsformedlingenService.searchJobs(query, location, category);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Sökning slutförd");
            response.put("count", jobs.size());
            response.put("jobs", jobs.stream()
                    .limit(10) // Begränsa antalet jobb i svaret
                    .map(this::convertToJobDto)
                    .collect(Collectors.toList()));
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Sökning misslyckades: " + e.getMessage());
            response.put("error", e.getClass().getSimpleName());
            
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * Synkronisera alla taxonomier från Arbetsförmedlingen
     */
    @PostMapping("/sync-taxonomies")
    @Operation(summary = "Synkronisera taxonomier", description = "Synkroniserar alla taxonomier från Arbetsförmedlingen")
    public ResponseEntity<Map<String, Object>> syncTaxonomies() {
        try {
            log.info("Admin anropar sync-taxonomies endpoint");
            
            taxonomiService.syncAllTaxonomies();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Taxonomi-synkronisering slutförd");
            response.put("timestamp", java.time.LocalDateTime.now().toString());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Fel vid taxonomi-synkronisering", e);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Taxonomi-synkronisering misslyckades: " + e.getMessage());
            response.put("error", e.getClass().getSimpleName());
            
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * Synkronisera specifik taxonomi-typ
     */
    @PostMapping("/sync-taxonomy/{type}")
    @Operation(summary = "Synkronisera specifik taxonomi", description = "Synkroniserar en specifik taxonomi-typ")
    public ResponseEntity<Map<String, Object>> syncTaxonomyType(
            @PathVariable String type,
            @RequestParam(required = false) String internalType) {
        try {
            log.info("Admin anropar sync-taxonomy endpoint för typ: {}", type);
            
            JobCategory.TaxonomyType taxonomyType = internalType != null ? 
                JobCategory.TaxonomyType.valueOf(internalType.toUpperCase()) : 
                JobCategory.TaxonomyType.OCCUPATION;
            
            taxonomiService.syncTaxonomyType(type, taxonomyType);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Taxonomi-synkronisering slutförd för typ: " + type);
            response.put("timestamp", java.time.LocalDateTime.now().toString());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Fel vid synkronisering av taxonomi-typ: {}", type, e);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Taxonomi-synkronisering misslyckades: " + e.getMessage());
            response.put("error", e.getClass().getSimpleName());
            
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * Hämta synkroniseringsstatus för taxonomier
     */
    @GetMapping("/taxonomy-status")
    @Operation(summary = "Taxonomi-status", description = "Hämtar synkroniseringsstatus för alla taxonomier")
    public ResponseEntity<Map<String, Object>> getTaxonomyStatus() {
        try {
            Map<String, Object> status = taxonomiService.getSyncStatus();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("status", status);
            response.put("timestamp", java.time.LocalDateTime.now().toString());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Fel vid hämtning av taxonomi-status", e);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Kunde inte hämta taxonomi-status: " + e.getMessage());
            response.put("error", e.getClass().getSimpleName());
            
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * Hämta alla kategorier
     */
    @GetMapping("/categories")
    @Operation(summary = "Hämta kategorier", description = "Hämtar alla jobbkategorier")
    public ResponseEntity<Map<String, Object>> getCategories() {
        try {
            List<JobCategory> categories = jobCategoryRepository.findAll();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("count", categories.size());
            response.put("categories", categories.stream()
                    .map(this::convertToCategoryDto)
                    .collect(Collectors.toList()));
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Fel vid hämtning av kategorier", e);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Kunde inte hämta kategorier: " + e.getMessage());
            response.put("error", e.getClass().getSimpleName());
            
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * Hämta alla kompetenser
     */
    @GetMapping("/skills")
    @Operation(summary = "Hämta kompetenser", description = "Hämtar alla kompetenser")
    public ResponseEntity<Map<String, Object>> getSkills() {
        try {
            List<Skill> skills = skillRepository.findAll();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("count", skills.size());
            response.put("skills", skills.stream()
                    .map(this::convertToSkillDto)
                    .collect(Collectors.toList()));
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Fel vid hämtning av kompetenser", e);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Kunde inte hämta kompetenser: " + e.getMessage());
            response.put("error", e.getClass().getSimpleName());
            
            return ResponseEntity.status(500).body(response);
        }
    }
    
    /**
     * Hjälpmetod för att konvertera JobListing till DTO
     */
    private Map<String, Object> convertToJobDto(JobListing job) {
        Map<String, Object> dto = new HashMap<>();
        dto.put("id", job.getId());
        dto.put("title", job.getTitle());
        dto.put("companyName", job.getCompanyName());
        dto.put("location", job.getLocation());
        dto.put("externalId", job.getExternalId());
        dto.put("status", job.getStatus());
        dto.put("createdAt", job.getCreatedAt());
        return dto;
    }

    /**
     * Hjälpmetod för att konvertera JobCategory till DTO
     */
    private Map<String, Object> convertToCategoryDto(JobCategory category) {
        Map<String, Object> dto = new HashMap<>();
        dto.put("id", category.getId());
        dto.put("name", category.getName());
        dto.put("description", category.getDescription());
        dto.put("taxonomyType", category.getTaxonomyType());
        dto.put("hierarchyLevel", category.getHierarchyLevel());
        dto.put("hierarchyPath", category.getHierarchyPath());
        dto.put("isActive", category.getIsActive());
        dto.put("lastSyncAt", category.getLastSyncAt());
        dto.put("createdAt", category.getCreatedAt());
        return dto;
    }

    /**
     * Hjälpmetod för att konvertera Skill till DTO
     */
    private Map<String, Object> convertToSkillDto(Skill skill) {
        Map<String, Object> dto = new HashMap<>();
        dto.put("id", skill.getId());
        dto.put("name", skill.getName());
        dto.put("description", skill.getDescription());
        dto.put("taxonomyType", skill.getTaxonomyType());
        dto.put("skillLevel", skill.getSkillLevel());
        dto.put("isActive", skill.getIsActive());
        dto.put("lastSyncAt", skill.getLastSyncAt());
        dto.put("createdAt", skill.getCreatedAt());
        return dto;
    }
}
