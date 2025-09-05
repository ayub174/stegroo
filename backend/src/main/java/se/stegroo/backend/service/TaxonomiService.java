package se.stegroo.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;
import se.stegroo.backend.dto.af.AfJobStreamResponse;
import se.stegroo.backend.model.JobCategory;
import se.stegroo.backend.model.Skill;
import se.stegroo.backend.repository.JobCategoryRepository;
import se.stegroo.backend.repository.SkillRepository;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

/**
 * Service för att hantera taxonomi-synkronisering mellan Arbetsförmedlingens system
 * och våra interna entiteter. Implementerar robust synkronisering med felhantering
 * och skalbarhet för stora datamängder.
 */
@Service
@Transactional
public class TaxonomiService {
    
    private static final Logger log = LoggerFactory.getLogger(TaxonomiService.class);
    
    @Value("${af.api.base-url}")
    private String baseUrl;
    
    @Value("${af.api.key}")
    private String apiKey;
    
    private final RestClient restClient;
    private final JobCategoryRepository jobCategoryRepository;
    private final SkillRepository skillRepository;
    
    // Cache för att undvika duplicerade API-anrop
    private final Map<String, LocalDateTime> lastSyncCache = new ConcurrentHashMap<>();
    
    public TaxonomiService(
            RestClient restClient,
            JobCategoryRepository jobCategoryRepository,
            SkillRepository skillRepository) {
        this.restClient = restClient;
        this.jobCategoryRepository = jobCategoryRepository;
        this.skillRepository = skillRepository;
    }
    
    /**
     * Synkroniserar alla taxonomier från Arbetsförmedlingen
     */
    public void syncAllTaxonomies() {
        log.info("Startar synkronisering av alla taxonomier");
        
        try {
            // Synkronisera olika typer av taxonomier parallellt
            CompletableFuture<Void> occupationSync = CompletableFuture.runAsync(() -> 
                syncTaxonomyType("occupation", JobCategory.TaxonomyType.OCCUPATION));
            
            CompletableFuture<Void> skillSync = CompletableFuture.runAsync(() -> 
                syncTaxonomyType("skill", JobCategory.TaxonomyType.SKILL));
            
            CompletableFuture<Void> employmentTypeSync = CompletableFuture.runAsync(() -> 
                syncTaxonomyType("employment_type", JobCategory.TaxonomyType.EMPLOYMENT_TYPE));
            
            CompletableFuture<Void> workingHoursSync = CompletableFuture.runAsync(() -> 
                syncTaxonomyType("working_hours", JobCategory.TaxonomyType.WORKING_HOURS));
            
            // Vänta på att alla synkroniseringar slutförs
            CompletableFuture.allOf(occupationSync, skillSync, employmentTypeSync, workingHoursSync).join();
            
            log.info("Alla taxonomier synkroniserade framgångsrikt");
            
        } catch (Exception e) {
            log.error("Fel vid synkronisering av taxonomier", e);
            throw new RuntimeException("Taxonomi-synkronisering misslyckades", e);
        }
    }
    
    /**
     * Synkroniserar en specifik typ av taxonomi
     */
    public void syncTaxonomyType(String taxonomyType, JobCategory.TaxonomyType internalType) {
        log.info("Synkroniserar taxonomi-typ: {}", taxonomyType);
        
        try {
            String url = baseUrl + "/taxonomy/" + taxonomyType;
            
            var response = restClient.get()
                    .uri(url)
                    .header("api-key", apiKey != null ? apiKey : "")
                    .retrieve()
                    .body(AfJobStreamResponse.class);
            
            if (response != null && response.getAds() != null) {
                processTaxonomyData(response.getAds(), internalType);
                updateLastSync(taxonomyType);
                log.info("Taxonomi-typ {} synkroniserad: {} poster", taxonomyType, response.getAds().size());
            } else {
                log.warn("Ingen data hittades för taxonomi-typ: {}", taxonomyType);
            }
            
        } catch (Exception e) {
            log.error("Fel vid synkronisering av taxonomi-typ: {}", taxonomyType, e);
            // Fortsätt med andra taxonomier istället för att krascha hela processen
        }
    }
    
    /**
     * Bearbetar taxonomi-data och skapar/uppdaterar entiteter
     */
    private void processTaxonomyData(List<AfJobStreamResponse.AfJobAd> ads, JobCategory.TaxonomyType type) {
        if (ads == null || ads.isEmpty()) {
            return;
        }
        
        // Gruppera data efter typ
        Map<String, List<AfJobStreamResponse.AfJobAd>> groupedData = ads.stream()
                .collect(Collectors.groupingBy(ad -> extractTaxonomyValue(ad, type)));
        
        // Bearbeta varje grupp
        groupedData.forEach((taxonomyValue, jobAds) -> {
            if (taxonomyValue != null && !taxonomyValue.trim().isEmpty()) {
                processTaxonomyValue(taxonomyValue, jobAds, type);
            }
        });
    }
    
