package se.stegroo.backend.config;

import io.micrometer.core.aop.TimedAspect;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.Timer;
import io.micrometer.core.instrument.Gauge;
import io.micrometer.core.instrument.Meter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.scheduling.annotation.Scheduled;
import se.stegroo.backend.repository.JobListingRepository;
import se.stegroo.backend.repository.JobCategoryRepository;
import se.stegroo.backend.repository.SkillRepository;

import java.util.concurrent.atomic.AtomicLong;

/**
 * Konfiguration för metrics och monitoring med Micrometer
 */
@Configuration
@EnableAspectJAutoProxy
public class MetricsConfig {

    private final MeterRegistry meterRegistry;
    private final JobListingRepository jobListingRepository;
    private final JobCategoryRepository jobCategoryRepository;
    private final SkillRepository skillRepository;

    // Custom metrics
    private final AtomicLong lastSyncTimestamp = new AtomicLong(0);
    private final AtomicLong syncDuration = new AtomicLong(0);
    private final AtomicLong failedSyncs = new AtomicLong(0);
    private final AtomicLong successfulSyncs = new AtomicLong(0);

    @Autowired
    public MetricsConfig(MeterRegistry meterRegistry,
                        JobListingRepository jobListingRepository,
                        JobCategoryRepository jobCategoryRepository,
                        SkillRepository skillRepository) {
        this.meterRegistry = meterRegistry;
        this.jobListingRepository = jobListingRepository;
        this.jobCategoryRepository = jobCategoryRepository;
        this.skillRepository = skillRepository;
        initializeMetrics();
    }

    /**
     * Initierar alla custom metrics
     */
    private void initializeMetrics() {
        // Jobb-relaterade metrics
        Counter.builder("stegroo.jobs.sync.total")
                .description("Total number of job sync operations")
                .register(meterRegistry);

        Counter.builder("stegroo.jobs.sync.successful")
                .description("Number of successful job sync operations")
                .register(meterRegistry);

        Counter.builder("stegroo.jobs.sync.failed")
                .description("Number of failed job sync operations")
                .register(meterRegistry);

        Timer.builder("stegroo.jobs.sync.duration")
                .description("Duration of job sync operations")
                .register(meterRegistry);

        // Taxonomi-relaterade metrics
        Counter.builder("stegroo.taxonomy.sync.total")
                .description("Total number of taxonomy sync operations")
                .register(meterRegistry);

        Counter.builder("stegroo.taxonomy.sync.successful")
                .description("Number of successful taxonomy sync operations")
                .register(meterRegistry);

        Counter.builder("stegroo.taxonomy.sync.failed")
                .description("Number of failed taxonomy sync operations")
                .register(meterRegistry);

        Timer.builder("stegroo.taxonomy.sync.duration")
                .description("Duration of taxonomy sync operations")
                .register(meterRegistry);

        // API-relaterade metrics
        Counter.builder("stegroo.api.requests.total")
                .description("Total number of API requests")
                .register(meterRegistry);

        Counter.builder("stegroo.api.requests.successful")
                .description("Number of successful API requests")
                .register(meterRegistry);

        Counter.builder("stegroo.api.requests.failed")
                .description("Number of failed API requests")
                .register(meterRegistry);

        Timer.builder("stegroo.api.response.time")
                .description("API response time")
                .register(meterRegistry);

        // Externa API-relaterade metrics
        Counter.builder("stegroo.external.af.api.calls")
                .description("Number of calls to Arbetsförmedlingen API")
                .register(meterRegistry);

        Timer.builder("stegroo.external.af.api.response.time")
                .description("Response time from Arbetsförmedlingen API")
                .register(meterRegistry);

        Counter.builder("stegroo.external.af.api.errors")
                .description("Number of errors from Arbetsförmedlingen API")
                .register(meterRegistry);

        // System-relaterade metrics
        Gauge.builder("stegroo.system.jobs.total", this, MetricsConfig::getJobCount)
                .description("Total number of jobs in database")
                .register(meterRegistry);

        Gauge.builder("stegroo.system.categories.total", this, MetricsConfig::getCategoryCount)
                .description("Total number of job categories in database")
                .register(meterRegistry);

        Gauge.builder("stegroo.system.skills.total", this, MetricsConfig::getSkillCount)
                .description("Total number of skills in database")
                .register(meterRegistry);

        Gauge.builder("stegroo.system.last.sync.timestamp", lastSyncTimestamp, AtomicLong::get)
                .description("Timestamp of last successful sync")
                .register(meterRegistry);

        Gauge.builder("stegroo.system.sync.duration", syncDuration, AtomicLong::get)
                .description("Duration of last sync operation in milliseconds")
                .register(meterRegistry);

        Gauge.builder("stegroo.system.sync.success.rate", this, MetricsConfig::getSyncSuccessRate)
                .description("Success rate of sync operations (0.0 to 1.0)")
                .register(meterRegistry);
    }

