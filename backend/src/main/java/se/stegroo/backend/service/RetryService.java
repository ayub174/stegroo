package se.stegroo.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import se.stegroo.backend.config.RetryConfig;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.function.Supplier;

/**
 * Service för att hantera retry-logik med exponential backoff.
 * Används för att hantera tillfälliga fel under synkronisering.
 */
@Service
public class RetryService {
    
    private static final Logger log = LoggerFactory.getLogger(RetryService.class);
    
    private final RetryConfig retryConfig;
    
    public RetryService(RetryConfig retryConfig) {
        this.retryConfig = retryConfig;
    }
    
    private static final int DEFAULT_MAX_RETRIES = 3;
    private static final long DEFAULT_INITIAL_DELAY_MS = 1000; // 1 sekund
    private static final double BACKOFF_MULTIPLIER = 2.0;
    private static final long MAX_DELAY_MS = 30000; // 30 sekunder
    
    /**
     * Hämtar standard max retry-värde från konfiguration
     */
    private int getDefaultMaxRetries() {
        return retryConfig != null ? retryConfig.getDefaultRetry().getMaxRetries() : DEFAULT_MAX_RETRIES;
    }
    
    /**
     * Hämtar standard initial fördröjning från konfiguration
     */
    private long getDefaultInitialDelayMs() {
        return retryConfig != null ? retryConfig.getDefaultRetry().getInitialDelayMs() : DEFAULT_INITIAL_DELAY_MS;
    }
    
    /**
     * Utför en operation med retry-logik
     */
    public <T> T executeWithRetry(Supplier<T> operation, String operationName) {
        return executeWithRetry(operation, operationName, getDefaultMaxRetries());
    }
    
    /**
     * Utför en operation med retry-logik och anpassat antal försök
     */
    public <T> T executeWithRetry(Supplier<T> operation, String operationName, int maxRetries) {
        return executeWithRetry(operation, operationName, maxRetries, getDefaultInitialDelayMs());
    }
    
    /**
     * Utför en operation med retry-logik och anpassad initial fördröjning
     */
    public <T> T executeWithRetry(Supplier<T> operation, String operationName, int maxRetries, long initialDelayMs) {
        AtomicInteger attemptCount = new AtomicInteger(0);
        Exception lastException = null;
        
        while (attemptCount.get() <= maxRetries) {
            try {
                if (attemptCount.get() > 0) {
                    log.info("Försök {} av {} för operation: {}", attemptCount.get(), maxRetries + 1, operationName);
                }
                
                T result = operation.get();
                log.debug("Operation '{}' lyckades på försök {}", operationName, attemptCount.get() + 1);
                return result;
                
            } catch (Exception e) {
                lastException = e;
                attemptCount.incrementAndGet();
                
                if (attemptCount.get() <= maxRetries) {
                    long delayMs = calculateDelay(attemptCount.get(), initialDelayMs);
                    log.warn("Operation '{}' misslyckades på försök {}: {}. Väntar {} ms innan nästa försök", 
                            operationName, attemptCount.get(), e.getMessage(), delayMs);
                    
                    try {
                        Thread.sleep(delayMs);
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                        throw new RuntimeException("Retry-operation avbröts", ie);
                    }
                } else {
                    log.error("Operation '{}' misslyckades efter {} försök", operationName, maxRetries + 1, e);
                }
            }
        }
        
        throw new RuntimeException("Operation '" + operationName + "' misslyckades efter " + (maxRetries + 1) + " försök", lastException);
    }
    
    /**
     * Utför en operation med retry-logik för void-operationer
     */
    public void executeWithRetry(Runnable operation, String operationName) {
        executeWithRetry(operation, operationName, getDefaultMaxRetries());
    }
    
    /**
     * Utför en operation med retry-logik för void-operationer och anpassat antal försök
     */
    public void executeWithRetry(Runnable operation, String operationName, int maxRetries) {
        executeWithRetry(operation, operationName, maxRetries, getDefaultInitialDelayMs());
    }
    
    /**
     * Utför en operation med retry-logik för void-operationer och anpassad initial fördröjning
     */
    public void executeWithRetry(Runnable operation, String operationName, int maxRetries, long initialDelayMs) {
        executeWithRetry(() -> {
            operation.run();
            return null;
        }, operationName, maxRetries, initialDelayMs);
    }
    
    /**
     * Beräknar fördröjning för nästa retry-försök med exponential backoff
     */
    private long calculateDelay(int attemptNumber, long initialDelayMs) {
        double backoffMultiplier = retryConfig != null ? retryConfig.getDefaultRetry().getBackoffMultiplier() : BACKOFF_MULTIPLIER;
        long maxDelayMs = retryConfig != null ? retryConfig.getDefaultRetry().getMaxDelayMs() : MAX_DELAY_MS;
        boolean enableJitter = retryConfig != null ? retryConfig.getDefaultRetry().isEnableJitter() : true;
        double jitterFactor = retryConfig != null ? retryConfig.getDefaultRetry().getJitterFactor() : 0.1;
        
        long delay = (long) (initialDelayMs * Math.pow(backoffMultiplier, attemptNumber - 1));
        
        // Lägg till lite jitter för att undvika thundering herd
        if (enableJitter) {
            long jitter = (long) (Math.random() * jitterFactor * delay);
            delay += jitter;
        }
        
        // Begränsa till max fördröjning
        return Math.min(delay, maxDelayMs);
    }
    
