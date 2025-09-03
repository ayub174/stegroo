package se.stegroo.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import se.stegroo.backend.model.DeadLetterQueue;
import se.stegroo.backend.model.JobListing;
import se.stegroo.backend.model.SyncCheckpoint;
import se.stegroo.backend.repository.JobListingRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Service för att hantera snapshot och inkrementell synkronisering.
 * Använder cursor-baserad paginering för att hantera stora datamängder.
 */
@Service
public class SnapshotIncrementalService {
    
    private static final Logger log = LoggerFactory.getLogger(SnapshotIncrementalService.class);
    
    private final ArbetsformedlingenService arbetsformedlingenService;
    private final JobListingRepository jobListingRepository;
    private final SyncCheckpointService syncCheckpointService;
    private final DeadLetterQueueService deadLetterQueueService;
    // Removed cursorPaginationService as it's no longer needed for /stream endpoint
    private final RetryService retryService;
    
    // Page size used for batch fetching
    private static final int MAX_RETRIES = 3;
    
    public SnapshotIncrementalService(ArbetsformedlingenService arbetsformedlingenService,
                                     JobListingRepository jobListingRepository,
                                     SyncCheckpointService syncCheckpointService,
                                     DeadLetterQueueService deadLetterQueueService,
                                     RetryService retryService) {
        this.arbetsformedlingenService = arbetsformedlingenService;
        this.jobListingRepository = jobListingRepository;
        this.syncCheckpointService = syncCheckpointService;
        this.deadLetterQueueService = deadLetterQueueService;
        this.retryService = retryService;
    }
    
    /**
     * Utför fullständig snapshot-synkronisering med chunking
     * Detta använder snapshot endpoint för att hämta all data på en gång
     * med paginering för att hantera stora datamängder
     */
    public SnapshotResult performSnapshotSync() {
        log.info("Startar fullständig snapshot-synkronisering med chunking");
        
        SyncCheckpoint checkpoint = syncCheckpointService.createOrUpdateCheckpoint(SyncCheckpoint.SyncType.SNAPSHOT);
        checkpoint.setTotalProcessed(0L);
        checkpoint.setTotalSuccessful(0L);
        checkpoint.setTotalFailed(0L);
        checkpoint.setLastSyncAt(LocalDateTime.now());
        
        try {
            log.info("Använder /snapshot endpoint med chunking för fullständig datahämtning");
            
            // Använd den nya chunking-metoden i ArbetsformedlingenService
            int totalProcessed = arbetsformedlingenService.syncFullSnapshotWithChunking((jobs, chunkIndex) -> {
                log.info("Bearbetar chunk {} med {} jobb", chunkIndex, jobs.size());
                
                // Använd den befintliga processningslogiken
                PageProcessingResult result = processJobsPage(jobs);
                
                // Uppdatera checkpoint med ackumulerad statistik
                checkpoint.setTotalProcessed(checkpoint.getTotalProcessed() + result.getProcessedCount());
                checkpoint.setTotalSuccessful(checkpoint.getTotalSuccessful() + result.getSuccessfulCount());
                checkpoint.setTotalFailed(checkpoint.getTotalFailed() + result.getFailedCount());
                // Use syncCheckpointService instead of direct repository access
                syncCheckpointService.markCheckpointAsCompleted(SyncCheckpoint.SyncType.SNAPSHOT);
                
                return result.getSuccessfulCount();
            });
            
            log.info("Snapshot-synkronisering slutförd med {} jobb processerade", totalProcessed);
            
            // Markera checkpoint som slutförd
            syncCheckpointService.markCheckpointAsCompleted(SyncCheckpoint.SyncType.SNAPSHOT);
            
            return new SnapshotResult(
                    Math.toIntExact(checkpoint.getTotalProcessed()), 
                    Math.toIntExact(checkpoint.getTotalSuccessful()), 
                    Math.toIntExact(checkpoint.getTotalFailed()), 
                    true, 
                    "Snapshot-synkronisering slutförd");
            
        } catch (Exception e) {
            log.error("Fel vid snapshot-synkronisering", e);
            syncCheckpointService.markCheckpointAsFailed(SyncCheckpoint.SyncType.SNAPSHOT, e.getMessage());
            
            // Lägg till i dead-letter queue
            deadLetterQueueService.addFailedJobWithStackTrace(
                    "snapshot-sync", 
                    "Snapshot-synkronisering", 
                    e.getMessage(), 
                    "SnapshotSyncError", 
                    DeadLetterQueue.SyncType.SNAPSHOT,
                    getStackTrace(e)
            );
            
            return new SnapshotResult(
                    checkpoint.getTotalProcessed() != null ? Math.toIntExact(checkpoint.getTotalProcessed()) : 0,
                    checkpoint.getTotalSuccessful() != null ? Math.toIntExact(checkpoint.getTotalSuccessful()) : 0,
                    checkpoint.getTotalFailed() != null ? Math.toIntExact(checkpoint.getTotalFailed()) : 0,
                    false, "Fel: " + e.getMessage());
        }
    }
    
