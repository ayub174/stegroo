package se.stegroo.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.QueryHints;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import se.stegroo.backend.model.JobListing;

import jakarta.persistence.QueryHint;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;

/**
 * Repository för jobbannonser.
 */
@Repository
public interface JobListingRepository extends JpaRepository<JobListing, Long>, JpaSpecificationExecutor<JobListing> {

    /**
     * Hitta en jobbannons baserat på externt ID (från Arbetsförmedlingen)
     */
    Optional<JobListing> findByExternalId(String externalId);

    /**
     * Hitta jobbannonser baserat på kategori
     */
    Page<JobListing> findByCategoryId(Long categoryId, Pageable pageable);

    /**
     * Hitta jobbannonser baserat på plats
     */
    Page<JobListing> findByLocationContainingIgnoreCase(String location, Pageable pageable);

    /**
     * Hitta jobbannonser baserat på företag
     */
    Page<JobListing> findByCompanyNameContainingIgnoreCase(String companyName, Pageable pageable);

    /**
     * Hitta jobbannonser baserat på titel eller beskrivning
     */
    @Query("SELECT j FROM JobListing j WHERE " +
           "LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(j.description) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<JobListing> findByTitleOrDescriptionContaining(@Param("keyword") String keyword, Pageable pageable);

    /**
     * Avancerad sökning med flera parametrar
     */
    @Query("SELECT j FROM JobListing j WHERE " +
           "(:keyword IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(j.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:categoryId IS NULL OR j.category.id = :categoryId) AND " +
           "(:location IS NULL OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:companyName IS NULL OR LOWER(j.companyName) LIKE LOWER(CONCAT('%', :companyName, '%'))) AND " +
           "(:employmentType IS NULL OR j.employmentType = :employmentType)")
    Page<JobListing> search(
            @Param("keyword") String keyword,
            @Param("categoryId") Long categoryId,
            @Param("location") String location,
            @Param("companyName") String companyName,
            @Param("employmentType") String employmentType,
            Pageable pageable);

    /**
     * Hitta jobb baserat på status
     */
    List<JobListing> findByStatus(JobListing.Status status);

    /**
     * Räkna jobb baserat på status
     */
    long countByStatus(JobListing.Status status);

    /**
     * Hitta jobb med specifika kompetenser och status
     */
    @Query("SELECT DISTINCT j FROM JobListing j JOIN j.skills s WHERE s.id IN :skillIds AND j.status = :status")
    List<JobListing> findBySkillsIdInAndStatus(@Param("skillIds") Set<Long> skillIds, @Param("status") JobListing.Status status);

    /**
     * Hitta jobb inom specifika kategorier och status
     */
    @Query("SELECT j FROM JobListing j WHERE j.category.id IN :categoryIds AND j.status = :status")
    List<JobListing> findByCategoryIdInAndStatus(@Param("categoryIds") Set<Long> categoryIds, @Param("status") JobListing.Status status);

    /**
     * Hitta liknande jobb baserat på kategori och kompetenser
     */
        @Query("""
        SELECT j FROM JobListing j
        WHERE j.category.id = :categoryId
        AND j.id != :excludeJobId
        AND j.status = 'ACTIVE'
        ORDER BY (
            SELECT COUNT(s) FROM j.skills s WHERE s.id IN :skillIds
        ) DESC, j.createdAt DESC
        LIMIT :limit
        """)
    @QueryHints(@QueryHint(name = org.hibernate.annotations.QueryHints.FETCH_SIZE, value = "50"))
    List<JobListing> findSimilarJobs(
            @Param("categoryId") Long categoryId,
            @Param("skillIds") Set<Long> skillIds,
            @Param("excludeJobId") Long excludeJobId,
            @Param("limit") int limit);

    /**
     * Hitta jobb skapade efter ett visst datum
     */
    List<JobListing> findByCreatedAtAfter(LocalDateTime date);

    /**
     * Hitta jobb uppdaterade efter ett visst datum
     */
    List<JobListing> findByLastModifiedAfter(LocalDateTime date);

    /**
     * Hitta jobb baserat på anställningstyp
     */
    List<JobListing> findByEmploymentType(String employmentType);

    /**
     * Hitta jobb baserat på arbetstid
     */
    List<JobListing> findByWorkingHoursType(String workingHoursType);



    /**
     * Hitta jobb i en specifik plats
     */
    @Query("SELECT j FROM JobListing j WHERE " +
           "LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%')) " +
           "AND j.status = 'ACTIVE'")
    List<JobListing> findByLocationContaining(@Param("location") String location);

    /**
     * Hitta jobb med fulltext-sökning
     */
    @Query("SELECT j FROM JobListing j WHERE " +
           "(LOWER(j.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(j.description) LIKE LOWER(CONCAT('%', :query, '%'))) " +
           "AND j.status = 'ACTIVE'")
    List<JobListing> findByFullTextSearch(@Param("query") String query);



    /**
     * Hitta jobb som behöver uppdateras (baserat på lastModified)
     */
    @Query("SELECT j FROM JobListing j WHERE j.lastModified < :cutoffDate OR j.lastModified IS NULL")
    List<JobListing> findJobsNeedingUpdate(@Param("cutoffDate") LocalDateTime cutoffDate);

    /**
     * Hitta utgångna jobb
     */
    @Query("SELECT j FROM JobListing j WHERE j.deadline < :now AND j.status = 'ACTIVE'")
    List<JobListing> findExpiredJobs(@Param("now") LocalDateTime now);

    /**
     * Hitta jobb från en specifik källa
     */
    List<JobListing> findBySource(String source);



    /**
     * Hitta jobb från en specifik arbetsgivare
     */
    @Query("SELECT j FROM JobListing j WHERE LOWER(j.companyName) LIKE LOWER(CONCAT('%', :companyName, '%')) AND j.status = 'ACTIVE'")
    List<JobListing> findByCompanyNameContaining(@Param("companyName") String companyName);

    /**
     * Hitta jobb baserat på kompetens
     */
    @Query("SELECT j FROM JobListing j JOIN j.skills s WHERE s.id = :skillId")
    Page<JobListing> findBySkillId(@Param("skillId") Long skillId, Pageable pageable);

    /**
     * Hitta jobb baserat på flera kompetenser
     */
    @Query("SELECT j FROM JobListing j JOIN j.skills s WHERE s.id IN :skillIds GROUP BY j.id HAVING COUNT(DISTINCT s.id) = :skillCount")
    Page<JobListing> findBySkillIds(@Param("skillIds") List<Long> skillIds, @Param("skillCount") long skillCount, Pageable pageable);
}
