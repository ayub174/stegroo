package se.stegroo.backend.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import se.stegroo.backend.model.SyncCheckpoint;
import se.stegroo.backend.repository.SyncCheckpointRepository;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SyncCheckpointServiceTest {

    @Mock
    private SyncCheckpointRepository syncCheckpointRepository;

    @Mock
    private RetryService retryService;

    @InjectMocks
    private SyncCheckpointService syncCheckpointService;

    private SyncCheckpoint activeCheckpoint;
    private SyncCheckpoint failedCheckpoint;
    private SyncCheckpoint retryPendingCheckpoint;

    @BeforeEach
    void setUp() {
        activeCheckpoint = new SyncCheckpoint();
        activeCheckpoint.setId(1L);
        activeCheckpoint.setSyncType(SyncCheckpoint.SyncType.JOBS);
        activeCheckpoint.setStatus(SyncCheckpoint.Status.ACTIVE);
        activeCheckpoint.setLastSyncAt(LocalDateTime.now().minusHours(1));
        activeCheckpoint.setRetryCount(0);

        failedCheckpoint = new SyncCheckpoint();
        failedCheckpoint.setId(2L);
        failedCheckpoint.setSyncType(SyncCheckpoint.SyncType.SKILLS);
        failedCheckpoint.setStatus(SyncCheckpoint.Status.FAILED);
        failedCheckpoint.setLastSyncAt(LocalDateTime.now().minusHours(2));
        failedCheckpoint.setRetryCount(3);
        failedCheckpoint.setLastErrorMessage("API error");

        retryPendingCheckpoint = new SyncCheckpoint();
        retryPendingCheckpoint.setId(3L);
        retryPendingCheckpoint.setSyncType(SyncCheckpoint.SyncType.CATEGORIES);
        retryPendingCheckpoint.setStatus(SyncCheckpoint.Status.RETRY_PENDING);
        retryPendingCheckpoint.setLastSyncAt(LocalDateTime.now().minusHours(3));
        retryPendingCheckpoint.setRetryCount(1);
        retryPendingCheckpoint.setNextRetryAt(LocalDateTime.now().plusMinutes(30));
    }

    @Test
    void createOrUpdateCheckpoint_ShouldCreateNewCheckpointWhenNoneExists() {
        // Given
        SyncCheckpoint.SyncType syncType = SyncCheckpoint.SyncType.JOBS;
        when(syncCheckpointRepository.findBySyncType(syncType)).thenReturn(Optional.empty());
        when(syncCheckpointRepository.save(any(SyncCheckpoint.class))).thenReturn(activeCheckpoint);

        // When
        SyncCheckpoint result = syncCheckpointService.createOrUpdateCheckpoint(syncType);

        // Then
        assertNotNull(result);
        assertEquals(syncType, result.getSyncType());
        assertEquals(SyncCheckpoint.Status.ACTIVE, result.getStatus());
        assertNotNull(result.getLastSyncAt());
        assertEquals(0, result.getRetryCount());
        assertNull(result.getLastErrorMessage());

        verify(syncCheckpointRepository).findBySyncType(syncType);
        verify(syncCheckpointRepository).save(any(SyncCheckpoint.class));
    }

    @Test
    void createOrUpdateCheckpoint_ShouldUpdateExistingCheckpoint() {
        // Given
        SyncCheckpoint.SyncType syncType = SyncCheckpoint.SyncType.JOBS;
        when(syncCheckpointRepository.findBySyncType(syncType)).thenReturn(Optional.of(activeCheckpoint));
        when(syncCheckpointRepository.save(any(SyncCheckpoint.class))).thenReturn(activeCheckpoint);

        // When
        SyncCheckpoint result = syncCheckpointService.createOrUpdateCheckpoint(syncType);

        // Then
        assertNotNull(result);
        assertEquals(syncType, result.getSyncType());
        assertEquals(SyncCheckpoint.Status.ACTIVE, result.getStatus());
        assertNotNull(result.getLastSyncAt());
        assertEquals(0, result.getRetryCount());
        assertNull(result.getLastErrorMessage());

        verify(syncCheckpointRepository).findBySyncType(syncType);
        verify(syncCheckpointRepository).save(activeCheckpoint);
    }

    @Test
    void getCheckpoint_ShouldReturnCheckpointWhenExists() {
        // Given
        SyncCheckpoint.SyncType syncType = SyncCheckpoint.SyncType.JOBS;
        when(syncCheckpointRepository.findBySyncType(syncType)).thenReturn(Optional.of(activeCheckpoint));

        // When
        Optional<SyncCheckpoint> result = syncCheckpointService.getCheckpoint(syncType);

        // Then
        assertTrue(result.isPresent());
        assertEquals(activeCheckpoint, result.get());
        verify(syncCheckpointRepository).findBySyncType(syncType);
    }

    @Test
    void getCheckpoint_ShouldReturnEmptyWhenCheckpointDoesNotExist() {
        // Given
        SyncCheckpoint.SyncType syncType = SyncCheckpoint.SyncType.JOBS;
        when(syncCheckpointRepository.findBySyncType(syncType)).thenReturn(Optional.empty());

        // When
        Optional<SyncCheckpoint> result = syncCheckpointService.getCheckpoint(syncType);

        // Then
        assertFalse(result.isPresent());
        verify(syncCheckpointRepository).findBySyncType(syncType);
    }

    @Test
    void getAllCheckpoints_ShouldReturnAllCheckpoints() {
        // Given
        List<SyncCheckpoint> allCheckpoints = Arrays.asList(activeCheckpoint, failedCheckpoint, retryPendingCheckpoint);
        when(syncCheckpointRepository.findAll()).thenReturn(allCheckpoints);

        // When
        List<SyncCheckpoint> result = syncCheckpointService.getAllCheckpoints();

        // Then
        assertNotNull(result);
        assertEquals(3, result.size());
        verify(syncCheckpointRepository).findAll();
    }

    @Test
    void getAllCheckpoints_ShouldReturnEmptyListWhenNoCheckpoints() {
        // Given
        when(syncCheckpointRepository.findAll()).thenReturn(Collections.emptyList());

        // When
        List<SyncCheckpoint> result = syncCheckpointService.getAllCheckpoints();

        // Then
        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(syncCheckpointRepository).findAll();
    }

    @Test
    void getCheckpointsNeedingRetry_ShouldReturnCheckpointsReadyForRetry() {
        // Given
        LocalDateTime now = LocalDateTime.now();
        List<SyncCheckpoint> retryCheckpoints = Collections.singletonList(retryPendingCheckpoint);
        
        when(syncCheckpointRepository.findByStatusAndNextRetryAtBefore(
            eq(SyncCheckpoint.Status.RETRY_PENDING), any(LocalDateTime.class)))
            .thenReturn(retryCheckpoints);

        // When
        List<SyncCheckpoint> result = syncCheckpointService.getCheckpointsNeedingRetry();

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(retryPendingCheckpoint, result.get(0));
        verify(syncCheckpointRepository).findByStatusAndNextRetryAtBefore(
            eq(SyncCheckpoint.Status.RETRY_PENDING), any(LocalDateTime.class));
    }

    @Test
    void getExhaustedCheckpoints_ShouldReturnCheckpointsWithExhaustedRetries() {
        // Given
        List<SyncCheckpoint> exhaustedCheckpoints = Collections.singletonList(failedCheckpoint);
        when(syncCheckpointRepository.findExhaustedRetries()).thenReturn(exhaustedCheckpoints);

        // When
        List<SyncCheckpoint> result = syncCheckpointService.getExhaustedCheckpoints();

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(failedCheckpoint, result.get(0));
        verify(syncCheckpointRepository).findExhaustedRetries();
    }

    @Test
    void getStaleCheckpoints_ShouldReturnStaleCheckpoints() {
        // Given
        LocalDateTime cutoff = LocalDateTime.now().minusDays(7);
        List<SyncCheckpoint> staleCheckpoints = Arrays.asList(activeCheckpoint, failedCheckpoint);
        
        when(syncCheckpointRepository.findStaleCheckpoints(cutoff)).thenReturn(staleCheckpoints);

        // When
        List<SyncCheckpoint> result = syncCheckpointService.getStaleCheckpoints(cutoff);

        // Then
        assertNotNull(result);
        assertEquals(2, result.size());
        verify(syncCheckpointRepository).findStaleCheckpoints(cutoff);
    }

    @Test
    void markCheckpointAsFailed_ShouldUpdateCheckpointStatus() {
        // Given
        SyncCheckpoint.SyncType syncType = SyncCheckpoint.SyncType.JOBS;
        String errorMessage = "API connection failed";
        
        when(syncCheckpointRepository.findBySyncType(syncType)).thenReturn(Optional.of(activeCheckpoint));
        when(syncCheckpointRepository.save(any(SyncCheckpoint.class))).thenReturn(activeCheckpoint);

        // When
        syncCheckpointService.markCheckpointAsFailed(syncType, errorMessage);

        // Then
        assertEquals(SyncCheckpoint.Status.FAILED, activeCheckpoint.getStatus());
        assertEquals(errorMessage, activeCheckpoint.getLastErrorMessage());
        assertNotNull(activeCheckpoint.getNextRetryAt());
        assertEquals(1, activeCheckpoint.getRetryCount());

        verify(syncCheckpointRepository).findBySyncType(syncType);
        verify(syncCheckpointRepository).save(activeCheckpoint);
    }

    @Test
    void markCheckpointAsFailed_ShouldDoNothingWhenCheckpointDoesNotExist() {
        // Given
        SyncCheckpoint.SyncType syncType = SyncCheckpoint.SyncType.JOBS;
        String errorMessage = "API connection failed";
        
        when(syncCheckpointRepository.findBySyncType(syncType)).thenReturn(Optional.empty());

        // When
        syncCheckpointService.markCheckpointAsFailed(syncType, errorMessage);

        // Then
        verify(syncCheckpointRepository).findBySyncType(syncType);
        verify(syncCheckpointRepository, never()).save(any(SyncCheckpoint.class));
    }

    @Test
    void markCheckpointAsCompleted_ShouldUpdateCheckpointStatus() {
        // Given
        SyncCheckpoint.SyncType syncType = SyncCheckpoint.SyncType.JOBS;
        
        when(syncCheckpointRepository.findBySyncType(syncType)).thenReturn(Optional.of(failedCheckpoint));
        when(syncCheckpointRepository.save(any(SyncCheckpoint.class))).thenReturn(failedCheckpoint);

        // When
        syncCheckpointService.markCheckpointAsCompleted(syncType);

        // Then
        assertEquals(SyncCheckpoint.Status.COMPLETED, failedCheckpoint.getStatus());
        assertNull(failedCheckpoint.getLastErrorMessage());
        assertNull(failedCheckpoint.getNextRetryAt());
        assertEquals(0, failedCheckpoint.getRetryCount());
        assertNotNull(failedCheckpoint.getLastSyncAt());

        verify(syncCheckpointRepository).findBySyncType(syncType);
        verify(syncCheckpointRepository).save(failedCheckpoint);
    }

    @Test
    void markCheckpointAsCompleted_ShouldDoNothingWhenCheckpointDoesNotExist() {
        // Given
        SyncCheckpoint.SyncType syncType = SyncCheckpoint.SyncType.JOBS;
        
        when(syncCheckpointRepository.findBySyncType(syncType)).thenReturn(Optional.empty());

        // When
        syncCheckpointService.markCheckpointAsCompleted(syncType);

        // Then
        verify(syncCheckpointRepository).findBySyncType(syncType);
        verify(syncCheckpointRepository, never()).save(any(SyncCheckpoint.class));
    }

    @Test
    void scheduleRetry_ShouldScheduleRetryForCheckpoint() {
        // Given
        SyncCheckpoint.SyncType syncType = SyncCheckpoint.SyncType.JOBS;
        LocalDateTime nextRetryTime = LocalDateTime.now().plusMinutes(30);
        
        when(syncCheckpointRepository.findBySyncType(syncType)).thenReturn(Optional.of(failedCheckpoint));
        when(syncCheckpointRepository.save(any(SyncCheckpoint.class))).thenReturn(failedCheckpoint);
        when(retryService.calculateNextRetryTime(anyInt(), any(LocalDateTime.class))).thenReturn(nextRetryTime);

        // When
        syncCheckpointService.scheduleCheckpointRetry(syncType);

        // Then
        assertEquals(SyncCheckpoint.Status.RETRY_PENDING, failedCheckpoint.getStatus());
        assertEquals(nextRetryTime, failedCheckpoint.getNextRetryAt());
        assertEquals(2, failedCheckpoint.getRetryCount());

        verify(syncCheckpointRepository).findBySyncType(syncType);
        verify(syncCheckpointRepository).save(failedCheckpoint);
        verify(retryService).calculateNextRetryTime(anyInt(), any(LocalDateTime.class));
    }

    @Test
    void scheduleCheckpointRetry_ShouldDoNothingWhenCheckpointDoesNotExist() {
        // Given
        SyncCheckpoint.SyncType syncType = SyncCheckpoint.SyncType.JOBS;
        
        when(syncCheckpointRepository.findBySyncType(syncType)).thenReturn(Optional.empty());

        // When
        syncCheckpointService.scheduleCheckpointRetry(syncType);

        // Then
        verify(syncCheckpointRepository).findBySyncType(syncType);
        verify(syncCheckpointRepository, never()).save(any(SyncCheckpoint.class));
        verify(retryService, never()).calculateNextRetryTime(anyInt(), any(LocalDateTime.class));
    }

    @Test
    void scheduleRetry_ShouldMarkAsExhaustedWhenMaxRetriesReached() {
        // Given
        SyncCheckpoint.SyncType syncType = SyncCheckpoint.SyncType.JOBS;
        failedCheckpoint.setRetryCount(5); // Max retries reached
        
        when(syncCheckpointRepository.findBySyncType(syncType)).thenReturn(Optional.of(failedCheckpoint));
        when(syncCheckpointRepository.save(any(SyncCheckpoint.class))).thenReturn(failedCheckpoint);

        // When
        syncCheckpointService.scheduleCheckpointRetry(syncType);

        // Then
        assertEquals(SyncCheckpoint.Status.FAILED, failedCheckpoint.getStatus());
        assertEquals(5, failedCheckpoint.getRetryCount());

        verify(syncCheckpointRepository).findBySyncType(syncType);
        verify(syncCheckpointRepository).save(failedCheckpoint);
        verify(retryService, never()).calculateNextRetryTime(anyInt(), any(LocalDateTime.class));
    }








}
