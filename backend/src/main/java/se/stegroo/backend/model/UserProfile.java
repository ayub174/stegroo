package se.stegroo.backend.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

/**
 * Entitet som representerar en användarprofil.
 * Kopplar till Supabase auth.users via userId.
 */
@Entity
@Table(name = "user_profiles")
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * ID från Supabase auth.users
     */
    @Column(name = "user_id", nullable = false, unique = true)
    private String userId;

    @Column(name = "display_name")
    private String displayName;

    @Column(length = 1000)
    private String bio;

    @Column
    private String location;

    /**
     * Typ av konto: "private" eller "business"
     */
    @Column(name = "account_type")
    private String accountType;

    /**
     * Företagsnamn (för företagskonton)
     */
    @Column(name = "company_name")
    private String companyName;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    /**
     * Kompetenser som användaren har
     */
    @ManyToMany
    @JoinTable(
        name = "user_skills",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "skill_id")
    )
    private Set<Skill> skills = new HashSet<>();

    /**
     * Jobb som användaren har sparat
     */
    @ManyToMany
    @JoinTable(
        name = "saved_jobs",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "job_id")
    )
    private Set<JobListing> savedJobs = new HashSet<>();
    
    public UserProfile() {
    }
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getUserId() {
        return userId;
    }
    
    public void setUserId(String userId) {
        this.userId = userId;
    }
    
    public String getDisplayName() {
        return displayName;
    }
    
    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }
    
    public String getBio() {
        return bio;
    }
    
    public void setBio(String bio) {
        this.bio = bio;
    }
    
    public String getLocation() {
        return location;
    }
    
    public void setLocation(String location) {
        this.location = location;
    }
    
    public String getAccountType() {
        return accountType;
    }
    
    public void setAccountType(String accountType) {
        this.accountType = accountType;
    }
    
    public String getCompanyName() {
        return companyName;
    }
    
    public void setCompanyName(String companyName) {
        this.companyName = companyName;
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
    
    public Set<Skill> getSkills() {
        return skills;
    }
    
    public void setSkills(Set<Skill> skills) {
        this.skills = skills;
    }
    
    public Set<JobListing> getSavedJobs() {
        return savedJobs;
    }
    
    public void setSavedJobs(Set<JobListing> savedJobs) {
        this.savedJobs = savedJobs;
    }

    /**
     * Lägg till en kompetens till användaren
     */
    public void addSkill(Skill skill) {
        skills.add(skill);
        skill.getUsers().add(this);
    }

    /**
     * Ta bort en kompetens från användaren
     */
    public void removeSkill(Skill skill) {
        skills.remove(skill);
        skill.getUsers().remove(this);
    }

    /**
     * Spara ett jobb
     */
    public void saveJob(JobListing job) {
        savedJobs.add(job);
        job.getSavedByUsers().add(this);
    }

    /**
     * Ta bort ett sparat jobb
     */
    public void unsaveJob(JobListing job) {
        savedJobs.remove(job);
        job.getSavedByUsers().remove(this);
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserProfile that = (UserProfile) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