    /**
     * Extraherar taxonomi-värde från jobbannons baserat på typ
     */
    private String extractTaxonomyValue(AfJobStreamResponse.AfJobAd ad, JobCategory.TaxonomyType type) {
        switch (type) {
            case OCCUPATION:
                return ad.getOccupation() != null && !ad.getOccupation().isEmpty() 
                    ? ad.getOccupation().get(0).getLabel() : null;
            case EMPLOYMENT_TYPE:
                return ad.getEmploymentType() != null ? ad.getEmploymentType().getLabel() : null;
            case WORKING_HOURS:
                return ad.getWorkingHoursType() != null ? ad.getWorkingHoursType().getLabel() : null;
            case SKILL:
                return ad.getMustHave() != null && ad.getMustHave().getSkills() != null && !ad.getMustHave().getSkills().isEmpty()
                    ? ad.getMustHave().getSkills().get(0).getLabel() : null;
            default:
                return null;
        }
    }
    
    /**
     * Bearbetar ett specifikt taxonomi-värde
     */
    private void processTaxonomyValue(String value, List<AfJobStreamResponse.AfJobAd> jobAds, JobCategory.TaxonomyType type) {
        try {
            // Hitta befintlig kategori eller skapa ny
            Optional<JobCategory> existingCategory = jobCategoryRepository.findByNameAndTaxonomyType(value, type);
            
            if (existingCategory.isPresent()) {
                updateExistingCategory(existingCategory.get(), jobAds, type);
            } else {
                createNewCategory(value, jobAds, type);
            }
            
        } catch (Exception e) {
            log.error("Fel vid bearbetning av taxonomi-värde: {}", value, e);
        }
    }
    
    /**
     * Uppdaterar befintlig kategori med ny information
     */
    private void updateExistingCategory(JobCategory category, List<AfJobStreamResponse.AfJobAd> jobAds, JobCategory.TaxonomyType type) {
        // Uppdatera synkroniseringsinformation
        category.updateSyncInfo();
        
        // Uppdatera beskrivning om den saknas
        if (category.getDescription() == null || category.getDescription().trim().isEmpty()) {
            String description = generateDescription(jobAds, type);
            category.setDescription(description);
        }
        
        // Uppdatera external_id om den saknas
        if (category.getExternalId() == null && !jobAds.isEmpty()) {
            String externalId = extractExternalId(jobAds.get(0), type);
            if (externalId != null) {
                category.setExternalId(externalId);
            }
        }
        
        jobCategoryRepository.save(category);
        log.debug("Uppdaterade kategori: {}", category.getName());
    }
    
    /**
     * Skapar ny kategori
     */
    private void createNewCategory(String value, List<AfJobStreamResponse.AfJobAd> jobAds, JobCategory.TaxonomyType type) {
        JobCategory newCategory = new JobCategory();
        newCategory.setName(value);
        newCategory.setTaxonomyType(type);
        newCategory.setDescription(generateDescription(jobAds, type));
        
        // Sätt external_id om möjligt
        if (!jobAds.isEmpty()) {
            String externalId = extractExternalId(jobAds.get(0), type);
            if (externalId != null) {
                newCategory.setExternalId(externalId);
            }
        }
        
        // Sätt tidsstämplar
        newCategory.setCreatedAt(LocalDateTime.now());
        newCategory.updateSyncInfo();
        
        jobCategoryRepository.save(newCategory);
        log.info("Skapade ny kategori: {} (typ: {})", value, type);
    }
    
    /**
     * Genererar beskrivning baserat på jobbannonser
     */
    private String generateDescription(List<AfJobStreamResponse.AfJobAd> jobAds, JobCategory.TaxonomyType type) {
        if (jobAds.isEmpty()) {
            return "Kategori från Arbetsförmedlingen: " + type.name();
        }
        
        // Samla unika företagsnamn
        Set<String> companies = jobAds.stream()
                .map(ad -> ad.getEmployer() != null ? ad.getEmployer().getName() : null)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());
        
        if (companies.isEmpty()) {
            return "Kategori från Arbetsförmedlingen: " + type.name();
        }
        
