package se.stegroo.backend.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;
import se.stegroo.backend.dto.af.AfJobStreamJob;
import se.stegroo.backend.model.JobListing;
import se.stegroo.backend.model.JobCategory;
import se.stegroo.backend.repository.JobListingRepository;
import se.stegroo.backend.repository.JobCategoryRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

/**
 * Service för att hämta jobb från Arbetsförmedlingens öppna API
 * och konvertera dem till våra interna modeller.
 */
@Service
public class ArbetsformedlingenService {
    
    private static final Logger log = LoggerFactory.getLogger(ArbetsformedlingenService.class);
    
    @Value("${af.api.base-url}")
    private String baseUrl;
    
    @Value("${af.api.key:}")
    private String apiKey;
    
    @Value("${job-sync.batch-size:100}")
    private int batchSize;
    
    @Value("${job-sync.snapshot-chunk-size:10000}")
    private int snapshotChunkSize;
    
    @Value("${job-sync.max-chunks:500}")
    private int maxChunks;
    
    private final RestClient restClient;
    private final JobCategoryRepository jobCategoryRepository;
    private final JobListingRepository jobListingRepository;
    private final ObjectMapper objectMapper;
    
    public ArbetsformedlingenService(
            @Value("${af.api.base-url}") String baseUrl,
            @Value("${af.api.key:}") String apiKey,
            RestClient restClient,
            JobCategoryRepository jobCategoryRepository,
            JobListingRepository jobListingRepository,
            ObjectMapper objectMapper) {
        this.baseUrl = baseUrl;
        this.apiKey = apiKey;
        this.restClient = restClient;
        this.jobCategoryRepository = jobCategoryRepository;
        this.jobListingRepository = jobListingRepository;
        this.objectMapper = objectMapper;
    }
    
    /**
     * Hämtar jobb från Arbetsförmedlingens API baserat på sökparametrar
     */
    public List<JobListing> searchJobs(String query, String location, String category) {
        log.info("Söker jobb från Arbetsförmedlingen: query={}, location={}, category={}", 
                query, location, category);
        
        // För nu använder vi fetchJobsBatch som har fungerande JSON-parsing
        // TODO: Implementera sökspecifik logik senare
        return fetchJobsBatch(50);
    }
    
    /**
     * Synkroniserar alla jobb från Arbetsförmedlingens API och sparar dem i databasen
     */
    @Transactional
    public int syncAllJobsToDatabase() {
        log.info("Startar synkronisering av alla jobb från Arbetsförmedlingen till databasen");
        
        int totalSynced = 0;
        int batchNumber = 1;
        
        try {
            // Hämta jobb för flera dagar bakåt för att få fler jobb
            for (int daysBack = 0; daysBack <= 7; daysBack++) {
                LocalDate targetDate = LocalDate.now().minusDays(daysBack);
                List<JobListing> jobs = fetchJobsForDate(targetDate);
                
                if (!jobs.isEmpty()) {
                    int savedCount = saveJobsToDatabase(jobs);
                    totalSynced += savedCount;
                    log.info("Batch {}: Sparade {} jobb för datum {}", batchNumber++, savedCount, targetDate);
                } else {
                    log.info("Inga jobb hittades för datum {}", targetDate);
                }
                
                // Kort paus mellan API-anrop för att vara snäll mot servern
                Thread.sleep(500);
            }
            
            log.info("✅ Synkronisering slutförd! Totalt {} jobb synkroniserade", totalSynced);
            return totalSynced;
            
        } catch (Exception e) {
            log.error("❌ Fel vid synkronisering av jobb: {}", e.getMessage(), e);
            return totalSynced;
        }
    }
    
