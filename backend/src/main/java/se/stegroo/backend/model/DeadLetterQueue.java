package se.stegroo.backend.model;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/**
 * Entity för dead-letter queue för misslyckade jobb.
 * Används för att spåra jobb som misslyckades under synkronisering
 * och möjliggöra retry-försök.
 */
@Entity
@Table(name = "dead_letter_queue")
@EntityListeners(AuditingEntityListener.class)
public class DeadLetterQueue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "external_id", nullable = false)
    private String externalId;

    @Column(name = "job_data", columnDefinition = "TEXT")
    private String jobData;

    @Column(name = "error_message", length = 2000, nullable = false)
    private String errorMessage;

    @Column(name = "error_type", length = 255)
    private String errorType;

    @Column(name = "retry_count", nullable = false)
    private Integer retryCount = 0;

    @Column(name = "max_retries", nullable = false)
    private Integer maxRetries = 3;

    @Column(name = "next_retry_at")
    private LocalDateTime nextRetryAt;

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private Status status;

    @Column(name = "sync_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private SyncType syncType;

    @Column(name = "failure_reason", length = 500)
    private String failureReason;

    @Column(name = "stack_trace", columnDefinition = "TEXT")
    private String stackTrace;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public enum Status {
        PENDING,        // Väntar på retry
        PROCESSING,     // Under bearbetning
        SUCCESS,        // Lyckades
        FAILED,         // Slutgiltigt misslyckad
        EXPIRED         // Utgången (för gammal)
    }

    public enum SyncType {
        SNAPSHOT,       // Från snapshot-synkronisering
        INCREMENTAL,    // Från inkrementell synkronisering
        CATEGORIES,     // Från kategori-synkronisering
        SKILLS,         // Från kompetens-synkronisering
        JOBS            // Från jobb-synkronisering
    }

    // Constructors
    public DeadLetterQueue() {}

    public DeadLetterQueue(String externalId, String jobData, String errorMessage, 
                          String errorType, SyncType syncType) {
        this.externalId = externalId;
        this.jobData = jobData;
        this.errorMessage = errorMessage;
        this.errorType = errorType;
        this.syncType = syncType;
        this.status = Status.PENDING;
        this.retryCount = 0;
        this.maxRetries = 3;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getExternalId() {
        return externalId;
    }

    public void setExternalId(String externalId) {
        this.externalId = externalId;
    }

    public String getJobData() {
        return jobData;
    }

    public void setJobData(String jobData) {
        this.jobData = jobData;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    public String getErrorType() {
        return errorType;
    }

    public void setErrorType(String errorType) {
        this.errorType = errorType;
    }

    public Integer getRetryCount() {
        return retryCount;
    }

    public void setRetryCount(Integer retryCount) {
        this.retryCount = retryCount;
    }

    public Integer getMaxRetries() {
        return maxRetries;
    }

    public void setMaxRetries(Integer maxRetries) {
        this.maxRetries = maxRetries;
    }

    public LocalDateTime getNextRetryAt() {
        return nextRetryAt;
    }

    public void setNextRetryAt(LocalDateTime nextRetryAt) {
        this.nextRetryAt = nextRetryAt;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public SyncType getSyncType() {
        return syncType;
    }

    public void setSyncType(SyncType syncType) {
        this.syncType = syncType;
    }

    public String getFailureReason() {
        return failureReason;
    }

    public void setFailureReason(String failureReason) {
        this.failureReason = failureReason;
    }

    public String getStackTrace() {
        return stackTrace;
    }

    public void setStackTrace(String stackTrace) {
        this.stackTrace = stackTrace;
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
    public void incrementRetryCount() {
        this.retryCount++;
    }

    public boolean canRetry() {
        return this.retryCount < this.maxRetries && this.status != Status.EXPIRED;
    }

    public void markAsProcessing() {
        this.status = Status.PROCESSING;
    }

    public void markAsSuccess() {
        this.status = Status.SUCCESS;
    }

    public void markAsFailed(String failureReason) {
        this.status = Status.FAILED;
        this.failureReason = failureReason;
    }

    public void markAsExpired() {
        this.status = Status.EXPIRED;
    }

    public void scheduleRetry(LocalDateTime nextRetryAt) {
        if (canRetry()) {
            this.status = Status.PENDING;
            this.nextRetryAt = nextRetryAt;
        } else {
            this.status = Status.FAILED;
        }
    }

    public boolean isReadyForRetry() {
        return this.status == Status.PENDING && 
               this.nextRetryAt != null && 
               LocalDateTime.now().isAfter(this.nextRetryAt);
    }

    @Override
    public String toString() {
        return "DeadLetterQueue{" +
                "id=" + id +
                ", externalId='" + externalId + '\'' +
                ", status=" + status +
                ", retryCount=" + retryCount +
                ", syncType=" + syncType +
                '}';
    }
}
