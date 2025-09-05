package se.stegroo.backend.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import se.stegroo.backend.dto.JobSearchRequest;
import se.stegroo.backend.dto.JobSearchResponse;
import se.stegroo.backend.model.JobCategory;
import se.stegroo.backend.model.JobListing;
import se.stegroo.backend.model.Skill;
import se.stegroo.backend.service.JobSearchService;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class JobSearchControllerTest {

    @Mock
    private JobSearchService jobSearchService;

    @InjectMocks
    private JobSearchController jobSearchController;

    private JobListing job1, job2;
    private JobSearchResponse searchResponse;
    private JobCategory category;
    private Skill skill;

    @BeforeEach
    void setUp() {
        job1 = new JobListing();
        job1.setTitle("Java Developer");
        job1.setDescription("We are looking for a Java developer");
        job1.setLocation("Stockholm");
        job1.setStatus(JobListing.Status.ACTIVE);

        job2 = new JobListing();
        job2.setTitle("Frontend Developer");
        job2.setDescription("We are looking for a Frontend developer");
        job2.setLocation("Göteborg");
        job2.setStatus(JobListing.Status.ACTIVE);

        category = new JobCategory();
        category.setName("IT");
        category.setId(1L);

        skill = new Skill();
        skill.setName("Java");
        skill.setId(1L);

        searchResponse = new JobSearchResponse();
        searchResponse.setJobs(Arrays.asList(job1, job2));
        searchResponse.setCurrentPage(0);
        searchResponse.setSize(10);
        searchResponse.setTotalElements(2L);
        searchResponse.setTotalPages(1);
        searchResponse.setHasNext(false);
        searchResponse.setHasPrevious(false);
    }

    @Test
    void searchJobs_ShouldReturnJobSearchResponse() {
        // Given
        JobSearchRequest request = new JobSearchRequest("developer", "Stockholm", 1L);
        when(jobSearchService.searchJobs(any(JobSearchRequest.class))).thenReturn(searchResponse);

        // When
        ResponseEntity<JobSearchResponse> response = jobSearchController.searchJobs(request);

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(2, response.getBody().getJobs().size());
        verify(jobSearchService).searchJobs(request);
    }

    @Test
    void searchJobs_ShouldHandleException() {
        // Given
        JobSearchRequest request = new JobSearchRequest("developer", "Stockholm", 1L);
        when(jobSearchService.searchJobs(any(JobSearchRequest.class)))
                .thenThrow(new RuntimeException("Database error"));

        // When
        ResponseEntity<JobSearchResponse> response = jobSearchController.searchJobs(request);

        // Then
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        verify(jobSearchService).searchJobs(request);
    }

    @Test
    void searchJobsSimple_ShouldReturnJobSearchResponse() {
        // Given
        when(jobSearchService.searchJobs(any(JobSearchRequest.class))).thenReturn(searchResponse);

        // When
        ResponseEntity<JobSearchResponse> response = jobSearchController.searchJobsSimple(
                "developer", "Stockholm", 1L, 0, 10);

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(2, response.getBody().getJobs().size());
        verify(jobSearchService).searchJobs(any(JobSearchRequest.class));
    }

    @Test
    void searchJobsSimple_ShouldHandleException() {
        // Given
        when(jobSearchService.searchJobs(any(JobSearchRequest.class)))
                .thenThrow(new RuntimeException("Service error"));

        // When
        ResponseEntity<JobSearchResponse> response = jobSearchController.searchJobsSimple(
                "developer", "Stockholm", 1L, 0, 10);

        // Then
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        verify(jobSearchService).searchJobs(any(JobSearchRequest.class));
    }

    @Test
    void findJobsBySkills_ShouldReturnJobList() {
        // Given
        List<JobListing> jobs = Arrays.asList(job1, job2);
        when(jobSearchService.findJobsBySkills(any())).thenReturn(jobs);

        // When
        ResponseEntity<List<JobListing>> response = jobSearchController.findJobsBySkills("Java,Spring");

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(2, response.getBody().size());
        verify(jobSearchService).findJobsBySkills(Set.of("Java", "Spring"));
    }

    @Test
    void findJobsBySkills_ShouldHandleException() {
        // Given
        when(jobSearchService.findJobsBySkills(any()))
                .thenThrow(new RuntimeException("Skill search error"));

        // When
        ResponseEntity<List<JobListing>> response = jobSearchController.findJobsBySkills("Java,Spring");

        // Then
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        verify(jobSearchService).findJobsBySkills(Set.of("Java", "Spring"));
    }

    @Test
    void findJobsInCategoryHierarchy_ShouldReturnJobList() {
        // Given
        List<JobListing> jobs = Arrays.asList(job1, job2);
        when(jobSearchService.findJobsInCategoryHierarchy(1L)).thenReturn(jobs);

        // When
        ResponseEntity<List<JobListing>> response = jobSearchController.findJobsInCategoryHierarchy(1L);

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(2, response.getBody().size());
        verify(jobSearchService).findJobsInCategoryHierarchy(1L);
    }

    @Test
    void findJobsInCategoryHierarchy_ShouldHandleException() {
        // Given
        when(jobSearchService.findJobsInCategoryHierarchy(1L))
                .thenThrow(new RuntimeException("Category search error"));

        // When
        ResponseEntity<List<JobListing>> response = jobSearchController.findJobsInCategoryHierarchy(1L);

        // Then
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        verify(jobSearchService).findJobsInCategoryHierarchy(1L);
    }

    @Test
    void findSimilarJobs_ShouldReturnJobList() {
        // Given
        List<JobListing> jobs = Arrays.asList(job1, job2);
        when(jobSearchService.findSimilarJobs(1L, 5)).thenReturn(jobs);

        // When
        ResponseEntity<List<JobListing>> response = jobSearchController.findSimilarJobs(1L, 5);

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(2, response.getBody().size());
        verify(jobSearchService).findSimilarJobs(1L, 5);
    }

    @Test
    void findSimilarJobs_ShouldHandleException() {
        // Given
        when(jobSearchService.findSimilarJobs(1L, 5))
                .thenThrow(new RuntimeException("Similar jobs error"));

        // When
        ResponseEntity<List<JobListing>> response = jobSearchController.findSimilarJobs(1L, 5);

        // Then
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        verify(jobSearchService).findSimilarJobs(1L, 5);
    }

    @Test
    void getJobStats_ShouldReturnJobStats() {
        // Given
        JobSearchResponse.JobStats stats = new JobSearchResponse.JobStats();
        stats.setTotalJobs(100L);
        stats.setActiveJobs(80L);
        stats.setExpiredJobs(15L);
        stats.setRemovedJobs(5L);
        
        searchResponse.setJobStats(stats);
        when(jobSearchService.getJobStats()).thenReturn(stats);

        // When
        ResponseEntity<JobSearchResponse.JobStats> response = jobSearchController.getJobStats();

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(100L, response.getBody().getTotalJobs());
        assertEquals(80L, response.getBody().getActiveJobs());
        verify(jobSearchService).getJobStats();
    }

    @Test
    void getJobStats_ShouldHandleException() {
        // Given
        when(jobSearchService.getJobStats())
                .thenThrow(new RuntimeException("Stats error"));

        // When
        ResponseEntity<JobSearchResponse.JobStats> response = jobSearchController.getJobStats();

        // Then
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        verify(jobSearchService).getJobStats();
    }

    @Test
    void getPopularCategories_ShouldReturnCategoryList() {
        // Given
        List<JobCategory> categories = Arrays.asList(category);
        when(jobSearchService.getPopularCategories(5)).thenReturn(categories);

        // When
        ResponseEntity<List<JobCategory>> response = jobSearchController.getPopularCategories(5);

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
        assertEquals("IT", response.getBody().get(0).getName());
        verify(jobSearchService).getPopularCategories(5);
    }

    @Test
    void getPopularCategories_ShouldHandleException() {
        // Given
        when(jobSearchService.getPopularCategories(5))
                .thenThrow(new RuntimeException("Popular categories error"));

        // When
        ResponseEntity<List<JobCategory>> response = jobSearchController.getPopularCategories(5);

        // Then
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        verify(jobSearchService).getPopularCategories(5);
    }

    @Test
    void getPopularSkills_ShouldReturnSkillList() {
        // Given
        List<Skill> skills = Arrays.asList(skill);
        when(jobSearchService.getPopularSkills(5)).thenReturn(skills);

        // When
        ResponseEntity<List<Skill>> response = jobSearchController.getPopularSkills(5);

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
        assertEquals("Java", response.getBody().get(0).getName());
        verify(jobSearchService).getPopularSkills(5);
    }

    @Test
    void getPopularSkills_ShouldHandleException() {
        // Given
        when(jobSearchService.getPopularSkills(5))
                .thenThrow(new RuntimeException("Popular skills error"));

        // When
        ResponseEntity<List<Skill>> response = jobSearchController.getPopularSkills(5);

        // Then
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        verify(jobSearchService).getPopularSkills(5);
    }

    @Test
    void getAvailableFilters_ShouldReturnFilterMap() {
        // Given
        JobSearchResponse.JobStats stats = new JobSearchResponse.JobStats();
        stats.setTotalJobs(100L);
        List<JobCategory> popularCategories = Arrays.asList(category);
        List<Skill> popularSkills = Arrays.asList(skill);
        
        when(jobSearchService.getJobStats()).thenReturn(stats);
        when(jobSearchService.getPopularCategories(5)).thenReturn(popularCategories);
        when(jobSearchService.getPopularSkills(10)).thenReturn(popularSkills);

        // When
        ResponseEntity<java.util.Map<String, Object>> response = jobSearchController.getAvailableFilters();

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().containsKey("stats"));
        assertTrue(response.getBody().containsKey("popularCategories"));
        assertTrue(response.getBody().containsKey("popularSkills"));
        verify(jobSearchService).getJobStats();
        verify(jobSearchService).getPopularCategories(5);
        verify(jobSearchService).getPopularSkills(10);
    }
}
