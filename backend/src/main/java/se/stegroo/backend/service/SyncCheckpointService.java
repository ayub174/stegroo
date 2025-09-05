package se.stegroo.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import se.stegroo.backend.model.SyncCheckpoint;
import se.stegroo.backend.repository.SyncCheckpointRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Service för att hantera synkroniseringscheckpoints.
 * Används för att spåra synkroniseringsstatus och möjliggöra inkrementell synkronisering.
 */
@Service
public class SyncCheckpointService {
    
    private static final Logger log = LoggerFactory.getLogger(SyncCheckpointService.class);
    
    private final SyncCheckpointRepository syncCheckpointRepository;
    private final RetryService retryService;
    
    public SyncCheckpointService(SyncCheckpointRepository syncCheckpointRepository, 
                                RetryService retryService) {
        this.syncCheckpointRepository = syncCheckpointRepository;
        this.retryService = retryService;
    }
    
    /**
     * Skapar eller uppdaterar en checkpoint för en synkroniseringstyp
     */
    public SyncCheckpoint createOrUpdateCheckpoint(SyncCheckpoint.SyncType syncType) {
        Optional<SyncCheckpoint> existingCheckpoint = syncCheckpointRepository.findBySyncType(syncType);
        
        if (existingCheckpoint.isPresent()) {
            SyncCheckpoint checkpoint = existingCheckpoint.get();
            checkpoint.setLastSyncAt(LocalDateTime.now());
            checkpoint.setStatus(SyncCheckpoint.Status.ACTIVE);
            checkpoint.setRetryCount(0);
            checkpoint.setLastErrorMessage(null);
            return syncCheckpointRepository.save(checkpoint);
        } else {
            SyncCheckpoint newCheckpoint = new SyncCheckpoint(syncType);
            newCheckpoint.setLastSyncAt(LocalDateTime.now());
            return syncCheckpointRepository.save(newCheckpoint);
        }
    }
    
    /**
     * Hämtar en checkpoint för en specifik synkroniseringstyp
     */
    public Optional<SyncCheckpoint> getCheckpoint(SyncCheckpoint.SyncType syncType) {
        return syncCheckpointRepository.findBySyncType(syncType);
    }
    
    /**
     * Hämtar alla checkpoints
     */
    public List<SyncCheckpoint> getAllCheckpoints() {
        return syncCheckpointRepository.findAll();
    }
    
    /**
     * Hämtar checkpoints som behöver retry
     */
    public List<SyncCheckpoint> getCheckpointsNeedingRetry() {
        return syncCheckpointRepository.findByStatusAndNextRetryAtBefore(
                SyncCheckpoint.Status.RETRY_PENDING, LocalDateTime.now());
    }
    
    /**
     * Hämtar checkpoints som har överskridit max retry-försök
     */
    public List<SyncCheckpoint> getExhaustedCheckpoints() {
        return syncCheckpointRepository.findExhaustedRetries();
    }
    
    /**
     * Hämtar checkpoints som inte har synkroniserats på en viss tid
     */
    public List<SyncCheckpoint> getStaleCheckpoints(LocalDateTime cutoff) {
        return syncCheckpointRepository.findStaleCheckpoints(cutoff);
    }
    
    /**
     * Markerar en checkpoint som misslyckad
     */
    public void markCheckpointAsFailed(SyncCheckpoint.SyncType syncType, String errorMessage) {
        Optional<SyncCheckpoint> checkpointOpt = getCheckpoint(syncType);
        if (checkpointOpt.isPresent()) {
            SyncCheckpoint checkpoint = checkpointOpt.get();
            checkpoint.markAsFailed(errorMessage);
            syncCheckpointRepository.save(checkpoint);
            log.warn("Checkpoint markerad som misslyckad: {} - {}", syncType, errorMessage);
        }
    }
    
    /**
     * Markerar en checkpoint som slutförd
     */
    public void markCheckpointAsCompleted(SyncCheckpoint.SyncType syncType) {
        Optional<SyncCheckpoint> checkpointOpt = getCheckpoint(syncType);
        if (checkpointOpt.isPresent()) {
            SyncCheckpoint checkpoint = checkpointOpt.get();
            checkpoint.markAsCompleted();
            syncCheckpointRepository.save(checkpoint);
            log.info("Checkpoint markerad som slutförd: {}", syncType);
        }
    }
    
    /**
     * Schemalägger retry för en checkpoint
     */
    public void scheduleCheckpointRetry(SyncCheckpoint.SyncType syncType) {
        Optional<SyncCheckpoint> checkpointOpt = getCheckpoint(syncType);
        if (checkpointOpt.isPresent()) {
            SyncCheckpoint checkpoint = checkpointOpt.get();
            
            if (checkpoint.shouldRetry()) {
                LocalDateTime nextRetryAt = retryService.calculateNextRetryTime(
                        checkpoint.getRetryCount(), LocalDateTime.now());
                checkpoint.markForRetry(nextRetryAt);
                syncCheckpointRepository.save(checkpoint);
                log.info("Schemalagt retry för checkpoint: {} vid {}", syncType, nextRetryAt);
            } else {
                log.warn("Checkpoint kan inte retry:as mer: {}", syncType);
            }
        }
    }
    
    /**
     * Uppdaterar en checkpoint med ny cursor
     */
    public void updateCheckpointCursor(SyncCheckpoint.SyncType syncType, String cursor) {
        Optional<SyncCheckpoint> checkpointOpt = getCheckpoint(syncType);
        if (checkpointOpt.isPresent()) {
            SyncCheckpoint checkpoint = checkpointOpt.get();
            checkpoint.setLastCursor(cursor);
            checkpoint.setLastSyncAt(LocalDateTime.now());
            syncCheckpointRepository.save(checkpoint);
            log.debug("Uppdaterat cursor för checkpoint: {} - {}", syncType, cursor);
        }
    }
    
