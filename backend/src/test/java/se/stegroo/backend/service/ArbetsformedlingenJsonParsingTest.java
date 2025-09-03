package se.stegroo.backend.service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import se.stegroo.backend.model.JobListing;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Test för att verifiera JSON-parsing av riktiga API-data från Arbetsförmedlingen
 */
@SpringBootTest
@ActiveProfiles("test")
public class ArbetsformedlingenJsonParsingTest {

    @Autowired
    private ArbetsformedlingenService arbetsformedlingenService;


    @Test
    public void testFetchRealJobsFromApi() {
        // Testa att hämta riktiga jobb från API:t
        List<JobListing> jobs = arbetsformedlingenService.fetchJobsBatch(5);
        
        assertNotNull(jobs, "Jobblista ska inte vara null");
        assertFalse(jobs.isEmpty(), "Jobblista ska inte vara tom");
        
        System.out.println("=== TESTRESULTAT: Hämtade " + jobs.size() + " jobb ===");
        
        for (JobListing job : jobs) {
            assertNotNull(job.getTitle(), "Jobbtitel ska inte vara null");
            assertNotNull(job.getExternalId(), "External ID ska inte vara null");
            assertEquals("arbetsformedlingen", job.getSource(), "Källa ska vara arbetsformedlingen");
            
            System.out.println("✅ Jobb: " + job.getTitle());
            System.out.println("   ID: " + job.getExternalId());
            System.out.println("   Företag: " + job.getCompanyName());
            System.out.println("   Plats: " + job.getLocation());
            System.out.println("   Kategori: " + (job.getCategory() != null ? job.getCategory().getName() : "Ingen"));
            System.out.println("   Anställningstyp: " + job.getEmploymentType());
            System.out.println("   Arbetstid: " + job.getWorkingHoursType());
            System.out.println("   Deadline: " + job.getDeadline());
            System.out.println("   Publicerat: " + job.getPublishedAt());
            System.out.println("   ---");
        }
    }

    @Test
    public void testJobDataQuality() {
        // Testa att jobben har bra datakvalitet
        List<JobListing> jobs = arbetsformedlingenService.fetchJobsBatch(10);
        
        assertNotNull(jobs);
        assertFalse(jobs.isEmpty());
        
        int jobsWithDescription = 0;
        int jobsWithCompany = 0;
        int jobsWithLocation = 0;
        int jobsWithCategory = 0;
        int jobsWithDeadline = 0;
        
        for (JobListing job : jobs) {
            if (job.getDescription() != null && !job.getDescription().trim().isEmpty()) {
                jobsWithDescription++;
            }
            if (job.getCompanyName() != null && !job.getCompanyName().trim().isEmpty()) {
                jobsWithCompany++;
            }
            if (job.getLocation() != null && !job.getLocation().trim().isEmpty()) {
                jobsWithLocation++;
            }
            if (job.getCategory() != null) {
                jobsWithCategory++;
            }
            if (job.getDeadline() != null) {
                jobsWithDeadline++;
            }
        }
        
        System.out.println("=== DATAKVALITET ===");
        System.out.println("Jobb med beskrivning: " + jobsWithDescription + "/" + jobs.size());
        System.out.println("Jobb med företag: " + jobsWithCompany + "/" + jobs.size());
        System.out.println("Jobb med plats: " + jobsWithLocation + "/" + jobs.size());
        System.out.println("Jobb med kategori: " + jobsWithCategory + "/" + jobs.size());
        System.out.println("Jobb med deadline: " + jobsWithDeadline + "/" + jobs.size());
        
        // Minst 80% av jobben ska ha grundläggande information
        assertTrue(jobsWithDescription >= jobs.size() * 0.8, "Minst 80% av jobben ska ha beskrivning");
        assertTrue(jobsWithCompany >= jobs.size() * 0.8, "Minst 80% av jobben ska ha företagsnamn");
        assertTrue(jobsWithLocation >= jobs.size() * 0.8, "Minst 80% av jobben ska ha plats");
    }
}
