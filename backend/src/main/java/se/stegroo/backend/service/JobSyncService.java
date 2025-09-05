package se.stegroo.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import se.stegroo.backend.model.JobListing;
import se.stegroo.backend.repository.JobListingRepository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Schemalagd service för att synkronisera jobb från Arbetsförmedlingen
 * Körs dagligen för att hålla databasen uppdaterad med nya jobb
 */
@Service
public class JobSyncService {
    
    private static final Logger log = LoggerFactory.getLogger(JobSyncService.class);
    
    private final ArbetsformedlingenService arbetsformedlingenService;
    private final JobListingRepository jobListingRepository;
    
    public JobSyncService(
            ArbetsformedlingenService arbetsformedlingenService,
            JobListingRepository jobListingRepository) {
        this.arbetsformedlingenService = arbetsformedlingenService;
        this.jobListingRepository = jobListingRepository;
    }
    
    /**
     * Getter för ArbetsformedlingenService
     */
    public ArbetsformedlingenService getArbetsformedlingenService() {
        return arbetsformedlingenService;
    }
    
    /**
     * Schemalagd synkronisering som körs varje dag kl 06:00
     */
    @Scheduled(cron = "0 0 6 * * ?")
    public void syncJobsDaily() {
        log.info("Startar daglig synkronisering av jobb från Arbetsförmedlingen");
        
        try {
            // Kontrollera om vi ska göra en inkrementell uppdatering
            LocalDateTime lastSync = getLastSyncTime();
            List<JobListing> newJobs;
            
            if (lastSync != null) {
                log.info("Utför inkrementell synkronisering sedan {}", lastSync);
                newJobs = arbetsformedlingenService.fetchJobsBatch(50); // Använd batch-hämtning istället
            } else {
                log.info("Utför fullständig synkronisering (ingen tidigare synkronisering hittad)");
                newJobs = arbetsformedlingenService.fetchJobsBatch(100); // Begränsa till 100 jobb
            }
            
            if (newJobs.isEmpty()) {
                log.warn("Inga jobb hittades från Arbetsförmedlingen");
                return;
            }
            
            log.info("Hittade {} jobb från Arbetsförmedlingen", newJobs.size());
            
            // Spara nya jobb till databasen
            int savedCount = 0;
            int updatedCount = 0;
            
            for (JobListing job : newJobs) {
                try {
                    // Kontrollera om jobbet redan finns
                    if (job.getExternalId() != null) {
                        var existingJob = jobListingRepository.findByExternalId(job.getExternalId());
                        
                        if (existingJob.isPresent()) {
                            // Uppdatera befintligt jobb
                            JobListing existing = existingJob.get();
                            updateExistingJob(existing, job);
                            jobListingRepository.save(existing);
                            updatedCount++;
                        } else {
                            // Spara nytt jobb
                            jobListingRepository.save(job);
                            savedCount++;
                        }
                    } else {
                        // Spara jobb utan external ID
                        jobListingRepository.save(job);
                        savedCount++;
                    }
                    
                } catch (Exception e) {
                    log.error("Fel vid sparande av jobb: {}", job.getTitle(), e);
                }
            }
            
            // Uppdatera senaste synkroniseringstid
            updateLastSyncTime(LocalDateTime.now());
            
            log.info("Synkronisering slutförd: {} nya jobb sparade, {} jobb uppdaterade", 
                    savedCount, updatedCount);
            
        } catch (Exception e) {
            log.error("Fel vid daglig synkronisering av jobb", e);
        }
    }
    
    /**
     * Hämtar tidpunkten för senaste synkronisering
     */
    protected LocalDateTime getLastSyncTime() {
        // I en riktig implementation skulle detta hämtas från en databas eller konfigurationsfil
        // För enkelhetens skull använder vi en hårdkodad tid som är 24 timmar sedan
        return LocalDateTime.now().minusDays(1);
    }
    
    /**
     * Uppdaterar tidpunkten för senaste synkronisering
     */
    protected void updateLastSyncTime(LocalDateTime time) {
        // I en riktig implementation skulle detta sparas i en databas eller konfigurationsfil
        log.info("Uppdaterar senaste synkroniseringstid till {}", time);
    }
    
    /**
     * Manuell synkronisering som kan anropas via admin-API
     */
    public JobSyncResult syncJobsManually() {
        log.info("Startar manuell synkronisering av jobb");
        
        try {
            // Hämta jobb i batchar för att undvika överbelastning
            List<JobListing> newJobs = arbetsformedlingenService.fetchJobsBatch(100); // Begränsa till 100 jobb
            
            if (newJobs.isEmpty()) {
                return new JobSyncResult(0, 0, "Inga jobb hittades");
            }
            
            log.info("Hittade {} jobb från Arbetsförmedlingen", newJobs.size());
            
            int savedCount = 0;
            int updatedCount = 0;
            
            for (JobListing job : newJobs) {
                try {
                    if (job.getExternalId() != null) {
                        var existingJob = jobListingRepository.findByExternalId(job.getExternalId());
                        
                        if (existingJob.isPresent()) {
                            updateExistingJob(existingJob.get(), job);
                            jobListingRepository.save(existingJob.get());
                            updatedCount++;
                        } else {
                            jobListingRepository.save(job);
                            savedCount++;
                        }
                    } else {
                        jobListingRepository.save(job);
                        savedCount++;
                    }
                    
                } catch (Exception e) {
                    log.error("Fel vid sparande av jobb: {}", job.getTitle(), e);
                }
            }
            
            // Uppdatera senaste synkroniseringstid
            updateLastSyncTime(LocalDateTime.now());
            
            String message = String.format("Synkronisering slutförd: %d nya jobb, %d uppdaterade", 
                    savedCount, updatedCount);
            
            return new JobSyncResult(savedCount, updatedCount, message);
            
        } catch (Exception e) {
            log.error("Fel vid manuell synkronisering", e);
            return new JobSyncResult(0, 0, "Fel vid synkronisering: " + e.getMessage());
        }
    }
    
    /**
     * Uppdaterar befintligt jobb med ny information
     */
    private void updateExistingJob(JobListing existing, JobListing updated) {
        // Uppdatera endast om det nya jobbet är nyare
        if (updated.getPublishedAt() != null && 
            (existing.getPublishedAt() == null || updated.getPublishedAt().isAfter(existing.getPublishedAt()))) {
            
            existing.setTitle(updated.getTitle());
            existing.setDescription(updated.getDescription());
            existing.setCompanyName(updated.getCompanyName());
            existing.setLocation(updated.getLocation());
            existing.setEmploymentType(updated.getEmploymentType());
            existing.setDeadline(updated.getDeadline());
            existing.setExternalUrl(updated.getExternalUrl());
            existing.setCategory(updated.getCategory());
            existing.setUpdatedAt(LocalDateTime.now());
        }
    }
    
    /**
     * Resultat från jobbsynkronisering
     */
    public static class JobSyncResult {
        private final int newJobsCount;
        private final int updatedJobsCount;
        private final String message;
        private final LocalDateTime timestamp;
        
        public JobSyncResult(int newJobsCount, int updatedJobsCount, String message) {
            this.newJobsCount = newJobsCount;
            this.updatedJobsCount = updatedJobsCount;
            this.message = message;
            this.timestamp = LocalDateTime.now();
        }
        
        // Getters
        public int getNewJobsCount() { return newJobsCount; }
        public int getUpdatedJobsCount() { return updatedJobsCount; }
        public String getMessage() { return message; }
        public LocalDateTime getTimestamp() { return timestamp; }
    }
}