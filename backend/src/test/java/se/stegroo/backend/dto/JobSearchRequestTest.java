package se.stegroo.backend.dto;

import org.junit.jupiter.api.Test;
import se.stegroo.backend.model.JobListing;

import java.util.HashSet;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

class JobSearchRequestTest {

    @Test
    void testDefaultConstructor() {
        // When
        JobSearchRequest request = new JobSearchRequest();

        // Then
        assertNull(request.getQuery());
        assertNull(request.getLocation());
        assertNull(request.getCategoryId());
        assertNull(request.getSkillIds());
        assertNull(request.getEmploymentType());
        assertNull(request.getWorkingHoursType());
        assertNull(request.getStatus());
        assertNull(request.getDaysBack());
        assertNull(request.getMinSalary());
        assertNull(request.getMaxSalary());
        assertEquals(0, request.getPage());
        assertEquals(20, request.getSize());
        assertEquals("createdAt", request.getSortBy());
        assertEquals("desc", request.getSortDirection());
    }

    @Test
    void testParameterizedConstructor() {
        // Given
        String query = "Java Developer";
        String location = "Stockholm";
        Long categoryId = 1L;

        // When
        JobSearchRequest request = new JobSearchRequest(query, location, categoryId);

        // Then
        assertEquals(query, request.getQuery());
        assertEquals(location, request.getLocation());
        assertEquals(categoryId, request.getCategoryId());
        assertNull(request.getSkillIds());
        assertNull(request.getEmploymentType());
        assertNull(request.getWorkingHoursType());
        assertNull(request.getStatus());
        assertNull(request.getDaysBack());
        assertNull(request.getMinSalary());
        assertNull(request.getMaxSalary());
        assertEquals(0, request.getPage());
        assertEquals(20, request.getSize());
        assertEquals("createdAt", request.getSortBy());
        assertEquals("desc", request.getSortDirection());
    }

    @Test
    void testSettersAndGetters() {
        // Given
        JobSearchRequest request = new JobSearchRequest();
        String query = "Python Developer";
        String location = "Göteborg";
        Long categoryId = 2L;
        Set<Long> skillIds = new HashSet<>();
        skillIds.add(1L);
        skillIds.add(2L);
        String employmentType = "Heltid";
        String workingHoursType = "Dag";
        JobListing.Status status = JobListing.Status.ACTIVE;
        Integer daysBack = 30;
        Integer minSalary = 30000;
        Integer maxSalary = 50000;
        Integer page = 1;
        Integer size = 50;
        String sortBy = "title";
        String sortDirection = "asc";

        // When
        request.setQuery(query);
        request.setLocation(location);
        request.setCategoryId(categoryId);
        request.setSkillIds(skillIds);
        request.setEmploymentType(employmentType);
        request.setWorkingHoursType(workingHoursType);
        request.setStatus(status);
        request.setDaysBack(daysBack);
        request.setMinSalary(minSalary);
        request.setMaxSalary(maxSalary);
        request.setPage(page);
        request.setSize(size);
        request.setSortBy(sortBy);
        request.setSortDirection(sortDirection);

        // Then
        assertEquals(query, request.getQuery());
        assertEquals(location, request.getLocation());
        assertEquals(categoryId, request.getCategoryId());
        assertEquals(skillIds, request.getSkillIds());
        assertEquals(employmentType, request.getEmploymentType());
        assertEquals(workingHoursType, request.getWorkingHoursType());
        assertEquals(status, request.getStatus());
        assertEquals(daysBack, request.getDaysBack());
        assertEquals(minSalary, request.getMinSalary());
        assertEquals(maxSalary, request.getMaxSalary());
        assertEquals(page, request.getPage());
        assertEquals(size, request.getSize());
        assertEquals(sortBy, request.getSortBy());
        assertEquals(sortDirection, request.getSortDirection());
    }

    @Test
    void testEqualsAndHashCode() {
        // Given
        JobSearchRequest request1 = new JobSearchRequest("Java", "Stockholm", 1L);
        JobSearchRequest request2 = new JobSearchRequest("Java", "Stockholm", 1L);
        JobSearchRequest request3 = new JobSearchRequest("Python", "Stockholm", 1L);

        // Then
        assertEquals(request1, request2);
        assertNotEquals(request1, request3);
        assertEquals(request1.hashCode(), request2.hashCode());
        assertNotEquals(request1.hashCode(), request3.hashCode());
    }

    @Test
    void testToString() {
        // Given
        JobSearchRequest request = new JobSearchRequest("Java Developer", "Stockholm", 1L);
        request.setPage(0);
        request.setSize(20);

        // When
        String result = request.toString();

        // Then
        assertTrue(result.contains("Java Developer"));
        assertTrue(result.contains("Stockholm"));
        assertTrue(result.contains("1"));
        assertTrue(result.contains("0"));
        assertTrue(result.contains("20"));
    }

    @Test
    void testCopyConstructor() {
        // Given
        JobSearchRequest original = new JobSearchRequest("Java", "Stockholm", 1L);
        original.setPage(1);
        original.setSize(50);
        original.setSortBy("title");
        original.setSortDirection("asc");

        // When
        JobSearchRequest copy = new JobSearchRequest();
        copy.setQuery(original.getQuery());
        copy.setLocation(original.getLocation());
        copy.setCategoryId(original.getCategoryId());
        copy.setPage(original.getPage());
        copy.setSize(original.getSize());
        copy.setSortBy(original.getSortBy());
        copy.setSortDirection(original.getSortDirection());

        // Then
        assertEquals(original.getQuery(), copy.getQuery());
        assertEquals(original.getLocation(), copy.getLocation());
        assertEquals(original.getCategoryId(), copy.getCategoryId());
        assertEquals(original.getPage(), copy.getPage());
        assertEquals(original.getSize(), copy.getSize());
        assertEquals(original.getSortBy(), copy.getSortBy());
        assertEquals(original.getSortDirection(), copy.getSortDirection());
    }

    @Test
    void testEdgeCases() {
        // Given
        JobSearchRequest request = new JobSearchRequest();

        // When & Then - Test med tomma strängar
        request.setQuery("");
        assertEquals("", request.getQuery());

        // Test med null-värden
        request.setQuery(null);
        assertNull(request.getQuery());

        // Test med negativa värden
        request.setPage(-1);
        assertEquals(-1, request.getPage());

        request.setSize(0);
        assertEquals(0, request.getSize());

        // Test med stora värden
        request.setMaxSalary(Integer.MAX_VALUE);
        assertEquals(Integer.MAX_VALUE, request.getMaxSalary());
    }

    @Test
    void testSkillIdsHandling() {
        // Given
        JobSearchRequest request = new JobSearchRequest();
        Set<Long> skillIds = new HashSet<>();
        skillIds.add(1L);
        skillIds.add(2L);
        skillIds.add(3L);

        // When
        request.setSkillIds(skillIds);

        // Then
        assertEquals(3, request.getSkillIds().size());
        assertTrue(request.getSkillIds().contains(1L));
        assertTrue(request.getSkillIds().contains(2L));
        assertTrue(request.getSkillIds().contains(3L));

        // Test att vi kan modifiera set:et utan att påverka original
        Set<Long> modifiedSkills = request.getSkillIds();
        modifiedSkills.add(4L);
        assertEquals(4, modifiedSkills.size());
        assertEquals(3, request.getSkillIds().size()); // Original ska vara oförändrat
    }
}
