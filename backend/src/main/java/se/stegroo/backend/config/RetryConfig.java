package se.stegroo.backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * Konfiguration för retry-strategier och timeouts.
 * Används för att konfigurera retry-beteende för alla services.
 */
@Configuration
@ConfigurationProperties(prefix = "retry")
public class RetryConfig {
    
    /**
     * Standard retry-konfiguration
     */
    private DefaultRetry defaultRetry = new DefaultRetry();
    
    /**
     * API-specifik retry-konfiguration
     */
    private ApiRetry apiRetry = new ApiRetry();
    
    /**
     * Synkroniserings-specifik retry-konfiguration
     */
    private SyncRetry syncRetry = new SyncRetry();
    
    /**
     * Database-specifik retry-konfiguration
     */
    private DatabaseRetry databaseRetry = new DatabaseRetry();
    
    /**
     * Timeout-konfiguration
     */
    private Timeout timeout = new Timeout();
    
    public DefaultRetry getDefaultRetry() {
        return defaultRetry;
    }
    
    public void setDefaultRetry(DefaultRetry defaultRetry) {
        this.defaultRetry = defaultRetry;
    }
    
    public ApiRetry getApiRetry() {
        return apiRetry;
    }
    
    public void setApiRetry(ApiRetry apiRetry) {
        this.apiRetry = apiRetry;
    }
    
    public SyncRetry getSyncRetry() {
        return syncRetry;
    }
    
    public void setSyncRetry(SyncRetry syncRetry) {
        this.syncRetry = syncRetry;
    }
    
    public DatabaseRetry getDatabaseRetry() {
        return databaseRetry;
    }
    
    public void setDatabaseRetry(DatabaseRetry databaseRetry) {
        this.databaseRetry = databaseRetry;
    }
    
    public Timeout getTimeout() {
        return timeout;
    }
    
    public void setTimeout(Timeout timeout) {
        this.timeout = timeout;
    }
    
    /**
     * Standard retry-konfiguration
     */
    public static class DefaultRetry {
        private int maxRetries = 3;
        private long initialDelayMs = 1000;
        private double backoffMultiplier = 2.0;
        private long maxDelayMs = 30000;
        private boolean enableJitter = true;
        private double jitterFactor = 0.1;
        
        public int getMaxRetries() {
            return maxRetries;
        }
        
        public void setMaxRetries(int maxRetries) {
            this.maxRetries = maxRetries;
        }
        
        public long getInitialDelayMs() {
            return initialDelayMs;
        }
        
        public void setInitialDelayMs(long initialDelayMs) {
            this.initialDelayMs = initialDelayMs;
        }
        
        public double getBackoffMultiplier() {
            return backoffMultiplier;
        }
        
        public void setBackoffMultiplier(double backoffMultiplier) {
            this.backoffMultiplier = backoffMultiplier;
        }
        
        public long getMaxDelayMs() {
            return maxDelayMs;
        }
        
        public void setMaxDelayMs(long maxDelayMs) {
            this.maxDelayMs = maxDelayMs;
        }
        
        public boolean isEnableJitter() {
            return enableJitter;
        }
        
        public void setEnableJitter(boolean enableJitter) {
            this.enableJitter = enableJitter;
        }
        
        public double getJitterFactor() {
            return jitterFactor;
        }
        
        public void setJitterFactor(double jitterFactor) {
            this.jitterFactor = jitterFactor;
        }
    }
    
    /**
     * API-specifik retry-konfiguration
     */
    public static class ApiRetry {
        private int maxRetries = 5;
        private long initialDelayMs = 2000;
        private double backoffMultiplier = 1.5;
        private long maxDelayMs = 60000;
        private long connectionTimeoutMs = 10000;
        private long readTimeoutMs = 30000;
        
        public int getMaxRetries() {
            return maxRetries;
        }
        
        public void setMaxRetries(int maxRetries) {
            this.maxRetries = maxRetries;
        }
        
        public long getInitialDelayMs() {
            return initialDelayMs;
        }
        
        public void setInitialDelayMs(long initialDelayMs) {
            this.initialDelayMs = initialDelayMs;
        }
        
        public double getBackoffMultiplier() {
            return backoffMultiplier;
        }
        
        public void setBackoffMultiplier(double backoffMultiplier) {
            this.backoffMultiplier = backoffMultiplier;
        }
        
        public long getMaxDelayMs() {
            return maxDelayMs;
        }
        
        public void setMaxDelayMs(long maxDelayMs) {
            this.maxDelayMs = maxDelayMs;
        }
        
        public long getConnectionTimeoutMs() {
            return connectionTimeoutMs;
        }
        
