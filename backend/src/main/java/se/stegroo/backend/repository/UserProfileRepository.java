package se.stegroo.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import se.stegroo.backend.model.UserProfile;

import java.util.List;
import java.util.Optional;

/**
 * Repository för användarprofiler.
 */
@Repository
public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {

    /**
     * Hitta en användare baserat på användar-ID från Supabase
     */
    Optional<UserProfile> findByUserId(String userId);

    /**
     * Hitta användare baserat på kontotyp
     */
    List<UserProfile> findByAccountType(String accountType);

    /**
     * Hitta användare baserat på företagsnamn
     */
    List<UserProfile> findByCompanyNameContainingIgnoreCase(String companyName);

    /**
     * Hitta användare baserat på plats
     */
    List<UserProfile> findByLocationContainingIgnoreCase(String location);

    /**
     * Hitta användare som har sparat ett visst jobb
     */
    @Query("SELECT u FROM UserProfile u JOIN u.savedJobs j WHERE j.id = :jobId")
    List<UserProfile> findBySavedJobId(@Param("jobId") Long jobId);

    /**
     * Hitta användare som har en viss kompetens
     */
    @Query("SELECT u FROM UserProfile u JOIN u.skills s WHERE s.id = :skillId")
    List<UserProfile> findBySkillId(@Param("skillId") Long skillId);

    /**
     * Hitta användare som har flera specifika kompetenser
     */
    @Query("SELECT u FROM UserProfile u JOIN u.skills s WHERE s.id IN :skillIds GROUP BY u.id HAVING COUNT(DISTINCT s.id) = :skillCount")
    List<UserProfile> findBySkillIds(@Param("skillIds") List<Long> skillIds, @Param("skillCount") long skillCount);
}
