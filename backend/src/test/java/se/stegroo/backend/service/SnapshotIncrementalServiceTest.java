package se.stegroo.backend.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import se.stegroo.backend.model.DeadLetterQueue;
import se.stegroo.backend.model.JobListing;
import se.stegroo.backend.model.SyncCheckpoint;
import se.stegroo.backend.repository.JobListingRepository;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SnapshotIncrementalServiceTest {

    @Mock
    private ArbetsformedlingenService arbetsformedlingenService;

    @Mock
    private JobListingRepository jobListingRepository;

    @Mock
    private SyncCheckpointService syncCheckpointService;

    @Mock
    private DeadLetterQueueService deadLetterQueueService;

    @Mock
    private CursorPaginationService cursorPaginationService;

    @Mock
    private RetryService retryService;

    @InjectMocks
    private SnapshotIncrementalService snapshotIncrementalService;

    private JobListing testJob1;
    private JobListing testJob2;
    private SyncCheckpoint testCheckpoint;

    @BeforeEach
    void setUp() {
        // Set up test data
        testJob1 = new JobListing();
        testJob1.setId(1L);
        testJob1.setTitle("Software Developer");
        testJob1.setExternalId("ext-1");
        testJob1.setPublishedAt(LocalDateTime.now().minusDays(1));
        testJob1.setSource("test-source");

        testJob2 = new JobListing();
        testJob2.setId(2L);
        testJob2.setTitle("Data Scientist");
        testJob2.setExternalId("ext-2");
        testJob2.setPublishedAt(LocalDateTime.now().minusDays(2));
        testJob2.setSource("test-source");

        testCheckpoint = new SyncCheckpoint();
        testCheckpoint.setId(1L);
        testCheckpoint.setSyncType(SyncCheckpoint.SyncType.SNAPSHOT);
        testCheckpoint.setTotalProcessed(0L);
        testCheckpoint.setTotalSuccessful(0L);
        testCheckpoint.setTotalFailed(0L);
    }

    @Test
    void performSnapshotSync_ShouldCompleteSuccessfully() {
        // Given
        List<JobListing> allJobs = Arrays.asList(testJob1, testJob2);
        
        when(syncCheckpointService.createOrUpdateCheckpoint(SyncCheckpoint.SyncType.SNAPSHOT))
            .thenReturn(testCheckpoint);
        when(arbetsformedlingenService.fetchAllJobs()).thenReturn(allJobs);
        when(jobListingRepository.findByExternalId(anyString())).thenReturn(Optional.empty());
        when(jobListingRepository.save(any(JobListing.class))).thenReturn(testJob1);
        when(cursorPaginationService.hasMorePages(anyString(), anyInt(), anyInt())).thenReturn(false);
        doNothing().when(syncCheckpointService).markCheckpointAsCompleted(SyncCheckpoint.SyncType.SNAPSHOT);

        // When
        SnapshotIncrementalService.SnapshotResult result = snapshotIncrementalService.performSnapshotSync();

        // Then
        assertNotNull(result);
        assertTrue(result.isSuccess());
        assertEquals(2, result.getTotalProcessed());
        assertEquals(2, result.getTotalSuccessful());
        assertEquals(0, result.getTotalFailed());
        assertEquals("Snapshot-synkronisering slutförd", result.getMessage());

        verify(syncCheckpointService).createOrUpdateCheckpoint(SyncCheckpoint.SyncType.SNAPSHOT);
        verify(jobListingRepository, times(2)).save(any(JobListing.class));
        verify(syncCheckpointService).markCheckpointAsCompleted(SyncCheckpoint.SyncType.SNAPSHOT);
    }

    @Test
    void performSnapshotSync_ShouldHandleEmptyJobList() {
        // Given
        when(syncCheckpointService.createOrUpdateCheckpoint(SyncCheckpoint.SyncType.SNAPSHOT))
            .thenReturn(testCheckpoint);
        when(arbetsformedlingenService.fetchAllJobs()).thenReturn(Collections.emptyList());
        doNothing().when(syncCheckpointService).markCheckpointAsCompleted(SyncCheckpoint.SyncType.SNAPSHOT);

        // When
        SnapshotIncrementalService.SnapshotResult result = snapshotIncrementalService.performSnapshotSync();

        // Then
        assertNotNull(result);
        assertTrue(result.isSuccess());
        assertEquals(0, result.getTotalProcessed());
        assertEquals(0, result.getTotalSuccessful());
        assertEquals(0, result.getTotalFailed());

        verify(syncCheckpointService).createOrUpdateCheckpoint(SyncCheckpoint.SyncType.SNAPSHOT);
        verify(jobListingRepository, never()).save(any(JobListing.class));
        verify(syncCheckpointService).markCheckpointAsCompleted(SyncCheckpoint.SyncType.SNAPSHOT);
    }

    @Test
    void performSnapshotSync_ShouldHandleJobProcessingError() {
        // Given
        List<JobListing> allJobs = Arrays.asList(testJob1, testJob2);
        
        when(syncCheckpointService.createOrUpdateCheckpoint(SyncCheckpoint.SyncType.SNAPSHOT))
            .thenReturn(testCheckpoint);
        when(arbetsformedlingenService.fetchAllJobs()).thenReturn(allJobs);
        when(jobListingRepository.findByExternalId(anyString())).thenReturn(Optional.empty());
        when(jobListingRepository.save(any(JobListing.class)))
            .thenReturn(testJob1)
            .thenThrow(new RuntimeException("Database error"));
        when(cursorPaginationService.hasMorePages(anyString(), anyInt(), anyInt())).thenReturn(false);
        doNothing().when(syncCheckpointService).markCheckpointAsCompleted(SyncCheckpoint.SyncType.SNAPSHOT);

        // When
        SnapshotIncrementalService.SnapshotResult result = snapshotIncrementalService.performSnapshotSync();

        // Then
        assertNotNull(result);
        assertTrue(result.isSuccess());
        assertEquals(2, result.getTotalProcessed());
        assertEquals(1, result.getTotalSuccessful());
        assertEquals(1, result.getTotalFailed());

        verify(deadLetterQueueService).addFailedJobWithStackTrace(
            eq("ext-2"), 
            eq("Data Scientist"), 
            eq("Database error"), 
            eq("JobProcessingError"), 
            eq(DeadLetterQueue.SyncType.JOBS), 
            anyString()
        );
    }

    @Test
    void performSnapshotSync_ShouldHandleServiceException() {
        // Given
        when(syncCheckpointService.createOrUpdateCheckpoint(SyncCheckpoint.SyncType.SNAPSHOT))
            .thenReturn(testCheckpoint);
        when(arbetsformedlingenService.fetchAllJobs()).thenThrow(new RuntimeException("API error"));
        doNothing().when(syncCheckpointService).markCheckpointAsFailed(eq(SyncCheckpoint.SyncType.SNAPSHOT), anyString());

        // When
        SnapshotIncrementalService.SnapshotResult result = snapshotIncrementalService.performSnapshotSync();

        // Then
        assertNotNull(result);
        assertFalse(result.isSuccess());
        assertEquals(0, result.getTotalProcessed());
        assertEquals(0, result.getTotalSuccessful());
        assertEquals(0, result.getTotalFailed());
        assertTrue(result.getMessage().contains("Fel: API error"));

        verify(syncCheckpointService).markCheckpointAsFailed(SyncCheckpoint.SyncType.SNAPSHOT, "API error");
        verify(deadLetterQueueService).addFailedJobWithStackTrace(
            eq("snapshot-sync"), 
            eq("Snapshot-synkronisering"), 
            eq("API error"), 
            eq("SnapshotSyncError"), 
            eq(DeadLetterQueue.SyncType.SNAPSHOT), 
            anyString()
        );
    }

    @Test
    void performIncrementalSync_ShouldCompleteSuccessfully() {
        // Given
        LocalDateTime lastSyncTime = LocalDateTime.now().minusDays(1);
        List<JobListing> updatedJobs = Arrays.asList(testJob1, testJob2);
        
        when(syncCheckpointService.getLastSyncTime(SyncCheckpoint.SyncType.INCREMENTAL))
            .thenReturn(Optional.of(lastSyncTime));
        when(syncCheckpointService.createOrUpdateCheckpoint(SyncCheckpoint.SyncType.INCREMENTAL))
            .thenReturn(testCheckpoint);
        when(arbetsformedlingenService.fetchJobsBatch(anyInt())).thenReturn(updatedJobs);
        when(jobListingRepository.findByExternalId(anyString())).thenReturn(Optional.empty());
        when(jobListingRepository.save(any(JobListing.class))).thenReturn(testJob1);
        doNothing().when(syncCheckpointService).markCheckpointAsCompleted(SyncCheckpoint.SyncType.INCREMENTAL);

        // When
        SnapshotIncrementalService.IncrementalResult result = snapshotIncrementalService.performIncrementalSync();

        // Then
        assertNotNull(result);
        assertTrue(result.isSuccess());
        assertEquals(2, result.getTotalProcessed());
        assertEquals(2, result.getTotalSuccessful());
        assertEquals(0, result.getTotalFailed());
        assertEquals("Inkrementell synkronisering slutförd", result.getMessage());

        verify(syncCheckpointService).getLastSyncTime(SyncCheckpoint.SyncType.INCREMENTAL);
        verify(arbetsformedlingenService).fetchJobsBatch(anyInt());
        verify(jobListingRepository, times(2)).save(any(JobListing.class));
        verify(syncCheckpointService).markCheckpointAsCompleted(SyncCheckpoint.SyncType.INCREMENTAL);
    }

    @Test
    void performIncrementalSync_ShouldFallbackToSnapshotWhenNoLastSync() {
        // Given
        when(syncCheckpointService.getLastSyncTime(SyncCheckpoint.SyncType.INCREMENTAL))
            .thenReturn(Optional.empty());
        when(syncCheckpointService.createOrUpdateCheckpoint(SyncCheckpoint.SyncType.SNAPSHOT))
            .thenReturn(testCheckpoint);
        when(arbetsformedlingenService.fetchAllJobs()).thenReturn(Collections.emptyList());
        doNothing().when(syncCheckpointService).markCheckpointAsCompleted(SyncCheckpoint.SyncType.SNAPSHOT);

        // When
        SnapshotIncrementalService.IncrementalResult result = snapshotIncrementalService.performIncrementalSync();

        // Then
        assertNotNull(result);
        assertTrue(result.isSuccess());
        assertEquals(0, result.getTotalProcessed());
        assertEquals(0, result.getTotalSuccessful());
        assertEquals(0, result.getTotalFailed());
        assertEquals("Inkrementell synkronisering slutförd via snapshot", result.getMessage());

        verify(syncCheckpointService).getLastSyncTime(SyncCheckpoint.SyncType.INCREMENTAL);
        verify(syncCheckpointService).createOrUpdateCheckpoint(SyncCheckpoint.SyncType.SNAPSHOT);
    }

    @Test
    void performIncrementalSync_ShouldHandleNoUpdates() {
        // Given
        LocalDateTime lastSyncTime = LocalDateTime.now().minusDays(1);
        
        when(syncCheckpointService.getLastSyncTime(SyncCheckpoint.SyncType.INCREMENTAL))
            .thenReturn(Optional.of(lastSyncTime));
        when(syncCheckpointService.createOrUpdateCheckpoint(SyncCheckpoint.SyncType.INCREMENTAL))
            .thenReturn(testCheckpoint);
        when(arbetsformedlingenService.fetchJobsBatch(anyInt())).thenReturn(Collections.emptyList());
        doNothing().when(syncCheckpointService).markCheckpointAsCompleted(SyncCheckpoint.SyncType.INCREMENTAL);

        // When
        SnapshotIncrementalService.IncrementalResult result = snapshotIncrementalService.performIncrementalSync();

        // Then
        assertNotNull(result);
        assertTrue(result.isSuccess());
        assertEquals(0, result.getTotalProcessed());
        assertEquals(0, result.getTotalSuccessful());
        assertEquals(0, result.getTotalFailed());
        assertEquals("Inga uppdateringar hittades", result.getMessage());

        verify(arbetsformedlingenService).fetchJobsBatch(anyInt());
        verify(jobListingRepository, never()).save(any(JobListing.class));
        verify(syncCheckpointService).markCheckpointAsCompleted(SyncCheckpoint.SyncType.INCREMENTAL);
    }

    @Test
    void performIncrementalSync_ShouldHandleServiceException() {
        // Given
        LocalDateTime lastSyncTime = LocalDateTime.now().minusDays(1);
        
        when(syncCheckpointService.getLastSyncTime(SyncCheckpoint.SyncType.INCREMENTAL))
            .thenReturn(Optional.of(lastSyncTime));
        when(syncCheckpointService.createOrUpdateCheckpoint(SyncCheckpoint.SyncType.INCREMENTAL))
            .thenReturn(testCheckpoint);
        when(arbetsformedlingenService.fetchJobsBatch(anyInt())).thenThrow(new RuntimeException("API error"));
        doNothing().when(syncCheckpointService).markCheckpointAsFailed(eq(SyncCheckpoint.SyncType.INCREMENTAL), anyString());

        // When
        SnapshotIncrementalService.IncrementalResult result = snapshotIncrementalService.performIncrementalSync();

        // Then
        assertNotNull(result);
        assertFalse(result.isSuccess());
        assertEquals(0, result.getTotalProcessed());
        assertEquals(0, result.getTotalSuccessful());
        assertEquals(0, result.getTotalFailed());
        assertTrue(result.getMessage().contains("Fel: API error"));

        verify(syncCheckpointService).markCheckpointAsFailed(SyncCheckpoint.SyncType.INCREMENTAL, "API error");
        verify(deadLetterQueueService).addFailedJobWithStackTrace(
            eq("incremental-sync"), 
            eq("Inkrementell synkronisering"), 
            eq("API error"), 
            eq("IncrementalSyncError"), 
            eq(DeadLetterQueue.SyncType.INCREMENTAL), 
            anyString()
        );
    }

    @Test
    void scheduledSnapshotSync_ShouldCallPerformSnapshotSync() {
        // When
        snapshotIncrementalService.scheduledSnapshotSync();

        // Then
        // This method is just a wrapper, so we verify it doesn't throw any exceptions
        // The actual logic is tested in performSnapshotSync_ShouldCompleteSuccessfully
    }

    @Test
    void scheduledIncrementalSync_ShouldCallPerformIncrementalSync() {
        // When
        snapshotIncrementalService.scheduledIncrementalSync();

        // Then
        // This method is just a wrapper, so we verify it doesn't throw any exceptions
        // The actual logic is tested in performIncrementalSync_ShouldCompleteSuccessfully
    }

    @Test
    void performSnapshotSync_ShouldUpdateExistingJobs() {
        // Given
        JobListing existingJob = new JobListing();
        existingJob.setId(1L);
        existingJob.setTitle("Old Title");
        existingJob.setExternalId("ext-1");
        existingJob.setPublishedAt(LocalDateTime.now().minusDays(5));
        existingJob.setUpdatedAt(LocalDateTime.now().minusDays(5));

        JobListing updatedJob = new JobListing();
        updatedJob.setTitle("New Title");
        updatedJob.setDescription("New Description");
        updatedJob.setPublishedAt(LocalDateTime.now().minusDays(1));

        List<JobListing> allJobs = Arrays.asList(updatedJob);
        
        when(syncCheckpointService.createOrUpdateCheckpoint(SyncCheckpoint.SyncType.SNAPSHOT))
            .thenReturn(testCheckpoint);
        when(arbetsformedlingenService.fetchAllJobs()).thenReturn(allJobs);
        when(jobListingRepository.findByExternalId("ext-1")).thenReturn(Optional.of(existingJob));
        when(jobListingRepository.save(any(JobListing.class))).thenReturn(existingJob);
        when(cursorPaginationService.hasMorePages(anyString(), anyInt(), anyInt())).thenReturn(false);
        doNothing().when(syncCheckpointService).markCheckpointAsCompleted(SyncCheckpoint.SyncType.SNAPSHOT);

        // When
        SnapshotIncrementalService.SnapshotResult result = snapshotIncrementalService.performSnapshotSync();

        // Then
        assertNotNull(result);
        assertTrue(result.isSuccess());
        assertEquals(1, result.getTotalProcessed());
        assertEquals(1, result.getTotalSuccessful());
        assertEquals(0, result.getTotalFailed());

        verify(jobListingRepository).save(existingJob);
        assertNotNull(existingJob.getUpdatedAt());
    }

    @Test
    void performSnapshotSync_ShouldHandleJobsWithoutExternalId() {
        // Given
        JobListing jobWithoutExternalId = new JobListing();
        jobWithoutExternalId.setId(1L);
        jobWithoutExternalId.setTitle("Job without external ID");
        jobWithoutExternalId.setExternalId(null);

        List<JobListing> allJobs = Arrays.asList(jobWithoutExternalId);
        
        when(syncCheckpointService.createOrUpdateCheckpoint(SyncCheckpoint.SyncType.SNAPSHOT))
            .thenReturn(testCheckpoint);
        when(arbetsformedlingenService.fetchAllJobs()).thenReturn(allJobs);
        when(jobListingRepository.save(any(JobListing.class))).thenReturn(jobWithoutExternalId);
        when(cursorPaginationService.hasMorePages(anyString(), anyInt(), anyInt())).thenReturn(false);
        doNothing().when(syncCheckpointService).markCheckpointAsCompleted(SyncCheckpoint.SyncType.SNAPSHOT);

        // When
        SnapshotIncrementalService.SnapshotResult result = snapshotIncrementalService.performSnapshotSync();

        // Then
        assertNotNull(result);
        assertTrue(result.isSuccess());
        assertEquals(1, result.getTotalProcessed());
        assertEquals(1, result.getTotalSuccessful());
        assertEquals(0, result.getTotalFailed());

        verify(jobListingRepository).save(jobWithoutExternalId);
    }

    @Test
    void performSnapshotSync_ShouldHandlePaginationWithMultiplePages() {
        // Given
        List<JobListing> firstPageJobs = Arrays.asList(testJob1);
        List<JobListing> secondPageJobs = Arrays.asList(testJob2);
        
        when(syncCheckpointService.createOrUpdateCheckpoint(SyncCheckpoint.SyncType.SNAPSHOT))
            .thenReturn(testCheckpoint);
        when(arbetsformedlingenService.fetchAllJobs()).thenReturn(firstPageJobs, secondPageJobs);
        when(jobListingRepository.findByExternalId(anyString())).thenReturn(Optional.empty());
        when(jobListingRepository.save(any(JobListing.class))).thenReturn(testJob1, testJob2);
        when(cursorPaginationService.hasMorePages(anyString(), anyInt(), anyInt()))
            .thenReturn(true, false);
        doNothing().when(syncCheckpointService).markCheckpointAsCompleted(SyncCheckpoint.SyncType.SNAPSHOT);

        // When
        SnapshotIncrementalService.SnapshotResult result = snapshotIncrementalService.performSnapshotSync();

        // Then
        assertNotNull(result);
        assertTrue(result.isSuccess());
        assertEquals(2, result.getTotalProcessed());
        assertEquals(2, result.getTotalSuccessful());
        assertEquals(0, result.getTotalFailed());

        verify(jobListingRepository, times(2)).save(any(JobListing.class));
        verify(cursorPaginationService, times(2)).hasMorePages(anyString(), anyInt(), anyInt());
    }
}
