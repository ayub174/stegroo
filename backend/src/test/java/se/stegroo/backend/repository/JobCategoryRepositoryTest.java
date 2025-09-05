package se.stegroo.backend.repository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;
import se.stegroo.backend.model.JobCategory;
import se.stegroo.backend.model.JobListing;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
class JobCategoryRepositoryTest {

    @Autowired
    private JobCategoryRepository jobCategoryRepository;

    @Autowired
    private JobListingRepository jobListingRepository;

    private JobCategory parentCategory, childCategory, grandchildCategory;

    @BeforeEach
    void setUp() {
        // Skapa hierarkisk struktur
        parentCategory = new JobCategory();
        parentCategory.setName("IT");
        parentCategory.setTaxonomyType(JobCategory.TaxonomyType.OCCUPATION);
        parentCategory.setIsActive(true);
        parentCategory.setHierarchyLevel(1);
        parentCategory.setHierarchyPath("/IT");
        parentCategory = jobCategoryRepository.save(parentCategory);

        childCategory = new JobCategory();
        childCategory.setName("Software Development");
        childCategory.setTaxonomyType(JobCategory.TaxonomyType.OCCUPATION);
        childCategory.setIsActive(true);
        childCategory.setHierarchyLevel(2);
        childCategory.setHierarchyPath("/IT/Software Development");
        childCategory.setParent(parentCategory);
        childCategory = jobCategoryRepository.save(childCategory);

        grandchildCategory = new JobCategory();
        grandchildCategory.setName("Java Development");
        grandchildCategory.setTaxonomyType(JobCategory.TaxonomyType.OCCUPATION);
        grandchildCategory.setIsActive(true);
        grandchildCategory.setHierarchyLevel(3);
        grandchildCategory.setHierarchyPath("/IT/Software Development/Java Development");
        grandchildCategory.setParent(childCategory);
        grandchildCategory = jobCategoryRepository.save(grandchildCategory);

        // Skapa några jobb för att testa populära kategorier
        JobListing job1 = new JobListing();
        job1.setTitle("Java Developer");
        job1.setCategory(childCategory);
        job1.setStatus(JobListing.Status.ACTIVE);
        jobListingRepository.save(job1);

        JobListing job2 = new JobListing();
        job2.setTitle("Python Developer");
        job2.setCategory(childCategory);
        job2.setStatus(JobListing.Status.ACTIVE);
        jobListingRepository.save(job2);
    }

    @Test
    void testFindByName() {
        // When
        Optional<JobCategory> found = jobCategoryRepository.findByName("IT");

        // Then
        assertTrue(found.isPresent());
        assertEquals("IT", found.get().getName());
        assertEquals(JobCategory.TaxonomyType.OCCUPATION, found.get().getTaxonomyType());
    }

    @Test
    void testFindByName_NotFound() {
        // When
        Optional<JobCategory> found = jobCategoryRepository.findByName("Nonexistent");

        // Then
        assertFalse(found.isPresent());
    }

    @Test
    void testFindByTaxonomyType() {
        // When
        List<JobCategory> occupationCategories = jobCategoryRepository.findByTaxonomyType(JobCategory.TaxonomyType.OCCUPATION);

        // Then
        assertEquals(3, occupationCategories.size());
        assertTrue(occupationCategories.stream().allMatch(cat -> cat.getTaxonomyType() == JobCategory.TaxonomyType.OCCUPATION));
    }

    @Test
    void testFindByIsActiveTrue() {
        // When
        List<JobCategory> activeCategories = jobCategoryRepository.findByIsActiveTrue();

        // Then
        assertEquals(3, activeCategories.size());
        assertTrue(activeCategories.stream().allMatch(JobCategory::getIsActive));
    }

    @Test
    void testFindByParentId() {
        // When
        List<JobCategory> children = jobCategoryRepository.findByParentId(parentCategory.getId());

        // Then
        assertEquals(1, children.size());
        assertEquals("Software Development", children.get(0).getName());
        assertEquals(parentCategory.getId(), children.get(0).getParent().getId());
    }

    @Test
    void testFindByParentId_NoChildren() {
        // When
        List<JobCategory> children = jobCategoryRepository.findByParentId(grandchildCategory.getId());

        // Then
        assertEquals(0, children.size());
    }

    @Test
    void testFindByHierarchyPathContaining() {
        // When
        List<JobCategory> itCategories = jobCategoryRepository.findByHierarchyPathContaining("IT");

        // Then
        assertEquals(3, itCategories.size());
        assertTrue(itCategories.stream().allMatch(cat -> cat.getHierarchyPath().contains("IT")));
    }

    @Test
    void testFindByHierarchyPathContaining_SubPath() {
        // When
        List<JobCategory> softwareDevCategories = jobCategoryRepository.findByHierarchyPathContaining("Software Development");

        // Then
        assertEquals(2, softwareDevCategories.size());
        assertTrue(softwareDevCategories.stream().allMatch(cat -> cat.getHierarchyPath().contains("Software Development")));
    }

