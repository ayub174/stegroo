package se.stegroo.backend.service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import se.stegroo.backend.model.JobListing;

import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
public class ChunkingTest {

    @Autowired
    private ArbetsformedlingenService arbetsformedlingenService;

    @Test
    public void testSingleJobFromSnapshot() {
        System.out.println("=== SINGLE JOB TEST STARTAR ===");
        
        AtomicInteger totalJobs = new AtomicInteger(0);
        AtomicInteger chunksProcessed = new AtomicInteger(0);
        
        try {
            int result = arbetsformedlingenService.testSingleJobFromSnapshot((jobs, chunkIndex) -> {
                System.out.println("Chunk " + chunkIndex + " innehåller " + jobs.size() + " jobb");
                totalJobs.addAndGet(jobs.size());
                chunksProcessed.incrementAndGet();
                
                // Logga detaljer om jobbet
                if (!jobs.isEmpty()) {
                    JobListing job = jobs.get(0);
                    System.out.println("Jobb detaljer: ID=" + job.getExternalId() + 
                        ", Titel=" + job.getTitle() + ", Företag=" + job.getCompanyName());
                }
                
                // Simulera bearbetning utan att faktiskt spara till databas
                return jobs.size();
            });
            
            System.out.println("=== SINGLE JOB TEST RESULTAT ===");
            System.out.println("Totalt processerade jobb: " + result);
            System.out.println("Totalt jobb i chunks: " + totalJobs.get());
            System.out.println("Antal chunks processerade: " + chunksProcessed.get());
            
            // Verifiera att test fungerade
            assertTrue(result >= 0, "Resultat ska vara positivt eller noll");
            assertTrue(result <= 1, "Resultat ska vara max 1 jobb");
            assertEquals(result, totalJobs.get(), "Resultat ska matcha totalt antal jobb");
            
            if (result > 0) {
                assertEquals(1, chunksProcessed.get(), "Exakt en chunk ska ha processeras");
                assertEquals(1, result, "Exakt ett jobb ska ha processeras");
            }
            
            System.out.println("✅ SINGLE JOB TEST LYCKADES!");
            
        } catch (Exception e) {
            System.out.println("❌ SINGLE JOB TEST MISSLYCKADES: " + e.getMessage());
            e.printStackTrace();
            fail("Single job test misslyckades: " + e.getMessage());
        }
    }

    @Test
    public void testFetchSingleJobFromSnapshot() {
        System.out.println("=== FETCH SINGLE JOB TEST STARTAR ===");
        
        try {
            // Testa direkt hämtning av ett jobb
            var jobs = arbetsformedlingenService.fetchSingleJobFromSnapshot();
            
            System.out.println("Hämtade " + jobs.size() + " jobb från snapshot");
            
            // Verifiera resultatet
            assertNotNull(jobs, "Jobb-listan ska inte vara null");
            assertTrue(jobs.size() <= 1, "Max 1 jobb ska hämtas");
            
            if (!jobs.isEmpty()) {
                JobListing job = jobs.get(0);
                assertNotNull(job.getExternalId(), "Jobb ska ha ett externt ID");
                assertNotNull(job.getTitle(), "Jobb ska ha en titel");
                System.out.println("✅ Hämtade jobb: " + job.getTitle() + " från " + job.getCompanyName());
            } else {
                System.out.println("⚠️ Inga jobb hämtades (kan vara normalt om API:t är tomt)");
            }
            
            System.out.println("✅ FETCH SINGLE JOB TEST LYCKADES!");
            
        } catch (Exception e) {
            System.out.println("❌ FETCH SINGLE JOB TEST MISSLYCKADES: " + e.getMessage());
            e.printStackTrace();
            fail("Fetch single job test misslyckades: " + e.getMessage());
        }
    }
}