    /**
     * Hämtar jobb för ett specifikt datum
     * @param date Datum att hämta jobb för
     * @return Lista med jobb för det angivna datumet
     */
    public List<JobListing> fetchJobsForDate(LocalDate date) {
        log.info("Hämtar jobb för datum: {}", date);
        
        String url = baseUrl + "/stream?date=" + date.toString();
        
        try {
            String jsonResponse = restClient.get()
                    .uri(url)
                    .header("Accept", "application/json")
                    .retrieve()
                    .body(String.class);
            
            if (jsonResponse != null && !jsonResponse.trim().isEmpty()) {
                List<AfJobStreamJob> afJobs = objectMapper.readValue(
                    jsonResponse, 
                    new TypeReference<List<AfJobStreamJob>>() {}
                );
                
                log.info("Parsade {} jobb från API för datum {}", afJobs.size(), date);
                
                return afJobs.stream()
                    .map(this::convertAfJobToJobListing)
                    .filter(Optional::isPresent)
                    .map(Optional::get)
                    .collect(Collectors.toList());
            }
            
        } catch (Exception e) {
            log.warn("Fel vid hämtning av jobb för datum {}: {}", date, e.getMessage());
        }
        
        return new ArrayList<>();
    }
    
    /**
     * Sparar en lista med jobb till databasen
     */
    @Transactional
    public int saveJobsToDatabase(List<JobListing> jobs) {
        int savedCount = 0;
        
        for (JobListing job : jobs) {
            try {
                // Kontrollera om jobbet redan finns baserat på externalId
                if (job.getExternalId() != null) {
                    Optional<JobListing> existingJob = jobListingRepository.findByExternalId(job.getExternalId());
                    
                    if (existingJob.isPresent()) {
                        // Uppdatera befintligt jobb
                        JobListing existing = existingJob.get();
                        updateExistingJob(existing, job);
                        jobListingRepository.save(existing);
                        log.debug("Uppdaterade befintligt jobb: {}", job.getTitle());
                    } else {
                        // Spara nytt jobb
                        job.setSource("arbetsformedlingen");
                        job.setStatus(JobListing.Status.ACTIVE);
                        jobListingRepository.save(job);
                        savedCount++;
                        log.debug("Sparade nytt jobb: {}", job.getTitle());
                    }
                }
                
            } catch (Exception e) {
                log.error("Fel vid sparande av jobb '{}': {}", job.getTitle(), e.getMessage());
            }
        }
        
        return savedCount;
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
     * Hämtar alla tillgängliga jobb från Arbetsförmedlingen (legacy metod)
     */
    public List<JobListing> fetchAllJobs() {
        log.info("Hämtar alla jobb från Arbetsförmedlingen");
        
        // Använd fetchJobsBatch som har fungerande JSON-parsing
        return fetchJobsBatch(100);
    }
    
    /**
     * Hämtar jobb i mindre batchar för att undvika överbelastning
     */
    public List<JobListing> fetchJobsBatch(int limit) {
        log.info("Hämtar {} jobb från Arbetsförmedlingen", limit);
        
        // API:t fungerar utan nyckel, så vi testar alltid riktiga anrop först
        try {
            return fetchRealJobsFromApi(limit);
        } catch (Exception e) {
            log.warn("Fel vid API-anrop, använder mock-data: {}", e.getMessage());
            return generateMockJobs(limit);
        }
    }
    
    /**
     * Hämtar jobb från Arbetsförmedlingens snapshot endpoint med chunking
     * för att hantera stora datamängder (5+ miljoner rader)
     * 
     * @param chunkSize Storleken på varje chunk som hämtas
     * @param chunkIndex Index för chunken som ska hämtas (0-baserat)
     * @return Lista med JobListing-objekt från den aktuella chunken
     */
    public List<JobListing> fetchJobsFromSnapshot(int chunkSize, int chunkIndex) {
        log.info("Hämtar snapshot chunk {} med storlek {}", chunkIndex, chunkSize);
        
        String url = baseUrl + "/snapshot";
        int offset = chunkIndex * chunkSize;
        
        try {
            // Använd query parameters för paginering
            // API:t fungerar utan API-nyckel, men om det skulle behövas i framtiden kan denna kod aktiveras
            ResponseEntity<String> response = RestClient.create()
                .get()
                .uri(url + "?offset=" + offset + "&limit=" + chunkSize)
                .header("Accept", "application/json")
                // .header("api-key", apiKey != null ? apiKey : "") // API-nyckel behövs inte för Arbetsförmedlingens API
                .retrieve()
                .toEntity(String.class);
            
            // Kontrollera HTTP status
            if (response.getStatusCode() != HttpStatus.OK) {
                log.error("Snapshot API returnerade felstatus: {}", response.getStatusCode());
                return new ArrayList<>();
            }
            
            String jsonResponse = response.getBody();
            if (jsonResponse == null || jsonResponse.trim().isEmpty()) {
                log.warn("Snapshot API returnerade tomt svar för chunk {}", chunkIndex);
                return new ArrayList<>();
            }
            
            // Parsa JSON-svaret till AfJobStreamJob objekt
            List<AfJobStreamJob> afJobs = objectMapper.readValue(
                jsonResponse, 
                new TypeReference<List<AfJobStreamJob>>() {}
            );
            
            log.info("✅ Snapshot chunk {} hämtad! Fick {} jobb från Arbetsförmedlingen", 
                    chunkIndex, afJobs.size());
            
            // Konvertera till våra interna JobListing objekt
            List<JobListing> jobListings = afJobs.stream()
                .map(this::convertAfJobToJobListing)
                .filter(Optional::isPresent)
                .map(Optional::get)
                .collect(Collectors.toList());
            
            log.info("Konverterade {} jobb till interna modeller i chunk {}", 
                    jobListings.size(), chunkIndex);
            return jobListings;
            
        } catch (Exception e) {
            log.error("Fel vid hämtning av snapshot chunk {}: {}", chunkIndex, e.getMessage(), e);
            return new ArrayList<>();
        }
    }

    /**
     * Hämtar endast 1 jobb från snapshot endpoint för testning
     * @return Lista med max 1 JobListing-objekt
     */
    public List<JobListing> fetchSingleJobFromSnapshot() {
        log.info("Hämtar endast 1 jobb från snapshot för testning");
        
        String url = baseUrl + "/snapshot";
        
        try {
            // Hämta endast 1 jobb med limit=1
            // API:t fungerar utan API-nyckel, men om det skulle behövas i framtiden kan denna kod aktiveras
            ResponseEntity<String> response = RestClient.create()
                .get()
                .uri(url + "?offset=0&limit=1")
                .header("Accept", "application/json")
                // .header("api-key", apiKey != null ? apiKey : "") // API-nyckel behövs inte för Arbetsförmedlingens API
                .retrieve()
                .toEntity(String.class);
            
            // Kontrollera HTTP status
            if (response.getStatusCode() != HttpStatus.OK) {
                log.error("Snapshot API returnerade felstatus: {}", response.getStatusCode());
                return new ArrayList<>();
            }
            
            String jsonResponse = response.getBody();
            if (jsonResponse == null || jsonResponse.trim().isEmpty()) {
                log.warn("Snapshot API returnerade tomt svar");
                return new ArrayList<>();
            }
            
            log.debug("Snapshot API svar: {}", jsonResponse.substring(0, Math.min(200, jsonResponse.length())));
            
            // Parsa JSON-svaret till AfJobStreamJob objekt
            List<AfJobStreamJob> afJobs = objectMapper.readValue(
                jsonResponse, 
                new TypeReference<List<AfJobStreamJob>>() {}
            );
            
            log.info("✅ Hämtade {} jobb från snapshot", afJobs.size());
            
            // Konvertera till våra interna JobListing objekt och begränsa till 1 jobb
            List<JobListing> jobListings = afJobs.stream()
                .map(this::convertAfJobToJobListing)
                .filter(Optional::isPresent)
                .map(Optional::get)
                .limit(1)  // Begränsa till endast 1 jobb
                .collect(Collectors.toList());
            
            log.info("Konverterade {} jobb till interna modeller (begränsat till 1)", jobListings.size());
            
            if (!jobListings.isEmpty()) {
                JobListing job = jobListings.get(0);
                log.info("Test jobb: ID={}, Titel={}, Företag={}", 
                    job.getExternalId(), job.getTitle(), job.getCompanyName());
            }
            
            return jobListings;
            
        } catch (Exception e) {
            log.error("Fel vid hämtning av enstaka jobb från snapshot: {}", e.getMessage(), e);
            return new ArrayList<>();
        }
    }
    
    /**
     * Utför en full synkronisering från snapshot endpoint med chunking
     * och återanvändbar processningslogik
     * 
     * @param processor Callback-funktion som anropas för varje chunk av jobb
     * @return Totala antalet bearbetade jobb
     */
    @Transactional
    public int syncFullSnapshotWithChunking(ChunkProcessor processor) {
        log.info("Startar full snapshot-synkronisering med chunking");
        
        AtomicInteger totalProcessed = new AtomicInteger(0);
        AtomicInteger successfulChunks = new AtomicInteger(0);
        AtomicInteger failedChunks = new AtomicInteger(0);
        
        try {
            // Begränsa till maxChunks för att undvika oändliga loopar
            for (int chunkIndex = 0; chunkIndex < maxChunks; chunkIndex++) {
                try {
                    log.info("Bearbetar snapshot chunk {}/{} (max)", chunkIndex + 1, maxChunks);
                    
                    // Hämta chunken av jobb
                    List<JobListing> jobs = fetchJobsFromSnapshot(snapshotChunkSize, chunkIndex);
                    
                    if (jobs.isEmpty()) {
                        log.info("Inga fler jobb att hämta efter chunk {}", chunkIndex);
                        break;
                    }
                    
                    // Processera chunken med den angivna processorn
                    int processedInChunk = processor.processChunk(jobs, chunkIndex);
                    totalProcessed.addAndGet(processedInChunk);
                    successfulChunks.incrementAndGet();
                    
                    log.info("Chunk {} bearbetad: {} jobb, totalt: {}", 
                            chunkIndex, processedInChunk, totalProcessed.get());
                    
                    // Kort paus för att inte överbelasta API:t
                    if (chunkIndex < maxChunks - 1) {
                        Thread.sleep(1000);
                    }
                    
                } catch (Exception e) {
                    failedChunks.incrementAndGet();
                    log.error("Fel vid bearbetning av chunk {}: {}", chunkIndex, e.getMessage(), e);
                    // Fortsätt med nästa chunk trots fel
                }
            }
            
            log.info("✅ Snapshot-synkronisering slutförd! {} jobb processerade, {} lyckade chunks, {} misslyckade chunks", 
                    totalProcessed.get(), successfulChunks.get(), failedChunks.get());
            return totalProcessed.get();
            
        } catch (Exception e) {
            log.error("❌ Allvarligt fel vid snapshot-synkronisering: {}", e.getMessage(), e);
            return totalProcessed.get();
        }
    }

    /**
     * Testar snapshot-funktionaliteten med endast 1 jobb för att undvika timeout
     * @param processor Callback-funktion som anropas för jobbet
     * @return Antal bearbetade jobb (0 eller 1)
     */
    @Transactional
    public int testSingleJobFromSnapshot(ChunkProcessor processor) {
        log.info("Testar snapshot med endast 1 jobb");
        
        try {
            // Hämta endast 1 jobb
            List<JobListing> jobs = fetchSingleJobFromSnapshot();
            
            if (jobs.isEmpty()) {
                log.warn("Inga jobb hämtades från snapshot");
                return 0;
            }
            
            // Processera det enda jobbet
            int processed = processor.processChunk(jobs, 0);
            
            log.info("✅ Test slutfört! {} jobb processerat", processed);
            return processed;
            
        } catch (Exception e) {
            log.error("❌ Fel vid test av enstaka jobb: {}", e.getMessage(), e);
            return 0;
        }
    }
    
    /**
     * Funktionellt gränssnitt för att behandla chunks av jobb
     */
    @FunctionalInterface
    public interface ChunkProcessor {
        /**
         * Behandlar en chunk av jobb
         * @param jobs Lista med jobb att behandla
         * @param chunkIndex Index för aktuell chunk
         * @return Antal jobb som behandlades framgångsrikt
         */
        int processChunk(List<JobListing> jobs, int chunkIndex);
    }
    
    /**
     * Hämtar riktiga jobb från Arbetsförmedlingens API
     */
    private List<JobListing> fetchRealJobsFromApi(int limit) {
        log.info("Hämtar riktiga jobb från Arbetsförmedlingens API");
        
        // Använd datum från igår för att få aktuella jobb
        String date = java.time.LocalDate.now().minusDays(1).toString();
        String url = baseUrl + "/stream?date=" + date;
        
        log.info("Anropar API: {}", url);
        
        // OBS: Arbetsförmedlingens API fungerar utan API-nyckel
        
        try {
            String jsonResponse = restClient.get()
                    .uri(url)
                    .header("Accept", "application/json")
                    .retrieve()
                    .body(String.class);
            
            if (jsonResponse != null && !jsonResponse.trim().isEmpty()) {
                log.info("✅ API-anrop lyckades! Fick svar från Arbetsförmedlingen");
                
                // Parsa JSON-svaret till AfJobStreamJob objekt
                List<AfJobStreamJob> afJobs = objectMapper.readValue(
                    jsonResponse, 
                    new TypeReference<List<AfJobStreamJob>>() {}
                );
                
                log.info("Parsade {} jobb från API:t", afJobs.size());
                
                // Konvertera till våra interna JobListing objekt
                List<JobListing> jobListings = afJobs.stream()
                    .limit(limit)
                    .map(this::convertAfJobToJobListing)
                    .filter(Optional::isPresent)
                    .map(Optional::get)
                    .collect(Collectors.toList());
                
                log.info("Konverterade {} jobb till interna modeller", jobListings.size());
                return jobListings;
                
            } else {
                log.warn("API returnerade tomt svar");
                return generateMockJobs(limit);
            }
        } catch (Exception e) {
            log.error("Fel vid JSON-parsing av API-svar: {}", e.getMessage());
            log.warn("Faller tillbaka på mock-data");
            return generateMockJobs(limit);
        }
    }
    
    /**
     * Konverterar AfJobStreamJob från API:t till intern JobListing
     */
    private Optional<JobListing> convertAfJobToJobListing(AfJobStreamJob afJob) {
        try {
            JobListing jobListing = new JobListing();
            
            // Grundläggande information
            jobListing.setExternalId(afJob.getId());
            jobListing.setTitle(afJob.getHeadline());
            jobListing.setDeadline(afJob.getApplicationDeadline());
            jobListing.setPublishedAt(afJob.getPublicationDate());
            jobListing.setSource("arbetsformedlingen");
            
            // Beskrivning - använd formatted text om tillgänglig
            if (afJob.getDescription() != null) {
                String description = afJob.getDescription().getTextFormatted() != null 
                    ? afJob.getDescription().getTextFormatted()
                    : afJob.getDescription().getText();
                jobListing.setDescription(description);
            }
            
            // Arbetsgivare
            if (afJob.getEmployer() != null) {
                jobListing.setCompanyName(afJob.getEmployer().getName());
                jobListing.setExternalUrl(afJob.getEmployer().getUrl());
            }
            
            // Plats
            if (afJob.getWorkplaceAddress() != null) {
                String location = afJob.getWorkplaceAddress().getMunicipality();
                if (afJob.getWorkplaceAddress().getRegion() != null) {
                    location += ", " + afJob.getWorkplaceAddress().getRegion();
                }
                jobListing.setLocation(location);
            }
            
            // Ansökan - använd application URL om tillgänglig
            if (afJob.getApplicationDetails() != null && afJob.getApplicationDetails().getUrl() != null) {
                jobListing.setExternalUrl(afJob.getApplicationDetails().getUrl());
            }
            
            // Kategori - använd occupation_field som kategori
            if (afJob.getOccupationField() != null) {
                JobCategory category = resolveOrCreateCategory(afJob.getOccupationField().getLabel());
                jobListing.setCategory(category);
            }
            
            // Anställningstyp
            if (afJob.getEmploymentType() != null) {
                jobListing.setEmploymentType(afJob.getEmploymentType().getLabel());
            }
            
            // Arbetstid
            if (afJob.getWorkingHoursType() != null) {
                jobListing.setWorkingHoursType(afJob.getWorkingHoursType().getLabel());
            }
            
            // Spara rådata för debugging
            try {
                jobListing.setRaw(objectMapper.writeValueAsString(afJob));
            } catch (Exception e) {
                log.warn("Kunde inte serialisera rådata för jobb {}: {}", afJob.getId(), e.getMessage());
            }
            
            log.debug("Konverterade jobb: {} - {}", afJob.getId(), afJob.getHeadline());
            return Optional.of(jobListing);
            
        } catch (Exception e) {
            log.warn("Kunde inte konvertera jobb {}: {}", afJob.getId(), e.getMessage());
            return Optional.empty();
        }
    }
    
    /**
     * Genererar mock-jobb för testning när ingen API-nyckel finns
     */
    private List<JobListing> generateMockJobs(int limit) {
        log.info("Genererar {} mock-jobb för testning", limit);
        
        List<JobListing> mockJobs = new ArrayList<>();
        String[] titles = {
            "Frontend Utvecklare", "Backend Utvecklare", "Fullstack Utvecklare", 
            "DevOps Engineer", "Data Scientist", "UX/UI Designer", "Product Manager",
            "Scrum Master", "QA Engineer", "System Architect", "Mobile Developer",
            "Cloud Engineer", "Security Engineer", "Machine Learning Engineer"
        };
        
        String[] companies = {
            "TechCorp AB", "StartupTech", "Enterprise Solutions", "Digital Agency",
            "Innovation Labs", "Future Systems", "Smart Solutions", "NextGen Tech"
        };
        
        String[] locations = {
            "Stockholm", "Göteborg", "Malmö", "Uppsala", "Linköping", "Örebro"
        };
        
        for (int i = 0; i < limit; i++) {
            JobListing job = new JobListing();
            job.setId((long) (i + 1));
            job.setTitle(titles[i % titles.length] + " " + (i + 1));
            job.setCompanyName(companies[i % companies.length]);
            job.setLocation(locations[i % locations.length]);
            job.setDescription("Detta är en test-beskrivning för jobb " + (i + 1) + ". Vi söker en erfaren utvecklare som kan bidra till vårt team.");
            job.setExternalId("mock-" + (i + 1));
            job.setSource("Mock Data");
            job.setEmploymentType("Heltid");
            job.setWorkingHoursType("Heltid");
            job.setStatus(JobListing.Status.ACTIVE);
            job.setCreatedAt(LocalDateTime.now().minusDays(i % 7));
            job.setUpdatedAt(LocalDateTime.now().minusDays(i % 7));
            
            mockJobs.add(job);
        }
        
        log.info("Genererade {} mock-jobb", mockJobs.size());
        return mockJobs;
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
        newCategory.setDescription("Kategori från Arbetsförmedlingen: " + categoryName);
        newCategory.setTaxonomyType(JobCategory.TaxonomyType.OCCUPATION);
        newCategory.setHierarchyLevel(0);
        newCategory.setHierarchyPath(categoryName);
        newCategory.setIsActive(true);
        newCategory.setCreatedAt(LocalDateTime.now());
        newCategory.updateSyncInfo();
        
        return jobCategoryRepository.save(newCategory);
    }
    
}