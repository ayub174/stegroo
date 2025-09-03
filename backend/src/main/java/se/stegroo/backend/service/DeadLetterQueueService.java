package se.stegroo.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import se.stegroo.backend.model.DeadLetterQueue;
import se.stegroo.backend.repository.DeadLetterQueueRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Service för att hantera dead-letter queue för misslyckade jobb.
 * Används för att spåra, retry:a och hantera jobb som misslyckades under synkronisering.
 */
@Service
public class DeadLetterQueueService {
    
    private static final Logger log = LoggerFactory.getLogger(DeadLetterQueueService.class);
    
    private final DeadLetterQueueRepository deadLetterQueueRepository;
    private final RetryService retryService;
    
    public DeadLetterQueueService(DeadLetterQueueRepository deadLetterQueueRepository, 
                                 RetryService retryService) {
        this.deadLetterQueueRepository = deadLetterQueueRepository;
        this.retryService = retryService;
    }
    
    /**
     * Lägger till ett misslyckat jobb i dead-letter queue
     */
    public DeadLetterQueue addFailedJob(String externalId, String jobData, String errorMessage, 
                                       String errorType, DeadLetterQueue.SyncType syncType) {
        log.warn("Lägger till misslyckat jobb i dead-letter queue: {}", externalId);
        
        DeadLetterQueue failedJob = new DeadLetterQueue(externalId, jobData, errorMessage, errorType, syncType);
        failedJob.setNextRetryAt(calculateNextRetryTime(0));
        
        DeadLetterQueue savedJob = deadLetterQueueRepository.save(failedJob);
        log.info("Misslyckat jobb tillagt i dead-letter queue med ID: {}", savedJob.getId());
        
        return savedJob;
    }
    
    /**
     * Lägger till ett misslyckat jobb med stack trace
     */
    public DeadLetterQueue addFailedJobWithStackTrace(String externalId, String jobData, String errorMessage, 
                                                     String errorType, DeadLetterQueue.SyncType syncType, 
                                                     String stackTrace) {
        DeadLetterQueue failedJob = addFailedJob(externalId, jobData, errorMessage, errorType, syncType);
        failedJob.setStackTrace(stackTrace);
        return deadLetterQueueRepository.save(failedJob);
    }
    
    /**
     * Hämtar alla jobb som är redo för retry
     */
    public List<DeadLetterQueue> getJobsReadyForRetry() {
        return deadLetterQueueRepository.findReadyForRetry(LocalDateTime.now());
    }
    
    /**
     * Hämtar alla jobb med en specifik status
     */
    public List<DeadLetterQueue> getJobsByStatus(DeadLetterQueue.Status status) {
        return deadLetterQueueRepository.findByStatus(status);
    }
    
    /**
     * Hämtar alla jobb med en specifik synkroniseringstyp
     */
    public List<DeadLetterQueue> getJobsBySyncType(DeadLetterQueue.SyncType syncType) {
        return deadLetterQueueRepository.findBySyncType(syncType);
    }
    
    /**
     * Hämtar ett jobb baserat på externt ID
     */
    public Optional<DeadLetterQueue> getJobByExternalId(String externalId) {
        return deadLetterQueueRepository.findByExternalId(externalId);
    }
    
    /**
     * Markerar ett jobb som under bearbetning
     */
    public void markJobAsProcessing(DeadLetterQueue job) {
        job.markAsProcessing();
        deadLetterQueueRepository.save(job);
    }
    
    /**
     * Markerar ett jobb som lyckades
     */
    public void markJobAsSuccess(DeadLetterQueue job) {
        job.markAsSuccess();
        deadLetterQueueRepository.save(job);
        log.info("Jobb i dead-letter queue markerat som lyckat: {}", job.getExternalId());
    }
    
    /**
     * Markerar ett jobb som misslyckades permanent
     */
    public void markJobAsFailed(DeadLetterQueue job, String failureReason) {
        job.markAsFailed(failureReason);
        deadLetterQueueRepository.save(job);
        log.warn("Jobb i dead-letter queue markerat som permanent misslyckat: {} - {}", 
                job.getExternalId(), failureReason);
    }
    
    /**
     * Schemalägger nästa retry för ett jobb
     */
    public void scheduleRetry(DeadLetterQueue job) {
        if (job.canRetry()) {
            LocalDateTime nextRetryAt = calculateNextRetryTime(job.getRetryCount());
            job.scheduleRetry(nextRetryAt);
            deadLetterQueueRepository.save(job);
            log.info("Schemalagt retry för jobb: {} vid {}", job.getExternalId(), nextRetryAt);
        } else {
            log.warn("Jobb kan inte retry:as mer: {}", job.getExternalId());
            markJobAsFailed(job, "Max retry-försök överskridna");
        }
    }
    
