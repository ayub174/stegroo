package se.stegroo.backend.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

/**
 * Entitet som representerar en jobbannons.
 */
@Entity
@Table(name = "job_listings")
public class JobListing {

    public enum Status {
        ACTIVE,
        EXPIRED,
        REMOVED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 10000)
    private String description;

    @Column(name = "company_name")
    private String companyName;

    @Column
    private String location;

    /**
     * ID från extern källa (t.ex. Arbetsförmedlingen)
     */
    @Column(name = "external_id", unique = true)
    private String externalId;

    /**
     * URL till originalannonsen
     */
    @Column(name = "external_url")
    private String externalUrl;

    /**
     * Källan för jobbannonsen (t.ex. "arbetsformedlingen", "direct")
     */
    @Column
    private String source;

    /**
     * Typ av anställning (t.ex. "Heltid", "Deltid")
     */
    @Column(name = "employment_type")
    private String employmentType;

    /**
     * Omfattning/arbets tidstyp (t.ex. "Heltid", "Deltid")
     */
    @Column(name = "working_hours_type")
    private String workingHoursType;

    /**
     * Datum när annonsen publicerades
     */
    @Column(name = "published_at")
    private LocalDateTime publishedAt;

    /**
     * Sista ansökningsdatum
     */
    @Column
    private LocalDateTime deadline;

    /**
     * Status för annonsens livscykel
     */
    @Enumerated(EnumType.STRING)
    @Column
    private Status status = Status.ACTIVE;

    /**
     * Datum när annonsen togs bort (om tillämpligt)
     */
    @Column(name = "removed_at")
    private LocalDateTime removedAt;

    /**
     * Datum när annonsen senast ändrades
     */
    @Column(name = "last_modified")
    private LocalDateTime lastModified;

    /**
     * Datum när annonsen skapades i vårt system
     */
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    /**
     * Datum när annonsen senast uppdaterades i vårt system
     */
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    /**
     * Kategori för jobbet
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private JobCategory category;

    /**
     * Kompetenser som krävs för jobbet
     */
    @ManyToMany
    @JoinTable(
        name = "job_skills",
        joinColumns = @JoinColumn(name = "job_id"),
        inverseJoinColumns = @JoinColumn(name = "skill_id")
    )
    private Set<Skill> skills = new HashSet<>();

    /**
     * Användare som sparat detta jobb
     */
    @ManyToMany(mappedBy = "savedJobs")
    private Set<UserProfile> savedByUsers = new HashSet<>();

    /**
     * Rådata från käll-API:t (JSON), lagras för felsökning/future mapping
     */
    @Lob
    @Column(name = "raw", columnDefinition = "CLOB")
    private String raw;
    
    public JobListing() {
    }
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getCompanyName() {
        return companyName;
    }
    
    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }
    
    public String getLocation() {
        return location;
    }
    
    public void setLocation(String location) {
        this.location = location;
    }
    
    public String getExternalId() {
        return externalId;
    }
    
    public void setExternalId(String externalId) {
        this.externalId = externalId;
    }
    
    public String getExternalUrl() {
        return externalUrl;
    }
    
    public void setExternalUrl(String externalUrl) {
        this.externalUrl = externalUrl;
    }
    
    public String getSource() {
        return source;
    }
    
    public void setSource(String source) {
        this.source = source;
    }
    
    public String getEmploymentType() {
        return employmentType;
    }
    
    public void setEmploymentType(String employmentType) {
        this.employmentType = employmentType;
    }

    public String getWorkingHoursType() {
        return workingHoursType;
    }

    public void setWorkingHoursType(String workingHoursType) {
        this.workingHoursType = workingHoursType;
    }
    
    public LocalDateTime getPublishedAt() {
        return publishedAt;
    }
    
    public void setPublishedAt(LocalDateTime publishedAt) {
        this.publishedAt = publishedAt;
    }
    
    public LocalDateTime getDeadline() {
        return deadline;
    }
    
    public void setDeadline(LocalDateTime deadline) {
        this.deadline = deadline;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public LocalDateTime getRemovedAt() {
        return removedAt;
    }

    public void setRemovedAt(LocalDateTime removedAt) {
        this.removedAt = removedAt;
    }
    
    public LocalDateTime getLastModified() {
        return lastModified;
    }
    
    public void setLastModified(LocalDateTime lastModified) {
        this.lastModified = lastModified;
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
    
    public JobCategory getCategory() {
        return category;
    }
    
    public void setCategory(JobCategory category) {
        this.category = category;
        if (category != null) {
            category.getJobs().add(this);
        }
    }
    
    public Set<Skill> getSkills() {
        return skills;
    }
    
    public void setSkills(Set<Skill> skills) {
        this.skills = skills;
    }
    
    public Set<UserProfile> getSavedByUsers() {
        return savedByUsers;
    }
    
    public void setSavedByUsers(Set<UserProfile> savedByUsers) {
        this.savedByUsers = savedByUsers;
    }

    public String getRaw() {
        return raw;
    }

    public void setRaw(String raw) {
        this.raw = raw;
    }

    /**
     * Lägg till en kompetens till jobbet
     */
    public void addSkill(Skill skill) {
        skills.add(skill);
        skill.getJobs().add(this);
    }

    /**
     * Ta bort en kompetens från jobbet
     */
    public void removeSkill(Skill skill) {
        skills.remove(skill);
        skill.getJobs().remove(this);
    }
    
    /**
     * Lägg till en användare som har sparat detta jobb
     */
    public void addSavedByUser(UserProfile user) {
        savedByUsers.add(user);
    }
    
    /**
     * Ta bort en användare som har sparat detta jobb
     */
    public void removeSavedByUser(UserProfile user) {
        savedByUsers.remove(user);
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        JobListing that = (JobListing) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
