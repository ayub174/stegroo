package se.stegroo.backend.model;

import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

class JobListingTest {

    @Test
    void testJobListingCreation() {
        // Skapa en jobbannons
        JobListing job = new JobListing();
        job.setId(1L);
        job.setTitle("Senior Java Developer");
        job.setDescription("Vi söker en erfaren Java-utvecklare...");
        job.setCompanyName("TechCorp AB");
        job.setLocation("Stockholm");
        job.setExternalId("af-job-id-123");
        job.setExternalUrl("https://example.com/job/123");
        job.setPublishedAt(LocalDateTime.of(2023, 5, 15, 10, 0));
        job.setLastModified(LocalDateTime.of(2023, 5, 15, 10, 0));
        job.setDeadline(LocalDateTime.of(2023, 6, 15, 23, 59));
        
        // Verifiera att fälten är korrekt satta
        assertEquals(1L, job.getId());
        assertEquals("Senior Java Developer", job.getTitle());
        assertEquals("Vi söker en erfaren Java-utvecklare...", job.getDescription());
        assertEquals("TechCorp AB", job.getCompanyName());
        assertEquals("Stockholm", job.getLocation());
        assertEquals("af-job-id-123", job.getExternalId());
        assertEquals("https://example.com/job/123", job.getExternalUrl());
        assertEquals(LocalDateTime.of(2023, 5, 15, 10, 0), job.getPublishedAt());
        assertEquals(LocalDateTime.of(2023, 5, 15, 10, 0), job.getLastModified());
        assertEquals(LocalDateTime.of(2023, 6, 15, 23, 59), job.getDeadline());
    }
    
    @Test
    void testJobListingWithCategory() {
        // Skapa en kategori
        JobCategory category = new JobCategory();
        category.setId(1L);
        category.setName("IT");
        
        // Skapa en jobbannons med kategori
        JobListing job = new JobListing();
        job.setId(1L);
        job.setTitle("Senior Java Developer");
        job.setCategory(category);
        
        // Verifiera relationen
        assertEquals(category, job.getCategory());
        assertTrue(category.getJobs().contains(job));
    }
    
    @Test
    void testJobListingWithSkills() {
        // Skapa en jobbannons
        JobListing job = new JobListing();
        job.setId(1L);
        job.setTitle("Senior Java Developer");
        
        // Skapa några kompetenser
        Skill skill1 = new Skill();
        skill1.setId(1L);
        skill1.setName("Java");
        
        Skill skill2 = new Skill();
        skill2.setId(2L);
        skill2.setName("Spring Boot");
        
        // Lägg till kompetenser till jobbet
        Set<Skill> skills = new HashSet<>();
        skills.add(skill1);
        skills.add(skill2);
        job.setSkills(skills);
        
        // Verifiera relationen
        assertEquals(2, job.getSkills().size());
        assertTrue(job.getSkills().contains(skill1));
        assertTrue(job.getSkills().contains(skill2));
    }
    
    @Test
    void testJobListingEquality() {
        // Skapa två jobbannonser med samma ID
        JobListing job1 = new JobListing();
        job1.setId(1L);
        job1.setTitle("Senior Java Developer");
        
        JobListing job2 = new JobListing();
        job2.setId(1L);
        job2.setTitle("Senior Java Utvecklare"); // Annat namn, men samma ID
        
        // Verifiera att equals och hashCode baseras på ID
        assertEquals(job1, job2);
        assertEquals(job1.hashCode(), job2.hashCode());
    }
}
