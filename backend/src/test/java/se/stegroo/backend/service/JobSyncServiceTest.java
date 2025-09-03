package se.stegroo.backend.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import se.stegroo.backend.model.JobListing;
import se.stegroo.backend.repository.JobListingRepository;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.*;

/**
 * Tester för JobSyncService
 */
class JobSyncServiceTest {

    private ArbetsformedlingenService arbetsformedlingenService;
    private JobListingRepository jobListingRepository;

    private JobSyncService jobSyncService;

    @BeforeEach
    void setUp() {
        // Använd traditionella mocks istället för inline-mocks
        MockitoAnnotations.openMocks(this);
        arbetsformedlingenService = mock(ArbetsformedlingenService.class);
        jobListingRepository = mock(JobListingRepository.class);
        jobSyncService = new JobSyncService(arbetsformedlingenService, jobListingRepository);
    }

    @Test
    void syncJobsManually_ShouldReturnSuccessResult() {
        // Given
        JobListing job1 = new JobListing();
        job1.setId(1L);
        job1.setTitle("Test Job 1");
        job1.setExternalId("ext1");

        JobListing job2 = new JobListing();
        job2.setId(2L);
        job2.setTitle("Test Job 2");
        job2.setExternalId("ext2");

        List<JobListing> jobs = Arrays.asList(job1, job2);

        when(arbetsformedlingenService.fetchAllJobs()).thenReturn(jobs);
        when(jobListingRepository.findByExternalId("ext1")).thenReturn(Optional.empty());
        when(jobListingRepository.findByExternalId("ext2")).thenReturn(Optional.empty());
        when(jobListingRepository.save(any(JobListing.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // When
        JobSyncService.JobSyncResult result = jobSyncService.syncJobsManually();

        // Then
        assertNotNull(result);
        assertEquals(2, result.getNewJobsCount());
        assertEquals(0, result.getUpdatedJobsCount());
        assertTrue(result.getMessage().contains("Synkronisering slutförd"));
        assertNotNull(result.getTimestamp());

        verify(arbetsformedlingenService).fetchAllJobs();
        verify(jobListingRepository, times(2)).save(any(JobListing.class));
    }

    @Test
    void syncJobsManually_ShouldHandleEmptyJobList() {
        // Given
        when(arbetsformedlingenService.fetchAllJobs()).thenReturn(List.of());

        // When
        JobSyncService.JobSyncResult result = jobSyncService.syncJobsManually();

        // Then
        assertNotNull(result);
        assertEquals(0, result.getNewJobsCount());
        assertEquals(0, result.getUpdatedJobsCount());
        assertEquals("Inga jobb hittades", result.getMessage());

        verify(arbetsformedlingenService).fetchAllJobs();
        verify(jobListingRepository, never()).save(any(JobListing.class));
    }

    @Test
    void syncJobsManually_ShouldUpdateExistingJobs() {
        // Given
        JobListing newJob = new JobListing();
        newJob.setId(1L);
        newJob.setTitle("Updated Job");
        newJob.setExternalId("ext1");
        newJob.setPublishedAt(LocalDateTime.now());

        JobListing existingJob = new JobListing();
        existingJob.setId(1L);
        existingJob.setTitle("Old Job");
        existingJob.setExternalId("ext1");
        existingJob.setPublishedAt(LocalDateTime.now().minusDays(1));

        List<JobListing> jobs = Arrays.asList(newJob);

        when(arbetsformedlingenService.fetchAllJobs()).thenReturn(jobs);
        when(jobListingRepository.findByExternalId("ext1")).thenReturn(Optional.of(existingJob));
        when(jobListingRepository.save(any(JobListing.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // When
        JobSyncService.JobSyncResult result = jobSyncService.syncJobsManually();

        // Then
        assertNotNull(result);
        assertEquals(0, result.getNewJobsCount());
        assertEquals(1, result.getUpdatedJobsCount());

        verify(arbetsformedlingenService).fetchAllJobs();
        verify(jobListingRepository).save(existingJob);
        assertEquals("Updated Job", existingJob.getTitle());
    }

    @Test
    void syncJobsDaily_ShouldUseIncrementalUpdateWhenLastSyncExists() throws Exception {
        // Given
        JobListing job = new JobListing();
        job.setId(1L);
        job.setTitle("Test Job");
        job.setExternalId("ext1");

        List<JobListing> jobs = Arrays.asList(job);

        // Använd reflektion för att sätta getLastSyncTime-metoden
        LocalDateTime lastSync = LocalDateTime.now().minusDays(1);
        
        // Sätt lastSync via reflektion
        java.lang.reflect.Method getLastSyncMethod = JobSyncService.class.getDeclaredMethod("getLastSyncTime");
        getLastSyncMethod.setAccessible(true);
        
        // Skapa en subklass som överskrider den privata metoden
        JobSyncService testService = new JobSyncService(arbetsformedlingenService, jobListingRepository) {
            @Override
            protected LocalDateTime getLastSyncTime() {
                return lastSync;
            }
            
            @Override
            protected void updateLastSyncTime(LocalDateTime time) {
                // Gör ingenting i testet
            }
        };

        when(arbetsformedlingenService.fetchJobsBatch(anyInt())).thenReturn(jobs);
        when(jobListingRepository.findByExternalId("ext1")).thenReturn(Optional.empty());
        when(jobListingRepository.save(any(JobListing.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // When
        testService.syncJobsDaily();

        // Then
        verify(arbetsformedlingenService).fetchJobsBatch(anyInt());
        verify(arbetsformedlingenService, never()).fetchAllJobs();
        verify(jobListingRepository).save(any(JobListing.class));
    }

    @Test
    void syncJobsDaily_ShouldUseFetchAllWhenNoLastSync() throws Exception {
        // Given
        JobListing job = new JobListing();
        job.setId(1L);
        job.setTitle("Test Job");
        job.setExternalId("ext1");

        List<JobListing> jobs = Arrays.asList(job);

        // Skapa en subklass som överskrider den privata metoden
        JobSyncService testService = new JobSyncService(arbetsformedlingenService, jobListingRepository) {
            @Override
            protected LocalDateTime getLastSyncTime() {
                return null; // Returnera null för att simulera ingen tidigare synkronisering
            }
            
            @Override
            protected void updateLastSyncTime(LocalDateTime time) {
                // Gör ingenting i testet
            }
        };

        when(arbetsformedlingenService.fetchAllJobs()).thenReturn(jobs);
        when(jobListingRepository.findByExternalId("ext1")).thenReturn(Optional.empty());
        when(jobListingRepository.save(any(JobListing.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // When
        testService.syncJobsDaily();

        // Then
        verify(arbetsformedlingenService, never()).fetchJobsBatch(anyInt());
        verify(arbetsformedlingenService).fetchAllJobs();
        verify(jobListingRepository).save(any(JobListing.class));
    }
}