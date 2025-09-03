package se.stegroo.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import se.stegroo.backend.model.JobCategory;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository för jobbkategorier.
 */
@Repository
public interface JobCategoryRepository extends JpaRepository<JobCategory, Long> {

    /**
     * Hitta en kategori baserat på externt ID (från Arbetsförmedlingen)
     */
    Optional<JobCategory> findByExternalId(String externalId);

    /**
     * Hitta en kategori baserat på namn
     */
    Optional<JobCategory> findByName(String name);

    /**
     * Hitta en kategori baserat på namn och taxonomi-typ
     */
    Optional<JobCategory> findByNameAndTaxonomyType(String name, JobCategory.TaxonomyType taxonomyType);

    /**
     * Hitta alla kategorier av en specifik taxonomi-typ
     */
    List<JobCategory> findByTaxonomyType(JobCategory.TaxonomyType taxonomyType);

    /**
     * Hitta alla aktiva kategorier
     */
    List<JobCategory> findByIsActiveTrue();

    /**
     * Hitta kategorier som behöver synkroniseras
     */
    List<JobCategory> findByLastSyncAtBeforeOrLastSyncAtIsNull(LocalDateTime before);

    /**
     * Hitta alla toppnivåkategorier (de utan förälder)
     */
    List<JobCategory> findByParentIsNull();

    /**
     * Hitta alla underkategorier för en given förälderkategori
     */
    List<JobCategory> findByParentId(Long parentId);

    /**
     * Hitta alla kategorier sorterade hierarkiskt
     */
    @Query("SELECT c FROM JobCategory c LEFT JOIN FETCH c.parent ORDER BY CASE WHEN c.parent IS NULL THEN 0 ELSE 1 END, c.name")
    List<JobCategory> findAllSortedHierarchically();

    /**
     * Hitta kategorier baserat på hierarkinivå
     */
    List<JobCategory> findByHierarchyLevel(Integer hierarchyLevel);

    /**
     * Hitta kategorier baserat på hierarkisökväg
     */
    @Query("SELECT c FROM JobCategory c WHERE c.hierarchyPath LIKE %:path%")
    List<JobCategory> findByHierarchyPathContaining(String path);

    /**
     * Hitta kategorier som inte har synkroniserats på en viss tid
     */
    @Query("SELECT c FROM JobCategory c WHERE c.lastSyncAt IS NULL OR c.lastSyncAt < :cutoff")
    List<JobCategory> findStaleCategories(LocalDateTime cutoff);

    /**
     * Hitta populära kategorier baserat på antal jobb
     */
    @Query("SELECT c FROM JobCategory c " +
           "LEFT JOIN c.jobs j " +
           "WHERE c.isActive = true " +
           "GROUP BY c.id " +
           "ORDER BY COUNT(j.id) DESC " +
           "LIMIT :limit")
    List<JobCategory> findPopularCategories(@Param("limit") int limit);
}