    /**
     * Utför inkrementell synkronisering baserat på senaste checkpoint
     */
    public IncrementalResult performIncrementalSync() {
        log.info("Startar inkrementell synkronisering");
        
        Optional<LocalDateTime> lastSyncTime = syncCheckpointService.getLastSyncTime(SyncCheckpoint.SyncType.INCREMENTAL);
        if (lastSyncTime.isEmpty()) {
            log.info("Ingen tidigare inkrementell synkronisering hittad, startar snapshot istället");
            SnapshotResult snapshotResult = performSnapshotSync();
            return new IncrementalResult(
                    snapshotResult.getTotalProcessed(),
                    snapshotResult.getTotalSuccessful(),
                    snapshotResult.getTotalFailed(),
                    snapshotResult.isSuccess(),
                    "Inkrementell synkronisering slutförd via snapshot"
            );
        }
        
        SyncCheckpoint checkpoint = syncCheckpointService.createOrUpdateCheckpoint(SyncCheckpoint.SyncType.INCREMENTAL);
        checkpoint.setTotalProcessed(0L);
        checkpoint.setTotalSuccessful(0L);
        checkpoint.setTotalFailed(0L);
        // The timestamp is already set by createOrUpdateCheckpoint
        // We don't need to manually save as createOrUpdateCheckpoint already persists the entity
        
        try {
            log.info("Checkpoint skapad: {}", checkpoint);
            
            // Hämta dagens jobb från /stream endpoint
            List<JobListing> jobs = fetchTodaysJobs();
            
            log.info("Hämtade {} jobb från /stream endpoint", jobs.size());
            PageProcessingResult result = processJobsPage(jobs);
            
            // Uppdatera checkpoint med statistik
            checkpoint.setTotalProcessed((long) result.getProcessedCount());
            checkpoint.setTotalSuccessful((long) result.getSuccessfulCount());
            checkpoint.setTotalFailed((long) result.getFailedCount());
            // Simply mark the checkpoint as completed which will update and save it internally
            syncCheckpointService.markCheckpointAsCompleted(SyncCheckpoint.SyncType.INCREMENTAL);
            
            log.info("Inkrementell synkronisering slutförd. Behandlade: {}, Framgångsrika: {}, Fel: {}", 
                    result.getProcessedCount(), result.getSuccessfulCount(), result.getFailedCount());
            
            return new IncrementalResult(
                    result.getProcessedCount(),
                    result.getSuccessfulCount(),
                    result.getFailedCount(),
                    true,
                    "Synkronisering slutförd"
            );
        } catch (Exception e) {
            log.error("Fel vid inkrementell synkronisering: {}", e.getMessage(), e);
            
            // Lägg till i kön för misslyckade synkar
            deadLetterQueueService.addFailedJobWithStackTrace(
                    "incremental-sync", 
                    "Inkrementell synkronisering", 
                    e.getMessage(),
                    "IncrementalSyncError", 
                    DeadLetterQueue.SyncType.INCREMENTAL,
                    getStackTrace(e)
            );
            
            return new IncrementalResult(0, 0, 0, false, "Fel: " + e.getMessage());
        }
    }
    
    /**
     * Hämtar dagens jobb från Jobstream API - används för dagliga inkrementella uppdateringar
     */
    private List<JobListing> fetchTodaysJobs() {
        return retryService.executeWithRetry(
                () -> {
                    LocalDate today = LocalDate.now();
                    // Använd fetchJobsForDate för att hämta dagens ändringar via /stream endpoint
                    return arbetsformedlingenService.fetchJobsForDate(today);
                },
                "Hämta dagens jobb",
                MAX_RETRIES
        );
    }
    