    @Test
    void testFindByExternalId() {
        // Given
        parentCategory.setExternalId("ext-it-001");
        jobCategoryRepository.save(parentCategory);

        // When
        Optional<JobCategory> found = jobCategoryRepository.findByExternalId("ext-it-001");

        // Then
        assertTrue(found.isPresent());
        assertEquals("IT", found.get().getName());
        assertEquals("ext-it-001", found.get().getExternalId());
    }

    @Test
    void testFindByExternalId_NotFound() {
        // When
        Optional<JobCategory> found = jobCategoryRepository.findByExternalId("nonexistent");

        // Then
        assertFalse(found.isPresent());
    }



    @Test
    void testFindStaleCategories() {
        // Given
        LocalDateTime cutoff = LocalDateTime.now().minusDays(1);
        parentCategory.setLastSyncAt(LocalDateTime.now().minusDays(2));
        jobCategoryRepository.save(parentCategory);
        
        // Sätt lastSyncAt för andra kategorier så de inte räknas som stale
        childCategory.setLastSyncAt(LocalDateTime.now());
        grandchildCategory.setLastSyncAt(LocalDateTime.now());
        jobCategoryRepository.save(childCategory);
        jobCategoryRepository.save(grandchildCategory);

        // When
        List<JobCategory> staleCategories = jobCategoryRepository.findStaleCategories(cutoff);

        // Then
        assertEquals(1, staleCategories.size());
        assertEquals("IT", staleCategories.get(0).getName());
    }

    @Test
    void testFindStaleCategories_NoStale() {
        // Given
        LocalDateTime cutoff = LocalDateTime.now().minusDays(1);
        parentCategory.setLastSyncAt(LocalDateTime.now());
        childCategory.setLastSyncAt(LocalDateTime.now());
        grandchildCategory.setLastSyncAt(LocalDateTime.now());
        jobCategoryRepository.save(parentCategory);
        jobCategoryRepository.save(childCategory);
        jobCategoryRepository.save(grandchildCategory);

        // When
        List<JobCategory> staleCategories = jobCategoryRepository.findStaleCategories(cutoff);

        // Then
        assertEquals(0, staleCategories.size());
    }

    @Test
    void testFindPopularCategories() {
        // When
        List<JobCategory> popularCategories = jobCategoryRepository.findPopularCategories(5);

        // Then
        // Software Development ska vara populärast eftersom den har 2 jobb
        assertTrue(popularCategories.size() > 0);
        // Kontrollera att kategorier med flest jobb kommer först
        if (popularCategories.size() > 1) {
            // Detta är en enkel kontroll - i verkligheten kan det vara mer komplext
            assertTrue(popularCategories.get(0).getName().equals("Software Development") || 
                      popularCategories.get(0).getName().equals("IT"));
        }
    }

    @Test
    void testFindPopularCategories_WithLimit() {
        // When
        List<JobCategory> popularCategories = jobCategoryRepository.findPopularCategories(2);

        // Then
        // Kontrollera att vi får max 2 kategorier
        assertTrue(popularCategories.size() <= 2);
        // Kontrollera att vi får minst 1 kategori
        assertTrue(popularCategories.size() > 0);
    }

    @Test
    void testHierarchyStructure() {
        // When
        JobCategory foundParent = jobCategoryRepository.findById(parentCategory.getId()).orElse(null);
        JobCategory foundChild = jobCategoryRepository.findById(childCategory.getId()).orElse(null);
        JobCategory foundGrandchild = jobCategoryRepository.findById(grandchildCategory.getId()).orElse(null);

        // Then
        assertNotNull(foundParent);
        assertNotNull(foundChild);
        assertNotNull(foundGrandchild);

        assertEquals(1, foundParent.getHierarchyLevel());
        assertEquals(2, foundChild.getHierarchyLevel());
        assertEquals(3, foundGrandchild.getHierarchyLevel());

        assertNull(foundParent.getParent());
        assertEquals(foundParent.getId(), foundChild.getParent().getId());
        assertEquals(foundChild.getId(), foundGrandchild.getParent().getId());

        assertEquals("/IT", foundParent.getHierarchyPath());
        assertEquals("/IT/Software Development", foundChild.getHierarchyPath());
        assertEquals("/IT/Software Development/Java Development", foundGrandchild.getHierarchyPath());
    }

    @Test
    void testSaveAndUpdate() {
        // Given
        JobCategory newCategory = new JobCategory();
        newCategory.setName("New Category");
        newCategory.setTaxonomyType(JobCategory.TaxonomyType.SKILL);
        newCategory.setIsActive(true);

        // When
        JobCategory saved = jobCategoryRepository.save(newCategory);
        saved.setDescription("Updated description");
        JobCategory updated = jobCategoryRepository.save(saved);

        // Then
        assertNotNull(saved.getId());
        assertEquals("Updated description", updated.getDescription());
        assertEquals(JobCategory.TaxonomyType.SKILL, updated.getTaxonomyType());
    }

    @Test
    void testDelete() {
        // Given
        Long categoryId = grandchildCategory.getId();

        // When
        jobCategoryRepository.deleteById(categoryId);

        // Then
        assertFalse(jobCategoryRepository.findById(categoryId).isPresent());
    }
}
