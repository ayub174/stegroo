package se.stegroo.backend.model;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class SkillTest {

    @Test
    void testSkillCreation() {
        // Skapa en kompetens
        Skill skill = new Skill();
        skill.setId(1L);
        skill.setName("Java");
        skill.setDescription("Programmeringsspråk");
        skill.setExternalId("af-skill-id-123");
        
        // Verifiera att fälten är korrekt satta
        assertEquals(1L, skill.getId());
        assertEquals("Java", skill.getName());
        assertEquals("Programmeringsspråk", skill.getDescription());
        assertEquals("af-skill-id-123", skill.getExternalId());
    }
    
    @Test
    void testSkillEquality() {
        // Skapa två kompetenser med samma ID
        Skill skill1 = new Skill();
        skill1.setId(1L);
        skill1.setName("Java");
        
        Skill skill2 = new Skill();
        skill2.setId(1L);
        skill2.setName("JavaScript"); // Annat namn, men samma ID
        
        // Verifiera att equals och hashCode baseras på ID
        assertEquals(skill1, skill2);
        assertEquals(skill1.hashCode(), skill2.hashCode());
    }
    
    @Test
    void testSkillInequality() {
        // Skapa två kompetenser med olika ID
        Skill skill1 = new Skill();
        skill1.setId(1L);
        skill1.setName("Java");
        
        Skill skill2 = new Skill();
        skill2.setId(2L);
        skill2.setName("Java"); // Samma namn, men olika ID
        
        // Verifiera att equals och hashCode baseras på ID
        assertNotEquals(skill1, skill2);
        assertNotEquals(skill1.hashCode(), skill2.hashCode());
    }
}
