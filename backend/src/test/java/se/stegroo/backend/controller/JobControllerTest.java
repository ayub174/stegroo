package se.stegroo.backend.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import se.stegroo.backend.dto.JobListingDTO;
import se.stegroo.backend.model.JobCategory;
import se.stegroo.backend.model.JobListing;
import se.stegroo.backend.model.Skill;
import se.stegroo.backend.repository.JobCategoryRepository;
import se.stegroo.backend.repository.JobListingRepository;
import se.stegroo.backend.repository.SkillRepository;

import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class JobControllerTest {

    @Mock
    private JobListingRepository jobListingRepository;

    @Mock
    private JobCategoryRepository jobCategoryRepository;

    @Mock
    private SkillRepository skillRepository;

    @InjectMocks
    private JobController jobController;

    private JobListing testJob;
    private JobCategory testCategory;
    private Skill testSkill;
    @BeforeEach
    void setUp() {
        
        // Setup test category
        testCategory = new JobCategory();
        testCategory.setId(1L);
        testCategory.setName("IT Development");
        testCategory.setDescription("Information Technology Development");

        // Setup test skill
        testSkill = new Skill();
        testSkill.setId(1L);
        testSkill.setName("Java");
        testSkill.setDescription("Java programming language");

        // Setup test job
        testJob = new JobListing();
        testJob.setId(1L);
        testJob.setTitle("Senior Java Developer");
        testJob.setDescription("We are looking for an experienced Java developer");
        testJob.setCompanyName("TechCorp AB");
        testJob.setLocation("Stockholm");
        testJob.setEmploymentType("Heltid");
        testJob.setWorkingHoursType("Heltid");
        testJob.setSource("Direct");
        testJob.setStatus(JobListing.Status.ACTIVE);
        testJob.setCreatedAt(LocalDateTime.now());
        testJob.setUpdatedAt(LocalDateTime.now());
        testJob.setCategory(testCategory);
        testJob.setSkills(Set.of(testSkill));
    }

    @Test
    void getAllJobs_ShouldReturnPagedJobs() {
        // Given
        List<JobListing> jobs = Arrays.asList(testJob);
        Page<JobListing> jobPage = new PageImpl<>(jobs, PageRequest.of(0, 20), 1);
        when(jobListingRepository.findAll(any(Pageable.class))).thenReturn(jobPage);

        // When
        ResponseEntity<Page<JobListingDTO>> response = jobController.getAllJobs(0, 20, "createdAt", "desc");

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().getContent().size());
        assertEquals("Senior Java Developer", response.getBody().getContent().get(0).getTitle());
        verify(jobListingRepository).findAll(any(Pageable.class));
    }

    @Test
    void getAllJobs_ShouldHandleException() {
        // Given
        when(jobListingRepository.findAll(any(Pageable.class)))
                .thenThrow(new RuntimeException("Database error"));

        // When
        ResponseEntity<Page<JobListingDTO>> response = jobController.getAllJobs(0, 20, "createdAt", "desc");

        // Then
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        verify(jobListingRepository).findAll(any(Pageable.class));
    }

    @Test
    void getJobById_ShouldReturnJob_WhenJobExists() {
        // Given
        when(jobListingRepository.findById(1L)).thenReturn(Optional.of(testJob));

        // When
        ResponseEntity<JobListingDTO> response = jobController.getJobById(1L);

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Senior Java Developer", response.getBody().getTitle());
        assertEquals("TechCorp AB", response.getBody().getCompanyName());
        assertEquals("Stockholm", response.getBody().getLocation());
        verify(jobListingRepository).findById(1L);
    }

    @Test
    void getJobById_ShouldReturnNotFound_WhenJobDoesNotExist() {
        // Given
        when(jobListingRepository.findById(1L)).thenReturn(Optional.empty());

        // When
        ResponseEntity<JobListingDTO> response = jobController.getJobById(1L);

        // Then
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        verify(jobListingRepository).findById(1L);
    }

    @Test
    void getJobById_ShouldHandleException() {
        // Given
        when(jobListingRepository.findById(1L))
                .thenThrow(new RuntimeException("Database error"));

        // When
        ResponseEntity<JobListingDTO> response = jobController.getJobById(1L);

        // Then
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        verify(jobListingRepository).findById(1L);
    }

    @Test
    void createJob_ShouldCreateAndReturnJob() {
        // Given
        JobController.CreateJobRequest request = new JobController.CreateJobRequest();
        request.setTitle("Frontend Developer");
        request.setDescription("Looking for a React developer");
        request.setCompanyName("StartupTech");
        request.setLocation("Göteborg");
        request.setEmploymentType("Heltid");
        request.setWorkingHoursType("Heltid");
        request.setCategoryId(1L);
        request.setSkillIds(Set.of(1L));

        JobListing savedJob = new JobListing();
        savedJob.setId(2L);
        savedJob.setTitle(request.getTitle());
        savedJob.setDescription(request.getDescription());
        savedJob.setCompanyName(request.getCompanyName());
        savedJob.setLocation(request.getLocation());
        savedJob.setEmploymentType(request.getEmploymentType());
        savedJob.setWorkingHoursType(request.getWorkingHoursType());
        savedJob.setSource("Direct");
        savedJob.setStatus(JobListing.Status.ACTIVE);
        savedJob.setCreatedAt(LocalDateTime.now());
        savedJob.setUpdatedAt(LocalDateTime.now());
        savedJob.setCategory(testCategory);
        savedJob.setSkills(Set.of(testSkill));

        when(jobCategoryRepository.findById(1L)).thenReturn(Optional.of(testCategory));
        when(skillRepository.findAllById(Set.of(1L))).thenReturn(Arrays.asList(testSkill));
        when(jobListingRepository.save(any(JobListing.class))).thenReturn(savedJob);

        // When
        ResponseEntity<JobListingDTO> response = jobController.createJob(request);

        // Then
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Frontend Developer", response.getBody().getTitle());
        assertEquals("StartupTech", response.getBody().getCompanyName());
        assertEquals("Direct", response.getBody().getSource());
        verify(jobListingRepository).save(any(JobListing.class));
        verify(jobCategoryRepository).findById(1L);
        verify(skillRepository).findAllById(Set.of(1L));
    }

    @Test
    void createJob_ShouldCreateJobWithoutCategoryAndSkills() {
        // Given
        JobController.CreateJobRequest request = new JobController.CreateJobRequest();
        request.setTitle("Backend Developer");
        request.setDescription("Looking for a Spring Boot developer");
        request.setCompanyName("Enterprise Solutions");
        request.setLocation("Malmö");
        request.setEmploymentType("Heltid");
        request.setWorkingHoursType("Heltid");

        JobListing savedJob = new JobListing();
        savedJob.setId(3L);
        savedJob.setTitle(request.getTitle());
        savedJob.setDescription(request.getDescription());
        savedJob.setCompanyName(request.getCompanyName());
        savedJob.setLocation(request.getLocation());
        savedJob.setEmploymentType(request.getEmploymentType());
        savedJob.setWorkingHoursType(request.getWorkingHoursType());
        savedJob.setSource("Direct");
        savedJob.setStatus(JobListing.Status.ACTIVE);
        savedJob.setCreatedAt(LocalDateTime.now());
        savedJob.setUpdatedAt(LocalDateTime.now());
        savedJob.setSkills(new HashSet<>());

        when(jobListingRepository.save(any(JobListing.class))).thenReturn(savedJob);

        // When
        ResponseEntity<JobListingDTO> response = jobController.createJob(request);

        // Then
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Backend Developer", response.getBody().getTitle());
        verify(jobListingRepository).save(any(JobListing.class));
        verify(jobCategoryRepository, never()).findById(anyLong());
        verify(skillRepository, never()).findAllById(any());
    }

    @Test
    void createJob_ShouldHandleException() {
        // Given
        JobController.CreateJobRequest request = new JobController.CreateJobRequest();
        request.setTitle("Test Job");
        request.setDescription("Test Description");
        request.setCompanyName("Test Company");
        request.setLocation("Test Location");

        when(jobListingRepository.save(any(JobListing.class)))
                .thenThrow(new RuntimeException("Database error"));

        // When
        ResponseEntity<JobListingDTO> response = jobController.createJob(request);

        // Then
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        verify(jobListingRepository).save(any(JobListing.class));
    }

    @Test
    void updateJob_ShouldUpdateAndReturnJob_WhenJobExists() {
        // Given
        JobController.UpdateJobRequest request = new JobController.UpdateJobRequest();
        request.setTitle("Updated Java Developer");
        request.setDescription("Updated description");
        request.setLocation("Updated Location");
        request.setStatus(JobListing.Status.ACTIVE);

        JobListing updatedJob = new JobListing();
        updatedJob.setId(1L);
        updatedJob.setTitle("Updated Java Developer");
        updatedJob.setDescription("Updated description");
        updatedJob.setCompanyName("TechCorp AB");
        updatedJob.setLocation("Updated Location");
        updatedJob.setEmploymentType("Heltid");
        updatedJob.setWorkingHoursType("Heltid");
        updatedJob.setSource("Direct");
        updatedJob.setStatus(JobListing.Status.ACTIVE);
        updatedJob.setCreatedAt(LocalDateTime.now());
        updatedJob.setUpdatedAt(LocalDateTime.now());
        updatedJob.setSkills(new HashSet<>());

        when(jobListingRepository.findById(1L)).thenReturn(Optional.of(testJob));
        when(jobListingRepository.save(any(JobListing.class))).thenReturn(updatedJob);

        // When
        ResponseEntity<JobListingDTO> response = jobController.updateJob(1L, request);

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Updated Java Developer", response.getBody().getTitle());
        assertEquals("Updated description", response.getBody().getDescription());
        assertEquals("Updated Location", response.getBody().getLocation());
        verify(jobListingRepository).findById(1L);
        verify(jobListingRepository).save(any(JobListing.class));
    }

    @Test
    void updateJob_ShouldReturnNotFound_WhenJobDoesNotExist() {
        // Given
        JobController.UpdateJobRequest request = new JobController.UpdateJobRequest();
        request.setTitle("Updated Title");

        when(jobListingRepository.findById(1L)).thenReturn(Optional.empty());

        // When
        ResponseEntity<JobListingDTO> response = jobController.updateJob(1L, request);

        // Then
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        verify(jobListingRepository).findById(1L);
        verify(jobListingRepository, never()).save(any(JobListing.class));
    }

    @Test
    void updateJob_ShouldHandleException() {
        // Given
        JobController.UpdateJobRequest request = new JobController.UpdateJobRequest();
        request.setTitle("Updated Title");

        when(jobListingRepository.findById(1L)).thenReturn(Optional.of(testJob));
        when(jobListingRepository.save(any(JobListing.class)))
                .thenThrow(new RuntimeException("Database error"));

        // When
        ResponseEntity<JobListingDTO> response = jobController.updateJob(1L, request);

        // Then
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        verify(jobListingRepository).findById(1L);
        verify(jobListingRepository).save(any(JobListing.class));
    }

    @Test
    void deleteJob_ShouldMarkJobAsRemoved_WhenJobExists() {
        // Given
        when(jobListingRepository.findById(1L)).thenReturn(Optional.of(testJob));
        when(jobListingRepository.save(any(JobListing.class))).thenReturn(testJob);

        // When
        ResponseEntity<Void> response = jobController.deleteJob(1L);

        // Then
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(jobListingRepository).findById(1L);
        verify(jobListingRepository).save(any(JobListing.class));
    }

    @Test
    void deleteJob_ShouldReturnNotFound_WhenJobDoesNotExist() {
        // Given
        when(jobListingRepository.findById(1L)).thenReturn(Optional.empty());

        // When
        ResponseEntity<Void> response = jobController.deleteJob(1L);

        // Then
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        verify(jobListingRepository).findById(1L);
        verify(jobListingRepository, never()).save(any(JobListing.class));
    }

    @Test
    void deleteJob_ShouldHandleException() {
        // Given
        when(jobListingRepository.findById(1L)).thenReturn(Optional.of(testJob));
        when(jobListingRepository.save(any(JobListing.class)))
                .thenThrow(new RuntimeException("Database error"));

        // When
        ResponseEntity<Void> response = jobController.deleteJob(1L);

        // Then
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        verify(jobListingRepository).findById(1L);
        verify(jobListingRepository).save(any(JobListing.class));
    }

    @Test
    void getJobsByStatus_ShouldReturnJobsWithSpecifiedStatus() {
        // Given
        List<JobListing> activeJobs = Arrays.asList(testJob);
        when(jobListingRepository.findByStatus(JobListing.Status.ACTIVE)).thenReturn(activeJobs);

        // When
        ResponseEntity<List<JobListingDTO>> response = jobController.getJobsByStatus(JobListing.Status.ACTIVE);

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
        assertEquals("Senior Java Developer", response.getBody().get(0).getTitle());
        verify(jobListingRepository).findByStatus(JobListing.Status.ACTIVE);
    }

    @Test
    void getJobsByStatus_ShouldReturnEmptyList_WhenNoJobsWithStatus() {
        // Given
        when(jobListingRepository.findByStatus(JobListing.Status.EXPIRED)).thenReturn(Collections.emptyList());

        // When
        ResponseEntity<List<JobListingDTO>> response = jobController.getJobsByStatus(JobListing.Status.EXPIRED);

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().isEmpty());
        verify(jobListingRepository).findByStatus(JobListing.Status.EXPIRED);
    }

    @Test
    void getJobsByStatus_ShouldHandleException() {
        // Given
        when(jobListingRepository.findByStatus(JobListing.Status.ACTIVE))
                .thenThrow(new RuntimeException("Database error"));

        // When
        ResponseEntity<List<JobListingDTO>> response = jobController.getJobsByStatus(JobListing.Status.ACTIVE);

        // Then
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        verify(jobListingRepository).findByStatus(JobListing.Status.ACTIVE);
    }

    @Test
    void convertToDTO_ShouldConvertJobListingToDTO() {
        // Given - testJob is already set up with category and skills

        // When - using reflection to access private method
        try {
            java.lang.reflect.Method convertToDTOMethod = JobController.class.getDeclaredMethod("convertToDTO", JobListing.class);
            convertToDTOMethod.setAccessible(true);
            JobListingDTO result = (JobListingDTO) convertToDTOMethod.invoke(jobController, testJob);

            // Then
            assertNotNull(result);
            assertEquals(testJob.getId(), result.getId());
            assertEquals(testJob.getTitle(), result.getTitle());
            assertEquals(testJob.getDescription(), result.getDescription());
            assertEquals(testJob.getCompanyName(), result.getCompanyName());
            assertEquals(testJob.getLocation(), result.getLocation());
            assertEquals(testJob.getEmploymentType(), result.getEmploymentType());
            assertEquals(testJob.getSource(), result.getSource());
            
            // Check category conversion
            assertNotNull(result.getCategory());
            assertEquals(testCategory.getId(), result.getCategory().getId());
            assertEquals(testCategory.getName(), result.getCategory().getName());
            
            // Check skills conversion
            assertNotNull(result.getSkills());
            assertEquals(1, result.getSkills().size());
            JobListingDTO.SkillDTO skillDTO = result.getSkills().iterator().next();
            assertEquals(testSkill.getId(), skillDTO.getId());
            assertEquals(testSkill.getName(), skillDTO.getName());
            
        } catch (Exception e) {
            fail("Failed to test convertToDTO method: " + e.getMessage());
        }
    }

    @Test
    void convertToDTO_ShouldHandleNullCategoryAndEmptySkills() {
        // Given
        JobListing jobWithoutCategoryAndSkills = new JobListing();
        jobWithoutCategoryAndSkills.setId(2L);
        jobWithoutCategoryAndSkills.setTitle("Test Job");
        jobWithoutCategoryAndSkills.setDescription("Test Description");
        jobWithoutCategoryAndSkills.setCompanyName("Test Company");
        jobWithoutCategoryAndSkills.setLocation("Test Location");
        jobWithoutCategoryAndSkills.setSource("Test Source");
        jobWithoutCategoryAndSkills.setEmploymentType("Heltid");
        jobWithoutCategoryAndSkills.setSkills(new HashSet<>());

        // When - using reflection to access private method
        try {
            java.lang.reflect.Method convertToDTOMethod = JobController.class.getDeclaredMethod("convertToDTO", JobListing.class);
            convertToDTOMethod.setAccessible(true);
            JobListingDTO result = (JobListingDTO) convertToDTOMethod.invoke(jobController, jobWithoutCategoryAndSkills);

            // Then
            assertNotNull(result);
            assertEquals(jobWithoutCategoryAndSkills.getId(), result.getId());
            assertEquals(jobWithoutCategoryAndSkills.getTitle(), result.getTitle());
            assertNull(result.getCategory());
            assertNotNull(result.getSkills());
            assertTrue(result.getSkills().isEmpty());
            
        } catch (Exception e) {
            fail("Failed to test convertToDTO method with null category: " + e.getMessage());
        }
    }
}