        public void setConnectionTimeoutMs(long connectionTimeoutMs) {
            this.connectionTimeoutMs = connectionTimeoutMs;
        }
        
        public long getReadTimeoutMs() {
            return readTimeoutMs;
        }
        
        public void setReadTimeoutMs(long readTimeoutMs) {
            this.readTimeoutMs = readTimeoutMs;
        }
    }
    
    /**
     * Synkroniserings-specifik retry-konfiguration
     */
    public static class SyncRetry {
        private int maxRetries = 10;
        private long initialDelayMs = 5000;
        private double backoffMultiplier = 2.0;
        private long maxDelayMs = 300000; // 5 minuter
        private long batchTimeoutMs = 120000; // 2 minuter
        private int maxConcurrentBatches = 3;
        
        public int getMaxRetries() {
            return maxRetries;
        }
        
        public void setMaxRetries(int maxRetries) {
            this.maxRetries = maxRetries;
        }
        
        public long getInitialDelayMs() {
            return initialDelayMs;
        }
        
        public void setInitialDelayMs(long initialDelayMs) {
            this.initialDelayMs = initialDelayMs;
        }
        
        public double getBackoffMultiplier() {
            return backoffMultiplier;
        }
        
        public void setBackoffMultiplier(double backoffMultiplier) {
            this.backoffMultiplier = backoffMultiplier;
        }
        
        public long getMaxDelayMs() {
            return maxDelayMs;
        }
        
        public void setMaxDelayMs(long maxDelayMs) {
            this.maxDelayMs = maxDelayMs;
        }
        
        public long getBatchTimeoutMs() {
            return batchTimeoutMs;
        }
        
        public void setBatchTimeoutMs(long batchTimeoutMs) {
            this.batchTimeoutMs = batchTimeoutMs;
        }
        
        public int getMaxConcurrentBatches() {
            return maxConcurrentBatches;
        }
        
        public void setMaxConcurrentBatches(int maxConcurrentBatches) {
            this.maxConcurrentBatches = maxConcurrentBatches;
        }
    }
    
    /**
     * Database-specifik retry-konfiguration
     */
    public static class DatabaseRetry {
        private int maxRetries = 3;
        private long initialDelayMs = 500;
        private double backoffMultiplier = 1.5;
        private long maxDelayMs = 5000;
        private long transactionTimeoutMs = 30000;
        
        public int getMaxRetries() {
            return maxRetries;
        }
        
        public void setMaxRetries(int maxRetries) {
            this.maxRetries = maxRetries;
        }
        
        public long getInitialDelayMs() {
            return initialDelayMs;
        }
        
        public void setInitialDelayMs(long initialDelayMs) {
            this.initialDelayMs = initialDelayMs;
        }
        
        public double getBackoffMultiplier() {
            return backoffMultiplier;
        }
        
        public void setBackoffMultiplier(double backoffMultiplier) {
            this.backoffMultiplier = backoffMultiplier;
        }
        
        public long getMaxDelayMs() {
            return maxDelayMs;
        }
        
        public void setMaxDelayMs(long maxDelayMs) {
            this.maxDelayMs = maxDelayMs;
        }
        
        public long getTransactionTimeoutMs() {
            return transactionTimeoutMs;
        }
        
        public void setTransactionTimeoutMs(long transactionTimeoutMs) {
            this.transactionTimeoutMs = transactionTimeoutMs;
        }
    }
    
    /**
     * Timeout-konfiguration
     */
    public static class Timeout {
        private long globalTimeoutMs = 300000; // 5 minuter
        private long shortTimeoutMs = 30000; // 30 sekunder
        private long longTimeoutMs = 600000; // 10 minuter
        private boolean enableTimeoutInterruption = true;
        
        public long getGlobalTimeoutMs() {
            return globalTimeoutMs;
        }
        
        public void setGlobalTimeoutMs(long globalTimeoutMs) {
            this.globalTimeoutMs = globalTimeoutMs;
        }
        
        public long getShortTimeoutMs() {
            return shortTimeoutMs;
        }
        
        public void setShortTimeoutMs(long shortTimeoutMs) {
            this.shortTimeoutMs = shortTimeoutMs;
        }
        
        public long getLongTimeoutMs() {
            return longTimeoutMs;
        }
        
        public void setLongTimeoutMs(long longTimeoutMs) {
            this.longTimeoutMs = longTimeoutMs;
        }
        
        public boolean isEnableTimeoutInterruption() {
            return enableTimeoutInterruption;
        }
        
        public void setEnableTimeoutInterruption(boolean enableTimeoutInterruption) {
            this.enableTimeoutInterruption = enableTimeoutInterruption;
        }
    }
}
