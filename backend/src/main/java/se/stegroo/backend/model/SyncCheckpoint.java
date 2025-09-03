package se.stegroo.backend.model;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/**
 * Entity för att spåra synkroniseringscheckpoints.
 * Används för att hålla koll på senaste synkroniseringstillfället
 * och möjliggöra inkrementell synkronisering.
 */
@Entity
@Table(name = "sync_checkpoints")
@EntityListeners(AuditingEntityListener.class)
public class SyncCheckpoint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "sync_type", nullable = false, unique = true)
    @Enumerated(EnumType.STRING)
    private SyncType syncType;

    @Column(name = "last_sync_at", nullable = false)
    private LocalDateTime lastSyncAt;

    @Column(name = "last_cursor", length = 1000)
    private String lastCursor;

    @Column(name = "total_processed")
    private Long totalProcessed;

    @Column(name = "total_successful")
    private Long totalSuccessful;

    @Column(name = "total_failed")
    private Long totalFailed;

    @Column(name = "last_error_message", length = 2000)
    private String lastErrorMessage;

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private Status status;

    @Column(name = "retry_count")
    private Integer retryCount;

    @Column(name = "next_retry_at")
    private LocalDateTime nextRetryAt;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public enum SyncType {
        SNAPSHOT,           // Fullständig synkronisering
        INCREMENTAL,        // Inkrementell synkronisering
        CATEGORIES,         // Kategori-synkronisering
        SKILLS,            // Kompetens-synkronisering
        JOBS               // Jobb-synkronisering
    }

    public enum Status {
        ACTIVE,             // Synkronisering aktiv
        FAILED,             // Synkronisering misslyckades
        RETRY_PENDING,      // Väntar på retry
        SUSPENDED,          // Synkronisering pausad
        COMPLETED           // Synkronisering slutförd
    }

    // Constructors
    public SyncCheckpoint() {}

    public SyncCheckpoint(SyncType syncType) {
        this.syncType = syncType;
        this.status = Status.ACTIVE;
        this.retryCount = 0;
        this.totalProcessed = 0L;
        this.totalSuccessful = 0L;
        this.totalFailed = 0L;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public SyncType getSyncType() {
        return syncType;
    }

    public void setSyncType(SyncType syncType) {
        this.syncType = syncType;
    }

    public LocalDateTime getLastSyncAt() {
        return lastSyncAt;
    }

    public void setLastSyncAt(LocalDateTime lastSyncAt) {
        this.lastSyncAt = lastSyncAt;
    }

    public String getLastCursor() {
        return lastCursor;
    }

    public void setLastCursor(String lastCursor) {
        this.lastCursor = lastCursor;
    }

    public Long getTotalProcessed() {
        return totalProcessed;
    }

    public void setTotalProcessed(Long totalProcessed) {
        this.totalProcessed = totalProcessed;
    }

    public Long getTotalSuccessful() {
        return totalSuccessful;
    }

    public void setTotalSuccessful(Long totalSuccessful) {
        this.totalSuccessful = totalSuccessful;
    }

    public Long getTotalFailed() {
        return totalFailed;
    }

    public void setTotalFailed(Long totalFailed) {
        this.totalFailed = totalFailed;
    }

    public String getLastErrorMessage() {
        return lastErrorMessage;
    }

    public void setLastErrorMessage(String lastErrorMessage) {
        this.lastErrorMessage = lastErrorMessage;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public Integer getRetryCount() {
        return retryCount;
    }

    public void setRetryCount(Integer retryCount) {
        this.retryCount = retryCount;
    }

    public LocalDateTime getNextRetryAt() {
        return nextRetryAt;
    }

    public void setNextRetryAt(LocalDateTime nextRetryAt) {
        this.nextRetryAt = nextRetryAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    // Business methods
    public void incrementProcessed() {
        this.totalProcessed = (this.totalProcessed == null ? 0L : this.totalProcessed) + 1;
    }

    public void incrementSuccessful() {
        this.totalSuccessful = (this.totalSuccessful == null ? 0L : this.totalSuccessful) + 1;
    }

    public void incrementFailed() {
        this.totalFailed = (this.totalFailed == null ? 0L : this.totalFailed) + 1;
    }

    public void markAsFailed(String errorMessage) {
        this.status = Status.FAILED;
        this.lastErrorMessage = errorMessage;
        this.retryCount = (this.retryCount == null ? 0 : this.retryCount) + 1;
    }

    public void markForRetry(LocalDateTime nextRetryAt) {
        this.status = Status.RETRY_PENDING;
        this.nextRetryAt = nextRetryAt;
    }

    public void markAsCompleted() {
        this.status = Status.COMPLETED;
        this.lastErrorMessage = null;
        this.retryCount = 0;
    }

    public boolean shouldRetry() {
        return this.status == Status.FAILED && 
               (this.retryCount == null || this.retryCount < 3);
    }

    @Override
    public String toString() {
        return "SyncCheckpoint{" +
                "id=" + id +
                ", syncType=" + syncType +
                ", lastSyncAt=" + lastSyncAt +
                ", lastCursor=" + lastCursor +
                ", status=" + status +
                ", retryCount=" + retryCount +
                '}';
    }
}
