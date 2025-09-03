package se.stegroo.backend.repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import se.stegroo.backend.model.Skill;

import java.util.List;
import java.util.Optional;
import java.util.Set;

/**
 * Repository för kompetenser.
 */
@Repository
public interface SkillRepository extends JpaRepository<Skill, Long> {

    /**
     * Hitta en kompetens baserat på namn
     */
    Optional<Skill> findByName(String name);

    /**
     * Hitta en kompetens baserat på externt ID (från Arbetsförmedlingen)
     */
    Optional<Skill> findByExternalId(String externalId);

    /**
     * Hitta kompetenser baserat på namnmatchning
     */
    List<Skill> findByNameContainingIgnoreCase(String name);

    /**
     * Hitta kompetenser baserat på namn
     */
    List<Skill> findByNameIn(Set<String> names);

    /**
     * Hitta aktiva kompetenser
     */
    List<Skill> findByIsActiveTrue();

    /**
     * Hitta kompetenser baserat på taxonomi-typ
     */
    List<Skill> findByTaxonomyType(Skill.SkillTaxonomyType taxonomyType);

    /**
     * Hitta kompetenser baserat på nivå
     */
    List<Skill> findBySkillLevel(Skill.SkillLevel skillLevel);

    /**
     * Hitta kompetenser som används i ett visst jobb
     */
    @Query("SELECT s FROM Skill s JOIN s.jobs j WHERE j.id = :jobId")
    List<Skill> findByJobId(@Param("jobId") Long jobId);

    /**
     * Hitta kompetenser som används av en viss användare
     */
    @Query("SELECT s FROM Skill s JOIN s.users u WHERE u.id = :userId")
    List<Skill> findByUserId(@Param("userId") Long userId);

    /**
     * Hitta de mest populära kompetenserna (baserat på antal jobb)
     */
    @Query("SELECT s, COUNT(j) as jobCount FROM Skill s JOIN s.jobs j GROUP BY s.id ORDER BY jobCount DESC")
    List<Skill> findMostPopularSkills(Pageable pageable);

    /**
     * Hitta populära kompetenser baserat på antal jobb
     */
    @Query("SELECT s FROM Skill s " +
           "LEFT JOIN s.jobs j " +
           "WHERE s.isActive = true " +
           "GROUP BY s.id " +
           "ORDER BY COUNT(j.id) DESC " +
           "LIMIT :limit")
    List<Skill> findPopularSkills(@Param("limit") int limit);

    /**
     * Hitta kompetenser som behöver synkroniseras
     */
    @Query("SELECT s FROM Skill s WHERE s.lastSyncAt IS NULL OR s.lastSyncAt < :cutoff")
    List<Skill> findStaleSkills(java.time.LocalDateTime cutoff);
}