    /**
     * Bean för TimedAspect för att automatiskt mäta metodtider
     */
    @Bean
    public TimedAspect timedAspect(MeterRegistry registry) {
        return new TimedAspect(registry);
    }

    /**
     * Hjälpmetoder för att uppdatera metrics
     */
    public void recordJobSyncSuccess(long durationMs) {
        meterRegistry.counter("stegroo.jobs.sync.successful").increment();
        meterRegistry.timer("stegroo.jobs.sync.duration").record(java.time.Duration.ofMillis(durationMs));
        successfulSyncs.incrementAndGet();
        lastSyncTimestamp.set(System.currentTimeMillis());
        syncDuration.set(durationMs);
    }

    public void recordJobSyncFailure() {
        meterRegistry.counter("stegroo.jobs.sync.failed").increment();
        failedSyncs.incrementAndGet();
    }

    public void recordTaxonomySyncSuccess(long durationMs) {
        meterRegistry.counter("stegroo.taxonomy.sync.successful").increment();
        meterRegistry.timer("stegroo.taxonomy.sync.duration").record(java.time.Duration.ofMillis(durationMs));
    }

    public void recordTaxonomySyncFailure() {
        meterRegistry.counter("stegroo.taxonomy.sync.failed").increment();
    }

    public void recordApiRequest(boolean success, long durationMs) {
        meterRegistry.counter("stegroo.api.requests.total").increment();
        if (success) {
            meterRegistry.counter("stegroo.api.requests.successful").increment();
        } else {
            meterRegistry.counter("stegroo.api.requests.failed").increment();
        }
        meterRegistry.timer("stegroo.api.response.time").record(java.time.Duration.ofMillis(durationMs));
    }

    public void recordExternalApiCall(long durationMs) {
        meterRegistry.counter("stegroo.external.af.api.calls").increment();
        meterRegistry.timer("stegroo.external.af.api.response.time").record(java.time.Duration.ofMillis(durationMs));
    }

    public void recordExternalApiError() {
        meterRegistry.counter("stegroo.external.af.api.errors").increment();
    }

    /**
     * Hjälpmetoder för gauge metrics
     */
    private double getJobCount() {
        try {
            return (double) jobListingRepository.count();
        } catch (Exception e) {
            return -1.0;
        }
    }

    private double getCategoryCount() {
        try {
            return (double) jobCategoryRepository.count();
        } catch (Exception e) {
            return -1.0;
        }
    }

    private double getSkillCount() {
        try {
            return (double) skillRepository.count();
        } catch (Exception e) {
            return -1.0;
        }
    }

    private double getSyncSuccessRate() {
        long total = successfulSyncs.get() + failedSyncs.get();
        if (total == 0) return 0.0;
        return (double) successfulSyncs.get() / total;
    }

    /**
     * Schemalagd uppdatering av metrics var 5:e minut
     */
    @Scheduled(fixedRate = 300000) // 5 minutes
    public void updateMetrics() {
        // Uppdatera gauge metrics
        meterRegistry.get("stegroo.system.jobs.total").gauge();
        meterRegistry.get("stegroo.system.categories.total").gauge();
        meterRegistry.get("stegroo.system.skills.total").gauge();
    }
}
