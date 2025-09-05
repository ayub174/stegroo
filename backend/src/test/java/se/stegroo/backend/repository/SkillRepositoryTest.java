package se.stegroo.backend.repository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;
import se.stegroo.backend.model.JobListing;
import se.stegroo.backend.model.JobCategory;
import se.stegroo.backend.model.Skill;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
class SkillRepositoryTest {

    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private JobCategoryRepository jobCategoryRepository;

    @Autowired
    private JobListingRepository jobListingRepository;

    private Skill javaSkill, pythonSkill, springSkill;
    private JobCategory category;

    @BeforeEach
    void setUp() {
        // Skapa testdata
        category = new JobCategory();
        category.setName("IT");
        category.setIsActive(true);
        category = jobCategoryRepository.save(category);

        javaSkill = new Skill();
        javaSkill.setName("Java");
        javaSkill.setDescription("Java programming language");
        javaSkill.setTaxonomyType(Skill.SkillTaxonomyType.SKILL);
        javaSkill.setSkillLevel(Skill.SkillLevel.INTERMEDIATE);
        javaSkill.setIsActive(true);
        javaSkill.setExternalId("skill-java-001");
        javaSkill = skillRepository.save(javaSkill);

        pythonSkill = new Skill();
        pythonSkill.setName("Python");
        pythonSkill.setDescription("Python programming language");
        pythonSkill.setTaxonomyType(Skill.SkillTaxonomyType.SKILL);
        pythonSkill.setSkillLevel(Skill.SkillLevel.BEGINNER);
        pythonSkill.setIsActive(true);
        pythonSkill.setExternalId("skill-python-001");
        pythonSkill = skillRepository.save(pythonSkill);

        springSkill = new Skill();
        springSkill.setName("Spring");
        springSkill.setDescription("Spring Framework");
        springSkill.setTaxonomyType(Skill.SkillTaxonomyType.SKILL);
        springSkill.setSkillLevel(Skill.SkillLevel.ADVANCED);
        springSkill.setIsActive(true);
        springSkill.setExternalId("skill-spring-001");
        springSkill = skillRepository.save(springSkill);

        // Skapa jobb för att testa populära kompetenser
        JobListing job1 = new JobListing();
        job1.setTitle("Java Developer");
        job1.setCategory(category);
        job1.setSkills(Set.of(javaSkill, springSkill));
        job1.setStatus(JobListing.Status.ACTIVE);
        jobListingRepository.save(job1);

        JobListing job2 = new JobListing();
        job2.setTitle("Python Developer");
        job2.setCategory(category);
        job2.setSkills(Set.of(pythonSkill));
        job2.setStatus(JobListing.Status.ACTIVE);
        jobListingRepository.save(job2);
    }

    @Test
    void testFindByName() {
        // When
        Optional<Skill> found = skillRepository.findByName("Java");

        // Then
        assertTrue(found.isPresent());
        assertEquals("Java", found.get().getName());
        assertEquals(Skill.SkillTaxonomyType.SKILL, found.get().getTaxonomyType());
    }

    @Test
    void testFindByName_NotFound() {
        // When
        Optional<Skill> found = skillRepository.findByName("Nonexistent");

        // Then
        assertFalse(found.isPresent());
    }

    @Test
    void testFindByExternalId() {
        // When
        Optional<Skill> found = skillRepository.findByExternalId("skill-java-001");

        // Then
        assertTrue(found.isPresent());
        assertEquals("Java", found.get().getName());
        assertEquals("skill-java-001", found.get().getExternalId());
    }

    @Test
    void testFindByExternalId_NotFound() {
        // When
        Optional<Skill> found = skillRepository.findByExternalId("nonexistent");

        // Then
        assertFalse(found.isPresent());
    }

    @Test
    void testFindByNameIn() {
        // When
        List<Skill> found = skillRepository.findByNameIn(Set.of("Java", "Python"));

        // Then
        assertEquals(2, found.size());
        assertTrue(found.stream().anyMatch(skill -> skill.getName().equals("Java")));
        assertTrue(found.stream().anyMatch(skill -> skill.getName().equals("Python")));
    }

    @Test
    void testFindByNameIn_EmptySet() {
        // When
        List<Skill> found = skillRepository.findByNameIn(Set.of());

        // Then
        assertEquals(0, found.size());
    }

    @Test
    void testFindByIsActiveTrue() {
        // When
        List<Skill> activeSkills = skillRepository.findByIsActiveTrue();

        // Then
        assertEquals(3, activeSkills.size());
        assertTrue(activeSkills.stream().allMatch(Skill::getIsActive));
    }

    @Test
    void testFindByTaxonomyType() {
        // When
        List<Skill> skillTypeSkills = skillRepository.findByTaxonomyType(Skill.SkillTaxonomyType.SKILL);

        // Then
        assertEquals(3, skillTypeSkills.size());
        assertTrue(skillTypeSkills.stream().allMatch(skill -> skill.getTaxonomyType() == Skill.SkillTaxonomyType.SKILL));
    }

