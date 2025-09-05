package se.stegroo.backend.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import se.stegroo.backend.model.DeadLetterQueue;
import se.stegroo.backend.repository.DeadLetterQueueRepository;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DeadLetterQueueServiceTest {

    @Mock
    private DeadLetterQueueRepository deadLetterQueueRepository;

    @Mock
    private RetryService retryService;

    @InjectMocks
    private DeadLetterQueueService deadLetterQueueService;

    private DeadLetterQueue failedJob;
    private DeadLetterQueue processingJob;
    private DeadLetterQueue successJob;

    @BeforeEach
    void setUp() {
        failedJob = new DeadLetterQueue("ext-123", "job-data", "error message", "RuntimeException", DeadLetterQueue.SyncType.JOBS);
        failedJob.setId(1L);
        failedJob.setStatus(DeadLetterQueue.Status.FAILED);
        failedJob.setCreatedAt(LocalDateTime.now().minusHours(1));
        failedJob.setNextRetryAt(LocalDateTime.now().plusMinutes(30));

        processingJob = new DeadLetterQueue("ext-456", "job-data", "error message", "RuntimeException", DeadLetterQueue.SyncType.CATEGORIES);
        processingJob.setId(2L);
        processingJob.setStatus(DeadLetterQueue.Status.PROCESSING);
        processingJob.setCreatedAt(LocalDateTime.now().minusMinutes(30));

        successJob = new DeadLetterQueue("ext-789", "job-data", "error message", "RuntimeException", DeadLetterQueue.SyncType.JOBS);
        successJob.setId(3L);
        successJob.setStatus(DeadLetterQueue.Status.SUCCESS);
        successJob.setCreatedAt(LocalDateTime.now().minusHours(2));
    }

    @Test
    void addFailedJob_ShouldCreateAndSaveFailedJob() {
        // Given
        String externalId = "ext-123";
        String jobData = "job-data";
        String errorMessage = "error message";
        String errorType = "RuntimeException";
        DeadLetterQueue.SyncType syncType = DeadLetterQueue.SyncType.JOBS;

        when(deadLetterQueueRepository.save(any(DeadLetterQueue.class))).thenReturn(failedJob);

        // When
        DeadLetterQueue result = deadLetterQueueService.addFailedJob(externalId, jobData, errorMessage, errorType, syncType);

        // Then
        assertNotNull(result);
        assertEquals(externalId, result.getExternalId());
        assertEquals(jobData, result.getJobData());
        assertEquals(errorMessage, result.getErrorMessage());
        assertEquals(errorType, result.getErrorType());
        assertEquals(syncType, result.getSyncType());
        assertEquals(DeadLetterQueue.Status.FAILED, result.getStatus());
        assertNotNull(result.getNextRetryAt());

        verify(deadLetterQueueRepository).save(any(DeadLetterQueue.class));
    }

    @Test
    void addFailedJobWithStackTrace_ShouldCreateJobWithStackTrace() {
        // Given
        String externalId = "ext-123";
        String jobData = "job-data";
        String errorMessage = "error message";
        String errorType = "RuntimeException";
        DeadLetterQueue.SyncType syncType = DeadLetterQueue.SyncType.JOBS;
        String stackTrace = "stack trace";

        when(deadLetterQueueRepository.save(any(DeadLetterQueue.class))).thenReturn(failedJob);

        // When
        DeadLetterQueue result = deadLetterQueueService.addFailedJobWithStackTrace(
            externalId, jobData, errorMessage, errorType, syncType, stackTrace);

        // Then
        assertNotNull(result);
        assertEquals(stackTrace, result.getStackTrace());

        verify(deadLetterQueueRepository, times(2)).save(any(DeadLetterQueue.class));
    }

    @Test
    void getJobsReadyForRetry_ShouldReturnJobsReadyForRetry() {
        // Given
        LocalDateTime now = LocalDateTime.now();
        List<DeadLetterQueue> readyJobs = Arrays.asList(failedJob, processingJob);
        
        when(deadLetterQueueRepository.findReadyForRetry(now)).thenReturn(readyJobs);

        // When
        List<DeadLetterQueue> result = deadLetterQueueService.getJobsReadyForRetry();

        // Then
        assertNotNull(result);
        assertEquals(2, result.size());
        verify(deadLetterQueueRepository).findReadyForRetry(now);
    }

    @Test
    void getJobsReadyForRetry_ShouldReturnEmptyListWhenNoJobsReady() {
        // Given
        LocalDateTime now = LocalDateTime.now();
        when(deadLetterQueueRepository.findReadyForRetry(now)).thenReturn(Collections.emptyList());

        // When
        List<DeadLetterQueue> result = deadLetterQueueService.getJobsReadyForRetry();

        // Then
        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(deadLetterQueueRepository).findReadyForRetry(now);
    }

    @Test
    void getJobsByStatus_ShouldReturnJobsWithSpecificStatus() {
        // Given
        DeadLetterQueue.Status status = DeadLetterQueue.Status.FAILED;
        List<DeadLetterQueue> failedJobs = Collections.singletonList(failedJob);
        
        when(deadLetterQueueRepository.findByStatus(status)).thenReturn(failedJobs);

        // When
        List<DeadLetterQueue> result = deadLetterQueueService.getJobsByStatus(status);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(status, result.get(0).getStatus());
        verify(deadLetterQueueRepository).findByStatus(status);
    }

    @Test
    void getJobsBySyncType_ShouldReturnJobsWithSpecificSyncType() {
        // Given
        DeadLetterQueue.SyncType syncType = DeadLetterQueue.SyncType.JOBS;
        List<DeadLetterQueue> jobSyncJobs = Arrays.asList(failedJob, successJob);
        
        when(deadLetterQueueRepository.findBySyncType(syncType)).thenReturn(jobSyncJobs);

        // When
        List<DeadLetterQueue> result = deadLetterQueueService.getJobsBySyncType(syncType);

        // Then
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(syncType, result.get(0).getSyncType());
        assertEquals(syncType, result.get(1).getSyncType());
        verify(deadLetterQueueRepository).findBySyncType(syncType);
    }

    @Test
    void getJobByExternalId_ShouldReturnJobWhenExists() {
        // Given
        String externalId = "ext-123";
        when(deadLetterQueueRepository.findByExternalId(externalId)).thenReturn(Optional.of(failedJob));

        // When
        Optional<DeadLetterQueue> result = deadLetterQueueService.getJobByExternalId(externalId);

        // Then
        assertTrue(result.isPresent());
        assertEquals(externalId, result.get().getExternalId());
        verify(deadLetterQueueRepository).findByExternalId(externalId);
    }

    @Test
    void getJobByExternalId_ShouldReturnEmptyWhenJobDoesNotExist() {
        // Given
        String externalId = "ext-999";
        when(deadLetterQueueRepository.findByExternalId(externalId)).thenReturn(Optional.empty());

        // When
        Optional<DeadLetterQueue> result = deadLetterQueueService.getJobByExternalId(externalId);

        // Then
        assertFalse(result.isPresent());
        verify(deadLetterQueueRepository).findByExternalId(externalId);
    }

    @Test
    void markJobAsProcessing_ShouldUpdateJobStatus() {
        // Given
        when(deadLetterQueueRepository.save(any(DeadLetterQueue.class))).thenReturn(processingJob);

        // When
        deadLetterQueueService.markJobAsProcessing(failedJob);

        // Then
        assertEquals(DeadLetterQueue.Status.PROCESSING, failedJob.getStatus());
        verify(deadLetterQueueRepository).save(failedJob);
    }

    @Test
    void markJobAsSuccess_ShouldUpdateJobStatus() {
        // Given
        when(deadLetterQueueRepository.save(any(DeadLetterQueue.class))).thenReturn(successJob);

        // When
        deadLetterQueueService.markJobAsSuccess(processingJob);

        // Then
        assertEquals(DeadLetterQueue.Status.SUCCESS, processingJob.getStatus());
        verify(deadLetterQueueRepository).save(processingJob);
    }

    @Test
    void markJobAsFailed_ShouldUpdateJobStatus() {
        // Given
        String errorMessage = "new error message";
        when(deadLetterQueueRepository.save(any(DeadLetterQueue.class))).thenReturn(failedJob);

        // When
        deadLetterQueueService.markJobAsFailed(processingJob, errorMessage);

        // Then
        assertEquals(DeadLetterQueue.Status.FAILED, processingJob.getStatus());
        assertEquals(errorMessage, processingJob.getErrorMessage());
        assertNotNull(processingJob.getNextRetryAt());
        verify(deadLetterQueueRepository).save(processingJob);
    }

    @Test
    void scheduleRetry_ShouldScheduleRetryForJob() {
        // Given
        when(deadLetterQueueRepository.save(any(DeadLetterQueue.class))).thenReturn(failedJob);
        when(retryService.calculateNextRetryTime(anyInt(), any(LocalDateTime.class)))
            .thenReturn(LocalDateTime.now().plusMinutes(30));

        // When
        deadLetterQueueService.scheduleRetry(failedJob);

        // Then
        verify(deadLetterQueueRepository).save(failedJob);
        verify(retryService).calculateNextRetryTime(anyInt(), any(LocalDateTime.class));
    }

    @Test
    void getStats_ShouldReturnCorrectStatistics() {
        // Given
        when(deadLetterQueueRepository.countByStatus(DeadLetterQueue.Status.FAILED)).thenReturn(5L);
        when(deadLetterQueueRepository.countByStatus(DeadLetterQueue.Status.PROCESSING)).thenReturn(2L);
        when(deadLetterQueueRepository.countByStatus(DeadLetterQueue.Status.SUCCESS)).thenReturn(10L);
        when(deadLetterQueueRepository.countByStatus(DeadLetterQueue.Status.PENDING)).thenReturn(3L);
        when(deadLetterQueueRepository.countByStatus(DeadLetterQueue.Status.EXPIRED)).thenReturn(1L);

        // When
        DeadLetterQueueService.DeadLetterQueueStats statistics = deadLetterQueueService.getStats();

        // Then
        assertNotNull(statistics);
        assertEquals(5L, statistics.getFailedCount());
        assertEquals(2L, statistics.getProcessingCount());
        assertEquals(10L, statistics.getSuccessCount());
        assertEquals(3L, statistics.getPendingCount());
        assertEquals(1L, statistics.getExpiredCount());
        assertEquals(21L, statistics.getTotalCount());

        verify(deadLetterQueueRepository).countByStatus(DeadLetterQueue.Status.FAILED);
        verify(deadLetterQueueRepository).countByStatus(DeadLetterQueue.Status.PROCESSING);
        verify(deadLetterQueueRepository).countByStatus(DeadLetterQueue.Status.SUCCESS);
        verify(deadLetterQueueRepository).countByStatus(DeadLetterQueue.Status.PENDING);
        verify(deadLetterQueueRepository).countByStatus(DeadLetterQueue.Status.EXPIRED);
    }












}