        return String.format("Kategori från Arbetsförmedlingen: %s. Exempel på företag: %s", 
                type.name(), String.join(", ", companies.stream().limit(5).collect(Collectors.toList())));
    }
    
    /**
     * Extraherar external_id från jobbannons
     */
    private String extractExternalId(AfJobStreamResponse.AfJobAd ad, JobCategory.TaxonomyType type) {
        switch (type) {
            case OCCUPATION:
                return ad.getOccupation() != null && !ad.getOccupation().isEmpty() 
                    ? ad.getOccupation().get(0).getConceptId() : null;
            case EMPLOYMENT_TYPE:
                return ad.getEmploymentType() != null ? ad.getEmploymentType().getConceptId() : null;
            case WORKING_HOURS:
                return ad.getWorkingHoursType() != null ? ad.getWorkingHoursType().getConceptId() : null;
            case SKILL:
                return ad.getMustHave() != null && ad.getMustHave().getSkills() != null && !ad.getMustHave().getSkills().isEmpty()
                    ? ad.getMustHave().getSkills().get(0).getConceptId() : null;
            default:
                return null;
        }
    }
    
    /**
     * Synkroniserar kompetenser från jobbannonser
     */
    public void syncSkillsFromJobs(List<AfJobStreamResponse.AfJobAd> jobAds) {
        log.info("Synkroniserar kompetenser från {} jobbannonser", jobAds.size());
        
        Set<String> processedSkills = new HashSet<>();
        
        for (AfJobStreamResponse.AfJobAd ad : jobAds) {
            if (ad.getMustHave() != null && ad.getMustHave().getSkills() != null) {
                for (AfJobStreamResponse.AfTaxonomy skillTaxonomy : ad.getMustHave().getSkills()) {
                    if (skillTaxonomy.getLabel() != null && !processedSkills.contains(skillTaxonomy.getLabel())) {
                        processSkill(skillTaxonomy);
                        processedSkills.add(skillTaxonomy.getLabel());
                    }
                }
            }
        }
        
        log.info("Synkroniserade {} unika kompetenser", processedSkills.size());
    }
    
    /**
     * Bearbetar en enskild kompetens
     */
    private void processSkill(AfJobStreamResponse.AfTaxonomy skillTaxonomy) {
        try {
            Optional<Skill> existingSkill = skillRepository.findByName(skillTaxonomy.getLabel());
            
            if (existingSkill.isPresent()) {
                updateExistingSkill(existingSkill.get(), skillTaxonomy);
            } else {
                createNewSkill(skillTaxonomy);
            }
            
        } catch (Exception e) {
            log.error("Fel vid bearbetning av kompetens: {}", skillTaxonomy.getLabel(), e);
        }
    }
    
    /**
     * Uppdaterar befintlig kompetens
     */
    private void updateExistingSkill(Skill skill, AfJobStreamResponse.AfTaxonomy skillTaxonomy) {
        skill.updateSyncInfo();
        
        if (skill.getExternalId() == null && skillTaxonomy.getConceptId() != null) {
            skill.setExternalId(skillTaxonomy.getConceptId());
        }
        
        if (skill.getLegacyAmsTaxonomyId() == null && skillTaxonomy.getLegacyAmsTaxonomyId() != null) {
            skill.setLegacyAmsTaxonomyId(skillTaxonomy.getLegacyAmsTaxonomyId());
        }
        
        skillRepository.save(skill);
    }
    
    /**
     * Skapar ny kompetens
     */
    private void createNewSkill(AfJobStreamResponse.AfTaxonomy skillTaxonomy) {
        Skill newSkill = new Skill();
        newSkill.setName(skillTaxonomy.getLabel());
        newSkill.setExternalId(skillTaxonomy.getConceptId());
        newSkill.setLegacyAmsTaxonomyId(skillTaxonomy.getLegacyAmsTaxonomyId());
        newSkill.setDescription("Kompetens från Arbetsförmedlingen: " + skillTaxonomy.getLabel());
        newSkill.setTaxonomyType(Skill.SkillTaxonomyType.SKILL);
        newSkill.setSkillLevel(Skill.SkillLevel.INTERMEDIATE);
        newSkill.setIsActive(true);
        newSkill.setCreatedAt(LocalDateTime.now());
        newSkill.updateSyncInfo();
        
        skillRepository.save(newSkill);
        log.debug("Skapade ny kompetens: {}", skillTaxonomy.getLabel());
    }
    
    /**
     * Uppdaterar senaste synkroniseringstid
     */
    private void updateLastSync(String taxonomyType) {
        lastSyncCache.put(taxonomyType, LocalDateTime.now());
    }
    
    /**
     * Kontrollerar om taxonomi behöver synkroniseras
     */
    public boolean needsSync(String taxonomyType) {
        LocalDateTime lastSync = lastSyncCache.get(taxonomyType);
        return lastSync == null || lastSync.isBefore(LocalDateTime.now().minusDays(1));
    }
    
    /**
     * Hämtar synkroniseringsstatus för alla taxonomier
     */
    public Map<String, Object> getSyncStatus() {
        Map<String, Object> status = new HashMap<>();
        
        for (String taxonomyType : Arrays.asList("occupation", "skill", "employment_type", "working_hours")) {
            LocalDateTime lastSync = lastSyncCache.get(taxonomyType);
            boolean needsSync = needsSync(taxonomyType);
            
            Map<String, Object> typeStatus = new HashMap<>();
            typeStatus.put("lastSync", lastSync);
            typeStatus.put("needsSync", needsSync);
            typeStatus.put("status", needsSync ? "NEEDS_SYNC" : "UP_TO_DATE");
            
            status.put(taxonomyType, typeStatus);
        }
        
        return status;
    }
}
