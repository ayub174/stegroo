package se.stegroo.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import se.stegroo.backend.model.JobListing;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Service för att hantera batch-synkronisering av stora mängder jobb.
 * Denna service kan hantera hundratusentals jobb genom att använda
 * olika sökstrategier och batch-processning.
 */
@Service
public class BatchJobSyncService {

    private static final Logger log = LoggerFactory.getLogger(BatchJobSyncService.class);

    // Lista över svenska kommuner för att segmentera API-anrop
    private static final List<String> MAJOR_MUNICIPALITIES = List.of(
        "Stockholm", "Göteborg", "Malmö", "Uppsala", "Västerås",
        "Örebro", "Linköping", "Helsingborg", "Jönköping", "Norrköping",
        "Lund", "Umeå", "Gävle", "Borås", "Södertälje",
        "Eskilstuna", "Karlstad", "Täby", "Växjö", "Halmstad"
    );

    private final JobSearchApiService jobSearchApiService;
    private final AtomicBoolean syncInProgress = new AtomicBoolean(false);
    private final AtomicInteger totalJobsSynced = new AtomicInteger(0);
    private volatile LocalDateTime lastSyncStart;
    private volatile LocalDateTime lastSyncEnd;
    private volatile String lastSyncStatus = "Never run";

    public BatchJobSyncService(JobSearchApiService jobSearchApiService) {
        this.jobSearchApiService = jobSearchApiService;
    }

    /**
     * Startar en asynkron batch-synkronisering av jobb.
     * Använder flera sökstrategier för att maximera antalet jobb som hämtas.
     */
    @Async
    public void startBatchSync(int maxJobsPerMunicipality) {
        if (!syncInProgress.compareAndSet(false, true)) {
            log.warn("Batch sync redan pågår, hoppar över");
            return;
        }

        try {
            lastSyncStart = LocalDateTime.now();
            lastSyncStatus = "Running";
            totalJobsSynced.set(0);

            log.info("🚀 Startar batch-synkronisering av jobb från Arbetsförmedlingen");

            // Strategi 1: Hämta jobb per kommun för att komma runt API-begränsningar
            for (String municipality : MAJOR_MUNICIPALITIES) {
                if (Thread.currentThread().isInterrupted()) {
                    log.warn("Batch sync avbruten");
                    break;
                }

                try {
                    log.info("Hämtar jobb för kommun: {}", municipality);
                    List<JobListing> jobs = jobSearchApiService.searchJobs(
                        null, municipality, null, maxJobsPerMunicipality, 0
                    );

                    if (!jobs.isEmpty()) {
                        int saved = jobSearchApiService.saveJobsToDatabase(jobs);
                        totalJobsSynced.addAndGet(saved);
                        log.info("✅ Sparade {} jobb för {}, totalt: {}",
                                saved, municipality, totalJobsSynced.get());
                    }

                    // Kort paus mellan API-anrop
                    Thread.sleep(1000);

                } catch (Exception e) {
                    log.error("Fel vid hämtning av jobb för {}: {}", municipality, e.getMessage());
                }
            }

            // Strategi 2: Hämta generella jobb utan platsfilter
            try {
                log.info("Hämtar generella jobb utan platsfilter...");
                List<JobListing> generalJobs = jobSearchApiService.fetchAllJobs(2000);
                if (!generalJobs.isEmpty()) {
                    int saved = jobSearchApiService.saveJobsToDatabase(generalJobs);
                    totalJobsSynced.addAndGet(saved);
                    log.info("✅ Sparade {} generella jobb, totalt: {}", saved, totalJobsSynced.get());
                }
            } catch (Exception e) {
                log.error("Fel vid hämtning av generella jobb: {}", e.getMessage());
            }

            lastSyncEnd = LocalDateTime.now();
            lastSyncStatus = "Completed successfully";
            log.info("✨ Batch-synkronisering slutförd! Totalt {} jobb synkroniserade",
                    totalJobsSynced.get());

        } catch (Exception e) {
            lastSyncEnd = LocalDateTime.now();
            lastSyncStatus = "Failed: " + e.getMessage();
            log.error("❌ Fel vid batch-synkronisering: {}", e.getMessage(), e);
        } finally {
            syncInProgress.set(false);
        }
    }

    /**
     * Hämtar status för pågående eller senaste synkronisering
     */
    public SyncStatus getSyncStatus() {
        return new SyncStatus(
            syncInProgress.get(),
            totalJobsSynced.get(),
            lastSyncStart,
            lastSyncEnd,
            lastSyncStatus
        );
    }

    /**
     * Status för synkronisering
     */
    public static class SyncStatus {
        private final boolean inProgress;
        private final int totalJobsSynced;
        private final LocalDateTime lastSyncStart;
        private final LocalDateTime lastSyncEnd;
        private final String status;

        public SyncStatus(boolean inProgress, int totalJobsSynced,
                         LocalDateTime lastSyncStart, LocalDateTime lastSyncEnd, String status) {
            this.inProgress = inProgress;
            this.totalJobsSynced = totalJobsSynced;
            this.lastSyncStart = lastSyncStart;
            this.lastSyncEnd = lastSyncEnd;
            this.status = status;
        }

        public boolean isInProgress() { return inProgress; }
        public int getTotalJobsSynced() { return totalJobsSynced; }
        public LocalDateTime getLastSyncStart() { return lastSyncStart; }
        public LocalDateTime getLastSyncEnd() { return lastSyncEnd; }
        public String getStatus() { return status; }
    }
}
