package se.stegroo.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import se.stegroo.backend.model.DeadLetterQueue;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository för dead-letter queue.
 */
@Repository
public interface DeadLetterQueueRepository extends JpaRepository<DeadLetterQueue, Long> {

    /**
     * Hitta misslyckade jobb baserat på externt ID
     */
    Optional<DeadLetterQueue> findByExternalId(String externalId);

    /**
     * Hitta alla misslyckade jobb baserat på status
     */
    List<DeadLetterQueue> findByStatus(DeadLetterQueue.Status status);

    /**
     * Hitta alla misslyckade jobb baserat på synkroniseringstyp
     */
    List<DeadLetterQueue> findBySyncType(DeadLetterQueue.SyncType syncType);

    /**
     * Hitta misslyckade jobb baserat på status och synkroniseringstyp
     */
    List<DeadLetterQueue> findByStatusAndSyncType(DeadLetterQueue.Status status, DeadLetterQueue.SyncType syncType);

    /**
     * Hitta jobb som är redo för retry
     */
    @Query("SELECT dlq FROM DeadLetterQueue dlq WHERE dlq.status = 'PENDING' AND dlq.nextRetryAt <= :now")
    List<DeadLetterQueue> findReadyForRetry(@Param("now") LocalDateTime now);

    /**
     * Hitta jobb som har överskridit max retry-försök
     */
    @Query("SELECT dlq FROM DeadLetterQueue dlq WHERE dlq.retryCount >= dlq.maxRetries")
    List<DeadLetterQueue> findExhaustedRetries();

    /**
     * Hitta jobb som skapades efter en viss tid
     */
    List<DeadLetterQueue> findByCreatedAtAfter(LocalDateTime after);

    /**
     * Hitta jobb som uppdaterades efter en viss tid
     */
    List<DeadLetterQueue> findByUpdatedAtAfter(LocalDateTime after);

    /**
     * Hitta jobb baserat på feltyp
     */
    List<DeadLetterQueue> findByErrorType(String errorType);

    /**
     * Hitta jobb som skapades inom ett tidsintervall
     */
    @Query("SELECT dlq FROM DeadLetterQueue dlq WHERE dlq.createdAt BETWEEN :start AND :end")
    List<DeadLetterQueue> findByCreatedAtBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    /**
     * Hitta jobb som behöver retry inom en tidsperiod
     */
    @Query("SELECT dlq FROM DeadLetterQueue dlq WHERE dlq.status = 'PENDING' AND dlq.nextRetryAt BETWEEN :start AND :end")
    List<DeadLetterQueue> findRetryScheduledBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    /**
     * Räkna jobb baserat på status
     */
    long countByStatus(DeadLetterQueue.Status status);

    /**
     * Räkna jobb baserat på synkroniseringstyp
     */
    long countBySyncType(DeadLetterQueue.SyncType syncType);

    /**
     * Räkna jobb baserat på feltyp
     */
    long countByErrorType(String errorType);

    /**
     * Hitta jobb med högst retry-räknare
     */
    @Query("SELECT dlq FROM DeadLetterQueue dlq WHERE dlq.retryCount > 0 ORDER BY dlq.retryCount DESC")
    List<DeadLetterQueue> findJobsWithRetries();

    /**
     * Hitta jobb som behöver rensas (för gamla)
     */
    @Query("SELECT dlq FROM DeadLetterQueue dlq WHERE dlq.createdAt < :cutoff AND dlq.status IN ('SUCCESS', 'FAILED', 'EXPIRED')")
    List<DeadLetterQueue> findJobsForCleanup(@Param("cutoff") LocalDateTime cutoff);

    /**
     * Hitta jobb med paginering baserat på status
     */
    Page<DeadLetterQueue> findByStatus(DeadLetterQueue.Status status, Pageable pageable);

    /**
     * Hitta jobb med paginering baserat på synkroniseringstyp
     */
    Page<DeadLetterQueue> findBySyncType(DeadLetterQueue.SyncType syncType, Pageable pageable);

    /**
     * Hitta jobb med sökning på felmeddelande
     */
    @Query("SELECT dlq FROM DeadLetterQueue dlq WHERE dlq.errorMessage LIKE %:searchTerm%")
    List<DeadLetterQueue> findByErrorMessageContaining(@Param("searchTerm") String searchTerm);

    /**
     * Hitta jobb som behöver uppdateras
     */
    @Query("SELECT dlq FROM DeadLetterQueue dlq WHERE dlq.status = 'PENDING' AND dlq.nextRetryAt < :now")
    List<DeadLetterQueue> findJobsNeedingUpdate(@Param("now") LocalDateTime now);
}
