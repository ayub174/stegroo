package se.stegroo.backend.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import se.stegroo.backend.dto.JobSearchRequest;
import se.stegroo.backend.dto.JobSearchResponse;
import se.stegroo.backend.model.JobCategory;
import se.stegroo.backend.model.JobListing;
import se.stegroo.backend.model.Skill;
import se.stegroo.backend.repository.JobCategoryRepository;
import se.stegroo.backend.repository.JobListingRepository;
import se.stegroo.backend.repository.SkillRepository;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class JobSearchServiceTest {

    @Mock private JobListingRepository jobListingRepository;
    @Mock private JobCategoryRepository jobCategoryRepository;
    @Mock private SkillRepository skillRepository;

    private JobSearchService jobSearchService;

    @BeforeEach
    void setUp() {
        jobSearchService = new JobSearchService(jobListingRepository, jobCategoryRepository, skillRepository);
    }

    @Test
    void testSearchJobs() {
        // Given
        JobSearchRequest request = new JobSearchRequest("developer", "Stockholm", 1L);
        request.setPage(0);
        request.setSize(20);
        request.setSortBy("createdAt");
        request.setSortDirection("desc");

        JobListing mockJob = new JobListing();
        mockJob.setTitle("Java Developer");
        mockJob.setDescription("We are looking for a Java developer");

        Page<JobListing> mockPage = new PageImpl<>(Arrays.asList(mockJob), PageRequest.of(0, 20), 1);

        when(jobListingRepository.findAll(any(Specification.class), any(Pageable.class)))
                .thenReturn(mockPage);

        // When
        JobSearchResponse response = jobSearchService.searchJobs(request);

        // Then
        assertNotNull(response);
        assertEquals(1, response.getJobs().size());
        assertEquals(1L, response.getTotalElements());
        assertEquals(0, response.getCurrentPage());
        assertEquals(20, response.getSize());
        assertFalse(response.getHasNext());
        assertFalse(response.getHasPrevious());

        verify(jobListingRepository).findAll(any(Specification.class), any(Pageable.class));
    }

    @Test
    void testFindJobsBySkills() {
        // Given
        Set<String> skillNames = Set.of("Java", "Spring");
        Skill javaSkill = new Skill();
        javaSkill.setName("Java");

        Skill springSkill = new Skill();
        springSkill.setName("Spring");

        JobListing mockJob = new JobListing();
        mockJob.setTitle("Java Developer");

        when(skillRepository.findByNameIn(skillNames)).thenReturn(Arrays.asList(javaSkill, springSkill));
        when(jobListingRepository.findBySkillsIdInAndStatus(any(Set.class), eq(JobListing.Status.ACTIVE)))
                .thenReturn(Arrays.asList(mockJob));

        // When
        List<JobListing> result = jobSearchService.findJobsBySkills(skillNames);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Java Developer", result.get(0).getTitle());

        verify(skillRepository).findByNameIn(skillNames);
        verify(jobListingRepository).findBySkillsIdInAndStatus(any(Set.class), eq(JobListing.Status.ACTIVE));
    }

    @Test
    void testFindJobsInCategoryHierarchy() {
        // Given
        Long categoryId = 1L;
        JobCategory parentCategory = new JobCategory();
        parentCategory.setName("IT");

        JobCategory childCategory = new JobCategory();
        childCategory.setName("Development");
        childCategory.setParent(parentCategory);

        JobListing mockJob = new JobListing();
        mockJob.setTitle("Java Developer");

        when(jobCategoryRepository.findById(categoryId)).thenReturn(java.util.Optional.of(parentCategory));
        when(jobListingRepository.findByCategoryIdInAndStatus(any(Set.class), eq(JobListing.Status.ACTIVE)))
                .thenReturn(Arrays.asList(mockJob));

        // When
        List<JobListing> result = jobSearchService.findJobsInCategoryHierarchy(categoryId);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());

        verify(jobCategoryRepository).findById(categoryId);
        verify(jobListingRepository).findByCategoryIdInAndStatus(any(Set.class), eq(JobListing.Status.ACTIVE));
    }

    @Test
    void testFindSimilarJobs() {
        // Given
        Long jobId = 1L;
        int limit = 5;

        JobCategory category = new JobCategory();
        category.setName("IT");

        Skill skill = new Skill();
        skill.setName("Java");

        JobListing sourceJob = new JobListing();
        sourceJob.setCategory(category);
        sourceJob.setSkills(new HashSet<>(Arrays.asList(skill)));

        JobListing similarJob = new JobListing();
        similarJob.setTitle("Similar Java Job");

        when(jobListingRepository.findById(jobId)).thenReturn(java.util.Optional.of(sourceJob));
        when(jobListingRepository.findSimilarJobs(any(), any(Set.class), any(), eq(5)))
                .thenReturn(Arrays.asList(similarJob));

        // When
        List<JobListing> result = jobSearchService.findSimilarJobs(jobId, limit);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Similar Java Job", result.get(0).getTitle());

        verify(jobListingRepository).findById(jobId);
        verify(jobListingRepository).findSimilarJobs(any(), any(Set.class), any(), eq(5));
    }

    @Test
    void testGetJobStats() {
        // Given
        when(jobListingRepository.count()).thenReturn(100L);
        when(jobListingRepository.countByStatus(JobListing.Status.ACTIVE)).thenReturn(80L);
        when(jobListingRepository.countByStatus(JobListing.Status.EXPIRED)).thenReturn(15L);
        when(jobListingRepository.countByStatus(JobListing.Status.REMOVED)).thenReturn(5L);

        // When
        JobSearchResponse.JobStats stats = jobSearchService.getJobStats();

        // Then
        assertNotNull(stats);
        assertEquals(100L, stats.getTotalJobs());
        assertEquals(80L, stats.getActiveJobs());
        assertEquals(15L, stats.getExpiredJobs());
        assertEquals(5L, stats.getRemovedJobs());

        verify(jobListingRepository).count();
        verify(jobListingRepository).countByStatus(JobListing.Status.ACTIVE);
        verify(jobListingRepository).countByStatus(JobListing.Status.EXPIRED);
        verify(jobListingRepository).countByStatus(JobListing.Status.REMOVED);
    }

    @Test
    void testGetPopularCategories() {
        // Given
        JobCategory category = new JobCategory();
        category.setName("IT");

        when(jobCategoryRepository.findPopularCategories(10)).thenReturn(Arrays.asList(category));

        // When
        List<JobCategory> result = jobSearchService.getPopularCategories(10);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("IT", result.get(0).getName());

        verify(jobCategoryRepository).findPopularCategories(10);
    }

    @Test
    void testGetPopularSkills() {
        // Given
        Skill skill = new Skill();
        skill.setName("Java");

        when(skillRepository.findPopularSkills(10)).thenReturn(Arrays.asList(skill));

        // When
        List<Skill> result = jobSearchService.getPopularSkills(10);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Java", result.get(0).getName());

        verify(skillRepository).findPopularSkills(10);
    }

    @Test
    void testSearchJobsWithNullRequest() {
        // Given
        JobSearchRequest request = null;

        // When & Then
        assertThrows(NullPointerException.class, () -> jobSearchService.searchJobs(request));
    }

    @Test
    void testFindJobsBySkillsWithEmptySkills() {
        // Given
        Set<String> skillNames = Set.of();

        // When
        List<JobListing> result = jobSearchService.findJobsBySkills(skillNames);

        // Then
        assertNotNull(result);
        assertTrue(result.isEmpty());

        // Should not call repository methods for empty skills
        verify(skillRepository, never()).findByNameIn(any());
        verify(jobListingRepository, never()).findBySkillsIdInAndStatus(any(), any());
    }

    @Test
    void testFindJobsInCategoryHierarchyWithInvalidCategory() {
        // Given
        Long categoryId = 999L;

        when(jobCategoryRepository.findById(categoryId)).thenReturn(java.util.Optional.empty());

        // When
        List<JobListing> result = jobSearchService.findJobsInCategoryHierarchy(categoryId);

        // Then
        assertNotNull(result);
        assertTrue(result.isEmpty());

        verify(jobCategoryRepository).findById(categoryId);
    }

    @Test
    void testFindSimilarJobsWithInvalidJob() {
        // Given
        Long jobId = 999L;

        when(jobListingRepository.findById(jobId)).thenReturn(java.util.Optional.empty());

        // When
        List<JobListing> result = jobSearchService.findSimilarJobs(jobId, 5);

        // Then
        assertNotNull(result);
        assertTrue(result.isEmpty());

        verify(jobListingRepository).findById(jobId);
    }
}
