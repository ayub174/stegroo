package se.stegroo.backend.model;

import org.junit.jupiter.api.Test;

import java.util.HashSet;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

class UserProfileTest {

    @Test
    void testUserProfileCreation() {
        // Skapa en användarprofil
        UserProfile user = new UserProfile();
        user.setId(1L);
        user.setUserId("auth0|123456");
        user.setDisplayName("John Doe");
        user.setBio("Erfaren utvecklare med fokus på Java och Spring Boot");
        user.setLocation("Stockholm");
        user.setAccountType("private");
        
        // Verifiera att fälten är korrekt satta
        assertEquals(1L, user.getId());
        assertEquals("auth0|123456", user.getUserId());
        assertEquals("John Doe", user.getDisplayName());
        assertEquals("Erfaren utvecklare med fokus på Java och Spring Boot", user.getBio());
        assertEquals("Stockholm", user.getLocation());
        assertEquals("private", user.getAccountType());
    }
    
    @Test
    void testUserProfileWithSkills() {
        // Skapa en användarprofil
        UserProfile user = new UserProfile();
        user.setId(1L);
        user.setDisplayName("John Doe");
        
        // Skapa några kompetenser
        Skill skill1 = new Skill();
        skill1.setId(1L);
        skill1.setName("Java");
        
        Skill skill2 = new Skill();
        skill2.setId(2L);
        skill2.setName("Spring Boot");
        
        // Lägg till kompetenser till användaren
        user.addSkill(skill1);
        user.addSkill(skill2);
        
        // Verifiera relationen
        assertEquals(2, user.getSkills().size());
        assertTrue(user.getSkills().contains(skill1));
        assertTrue(user.getSkills().contains(skill2));
        assertTrue(skill1.getUsers().contains(user));
        assertTrue(skill2.getUsers().contains(user));
    }
    
    @Test
    void testUserProfileWithSavedJobs() {
        // Skapa en användarprofil
        UserProfile user = new UserProfile();
        user.setId(1L);
        user.setDisplayName("John Doe");
        
        // Skapa några jobb
        JobListing job1 = new JobListing();
        job1.setId(1L);
        job1.setTitle("Senior Java Developer");
        
        JobListing job2 = new JobListing();
        job2.setId(2L);
        job2.setTitle("DevOps Engineer");
        
        // Spara jobb
        user.saveJob(job1);
        user.saveJob(job2);
        
        // Verifiera relationen
        assertEquals(2, user.getSavedJobs().size());
        assertTrue(user.getSavedJobs().contains(job1));
        assertTrue(user.getSavedJobs().contains(job2));
        assertTrue(job1.getSavedByUsers().contains(user));
        assertTrue(job2.getSavedByUsers().contains(user));
        
        // Ta bort ett sparat jobb
        user.unsaveJob(job1);
        
        // Verifiera att jobbet har tagits bort
        assertEquals(1, user.getSavedJobs().size());
        assertFalse(user.getSavedJobs().contains(job1));
        assertTrue(user.getSavedJobs().contains(job2));
        assertFalse(job1.getSavedByUsers().contains(user));
        assertTrue(job2.getSavedByUsers().contains(user));
    }
    
    @Test
    void testUserProfileEquality() {
        // Skapa två användarprofiler med samma ID
        UserProfile user1 = new UserProfile();
        user1.setId(1L);
        user1.setDisplayName("John Doe");
        
        UserProfile user2 = new UserProfile();
        user2.setId(1L);
        user2.setDisplayName("Jane Doe"); // Annat namn, men samma ID
        
        // Verifiera att equals och hashCode baseras på ID
        assertEquals(user1, user2);
        assertEquals(user1.hashCode(), user2.hashCode());
    }
}
