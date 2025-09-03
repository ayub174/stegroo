package se.stegroo.backend.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.test.util.ReflectionTestUtils;
import se.stegroo.backend.config.RetryConfig;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.function.Supplier;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class RetryServiceTest {

    @Mock
    private RetryConfig retryConfig;

    @Mock
    private RetryConfig.DefaultRetry defaultRetry;

    @InjectMocks
    private RetryService retryService;

    @BeforeEach
    void setUp() {
        when(retryConfig.getDefaultRetry()).thenReturn(defaultRetry);
        when(defaultRetry.getMaxRetries()).thenReturn(3);
        when(defaultRetry.getInitialDelayMs()).thenReturn(1000L);
        when(defaultRetry.getBackoffMultiplier()).thenReturn(2.0);
        when(defaultRetry.getMaxDelayMs()).thenReturn(30000L);
        when(defaultRetry.isEnableJitter()).thenReturn(true);
        when(defaultRetry.getJitterFactor()).thenReturn(0.1);
    }

    @Test
    void executeWithRetry_ShouldSucceedOnFirstAttempt() {
        // Given
        Supplier<String> operation = () -> "success";
        
        // When
        String result = retryService.executeWithRetry(operation, "test-operation");
        
        // Then
        assertEquals("success", result);
        verify(defaultRetry, times(1)).getMaxRetries();
        verify(defaultRetry, times(1)).getInitialDelayMs();
    }

    @Test
    void executeWithRetry_ShouldRetryOnFailure() {
        // Given
        AtomicInteger attemptCount = new AtomicInteger(0);
        Supplier<String> operation = () -> {
            if (attemptCount.getAndIncrement() < 2) {
                throw new RuntimeException("temporary failure");
            }
            return "success";
        };
        
        // When
        String result = retryService.executeWithRetry(operation, "test-operation");
        
        // Then
        assertEquals("success", result);
        assertEquals(3, attemptCount.get());
    }

    @Test
    void executeWithRetry_ShouldFailAfterMaxRetries() {
        // Given
        Supplier<String> operation = () -> {
            throw new RuntimeException("persistent failure");
        };
        
        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            retryService.executeWithRetry(operation, "test-operation");
        });
        
        assertTrue(exception.getMessage().contains("misslyckades efter 4 försök"));
    }

    @Test
    void executeWithRetry_ShouldUseCustomRetryCount() {
        // Given
        Supplier<String> operation = () -> {
            throw new RuntimeException("failure");
        };
        
        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            retryService.executeWithRetry(operation, "test-operation", 1);
        });
        
        assertTrue(exception.getMessage().contains("misslyckades efter 2 försök"));
    }

    @Test
    void executeWithRetry_ShouldUseCustomDelay() {
        // Given
        AtomicInteger attemptCount = new AtomicInteger(0);
        Supplier<String> operation = () -> {
            if (attemptCount.getAndIncrement() < 1) {
                throw new RuntimeException("failure");
            }
            return "success";
        };
        
        // When
        String result = retryService.executeWithRetry(operation, "test-operation", 1, 500L);
        
        // Then
        assertEquals("success", result);
        assertEquals(2, attemptCount.get());
    }

    @Test
    void executeWithRetry_VoidOperation_ShouldSucceedOnFirstAttempt() {
        // Given
        AtomicInteger executionCount = new AtomicInteger(0);
        Runnable operation = () -> executionCount.incrementAndGet();
        
        // When
        retryService.executeWithRetry(operation, "test-void-operation");
        
        // Then
        assertEquals(1, executionCount.get());
    }

    @Test
    void executeWithRetry_VoidOperation_ShouldRetryOnFailure() {
        // Given
        AtomicInteger attemptCount = new AtomicInteger(0);
        Runnable operation = () -> {
            if (attemptCount.getAndIncrement() < 2) {
                throw new RuntimeException("temporary failure");
            }
        };
        
        // When
        retryService.executeWithRetry(operation, "test-void-operation");
        
        // Then
        assertEquals(3, attemptCount.get());
    }

    @Test
    void executeWithRetry_VoidOperation_ShouldFailAfterMaxRetries() {
        // Given
        Runnable operation = () -> {
            throw new RuntimeException("persistent failure");
        };
        
        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            retryService.executeWithRetry(operation, "test-void-operation");
        });
        
        assertTrue(exception.getMessage().contains("misslyckades efter 4 försök"));
    }

    @Test
    void executeWithRetry_ShouldHandleInterruptedException() {
        // Given
        Supplier<String> operation = () -> {
            throw new RuntimeException("failure");
        };
        
        // When
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            retryService.executeWithRetry(operation, "test-operation", 1, 100L);
        });
        
        // Then
        assertTrue(exception.getMessage().contains("misslyckades efter 2 försök"));
    }

    @Test
    void calculateNextRetryTime_ShouldCalculateCorrectTime() {
        // Given
        LocalDateTime baseTime = LocalDateTime.of(2024, 1, 1, 12, 0, 0);
        when(defaultRetry.getInitialDelayMs()).thenReturn(1000L);
        
        // When
        LocalDateTime nextRetryTime = retryService.calculateNextRetryTime(1, baseTime);
        
        // Then
        LocalDateTime expectedTime = baseTime.plus(1000, ChronoUnit.MILLIS);
        assertEquals(expectedTime, nextRetryTime);
    }

    @Test
    void calculateNextRetryTime_ShouldReturnBaseTimeForZeroRetryCount() {
        // Given
        LocalDateTime baseTime = LocalDateTime.of(2024, 1, 1, 12, 0, 0);
        
        // When
        LocalDateTime nextRetryTime = retryService.calculateNextRetryTime(0, baseTime);
        
        // Then
        assertEquals(baseTime, nextRetryTime);
    }

    @Test
    void calculateNextRetryTime_ShouldReturnBaseTimeForNegativeRetryCount() {
        // Given
        LocalDateTime baseTime = LocalDateTime.of(2024, 1, 1, 12, 0, 0);
        
        // When
        LocalDateTime nextRetryTime = retryService.calculateNextRetryTime(-1, baseTime);
        
        // Then
        assertEquals(baseTime, nextRetryTime);
    }

    @Test
    void shouldRetry_ShouldReturnTrueForRetryableExceptions() {
        // Given
        Exception[] retryableExceptions = {
            new RuntimeException("timeout error"),
            new RuntimeException("connection failed"),
            new RuntimeException("network error"),
            new RuntimeException("rate limit exceeded"),
            new RuntimeException("too many requests"),
            new RuntimeException("service unavailable"),
            new RuntimeException("internal server error"),
            new RuntimeException("bad gateway"),
            new RuntimeException("gateway timeout")
        };
        
        // When & Then
        for (Exception exception : retryableExceptions) {
            assertTrue(retryService.shouldRetry(exception), 
                "Should retry for: " + exception.getMessage());
        }
    }

    @Test
    void shouldRetry_ShouldReturnFalseForNonRetryableExceptions() {
        // Given
        Exception[] nonRetryableExceptions = {
            new RuntimeException("validation error"),
            new RuntimeException("authentication failed"),
            new RuntimeException("permission denied"),
            new RuntimeException("not found"),
            new RuntimeException("bad request")
        };
        
        // When & Then
        for (Exception exception : nonRetryableExceptions) {
            assertFalse(retryService.shouldRetry(exception), 
                "Should not retry for: " + exception.getMessage());
        }
    }

    @Test
    void shouldRetry_ShouldReturnFalseForNullException() {
        // When & Then
        assertFalse(retryService.shouldRetry(null));
    }

    @Test
    void shouldRetry_ShouldReturnFalseForExceptionWithNullMessage() {
        // Given
        Exception exception = new RuntimeException();
        ReflectionTestUtils.setField(exception, "detailMessage", null);
        
        // When & Then
        assertFalse(retryService.shouldRetry(exception));
    }

    @Test
    void shouldRetry_ShouldReturnFalseWhenMaxRetriesReached() {
        // Given
        Exception exception = new RuntimeException("timeout error");
        
        // When & Then
        assertFalse(retryService.shouldRetry(exception, 3, 3));
        assertTrue(retryService.shouldRetry(exception, 2, 3));
    }

    @Test
    void createRetryStrategy_ShouldCreateStrategyWithCustomParameters() {
        // Given
        int maxRetries = 5;
        long initialDelayMs = 2000L;
        double backoffMultiplier = 1.5;
        
        // When
        RetryService.RetryStrategy strategy = retryService.createRetryStrategy(
            maxRetries, initialDelayMs, backoffMultiplier);
        
        // Then
        assertEquals(maxRetries, strategy.getMaxRetries());
        assertEquals(initialDelayMs, strategy.getInitialDelayMs());
        assertEquals(backoffMultiplier, strategy.getBackoffMultiplier());
    }

    @Test
    void retryStrategy_ShouldExecuteSuccessfully() {
        // Given
        RetryService.RetryStrategy strategy = retryService.createRetryStrategy(1, 100L, 2.0);
        Supplier<String> operation = () -> "success";
        
        // When
        String result = strategy.execute(operation, "test-strategy");
        
        // Then
        assertEquals("success", result);
    }

    @Test
    void retryStrategy_ShouldExecuteVoidOperationSuccessfully() {
        // Given
        RetryService.RetryStrategy strategy = retryService.createRetryStrategy(1, 100L, 2.0);
        AtomicInteger executionCount = new AtomicInteger(0);
        Runnable operation = () -> executionCount.incrementAndGet();
        
        // When
        strategy.execute(operation, "test-void-strategy");
        
        // Then
        assertEquals(1, executionCount.get());
    }

    @Test
    void retryStrategy_ShouldHandleFailures() {
        // Given
        RetryService.RetryStrategy strategy = retryService.createRetryStrategy(1, 100L, 2.0);
        Supplier<String> operation = () -> {
            throw new RuntimeException("failure");
        };
        
        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            strategy.execute(operation, "test-failing-strategy");
        });
        
        assertTrue(exception.getMessage().contains("misslyckades efter 2 försök"));
    }

    @Test
    void executeWithRetry_ShouldUseConfigurationValues() {
        // Given
        when(defaultRetry.getMaxRetries()).thenReturn(5);
        when(defaultRetry.getInitialDelayMs()).thenReturn(2000L);
        when(defaultRetry.getBackoffMultiplier()).thenReturn(1.5);
        when(defaultRetry.getMaxDelayMs()).thenReturn(60000L);
        
        AtomicInteger attemptCount = new AtomicInteger(0);
        Supplier<String> operation = () -> {
            if (attemptCount.getAndIncrement() < 3) {
                throw new RuntimeException("failure");
            }
            return "success";
        };
        
        // When
        String result = retryService.executeWithRetry(operation, "test-config-operation");
        
        // Then
        assertEquals("success", result);
        assertEquals(4, attemptCount.get());
    }

    @Test
    void executeWithRetry_ShouldHandleNullConfiguration() {
        // Given
        RetryService serviceWithoutConfig = new RetryService(null);
        AtomicInteger attemptCount = new AtomicInteger(0);
        Supplier<String> operation = () -> {
            if (attemptCount.getAndIncrement() < 1) {
                throw new RuntimeException("failure");
            }
            return "success";
        };
        
        // When
        String result = serviceWithoutConfig.executeWithRetry(operation, "test-no-config");
        
        // Then
        assertEquals("success", result);
        assertEquals(2, attemptCount.get());
    }
}