    /**
     * Bearbetar en sida med jobb
     */
    private PageProcessingResult processJobsPage(List<JobListing> jobs) {
        int processedCount = 0;
        int successfulCount = 0;
        int failedCount = 0;
        
        for (JobListing job : jobs) {
            try {
                processedCount++;
                
                if (job.getExternalId() != null) {
                    // Kontrollera om jobbet redan finns
                    Optional<JobListing> existingJob = jobListingRepository.findByExternalId(job.getExternalId());
                    
                    if (existingJob.isPresent()) {
                        // Uppdatera befintligt jobb
                        updateExistingJob(existingJob.get(), job);
                        jobListingRepository.save(existingJob.get());
                    } else {
                        // Spara nytt jobb
                        jobListingRepository.save(job);
                    }
                } else {
                    // Spara jobb utan external ID
                    jobListingRepository.save(job);
                }
                
                successfulCount++;
                
            } catch (Exception e) {
                failedCount++;
                log.error("Fel vid bearbetning av jobb: {}", job.getTitle(), e);
                
                // Lägg till i dead-letter queue
                deadLetterQueueService.addFailedJobWithStackTrace(
                        job.getExternalId() != null ? job.getExternalId() : "unknown-" + job.getId(),
                        job.getTitle(),
                        e.getMessage(),
                        "JobProcessingError",
                        DeadLetterQueue.SyncType.JOBS,
                        getStackTrace(e)
                );
            }
        }
        
        return new PageProcessingResult(processedCount, successfulCount, failedCount);
    }
    
    /**
     * Uppdaterar befintligt jobb med ny information
     */
    private void updateExistingJob(JobListing existing, JobListing updated) {
        if (updated.getPublishedAt() != null && 
            (existing.getPublishedAt() == null || updated.getPublishedAt().isAfter(existing.getPublishedAt()))) {
            
            existing.setTitle(updated.getTitle());
            existing.setDescription(updated.getDescription());
            existing.setCompanyName(updated.getCompanyName());
            existing.setLocation(updated.getLocation());
            existing.setEmploymentType(updated.getEmploymentType());
            existing.setDeadline(updated.getDeadline());
            existing.setExternalUrl(updated.getExternalUrl());
            existing.setCategory(updated.getCategory());
            existing.setUpdatedAt(LocalDateTime.now());
        }
    }
    
    /**
     * Hämtar stack trace från ett exception
     */
    private String getStackTrace(Exception e) {
        StringBuilder sb = new StringBuilder();
        sb.append(e.toString()).append("\n");
        
        for (StackTraceElement element : e.getStackTrace()) {
            sb.append("\tat ").append(element.toString()).append("\n");
        }
        
        return sb.toString();
    }
    
    // Resultat-klasser
    public static class SnapshotResult {
        private final int totalProcessed;
        private final int totalSuccessful;
        private final int totalFailed;
        private final boolean success;
        private final String message;
        
        public SnapshotResult(int totalProcessed, int totalSuccessful, int totalFailed, boolean success, String message) {
            this.totalProcessed = totalProcessed;
            this.totalSuccessful = totalSuccessful;
            this.totalFailed = totalFailed;
            this.success = success;
            this.message = message;
        }
        
        public int getTotalProcessed() { return totalProcessed; }
        public int getTotalSuccessful() { return totalSuccessful; }
        public int getTotalFailed() { return totalFailed; }
        public boolean isSuccess() { return success; }
        public String getMessage() { return message; }
    }
    
    public static class IncrementalResult {
        private final int totalProcessed;
        private final int totalSuccessful;
        private final int totalFailed;
        private final boolean success;
        private final String message;
        
        public IncrementalResult(int totalProcessed, int totalSuccessful, int totalFailed, boolean success, String message) {
            this.totalProcessed = totalProcessed;
            this.totalSuccessful = totalSuccessful;
            this.totalFailed = totalFailed;
            this.success = success;
            this.message = message;
        }
        
        public int getTotalProcessed() { return totalProcessed; }
        public int getTotalSuccessful() { return totalSuccessful; }
        public int getTotalFailed() { return totalFailed; }
        public boolean isSuccess() { return success; }
        public String getMessage() { return message; }
    }
    
    /**
     * Schemalagd metod för att utföra snapshot-synkronisering
     * Anropas direkt från tester
     */
    @Scheduled(cron = "${stegroo.job.sync.snapshot-cron:0 0 2 * * ?}")
    public void scheduledSnapshotSync() {
        log.info("Kör schemalagd snapshot-synkronisering");
        performSnapshotSync();
    }
    
    /**
     * Schemalagd metod för att utföra inkrementell synkronisering
     * Anropas direkt från tester
     */
    @Scheduled(cron = "${stegroo.job.sync.incremental-cron:0 0/30 * * * ?}")
    public void scheduledIncrementalSync() {
        log.info("Kör schemalagd inkrementell synkronisering");
        performIncrementalSync();
    }
    
    private static class PageProcessingResult {
        private final int processedCount;
        private final int successfulCount;
        private final int failedCount;
        
        public PageProcessingResult(int processedCount, int successfulCount, int failedCount) {
            this.processedCount = processedCount;
            this.successfulCount = successfulCount;
            this.failedCount = failedCount;
        }
        
        public int getProcessedCount() { return processedCount; }
        public int getSuccessfulCount() { return successfulCount; }
        public int getFailedCount() { return failedCount; }
    }
}