    /**
     * Beräknar nästa retry-tidpunkt
     */
    public LocalDateTime calculateNextRetryTime(int retryCount, LocalDateTime baseTime) {
        if (retryCount <= 0) {
            return baseTime;
        }
        
        long delayMs = calculateDelay(retryCount, getDefaultInitialDelayMs());
        return baseTime.plus(delayMs, ChronoUnit.MILLIS);
    }
    
    /**
     * Kontrollerar om en operation ska retry:as baserat på feltyp
     */
    public boolean shouldRetry(Exception exception) {
        if (exception == null) {
            return false;
        }
        
        String message = exception.getMessage();
        if (message == null) {
            return false;
        }
        
        // Retry för tillfälliga fel
        String lowerMessage = message.toLowerCase();
        return lowerMessage.contains("timeout") ||
               lowerMessage.contains("connection") ||
               lowerMessage.contains("network") ||
               lowerMessage.contains("rate limit") ||
               lowerMessage.contains("too many requests") ||
               lowerMessage.contains("service unavailable") ||
               lowerMessage.contains("internal server error") ||
               lowerMessage.contains("bad gateway") ||
               lowerMessage.contains("gateway timeout");
    }
    
    /**
     * Kontrollerar om en operation ska retry:as baserat på feltyp och retry-räknare
     */
    public boolean shouldRetry(Exception exception, int currentRetryCount, int maxRetries) {
        return currentRetryCount < maxRetries && shouldRetry(exception);
    }
    
    /**
     * Skapar en retry-strategi med anpassade parametrar
     */
    public RetryStrategy createRetryStrategy(int maxRetries, long initialDelayMs, double backoffMultiplier) {
        return new RetryStrategy(maxRetries, initialDelayMs, backoffMultiplier);
    }
    
    /**
     * Statisk metod för att utföra retry utan att behöva en instans
     */
    public static <T> T executeWithRetryStatic(Supplier<T> operation, String operationName, int maxRetries, long initialDelayMs) {
        AtomicInteger attemptCount = new AtomicInteger(0);
        Exception lastException = null;
        
        while (attemptCount.get() <= maxRetries) {
            try {
                T result = operation.get();
                if (attemptCount.get() > 0) {
                    log.info("Operation '{}' lyckades efter {} försök", operationName, attemptCount.get() + 1);
                }
                return result;
            } catch (Exception e) {
                lastException = e;
                int currentAttempt = attemptCount.incrementAndGet();
                
                if (currentAttempt > maxRetries || !shouldRetryStatic(e)) {
                    break;
                }
                
                long delay = calculateDelayStatic(currentAttempt, initialDelayMs);
                log.warn("Operation '{}' misslyckades (försök {}/{}). Försöker igen om {} ms. Fel: {}", 
                        operationName, currentAttempt, maxRetries + 1, delay, e.getMessage());
                
                try {
                    Thread.sleep(delay);
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                    throw new RuntimeException("Retry avbröts", ie);
                }
            }
        }
        
        log.error("Operation '{}' misslyckades efter {} försök", operationName, maxRetries + 1);
        throw new RuntimeException("Operation misslyckades efter " + (maxRetries + 1) + " försök", lastException);
    }
    
    /**
     * Statisk metod för att utföra retry utan att behöva en instans (void operation)
     */
    public static void executeWithRetryStatic(Runnable operation, String operationName, int maxRetries, long initialDelayMs) {
        executeWithRetryStatic(() -> {
            operation.run();
            return null;
        }, operationName, maxRetries, initialDelayMs);
    }
    
    /**
     * Statisk metod för att kontrollera om en exception ska retry:as
     */
    private static boolean shouldRetryStatic(Exception exception) {
        if (exception instanceof RuntimeException) {
            String message = exception.getMessage();
            if (message == null) return false;
            
            String lowerMessage = message.toLowerCase();
            return lowerMessage.contains("timeout") ||
                   lowerMessage.contains("connection") ||
                   lowerMessage.contains("network") ||
                   lowerMessage.contains("service unavailable") ||
                   lowerMessage.contains("internal server error") ||
                   lowerMessage.contains("bad gateway") ||
                   lowerMessage.contains("gateway timeout");
        }
        return false;
    }
    
    /**
     * Statisk metod för att beräkna fördröjning
     */
    private static long calculateDelayStatic(int attemptNumber, long initialDelayMs) {
        long delay = (long) (initialDelayMs * Math.pow(BACKOFF_MULTIPLIER, attemptNumber - 1));
        return Math.min(delay, MAX_DELAY_MS);
    }
    
    /**
     * Retry-strategi med anpassbara parametrar
     */
    public static class RetryStrategy {
        private final int maxRetries;
        private final long initialDelayMs;
        private final double backoffMultiplier;
        
        public RetryStrategy(int maxRetries, long initialDelayMs, double backoffMultiplier) {
            this.maxRetries = maxRetries;
            this.initialDelayMs = initialDelayMs;
            this.backoffMultiplier = backoffMultiplier;
        }
        
        public <T> T execute(Supplier<T> operation, String operationName) {
            return RetryService.executeWithRetryStatic(operation, operationName, maxRetries, initialDelayMs);
        }
        
        public void execute(Runnable operation, String operationName) {
            RetryService.executeWithRetryStatic(operation, operationName, maxRetries, initialDelayMs);
        }
        
        public int getMaxRetries() {
            return maxRetries;
        }
        
        public long getInitialDelayMs() {
            return initialDelayMs;
        }
        
        public double getBackoffMultiplier() {
            return backoffMultiplier;
        }
    }
}
