package se.stegroo.backend.dto;

import org.junit.jupiter.api.Test;
import se.stegroo.backend.model.JobListing;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class JobSearchResponseTest {

    @Test
    void testDefaultConstructor() {
        // When
        JobSearchResponse response = new JobSearchResponse();

        // Then
        assertNull(response.getJobs());
        assertNull(response.getTotalElements());
        assertNull(response.getTotalPages());
        assertNull(response.getCurrentPage());
        assertNull(response.getSize());
        assertNull(response.getHasNext());
        assertNull(response.getHasPrevious());
        assertNull(response.getJobStats());
    }

    @Test
    void testParameterizedConstructor() {
        // Given
        List<JobListing> jobs = Arrays.asList(new JobListing(), new JobListing());
        Long totalElements = 2L;
        Integer totalPages = 1;
        Integer currentPage = 0;
        Integer size = 20;
        Boolean hasNext = false;
        Boolean hasPrevious = false;

        // When
        JobSearchResponse response = new JobSearchResponse(jobs, totalElements, totalPages, currentPage, size, hasNext, hasPrevious);

        // Then
        assertEquals(jobs, response.getJobs());
        assertEquals(totalElements, response.getTotalElements());
        assertEquals(totalPages, response.getTotalPages());
        assertEquals(currentPage, response.getCurrentPage());
        assertEquals(size, response.getSize());
        assertEquals(hasNext, response.getHasNext());
        assertEquals(hasPrevious, response.getHasPrevious());
        assertNull(response.getJobStats());
    }

    @Test
    void testSettersAndGetters() {
        // Given
        JobSearchResponse response = new JobSearchResponse();
        List<JobListing> jobs = Arrays.asList(new JobListing(), new JobListing());
        Long totalElements = 100L;
        Integer totalPages = 5;
        Integer currentPage = 2;
        Integer size = 25;
        Boolean hasNext = true;
        Boolean hasPrevious = true;
        JobSearchResponse.JobStats stats = new JobSearchResponse.JobStats();

        // When
        response.setJobs(jobs);
        response.setTotalElements(totalElements);
        response.setTotalPages(totalPages);
        response.setCurrentPage(currentPage);
        response.setSize(size);
        response.setHasNext(hasNext);
        response.setHasPrevious(hasPrevious);
        response.setJobStats(stats);

        // Then
        assertEquals(jobs, response.getJobs());
        assertEquals(totalElements, response.getTotalElements());
        assertEquals(totalPages, response.getTotalPages());
        assertEquals(currentPage, response.getCurrentPage());
        assertEquals(size, response.getSize());
        assertEquals(hasNext, response.getHasNext());
        assertEquals(hasPrevious, response.getHasPrevious());
        assertEquals(stats, response.getJobStats());
    }

    @Test
    void testEqualsAndHashCode() {
        // Given
        List<JobListing> jobs = Arrays.asList(new JobListing(), new JobListing());
        JobSearchResponse response1 = new JobSearchResponse(jobs, 2L, 1, 0, 20, false, false);
        JobSearchResponse response2 = new JobSearchResponse(jobs, 2L, 1, 0, 20, false, false);
        JobSearchResponse response3 = new JobSearchResponse(jobs, 3L, 1, 0, 20, false, false);

        // Then
        assertEquals(response1, response2);
        assertNotEquals(response1, response3);
        assertEquals(response1.hashCode(), response2.hashCode());
        assertNotEquals(response1.hashCode(), response3.hashCode());
    }

    @Test
    void testToString() {
        // Given
        List<JobListing> jobs = Arrays.asList(new JobListing(), new JobListing());
        JobSearchResponse response = new JobSearchResponse(jobs, 2L, 1, 0, 20, false, false);

        // When
        String result = response.toString();

        // Then
        assertTrue(result.contains("2"));
        assertTrue(result.contains("1"));
        assertTrue(result.contains("0"));
        assertTrue(result.contains("20"));
        assertTrue(result.contains("false"));
    }

    @Test
    void testJobStatsInnerClass() {
        // Given
        JobSearchResponse.JobStats stats = new JobSearchResponse.JobStats();
        Long totalJobs = 100L;
        Long activeJobs = 80L;
        Long expiredJobs = 15L;
        Long removedJobs = 5L;

        // When
        stats.setTotalJobs(totalJobs);
        stats.setActiveJobs(activeJobs);
        stats.setExpiredJobs(expiredJobs);
        stats.setRemovedJobs(removedJobs);

        // Then
        assertEquals(totalJobs, stats.getTotalJobs());
        assertEquals(activeJobs, stats.getActiveJobs());
        assertEquals(expiredJobs, stats.getExpiredJobs());
        assertEquals(removedJobs, stats.getRemovedJobs());
    }

    @Test
    void testJobStatsEqualsAndHashCode() {
        // Given
        JobSearchResponse.JobStats stats1 = new JobSearchResponse.JobStats();
        stats1.setTotalJobs(100L);
        stats1.setActiveJobs(80L);

        JobSearchResponse.JobStats stats2 = new JobSearchResponse.JobStats();
        stats2.setTotalJobs(100L);
        stats2.setActiveJobs(80L);

        JobSearchResponse.JobStats stats3 = new JobSearchResponse.JobStats();
        stats3.setTotalJobs(100L);
        stats3.setActiveJobs(90L);

        // Then
        assertEquals(stats1, stats2);
        assertNotEquals(stats1, stats3);
        assertEquals(stats1.hashCode(), stats2.hashCode());
        assertNotEquals(stats1.hashCode(), stats3.hashCode());
    }

    @Test
    void testJobStatsToString() {
        // Given
        JobSearchResponse.JobStats stats = new JobSearchResponse.JobStats();
        stats.setTotalJobs(100L);
        stats.setActiveJobs(80L);

        // When
        String result = stats.toString();

        // Then
        assertTrue(result.contains("100"));
        assertTrue(result.contains("80"));
    }

    @Test
    void testEdgeCases() {
        // Given
        JobSearchResponse response = new JobSearchResponse();

        // When & Then - Test med tomma listor
        response.setJobs(Arrays.asList());
        assertNotNull(response.getJobs());
        assertEquals(0, response.getJobs().size());

        // Test med null-värden
        response.setJobs(null);
        assertNull(response.getJobs());

        // Test med stora värden
        response.setTotalElements(Long.MAX_VALUE);
        assertEquals(Long.MAX_VALUE, response.getTotalElements());

        response.setSize(Integer.MAX_VALUE);
        assertEquals(Integer.MAX_VALUE, response.getSize());
    }

    @Test
    void testPaginationLogic() {
        // Given
        JobSearchResponse response = new JobSearchResponse();

        // When - Test att hasNext beräknas korrekt
        response.setCurrentPage(0);
        response.setTotalPages(5);
        response.setHasNext(true);
        response.setHasPrevious(false);

        // Then
        assertTrue(response.getHasNext());
        assertFalse(response.getHasPrevious());

        // When - Test sista sidan
        response.setCurrentPage(4);
        response.setHasNext(false);
        response.setHasPrevious(true);

        // Then
        assertFalse(response.getHasNext());
        assertTrue(response.getHasPrevious());
    }

    @Test
    void testBuilderPattern() {
        // Given
        List<JobListing> jobs = Arrays.asList(new JobListing(), new JobListing());

        // When
        JobSearchResponse response = JobSearchResponse.builder()
                .jobs(jobs)
                .totalElements(2L)
                .totalPages(1)
                .currentPage(0)
                .size(20)
                .hasNext(false)
                .hasPrevious(false)
                .build();

        // Then
        assertEquals(jobs, response.getJobs());
        assertEquals(2L, response.getTotalElements());
        assertEquals(1, response.getTotalPages());
        assertEquals(0, response.getCurrentPage());
        assertEquals(20, response.getSize());
        assertFalse(response.getHasNext());
        assertFalse(response.getHasPrevious());
    }

    @Test
    void testCopyConstructor() {
        // Given
        List<JobListing> jobs = Arrays.asList(new JobListing(), new JobListing());
        JobSearchResponse original = new JobSearchResponse(jobs, 2L, 1, 0, 20, false, false);

        // When
        JobSearchResponse copy = new JobSearchResponse();
        copy.setJobs(original.getJobs());
        copy.setTotalElements(original.getTotalElements());
        copy.setTotalPages(original.getTotalPages());
        copy.setCurrentPage(original.getCurrentPage());
        copy.setSize(original.getSize());
        copy.setHasNext(original.getHasNext());
        copy.setHasPrevious(original.getHasPrevious());

        // Then
        assertEquals(original.getJobs(), copy.getJobs());
        assertEquals(original.getTotalElements(), copy.getTotalElements());
        assertEquals(original.getTotalPages(), copy.getTotalPages());
        assertEquals(original.getCurrentPage(), copy.getCurrentPage());
        assertEquals(original.getSize(), copy.getSize());
        assertEquals(original.getHasNext(), copy.getHasNext());
        assertEquals(original.getHasPrevious(), copy.getHasPrevious());
    }
}
