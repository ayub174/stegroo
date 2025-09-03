package se.stegroo.backend.repository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.test.context.ActiveProfiles;
import se.stegroo.backend.model.JobCategory;
import se.stegroo.backend.model.JobListing;
import se.stegroo.backend.model.Skill;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
class JobListingRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private JobListingRepository jobListingRepository;

    @Autowired
    private JobCategoryRepository jobCategoryRepository;

    @Autowired
    private SkillRepository skillRepository;

    private JobCategory category;
    private Skill skill;
    private JobListing job1, job2, job3;

    @BeforeEach
    void setUp() {
        // Skapa testdata
        category = new JobCategory();
        category.setName("IT");
        category.setIsActive(true);
        category = jobCategoryRepository.save(category);

        skill = new Skill();
        skill.setName("Java");
        skill.setIsActive(true);
        skill = skillRepository.save(skill);

        job1 = new JobListing();
        job1.setTitle("Java Developer");
        job1.setDescription("We are looking for a Java developer");
        job1.setLocation("Stockholm");
        job1.setStatus(JobListing.Status.ACTIVE);
        job1.setExternalId("ext-1");
        job1.setCategory(category);
        job1.setSkills(new java.util.HashSet<>(Set.of(skill)));
        job1.setCreatedAt(LocalDateTime.now());
        job1.setLastModified(LocalDateTime.now());
        job1 = jobListingRepository.save(job1);

        job2 = new JobListing();
        job2.setTitle("Frontend Developer");
        job2.setDescription("We are looking for a Frontend developer");
        job2.setLocation("Göteborg");
        job2.setStatus(JobListing.Status.ACTIVE);
        job2.setExternalId("ext-2");
        job2.setCategory(category);
        job2.setCreatedAt(LocalDateTime.now());
        job2.setLastModified(LocalDateTime.now());
        job2 = jobListingRepository.save(job2);

        job3 = new JobListing();
        job3.setTitle("Python Developer");
        job3.setDescription("We are looking for a Python developer");
        job3.setLocation("Malmö");
        job3.setStatus(JobListing.Status.EXPIRED);
        job3.setExternalId("ext-3");
        job3.setCategory(category);
        job3.setCreatedAt(LocalDateTime.now().minusDays(30));
        job3.setLastModified(LocalDateTime.now().minusDays(30));
        job3 = jobListingRepository.save(job3);
    }

    @Test
    void testFindByExternalId() {
        // When
        Optional<JobListing> found = jobListingRepository.findByExternalId("ext-1");

        // Then
        assertTrue(found.isPresent());
        assertEquals("Java Developer", found.get().getTitle());
        assertEquals("Stockholm", found.get().getLocation());
    }

    @Test
    void testFindByExternalId_NotFound() {
        // When
        Optional<JobListing> found = jobListingRepository.findByExternalId("nonexistent");

        // Then
        assertFalse(found.isPresent());
    }

    @Test
    void testFindByStatus() {
        // When
        List<JobListing> activeJobs = jobListingRepository.findByStatus(JobListing.Status.ACTIVE);
        List<JobListing> expiredJobs = jobListingRepository.findByStatus(JobListing.Status.EXPIRED);

        // Then
        assertEquals(2, activeJobs.size());
        assertEquals(1, expiredJobs.size());
        assertTrue(activeJobs.stream().allMatch(job -> job.getStatus() == JobListing.Status.ACTIVE));
        assertTrue(expiredJobs.stream().allMatch(job -> job.getStatus() == JobListing.Status.EXPIRED));
    }

    @Test
    void testCountByStatus() {
        // When
        long activeCount = jobListingRepository.countByStatus(JobListing.Status.ACTIVE);
        long expiredCount = jobListingRepository.countByStatus(JobListing.Status.EXPIRED);

        // Then
        assertEquals(2, activeCount);
        assertEquals(1, expiredCount);
    }

    @Test
    void testFindByLocationContaining() {
        // When
        List<JobListing> stockholmJobs = jobListingRepository.findByLocationContaining("Stockholm");
        List<JobListing> goteborgJobs = jobListingRepository.findByLocationContaining("Göteborg");

        // Then
        assertEquals(1, stockholmJobs.size());
        assertEquals(1, goteborgJobs.size());
        assertEquals("Stockholm", stockholmJobs.get(0).getLocation());
        assertEquals("Göteborg", goteborgJobs.get(0).getLocation());
    }

    @Test
    void testFindByFullTextSearch() {
        // When
        List<JobListing> javaJobs = jobListingRepository.findByFullTextSearch("Java");
        List<JobListing> developerJobs = jobListingRepository.findByFullTextSearch("developer");

        // Then
        assertEquals(1, javaJobs.size());
        assertEquals(2, developerJobs.size()); // Endast aktiva jobb med "developer" i beskrivningen
        assertEquals("Java Developer", javaJobs.get(0).getTitle());
    }

    @Test
    void testFindBySkillsIdInAndStatus() {
        // When
        List<JobListing> jobsWithJavaSkill = jobListingRepository.findBySkillsIdInAndStatus(
                Set.of(skill.getId()), JobListing.Status.ACTIVE);

        // Then
        assertEquals(1, jobsWithJavaSkill.size());
        assertEquals("Java Developer", jobsWithJavaSkill.get(0).getTitle());
    }

    @Test
    void testFindByCategoryIdInAndStatus() {
        // When
        List<JobListing> itJobs = jobListingRepository.findByCategoryIdInAndStatus(
                Set.of(category.getId()), JobListing.Status.ACTIVE);

        // Then
        assertEquals(2, itJobs.size());
        assertTrue(itJobs.stream().allMatch(job -> job.getCategory().getId().equals(category.getId())));
    }

    @Test
    void testFindByCreatedAtAfter() {
        // When
        LocalDateTime cutoff = LocalDateTime.now().minusDays(1);
        List<JobListing> recentJobs = jobListingRepository.findByCreatedAtAfter(cutoff);

        // Then
        assertEquals(3, recentJobs.size()); // Alla jobb skapades nyligen
    }

    @Test
    void testFindByLastModifiedAfter() {
        // When
        LocalDateTime cutoff = LocalDateTime.now().minusDays(1);
        List<JobListing> modifiedJobs = jobListingRepository.findByLastModifiedAfter(cutoff);

        // Then
        // Alla jobb ska vara med eftersom de skapades nyligen
        assertTrue(modifiedJobs.size() >= 2);
    }

    @Test
    void testFindByEmploymentType() {
        // Given
        job1.setEmploymentType("Heltid");
        jobListingRepository.save(job1);

        // When
        List<JobListing> heltidJobs = jobListingRepository.findByEmploymentType("Heltid");

        // Then
        assertEquals(1, heltidJobs.size());
        assertEquals("Heltid", heltidJobs.get(0).getEmploymentType());
    }

    @Test
    void testFindByWorkingHoursType() {
        // Given
        job1.setWorkingHoursType("Dag");
        jobListingRepository.save(job1);

        // When
        List<JobListing> dagJobs = jobListingRepository.findByWorkingHoursType("Dag");

        // Then
        assertEquals(1, dagJobs.size());
        assertEquals("Dag", dagJobs.get(0).getWorkingHoursType());
    }

    @Test
    void testFindJobsNeedingUpdate() {
        // Given - skapa ett jobb som behöver uppdateras
        JobListing oldJob = new JobListing();
        oldJob.setTitle("Old Job");
        oldJob.setDescription("This job needs updating");
        oldJob.setLocation("Stockholm");
        oldJob.setStatus(JobListing.Status.ACTIVE);
        oldJob.setExternalId("ext-old");
        oldJob.setCategory(category);
        oldJob.setCreatedAt(LocalDateTime.now().minusDays(30));
        oldJob.setLastModified(LocalDateTime.now().minusDays(30));
        JobListing savedOldJob = jobListingRepository.save(oldJob);

        // When
        LocalDateTime cutoff = LocalDateTime.now().minusDays(1);
        List<JobListing> jobsNeedingUpdate = jobListingRepository.findJobsNeedingUpdate(cutoff);

        // Then
        // Det gamla jobbet ska vara med eftersom det inte uppdaterades nyligen
        assertTrue(jobsNeedingUpdate.size() >= 1);
        assertTrue(jobsNeedingUpdate.stream().anyMatch(job -> job.getId().equals(savedOldJob.getId())));
    }

    @Test
    void testFindExpiredJobs() {
        // Given
        job1.setDeadline(LocalDateTime.now().minusDays(1));
        jobListingRepository.save(job1);

        // When
        List<JobListing> expiredJobs = jobListingRepository.findExpiredJobs(LocalDateTime.now());

        // Then
        assertEquals(1, expiredJobs.size());
        assertEquals(JobListing.Status.ACTIVE, expiredJobs.get(0).getStatus());
    }

    @Test
    void testFindBySource() {
        // Given
        job1.setSource("arbetsformedlingen");
        jobListingRepository.save(job1);

        // When
        List<JobListing> arbetsformedlingenJobs = jobListingRepository.findBySource("arbetsformedlingen");

        // Then
        assertEquals(1, arbetsformedlingenJobs.size());
        assertEquals("arbetsformedlingen", arbetsformedlingenJobs.get(0).getSource());
    }

    @Test
    void testFindByCompanyNameContaining() {
        // Given
        job1.setCompanyName("TechCorp");
        jobListingRepository.save(job1);

        // When
        List<JobListing> techCorpJobs = jobListingRepository.findByCompanyNameContaining("TechCorp");

        // Then
        assertEquals(1, techCorpJobs.size());
        assertEquals("TechCorp", techCorpJobs.get(0).getCompanyName());
    }

    @Test
    void testFindBySkillId() {
        // Given
        Pageable pageable = PageRequest.of(0, 10);

        // When
        Page<JobListing> javaSkillJobs = jobListingRepository.findBySkillId(skill.getId(), pageable);

        // Then
        assertEquals(1, javaSkillJobs.getTotalElements());
        assertEquals("Java Developer", javaSkillJobs.getContent().get(0).getTitle());
    }

    @Test
    void testFindBySkillIds() {
        // Given
        Pageable pageable = PageRequest.of(0, 10);
        List<Long> skillIds = List.of(skill.getId());

        // When
        Page<JobListing> javaSkillJobs = jobListingRepository.findBySkillIds(skillIds, 1L, pageable);

        // Then
        assertEquals(1, javaSkillJobs.getTotalElements());
        assertEquals("Java Developer", javaSkillJobs.getContent().get(0).getTitle());
    }

    @Test
    void testFindSimilarJobs() {
        // When
        List<JobListing> similarJobs = jobListingRepository.findSimilarJobs(
                category.getId(), Set.of(skill.getId()), job1.getId(), 5);

        // Then
        // Ska inte innehålla job1 (exkluderat)
        assertTrue(similarJobs.stream().noneMatch(job -> job.getId().equals(job1.getId())));
    }

    @Test
    void testPagination() {
        // Given
        Pageable pageable = PageRequest.of(0, 2);

        // When
        Page<JobListing> page = jobListingRepository.findAll(pageable);

        // Then
        assertEquals(2, page.getContent().size());
        assertEquals(3, page.getTotalElements());
        assertEquals(2, page.getTotalPages());
        assertTrue(page.hasNext());
        assertFalse(page.hasPrevious());
    }

    @Test
    void testSpecificationQuery() {
        // Given
        Specification<JobListing> spec = (root, query, criteriaBuilder) -> 
            criteriaBuilder.equal(root.get("status"), JobListing.Status.ACTIVE);

        // When
        List<JobListing> activeJobs = jobListingRepository.findAll(spec);

        // Then
        assertEquals(2, activeJobs.size());
        assertTrue(activeJobs.stream().allMatch(job -> job.getStatus() == JobListing.Status.ACTIVE));
    }
}