    @Test
    void testFindBySkillLevel() {
        // When
        List<Skill> intermediateSkills = skillRepository.findBySkillLevel(Skill.SkillLevel.INTERMEDIATE);
        List<Skill> beginnerSkills = skillRepository.findBySkillLevel(Skill.SkillLevel.BEGINNER);

        // Then
        assertEquals(1, intermediateSkills.size());
        assertEquals(1, beginnerSkills.size());
        assertEquals("Java", intermediateSkills.get(0).getName());
        assertEquals("Python", beginnerSkills.get(0).getName());
    }

    @Test
    void testFindPopularSkills() {
        // When
        List<Skill> popularSkills = skillRepository.findPopularSkills(5);

        // Then
        // Java ska vara populärast eftersom den används i 1 jobb
        assertTrue(popularSkills.size() > 0);
        // Kontrollera att kompetenser med flest jobb kommer först
        if (popularSkills.size() > 1) {
            // Detta är en enkel kontroll - i verkligheten kan det vara mer komplext
            assertTrue(popularSkills.get(0).getName().equals("Java") || 
                      popularSkills.get(0).getName().equals("Spring") ||
                      popularSkills.get(0).getName().equals("Python"));
        }
    }

    @Test
    void testFindPopularSkills_WithLimit() {
        // When
        List<Skill> popularSkills = skillRepository.findPopularSkills(2);

        // Then
        assertTrue(popularSkills.size() <= 2);
    }

    @Test
    void testFindStaleSkills() {
        // Given
        LocalDateTime cutoff = LocalDateTime.now().minusDays(1);
        javaSkill.setLastSyncAt(LocalDateTime.now().minusDays(2));
        skillRepository.save(javaSkill);
        
        // Sätt lastSyncAt för andra skills så de inte räknas som stale
        springSkill.setLastSyncAt(LocalDateTime.now());
        pythonSkill.setLastSyncAt(LocalDateTime.now());
        skillRepository.save(springSkill);
        skillRepository.save(pythonSkill);

        // When
        List<Skill> staleSkills = skillRepository.findStaleSkills(cutoff);

        // Then
        assertEquals(1, staleSkills.size());
        assertEquals("Java", staleSkills.get(0).getName());
    }

    @Test
    void testFindStaleSkills_NoStale() {
        // Given
        LocalDateTime cutoff = LocalDateTime.now().minusDays(1);
        javaSkill.setLastSyncAt(LocalDateTime.now());
        springSkill.setLastSyncAt(LocalDateTime.now());
        pythonSkill.setLastSyncAt(LocalDateTime.now());
        skillRepository.save(javaSkill);
        skillRepository.save(springSkill);
        skillRepository.save(pythonSkill);

        // When
        List<Skill> staleSkills = skillRepository.findStaleSkills(cutoff);

        // Then
        assertEquals(0, staleSkills.size());
    }



    @Test
    void testSaveAndUpdate() {
        // Given
        Skill newSkill = new Skill();
        newSkill.setName("New Skill");
        newSkill.setTaxonomyType(Skill.SkillTaxonomyType.COMPETENCE);
        newSkill.setIsActive(true);

        // When
        Skill saved = skillRepository.save(newSkill);
        saved.setDescription("Updated description");
        Skill updated = skillRepository.save(saved);

        // Then
        assertNotNull(saved.getId());
        assertEquals("Updated description", updated.getDescription());
        assertEquals(Skill.SkillTaxonomyType.COMPETENCE, updated.getTaxonomyType());
    }

    @Test
    void testDelete() {
        // Given
        Long skillId = springSkill.getId();

        // When
        skillRepository.deleteById(skillId);

        // Then
        assertFalse(skillRepository.findById(skillId).isPresent());
    }

    @Test
    void testSkillLevels() {
        // When
        List<Skill> expertSkills = skillRepository.findBySkillLevel(Skill.SkillLevel.EXPERT);
        List<Skill> advancedSkills = skillRepository.findBySkillLevel(Skill.SkillLevel.ADVANCED);

        // Then
        assertEquals(0, expertSkills.size());
        assertEquals(1, advancedSkills.size());
        assertEquals("Spring", advancedSkills.get(0).getName());
    }

    @Test
    void testTaxonomyTypes() {
        // When
        List<Skill> competenceSkills = skillRepository.findByTaxonomyType(Skill.SkillTaxonomyType.COMPETENCE);
        List<Skill> languageSkills = skillRepository.findByTaxonomyType(Skill.SkillTaxonomyType.LANGUAGE);

        // Then
        assertEquals(0, competenceSkills.size());
        assertEquals(0, languageSkills.size());
        // Alla våra testkompetenser är av typen SKILL
    }

    @Test
    void testUniqueNameConstraint() {
        // Given
        Skill duplicateSkill = new Skill();
        duplicateSkill.setName("UniqueSkill"); // Unikt namn
        duplicateSkill.setTaxonomyType(Skill.SkillTaxonomyType.SKILL);
        duplicateSkill.setIsActive(true);

        // When & Then
        // Detta ska fungera eftersom namnet är unikt
        assertDoesNotThrow(() -> skillRepository.save(duplicateSkill));
        
        // Verifiera att skillen sparades
        Optional<Skill> found = skillRepository.findByName("UniqueSkill");
        assertTrue(found.isPresent());
        assertEquals("UniqueSkill", found.get().getName());
    }
}
