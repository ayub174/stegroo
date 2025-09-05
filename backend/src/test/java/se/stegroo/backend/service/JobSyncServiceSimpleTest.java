package se.stegroo.backend.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import se.stegroo.backend.model.JobListing;
import se.stegroo.backend.repository.JobListingRepository;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class JobSyncServiceSimpleTest {

    @Mock
    private JobListingRepository jobListingRepository;

    @Mock
    private ArbetsformedlingenService arbetsformedlingenService;

    private JobSyncService jobSyncService;

    @BeforeEach
    void setUp() {
        // Mock repository behavior
        when(jobListingRepository.findByExternalId(any())).thenReturn(Optional.empty());
        when(jobListingRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        // Mock ArbetsformedlingenService
        when(arbetsformedlingenService.fetchAllJobs()).thenReturn(createTestJobs());

        jobSyncService = new JobSyncService(arbetsformedlingenService, jobListingRepository);
    }

    @Test
    void syncJobsManually_ShouldReturnSuccessResult() {
        // When
        JobSyncService.JobSyncResult result = jobSyncService.syncJobsManually();

        // Then
        assertNotNull(result);
        assertEquals(1, result.getNewJobsCount());
        assertEquals(0, result.getUpdatedJobsCount());
        assertTrue(result.getMessage().contains("Synkronisering slutförd"));
        assertNotNull(result.getTimestamp());
    }

    @Test
    void testJobSyncService_CanBeCreated() {
        // Verifierar bara att JobSyncService kan skapas utan fel
        assertNotNull(jobSyncService);
    }

    private java.util.List<JobListing> createTestJobs() {
        // Skapa en test-jobb
        JobListing testJob = new JobListing();
        testJob.setTitle("Test Job");
        testJob.setDescription("Test Description");
        testJob.setExternalId("test-123");
        testJob.setSource("test");
        return java.util.List.of(testJob);
    }
}
