package se.stegroo.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import se.stegroo.backend.model.SyncCheckpoint;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository för synkroniseringscheckpoints.
 */
@Repository
public interface SyncCheckpointRepository extends JpaRepository<SyncCheckpoint, Long> {

    /**
     * Hitta checkpoint baserat på synkroniseringstyp
     */
    Optional<SyncCheckpoint> findBySyncType(SyncCheckpoint.SyncType syncType);

    /**
     * Hitta alla checkpoints som behöver retry
     */
    List<SyncCheckpoint> findByStatusAndNextRetryAtBefore(
            SyncCheckpoint.Status status, 
            LocalDateTime before);

    /**
     * Hitta alla misslyckade checkpoints
     */
    List<SyncCheckpoint> findByStatus(SyncCheckpoint.Status status);

    /**
     * Hitta checkpoints som har överskridit max retry-försök
     */
    @Query("SELECT sc FROM SyncCheckpoint sc WHERE sc.status = 'FAILED' AND sc.retryCount >= 3")
    List<SyncCheckpoint> findExhaustedRetries();

    /**
     * Hitta checkpoints som är redo för retry
     */
    @Query("SELECT sc FROM SyncCheckpoint sc WHERE sc.status = 'RETRY_PENDING' AND sc.nextRetryAt <= :now")
    List<SyncCheckpoint> findReadyForRetry(@Param("now") LocalDateTime now);

    /**
     * Hitta checkpoints som inte har synkroniserats på en viss tid
     */
    @Query("SELECT sc FROM SyncCheckpoint sc WHERE sc.lastSyncAt < :cutoff OR sc.lastSyncAt IS NULL")
    List<SyncCheckpoint> findStaleCheckpoints(@Param("cutoff") LocalDateTime cutoff);

    /**
     * Hitta checkpoints baserat på synkroniseringstyp och status
     */
    List<SyncCheckpoint> findBySyncTypeAndStatus(SyncCheckpoint.SyncType syncType, SyncCheckpoint.Status status);

    /**
     * Hitta checkpoints som skapades efter en viss tid
     */
    List<SyncCheckpoint> findByCreatedAtAfter(LocalDateTime after);

    /**
     * Hitta checkpoints som uppdaterades efter en viss tid
     */
    List<SyncCheckpoint> findByUpdatedAtAfter(LocalDateTime after);

    /**
     * Räkna checkpoints baserat på status
     */
    long countByStatus(SyncCheckpoint.Status status);

    /**
     * Räkna checkpoints baserat på synkroniseringstyp
     */
    long countBySyncType(SyncCheckpoint.SyncType syncType);

    /**
     * Hitta checkpoints med högst retry-räknare
     */
    @Query("SELECT sc FROM SyncCheckpoint sc WHERE sc.retryCount > 0 ORDER BY sc.retryCount DESC")
    List<SyncCheckpoint> findCheckpointsWithRetries();

    /**
     * Hitta checkpoints som behöver uppdateras
     */
    @Query("SELECT sc FROM SyncCheckpoint sc WHERE sc.status = 'ACTIVE' AND sc.lastSyncAt < :cutoff")
    List<SyncCheckpoint> findCheckpointsNeedingUpdate(@Param("cutoff") LocalDateTime cutoff);
}
