package se.stegroo.backend.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

/**
 * Entitet som representerar en kompetens/färdighet.
 * Används för att koppla kompetenser till jobb och användare.
 * Stöder taxonomi-synkronisering med Arbetsförmedlingens system.
 */
@Entity
@Table(name = "skills")
public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(length = 1000)
    private String description;

    /**
     * Extern ID från Arbetsförmedlingens taxonomi
     */
    @Column(name = "external_id")
    private String externalId;

    /**
     * Legacy AMS taxonomy ID för bakåtkompatibilitet
     */
    @Column(name = "legacy_ams_taxonomy_id")
    private String legacyAmsTaxonomyId;

    /**
     * Taxonomi-typ (skill, competence, language, etc.)
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "taxonomy_type")
    private SkillTaxonomyType taxonomyType = SkillTaxonomyType.SKILL;

    /**
     * Kompetensnivå (beginner, intermediate, advanced, expert)
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "skill_level")
    private SkillLevel skillLevel = SkillLevel.INTERMEDIATE;

    /**
     * Om kompetensen är aktiv (false = inaktiverad/ersatt)
     */
    @Column(name = "is_active")
    private Boolean isActive = true;

    /**
     * Senaste synkronisering med extern taxonomi
     */
    @Column(name = "last_sync_at")
    private LocalDateTime lastSyncAt;

    /**
     * Jobb som kräver denna kompetens
     */
    @ManyToMany(mappedBy = "skills")
    private Set<JobListing> jobs = new HashSet<>();

    /**
     * Användare som har denna kompetens
     */
    @ManyToMany(mappedBy = "skills")
    private Set<UserProfile> users = new HashSet<>();
    
    /**
     * Datum när kompetensen skapades i systemet
     */
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    /**
     * Datum när kompetensen senast uppdaterades
     */
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    /**
     * Enum för olika typer av kompetenser
     */
    public enum SkillTaxonomyType {
        SKILL,          // Tekniska färdigheter
        COMPETENCE,     // Generella kompetenser
        LANGUAGE,       // Språkkunskaper
        CERTIFICATION,  // Certifieringar
        EDUCATION,      // Utbildningsnivå
        EXPERIENCE      // Erfarenhet
    }

    /**
     * Enum för kompetensnivåer
     */
    public enum SkillLevel {
        BEGINNER,       // Nybörjare
        INTERMEDIATE,   // Mellannivå
        ADVANCED,       // Avancerad
        EXPERT          // Expert
    }
    
    public Skill() {
    }
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getExternalId() {
        return externalId;
    }
    
    public void setExternalId(String externalId) {
        this.externalId = externalId;
    }

    public String getLegacyAmsTaxonomyId() {
        return legacyAmsTaxonomyId;
    }

    public void setLegacyAmsTaxonomyId(String legacyAmsTaxonomyId) {
        this.legacyAmsTaxonomyId = legacyAmsTaxonomyId;
    }

    public SkillTaxonomyType getTaxonomyType() {
        return taxonomyType;
    }

    public void setTaxonomyType(SkillTaxonomyType taxonomyType) {
        this.taxonomyType = taxonomyType;
    }

    public SkillLevel getSkillLevel() {
        return skillLevel;
    }

    public void setSkillLevel(SkillLevel skillLevel) {
        this.skillLevel = skillLevel;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public LocalDateTime getLastSyncAt() {
        return lastSyncAt;
    }

    public void setLastSyncAt(LocalDateTime lastSyncAt) {
        this.lastSyncAt = lastSyncAt;
    }
    
    public Set<JobListing> getJobs() {
        return jobs;
    }
    
    public void setJobs(Set<JobListing> jobs) {
        this.jobs = jobs;
    }
    
    public Set<UserProfile> getUsers() {
        return users;
    }
    
    public void setUsers(Set<UserProfile> users) {
        this.users = users;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    /**
     * Uppdaterar synkroniseringsinformation
     */
    public void updateSyncInfo() {
        this.lastSyncAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * Kontrollerar om kompetensen behöver synkroniseras
     */
    public boolean needsSync() {
        return this.lastSyncAt == null || 
               this.lastSyncAt.isBefore(LocalDateTime.now().minusDays(1));
    }

    /**
     * Kontrollerar om kompetensen är på expertnivå
     */
    public boolean isExpertLevel() {
        return this.skillLevel == SkillLevel.EXPERT;
    }

    /**
     * Kontrollerar om kompetensen är på nybörjarnivå
     */
    public boolean isBeginnerLevel() {
        return this.skillLevel == SkillLevel.BEGINNER;
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Skill skill = (Skill) o;
        return Objects.equals(id, skill.id);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
