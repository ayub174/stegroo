package se.stegroo.backend.service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import se.stegroo.backend.model.JobListing;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Test för att verifiera Arbetsförmedlingens API-anslutning
 */
@SpringBootTest
@ActiveProfiles("test")
public class ArbetsformedlingenApiTest {

    @Autowired
    private ArbetsformedlingenService arbetsformedlingenService;

    @Test
    public void testFetchJobsBatch() {
        // Testa att hämta jobb (kommer använda mock-data om ingen API-nyckel finns)
        List<JobListing> jobs = arbetsformedlingenService.fetchJobsBatch(10);
        
        assertNotNull(jobs, "Jobblistan ska inte vara null");
        assertFalse(jobs.isEmpty(), "Jobblistan ska inte vara tom");
        assertTrue(jobs.size() <= 10, "Antal jobb ska inte överstiga begärd gräns");
        
        // Verifiera att jobben har grundläggande data
        JobListing firstJob = jobs.get(0);
        assertNotNull(firstJob.getTitle(), "Jobbtitel ska inte vara null");
        assertNotNull(firstJob.getDescription(), "Jobbeskrivning ska inte vara null");
        assertNotNull(firstJob.getCompanyName(), "Företagsnamn ska inte vara null");
        
        System.out.println("✅ Hämtade " + jobs.size() + " jobb från Arbetsförmedlingen");
        System.out.println("Första jobbet: " + firstJob.getTitle() + " på " + firstJob.getCompanyName());
    }

    @Test
    public void testSearchJobs() {
        // Testa sökning med specifika parametrar
        List<JobListing> jobs = arbetsformedlingenService.searchJobs("utvecklare", "Stockholm", null);
        
        assertNotNull(jobs, "Sökresultat ska inte vara null");
        
        if (!jobs.isEmpty()) {
            System.out.println("✅ Sökning gav " + jobs.size() + " resultat");
            JobListing firstJob = jobs.get(0);
            System.out.println("Första träff: " + firstJob.getTitle() + " på " + firstJob.getCompanyName());
        } else {
            System.out.println("⚠️ Sökning gav inga resultat (kan vara normalt med mock-data)");
        }
    }

    @Test
    public void testApiConfiguration() {
        // Testa att servicen är korrekt konfigurerad
        assertNotNull(arbetsformedlingenService, "ArbetsformedlingenService ska vara injicerad");
        
        // Testa att vi kan anropa metoder utan fel
        assertDoesNotThrow(() -> {
            arbetsformedlingenService.fetchJobsBatch(5);
        }, "API-anrop ska inte kasta exception");
        
        System.out.println("✅ ArbetsformedlingenService är korrekt konfigurerad");
    }
}