    /**
     * Hämtar senaste synkroniseringstid för en typ
     */
    public Optional<LocalDateTime> getLastSyncTime(SyncCheckpoint.SyncType syncType) {
        return getCheckpoint(syncType).map(SyncCheckpoint::getLastSyncAt);
    }
    
    /**
     * Hämtar senaste cursor för en typ
     */
    public Optional<String> getLastCursor(SyncCheckpoint.SyncType syncType) {
        return getCheckpoint(syncType).map(SyncCheckpoint::getLastCursor);
    }
    
    /**
     * Kontrollerar om en synkroniseringstyp behöver uppdateras
     */
    public boolean needsUpdate(SyncCheckpoint.SyncType syncType, LocalDateTime cutoff) {
        Optional<SyncCheckpoint> checkpointOpt = getCheckpoint(syncType);
        if (checkpointOpt.isEmpty()) {
            return true; // Ny synkroniseringstyp, behöver uppdateras
        }
        
        SyncCheckpoint checkpoint = checkpointOpt.get();
        LocalDateTime lastSync = checkpoint.getLastSyncAt();
        
        return lastSync == null || lastSync.isBefore(cutoff);
    }
    
    /**
     * Schemalagd kontroll av checkpoints som behöver retry
     */
    @Scheduled(fixedDelay = 600000) // Körs var 10:e minut
    public void processCheckpointRetries() {
        log.debug("Kontrollerar checkpoints som behöver retry");
        
        List<SyncCheckpoint> readyCheckpoints = getCheckpointsNeedingRetry();
        if (readyCheckpoints.isEmpty()) {
            return;
        }
        
        log.info("Hittade {} checkpoints som är redo för retry", readyCheckpoints.size());
        
        for (SyncCheckpoint checkpoint : readyCheckpoints) {
            try {
                processCheckpointRetry(checkpoint);
            } catch (Exception e) {
                log.error("Fel vid bearbetning av checkpoint retry: {}", checkpoint.getSyncType(), e);
                scheduleCheckpointRetry(checkpoint.getSyncType());
            }
        }
    }
    
    /**
     * Bearbetar retry för en checkpoint
     */
    private void processCheckpointRetry(SyncCheckpoint checkpoint) {
        log.info("Bearbetar retry för checkpoint: {}", checkpoint.getSyncType());
        
        try {
            // Här skulle vi anropa den ursprungliga synkroniseringslogiken
            // För nu simulerar vi en lyckad bearbetning
            boolean success = retryService.executeWithRetry(
                () -> processCheckpointSync(checkpoint.getSyncType()),
                "Checkpoint retry: " + checkpoint.getSyncType(),
                2 // Färre retry-försök för checkpoints
            );
            
            if (success) {
                markCheckpointAsCompleted(checkpoint.getSyncType());
            } else {
                throw new RuntimeException("Checkpoint-synkronisering misslyckades");
            }
            
        } catch (Exception e) {
            log.error("Retry misslyckades för checkpoint: {}", checkpoint.getSyncType(), e);
            scheduleCheckpointRetry(checkpoint.getSyncType());
        }
    }
    
    /**
     * Simulerar synkronisering av en checkpoint
     */
    private boolean processCheckpointSync(SyncCheckpoint.SyncType syncType) {
        // Här skulle vi implementera den faktiska synkroniseringslogiken
        // För nu simulerar vi en lyckad synkronisering
        try {
            Thread.sleep(200); // Simulera synkroniseringstid
            log.debug("Simulerad synkronisering av checkpoint: {}", syncType);
            return true;
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return false;
        }
    }
    
    /**
     * Hämtar statistik för checkpoints
     */
    public CheckpointStats getStats() {
        long activeCount = syncCheckpointRepository.countByStatus(SyncCheckpoint.Status.ACTIVE);
        long failedCount = syncCheckpointRepository.countByStatus(SyncCheckpoint.Status.FAILED);
        long retryPendingCount = syncCheckpointRepository.countByStatus(SyncCheckpoint.Status.RETRY_PENDING);
        long suspendedCount = syncCheckpointRepository.countByStatus(SyncCheckpoint.Status.SUSPENDED);
        long completedCount = syncCheckpointRepository.countByStatus(SyncCheckpoint.Status.COMPLETED);
        
        return new CheckpointStats(activeCount, failedCount, retryPendingCount, suspendedCount, completedCount);
    }
    
    /**
     * Statistik för checkpoints
     */
    public static class CheckpointStats {
        private final long activeCount;
        private final long failedCount;
        private final long retryPendingCount;
        private final long suspendedCount;
        private final long completedCount;
        
        public CheckpointStats(long activeCount, long failedCount, long retryPendingCount, 
                              long suspendedCount, long completedCount) {
            this.activeCount = activeCount;
            this.failedCount = failedCount;
            this.retryPendingCount = retryPendingCount;
            this.suspendedCount = suspendedCount;
            this.completedCount = completedCount;
        }
        
        public long getActiveCount() { return activeCount; }
        public long getFailedCount() { return failedCount; }
        public long getRetryPendingCount() { return retryPendingCount; }
        public long getSuspendedCount() { return suspendedCount; }
        public long getCompletedCount() { return completedCount; }
        public long getTotalCount() { return activeCount + failedCount + retryPendingCount + suspendedCount + completedCount; }
        
        @Override
        public String toString() {
            return "CheckpointStats{" +
                    "active=" + activeCount +
                    ", failed=" + failedCount +
                    ", retryPending=" + retryPendingCount +
                    ", suspended=" + suspendedCount +
                    ", completed=" + completedCount +
                    ", total=" + getTotalCount() +
                    '}';
        }
    }
}