    /**
     * Rensar gamla jobb från dead-letter queue
     */
    @Scheduled(cron = "0 0 2 * * ?") // Körs varje dag kl 02:00
    public void cleanupOldJobs() {
        log.info("Startar rensning av gamla jobb från dead-letter queue");
        
        LocalDateTime cutoff = LocalDateTime.now().minusDays(30);
        List<DeadLetterQueue> oldJobs = deadLetterQueueRepository.findJobsForCleanup(cutoff);
        
        if (!oldJobs.isEmpty()) {
            deadLetterQueueRepository.deleteAll(oldJobs);
            log.info("Rensade {} gamla jobb från dead-letter queue", oldJobs.size());
        } else {
            log.debug("Inga gamla jobb att rensa från dead-letter queue");
        }
    }
    
    /**
     * Schemalagd retry av jobb som är redo
     */
    @Scheduled(fixedDelay = 300000) // Körs var 5:e minut
    public void processRetryJobs() {
        log.debug("Kontrollerar jobb som är redo för retry");
        
        List<DeadLetterQueue> readyJobs = getJobsReadyForRetry();
        if (readyJobs.isEmpty()) {
            return;
        }
        
        log.info("Hittade {} jobb som är redo för retry", readyJobs.size());
        
        for (DeadLetterQueue job : readyJobs) {
            try {
                processRetryJob(job);
            } catch (Exception e) {
                log.error("Fel vid bearbetning av retry-jobb: {}", job.getExternalId(), e);
                scheduleRetry(job);
            }
        }
    }
    
    /**
     * Bearbetar ett enskilt retry-jobb
     */
    private void processRetryJob(DeadLetterQueue job) {
        log.info("Bearbetar retry-jobb: {}", job.getExternalId());
        
        markJobAsProcessing(job);
        
        try {
            // Här skulle vi anropa den ursprungliga synkroniseringslogiken
            // För nu simulerar vi en lyckad bearbetning
            boolean success = retryService.executeWithRetry(
                () -> processJobData(job.getJobData()),
                "Retry jobb: " + job.getExternalId(),
                2 // Färre retry-försök för dead-letter queue
            );
            
            if (success) {
                markJobAsSuccess(job);
            } else {
                throw new RuntimeException("Jobb-bearbetning misslyckades");
            }
            
        } catch (Exception e) {
            log.error("Retry misslyckades för jobb: {}", job.getExternalId(), e);
            scheduleRetry(job);
        }
    }
    
    /**
     * Simulerar bearbetning av jobbdata
     */
    private boolean processJobData(String jobData) {
        // Här skulle vi implementera den faktiska jobb-bearbetningen
        // För nu simulerar vi en lyckad bearbetning
        try {
            Thread.sleep(100); // Simulera bearbetningstid
            return true;
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return false;
        }
    }
    
    /**
     * Beräknar nästa retry-tidpunkt baserat på retry-räknare
     */
    private LocalDateTime calculateNextRetryTime(int retryCount) {
        return retryService.calculateNextRetryTime(retryCount, LocalDateTime.now());
    }
    
    /**
     * Hämtar statistik för dead-letter queue
     */
    public DeadLetterQueueStats getStats() {
        long pendingCount = deadLetterQueueRepository.countByStatus(DeadLetterQueue.Status.PENDING);
        long processingCount = deadLetterQueueRepository.countByStatus(DeadLetterQueue.Status.PROCESSING);
        long successCount = deadLetterQueueRepository.countByStatus(DeadLetterQueue.Status.SUCCESS);
        long failedCount = deadLetterQueueRepository.countByStatus(DeadLetterQueue.Status.FAILED);
        long expiredCount = deadLetterQueueRepository.countByStatus(DeadLetterQueue.Status.EXPIRED);
        
        return new DeadLetterQueueStats(pendingCount, processingCount, successCount, failedCount, expiredCount);
    }
    
    /**
     * Statistik för dead-letter queue
     */
    public static class DeadLetterQueueStats {
        private final long pendingCount;
        private final long processingCount;
        private final long successCount;
        private final long failedCount;
        private final long expiredCount;
        
        public DeadLetterQueueStats(long pendingCount, long processingCount, long successCount, 
                                   long failedCount, long expiredCount) {
            this.pendingCount = pendingCount;
            this.processingCount = processingCount;
            this.successCount = successCount;
            this.failedCount = failedCount;
            this.expiredCount = expiredCount;
        }
        
        public long getPendingCount() { return pendingCount; }
        public long getProcessingCount() { return processingCount; }
        public long getSuccessCount() { return successCount; }
        public long getFailedCount() { return failedCount; }
        public long getExpiredCount() { return expiredCount; }
        public long getTotalCount() { return pendingCount + processingCount + successCount + failedCount + expiredCount; }
        
        @Override
        public String toString() {
            return "DeadLetterQueueStats{" +
                    "pending=" + pendingCount +
                    ", processing=" + processingCount +
                    ", success=" + successCount +
                    ", failed=" + failedCount +
                    ", expired=" + expiredCount +
                    ", total=" + getTotalCount() +
                    '}';
        }
    }
}
